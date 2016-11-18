(function(global){

  var glUtils = {
    VERSION : '0.0.1x',
    checkWebGL: function(canvas) {
      /**
       * Check if WebGL is available.
       **/
      var contexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"], gl;
      for (var i=0; i < contexts.length; i++) {
        try {
          gl = canvas.getContext(contexts[i]);

          // Note: we'll be moving this block in a later episode
          if (!canvas.getAttribute("width") || canvas.getAttribute("width") < 0) {
            canvas.width = window.innerWidth;
          }
          if (!canvas.getAttribute("height") || canvas.getAttribute("height") < 0) {
            canvas.height = window.innerHeight;
          }
        } catch(e) {}
        if (gl) {
          break;
        }
      }
      if (!gl) {
        alert("WebGL not available, sorry! Please use a new version of Chrome or Firefox.");
      }
      return gl;
    }
  };

  // Expose glUtils globally
  global.glUtils = glUtils;

}(window || this));
