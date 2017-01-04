(function(global) {

  var canvas, gl, program, points = [], pressedKeys = {};

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas, { preserveDrawingBuffer: true });

    initShaders();

    initBuffers(gl);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    draw();
  }

  function initShaders() {
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
      fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
  }

  // draw!
  function draw() {
    points.push({x:+0.0, y:+0.0, c:[Math.random(), Math.random(), Math.random(), 1.0]});
    points.push({x:+0.5, y:+0.0, c:[Math.random(), Math.random(), Math.random(), 1.0]});
    points.push({x:+0.0, y:+0.25, c:[Math.random(), Math.random(), Math.random(), 1.0]});
    var pointsArray = [], colorsArray = [];
    for (var i=0; i<points.length; i++) {
      pointsArray.push(points[i].x);
      pointsArray.push(points[i].y);
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

    gl.clear(gl.COLOR_BUFFER_BIT);
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

    // Rotation with glMatrix
    // var ANGLE = 0;
    // var ANGLE = 45;
    var ANGLE = 90.0;
    var radian = Math.PI * ANGLE / 180.0;

    // Create an identity matrix
    var mat = mat4.create();

    // Fails the Math.abs(len) < glMatrix.EPSILON test
    // var vec = vec3.fromValues(0,0,0);
    var vec = vec3.fromValues(0,0,1);

    // Get the rotation Matrix from the rotation given
    var rotationMatrix = mat4.fromRotation(mat, radian, vec);
    // var rotationMatrix = new Float32Array([
    //   cosB, +sinB, 0, 0,
    //   -sinB, cosB, 0, 0,
    //   0, 0, 1, 0,
    //   0, 0, 0, 1,
    // ]);
    var uTransformationMatrix = gl.getUniformLocation(program, 'uTransformationMatrix');
    gl.uniformMatrix4fv(uTransformationMatrix, false, rotationMatrix);
  }
})(window || this);
