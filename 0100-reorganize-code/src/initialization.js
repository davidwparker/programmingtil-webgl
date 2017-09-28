(function(global) {
  /*
  * Initialization
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function initialize() {
    initCallbacks();
    initShaders();
    initGLSettings();
    initObjects();
  }

  function initCallbacks() {
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    state.canvas.onmousedown = mousedown;
    state.canvas.onmouseup = mouseup;
    state.canvas.onmousemove = mousemove;
  }

  function initShaders() {
    for (var obj in glUtils.SL.Shaders) {
      var vertex = glUtils.getShader(
        state.gl.VERTEX_SHADER,
        glUtils.SL.Shaders[obj].vertex
      );
      var fragment = glUtils.getShader(
        state.gl.FRAGMENT_SHADER,
        glUtils.SL.Shaders[obj].fragment
      );
      state.programs[obj] = glUtils.createProgram(vertex, fragment);
    }
  }

  function initGLSettings() {
    state.gl.clearColor(0, 0, 0, 1);
  }

  function initObjects() {
    state.app.objects = [
      new Cube({
        blend: true,
        blendDst: state.gl.ONE,
        gl: state.gl,
        programs: {
          render: state.programs.texture,
          read: state.programs.read
        },
        selColor: [255, 254, 0, 0],
        scale: [0.5, 0.5, 0.5],
        texture: 'stainglass'
      }),
      new Cube({
        gl: state.gl,
        programs: {
          render: state.programs.render,
          read: state.programs.read
        },
        selColor: [255, 255, 0, 0],
        translate: [3, 0, 0]
      }),
      new Cube({
        gl: state.gl,
        programs: {
          render: state.programs.render,
          read: state.programs.read
        },
        selColor: [255, 253, 0, 0],
        scale: [0.5, 0.5, 0.5],
        translate: [-2, 2, 0]
      }),
      new Cube({
        blend: true,
        blendDst: state.gl.ONE,
        gl: state.gl,
        programs: {
          render: state.programs.texture,
          read: state.programs.read
        },
        selColor: [255, 252, 0, 0],
        scale: [0.6, 0.6, 0.6],
        texture: 'crate',
        translate: [-2, -2, 2],
        angle: [0, 35, 0]
      }),
      new Cube({
        gl: state.gl,
        programs: {
          render: state.programs.texture,
          read: state.programs.read
        },
        selColor: [255, 251, 0, 0],
        scale: [0.2, 0.2, 0.2],
        texture: 'crate',
        translate: [2, 2, 2],
        angle: [75, 0, 0]
      })
    ];
  }

  window.initialize = initialize;
})(window || this);
