
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

var reveal = [];
var projectRevealElements = [];



//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

function setupInteraction() {

    // ADD INTERACTION EVENTS TO THE CANVAS //
    window.addEventListener("mousedown", mousePress, false);
    window.addEventListener("mouseup", mouseRelease, false);
    window.addEventListener("mousemove", mouseMove, false);

    /*page.addEventListener("mousedown", mousePress, false);
    page.addEventListener("mouseup", mouseRelease, false);
    page.addEventListener("mousemove", mouseMove, false);

    packshotWrap.addEventListener("mousedown", mousePress, false);
    packshotWrap.addEventListener("mouseup", mouseRelease, false);
    packshotWrap.addEventListener("mousemove", mouseMove, false);*/

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
    $(muteButton).click(toggleMute);
    $(titleUnderline).click(viewProject);
    $(ninja).click(backToLaunch);

    $('#explore').hover(function() {
        $(this).parent().addClass('hover');
    }, function() {
        $(this).parent().removeClass('hover');
    });

    // REVEAL ON SCROLL //
    reveal = document.getElementsByClassName('c-hidden');
    var projectReveal = document.getElementById('project').getElementsByClassName('c-hidden');
    for (var i=0; i<projectReveal.length; i++) {
        projectRevealElements.push(projectReveal[i]);
    }

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

    // hacky mobile fix, do this properly //
    if (!AUTOPLAY) {
        mouseXNorm = 0;
        mouseYNorm = 0;
    }

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
                    if (AUTOPLAY) {
                        muteButton.classList.add('titles');
                    }
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
        muteButton.classList.remove('titles');
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

function backToLaunch() {

    if (projectOpen) {
        page.scrollTop = 0;
        pageScroll();
        toggleProject();
    } else {
        if (!landingScreen) {
            page.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
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
        fadeOutAudio(audioObject, true);
        setTimeout(function() {
            toggleAudio();
        },1000);
    }

    if (!projectOpen && landingScreen) ninja.classList.remove('in');
}

function viewProject() {
    loadProject(currentScene-1);
}

function loadFromIndex() {
    var ind = parseInt(this.getAttribute('data-index'));
    loadProject(ind);
}

function gotoNextProject() {
    currentProject ++;
    if (currentProject >= data.projects.length) currentProject = 0;

    loadProject(currentProject);
    fadeOutAudio(audioObject, true);
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
        if (AUTOPLAY) {
            audioObject.play();
            audioObject.volume = masterVolume;
            projectAudio.classList.add('audio-playing');
            audioIsPlaying = true;
            setTimeout(function() {
                fadeOutAudio(audioObject);
            },200);
        }

        else {
            audioObject = new Audio(audioSrc);
            audioObject.addEventListener('ended', toggleAudio);
            audioObject.addEventListener('loadstart', audioLoadStart);
            audioObject.addEventListener('canplay', audioLoaded);
            audioObject.play();
            audioObject.volume = masterVolume;
            projectAudio.classList.add('audio-playing');
            audioIsPlaying = true;
            setTimeout(function() {
                fadeOutAudio(audioObject);
            },200);
        }
    }
}

function audioLoadStart() {
    //console.log('loadStart');
    projectAudio.classList.remove('audio-playing');
    projectAudio.classList.add('audio-buffering');
    audioObject.removeEventListener('loadstart', audioLoadStart);
}

function audioLoaded() {
    //console.log('canPlay');
    projectAudio.classList.remove('audio-buffering');
    projectAudio.classList.add('audio-playing');
    audioObject.removeEventListener('canplay', audioLoaded);
}

function fadeOutAudio(obj, immediate) {

    // Set the point in playback that fadeout begins. This is for a 2 second fade out.
    var sound = obj;
    var fadePoint = sound.duration - 2.5;
    var timer = 200;
    if (immediate) {
        fadePoint = sound.currentTime - 1;
        timer = 100;
    }

    var fadeAudio = setInterval(function () {

        var newVol = sound.volume;
        // Only fade if past the fade out point or not at zero already
        if ((sound.currentTime >= fadePoint) && (sound.volume != 0.0)) {
            newVol -= 0.1;
            newVol = constrain(newVol, 0, 1);
            sound.volume = newVol;
        }
        // When volume at zero stop all the intervalling
        if (sound.volume <= 0.0 || sound.currentTime === 0) {
            clearInterval(fadeAudio);
        }
    }, timer);
}


function toggleMute() {
    if (masterVolume===1) {
        masterVolume = 0;
        muteButton.classList.add('muted');
    } else {
        masterVolume = 1;
        muteButton.classList.remove('muted');
    }
    if (audioObject) audioObject.volume = masterVolume;
}

function detectAutoplay() {
    var mp3 = 'data:audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

    try {
        var audio = new Audio(mp3); // Construct new Audio object
        audio.autoplay = true; // Set autoplay to true

        // This event will only be triggered if setting the autoplay attribute to true works.
        $(audio).on('play', function() {
            AUTOPLAY = true; // Set the global flag to true, indicating we have support.
        });

        audio.src = mp3; // Set the audio objects src to the value of the src variable.
    } catch(e) {
        console.log('[AUTOPLAY-ERROR]', e);
        // This means we were unsuccessful - this browser doesn't support the autoplay attribute.
    }
}
