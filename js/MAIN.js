

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


// INTERACTION //
var mouseX = 0;
var mouseY = 0;
var mouseIsDown = false;


var images = [];
var packshot;
var palette = [new RGBA(247,190,2,1), new RGBA(239,235,0,1), new RGBA(18,18,232,1), new RGBA(232,17,57,1), new RGBA(255,71,34,1)];

// new RGBA(5,5,5,1),
var glitchCols = [new RGBA(255,255,255,1), new RGBA(250,240,255,1)];

var glitch;


var page;
var project;
var uiBlock;
var introBlock;
var year;
var percentBar;
var percentBarContainer;
var indexClose;
var indexOpen;
var index;
var closeBlock;
var packshotwrap;
var projectCopy;
var shroud;
var projectClose;
var projectArtists;
var nextProject;


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
    metrics();

    // INTERACTION //
    setupInteraction();

    // STATS //
    //initStats();


    // CSS TRANSITION IN //
    document.body.style.opacity = '1';

    glitch = new Glitch();

    formatYear();
    resetImg();

    populateIndex();
    loadProject(0);

    // TEMPORARY //
    setTimeout(function() {
        setupType();
    }, 2000);

}

function getElements() {
    page = document.getElementById('page');
    project = document.getElementById('project');
    uiBlock = document.getElementById('ui-block');
    introBlock = document.getElementById('intro-block');
    year = document.getElementById('year');
    percentBarContainer = document.getElementById('percent-bar-container');
    percentBar = document.getElementById('percent-bar');
    indexOpen = document.getElementById('index-open');
    indexClose = document.getElementById('index-close');
    index = document.getElementById('index');
    closeBlock = document.getElementById('close-block');
    projectClose = document.getElementById('project-close');
    projectArtists = document.getElementById('project-artists');
    packshotWrap = document.getElementById('packshot-wrap');
    projectCopy = document.getElementById('project-copy');
    nextProject = document.getElementById('next-project');
    shroud = document.getElementById('shroud');
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
    packshot =  new Packshot(ctx2, width/2, height/2, size, currentProjectArtwork, callback);
}

function resetImg(callback) {
    var x = width/2;
    var y = height/2;
    var size = height * 0.8;
    if (device==='mobile') size = width * 0.8;
    images = [];
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
                images[0].interactive = true;
            }, 4500);

            // EXPLORE & UI //
            setTimeout(function() {
                uiBlock.classList.remove('in');
                introBlock.classList.remove('in');
            }, 5000);


        }
    }
    images.push( new Img(ctx, x, y, size, 'img/tt.png', func));
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

    var flash = false;

    /*var l = images.length;
    for (var i=0; i<l; i++) {
        if (flash) images[i].shift();
        images[i].update();
    }*/

    if (packshot) packshot.update();
    //colorLerp(bgCol,bgDest,1);

    //glitch.update();

    updateWebtype();
}




//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------

function draw() {

    ctx.globalAlpha = 1;
    ctx.clearRect(0,0,width,height);


    /*ctx.globalAlpha = 1;
    var l = images.length;
    for (var i=0; i<l; i++) {
        images[i].draw();
    }

    glitch.draw();*/

    if (packshot) drawPackshot();

    //updatePackshot();
}



function drawPackshot() {
    ctx2.clearRect(0,0,width,height);
    color.fill(ctx2,palette[4]);
    packshot.draw();
}



function formatPackshot(src) {
    var parent = document.getElementById('packshot');
    parent.innerHTML = '';


    var container = document.createElement('div');
    container.classList = 'packshot-container';
    parent.appendChild(container);
    var parentHeight = container.offsetHeight;
    console.log(parentHeight);

    var n = 20;

    var perc = (100 / n);
    var roundHeight = Math.round(parentHeight / n);

    for (var i=0; i<n; i++) {

        var strip = document.createElement('div');
        strip.classList = 'packshot-strip';
        strip.style.height = '' + roundHeight + 'px';
        container.appendChild(strip);

        /*var stripBG = document.createElement('div');
        stripBG.classList = 'packshot-strip-bg';
        strip.appendChild(stripBG);*/

        var stripImgWrap = document.createElement('div');
        stripImgWrap.classList = 'packshot-strip-img-wrap';
        strip.appendChild(stripImgWrap);

        var stripImg = document.createElement('img');
        stripImg.classList = 'packshot-strip-img';
        stripImg.src = src;
        stripImg.style.top = '' + (-(100 * i)) + '%';
        stripImg.style.transitionDelay = '' + (0.5 + (Math.random() / 2)) + 's';
        stripImgWrap.appendChild(stripImg);




    }

}
