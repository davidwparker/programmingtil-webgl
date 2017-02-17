(function(global) {

  /*
  * Constants and Main
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  var state = {
    gl: null,
    mode: 'render',
    ui: {
      dragging: false,
      mouse: {
        lastX: -1,
        lastY: -1,
      },
      pressedKeys: {},
    },
    animation: {},
    app: {
      animate: true,
      eye: {
        x:25.,
        y:65.,
        z:35.,
        w:1.,
      },
      fog: {
        color: new Float32Array([0.5,0.5,0.5]),
        dist: new Float32Array([60, 80]),
      },
      light: {
        ambient:  [0.2, 0.2, 0.2],
        diffuse:  [1.0, 1.0, 1.0],
        position: [25.0, 65.0, 35.0],
      },
      objects: [],
    },
    eyeInArray: function() {
      return [this.app.eye.x, this.app.eye.y, this.app.eye.z, this.app.eye.w];
    }
  };

  // Create a cube
  function Cube(opts) {
    var opts = opts || {};
    this.id = uuid();
    this.opts = opts;
     // v0-v1-v2-v3 front
     // v0-v3-v4-v5 right
     // v0-v5-v6-v1 up
     // v1-v6-v7-v2 left
     // v7-v4-v3-v2 down
     // v4-v7-v6-v5 back
    this.attributes = {
      aColor: {
        size:4,
        offset:0,
        bufferData: new Float32Array([
          1, 0, 1, 0.4,   1, 0, 1, 0.4,   1, 0, 1, 0.4,  1, 0, 1, 0.4,
          1, 1, 0, 0.4,   1, 1, 0, 0.4,   1, 1, 0, 0.4,  1, 1, 0, 0.4,
          1, 0, 0, 0.4,   1, 0, 0, 0.4,   1, 0, 0, 0.4,  1, 0, 0, 0.4,
          0, 1, 0, 0.4,   0, 1, 0, 0.4,   0, 1, 0, 0.4,  0, 1, 0, 0.4,
          0, 1, 1, 0.4,   0, 1, 1, 0.4,   0, 1, 1, 0.4,  0, 1, 1, 0.4,
          0, 0, 1, 0.4,   0, 0, 1, 0.4,   0, 0, 1, 0.4,  0, 0, 1, 0.4
        ]),
      },
      aNormal: {
        size:3,
        offset:0,
        bufferData: new Float32Array([
          0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,
          1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,
          0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,
         -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,
          0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,
          0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0
        ]),
      },
      aPosition: {
        size:3,
        offset:0,
        bufferData: new Float32Array([
          1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,
          1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,
          1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,
         -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,
         -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,
          1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0
       ]),
     },
    };
    this.indices = new Uint8Array([
      0, 1, 2,   0, 2, 3,
      4, 5, 6,   4, 6, 7,
      8, 9,10,   8,10,11,
      12,13,14,  12,14,15,
      16,17,18,  16,18,19,
      20,21,22,  20,22,23
    ]);
    this.state = {
      angle: opts.angle ? opts.angle : [0,0,0],
      mm: mat4.create(),
      nm: null,
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

    this.draw = function() {
      var uMVPMatrix = state.gl.getUniformLocation(state.programs[state.mode], 'uMVPMatrix');
      var uModelMatrix = state.gl.getUniformLocation(state.programs[state.mode], 'uModelMatrix');
      var uNormalMatrix = state.gl.getUniformLocation(state.programs[state.mode], 'uNormalMatrix');
      var uFogColor = state.gl.getUniformLocation(state.programs[state.mode], 'uFogColor');
      var uFogDist = state.gl.getUniformLocation(state.programs[state.mode], 'uFogDist');
      var mvp = state.mvp;
      state.programs[state.mode].renderBuffers(this);
      var n = this.indices.length;
      var mm = mat4.create();
      if (this.opts.translate) {
        mat4.translate(mm, mm, this.opts.translate);
      }
      if (this.opts.scale) {
        mat4.scale(mm, mm, this.opts.scale);
      }
      if (this.state.angle[0] || this.state.angle[1] || this.state.angle[2]) {
        mat4.rotateX(mm, mm, this.state.angle[0]);
        mat4.rotateY(mm, mm, this.state.angle[1]);
        mat4.rotateZ(mm, mm, this.state.angle[2]);
      }
      state.gl.uniformMatrix4fv(uModelMatrix, false, mm);

      mat4.copy(mvp, state.pm);
      mat4.multiply(mvp, mvp, state.vm);
      mat4.multiply(mvp, mvp, mm);
      state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);

      // Fog
      state.gl.uniform3fv(uFogColor, state.app.fog.color);
      state.gl.uniform2fv(uFogDist, state.app.fog.dist);

      // Lighting
      if (state.mode === 'render') {
        state.gl.uniform3f(state.uDiffuseLight, state.app.light.diffuse[0], state.app.light.diffuse[1], state.app.light.diffuse[2]);
        state.gl.uniform3f(state.uAmbientLight, state.app.light.ambient[0], state.app.light.ambient[1], state.app.light.ambient[2]);
        state.gl.uniform3f(state.uLightPosition, state.app.light.position[0], state.app.light.position[1], state.app.light.position[2]);

        // Normalized invert
        var nm = mat3.normalFromMat4(mat3.create(), mm);
        state.gl.uniformMatrix3fv(uNormalMatrix, false, nm);
      }
      state.gl.drawElements(state.gl.TRIANGLES, n, state.gl.UNSIGNED_BYTE, 0);
    };

    // Initialization
    this.init = function(_this) {
      _this.selColor = _this.selColor.map(function(n) { return n/255; });
      var arrays = [
        _this.selColor, _this.selColor, _this.selColor, _this.selColor,
        _this.selColor, _this.selColor, _this.selColor, _this.selColor,
        _this.selColor, _this.selColor, _this.selColor, _this.selColor,
        _this.selColor, _this.selColor, _this.selColor, _this.selColor,
        _this.selColor, _this.selColor, _this.selColor, _this.selColor,
        _this.selColor, _this.selColor, _this.selColor, _this.selColor,
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
    state.gl = glUtils.checkWebGL(state.canvas, {
      preserveDrawingBuffer: true,
    });
    initCallbacks();
    initShaders();
    initGL();
    initState();
    draw();
    if (state.app.animate) {
      animate();
    }
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
    state.canvas.onmouseup = mouseup;
    state.canvas.onmousemove = mousemove;
  }

  function initShaders() {
    var vertexShader = glUtils.getShader(state.gl, state.gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
      vertexShader2 = glUtils.getShader(state.gl, state.gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
      fragmentShader = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment),
      fragmentShader2 = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);
    state.programs = {
      render: glUtils.createProgram(state.gl, vertexShader2, fragmentShader2),
      read: glUtils.createProgram(state.gl, vertexShader2, fragmentShader2),
    };
  }

  function initGL() {
    state.gl.clearColor(0,0,0,1);
    // state.gl.enable(state.gl.DEPTH_TEST);
    state.gl.enable(state.gl.BLEND);
    state.gl.blendFunc(state.gl.SRC_ALPHA, state.gl.ONE_MINUS_SRC_ALPHA);
    state.gl.useProgram(state.programs[state.mode]);
  }

  function initState() {
    state.uAmbientLight = state.gl.getUniformLocation(state.programs[state.mode], 'uAmbientLight');
    state.uDiffuseLight = state.gl.getUniformLocation(state.programs[state.mode], 'uDiffuseLight');
    state.uLightPosition = state.gl.getUniformLocation(state.programs[state.mode], 'uLightPosition');
    state.vm = mat4.create();
    state.pm = mat4.create();
    state.mvp = mat4.create();
    state.app.objects = [
      new Cube({
        selColor:[255,255,0,0],
        scale:[10.0,10.0,10.0],
      }),
    ];
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
    mat4.perspective(state.pm,
      20, state.canvas.width/state.canvas.height, 1, 100
    );
    mat4.lookAt(state.vm,
      vec3.fromValues(state.app.eye.x,state.app.eye.y,state.app.eye.z),
      vec3.fromValues(0,0,0),
      vec3.fromValues(0,1,0)
    );

    // Loop through each object and draw!
    state.app.objects.forEach(function(obj) {
      obj.draw();
    });
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
    if (uiUtils.inCanvas(event)) {
      state.mode = 'read';
      state.gl.useProgram(state.programs[state.mode]);
      state.app.objects.forEach(function(obj) { obj.readState(); });
      state.gl.disable(state.gl.BLEND);
      state.gl.enable(state.gl.DEPTH_TEST);
      draw();
      var pixels = Array.from(uiUtils.pixelsFromMouseClick(event, state.canvas, state.gl));
      var obj = pickObject(pixels);
      if (obj) {
        var x = event.clientX;
        var y = event.clientY;
        state.app.objSel = obj;
        state.ui.mouse.lastX = x;
        state.ui.mouse.lastY = y;
        state.ui.dragging = true;
      }
      state.mode = 'render';
      state.gl.useProgram(state.programs[state.mode]);
      state.app.objects.forEach(function(obj) { obj.drawState(); });
      state.gl.enable(state.gl.BLEND);
      state.gl.disable(state.gl.DEPTH_TEST);
      state.gl.blendFunc(state.gl.SRC_ALPHA, state.gl.ONE_MINUS_SRC_ALPHA);
      draw();
    }
  }

  function mouseup(event) {
    state.ui.dragging = false;
  }

  function mousemove(event) {
    var x = event.clientX;
    var y = event.clientY;
    if (state.ui.dragging) {
      // The rotation speed factor
      // dx and dy here are how for in the x or y direction the mouse moved
      var factor = 10/state.canvas.height;
      var dx = factor * (x - state.ui.mouse.lastX);
      var dy = factor * (y - state.ui.mouse.lastY);

      // update the latest angle
      state.app.objSel.state.angle[0] = state.app.objSel.state.angle[0] + dy;
      state.app.objSel.state.angle[1] = state.app.objSel.state.angle[1] + dx;
    }
    // update the last mouse position
    state.ui.mouse.lastX = x;
    state.ui.mouse.lastY = y;
  }

  function pickObject(pixels) {
    pixels = pixels.map(function(n) { return n/255; });
    return state.app.objects.find(function(obj) {
      return pixels.length==obj.selColor.length &&
        pixels.every(function(v,i) { return v === obj.selColor[i]; });
    });
  }

  /*
  * Utility
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
})(window || this);
