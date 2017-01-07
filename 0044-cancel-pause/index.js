(function(global) {

  var ANGLE_PER_SECOND = 45.0;
  var canvas,
    gl,
    program,
    points = [],
    last = Date.now(),
    paused = false,
    req,
    tick;

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas, { preserveDrawingBuffer: true });

    initShaders();
    initCallbacks();
    initBuffers(gl);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Animation!
    var angle = 0.0;
    var modelMatrix = mat4.create();
    var uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
    tick = function() {
      angle = updateAngle(angle);
      draw(angle, modelMatrix, uModelMatrix);
      req = requestAnimationFrame(tick);
    };
    tick();
  }

  function initShaders() {
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
      fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
  }

  function initCallbacks() {
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
  }

  function initBuffers(gl) {
    var attributes = program.vertexShader.attributes;
    for (var i=0; i<attributes.length; i++) {
      program[attributes[i].name] = gl.createBuffer();
    }
  }

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

  function updateAngle(angle) {
    var now = Date.now();
    var time = (now - last) / 1000;
    last = now;
    return (angle + ANGLE_PER_SECOND * time) % 360;
  }

  // draw!
  function draw(angle, modelMatrix, uModelMatrix) {
    points.push({x:+0.0, y:+0.0, c:[Math.random(), Math.random(), Math.random(), 1.0]});
    points.push({x:+0.5, y:+0.0, c:[Math.random(), Math.random(), Math.random(), 1.0]});
    points.push({x:+0.0, y:+0.25, c:[Math.random(), Math.random(), Math.random(), 1.0]});
    var pointsArray = [], colorsArray = [];
    for (var i=0; i<points.length; i++) {
      pointsArray.push(points[i].x);
      pointsArray.push(points[i].y);
      colorsArray.push(1);
      colorsArray.push(1);
      colorsArray.push(1);
      colorsArray.push(1);
    }
    var arrays = [
      {name:'aColor', array:colorsArray, size:4},
      {name:'aPosition', array:pointsArray, size:2}
    ];
    var n = pointsArray.length/2;
    renderBuffers(arrays);

    var radian = Math.PI * angle / 180.0;
    var modelMatrix = mat4.fromRotation(mat4.create(), radian, vec3.fromValues(0,0,1));
    var uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
    gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  // UI Events
  function keyDown(event) {
    if (String.fromCharCode(event.keyCode) == "P") {
      paused = !paused;
    }
  }

  function keyUp(event) {
    if (paused) {
      cancelAnimationFrame(req);
      req = undefined;
    }
    else {
      if (!req) {
        last = Date.now();
        tick();
      }
    }
  }

})(window || this);
