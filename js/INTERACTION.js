
var mouseXNorm = 0;
var mouseYNorm = 0;
var scrolled = 0;
var packshotFocusTimer = null;



//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

function setupInteraction() {

    // ADD INTERACTION EVENTS TO THE CANVAS //
    canvas.addEventListener("mousedown", mousePress, false);
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


    canvas.style.transform = 'rotateY(' + (-mouseXNorm * 5) + 'deg)';

    mouseXNorm *= Math.abs(mouseXNorm);
    mouseYNorm *= Math.abs(mouseYNorm);

    //scrolled = window.pageYOffset / 2000;

    /*mouseXNorm = logPosition(-1,1,1,3, mouseXNorm + 2);
    mouseYNorm = logPosition(-1,1,1,3, mouseYNorm + 2);

    mouseXNorm = xStrength;
    mouseYNorm = yStrength;*/

    /*mouseXNorm -= 1;
    mouseYNorm -= 1;*/
}


function rolloverCheck() {
    var test = hitBox(0, 0, width, height);
}

function pageScroll(){
    scrollPos = page.scrollTop;
    scrolled = 0.03 + (scrollPos / 1500);

    if (percentBar) {
        var scrollPerc = (scrollPos / (pageHeight - viewHeight)) * 100;
        percentBar.style.width = '' + scrollPerc + '%';
    }

    introAnim();
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
