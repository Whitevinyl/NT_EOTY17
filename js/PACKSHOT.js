
//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

function Packshot(ctx, x, y, s, src, callback) {

    s = Math.floor(s);
    this.ctx = ctx;
    this.position = new Point(x, y);
    this.firstUpdate = true;
    this.interactive = false;
    this.active = false;
    this.activationIndex = 0;
    this.activationCounter = 0;


    // load img & start once done //
    this.img = new Image();
    var me = this;
    this.img.onload = function() {
        me._begin(s);
    };
    this.img.src = src;


    // rows //
    this.rows = 0;
    this.quality = s/20;
    this.rowObjects = [];


    // noise //
    this.index1 = 100;
    this.index2 = 200;
    this.index3 = 300;
    this.noise = new SimplexNoise();
    this.range = height / 11;
    this.amp = 0;
    this.ampDest = 1;

    this.callback = callback;
}


// CALLBACK ONCE IMAGE LOADS //
Packshot.prototype._begin = function(s) {
    this.width = s;
    this.height = s;
    this.imgHeight = this.img.height;
    this.imgWidth = this.img.width;

    this.rows = this.height / this.quality;
    this.imgRowHeight = Math.floor(this.imgHeight / this.rows);
    this.rowHeight = Math.floor(this.height / this.rows);
    this.top = this.position.y - (this.height / 2);

    // initial offset //
    for (var i=0; i<this.rows; i++) {
        this.rowObjects.push( new RowObject(createImageStrip(this.img, this.imgWidth, this.imgRowHeight, i), i));
    }

    if (this.callback) this.callback();
};


// TODO: strip these canvases out or resuse them once done //
function createImageStrip(img, w, rh, index) {
    var cvs = document.createElement('canvas');
    cvs.width = w;
    cvs.height = rh;
    cvs.getContext('2d').drawImage(img, 0, -rh * index);
    return cvs;
}


//-------------------------------------------------------------------------------------------
//  ACTIVATION
//-------------------------------------------------------------------------------------------


Packshot.prototype.activate = function() {
    if (!this.active) {
        this.active = true;
        this.activationIndex = 0;
        this.activationCounter = -20;
    }
};


Packshot.prototype.deactivate = function() {
    if (this.active) {
        this.active = false;
        this.activationIndex = 0;
        this.activationCounter = 0;
    }
};


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

// we calculate displacement for each row //
Packshot.prototype.update = function() {

    var i, n;
    var lerpSpeed = 50;
    lerpSpeed = 10;

    var speed = 0.5;
    var rh = this.rowHeight / ratio;


    this.index1 += (0.002 * speed);
    this.index2 += (0.005 * speed);


    // interaction amp //
    if (this.width) {
        var hw = this.width / 2;
        var mouseAmp = 1 - Math.abs(Math.round(mouseX - this.position.x) / hw);
        mouseAmp = constrain(mouseAmp, 0, 1);
        this.amp = lerp(this.amp, mouseAmp, lerpSpeed);
    }


    for (i=0; i<this.rows; i++) {

        var row = this.rowObjects[i];

        // display distortion //
        if (row.active) {
            var ind1 = this.index1 + (i/30);
            var ind2 = this.index2 + (i/15);
            n = (this.noise.noise(ind1, ind1) + this.noise.noise(ind2, ind2)) / 2;
            row.offsetDest = n * this.range;
        }
        // display straight //
        else {
            row.offsetDest = 0;
        }

        row.offset = lerp(row.offset, row.offsetDest, lerpSpeed);
        row.revealOffset = lerp(row.revealOffset, row.active, lerpSpeed);
    }



    this.firstUpdate = false;

    if (this.activationIndex < this.rows) {
        this.activationCounter++;
        if (this.activationCounter >= 2) {
            this.activationCounter = 0;
            this.rowObjects[this.activationIndex].active = this.active;
            this.activationIndex++;
        }
    }
};


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------


