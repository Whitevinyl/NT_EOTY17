

// INIT //
var canvas;
var ctx;
var canvas2;
var ctx2;
var stats;
var animating = false;

// METRICS //
var width = 0;
var height = 0;
var ratio = 1;
var TAU = 2 * Math.PI;
var device = 'desktop';
var metricTimer = null;

var scrollPos = 0;
var lastScrolPos = 0;
var scrollSpeed = 0;
var pageHeight = 0;
var viewHeight = 0;

var introScroll = txtScroll = 600;


// INTERACTION //
var mouseX = 0;
var mouseY = 0;
var mouseIsDown = false;
var projectOpen = false;
var landingScreen = true;
var touchTakeover = false;


var glitch;
var logo;
var txt;
var packshot;


var bgCol = new RGBA(20,18,25,1);
var foregroundCol = new RGBA(255,255,255,1);
var palette = [new RGBA(247,190,2,1), new RGBA(239,235,0,1), new RGBA(18,18,232,1), new RGBA(232,17,57,1), new RGBA(255,71,34,1)];

var glitchCols = [new RGBA(255,255,255,1)]; // new RGBA(250,240,255,1)

var audioObject;
var audioIsPlaying = false;


var page;
var project;
var uiBlock;
var introBlock;
var year;
var explore;
var titleNumber;
var titleNumberWrap;
var indexClose;
var indexOpen;
var index;
var cursor;
var closeBlock;
var packshotwrap;
var projectCopy;
var shroud;
var black;
var projectClose;
var projectArtists;
var projectHeadlines;
var nextProject;
var percentBarTop;
var percentBarBottom;
var percentBarTopWrap;
var percentBarBottomWrap;
var titleUnderline;
var ninja;
var projectAudio;
var projectAudioLabel;
var titleHitbox;


var currentProject = 0;
var currentProjectArtwork = 'img/packshots/compassion800.jpg';

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

function init() {

    // GET DOM ELEMENTS //
    getElements();

    // SETUP CANVAS //
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas2 = document.getElementById('packshot-canvas');
    ctx2 = canvas2.getContext('2d');


    // SET CANVAS & DRAWING POSITIONS //
    metrics(true);

    // INTERACTION //
    setupInteraction();

    // STATS //
    //initStats();


    // CSS TRANSITION IN //
    document.body.style.opacity = '1';

    glitch = new Glitch();

    formatYear();
    resetLogo();

    populateIndex();
    calculateScrollSpace();
}

function getElements() {
    page = document.getElementById('page');
    project = document.getElementById('project');
    ninja = document.getElementById('ninja-logo');
    uiBlock = document.getElementById('ui-block');
    introBlock = document.getElementById('intro-block');
    year = document.getElementById('year');
    explore = document.getElementById('explore');
    titleNumber = document.getElementById('title-number-index');
    titleNumberWrap = document.getElementById('title-number-index-wrap');
    percentBarTop = document.getElementById('percent-bar-top');
    percentBarBottom = document.getElementById('percent-bar-bottom');
    percentBarTopWrap = document.getElementById('percent-bar-top-wrap');
    percentBarBottomWrap = document.getElementById('percent-bar-bottom-wrap');
    indexOpen = document.getElementById('index-open');
    indexClose = document.getElementById('index-close');
    index = document.getElementById('index');
    closeBlock = document.getElementById('close-block');
    projectClose = document.getElementById('project-close');
    projectArtists = document.getElementById('project-artists');
    projectHeadlines = document.getElementById('project-headlines');
    packshotWrap = document.getElementById('packshot-wrap');
    projectAudio = document.getElementById('project-audio');
    projectAudioLabel = document.getElementById('project-audio-label');
    projectCopy = document.getElementById('project-copy');
    nextProject = document.getElementById('next-project');
    shroud = document.getElementById('shroud');
    black = document.getElementById('black');
    titleUnderline = document.getElementById('title-underline-wrap');
    titleHitbox = document.getElementById('title-hitbox');
}


function formatYear() {
    var chars = year.innerHTML.split('');
    year.innerHTML = '';
    var delay = 2.9;

    var l = chars.length;
    for (var i=0; i<l; i++) {

        var wrap = document.createElement('span');
        wrap.classList = 'split-inner reveal';
        wrap.style.transitionDelay = '' + (i / 4.5) + 's';

        var inner = document.createElement('span');
        inner.innerHTML = chars[i];
        inner.classList = 'char';


        year.appendChild(wrap);
        wrap.appendChild(inner);
    }
}


function resetPackshot(callback) {
    size = height * 0.75;
    if (device==='mobile') size = width * 0.75;
    var active = false;
    if (packshot && packshot.active) active = true;
    packshot =  new Packshot(ctx2, width/2, height/2, size, currentProjectArtwork, callback);
    if (active) packshot.active = true;
}

function resetLogo() {
    var x = width/2;
    var y = height/2;
    var size = height * 0.8;
    if (device==='mobile') size = width * 0.8;
    var func = function() {
        if (!animating) {
            loop();
            animating = true;

            // YEAR //
            setTimeout(function() {
                year.classList.remove('hide');
            }, 3000);

            // GLITCH //
            setTimeout(function() {
                glitch.glitchable = true;
                glitch.chance = 200;
            }, 4500);

            // EXPLORE & UI //
            setTimeout(function() {
                uiBlock.classList.remove('in');
                introBlock.classList.remove('in');
            }, 5000);


        }
    }
    logo = new Img(ctx, x, y, size, 'img/tt2000.png', func);
}

function resetTxt() {
    if (!landingScreen) {
        var x = width/2;
        var y = height/2;
        var size = width * 0.065;
        if (device==='mobile') size = width * 0.08;
        txt = new Txt(ctx, x, y, size, data.projects[currentScene-1].artist);
    }
}


function initStats() {
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
}


function colorLerp(from, to, speed) {
    from.R = lerp(from.R, to.R, speed);
    from.G = lerp(from.G, to.G, speed);
    from.B = lerp(from.B, to.B, speed);
    from.A = lerp(from.A, to.A, speed);
}


//-------------------------------------------------------------------------------------------
//  MAIN LOOP
//-------------------------------------------------------------------------------------------


function loop() {
    if (stats) stats.begin();
    update();
    draw();
    if (stats) stats.end();
    requestAnimationFrame(loop);
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

function update() {

    if (!projectOpen) {
        if (landingScreen) logo.update();
        if (!landingScreen) txt.update();
        glitch.update();
    }
    else {
        if (packshot) packshot.update();
    }
}


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------

function draw() {

    ctx.globalAlpha = 1;
    ctx.clearRect(0,0,width,height);


    if (!projectOpen) {
        if (landingScreen) logo.draw();
        if (!landingScreen) txt.draw();
        glitch.draw();
    }
    else {
        if (packshot) packshot.draw();
    }
}
