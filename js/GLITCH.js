//-------------------------------------------------------------------------------------------
//  GLITCH
//-------------------------------------------------------------------------------------------

function Glitch() {
    this.glitches = [];
    this.chance = 0;
    this.glitchable = false;
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

Glitch.prototype.update = function() {

    if (this.glitchable) {

        // UPDATE GLITCH CHANCE //
        this.chance -= 3;
        if (this.chance < 0) this.chance = 0;
        //if (tombola.chance(1,250)) this.chance = tombola.range(1,40);

        // CREATE GLITCH CHILD //
        if (tombola.chance(this.chance, 200)) {
            var x = tombola.range(0, width);
            var y = tombola.range(0, height);
            this.glitches.push(new GlitchRect(this.glitches, x, y));
        }

        // UPDATE CHILDREN //
        var l = this.glitches.length;
        for (var i=l-1; i>=0; i--) {
            this.glitches[i].update();
        }

    }
};


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------

Glitch.prototype.draw = function() {

    // DRAW CHILDREN //
    var l = this.glitches.length;
    for (var i=l-1; i>=0; i--) {
        this.glitches[i].draw();
    }
};


//-------------------------------------------------------------------------------------------
//  GLITCH RECT
//-------------------------------------------------------------------------------------------

function GlitchRect(parentArray, x, y, strong) {
    this.parentArray = parentArray;
    this.col = tombola.item(glitchCols);
    this.col.A = tombola.rangeFloat(0.3,1);
    this.strong = false;


    this.x = x;
    this.y = y;
    this.w = tombola.range(5, 1200);
    this.h = tombola.range(1, 65);
    this.direction = tombola.item([-1, 1]);
    this.decay = this.w / tombola.range(4, 20);
    this.style = tombola.range(0,1);

    if (strong) {
        this.strong = true;
        this.col.A = 1;
        //if (tombola.percent(20)) this.col = bgCol;
        this.direction = 1;
        this.w = tombola.range(500, 1000);
        this.h = tombola.range(20, 110);

        this.y += tombola.range(-50, 50) - (this.h / 2);
        this.x += tombola.range(-100, 100) - (this.w / 2);
        this.decay = this.w / tombola.range(10, 30);
    }
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

GlitchRect.prototype.update = function() {
    this.w -= this.decay;
    var r = 50;
    if (this.strong) r = 3;
    this.x += tombola.range(-r, r);
    this.y += tombola.range(-r/4, r/4);
    if (this.w < 0) removeFromArray(this, this.parentArray);
};


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------

GlitchRect.prototype.draw = function() {

    switch (this.style) {

        case 0:
        color.fill(ctx,this.col);
        ctx.fillRect(this.x, this.y, this.w * this.direction, this.h);
        break;

        case 1:
        color.stroke(ctx,this.col);
        ctx.lineWidth = 2 * ratio;
        diagonalFill(ctx,this.x, this.y, this.w * this.direction, this.h, 20);
        break;

    }

};


function diagonalFill(ct, x, y, w, h, s) {
    var ctx = this.Ctx;
    var lineNo = Math.round((w + h) / (s));
    var pos1 = new Point(0,0);
    var pos2 = new Point(0,0);

    if (w < 0) {
        x += w;
        w = -w;
    }

    ct.beginPath();
    for (var j=0; j<lineNo; j++) {
        pos1.x = (s / 2) + (s * j);
        pos1.y = 0;
        pos2.x = pos1.x - h;
        pos2.y = h;
        if (pos2.x < 0) {
            pos2.y = h + pos2.x;
            pos2.x = 0;
        }
        if (pos1.x > w) {
            pos1.y = (pos1.x - w);
            pos1.x = w;
        }
        ct.moveTo(x + pos1.x, y + pos1.y);
        ct.lineTo(x + pos2.x, y + pos2.y);
    }
    ct.stroke();
}
