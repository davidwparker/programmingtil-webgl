(function(global) {

  var canvas, gl, shaders = [], points = [],
    mode = 0;   // current shader

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    initShaders();
    initCallbacks();

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function initShaders() {
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    var vertexShader2 = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
        fragmentShader2 = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);

    shaders.push(glUtils.createProgram(gl, vertexShader, fragmentShader));
    shaders.push(glUtils.createProgram(gl, vertexShader2, fragmentShader2));
  }

  function initCallbacks() {
    canvas.addEventListener('mousedown', onmousedown);
    document.onkeydown = keyDown;
  }

  // draw!
  function draw() {

    // naive assignment of points to specific arrays
    var pointsArray = [], colorsArray = [];
    var pointsArray2 = [], colorsArray2 = [];
    for (var i=0; i<points.length; i++) {
      // lines
      //if (i % 4 === 2 || i % 4 === 3) {
      // triangles
      if (i % 6 === 3 || i % 6 === 4 || i % 6 === 5) {
        pointsArray.push(points[i].x);
        pointsArray.push(points[i].y);
        colorsArray.push(points[i].c[0]);
        colorsArray.push(points[i].c[1]);
        colorsArray.push(points[i].c[2]);
        colorsArray.push(points[i].c[3]);
      }
      else {
        pointsArray2.push(points[i].x);
        pointsArray2.push(points[i].y);
        colorsArray2.push(points[i].c[0]);
        colorsArray2.push(points[i].c[1]);
        colorsArray2.push(points[i].c[2]);
        colorsArray2.push(points[i].c[3]);
      }
    }
    var arrays = [
      {name:'aColor', array:colorsArray, size:4},
      {name:'aPosition', array:pointsArray, size:2}
    ];
    var arrays2 = [
      {name:'aColor', array:colorsArray2, size:4},
      {name:'aPosition', array:pointsArray2, size:2}
    ];
    var n = pointsArray.length/2;
    var n2 = pointsArray2.length/2;
    var mode2 = mode+1;
    var mode2 = (mode2 > shaders.length-1 ? 0: mode2);

    var program = shaders[mode];
    gl.useProgram(program);
    renderBuffers(program, arrays);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
    //gl.drawArrays(gl.LINES, 0, n);
    //gl.drawArrays(gl.LINE_STRIP, 0, n);
    //gl.drawArrays(gl.LINE_LOOP, 0, n);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    //gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

    var program2 = shaders[mode2];
    gl.useProgram(program2);
    renderBuffers(program2, arrays2);

    // only clean ONCE!
    //gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n2);
    //gl.drawArrays(gl.LINES, 0, n2);
    //gl.drawArrays(gl.LINE_STRIP, 0, n2);
    //gl.drawArrays(gl.LINE_LOOP, 0, n2);
    gl.drawArrays(gl.TRIANGLES, 0, n2);
    //gl.drawArrays(gl.TRIANGLE_FAN, 0, n2);
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n2);
  }

  // Render the buffers
  function renderBuffers(program, arrays) {
    var attributes = program.vertexShader.attributes;
    for (var i=0; i<attributes.length; i++) {
      var name = attributes[i].name;
      for (var j=0; j<arrays.length; j++) {
        if (name === arrays[j].name) {
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
    var point = uiUtils.pixelInputToGLCoord(event, canvas);
    point.c = [Math.random(), Math.random(), Math.random(), 1.0];
    points.push(point);
    draw();
  }

  // keydown callback
  function keyDown(event) {
  // if (String.fromCharCode(event.keyCode) == "S") {
    if (event.keyCode == "32") {
      toggleShaders();
    }
    draw();
  }

  // switch between shaders
  function toggleShaders() {
    if (mode >= shaders.length-1) mode = 0;
    else mode++;
  }


})(window || this);
