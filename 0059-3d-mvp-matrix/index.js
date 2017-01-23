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
        x:0,
        y:0,
        z:5,
      },
    },
  };

  var DEFAULT_VERT = [
    // front blue
    0.0,  1.0,   0.0, 1, 0.4,  0.4,  1.0, 1,
    -0.5, -1.0,  0.0, 1, 0.4,  0.4,  1.0, 1,
    0.5, -1.0,   0.0, 1, 1.0,  0.4,  0.4, 1,

    // middle yellow
    0.0,  1.0,  -2.0, 1, 1.0,  1.0,  0.4, 1,
    -0.5, -1.0, -2.0, 1, 1.0,  1.0,  0.4, 1,
    0.5, -1.0,  -2.0, 1, 1.0,  0.4,  0.4, 1,

    // back green
    0.0,  1.0,  -4.0, 1, 0.4,  1.0,  0.4, 1,
    -0.5, -1.0, -4.0, 1, 0.4,  1.0,  0.4, 1,
    0.5, -1.0,  -4.0, 1, 1.0,  0.4,  0.4, 1,
  ];

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
    if (state.ui.pressedKeys[37]) {
      // left
      state.app.eye.x += 0.01;
    } else if (state.ui.pressedKeys[39]) {
      // right
      state.app.eye.x -= 0.01;
    } else if (state.ui.pressedKeys[40]) {
      // down
      state.app.eye.y += 0.01;
    } else if (state.ui.pressedKeys[38]) {
      // up
      state.app.eye.y -= 0.01;
    }
  }

  function draw(args) {
    var p = (args && args.p) ? args.p : DEFAULT_VERT;
    var uMVPMatrix = state.gl.getUniformLocation(state.program, 'uMVPMatrix');

    state.gl.useProgram(state.program);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    // state.gl.clear(state.gl.COLOR_BUFFER_BIT);

    var n = initVertexBuffers(p).n;
    var mm = mat4.create();
    var vm = mat4.create();
    var pm = mat4.create();
    var mvp = mat4.create();

    mat4.translate(mm, mm, vec3.fromValues(.75, 0, 0));
    mat4.lookAt(vm,
      vec3.fromValues(state.app.eye.x,state.app.eye.y,state.app.eye.z),
      vec3.fromValues(0,0,-100),
      vec3.fromValues(0,1,0)
    );
    mat4.perspective(pm, 100, state.canvas.width/state.canvas.height, 1, 100);

    mat4.copy(mvp, pm);
    mat4.multiply(mvp, mvp, vm);
    mat4.multiply(mvp, mvp, mm);
    state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
    state.gl.drawArrays(state.gl.TRIANGLES, 0, n);

    // Prepare the model matrix for another pair of triangles
    mat4.translate(mm, mm, vec3.fromValues(-1.5, 0, 0));
    mat4.copy(mvp, pm);
    mat4.multiply(mvp, mvp, vm);
    mat4.multiply(mvp, mvp, mm);
    state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
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