/*Packshot.prototype.draw = function() {
    if (this.width) {
        var i, l;

        var x = this.position.x;
        var y = this.top;

        var rx = Math.round(x);
        var ry = Math.round(y);

        var w = this.width;
        var hw = w/2;
        var lrInd = this.rowObjects.length - 1;
        var firstRow = this.rowObjects[0];
        var lastRow = this.rowObjects[lrInd];

        // STATIC IMAGE //
        if (this.amp < 0.001 && firstRow.revealOffset > 0.999 && lastRow.revealOffset > 0.999) {
            // DRAW EACH ROW //
            for (i=0; i<this.rows; i++) {
                var row = this.rowObjects[i];
                var by = ry + (this.rowHeight * i);
                this.ctx.fillRect(x + (row.offset * 1.8 * (0.5 + (this.amp/2))) - hw, by, w, this.rowHeight);
            }

            this.ctx.drawImage(this.img, x - hw, y, w, this.rowHeight * this.rows);

        }

        // ANIMATED //
        else {
            // DRAW EACH ROW //
            for (i=0; i<this.rows; i++) {

                var row = this.rowObjects[i];
                var by = ry + (this.rowHeight * i);
                this.ctx.fillRect(x + (row.offset * 1.8 * (0.5 + (this.amp/2))) - hw, by, w, this.rowHeight);


                if (row.revealOffset > 0.001) {

                    // in transit //
                    if (row.revealOffset < 0.999) {
                        this.ctx.drawImage(row.img,
                            -this.imgWidth * (1-row.revealOffset), 0, this.imgWidth, this.imgRowHeight,
                            x + (row.offset * this.amp) - hw, by, w, this.rowHeight);
                    }
                    // full //
                    else {
                        this.ctx.drawImage(row.img, x + (row.offset * this.amp) - hw, by, w, this.rowHeight);
                    }
                }
            }
        }
    }
};*/

/*Packshot.prototype.draw = function() {
    if (this.width) {
        var i, l;

        var x = this.position.x;
        var y = this.top;

        var rx = Math.round(x);
        var ry = Math.round(y);

        var w = this.width;
        var hw = w/2;
        var lrInd = this.rowObjects.length - 1;
        var firstRow = this.rowObjects[0];
        var lastRow = this.rowObjects[lrInd];
        var rowAmp = 1.8 * (0.3 + (this.amp * 0.7));

        color.fill(ctx2,palette[4]);

        // DRAW EACH ROW //
        for (i=0; i<this.rows; i++) {
            var row = this.rowObjects[i];
            var by = ry + (this.rowHeight * i);
            this.ctx.fillRect(x + (row.offset * rowAmp) - hw, by, w, this.rowHeight);

            // in transit, draw clipped row image //
            if (row.revealOffset > 0.001 && row.revealOffset < 0.999) {
                this.ctx.drawImage(row.img,
                    -this.imgWidth * (1-row.revealOffset), 0, this.imgWidth, this.imgRowHeight,
                    x + (row.offset * this.amp) - hw, by, w, this.rowHeight);
            }

        }

        // not in transit, draw full image //
        if ( firstRow.revealOffset > 0.999 && lastRow.revealOffset > 0.999) {
            this.ctx.drawImage(this.img, x - hw, y, w, this.rowHeight * this.rows);
        }

        color.fill(ctx2,bgCol);

        if (this.amp > 0.001) {
            for (i=0; i<this.rows; i++) {
                var row = this.rowObjects[i];
                var by = ry + (this.rowHeight * i);
                var anchor = Math.round(hw * Math.sign(row.offset));
                this.ctx.fillRect(x - anchor, by, (row.offset * this.amp), this.rowHeight);
            }
        }

    }
};*/

Packshot.prototype.draw = function() {
    if (this.width) {
        var i, l;

        var x = this.position.x;
        var y = this.top;

        var rx = Math.round(x);
        var ry = Math.round(y);

        var w = Math.round(this.width);
        var hw = Math.round(w/2);
        var lrInd = this.rowObjects.length - 1;
        var firstRow = this.rowObjects[0];
        var lastRow = this.rowObjects[lrInd];
        var rowAmp = 1.8 * (0.3 + (this.amp * 0.7));

        // not in transit, draw full image //
        if ( firstRow.revealOffset > 0.001 || lastRow.revealOffset > 0.001) {
            this.ctx.drawImage(this.img, x - hw, y, w, this.rowHeight * this.rows);
        }

        for (i=0; i<this.rows; i++) {
            var row = this.rowObjects[i];
            var by = ry + (this.rowHeight * i);
            var anchor = Math.round(hw * Math.sign(row.offset));

            if (this.amp > 0.001) {
                color.fill(ctx2,bgCol);
                this.ctx.fillRect(x - anchor, by, (row.offset * this.amp), this.rowHeight);
            }

            color.fill(ctx2,palette[4]);
            this.ctx.fillRect(x + anchor, by, (row.offset * rowAmp), this.rowHeight);

            if (row.revealOffset < 0.999) {
                this.ctx.fillRect(x - hw + (row.offset * this.amp), by, w * (1-row.revealOffset), this.rowHeight);
            }

        }


    }
};

//-------------------------------------------------------------------------------------------
//  ROW OBJECT
//-------------------------------------------------------------------------------------------


function RowObject(img, mi) {
    this.active = false;
    this.offset = 0;
    this.offsetDest = 0;
    this.revealOffset = 0;
    this.delay = Math.round(Math.random() * 500);
    this.delay = mi * 50;
    this.img = img;
}
