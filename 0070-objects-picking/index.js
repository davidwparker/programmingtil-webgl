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
  var cube = {
    attributes: {
      aColor: {
        size:4,
        offset:0,
        bufferData: new Float32Array([
          0,  1,  1,  1,
          1,  0,  1,  1,
          0,  0.5,0.5,1,
          0.5,1,  1,  1,
          1,  0.5,1,  1,
          1,  1,  0.5,1,
          0,  1,  0.5,1,
          0.5,0.5,1,  1,
        ]),
      },
      aSelColor: {
        size:4,
        offset:0,
        bufferData: new Float32Array([
          1,0,0,1,
          1,0,0,1,
          1,0,0,1,
          1,0,0,1,
          1,0,0,1,
          1,0,0,1,
          1,0,0,1,
          1,0,0,1,
        ]),
      },
      aPosition: {
        size:4,
        offset:0,
        bufferData: new Float32Array([
          1, 1, 1, 1,
         -1, 1, 1, 1,
         -1,-1, 1, 1,
          1,-1, 1, 1,
          1,-1,-1, 1,
          1, 1,-1, 1,
         -1, 1,-1, 1,
         -1,-1,-1, 1,
       ]),
      }
    },
    indices: new Uint8Array([
      0, 1, 2,   0, 2, 3,    // front
      0, 3, 4,   0, 4, 5,    // right
      0, 5, 6,   0, 6, 1,    // up
      1, 6, 7,   1, 7, 2,    // left
      7, 4, 3,   7, 3, 2,    // down
      4, 7, 6,   4, 6, 5,    // back
    ]),
    stride: 0,
    setForReading: function() {
      this.attributes.aColorBackup = this.attributes.aColor;
      this.attributes.aColor = this.attributes.aSelColor;
    },
    setForDrawing: function() {
      this.attributes.aColor = this.attributes.aColorBackup;
    }
  };

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
    state.uMVPMatrix = state.gl.getUniformLocation(state.program, 'uMVPMatrix');
    state.mvm = mat4.create();
    state.pm = mat4.create();
    state.mvp = mat4.create();
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
    state.program.renderBuffers(cube);
    var n = cube.indices.length;
    var uMVPMatrix = state.uMVPMatrix;
    var mvm = state.mvm;
    var pm = state.pm;
    var mvp = state.mvp;

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
    state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    state.gl.drawElements(state.gl.TRIANGLES, n, state.gl.UNSIGNED_BYTE, 0);
  }

  /*
  * UI Events
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function keydown(event) {
    state.ui.pressedKeys[event.keyCode] = true;
  }

  function keyup(event) {
    state.ui.pressedKeys[event.keyCode] = false;
  }

  function mousedown(event) {
    cube.setForReading();
    draw();
    var point = uiUtils.pixelInputToCanvasCoord(event, state.canvas);
    var pixels = new Uint8Array(4);
    state.gl.readPixels(point.x, point.y, 1, 1, state.gl.RGBA, state.gl.UNSIGNED_BYTE, pixels);
    console.log(pixels);
    if (pixels[0] === 255) {
      console.log("cube selected!");
    }
    cube.setForDrawing();
    draw();
  }
})(window || this);
