

var typeNoise;
var ind = 0;
var inc = 0.03;
var scale = 10;

var panes = [];
var paneElements = [];
/*var swap = [];
var contract = [];
var walk = [];
var split = [];*/

function setupType() {

    typeNoise = new SimplexNoise();
    var i, l;

    paneElements = [];
    panes = document.getElementsByClassName('panes');
    l = panes.length;
    for (i=0; i<l; i++) {
        configurePane(panes[i]);
    }


    /*swap = document.getElementsByClassName('swap');
    l = swap.length;
    for (i=0; i<l; i++) {
        configureSwap(swap[i]);
    }


    contract = document.getElementsByClassName('contract');
    l = contract.length;
    for (i=0; i<l; i++) {
        configureContract(contract[i]);
    }

    walk = document.getElementsByClassName('walk');
    l = walk.length;
    for (i=0; i<l; i++) {
        configureWalk(walk[i]);
    }

    split = document.getElementsByClassName('split');
    l = split.length;
    for (i=0; i<l; i++) {
        configureSplit(split[i]);
    }*/


    document.body.style.opacity = '1';
    updateWebtype();

}

var count = 0;
function updateWebtype() {
    count--;
    if (count < 0) {
        paneRandomise();
        count = 5;
    }
}



function configurePane(element) {

    var str = element.innerHTML;
    var elWidth = element.offsetWidth;
    element.innerHTML = '';
    var data;

    element.setAttribute('data-str', str);


    // number of view panes //
    var n = 16;
    data = element.getAttribute('data-panes');
    if (data) n = parseFloat(data);
    //var perc = 100 / (n-1);
    var w = elWidth / n;
    //w = perc;


    // ammount of displacement //
    var d = 30;
    data = element.getAttribute('data-displace');
    if (data) d = parseFloat(data);

    /*layer =  document.createElement('div');
    layer.classList = 'stretchContainer';
    element.appendChild(layer);*/
    //var layer = element;

    // for each pane //
    for (var i=0; i<n; i++) {

        // text copy element //
        var txt = document.createElement('div');
        txt.innerHTML = str;
        txt.classList = 'panes-inner';
        if (data) txt.setAttribute('data-displace', '' + d);
        txt.style.left = '' + (-w * i) + 'px';
        txt.style.marginLeft = '0px';
        paneElements.push(txt);

        // view pane element //
        var pane = document.createElement('div');
        pane.innerHTML = ' ';
        pane.classList = 'panes-pane';
        pane.style.width = '' + w + 'px';

        if (i===0) pane.classList += ' panes-first';
        if (i===(n-1)) pane.classList += ' panes-last';

        // append to parent element //
        pane.appendChild(txt);
        element.appendChild(pane);
    }
}

function paneRandomise() {
    ind += inc;

    var l = paneElements.length;
    for (var i=0; i<l; i++) {
        var el = paneElements[i];

        // ammount of displacement //
        var d = 30;
        var data = el.getAttribute('data-displace');
        if (data) d = parseFloat(data);

        var dis = typeNoise.noise(ind + (i/scale), 0) * d;
        el.style.marginLeft = '' + dis + 'px';
    }
}

/*
function configureSwap(element) {

    var i, layer;

    // get data //
    var str = element.innerHTML;
    var chars = str.split('');
    element.innerHTML = '';
    element.setAttribute('data-str', str);


    var str2 = element.getAttribute('data-alt');
    str2 = str2 || '';
    var chars2 = str2.split('');


    // layer 2 //
    layer =  document.createElement('div');
    layer.classList = 'swapLayer';
    element.appendChild(layer);

    for (i=0; i<chars2.length; i++) {

        var wrap = document.createElement('div');
        wrap.classList = 'swapWrap';
        wrap.setAttribute('data-char', chars2[i]);

        var char = document.createElement('div');
        char.classList = 'swapChar swapCharB';
        char.innerHTML = chars2[i];

        wrap.appendChild(char);
        layer.appendChild(wrap);
    }


    // layer 1 //
    layer =  document.createElement('div');
    layer.classList = 'swapLayer';
    element.appendChild(layer);

    for (i=0; i<chars.length; i++) {

        var wrap = document.createElement('div');
        wrap.classList = 'swapWrap';
        wrap.setAttribute('data-char', chars[i]);

        var char = document.createElement('div');
        char.classList = 'swapChar swapCharA';
        char.innerHTML = chars[i];

        wrap.appendChild(char);
        layer.appendChild(wrap);
    }
}


function configureContract(element) {
    element.style.opacity = '1';
    element.style.letterSpacing = '0';
}



function configureSplit(element) {
    var i, layer;

    // get data //
    var str = element.innerHTML;
    element.innerHTML = '';
    element.setAttribute('data-str', str);

    // number of splits //
    var n = parseFloat(element.getAttribute('data-splits'));
    if (!n) n = 1;
    var h = 100 / (n + 1);
    var hs = '' + h + '%';

    // offset //
    var offset = parseFloat(element.getAttribute('data-offset'));
    if (!offset) offset = 1;

    // for each layer //
    for (i=0; i<=n; i++) {
        var child = document.createElement('div');
        child.classList = 'splitChild';
        child.setAttribute('data-str', str);
        child.style.top = '' + (h * i) + '%';
        child.style.height = hs;

        var inner = document.createElement('div');
        inner.classList = 'splitChildInner';
        inner.innerHTML = str;
        inner.style.top = '' + (-100 * i) + '%';
        inner.style.left = '' + tombola.range(-offset, offset) + 'px';

        child.appendChild(inner);
        element.appendChild(child);
    }
}



function configureWalk(element) {
    var walk = new Walker(element, 60);
}

function Walker(element,life) {
    this.x = 0;
    this.y = 0;
    this.vector = {x: tombola.range(-5,5), y: tombola.range(-5,5)};
    this.scale = 1;
    this.ind = 0;
    this.life = life;
    this.element = element;
    this.str = this.element.innerHTML;
    this.element.innerHTML = '';
    this.element.setAttribute('data-str', this.str);
    this.noise = new SimplexNoise();
    this.walk();
}

Walker.prototype.walk = function() {

    // create element //
    var step = document.createElement('div');
    step.innerHTML = this.str;
    step.classList = 'walkStep';
    if (this.ind < this.life && (this.ind % 6) !== 0) step.classList += ' walkAlt';
    step.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px) scale(' + this.scale + ', ' + this.scale + ')';
    this.element.appendChild(step);


    var r = 2;
    this.vector.x += tombola.rangeFloat(-r, r);
    this.vector.y += tombola.rangeFloat(-r, r);

    var max = 5;
    this.vector.x = constrain(this.vector.x, -max, max);
    this.vector.y = constrain(this.vector.y, -max, max);

    this.x += this.vector.x;
    this.y += this.vector.y;

    d = 20;
    s = 0.5;
    var sn = this.noise.noise(this.ind/d, 0);
    if (sn < 0) {
        sn *= 0.25;
    } else {
        sn *= 1.5;
    }
    this.scale = 1 + (sn * s);



    // continue //
    this.ind++;
    if (this.ind <= this.life) {
        var me = this;
        setTimeout(function() {
            me.walk();
        },20);
    }
};
*/


// LOCK A VALUE WITHIN GIVEN RANGE //
function constrain(value,floor,ceiling) {
    value = Math.max(floor, value);
    value = Math.min(ceiling, value);
    return value;
}
