(function() {

  glUtils.SL.sourceFromHtml();
  var VSHADER_SOURCE = glUtils.SL.Shaders.v1.vertex;
  var FSHADER_SOURCE = glUtils.SL.Shaders.v1.fragment;

  // Get canvas element and check if WebGL enabled
  var canvas = document.getElementById("glcanvas"),
      gl = glUtils.checkWebGL(canvas);

  // Initialize the shaders and program
  var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE),
      fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE),
      program = glUtils.createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  // Clear to black
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a point
  gl.drawArrays(gl.POINTS, 0, 1);

}());
