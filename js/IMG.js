
//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------


function Img(ctx, x, y, s, src, callback) {

    this.ctx = ctx;
    this.position = new Point(x, y);
    this.xOff = 0;
    this.yOff = 0;
    this.xOffDest = 0;
    this.yOffDest = 0;
    this.startOff = height;
    this.startOffDest = 0;
    this.firstUpdate = true;
    this.interactive = false;
    this.roll = false;
    this.rollAmp = 0;


    this.img = new Image();
    var me = this;
    this.img.onload = function() {
        me._begin(s);
    };
    this.img.src = src;

    this.rows = 0;
    this.quality = 1;
    this._linked = false;

    this.margin = 60;


    this.index1 = 100;
    this.index2 = 200;
    this.index3 = 300;

    this.index4 = 400;
    this.yIndex = 500;
    this.linkOff = 0;

    // displacement distances //
    this.range = 200;
    this.offsetRange = 500; // spike
    this.yRange = 150;

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

    this.peaking = tombola.percent(5);
    this.peak = tombola.rangeFloat(0, this.rows);
    this.peakOffset = tombola.range(-100, 100);

    if (this._linked) this.link(this._linked); // this won't work if master img hasn't loaded
    if (this.callback) this.callback();
    //this.shift();
};

//-------------------------------------------------------------------------------------------
//  LINK
//-------------------------------------------------------------------------------------------

Img.prototype.link = function(master) {
    this.noise = master.noise;
    this.linkOff = ((this.position.y + (this.height/2)) - (master.position.y) + (master.height/2)) / this.quality;
    this._linked = master;
};


//-------------------------------------------------------------------------------------------
//  HITTEST
//-------------------------------------------------------------------------------------------

