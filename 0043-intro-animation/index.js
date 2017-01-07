(function(global) {

  var canvas, gl, program, points = [], last = Date.now();
  var ANGLE_PER_SECOND = 45.0;
  // var ANGLE_PER_SECOND = 5.0;
  // var ANGLE_PER_SECOND = 90.0;

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas, { preserveDrawingBuffer: true });

    initShaders();
    initBuffers(gl);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Animation!
    var angle = 0.0;
    var modelMatrix = mat4.create();
    var uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
    var tick = function() {
      // update the angle of the triangle
      angle = updateAngle(angle);

      // draw!
      draw(angle, modelMatrix, uModelMatrix);

      // Send request to browser to call tick
      requestAnimationFrame(tick);
    };
    tick();

    // Using setInterval:
    // NOTE: this will draw regardless of tab open, so it's not a good idea to
    // use setInterval, and you should be using requestAnimationFrame.
    // setInterval(function () {
    //   tick();
    // }, 10);
  }

  function initShaders() {
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
      fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
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

  function updateAngle(angle) {
    var now = Date.now();
    // how many milliseconds have passed; we must use this because the time
    // between animation steps may be different.
    var time = now - last;
    last = now;
    // return the new return angle given how many seconds have passed
    // % 360 to ensure the angle is < 360 degrees.
    return (angle + (ANGLE_PER_SECOND * time) / 1000.0) % 360;
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
      // colorsArray.push(1);
      // colorsArray.push(1);
      // colorsArray.push(1);
      // colorsArray.push(1);

      // What happens if we keep the different random colors?
      colorsArray.push(points[i].c[0]);
      colorsArray.push(points[i].c[1]);
      colorsArray.push(points[i].c[2]);
      colorsArray.push(points[i].c[3]);
    }
    var arrays = [
      {name:'aColor', array:colorsArray, size:4},
      {name:'aPosition', array:pointsArray, size:2}
    ];
    var n = pointsArray.length/2;

    renderBuffers(arrays);

    // Draw out the modelMatrix
    var radian = Math.PI * angle / 180.0;
    var modelMatrix = mat4.fromRotation(mat4.create(), radian, vec3.fromValues(0,0,1));
    var uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
    gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);

    // What happens if we don't clear the COLOR_BUFFER_BIT?
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

})(window || this);
