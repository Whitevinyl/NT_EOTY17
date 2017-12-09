
var mouseXNorm = 0;
var mouseYNorm = 0;
var packshotFocusTimer = null;
var scrollPerc = 0;
var scrollFocus = 0;
var scrollOrigin = 0;
var scrollTimer = null;
var scrollbarsVisible = true;
var scrollAdvance = true;
var lastScrollFocus = 0;



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
    $(projectAudio).click(toggleAudio);


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
    titleUnderline.classList.remove('roll');
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
    var yStrength = g / (yDist); // used?


    mouseXNorm = (mouseX - cx) / cx;
    mouseYNorm = (mouseY - cy) / cy;

    if (!projectOpen) {
        canvas.style.transform = 'rotateY(' + (-mouseXNorm * 6) + 'deg)';
    }
    if (projectOpen) {
        /*if (!packshotWrap.classList.contains('in') && !packshotWrap.classList.contains('out')) {
            canvas2.style.transform = 'rotateY(' + (-mouseXNorm * 5) + 'deg)';
        }*/
    }

    mouseXNorm *= Math.abs(mouseXNorm);
    mouseYNorm *= Math.abs(mouseYNorm);

    if (logo && !projectOpen && currentScrollFocus === 0) logo.hitTest();
    if (txt && !projectOpen && currentScrollFocus > 0) {
        txt.hitTest();
    }
    titleRollover();
}

function titleRollover() {
    if (txt && currentScrollFocus > 0 && txt.roll) {
        page.style.cursor = 'pointer';
        titleUnderline.classList.add('roll');
    } else {
        page.style.cursor = 'default';
        titleUnderline.classList.remove('roll');
    }
}

function rolloverCheck() {
    var test = hitBox(0, 0, width, height);
}




function pageScroll(){
    scrollPos = page.scrollTop;
    scrollFocus = scrollPos - scrollOrigin;


    updatePercentBar();
    if (currentScrollFocus < 1 && scrollPerc > 50) {
        glitch.chance = scrollPerc;
    }

    // TODO: count the amount past 100% and jump appropriately //
    /*if (scrollPerc > 100) {
        nextScrollFocus();
    }
    if (scrollPerc < 0) {
        prevScrollFocus();
    }*/

    scrollScene();

    if (glitch && glitch.chance > 220) glitch.chance = 220;

    introAnim();

    // AT THE END OF CONTINUOUS RESIZING //
    if (scrollAdvance) {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            resetScroll();
        },60);
    }
}


function scrollScene() {
    if (logo) {
        var projectNo = data.projects.length;
        var space = txtScroll;
        var backMult = -1;


        // get current //
        currentScrollFocus = Math.floor(page.scrollTop / space);

        // loop //
        if (currentScrollFocus > projectNo) {
            page.scrollTop = space;
            currentScrollFocus = 1;
            backMult = 1;
        }

        scrollOrigin = currentScrollFocus * space;

        // advance //
        if (currentScrollFocus > lastScrollFocus) {
            resetTxt();
            xOff(1);
        }
        // back //
        if (currentScrollFocus < lastScrollFocus) {
            resetTxt();
            xOff(backMult);
        }


        lastScrollFocus = currentScrollFocus;
    }

}


function nextScrollFocus() {
    if (scrollAdvance) {
        //if (currentScrollFocus > 0) {
            scrollOrigin += targetHeight;
            updatePercentBar();
            currentScrollFocus ++;
            scrollLoop();
            centerScroll();
            resetTxt();
            glitch.chance += 60;
            xOff(1);
        /*}

        else {
            //black.classList.remove('out');
            scrollAdvance = false;
            setTimeout(function() {
                //black.classList.add('out');
                scrollOrigin = introScroll;
                updatePercentBar();
                currentScrollFocus = 1;
                resetTxt();
                glitch.chance += 60;
                xOff(1);
                scrollAdvance = true;
                if (scrollTimer) clearTimeout(scrollTimer);
                scrollTimer = setTimeout(function() {
                    resetScroll();
                },60);
            },900);
        }*/
    }
}

function prevScrollFocus() {
    if (scrollAdvance) {
        currentScrollFocus --;
        updatePercentBar();
        scrollOrigin -= targetHeight;
        resetTxt();
        glitch.chance += 60;
        xOff(-1);
    }
}


