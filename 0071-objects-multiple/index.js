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
      objects: [],
    },
  };

  // Create a cube
  function Cube(opts) {
    var opts = opts || {};
    this.id = uuid();
    this.opts = opts;
    this.attributes = {
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
    };
    this.indices = new Uint8Array([
      0, 1, 2,   0, 2, 3,    // front
      0, 3, 4,   0, 4, 5,    // right
      0, 5, 6,   0, 6, 1,    // up
      1, 6, 7,   1, 7, 2,    // left
      7, 4, 3,   7, 3, 2,    // down
      4, 7, 6,   4, 6, 5,    // back
    ]);
    // new modelMatrix for each object
    this.state = {
      mm: mat4.create(),
    };
    this.selColor = opts.selColor ? opts.selColor : [0,0,0,0];
    this.stride = opts.stride ? opts.stride : 0;

    // Functionality
    this.readState = function() {
      this.attributes.aColorBackup = this.attributes.aColor;
      this.attributes.aColor = this.attributes.aSelColor;
    };
    this.drawState = function() {
      this.attributes.aColor = this.attributes.aColorBackup;
    };

    // Initialization
    this.init = function(_this) {
      _this.selColor = _this.selColor.map(function(n) { return n/255; });
      var arrays = [
        _this.selColor, _this.selColor,
        _this.selColor, _this.selColor,
        _this.selColor, _this.selColor,
        _this.selColor, _this.selColor,
      ];
      _this.attributes.aSelColor = {
        size:4,
        offset:0,
        bufferData: new Float32Array(
          [].concat.apply([], arrays)
        ),
      };
    }(this);
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
    state.vm = mat4.create();
    state.pm = mat4.create();
    state.mvp = mat4.create();
    state.app.objects = [
      new Cube(),
      new Cube({
        selColor:[223,1,20,0],
      }),
    ];
    // for this example, we're going to arbitrarily translate one cube
   mat4.translate(state.app.objects[1].state.mm, state.app.objects[1].state.mm, vec3.fromValues(3,0,0));
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
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    var uMVPMatrix = state.uMVPMatrix;
    var vm = state.vm;
    var pm = state.pm;
    var mvp = state.mvp;
    mat4.perspective(pm,
      20, 1/1, 1, 100
    );
    mat4.lookAt(vm,
      vec3.fromValues(state.app.eye.x,state.app.eye.y,state.app.eye.z),
      vec3.fromValues(0,0,0),
      vec3.fromValues(0,1,0)
    );

    // Loop through each object and draw!
    for (var i=0;i<state.app.objects.length;i++) {
      var obj = state.app.objects[i];
      state.program.renderBuffers(obj);
      var n = obj.indices.length;
      mat4.copy(mvp, pm);
      mat4.multiply(mvp, mvp, vm);
      mat4.multiply(mvp, mvp, obj.state.mm);
      state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
      state.gl.drawElements(state.gl.TRIANGLES, n, state.gl.UNSIGNED_BYTE, 0);
    }
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
    state.app.objects.forEach(function(obj) { obj.readState(); });
    draw();
    var pixels = Array.from(uiUtils.pixelsFromMouseClick(event, state.canvas, state.gl));
    var obj = pickObject(pixels);
    if (obj) {
      console.log("cube " + obj.id + " selected!");
      mat4.translate(obj.state.mm, obj.state.mm, vec3.fromValues(0,1,0));
    }
    state.app.objects.forEach(function(obj) { obj.drawState(); });
    draw();
  }

  function pickObject(pixels) {
    pixels = pixels.map(function(n) { return n/255; });
    return state.app.objects.find(function(obj) {
      return pixels.length==obj.selColor.length &&
        pixels.every(function(v,i) { return v === obj.selColor[i]; });
    });
  }

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
})(window || this);
