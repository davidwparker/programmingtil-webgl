(function() {

  var canvas = document.getElementById("glcanvas"),
      gl = glUtils.checkWebGL(canvas);

  // Clear to black
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

})();