function centerScroll() {
    page.scrollTop = scrollOrigin + (targetHeight * 0.05);
}

function resetScroll() {
    var dest = scrollOrigin + (targetHeight / 2);
    dest = (txtScroll * currentScrollFocus) + (txtScroll / 2);
    if (currentScrollFocus===0) {
        dest = 0;
    }
    page.scroll({
        top: dest,
        left: 0,
        behavior: 'smooth'
    });

    percentBarTopWrap.style.transitionDelay =  '0s';
    percentBarBottomWrap.style.transitionDelay =  '0s';
    percentBarTopWrap.style.opacity = '0';
    percentBarBottomWrap.style.opacity = '0';
    scrollbarsVisible = true;
}

function scrollLoop() {
    if (currentScrollFocus > data.projects.length) {
        currentScrollFocus = 1;
        scrollOrigin = introScroll;
        page.scrollTop = scrollOrigin;
    }
}

function xOff(dir) {
    titleRollover();
    scrollbarsVisible = false;
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
        page.scrollTop = 0;
    } else {
        txt.yOff = (height * 0.1) * dir;
        setTitleNumber();
    }
}


function setTitleNumber() {
    var num = currentScrollFocus;
    if (num < 10) num = '0' + num;
    titleNumber.innerHTML = '' + num;

    $(titleNumber).removeClass('in').width(); // reading width() forces reflow
    $(titleNumber).addClass('in');
}


function updatePercentBar() {
    if (currentScrollFocus < 0) currentScrollFocus = 0;
    targetHeight = txtScroll;
    if (currentScrollFocus===0) targetHeight = introScroll;

    if (percentBarTop) {
        scrollPerc = Math.round((scrollFocus / targetHeight) * 100);
        var scrollPercVis = scrollPerc;
        if (scrollPercVis > 100) scrollPercVis = 100;

        if (scrollbarsVisible) {
            if (currentScrollFocus > 0) {
                if (scrollPerc < 50) {
                    percentBarBottom.style.height = '0';
                    percentBarTop.style.height = '' + (100 - (scrollPercVis * 2)) + '%';
                    percentBarBottomWrap.style.transitionDelay =  '0s';
                    percentBarTopWrap.style.transitionDelay =  '0s';
                    percentBarBottomWrap.style.opacity = '0';
                    percentBarTopWrap.style.opacity = '1';
                }
                else if (scrollPerc > 50) {
                    percentBarTop.style.height = '0';
                    percentBarBottom.style.height = '' + ((scrollPercVis * 2) - 100) + '%';
                    percentBarTopWrap.style.transitionDelay =  '0s';
                    percentBarBottomWrap.style.transitionDelay =  '0s';
                    percentBarTopWrap.style.opacity = '0';
                    percentBarBottomWrap.style.opacity = '1';

                }
            }
            else {
                percentBarTop.style.height = '0';
                percentBarBottom.style.height = '' + scrollPercVis + '%';
                percentBarTopWrap.style.transitionDelay =  '0s';
                percentBarBottomWrap.style.transitionDelay =  '0s';
                percentBarTopWrap.style.opacity = '0';
                percentBarBottomWrap.style.opacity = '1';
            }
        }


    }
}

// DEFER THIS!! //
function introAnim() {
    if (scrollPos > 20) {
        introBlock.classList.add('out');
    } else {
        introBlock.classList.remove('out');
    }
    if (scrollPos > introScroll) {
        introBlock.classList.add('titles');
        ninja.classList.add('in');
    } else {
        introBlock.classList.remove('titles');
        ninja.classList.remove('in');
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
        //canvas2.setAttribute('style','');
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
    if (audioIsPlaying) {
        toggleAudio();
    }

    if (!projectOpen && currentScrollFocus < 1) ninja.classList.remove('in');
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


function toggleAudio() {
    if (audioIsPlaying) {
        audioObject.pause();
        audioObject.currentTime = 0;
        projectAudio.classList.remove('audio-playing');
        audioIsPlaying = false;
    }
    else {
        audioObject.play();
        projectAudio.classList.add('audio-playing');
        audioIsPlaying = true;
    }
}
