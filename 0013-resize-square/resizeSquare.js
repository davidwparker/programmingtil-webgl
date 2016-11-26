(function() {

  var canvas, gl, program;

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    initGlSize();

    // Initialize the shaders and program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment),
        program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    resizer();
  }

  function initGlSize() {
    var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
    // Fullscreen if not set
    if (width) {
      gl.maxWidth = width;
    }
    if (height) {
      gl.maxHeight = height;
    }
  }

  function draw() {
    // Clear to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw a point
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  function resizer() {
    /**
      * Callback for when the screen is resized
      **/

    // Scaling for a square!
    var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
    // Fullscreen if not set
    if (!width || width < 0) {
      canvas.width = window.innerWidth;
      gl.maxWidth = window.innerWidth;
    }
    if (!height || height < 0) {
      canvas.height = window.innerHeight;
      gl.maxHeight = window.innerHeight;
    }

    // scale down for smaller size
    var min = Math.min.apply( Math, [gl.maxWidth, gl.maxHeight, window.innerWidth, window.innerHeight]);
    canvas.width = min;
    canvas.height = min;

    // viewport!
    gl.viewport(0, 0, canvas.width, canvas.height);

    // redraw!
    draw();
  }

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizer);

})();
