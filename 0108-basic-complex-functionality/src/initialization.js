(function(global) {
  /*
  * Initialization
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function initialize() {
    initEnvironment();
    initCallbacks();
    initShaders();
    initGLSettings();
    initObjects();
    glUtils.initTextures(IMAGES, state.app.textures, renderer.render);
  }

  function initEnvironment() {
    state.canvas = document.getElementById('glcanvas');
    state.overlay = document.getElementById('overlay');
    state.ctx = state.overlay.getContext('2d');
    state.gl = glUtils.checkWebGL(state.canvas, {
      preserveDrawingBuffer: true
    });
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
      new Thing1({
        gl: state.gl,
        selColor: [1, 0, 0, 0],
        translate: [2, 0, 0]
      }),
      new Thing2({
        gl: state.gl,
        selColor: [2, 0, 0, 0],
        translate: [-2, 0, 0]
      })
    ];
  }

  window.initialize = initialize;
})(window || this);
