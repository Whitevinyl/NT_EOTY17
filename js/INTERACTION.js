
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

var currentScene = 0;
var lastScene = 0;
var sceneTop = 0;
var sceneTransition = true;



//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

function setupInteraction() {

    // ADD INTERACTION EVENTS TO THE CANVAS //
    window.addEventListener("mousedown", mousePress, false);
    window.addEventListener("mouseup", mouseRelease, false);
    window.addEventListener("mousemove", mouseMove, false);

    // TOUCH //
    document.getElementById('intro-scroll-space').addEventListener('touchstart', function(event) {
        var touch = event.changedTouches[0];
        console.log('touch');
        var x = touch.clientX * ratio;
        var y = touch.clientY * ratio;
        if (
            !landingScreen &&
            x > (width * 0.1) &&
            x < (width * 0.9) &&
            y > (height * 0.3) &&
            y < (height * 0.6)
        ) {
            loadProject(currentScene-1);
        }
    }, false);

    window.onbeforeunload = function() {window.scrollTo(0,0);}

    $(page).scroll(pageScroll);
    $(project).scroll(projectScroll);
    $(explore).click(exploreScroll);
    $(indexOpen).click(toggleIndex);
    $(indexClose).click(toggleIndex);
    $(projectClose).click(toggleProject);
    $(projectArtists).click(toggleProject);
    $(nextProject).click(gotoNextProject);
    $(projectAudio).click(toggleAudio);


    pageScroll();
}


//-------------------------------------------------------------------------------------------
//  MOUSE EVENTS
//-------------------------------------------------------------------------------------------


// PRESS //
function mousePress(event) {
    mouseIsDown = true;
    this.mouseMove(event);

    if (txt && !projectOpen && !landingScreen) {
        txt.hitTest();
        if (txt.roll) loadProject(currentScene-1);
    }
    titleUnderline.classList.remove('roll');
}


// RELEASE //
function mouseRelease() {
    mouseIsDown = false;
}


// MOVE //
function mouseMove(event) {
    mouseX = event.clientX * ratio;
    mouseY = event.clientY * ratio;

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

    mouseXNorm *= Math.abs(mouseXNorm);
    mouseYNorm *= Math.abs(mouseYNorm);

    if (txt && !projectOpen && !landingScreen) txt.hitTest();
    titleRollover();
}

function titleRollover() {
    if (txt && !landingScreen && txt.roll) {
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
    scrollFocus = scrollPos - sceneTop;

    // PERCENT BAR INDICATOR //
    updatePercentBar();

    // CURRENT SCENE //
    calculateScene();

    // LANDING TRANSITIONS //
    introAnim();

    // AT THE END OF CONTINUOUS RESIZING //
    if (sceneTransition) {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            resetScroll();
        },60);
    }
}


function calculateScene() {
    if (sceneTransition) {
        var projectNo = data.projects.length;
        var space = txtScroll;
        var backMult = -1;


        // get current //
        currentScene = Math.floor(page.scrollTop / space);
        if (currentScene < 0) currentScene = 0;

        // loop //
        if (currentScene > projectNo) {
            page.scrollTop = space;
            currentScene = 1;
            backMult = 1;
        }

        // position of current scene //
        sceneTop = currentScene * space;

        // advance //
        if (currentScene > lastScene) {
            if (lastScene > 0) {
                resetTxt();
                hideScrollBars();
                xOff(1);
                addGlitch();
            }
            else {
                // FADE TO BLACK TRANSITION //
                sceneTransition = false;
                black.classList.remove('out');
                hideScrollBars();
                setTimeout(function(){
                    introBlock.classList.add('titles');
                    page.scrollTop = space;
                    black.classList.add('out');
                    landingScreen = false;
                    resetTxt();
                    xOff(1,true);
                    glitch.chance += 220;
                    sceneTransition = true;

                    if (scrollTimer) clearTimeout(scrollTimer);
                    scrollTimer = setTimeout(function() {
                        resetScroll();
                    },60);
                },900);
            }

        }
        // back //
        if (currentScene < lastScene) {
            if (currentScene === 0) landingScreen = true;
            resetTxt();
            hideScrollBars();
            xOff(backMult);
            addGlitch();
        }

        lastScene = currentScene;
    }

}

function addGlitch() {
    if (glitch.chance < 30) {
        glitch.chance += 80;
    }
    else {
        glitch.chance += 30;
    }
    if (glitch.chance > 220) glitch.chance = 220;
}


function resetScroll() {
    if (sceneTransition) {
        var dest = (txtScroll * currentScene) + (txtScroll / 2);
        if (currentScene < 1) dest = 0;

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
}


function hideScrollBars() {
    scrollbarsVisible = false;
    percentBarTopWrap.classList.add('no-transition');
    percentBarTopWrap.style.opacity = '0';
    percentBarTopWrap.offsetHeight;
    percentBarTopWrap.classList.remove('no-transition');

    percentBarBottomWrap.classList.add('no-transition');
    percentBarBottomWrap.style.opacity = '0';
    percentBarBottomWrap.offsetHeight;
    percentBarBottomWrap.classList.remove('no-transition');
}

function xOff(dir, hard) {
    titleRollover();
    var amp = 0.1;
    if (hard) amp = 0.35;
    if (landingScreen) {
        logo.yOff = (height * amp) * dir;
        page.scrollTop = 0;
    } else {
        txt.yOff = (height * amp) * dir;
        setTitleNumber();
    }
}


function setTitleNumber() {
    var num = currentScene;
    if (num < 10) num = '0' + num;
    titleNumber.innerHTML = '' + num;

    $(titleNumber).removeClass('in').width(); // reading width() forces reflow
    $(titleNumber).addClass('in');
}


function updatePercentBar() {
    targetHeight = txtScroll;
    if (landingScreen) targetHeight = introScroll;

    if (percentBarTop) {
        scrollPerc = Math.round((scrollFocus / targetHeight) * 100);
        var scrollPercVis = scrollPerc;
        if (scrollPercVis > 100) scrollPercVis = 100;

        if (scrollbarsVisible) {
            if (!landingScreen) {
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
        //introBlock.classList.add('titles');
        ninja.classList.add('in');
    }
    if (scrollPos < introScroll) {
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
        if(reveal[i].getBoundingClientRect().top <= (window.innerHeight * 0.8)){
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

    if (!projectOpen && landingScreen) ninja.classList.remove('in');
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

function exploreScroll() {
    if (sceneTransition) {
        var dest = txtScroll *1.5;

        page.scroll({
            top: dest,
            left: 0,
            behavior: 'smooth'
        });
    }
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
        audioObject.volume = 1;
        projectAudio.classList.add('audio-playing');
        audioIsPlaying = true;
        setTimeout(function() {
            fadeOutAudio(audioObject);
        },200);

    }
}

function fadeOutAudio(obj) {

    // Set the point in playback that fadeout begins. This is for a 2 second fade out.
    var sound = obj;
    var fadePoint = sound.duration - 2;

    var fadeAudio = setInterval(function () {


        // Only fade if past the fade out point or not at zero already
        if ((sound.currentTime >= fadePoint) && (sound.volume != 0.0)) {
            sound.volume -= 0.1;
        }
        // When volume at zero stop all the intervalling
        if (sound.volume <= 0.0 || sound.currentTime === 0) {
            clearInterval(fadeAudio);
        }
    }, 200);
}

function toggleMute() {
    
}
