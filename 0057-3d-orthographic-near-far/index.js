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
    animation: {
    },
    app: {
      near: 0,
      far: 0.5,
    },
  };

  var DEFAULT_VERT = [
     0.0,  0.6, -0.4, 1, Math.random(),Math.random(),Math.random(),1,
    -0.5, -0.4, -0.4, 1, Math.random(),Math.random(),Math.random(),1,
     0.5, -0.4, -0.4, 1, Math.random(),Math.random(),Math.random(),1,

     // Red
     0.5,  0.4, -0.2, 1, 1,0,0,1,
    -0.5,  0.4, -0.2, 1, 1,0,0,1,
     0.0, -0.6, -0.2, 1, 1,0,0,1,

     // Green
     0.0,  0.5, 0., 1, 0,1,0,1,
    -0.5, -0.5, 0., 1, 0,1,0,1,
     0.5, -0.5, 0., 1, 0,1,0,1,
  ];

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    state.gl = glUtils.checkWebGL(document.getElementById("glcanvas"));
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
  }

  /*
  * Rendering / Drawing / Animation
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function animate() {
    // var p = defaultP;
    state.animation.tick = function() {
      updateState();
      draw();
      requestAnimationFrame(state.animation.tick);
    };
    state.animation.tick();
  }

  function updateState() {
    if (state.ui.pressedKeys[37]) {
      // left
      state.app.near -= 0.01;
    } else if (state.ui.pressedKeys[39]) {
      // right
      state.app.near += 0.01;
    } else if (state.ui.pressedKeys[40]) {
      // down
      state.app.far -= 0.01;
    } else if (state.ui.pressedKeys[38]) {
      // up
      state.app.far += 0.01;
    }
  }

  function draw(args) {
    var p = (args && args.p) ? args.p : DEFAULT_VERT;
    var uModelViewMatrix = state.gl.getUniformLocation(state.program, 'uModelViewMatrix');
    var uProjectionMatrix = state.gl.getUniformLocation(state.program, 'uProjectionMatrix');

    state.gl.useProgram(state.program);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT);

    var n = initVertexBuffers(p).n;
    var pm = mat4.create();

    // Projection matrix- using the orthographic "Box" view
    // Orthographic view- no perspective
    // mat4.ortho = function (out, left, right, bottom, top, near, far) {
    pm = mat4.ortho(pm,
      -1, 1,
      -1, 1,
      state.app.near, state.app.far
    );

    state.gl.uniformMatrix4fv(uProjectionMatrix, false, pm);
    state.gl.drawArrays(state.gl.TRIANGLES, 0, n);
  }

  function initVertexBuffers(p) {
    var vertices = new Float32Array(p);
    vertices.stride = 8;
    vertices.attributes = [
      {name:'aPosition', size:3, offset:0},
      {name:'aColor',    size:3, offset:4},
    ];
    vertices.n = vertices.length/vertices.stride;
    state.program.renderBuffers(vertices);
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
