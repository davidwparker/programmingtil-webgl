(function(global) {

  var canvas, gl, program;

  glUtils.SL.init({ callback:function() { main(); } });
  function main() {
    window.addEventListener('resize', resizer);

    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    // Initialize the shaders and program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);

    program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    resizer();
  }

  // draw!
  function draw() {
    var n = initBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }

    gl.clearColor(0, 0, 0, 1);
    // NOTE: remember the colorMask?
    gl.colorMask(true,true,true,true);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
  }

  function initBuffers(gl) {
    var vertices = new Float32Array([
      0.0, 0.0,
      -0.5, +0.0,
      -0.5, +0.5,
      -0.25, +0.75,
      0.0, +0.75,
      +0.25, +0.5
    ]);
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    // Assign the buffer object to aPosition variable
    // https://www.khronos.org/opengles/sdk/docs/man/xhtml/glVertexAttribPointer.xml
    // index, size, type, normalized, stride, pointer
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // Do it all again for the color buffer
    var colors = new Float32Array([
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 0.5,
      0.0, 0.0, 1.0, 1.0
    ]);
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    var aColor = gl.getAttribLocation(program, 'aColor');
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    // gl.disableVertexAttribArray(aColor);

    return n;
  }

  function resizer() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    draw();
  }

})(window || this);
