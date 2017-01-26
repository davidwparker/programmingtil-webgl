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
      eye: {
        x:3.,
        y:3.,
        z:7.,
      },
    },
  };

  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  var DEFAULT_VERT = [
     1.0, 1.0, 1.0,1, 1.0, 0.4, 1.0,1,
    -1.0, 1.0, 1.0,1, 1.0, 0.4, 1.0,1,
    -1.0,-1.0, 1.0,1, 1.0, 0.4, 1.0,1,
     1.0,-1.0, 1.0,1, 1.0, 0.4, 1.0,1, // v0-v1-v2-v3 front white

     1.0, 1.0, 1.0,1, 0.4, 0.4, 1.0,1,
     1.0,-1.0, 1.0,1, 0.4, 0.4, 1.0,1,
     1.0,-1.0,-1.0,1, 0.4, 0.4, 1.0,1,
     1.0, 1.0,-1.0,1, 0.4, 0.4, 1.0,1, // v0-v3-v4-v5 right(white)

     1.0, 1.0, 1.0,1, 0.4, 1.0, 0.4,1,
     1.0, 1.0,-1.0,1, 0.4, 1.0, 0.4,1,
    -1.0, 1.0,-1.0,1, 0.4, 1.0, 0.4,1,
    -1.0, 1.0, 1.0,1, 0.4, 1.0, 0.4,1,  // v0-v5-v6-v1 up

    -1.0, 1.0, 1.0,1, 1.0, 0.4, 0.4,1,
    -1.0, 1.0,-1.0,1, 1.0, 0.4, 0.4,1,
    -1.0,-1.0,-1.0,1, 1.0, 0.4, 0.4,1,
    -1.0,-1.0, 1.0,1, 1.0, 0.4, 0.4,1,  // v1-v6-v7-v2 left

    -1.0,-1.0,-1.0,1, 1.0, 1.0, 0.4,1,
     1.0,-1.0,-1.0,1, 1.0, 1.0, 0.4,1,
     1.0,-1.0, 1.0,1, 1.0, 1.0, 0.4,1,
    -1.0,-1.0, 1.0,1, 1.0, 1.0, 0.4,1,   // v7-v4-v3-v2 down

     1.0,-1.0,-1.0,1, 0.4, 1.0, 1.0,1,
    -1.0,-1.0,-1.0,1, 0.4, 1.0, 1.0,1,
    -1.0, 1.0,-1.0,1, 0.4, 1.0, 1.0,1,
     1.0, 1.0,-1.0,1, 0.4, 1.0, 1.0,1    // v4-v7-v6-v5 back
  ];

  var DEFAULT_INDICES = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
 ]);

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    state.canvas = document.getElementById("glcanvas");
    state.gl = glUtils.checkWebGL(state.canvas);
    initCallbacks();
    initShaders();
    initGL();
    animate();
  }

  /*
  * Initialization
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function initCallbacks() {
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
  }

  function initShaders() {
    var vertexShader = glUtils.getShader(state.gl, state.gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
      fragmentShader = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    state.program = glUtils.createProgram(state.gl, vertexShader, fragmentShader);
  }

  function initGL() {
    state.gl.clearColor(0,0,0,1);
    state.gl.enable(state.gl.DEPTH_TEST);
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
      requestAnimationFrame(state.animation.tick);
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
  }

  function draw(args) {
    var v = (args && args.v) ? args.v : DEFAULT_VERT;
    var vi = (args && args.vi) ? args.vi : DEFAULT_INDICES;
    var uMVPMatrix = state.gl.getUniformLocation(state.program, 'uMVPMatrix');
    var n = initVertexBuffers(v, vi).indices.length;
    var mvm = mat4.create();
    var pm = mat4.create();
    var mvp = mat4.create();

    mat4.perspective(pm,
      20, 1/1, 1, 100
    );
    mat4.lookAt(mvm,
      vec3.fromValues(state.app.eye.x,state.app.eye.y,state.app.eye.z),
      vec3.fromValues(0,0,0),
      vec3.fromValues(0,1,0)
    );
    mat4.copy(mvp, pm);
    mat4.multiply(mvp, mvp, mvm);

    state.gl.useProgram(state.program);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
    state.gl.drawElements(state.gl.TRIANGLES, n, state.gl.UNSIGNED_BYTE, 0);
  }

  function initVertexBuffers(v, i) {
    var vertices = new Float32Array(v);
    vertices.stride = 8;
    vertices.attributes = [
      {name:'aPosition', size:3, offset:0},
      {name:'aColor',    size:3, offset:4},
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
  function keyDown(event) {
    state.ui.pressedKeys[event.keyCode] = true;
  }

  function keyUp(event) {
    state.ui.pressedKeys[event.keyCode] = false;
  }
})(window || this);
