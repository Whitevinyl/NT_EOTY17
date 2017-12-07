

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------


function Txt(ctx, x, y, s, string) {

    this.ctx = ctx;
    this.string = string.toUpperCase();
    this.position = new Point(x, y);
    this.fontSize = s * ratio;

    var font = 'Barlow Condensed';
    var weight = 600;
    this.fontStyle = '' + weight + ' ' + this.fontSize + 'px ' + font;
    this.ctx.font = this.fontStyle;
    this.size = this.ctx.measureText(this.string).width;

    if (this.size > width) {
        //TODO: make fit //
    }

    this.roll = false;
    this.rollStyle = tombola.range(0, 1);
    this.rollStyle = tombola.item([0,3,4,6]);
    this.flipCount = tombola.range(55, 75);
    this.rollTimer = 0;
    this.rollRefresh = 0;
    this.peaks = [];

    this.top = this.position.y - (this.fontSize * 0.6);
    this.xOff = 0;
    this.yOff = 0;
    this.xOffDest = 0;
    this.yOffDest = 0;

    this.quality = 1 * ratio;
    this.rows = Math.min(600, this.fontSize / this.quality);
    this.rowHeight = Math.ceil(this.fontSize / this.rows);


    this.index1 = 100;
    this.index2 = 200;
    this.index3 = 300;
    this.index4 = 400;
    this.yIndex = 500;
    this.linkOff = 0;


    this.range = 110;
    this.range = 80;
    this.range = 60;
    this.offsetRange = 200;
    this.yRange = 20;
    this.yRangeDest = 8;
    this.yRangeDefault = this.yRangeDest;

    this.rowOffset = [];
    this.rowOffsetDest = [];
    this.rowOffsetY = [];
    this.rowOffsetYDest = [];
    var dv = 6;
    var n = tombola.range(-this.offsetRange, this.offsetRange);
    for (var i=0; i<this.rows; i++) {
        if (tombola.percent(4)) n = tombola.range(-this.offsetRange, this.offsetRange);
        this.rowOffset.push( 0 );
        this.rowOffsetDest.push( 0 );
        this.rowOffsetY.push( 0 );
        this.rowOffsetYDest.push( 0 );
    }

    this.noise = new SimplexNoise();

    this.peaking = tombola.percent(5);
    this.peak = tombola.rangeFloat(0, this.rows);
    this.peakOffset = tombola.range(-100, 100);

    this.hitTest();
}

//-------------------------------------------------------------------------------------------
//  HITTEST
//-------------------------------------------------------------------------------------------

Txt.prototype.hitTest = function() {
    var width = this.size * 1.1;
    var x = this.position.x - (width / 2) + this.xOff;
    var y = this.top + (this.fontSize * 0.15) + this.yOff;
    this.roll = hitBox(x, y, width, this.fontSize * 0.8);
}

//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------


Txt.prototype.update = function() {

    var i, n, ind;

    var lerpSpeed = 10;

    var m = 0.75;
    var dv = 190 / this.quality;
    dv = 400 / this.quality;
    var dv2 = 40 / this.quality;
    dv2 = 100 / this.quality;

    this.yIndex += (0.002 * m);
    this.index1 += (0.005 * m);
    this.index2 += (0.009 * m);
    this.index3 += (0.007 * m);
    this.index4 = (7 * m * this.noise.noise(10000, this.yIndex));

    var y = this.top + this.yOff;
    //y += tombola.range(-15, 15)
    var mouseInd = Math.round((mouseY - y) / this.rowHeight);


    if (this.rollStyle===1) {
        this.rollGlitch();
    }
    if (this.rollStyle===2) {
        this.rollVert();
    }
    if (this.rollStyle===4) {
        this.rollBlock();
    }


    for (i=0; i<this.rows; i++) {

        // horizontal //
        n = this.noise.noise(0, this.index1 + (i/dv)) * this.noise.noise(this.index2 + (i/dv), 0) * this.noise.noise(10000, this.index3 + (i/dv));
        this.rowOffsetDest[i] = n * this.range;

        if (this.rollStyle===0) {
            this.rollSplit(i, mouseInd);
        }
        if (this.rollStyle===3) {
            this.rollFlip(i, mouseInd);
        }
        if (this.rollStyle===6) {
            this.rollPulse(i,mouseInd);
        }
        if (this.rollStyle===8) {
            this.rollBlockSway(i,mouseInd);
        }

        // vertical //
        n = this.noise.noise(this.index4 + (i/dv2), 10000);
        this.rowOffsetYDest[i] = n * this.yRange;


        if (this.rollStyle===5) {
            this.rollMangle(i, mouseInd);
        }
        if (this.rollStyle===7) {
            this.rollVertSplit(i, mouseInd);
        }

        // peak //
        //if (this.peaking && i === Math.round(this.peak)) this.rowOffsetDest[i] += this.peakOffset;

        // spike //
        /*if (tombola.chance(1,150000)) {
            this.rowOffsetDest[i] += tombola.range(-this.offsetRange, this.offsetRange);
            this.rowOffset[i] = this.rowOffsetDest[i];
        }*/

        this.rowOffset[i] = lerp(this.rowOffset[i], this.rowOffsetDest[i], lerpSpeed);
        this.rowOffsetY[i] = lerp(this.rowOffsetY[i], this.rowOffsetYDest[i], lerpSpeed);
    }

    // move peak //
    /*if (this.peaking) {
        this.peak += tombola.rangeFloat(-1, 1);
        this.peakOffset += tombola.range(-5, 5);
        this.peak = constrain(this.peak, 0, this.rows);
        this.peakOffset = constrain(this.peakOffset, -this.offsetRange, this.offsetRange);
    }*/

    var dist = 50;
    this.xOffDest = dist * mouseXNorm;
    this.yOffDest = dist * mouseYNorm;
    this.xOff = lerp(this.xOff, this.xOffDest, 4);
    this.yOff = lerp(this.yOff, this.yOffDest, 4);
    /*var melt = 0;
    if (scrollPerc > 50) melt = ((scrollPerc - 50) * 2);
    this.yRangeDest = 15 + melt;*/
    this.yRange = lerp(this.yRange, this.yRangeDest, 10);
};


