(function() {

  // Get canvas element and check if WebGL enabled
  var canvas1 = document.getElementById("glcanvas1"),
      canvas2 = document.getElementById("glcanvas2"),
      canvas3 = document.getElementById("glcanvas3"),
      canvas4 = document.getElementById("glcanvas4"),
      gl1 = glUtils.checkWebGL(canvas1),
      gl2 = glUtils.checkWebGL(canvas2),
      gl3 = glUtils.checkWebGL(canvas3),
      gl4 = glUtils.checkWebGL(canvas4);

  // Clear to black
  gl1.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear canvas
  gl1.clear(gl1.COLOR_BUFFER_BIT);

  // Clear to red
  gl2.clearColor(1.0, 0.0, 0.0, 1.0);

  // Clear canvas
  gl2.clear(gl2.COLOR_BUFFER_BIT);

  // Clear to green
  gl3.clearColor(0.0, 1.0, 0.0, 1.0);

  // Clear canvas
  gl3.clear(gl3.COLOR_BUFFER_BIT);

  // Clear to blue
  gl4.clearColor(0.0, 0.0, 1.0, 1.0);

  // Clear canvas
  gl4.clear(gl4.COLOR_BUFFER_BIT);

})();
