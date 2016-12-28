(function(global) {

  var canvas, gl, program, points = [], pressedKeys = {};

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas, { preserveDrawingBuffer: true });

    initShaders();
    initCallbacks();

    initBuffers(gl);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function initShaders() {
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
  }

  function initCallbacks() {
    canvas.addEventListener('mousedown', onmousedown);
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
  }

  // draw!
  function draw() {
    var pointsArray = [], colorsArray = [];
    for (var i=0; i<points.length; i++) {
      pointsArray.push(points[i].x);
      pointsArray.push(points[i].y);
      colorsArray.push(points[i].c[0]);
      colorsArray.push(points[i].c[1]);
      colorsArray.push(points[i].c[2]);
      colorsArray.push(points[i].c[3]);
    }
    var arrays = [{name:'aColor', array:colorsArray, size:4},
                  {name:'aPosition', array:pointsArray, size:2}];
    var n = pointsArray.length/2;

    renderBuffers(arrays);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  // Create and set the buffers
  function initBuffers(gl) {
    var attributes = program.vertexShader.attributes;
    for (var i=0; i<attributes.length; i++) {
      program[attributes[i].name] = gl.createBuffer();
    }
  }

  // Render the buffers
  function renderBuffers(arrays) {
    var attributes = program.vertexShader.attributes;
    for (var i=0; i<attributes.length; i++) {
      var name = attributes[i].name;
      for (var j=0; j<arrays.length; j++) {
        if (name == arrays[j].name) {
          var attr = gl.getAttribLocation(program, name);
          gl.enableVertexAttribArray(attr);
          gl.bindBuffer(gl.ARRAY_BUFFER, program[name]);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays[j].array), gl.STATIC_DRAW);
          gl.vertexAttribPointer(attr, arrays[j].size, gl.FLOAT, false, 0, 0);
        }
      }
    }
  }

  // UI Events
  function onmousedown(event) {
    // console.log(pressedKeys);

    // If we're pressing shift, then we want to read pixels instead of drawing.
    if (pressedKeys[16]) {
      var point = uiUtils.pixelInputToCanvasCoord(event, canvas);
      var pixels = new Uint8Array(4);
      gl.readPixels(point.x, point.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      console.log(pixels);
    }
    else {
      var point = uiUtils.pixelInputToGLCoord(event, canvas);
      point.c = [Math.random(), Math.random(), Math.random(), 1.0];
      points.push(point);
    }
    draw();
  }

  function keyDown(event) {
    pressedKeys[event.keyCode] = true;
  }

  function keyUp(event) {
    pressedKeys[event.keyCode] = false;
  }

})(window || this);
