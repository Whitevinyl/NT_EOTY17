var reveal = [];
var projectRevealElements = [];

$(document).ready(function() {

    $('#explore').hover(function() {
        $(this).parent().addClass('hover');
    }, function() {
        $(this).parent().removeClass('hover');
    });

    // REVEAL ON SCROLL //
    reveal = document.getElementsByClassName('c-hidden');
    var projectReveal = document.getElementById('project').getElementsByClassName('c-hidden');
    for (var i=0; i<projectReveal.length; i++) {
        projectRevealElements.push(projectReveal[i]);
    }
});



/*$(window).scroll(function(){
    var l = reveal.length;
    for (var i=(l-1); i>=0; i--) {
        if(reveal[i].getBoundingClientRect().top <= (window.innerHeight * 0.65)){
            reveal[i].classList.remove('c-hidden');
        }
    }
});*/