Img.prototype.hitTest = function() {
    var width = this.width * 1.1;
    var x = this.position.x - (width / 2) + this.xOff;
    var y = this.top + this.yOff + this.margin;
    this.roll = hitBox(x, y, width, this.height);
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------


Img.prototype.shift = function() {
    var i, n, ind;

    var indM = 0.75;
    var scaleM = 1.9;
    var rh = this.rowHeight / ratio;

    this.yIndex = tombola.range(-2000,2000);
    this.index1 = tombola.range(-2000,2000);
    this.index2 = tombola.range(-2000,2000);
    this.index3 = tombola.range(-2000,2000);


    for (i=0; i<this.rows; i++) {
        ind = i + this.linkOff;
        var ind1 = this.index1 + (ind/((200 * scaleM) / rh));
        var ind2 = this.index2 + (ind/((100 * scaleM) / rh));
        var ind3 = this.index3 + (ind/((300 * scaleM) / rh));
        var ind4 = this.yIndex;
        var ind5 = (ind/((50 * scaleM) / rh));

        // horizontal //
        n = (this.noise.noise(ind1, ind1) + this.noise.noise(ind2, ind2)) / 2;
        if (tombola.percent(10)) n += tombola.rangeFloat(-0.04,0.04);
        this.rowOffset[i] = n * this.range * 2;

        // vertical //
        n = this.noise.noise(ind4, ind5);
        this.rowOffsetYDest[i] = n * this.yRange * 0.3;

        // width //
        n = 1 + (this.noise.noise(10000 + ind3, ind3) * 0.16);
        this.rowWidth[i] = n;
    }
};



// we calculate displacement for each row //
Img.prototype.update = function() {

    var i, n, ind;

    var lerpSpeed = 10;

    var indM = 0.75;
    var scaleM = 1.9;
    var rh = this.rowHeight / ratio;
    var dv = (250 * scaleM) / rh;
    var dv2 = (40 * scaleM) / rh;

    //this.yIndex += (0.002 * indM);
    this.yIndex += (0.01 * indM);
    this.index1 += (0.002 * indM);
    this.index2 += (0.005 * indM);
    this.index3 += (0.003 * indM);
    this.index4 = (7 * indM * this.noise.noise(10000, this.yIndex));

    var y = this.top + this.yOff - this.startOff;
    var mouseInd = Math.round((mouseY - y) / this.rowHeight);
    var scrollAmp = 0.05 + ((scrollPerc / 100) * 0.95);
    var rollNoise = this.noise.noise(this.index2, 0);


    for (i=0; i<this.rows; i++) {
        ind = i + this.linkOff;
        var id = ind/dv;
        /*var ind1 = this.index1 + (ind/((350 * scaleM) / rh));
        var ind2 = this.index2 + (ind/((250 * scaleM) / rh));
        var ind3 = this.index3 + (ind/((450 * scaleM) / rh));*/
        var ind1 = this.index1 + (ind/((100 * scaleM) / rh));
        var ind2 = this.index2 + (ind/((50 * scaleM) / rh));
        var ind3 = this.index3 + (ind/((200 * scaleM) / rh));
        var ind4 = this.yIndex;
        var ind5 = (ind/((50 * scaleM) / rh));
        var ind6 = this.yIndex + (ind/((15 * scaleM) / rh));

        // horizontal //
        n = this.noise.noise((ind1/2), ind1) * this.noise.noise(ind2, (ind2/2)) * this.noise.noise(10000 + (ind3/3), ind3);
        n = (this.noise.noise(ind1, ind1) + this.noise.noise(ind2, ind2)) / 2;
        this.rowOffsetDest[i] = n * this.range * scrollAmp;

        this.rollSplit(i, mouseInd, rollNoise);

        // intro offset //
        var startInd = (i + this.linkOff - this.startOff) / ((50 * scaleM) / rh);
        n = this.noise.noise(0, startInd) * this.startOff;
        this.rowOffsetDest[i] -= n;

        // glitch //
        var glitchOff = this.noise.noise(ind1, ind2) * 100;
        var glitchNoise = tombola.rangeFloat(-0.2,0.2) * 0.5;
        if (glitch.glitches.length) {
            this.rowOffset[i] = (this.rowOffsetDest[i] + glitchOff);
            if (glitchOff > 0) this.rowOffsetDest[i] += (glitchNoise * glitchOff);
        }

        // rollover //
        /*if (this.interactive && this.roll) {
            var distance = 1 + (Math.abs(mouseInd - i) / 2);
            var strength = (150 * this.noise.noise(ind6, ind3)) / distance;
            distance -= 1;
            if (distance > 15) distance = 15;
            strength = ((150 - (distance * 10)) * this.noise.noise(ind6, ind3)) * this.rollAmp;
            this.rowOffsetDest[i] += strength;
        }*/


        // vertical //
        n = this.noise.noise(this.index4 + (ind/dv2), 10000);
        n = this.noise.noise(ind4, 10000);
        n = this.noise.noise(ind4, ind5);
        this.rowOffsetYDest[i] = n * this.yRange * scrollAmp;

        // width //
        n = 1 + (this.noise.noise(10000 + ind3, ind2) * 0.16 * scrollAmp);
        this.rowWidthDest[i] = n;


        // peak //
        /*if (this.peaking && i === Math.round(this.peak)) this.rowOffsetDest[i] += this.peakOffset;

        // spike //
        if (tombola.chance(1,150000)) {
            this.rowOffsetDest[i] += tombola.range(-this.offsetRange, this.offsetRange);
            this.rowOffset[i] = this.rowOffsetDest[i];
        }*/

        this.rowOffset[i] = lerp(this.rowOffset[i], this.rowOffsetDest[i], lerpSpeed);
        this.rowOffsetY[i] = lerp(this.rowOffsetY[i], this.rowOffsetYDest[i], lerpSpeed);
        this.rowWidth[i] = lerp(this.rowWidth[i], this.rowWidthDest[i], lerpSpeed);
    }

    // move peak //
    if (this.peaking) {
        this.peak += tombola.rangeFloat(-1, 1);
        this.peakOffset += tombola.range(-5, 5);
        this.peak = constrain(this.peak, 0, this.rows);
        this.peakOffset = constrain(this.peakOffset, -this.offsetRange, this.offsetRange);
    }

    var dist = 50;
    this.xOffDest = dist * mouseXNorm;
    this.yOffDest = dist * mouseYNorm;
    this.xOff = lerp(this.xOff, this.xOffDest, 4);
    this.yOff = lerp(this.yOff, this.yOffDest, 4);

    this.startOff = lerp(this.startOff, this.startOffDest, 2);
    this.rollAmp = lerp(this.rollAmp, this.roll, 2);

    this.firstUpdate = false;
};


Img.prototype.rollSplit = function(i, mouseInd, n) {
    if (this.interactive && this.roll) {
        var strength = (mouseX - (width / 2)) / (this.width / 2);
        var dist = strength * 0.2 * this.range;
        if (i < mouseInd) {
            this.rowOffsetDest[i] -= dist;
        } else {
            this.rowOffsetDest[i] += dist;
        }
    }
};


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------


Img.prototype.draw = function() {

    if (this.img) {
        var i, l;
        var ctx = this.ctx;
        var x = this.position.x + this.xOff;
        var y = this.top + this.yOff - this.startOff;
        var rx = Math.round(x);
        var ry = Math.round(y);

        // DRAW EACH ROW //
        for (i=0; i<this.rows; i++) {

            var w = this.width * this.rowWidth[i];
            var hw = w/2;
            var bx = rx + this.rowOffset[i] - hw;
            var by = ry + (this.rowHeight * i);



            ctx.save();
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + w, by);
            ctx.lineTo(bx + w, by + this.rowHeight);
            ctx.lineTo(bx, by + this.rowHeight);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(this.img, x + this.rowOffset[i] - hw, this.margin + y + this.rowOffsetY[i], w, this.height);

            /*ctx.fillStyle = '#ff0000';
            ctx.fillRect(bx,by, 2, 2);*/

            ctx.restore();
        }
    }

    //ctx.drawImage(this.img, x + this.rowOffset[0], y, this.width, this.height);
};
