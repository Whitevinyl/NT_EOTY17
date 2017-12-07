
var mouseXNorm = 0;
var mouseYNorm = 0;
var scrolled = 0;
var packshotFocusTimer = null;
var scrollPerc = 0;
var scrollFocus = 0;
var scrollOrigin = 0;
var scrollTimer = null;



//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

function setupInteraction() {

    // ADD INTERACTION EVENTS TO THE CANVAS //
    window.addEventListener("mousedown", mousePress, false);
    canvas.addEventListener("mouseup", mouseRelease, false);
    window.addEventListener("mousemove", mouseMove, false);
    //window.addEventListener('scroll', scrollEvent, false);
    window.onbeforeunload = function() {window.scrollTo(0,0);}

    $(page).scroll(pageScroll);
    $(project).scroll(projectScroll);
    $(indexOpen).click(toggleIndex);
    $(indexClose).click(toggleIndex);
    $(projectClose).click(toggleProject);
    $(projectArtists).click(toggleProject);
    $(nextProject).click(gotoNextProject);


    $(document.getElementById('test-index-link')).click(loadFromIndex);

    pageScroll();
}


//-------------------------------------------------------------------------------------------
//  MOUSE EVENTS
//-------------------------------------------------------------------------------------------


// PRESS //
function mousePress() {
    mouseIsDown = true;
    rolloverCheck();

    if (txt && !projectOpen && currentScrollFocus > 0 && txt.roll) loadProject(currentScrollFocus-1);
}


// RELEASE //
function mouseRelease() {
    mouseIsDown = false;
}


// MOVE //
function mouseMove(event) {
    /*mouseX = event.pageX * ratio;
    mouseY = event.pageY * ratio;*/
    mouseX = event.clientX * ratio;
    mouseY = event.clientY * ratio;
    rolloverCheck();

    var cx = (width / 2);
    var cy = (height / 2);


    var g = 1;
    var xDist = mouseX - cx;
    var xStrength = g / (xDist);
    var yDist = mouseY - cy;
    var yStrength = g / (yDist);


    mouseXNorm = (mouseX - cx) / cx;
    mouseYNorm = (mouseY - cy) / cy;

    if (!projectOpen) {
        canvas.style.transform = 'rotateY(' + (-mouseXNorm * 5) + 'deg)';
    }

    mouseXNorm *= Math.abs(mouseXNorm);
    mouseYNorm *= Math.abs(mouseYNorm);

    //scrolled = window.pageYOffset / 2000;

    /*mouseXNorm = logPosition(-1,1,1,3, mouseXNorm + 2);
    mouseYNorm = logPosition(-1,1,1,3, mouseYNorm + 2);

    mouseXNorm = xStrength;
    mouseYNorm = yStrength;*/

    /*mouseXNorm -= 1;
    mouseYNorm -= 1;*/

    if (logo && !projectOpen && currentScrollFocus === 0) logo.hitTest();
    if (txt && !projectOpen && currentScrollFocus > 0) txt.hitTest();
}


function rolloverCheck() {
    var test = hitBox(0, 0, width, height);
}

function pageScroll(){
    scrollPos = page.scrollTop;
    scrollFocus = scrollPos - scrollOrigin;
    scrolled = 0.03 + (scrollPos / 1500);


    updatePercentBar();


    // TODO: count the amount past 100% and jup appropriately //
    if (scrollPerc > 100) {
        scrollOrigin += targetHeight;
        updatePercentBar();
        currentScrollFocus ++;
        scrollLoop();
        resetTxt();
        glitch.chance = 70;
        xOff(1);
    }
    if (scrollPerc < 0) {
        currentScrollFocus --;
        updatePercentBar();
        scrollOrigin -= targetHeight;
        resetTxt();
        glitch.chance = 70;
        xOff(-1);
    }

    introAnim();

    // AT THE END OF CONTINUOUS RESIZING //
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
        resetScroll();
    },50);
}

function resetScroll() {
    var dest = scrollOrigin + (targetHeight / 2);
    if (currentScrollFocus===0) {
        dest = 0;
    }
    page.scroll({
        top: dest,
        left: 0,
        behavior: 'smooth'
    });
    percentBarTopWrap.style.opacity = '0';
    percentBarBottomWrap.style.opacity = '0';
}

