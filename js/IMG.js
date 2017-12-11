
//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

var imgCanvas;

function Img(ctx, x, y, s, src, callback) {

    this.ctx = ctx;
    this.position = new Point(x, y);
    this.xOff = 0;
    this.yOff = 0;
    this.xOffDest = 0;
    this.yOffDest = 0;
    this.startOff = 300;
    this.alpha = 0;
    this.startOffDest = 0;
    this.scrollAmpCounter = 0;



    this.img = new Image();
    var me = this;
    this.img.onload = function() {
        me._begin(s);
    };
    this.img.src = src;

    this.rows = 0;
    this.quality = 1;

    this.margin = 60;
    this.rollRefresh = this.margin;



    this.index1 = 100;
    this.index2 = 200;
    this.index3 = 300;

    this.index4 = 400;
    this.yIndex = 500;

    // displacement distances //
    this.range = 200;
    this.range = 100;
    this.yRange = 150;
    this.yRange = 250;

    this.rowOffset = [];
    this.rowOffsetDest = [];
    this.rowOffsetY = [];
    this.rowOffsetYDest = [];
    this.rowWidth = [];
    this.rowWidthDest = [];

    this.noise = new SimplexNoise();

    this.callback = callback;
}

Img.prototype._begin = function(s) {
    var m = s / this.img.width;
    this.width = this.img.width * m;
    this.height = this.img.height * m;
    var marginHeight = this.height + (this.margin * 2);

    this._scaledImage();

    this.rows = Math.min(800, marginHeight / this.quality);
    this.rowHeight = Math.ceil(this.height / this.rows);
    this.top = this.position.y - ((this.height + (this.margin * 2)) / 2);

    var dv = 6;
    for (var i=0; i<this.rows; i++) {
        var n = tombola.range(-this.offsetRange/dv, this.offsetRange/dv);
        if (tombola.percent(10)) n = tombola.range(-this.offsetRange, this.offsetRange);
        this.rowOffset.push( 0 );
        this.rowOffsetDest.push( 0 );
        this.rowOffsetY.push( 0 );
        this.rowOffsetYDest.push( 0 );
        this.rowWidth.push( 1 );
        this.rowWidthDest.push( 1 );
    }

    if (this.callback) this.callback();
};


Img.prototype._scaledImage = function() {
    if (!imgCanvas) imgCanvas = document.createElement('canvas');

    imgCanvas.width = this.width * 1.3;
    imgCanvas.height = this.height * 1.3;
    imgCanvas.getContext('2d').drawImage(this.img, 0, 0, this.width * 1.3, this.height * 1.3);

    this.img = imgCanvas;
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

Img.prototype.update = function() {

    var i, n, ind;

    var lerpSpeed = 10;

    var indM = 0.75;
    var scaleM = 1.9;
    var rh = this.rowHeight / ratio;
    var dv = (250 * scaleM) / rh;
    var dv2 = (40 * scaleM) / rh;

    if (this.alpha < 100) this.alpha ++;


    this.yIndex += (0.01 * indM);
    this.index1 += (0.002 * indM);
    this.index2 += (0.005 * indM);
    this.index3 += (0.003 * indM);
    this.index4 = (7 * indM * this.noise.noise(10000, this.yIndex));

    var scrollAmp = 0.05 + ((scrollPerc / 100) * 0.95);
    var scrollAmp2 = 0.05 + ((scrollPerc / 100) * 0.95);
    if (!sceneTransition) {
        scrollAmp = 1 + this.scrollAmpCounter;
        this.scrollAmpCounter += 0.3;
    } else {
        this.scrollAmpCounter = 0;
    }


    for (i=0; i<this.rows; i++) {
        ind = i;
        var id = ind/dv;
        var ind1 = this.index1 + (ind/((140 * scaleM) / rh));
        var ind2 = this.index2 + (ind/((70 * scaleM) / rh));
        var ind3 = this.index3 + (ind/((200 * scaleM) / rh));
        var ind4 = this.yIndex;
        var ind5 = (ind/((50 * scaleM) / rh));
        var ind6 = this.yIndex + (ind/((15 * scaleM) / rh));

        // horizontal //
        n = (this.noise.noise(ind1, ind1) + this.noise.noise(ind2, ind2)) / 2;
        this.rowOffsetDest[i] = n * this.range * scrollAmp2 * (1 + (this.startOff * 0.02));


        // intro offset //
        var startInd = (i - this.startOff) / ((140 * scaleM) / rh);
        n = this.noise.noise(0, startInd) * (this.startOff * 3);
        this.rowOffsetDest[i] -= n;


        // vertical //
        n = this.noise.noise(this.index4 + (ind/dv2), 10000);
        n = this.noise.noise(ind4, 10000);
        n = this.noise.noise(ind4, ind5);
        this.rowOffsetYDest[i] = n * this.yRange * scrollAmp * (1 + (this.startOff * 5));

        // width //
        // 0.16
        n = 1 + (this.noise.noise(10000 + ind3, ind2) * 0.18 * scrollAmp * (1 + (this.startOff * 0.4)));
        this.rowWidthDest[i] = n;


        this.rowOffset[i] = lerp(this.rowOffset[i], this.rowOffsetDest[i], lerpSpeed);
        this.rowOffsetY[i] = lerp(this.rowOffsetY[i], this.rowOffsetYDest[i], lerpSpeed);
        this.rowWidth[i] = lerp(this.rowWidth[i], this.rowWidthDest[i], lerpSpeed);
    }

    // CURSOR FOLLOW //
    var dist = 60;
    this.xOffDest = dist * mouseXNorm;
    this.yOffDest = dist * mouseYNorm;
    this.xOff = lerp(this.xOff, this.xOffDest, 5);
    this.yOff = lerp(this.yOff, this.yOffDest, 5);

    this.startOff = lerp(this.startOff, this.startOffDest, 5);
};


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------


Img.prototype.draw = function() {

    if (this.img) {
        var i, l;
        var x = this.position.x + this.xOff;
        var y = this.top + this.yOff - this.startOff;
        var rx = Math.round(x);
        var ry = Math.round(y);

        this.ctx.globalAlpha = this.alpha / 100;

        // DRAW EACH ROW //
        for (i=0; i<this.rows; i++) {
            var w = Math.floor(this.width * this.rowWidth[i]);
            var h = Math.floor(this.height);
            var hw = w/2;
            var bx = rx + this.rowOffset[i] - hw;
            var by = Math.floor(ry + (this.rowHeight * i));


            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(bx, by);
            this.ctx.lineTo(bx + w, by);
            this.ctx.lineTo(bx + w, by + this.rowHeight);
            this.ctx.lineTo(bx, by + this.rowHeight);
            this.ctx.closePath();
            this.ctx.clip();

            this.ctx.drawImage(this.img, bx, Math.floor(this.margin + y + this.rowOffsetY[i]), w, h);

            this.ctx.restore();
        }

        this.ctx.globalAlpha = 1;
    }
};
