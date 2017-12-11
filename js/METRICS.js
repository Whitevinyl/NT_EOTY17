

//-------------------------------------------------------------------------------------------
//  METRICS
//-------------------------------------------------------------------------------------------

function metrics(first) {

    // GET DISPLAY DIMENSIONS //
    pageHeight = page.scrollHeight;
    viewHeight = window.innerHeight;
    ratio = window.devicePixelRatio;
    width = window.innerWidth * ratio;
    height = window.innerHeight * ratio;


    // SET CANVAS DIMENSIONS //
    canvas.width  = width;
    canvas.height = height;
    canvas2.width  = width;
    canvas2.height = height;


    // ASPECT //
    if (width > (height)) {
        device = 'desktop';
    } else {
        device = 'mobile';
    }

    // AT THE END OF CONTINUOUS RESIZING //
    if (!first) {
        if (metricTimer) clearTimeout(metricTimer);
        metricTimer = setTimeout(function() {
            if (logo) resetLogo();
            if (packshot) resetPackshot();
            if (txt) resetTxt();
            resizeScroll();
        },500);
    }
    else {
        resizeScroll();
    }
}

function resizeScroll() {
    if (device==='mobile') {
        if (txtScroll !== 200) {
            introScroll = txtScroll = 200;
            calculateScrollSpace();
            pageScroll();
        }
    } else {
        if (txtScroll !== 600) {
            introScroll = txtScroll = 600;
            calculateScrollSpace();
            pageScroll();
        }
    }
}
