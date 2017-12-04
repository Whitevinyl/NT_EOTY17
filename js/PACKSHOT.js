
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


    this.rows = 0;
    this.quality = s/20;


    this.index1 = 100;
    this.index2 = 200;
    this.index3 = 300;

    // displacement distances //
    this.range = 100;
    this.rowObjects = [];
    this.rowOffset = [];
    this.rowOffsetDest = [];
    this.rowReveal = [];
    this.rowSpeed = [];

    this.noise = new SimplexNoise();

    this.imageStrips = [];

    this.callback = callback;
}


Packshot.prototype._begin = function(s) {
    this.width = s;
    this.height = s;
    this.imgHeight = this.img.height;
    this.imgWidth = this.img.width;

    this.rows = Math.min(800, this.height / this.quality);
    this.imgRowHeight = Math.floor(this.imgHeight / this.rows);
    this.rowHeight = Math.floor(this.height / this.rows);
    this.top = this.position.y - (this.height / 2);

    // initial offset //
    for (var i=0; i<this.rows; i++) {
        /*this.rowOffset.push( 0 );
        this.rowOffsetDest.push( 0 );
        this.rowReveal.push( 0 );
        this.rowSpeed.push(0.5 + Math.random());
        this.imageStrips.push( createImageStrip(this.img, this.imgWidth, this.imgRowHeight, i) );*/

        this.rowObjects.push( new RowObject(createImageStrip(this.img, this.imgWidth, this.imgRowHeight, i), i));
    }

    //console.log(this.imageStrips);

    if (this.callback) this.callback();
};


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


function createImageStrip(img, w, rh, index) {
    var cvs = document.createElement('canvas');
    cvs.width = w;
    cvs.height = rh;
    cvs.getContext('2d').drawImage(img, 0, -rh * index);
    return cvs;
}



// we calculate displacement for each row //
Packshot.prototype.update = function() {

    var i, n;
    var lerpSpeed = 50;
    lerpSpeed = 10;

    var speed = 0.5;
    var rh = this.rowHeight / ratio;


    this.index1 += (0.002 * speed);
    this.index2 += (0.005 * speed);
    this.index3 += (0.003 * speed);

    var y = this.top;
    //var mouseInd = Math.round((mouseY - y) / this.rowHeight);


    /*for (i=0; i<this.rows; i++) {

        if (this.focus) {
            var ind1 = this.index1 + (i/(600 / rh));
            var ind2 = this.index2 + (i/(300 / rh));
            n = (this.noise.noise(ind1, ind1) + this.noise.noise(ind2, ind2)) / 2;
            this.rowOffsetDest[i] = n * this.range;
        } else {
            this.rowOffsetDest[i] = 0;
        }

        this.rowOffset[i] = lerp(this.rowOffset[i], this.rowOffsetDest[i], lerpSpeed);
        this.rowReveal[i] = lerp(this.rowReveal[i], this.focus, 10 * this.rowSpeed[i]);
    }*/

    for (i=0; i<this.rows; i++) {

        var row = this.rowObjects[i];

        // display distortion //
        if (row.active) {
            var ind1 = this.index1 + (i/(600 / rh));
            var ind2 = this.index2 + (i/(300 / rh));
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
        if (this.activationCounter >= 3) {
            this.activationCounter = 0;
            this.rowObjects[this.activationIndex].active = this.active;
            this.activationIndex++;
        }
    }
};


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------


Packshot.prototype.draw = function() {
    if (this.img) {
        var i, l;

        var x = this.position.x;
        var y = this.top;

        var rx = Math.round(x);
        var ry = Math.round(y);

        /*var imgRh = this.imgHeight / (this.rows-1);
        var rh = this.height / (this.rows);*/

        // DRAW EACH ROW //
        for (i=0; i<this.rows; i++) {

            var row = this.rowObjects[i];

            var w = this.width;
            var hw = w/2;
            //var bx = rx + this.rowOffset[i] - hw;
            var by = ry + (this.rowHeight * i);


            /*this.ctx.fillRect(x + (this.rowOffset[i] * 1.8) - hw, by, w, this.rowHeight);

            if (this.rowReveal[i] > 0.001) {

                // in transit //
                if (this.rowReveal[i] < 0.999) {
                    this.ctx.drawImage(this.imageStrips[i],
                        -this.imgWidth * (1-this.rowReveal[i]), 0, this.imgWidth, this.imgRowHeight,
                        x + this.rowOffset[i] - hw, by, w, this.rowHeight);
                }
                // full //
                else {
                    this.ctx.drawImage(this.imageStrips[i], x + this.rowOffset[i] - hw, by, w, this.rowHeight);
                }

            }*/

            this.ctx.fillRect(x + (row.offset * 1.8) - hw, by, w, this.rowHeight);

            //console.log(row.revealOffset);
            if (row.revealOffset > 0.001) {

                // in transit //
                if (row.revealOffset < 0.999) {
                    this.ctx.drawImage(row.img,
                        -this.imgWidth * (1-row.revealOffset), 0, this.imgWidth, this.imgRowHeight,
                        x + row.offset - hw, by, w, this.rowHeight);
                }
                // full //
                else {
                    //this.ctx.drawImage(row.img, x + row.offset - hw, by, w, this.rowHeight);
                    this.ctx.drawImage(row.img, x - hw, by, w, this.rowHeight);
                }

            }



            /*this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(bx, by);
            this.ctx.lineTo(bx + w, by);
            this.ctx.lineTo(bx + w, by + this.rowHeight);
            this.ctx.lineTo(bx, by + this.rowHeight);
            this.ctx.closePath();
            this.ctx.clip();

            this.ctx.drawImage(this.img, x + this.rowOffset[i] - hw, y, w, this.height);

            this.ctx.restore();*/

            /*this.ctx.fillRect(x + (this.rowOffset[i] * 1.8) - hw, by, w, this.rowHeight);
            this.ctx.drawImage(this.img,
                0, this.imgRowHeight * i, this.imgWidth, this.imgRowHeight,
                 x + this.rowOffset[i] - hw, by, w, this.rowHeight);*/
        }
    }
};

function RowObject(img, mi) {
    this.active = false;
    this.offset = 0;
    this.offsetDest = 0;
    this.revealOffset = 0;
    this.delay = Math.round(Math.random() * 500);
    this.delay = mi * 50;
    this.img = img;
}

/*RowObject.prototype.activate = function() {
    if (this.timer) clearTimeout(this.timer);
    var that = this;
    this.timer = setTimeout(function() {
        that.active = true;
    }, this.delay);
};

RowObject.prototype.deactivate = function() {
    if (this.timer) clearTimeout(this.timer);
    var that = this;
    this.timer = setTimeout(function() {
        that.active = false;
    }, this.delay);
};*/
