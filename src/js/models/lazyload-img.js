if ("loading" in HTMLImageElement.prototype) {
   const images = document.querySelectorAll('img[loading="lazy"]');
   let sources = document.querySelectorAll("source[data-srcset]");
   sources.forEach(function (source) {
      source.srcset = source.dataset.srcset;
   });
   images.forEach(function (img) {
      img.src = img.dataset.src;
   });
} else {
   //if no support, async load the lazysizes plugin
   const script = document.createElement("script");
   script.async = true;
   script.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.1.8/lazysizes.min.js";
   document.body.appendChild(script);
}