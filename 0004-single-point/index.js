(function() {

  var VSHADER_SOURCE =
      'void main() {\n' +
      '  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' + // Set the vertex coordinates of the point
      '  gl_PointSize = 10.0;\n' +                    // Set the point size
      '}\n';

  var FSHADER_SOURCE =
      'void main() {\n' +
      '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the point color
      '}\n';

  // Get canvas element and check if WebGL enabled
  var canvas = document.getElementById("glcanvas"),
      gl = glUtils.checkWebGL(canvas),

      // Initialize the shaders and program
      vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE),
      fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE),
      program = glUtils.createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  // Clear to black
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a point
  gl.drawArrays(gl.POINTS, 0, 1);

})();
