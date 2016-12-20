(function(global) {

  // Get canvas element and check if WebGL enabled
  var canvas = document.getElementById("glcanvas"),
      gl = glUtils.checkWebGL(canvas);

  function resizer() {
    /**
     * Callback for when the screen is resized
     **/
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    console.log('resized');
  }

  // Register window and document callbacks
  window.addEventListener('resize',resizer);

  // set the size and viewport
  resizer();

  // Clear to blue
  gl.clearColor(0.0, 0.0, 1.0, 1.0);

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

})(window || this);
