$(window).on('scroll', function() {
    if($(document).scrollTop() > 40) {
        $('.pxr-sticky-top-line').addClass('active');
        $('.pxr-side-mobile').removeClass('pxr-side-menu-open');
    } else {
        $('.pxr-sticky-top-line').removeClass('active');   
        $('.pxr-side-mobile').removeClass('pxr-side-menu-open');
    }
});