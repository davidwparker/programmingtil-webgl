(function(global) {

  /*
  * Constants and Main
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  var state = {
    gl: null,
    program: null,
    ui: {
      pressedKeys: {},
    },
    animation: {},
    app: {
      angle: 0.0,
      eye: {
        x:3.,
        y:3.,
        z:7.,
      },
      last: Date.now(),
      paused: false,
    },
  };

  var ANGLE_PER_SECOND = 0.7;
  var STRIDE = 8;
  var DEFAULT_VERT = [
   1.0, 1.0, 1.0,1, 1.0, 0.4, 1.0,0,
  -1.0, 1.0, 1.0,1, 1.0, 0.4, 1.0,0,
  -1.0,-1.0, 1.0,1, 1.0, 0.4, 1.0,0,
   1.0,-1.0, 1.0,1, 1.0, 0.4, 1.0,0, // v0-v1-v2-v3

   1.0, 1.0, 1.0,1, 0.4, 0.4, 1.0,0,
   1.0,-1.0, 1.0,1, 0.4, 0.4, 1.0,0,
   1.0,-1.0,-1.0,1, 0.4, 0.4, 1.0,0,
   1.0, 1.0,-1.0,1, 0.4, 0.4, 1.0,0, // v0-v3-v4-v5

   1.0, 1.0, 1.0,1, 0.4, 1.0, 0.4,0,
   1.0, 1.0,-1.0,1, 0.4, 1.0, 0.4,0,
  -1.0, 1.0,-1.0,1, 0.4, 1.0, 0.4,0,
  -1.0, 1.0, 1.0,1, 0.4, 1.0, 0.4,0, // v0-v5-v6-v1

  -1.0, 1.0, 1.0,1, 1.0, 0.4, 0.4,0,
  -1.0, 1.0,-1.0,1, 1.0, 0.4, 0.4,0,
  -1.0,-1.0,-1.0,1, 1.0, 0.4, 0.4,0,
  -1.0,-1.0, 1.0,1, 1.0, 0.4, 0.4,0, // v1-v6-v7-v2

  -1.0,-1.0,-1.0,1, 1.0, 1.0, 0.4,0,
   1.0,-1.0,-1.0,1, 1.0, 1.0, 0.4,0,
   1.0,-1.0, 1.0,1, 1.0, 1.0, 0.4,0,
  -1.0,-1.0, 1.0,1, 1.0, 1.0, 0.4,0, // v7-v4-v3-v2

   1.0,-1.0,-1.0,1, 0.4, 1.0, 1.0,0,
  -1.0,-1.0,-1.0,1, 0.4, 1.0, 1.0,0,
  -1.0, 1.0,-1.0,1, 0.4, 1.0, 1.0,0,
   1.0, 1.0,-1.0,1, 0.4, 1.0, 1.0,0, // v4-v7-v6-v5
  ];
  var DEFAULT_INDICES = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,   // left
    16,17,18,  16,18,19,   // down
    20,21,22,  20,22,23,   // back
  ]);
  var FACES = new Uint8Array([
    1, 1, 1, 1,     // v0-v1-v2-v3 front
    2, 2, 2, 2,     // v0-v3-v4-v5 right
    3, 3, 3, 3,     // v0-v5-v6-v1 up
    4, 4, 4, 4,     // v1-v6-v7-v2 left
    5, 5, 5, 5,     // v7-v4-v3-v2 down
    6, 6, 6, 6,     // v4-v7-v6-v5 back
  ]);

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    state.canvas = document.getElementById("glcanvas");
    state.gl = glUtils.checkWebGL(state.canvas, { preserveDrawingBuffer: true });
    initCallbacks();
    initShaders();
    initGL();
    initState();
    animate();
  }

  /*
  * Initialization
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function initCallbacks() {
    document.onkeydown = keydown;
    document.onkeyup = keyup;
    state.canvas.onmousedown = mousedown;
  }

  function initShaders() {
    var vertexShader = glUtils.getShader(state.gl, state.gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
      fragmentShader = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    state.program = glUtils.createProgram(state.gl, vertexShader, fragmentShader);
  }

  function initGL() {
    state.gl.clearColor(0,0,0,1);
    state.gl.enable(state.gl.DEPTH_TEST);
    state.gl.useProgram(state.program);
  }

  function initState() {
    var v = DEFAULT_VERT;
    var vi = DEFAULT_INDICES;
    state.uMVPMatrix = state.gl.getUniformLocation(state.program, 'uMVPMatrix');
    state.uPickedFace = state.gl.getUniformLocation(state.program, 'uPickedFace');
    state.n = initVertexBuffers(v, vi).indices.length;
    state.vm = mat4.create();
    state.pm = mat4.create();
    state.mvp = mat4.create();
    state.gl.uniform1i(state.uPickedFace, -1);
  }

  /*
  * Rendering / Drawing / Animation
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function animate() {
    state.animation.tick = function() {
      updateState();
      draw();
      state.animation.req = requestAnimationFrame(state.animation.tick);
    };
    state.animation.tick();
  }

  function updateState() {
    var speed = 0.2;
    if (state.ui.pressedKeys[37]) {
      // left
      state.app.eye.x += speed;
    } else if (state.ui.pressedKeys[39]) {
      // right
      state.app.eye.x -= speed;
    } else if (state.ui.pressedKeys[40]) {
      // down
      state.app.eye.y += speed;
    } else if (state.ui.pressedKeys[38]) {
      // up
      state.app.eye.y -= speed;
    }

    var now = Date.now();
    var time = (now - state.app.last) / 1000;
    state.app.last = now;
    state.app.angle = (state.app.angle + ANGLE_PER_SECOND * time) % 360;
  }

  function draw() {
    var uMVPMatrix = state.uMVPMatrix;
    var uPickedFace = state.uPickedFace;
    var n = state.n;
    var vm = state.vm;
    var pm = state.pm;
    var mm = mat4.create(); // new one so we don't accelerate the mm matrix
    var mvp = state.mvp;

    mat4.perspective(pm,
      20, 1/1, 1, 100
    );
    mat4.lookAt(vm,
      vec3.fromValues(state.app.eye.x,state.app.eye.y,state.app.eye.z),
      vec3.fromValues(0,0,0),
      vec3.fromValues(0,1,0)
    );
    mat4.rotateX(mm, mm, state.app.angle);
    mat4.rotateY(mm, mm, state.app.angle);
    mat4.rotateZ(mm, mm, state.app.angle);

    mat4.copy(mvp, pm);
    mat4.multiply(mvp, mvp, vm);
    mat4.multiply(mvp, mvp, mm);
    state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    state.gl.drawElements(state.gl.TRIANGLES, n, state.gl.UNSIGNED_BYTE, 0);
  }

  function initVertexBuffers(v, i) {
    // Not taking the time to refactor renderBuffers currently to handle other
    // attribute types
    var buffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, buffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, FACES, state.gl.STATIC_DRAW);
    var attribute = state.gl.getAttribLocation(state.program, 'aFace');
    state.gl.vertexAttribPointer(attribute, 1, state.gl.UNSIGNED_BYTE, false, 0, 0);
    state.gl.enableVertexAttribArray(attribute);

    var vertices = new Float32Array(v);
    vertices.stride = STRIDE;
    vertices.attributes = [
      {name:'aPosition', size:3, offset:0},
      {name:'aColor', size:3, offset:4},
    ];
    vertices.n = vertices.length/vertices.stride;
    vertices.indices = i;
    state.program.renderBuffers(vertices, i);
    return vertices;
  }

  /*
  * UI Events
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function keydown(event) {
    state.ui.pressedKeys[event.keyCode] = true;

    if (String.fromCharCode(event.keyCode) == "P") {
      state.app.paused = !state.app.paused;
    }
  }

  function keyup(event) {
    state.ui.pressedKeys[event.keyCode] = false;

    if (state.app.paused) {
      cancelAnimationFrame(state.animation.req);
      state.animation.req = undefined;
    }
    else {
      if (!state.animation.req) {
        state.app.last = Date.now();
        state.animation.tick();
      }
    }
  }

  function mousedown(event) {
    // Draw by writing surface number into alpha value
    // If 0, then we're going to set vColor based on aFace
    state.gl.uniform1i(state.uPickedFace, 0);
    draw();
    var point = uiUtils.pixelInputToCanvasCoord(event, state.canvas);
    var pixels = new Uint8Array(4);
    state.gl.readPixels(point.x, point.y, 1, 1, state.gl.RGBA, state.gl.UNSIGNED_BYTE, pixels);
    console.log(pixels);
    // Now redraw again with the proper values, note that the selected one
    // will state the selected
    state.gl.uniform1i(state.uPickedFace, pixels[3]);
    draw();
  }
})(window || this);