function scrollLoop() {
    if (currentScrollFocus > data.projects.length) {
        currentScrollFocus = 1;
        scrollOrigin = introScroll;
        page.scrollTop = scrollOrigin;
    }
}

function xOff(dir) {

    percentBarTopWrap.classList.add('no-transition');
    percentBarTopWrap.style.opacity = '0';
    percentBarTopWrap.offsetHeight;
    percentBarTopWrap.classList.remove('no-transition');

    percentBarBottomWrap.classList.add('no-transition');
    percentBarBottomWrap.style.opacity = '0';
    percentBarBottomWrap.offsetHeight;
    percentBarBottomWrap.classList.remove('no-transition');


    if (currentScrollFocus===0) {
        logo.yOff = (height * 0.1) * dir;
        //logo.xOff = (width * 0.2) * dir;
        page.scrollTop = 0;
    } else {
        txt.yOff = (height * 0.1) * dir;
        //txt.xOff = (width * 0.2) * dir;
    }
}

function updatePercentBar() {
    targetHeight = txtScroll;
    if (currentScrollFocus===0) targetHeight = introScroll;

    if (percentBarTop) {
        scrollPerc = (scrollFocus / targetHeight) * 100;
        var scrollPercVis = scrollPerc;
        if (scrollPercVis > 100) scrollPercVis = 100;
        //percentBar.style.width = '' + scrollPerc + '%';

        if (currentScrollFocus > 0) {
            if (scrollPerc < 50) {
                percentBarBottom.style.height = '0';
                percentBarTop.style.height = '' + (100 - (scrollPercVis * 2)) + '%';
                percentBarBottomWrap.style.opacity = '0';
                percentBarTopWrap.style.opacity = '1';
            }
            else if (scrollPerc > 50) {
                percentBarTop.style.height = '0';
                percentBarBottom.style.height = '' + ((scrollPercVis * 2) - 100) + '%';
                percentBarTopWrap.style.opacity = '0';
                percentBarBottomWrap.style.opacity = '1';

            }
        }
        else {
            percentBarTop.style.height = '0';
            percentBarBottom.style.height = '' + scrollPercVis + '%';
            percentBarTopWrap.style.opacity = '0';
            percentBarBottomWrap.style.opacity = '1';
        }

    }
}

// DEFER THIS!! //
function introAnim() {
    if (scrollPos > 20) {
        introBlock.classList.add('out');
        percentBarContainer.classList.remove('in');
    } else {
        introBlock.classList.remove('out');
        percentBarContainer.classList.add('in');
    }
}


function projectScroll() {
    var pos = Math.round(project.scrollTop);
    projectAnim(pos);
}


// DEFER THIS!! //
function projectAnim(pos) {

    var pastHeader = pos > 200;
    var pastIntro = projectCopy.getBoundingClientRect().top <= (window.innerHeight * 0.65);

    if (pastHeader) {
        packshotWrap.classList.remove('in');
    } else {
        packshotWrap.classList.add('in');
    }

    if (pastIntro){
        packshotWrap.classList.add('out');
    } else {
        packshotWrap.classList.remove('out');
    }

    if (pastHeader && !pastIntro) {
        if (packshot) packshot.activate();
    } else {
        if (packshot) packshot.deactivate();
    }

    var l = reveal.length;
    for (var i=(l-1); i>=0; i--) {
        if(reveal[i].getBoundingClientRect().top <= (window.innerHeight * 0.75)){
            reveal[i].classList.remove('c-hidden');
        }
    }
}


function toggleIndex() {
    /*canvas.classList.toggle('no-transition');*/
    page.classList.toggle('no-transition');
    index.classList.toggle('open');
}

function toggleProject() {
    project.classList.toggle('open');
    page.classList.toggle('no-transition');
    projectOpen = !projectOpen;
}

function loadFromIndex() {
    var ind = parseInt(this.getAttribute('data-index'));
    loadProject(ind);
}

function gotoNextProject() {
    currentProject ++;
    if (currentProject >= data.projects.length) currentProject = 0;

    loadProject(currentProject);
}
