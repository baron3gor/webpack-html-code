if ($('.pxr-header-top-line__btn, .pxr-sticky-top-line__btn').length) {
   $('.pxr-header-top-line__btn, .pxr-sticky-top-line__btn').on('click', function () {
      if ($('.pxr-side-mobile').is(':visible')) {
      }
      $('.pxr-side-mobile').addClass('pxr-side-menu-open');
      $('.pxr-sticky-top-line').removeClass('active');
   })

   $('.pxr-side-mobile__close').on('click', function () {
      $('.pxr-side-mobile').removeClass('pxr-side-menu-open');
   })
}

$(document).mouseup(function (e) {
   const sidemenu = $('.pxr-side-mobile');
   if (!sidemenu.is(e.target) && sidemenu.has(e.target).length === 0) {

      sidemenu.removeClass('pxr-side-menu-open');

   }
});