Txt.prototype.rollSplit = function(i, mouseInd) {
    if (this.roll) {
        var strength = (mouseX - (width / 2)) / (this.size / 2);
        var dist = strength * 0.3 * this.range;
        if (i < mouseInd) {
            this.rowOffsetDest[i] -= dist;
        } else {
            this.rowOffsetDest[i] += dist;
        }
    }
};

Txt.prototype.rollGlitch = function() {
    if (this.roll) {
        this.rollTimer--;
        if (this.rollTimer < 0) {
            this.rollTimer = 7;
            glitch.glitches.push(new GlitchRect(glitch.glitches, mouseX, mouseY, true));
        }
    }
};

Txt.prototype.rollVert = function() {
    if (this.roll) {
        this.yRangeDest = 60;
        this.yIndex += 0.0005;
    } else {
        this.yRangeDest = this.yRangeDefault;
    }
};

//curl //
Txt.prototype.rollBlock = function(i, mouseInd) {
    if (this.roll) {

        var count = 2;
        var rows = 1;
        /*this.rollTimer--;
        if (this.rollTimer < 0) {
            this.rollTimer = count;*/
            var index = this.rollRefresh * rows;

            var strength = (mouseX - (width / 2)) / (this.size / 2);
            var dist = strength * 1 * this.range;

            for (var j=index; j<(index + rows); j++) {
                this.rowOffset[j] = dist;
                this.rowOffsetDest[j] = dist;
            }
            this.rollRefresh ++;
            if (this.rollRefresh >= this.rows / rows) this.rollRefresh = 0;
        //}
    }
};

Txt.prototype.rollFlip = function(i, mouseInd) {
    if (this.roll) {

        var count = this.flipCount;
        if (i===0) {
            this.rollTimer = this.rollRefresh;
            this.rollRefresh ++;
        }
        if (this.rollRefresh >= count) this.rollRefresh = 0;

        this.rollTimer++;
        if (this.rollTimer >= count) {
            this.rollTimer = 0;
            var strength = (mouseX - (width / 2)) / (this.size / 2);
            var dist = strength * 3 * this.range;
            this.rowOffsetDest[i] += dist;
        }
    }
};

Txt.prototype.rollMangle = function(i, mouseInd) {
    if (this.roll) {
        var strength = (mouseX - (width / 2)) / (this.size / 2);
        var dist = 1 * (-(mouseInd - i)) * (this.rowHeight * 20);

        var h = 1.5;
        if (i < mouseInd) {
            var sourceIndex = mouseInd + (i - mouseInd);
            //this.rowOffsetY[i] = sourceIndex * h;
            this.rowOffsetYDest[i] = sourceIndex * h;
        }
        else {
            var sourceIndex = mouseInd - (i - mouseInd);
            //this.rowOffsetY[i] = sourceIndex * h;
            this.rowOffsetYDest[i] = sourceIndex * h;
        }
    }
};

// splits //
Txt.prototype.rollPulse = function(i, mouseInd) {
    if (this.roll) {
        var rows = Math.ceil(this.rows / 2);
        var strength = (mouseX - (width / 2)) / (this.size / 2);
        var dist = strength * 0.3 * this.range;
        var polarity = 1;
        if ((Math.floor(i/rows) % 2)===0) polarity = -polarity;
        this.rowOffsetDest[i] = (dist * polarity);
    }
};

Txt.prototype.rollVertSplit = function(i, mouseInd) {
    if (this.roll) {
        var rows = Math.ceil(this.rows / 6);
        var strength = (mouseX - (width / 2)) / (this.size / 2);
        var dist = strength * 17 * this.rowHeight;
        var polarity = 1;
        if ((Math.floor(i/rows) % 2)===0) polarity = -polarity;
        this.rowOffsetYDest[i] = (dist * polarity);
    }
};

Txt.prototype.rollBlockSway = function(i, mouseInd) {
    if (this.roll) {
        var rows = Math.ceil(this.rows / 6);
        var strength = (mouseX - (width / 2)) / (this.size / 2);
        var dist = strength * 2 * this.range;
        var n = this.noise.noise(500, (this.index2) + (Math.floor(i/rows)/15));
        this.rowOffsetDest[i] = dist * n;
    }
};


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------


Txt.prototype.draw = function() {

    var i, l;
    var ctx = this.ctx;
    //lens.ctx = this.ctx;
    var x = this.position.x + this.xOff;
    var y = this.position.y + this.yOff + (this.fontSize * 0.3);
    var rx = Math.round(x - (this.size/2));
    var ry = Math.round(y - (this.fontSize * 0.9));

    ctx.globalAlpha = 1;
    color.fill(ctx, foregroundCol);
    ctx.textAlign = 'center';
    ctx.font = this.fontStyle;


    // DRAW EACH ROW //
    for (i=0; i<this.rows; i++) {
        var bx = rx + this.rowOffset[i];
        var by = ry + (this.rowHeight * i);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + this.size, by);
        ctx.lineTo(bx + this.size, by + this.rowHeight);
        ctx.lineTo(bx, by + this.rowHeight);
        ctx.closePath();
        ctx.clip();

        ctx.fillText(this.string, x + this.rowOffset[i], y + this.rowOffsetY[i]);

        ctx.restore();
    }

};
