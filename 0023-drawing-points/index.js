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
    canvas.addEventListener('mousedown', function(event) { onmousedown(event, aPosition); });

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  // draw!
  function draw(aPosition) {

    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = points.length;
    for(var i = 0; i < len; i++) {

      // Pass the position of a point to a_Position variable
      gl.vertexAttrib3f(aPosition, points[i].x, points[i].y, 0.0);

      // Draw
      gl.drawArrays(gl.POINTS, 0, 1);
    }

  }

  // UI Events
  function onmousedown(event, aPosition) {
    var point = uiUtils.pixelInputToGLCoord(event, canvas);
    points.push(point);
    draw(aPosition);
  }

})(window || this);
