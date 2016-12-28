(function(global) {

  var canvas, gl, program;

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    canvas = document.getElementById("glcanvas");

    // http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14.12
    // API: preserveDrawingBuffer
    // This prevents the drawing buffer (color, depth, stencil) from being
    // cleared after they are draw to screen. Keep in mind that settings
    // this may cause a performance penalty.
    // via http://stackoverflow.com/questions/7156971/webgl-readpixels-is-always-returning-0-0-0-0
    gl = glUtils.checkWebGL(canvas, { preserveDrawingBuffer: true });
    // gl = glUtils.checkWebGL(canvas);

    initShaders();
    initCallbacks();

    // Buffer colored triangle
    var n = initBuffers(gl);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    draw(n);
  }

  function initShaders() {
    // Initialize the shaders and program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
  }

  function initCallbacks() {
    canvas.addEventListener('mousedown', onmousedown);
  }

  function initBuffers(gl) {
    var vertices = new Float32Array([
      0.5, -0.5,  -0.5, -0.5,  -0.5, +0.5
    ]);

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    var colors = new Float32Array([
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 0.5,
      // 0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0
    ]);
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    var aColor = gl.getAttribLocation(program, 'aColor');
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    return vertices.length / 2;
  }

  // draw!
  function draw(n) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
  }

  // UI Events
  function onmousedown(event) {
    var point = uiUtils.pixelInputToCanvasCoord(event, canvas);

    // store pixels in typed array
    var pixels = new Uint8Array(4);

    // API:
    // readPixels(int x, int y, long width, long height, enum format, enum type, object pixels)
    // x,y: location of pixels to read pixels
    // width/height: how bif of area to read pixels
    // format: RGBA
    // type: UNSIGNED_BYTE
    // object: object in which to store the read pixels
    gl.readPixels(point.x, point.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    console.log(pixels);
  }

})(window || this);
