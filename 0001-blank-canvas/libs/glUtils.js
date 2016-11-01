(function(global){

  var glUtils = {
    VERSION : '0.0.1',
    checkWebGL: function(canvas) {
      /**
       * Check if WebGL is available.
       **/
      var contexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"], gl;
      for (var i=0; i < contexts.length; i++) {
        try {
          gl = canvas.getContext(contexts[i]);
        } catch(e) {}
        if (gl) {
          break;
        }
      }
      if (!gl) {
        alert("WebGL not available, sorry! Please use a new version of Chrome or Firefox.");
      }
      return gl;
    },
  };

  // Expose glUtils globally
  global.glUtils = glUtils;

}(window || this));
