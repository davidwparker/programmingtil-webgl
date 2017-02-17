(function(global) {

  /*
  * Constants, State, and Main
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  var KEYPRESS_SPEED = 0.2;
  var IMAGES = [
    "/images/txStainglass.bmp",
  ];

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
      blend: {
        dest: 7,
        equation: 0,
        on: false,
        src: 6,
      },
      animate: true,
      eye: {
        x:2.,
        y:2.,
        z:4.,
        w:1.,
      },
      fog: {
        color: new Float32Array([0.5,0.5,0.5]),
        dist: new Float32Array([60, 80]),
        on: false,
      },
      light: {
        ambient:  [0.3, 0.3, 0.3],
        diffuse:  [1.0, 1.0, 1.0],
        position: [1.0, 2.0, 1.7],
      },
      objects: [],
      textures: {},
    },
    eyeInArray: function() {
      return [this.app.eye.x, this.app.eye.y, this.app.eye.z, this.app.eye.w];
    }
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
    initTextures(function() {
      draw();
      if (state.app.animate) {
        animate();
      }
    });
  }

  /*
  * Primitives and Objects
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
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
     aTexCoord: {
       size:2,
       offset:0,
       bufferData: new Float32Array([
         1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,
         0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,
         1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,
         1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,
         0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,
         0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0
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
      var uSampler0 = state.gl.getUniformLocation(state.programs[state.mode], 'uSampler0');
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
      if (state.app.fog.on) {
        state.gl.uniform3fv(uFogColor, state.app.fog.color);
        state.gl.uniform2fv(uFogDist, state.app.fog.dist);
      }

      // Lighting
      if (state.mode === 'render') {
        state.gl.uniform3f(state.uDiffuseLight, state.app.light.diffuse[0], state.app.light.diffuse[1], state.app.light.diffuse[2]);
        state.gl.uniform3f(state.uAmbientLight, state.app.light.ambient[0], state.app.light.ambient[1], state.app.light.ambient[2]);
        state.gl.uniform3f(state.uLightPosition, state.app.light.position[0], state.app.light.position[1], state.app.light.position[2]);

        // Normalized invert
        var nm = mat3.normalFromMat4(mat3.create(), mm);
        state.gl.uniformMatrix3fv(uNormalMatrix, false, nm);
      }

      // Textures
      state.gl.activeTexture(state.gl.TEXTURE0);
      state.gl.bindTexture(state.gl.TEXTURE_2D, state.app.textures['/images/txStainglass.bmp']);
      state.gl.uniform1i(uSampler0, 0);
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
      fragmentShader = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment),
      vertexShader2 = glUtils.getShader(state.gl, state.gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
      fragmentShader2 = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment),
      vertexShader3 = glUtils.getShader(state.gl, state.gl.VERTEX_SHADER, glUtils.SL.Shaders.v3.vertex),
      fragmentShader3 = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v3.fragment);
    state.programs = {
      render: glUtils.createProgram(state.gl, vertexShader3, fragmentShader3),
      read: glUtils.createProgram(state.gl, vertexShader2, fragmentShader2),
    };
  }

  function initGL() {
    state.app.blend.functions = [
      state.gl.ZERO,
      state.gl.ONE,
      state.gl.SRC_COLOR,
      state.gl.ONE_MINUS_SRC_COLOR,
      state.gl.DST_COLOR,
      state.gl.ONE_MINUS_DST_COLOR,
      state.gl.SRC_ALPHA,
      state.gl.ONE_MINUS_SRC_ALPHA,
      state.gl.DST_ALPHA,
      state.gl.ONE_MINUS_DST_ALPHA,
      state.gl.SRC_ALPHA_SATURATE,
      state.gl.CONSTANT_COLOR,
      state.gl.ONE_MINUS_CONSTANT_COLOR,
      state.gl.CONSTANT_ALPHA,
      state.gl.ONE_MINUS_CONSTANT_ALPHA,
    ];
    state.app.blend.equations = [
      state.gl.FUNC_ADD,
      state.gl.FUNC_SUBTRACT,
      state.gl.FUNC_REVERSE_SUBTRACT,
    ];
    state.gl.clearColor(0,0,0,1);
    if (state.app.blend.on) {
      state.gl.disable(state.gl.DEPTH_TEST);
      state.gl.enable(state.gl.BLEND);
      updateBlend();
    } else {
      state.gl.enable(state.gl.DEPTH_TEST);
      state.gl.disable(state.gl.BLEND);
    }
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
      }),
    ];
  }

  /*
  * STATE MANAGEMENT
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function updateBlend(event) {
    state.app.blend.equation = document.getElementById('equation').selectedIndex;
    state.app.blend.src = document.getElementById('source').selectedIndex;
    state.app.blend.dest = document.getElementById('destination').selectedIndex;
    state.gl.blendEquation(state.app.blend.equations[state.app.blend.equation]);
    state.gl.blendFunc(
      state.app.blend.functions[state.app.blend.src],
      state.app.blend.functions[state.app.blend.dest]
    );
  }

  function updateState() {
    if (state.ui.pressedKeys[37]) {
      // left
      state.app.eye.x += KEYPRESS_SPEED;
    } else if (state.ui.pressedKeys[39]) {
      // right
      state.app.eye.x -= KEYPRESS_SPEED;
    } else if (state.ui.pressedKeys[40]) {
      // down
      state.app.eye.y += KEYPRESS_SPEED;
    } else if (state.ui.pressedKeys[38]) {
      // up
      state.app.eye.y -= KEYPRESS_SPEED;
    }
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
  window.updateBlend = updateBlend;

  function keydown(event) {
    state.ui.pressedKeys[event.keyCode] = true;
    // b toggle blend
    if (state.ui.pressedKeys[66]) {
      state.app.blend.on = !state.app.blend.on;
      if (state.app.blend.on) {
        state.gl.enable(state.gl.BLEND);
        state.gl.disable(state.gl.DEPTH_TEST);
        updateBlend();
      }
      else {
        state.gl.disable(state.gl.BLEND);
        state.gl.enable(state.gl.DEPTH_TEST);
      }
    }
  }

  function keyup(event) {
    state.ui.pressedKeys[event.keyCode] = false;
  }

  function mousedown(event) {
    if (uiUtils.inCanvas(event)) {
      state.mode = 'read';
      state.gl.useProgram(state.programs[state.mode]);
      state.app.objects.forEach(function(obj) { obj.readState(); });
      if (state.app.blend.on) {
        state.gl.disable(state.gl.BLEND);
        state.gl.enable(state.gl.DEPTH_TEST);
      }
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
      if (state.app.blend.on) {
        state.gl.enable(state.gl.BLEND);
        state.gl.disable(state.gl.DEPTH_TEST);
      }
      updateBlend();
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

  /*
  * TEXTURES
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function initTextures(callback, args) {
    var promises = [];
    for (var i=0; i<IMAGES.length; i++) {
      var image_src = IMAGES[i];
      var prom = new Promise(function(resolve, reject) {
        var texture = state.gl.createTexture();
        if (!texture) {
          reject(new Error('Failed to create the texture object'));
        }
        texture.src = image_src;
        var image = new Image();
        if (!image) {
          reject(new Error('Failed to create the image object'));
        }
        image.onload = function(){
          state.app.textures[texture.src] = texture;
          loadTexture(image, texture);
          resolve("success");
        };
        image.src = image_src;
      });
      promises.push(prom);
    }

    Promise.all(promises).then(function() {
      if (callback) {
        callback(args);
      }
    }, function(error) {
      console.log('Error loading images', error);
    })
  }

  function loadTexture(image, texture) {
    state.gl.pixelStorei(state.gl.UNPACK_FLIP_Y_WEBGL, 1);
    state.gl.bindTexture(state.gl.TEXTURE_2D, texture);
    state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_MIN_FILTER, state.gl.LINEAR);
    state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_WRAP_S, state.gl.CLAMP_TO_EDGE);
    state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_WRAP_T, state.gl.CLAMP_TO_EDGE);
    state.gl.texImage2D(state.gl.TEXTURE_2D, 0, state.gl.RGBA, state.gl.RGBA, state.gl.UNSIGNED_BYTE, image);
    state.gl.bindTexture(state.gl.TEXTURE_2D, null);
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

  function pickObject(pixels) {
    pixels = pixels.map(function(n) { return n/255; });
    return state.app.objects.find(function(obj) {
      return pixels.length==obj.selColor.length &&
        pixels.every(function(v,i) { return v === obj.selColor[i]; });
    });
  }

})(window || this);
