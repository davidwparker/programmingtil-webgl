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
    var uFragColor = gl.getUniformLocation(program, 'uFragColor');

    // UI events
    canvas.addEventListener('mousedown', function(event) { onmousedown(event, aPosition, uFragColor); });

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  // draw!
  function draw(aPosition, uFragColor) {

    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = points.length;
    for(var i = 0; i < len; i++) {
      var point = points[i], color = point.c;

      // Pass the position of a point to aPosition
      gl.vertexAttrib3f(aPosition, point.x, point.y, 0.0);

      // Pass the color of a point to uFragColor
      gl.uniform4f(uFragColor, color[0], color[1], color[2], color[3]);

      // Draw
      gl.drawArrays(gl.POINTS, 0, 1);
    }

  }

  // UI Events
  function onmousedown(event, aPosition, uFragColor) {
    var point = uiUtils.pixelInputToGLCoord(event, canvas);
    point.c = [Math.random(), Math.random(), Math.random(), 1.0];
    points.push(point);
    draw(aPosition, uFragColor);
  }

})(window || this);
