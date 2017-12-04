// GENERATE GRID //
function drawGrid(settings) {

    // calculate column width //
    var gridW = window.innerWidth - (settings.margin*2) - settings.gutter;
    var colW = Math.round((gridW / settings.columns) - settings.gutter);

    // create grid //
    var grid = document.createElement('div');
    grid.classList = 'grid';
    grid.style.padding = `${settings.margin}px`;
    grid.style.color = `${settings.color}`;
    document.body.appendChild(grid);

    // create inner //
    var gridInner = document.createElement('div');
    gridInner.classList = 'grid-inner';
    grid.appendChild(gridInner);

    // vertical & horizontal rule //
    var gridH = document.createElement('div');
    gridH.classList = 'grid-h';
    gridInner.appendChild(gridH);
    var gridV = document.createElement('div');
    gridV.classList = 'grid-v';
    gridInner.appendChild(gridV);

    // create columns //
    for (var i=0; i<settings.columns; i++) {
        var col = document.createElement('div');
        col.classList = 'grid-column';
        col.style.width = `calc(${100/settings.columns}% - ${settings.gutter}px)`;
        gridInner.appendChild(col);
    }
}

// CHECK PAGE FOR <draw-grid> //
// PARSE SETTINGS  & GENERATE //
$(document).ready(function() {
    var draw = document.getElementsByTagName('draw-grid')[0];
    if (draw) {
        var settings = {
            margin: parseInt(draw.getAttribute('data-margin')) || 20,
            gutter: parseInt(draw.getAttribute('data-gutter')) || 20,
            columns: parseInt(draw.getAttribute('data-columns')) || 12,
            color: draw.getAttribute('data-color') || '#33ccff'
        }
        draw.style.display = 'none';
        drawGrid(settings);
    }
});
