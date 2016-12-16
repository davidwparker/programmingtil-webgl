(function(global) {

  var canvas, gl, program, points = [];

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    // Initialize the shaders and program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);

    program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    var aPosition = gl.getAttribLocation(program, 'aPosition');

    // UI events
    canvas.addEventListener('mousedown', function(event) { onmousedown(event, points); });

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  // UI Events
  function onmousedown(event, points) {

    // find x and y of click
    var x = event.clientX, y = event.clientY;

    // canvas midX and midY
    var midX = canvas.width/2, midY = canvas.height/2;

    // get bounding box of the mouse click's target (canvas object)
    var rect = event.target.getBoundingClientRect();

    // convert the x and y value to webgl space
    // desired = -1.0 to +1.0
    // (x - 0) - midpoint => -/+ of 0 (-320 to +320) => / midpoint = -1.0 to +1.0
    x = ((x - rect.left) - midX) / midX;

    // midpoint - (y-0) => -/+ of 0 (-240 to +240) => / midpoint = -1.0 to +1.0
    y = (midY - (y - rect.top)) / midY;

    console.log(x + "  " + y);
  }

})(window || this);
