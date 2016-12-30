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
    // var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
    //     fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
  }

  // draw!
  function draw() {
    points.push({x:+0.0, y:+0.0, c:[Math.random(), Math.random(), Math.random(), 1.0]});
    points.push({x:+0.75, y:+0.0, c:[Math.random(), Math.random(), Math.random(), 1.0]});
    points.push({x:+0.0, y:+0.5, c:[Math.random(), Math.random(), Math.random(), 1.0]});
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

    // Rotation!
    // You could do this in the shader, and calculate sine / cosine there.
    // However, they're identical for all vertices, so more efficient to only
    // do it once in JavaScript.
    // var ANGLE = 0;
    var ANGLE = 90.0;
    var radian = Math.PI * ANGLE / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    // With individual variables, less efficient
    // var uCosB = gl.getUniformLocation(program, 'uCosB');
    // var uSinB = gl.getUniformLocation(program, 'uSinB');
    // gl.uniform1f(uCosB, cosB);
    // gl.uniform1f(uSinB, sinB);

    // Using a single variable for both
    var uCosBSinB = gl.getUniformLocation(program, 'uCosBSinB');
    gl.uniform2f(uCosBSinB, cosB, sinB);
  }
})(window || this);
