(function() {

  var canvas = document.getElementById("glcanvas"),
      gl = glUtils.checkWebGL(canvas);

  console.log(gl.getContextAttributes());
  console.log(gl);

  // Clear to black
  gl.clearColor(1.0, 0.0, 0.0, 1.0);

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
})();
