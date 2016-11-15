(function() {

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    // Get canvas element and check if WebGL enabled
    var canvas1 = document.getElementById("glcanvas1"),
        canvas2 = document.getElementById("glcanvas2"),
        canvas3 = document.getElementById("glcanvas3"),
        canvas4 = document.getElementById("glcanvas4"),
        gl1 = glUtils.checkWebGL(canvas1),
        gl2 = glUtils.checkWebGL(canvas2),
        gl3 = glUtils.checkWebGL(canvas3),
        gl4 = glUtils.checkWebGL(canvas4);

    // Initialize the shaders
        // Initialize the shaders and program
    var vertexShader1 = glUtils.getShader(gl1, gl1.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        vertexShader2 = glUtils.getShader(gl2, gl1.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        vertexShader3 = glUtils.getShader(gl3, gl1.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        vertexShader4 = glUtils.getShader(gl4, gl1.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader1 = glUtils.getShader(gl1, gl1.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment),
        fragmentShader2 = glUtils.getShader(gl2, gl1.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment),
        fragmentShader3 = glUtils.getShader(gl3, gl1.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment),
        fragmentShader4 = glUtils.getShader(gl4, gl1.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment),
        program1 = glUtils.createProgram(gl1, vertexShader1, fragmentShader1),
        program2 = glUtils.createProgram(gl2, vertexShader2, fragmentShader2),
        program3 = glUtils.createProgram(gl3, vertexShader3, fragmentShader3),
        program4 = glUtils.createProgram(gl4, vertexShader4, fragmentShader4);

    gl1.useProgram(program1);
    gl2.useProgram(program2);
    gl3.useProgram(program3);
    gl4.useProgram(program4);

    // Clear to black, red, green, blue
    gl1.clearColor(0.0, 0.0, 0.0, 1.0);
    gl2.clearColor(1.0, 0.0, 0.0, 1.0);
    gl3.clearColor(0.0, 1.0, 0.0, 1.0);
    gl4.clearColor(0.0, 0.0, 1.0, 1.0);

    // Clear canvas
    gl1.clear(gl1.COLOR_BUFFER_BIT);
    gl2.clear(gl2.COLOR_BUFFER_BIT);
    gl3.clear(gl3.COLOR_BUFFER_BIT);
    gl4.clear(gl4.COLOR_BUFFER_BIT);

    // Draw a point
    gl1.drawArrays(gl1.POINTS, 0, 1);
    gl2.drawArrays(gl2.POINTS, 0, 1);
    gl3.drawArrays(gl3.POINTS, 0, 1);
    gl4.drawArrays(gl4.POINTS, 0, 1);
  }

})();
