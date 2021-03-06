const $window = $(window)

/********************************************************************************
* IMG ANIMATION
********************************************************************************/
const animateImages = function () {
   $('.fade-image:not(.loaded-img-wrapper):not(.progress-animation)').each(function () {
      const el = this;
      if ($(el).offset().top < $window.scrollTop() + ($window.height() / 10) * 8) {
         $(el).addClass('loaded-img-wrapper');
      }
   });
};

function bindImageAnimations() {
   requestAnimationFrame(animateImages);
   $window.on('scroll', function () {
      requestAnimationFrame(animateImages);
   });
}


/********************************************************************************
* TEXT ANIMATION
********************************************************************************/
const animateText = function () {
   $('.fade-animation:not(.loaded-animation):not(.progress-animation)').each(function () {
      const el = this;
      if ($(el).offset().top < $window.scrollTop() + ($window.height() / 10) * 8) {
         $(el).addClass('loaded-animation');
      }
   });
};

function bindTextAnimations() {
   requestAnimationFrame(animateText);
   $window.on('scroll', function () {
      requestAnimationFrame(animateText);
   });
}


/********************************************************************************
* MOSAIC ANIMATION
********************************************************************************/
function arrayShuffle(a) {
   let j, x, i;
   for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
   }
}

function animateMosaic() {
   if ($('.mosaic-item').length > 0) {
      const items = [];
      $('.mosaic-item').each(function () {
         items.push($(this));
      });

      arrayShuffle(items);
      $(items).each(function (i, el) {
         setTimeout(function () {
            $(el).addClass('mosaic-loaded');
         }, 100 * i);
      });
   }
}



/********************************************************************************
* ONLOAD ANIMATION
********************************************************************************/
$window.on('load', function () {
   setTimeout(function () {
      $('body').addClass('content-loaded');
      $(this).remove();
      animateMosaic();
      bindImageAnimations();
      bindTextAnimations();
      $('.page-intro').addClass('intro-loaded');
   }, 300);
});
