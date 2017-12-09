
//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

function Packshot(ctx, x, y, s, src, callback) {

    s = Math.floor(s);
    this.ctx = ctx;
    this.position = new Point(x, y);
    this.interactive = false;
    this.active = false;
    this.activationIndex = 0;
    this.activationCounter = 0;

    this.xOff = 0;
    this.yOff = 0;


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
        this.rowObjects.push( new RowObject(i));
    }

    if (this.callback) this.callback();
};




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


Packshot.prototype.update = function() {
    var i, n;
    var lerpSpeed = 10;

    for (i=0; i<this.rows; i++) {
        var row = this.rowObjects[i];
        row.revealOffset = lerp(row.revealOffset, row.active, lerpSpeed);
    }

    if (this.activationIndex < this.rows) {
        this.activationCounter++;
        if (this.activationCounter >= 2) {
            this.activationCounter = 0;
            this.rowObjects[this.activationIndex].active = this.active;
            this.activationIndex++;
        }
    }

    // mouse follow //
    var dist = 60;
    this.xOffDest = dist * mouseXNorm;
    this.yOffDest = dist * mouseYNorm;
    this.xOff = lerp(this.xOff, this.xOffDest, 5);
    this.yOff = lerp(this.yOff, this.yOffDest, 5);
};


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------


Packshot.prototype.draw = function() {
    if (this.width) {

        color.fill(this.ctx,bgCol);
        this.ctx.fillRect(0, 0, width, height);

        var i, l;

        var x = this.position.x + this.xOff;
        var y = this.top + this.yOff;
        var w = Math.round(this.width);


        var rx = Math.round(x - (w/2));
        var ry = Math.round(y);
        var rh = Math.round(this.rowHeight);

        var lrInd = this.rowObjects.length - 1;
        var firstRow = this.rowObjects[0];
        var lastRow = this.rowObjects[lrInd];

        /*var b = 20;
        this.ctx.clearRect(rx - b, ry - b, w + (b * 2), w + (b * 2));*/


        // not in transit, draw full image //
        if ( firstRow.revealOffset > 0.001 || lastRow.revealOffset > 0.001) {
            this.ctx.drawImage(this.img, rx, ry, w, rh * this.rows);
        }

        color.fill(this.ctx,palette[4]);
        for (i=0; i<this.rows; i++) {
            var row = this.rowObjects[i];
            var by = ry + (rh * i);
            if (row.revealOffset < 0.999) {
                this.ctx.fillRect(rx, by, w * (1-row.revealOffset), rh);
            }
        }
    }
};

//-------------------------------------------------------------------------------------------
//  ROW OBJECT
//-------------------------------------------------------------------------------------------


function RowObject(mi) {
    this.active = false;
    this.revealOffset = 0;
    this.delay = Math.round(Math.random() * 500);
    this.delay = mi * 50;
}
