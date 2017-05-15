(function(global) {

  /*
  * Constants, State, and Main
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  var KEYPRESS_SPEED = 0.2;
  var IMAGES = [
    {name:"stainglass", src:"/images/txStainglass.bmp"},
    {name:"crate", src:"/images/txCrate.bmp"},
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
      animate: true,
      eye: {
        x:2.,
        y:2.,
        z:5.,
        w:1.,
      },
      fog: {
        color: new Float32Array([0.5,0.5,0.5]),
        dist: new Float32Array([60, 80]),
        on: false,
      },
      light: {
        ambient:  [0.2, 0.2, 0.2],
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
    state.overlay = document.getElementById("overlay");
    state.ctx = state.overlay.getContext("2d");
    state.gl = glUtils.checkWebGL(state.canvas, {
      preserveDrawingBuffer: true,
    });
    initCallbacks();
    initShaders();
    initGL();
    initCanvasTexture();
    initState();
    glUtils.initTextures(IMAGES, state.app.textures, function() {
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
    this.id = saKnife.uuid();
    this.opts = opts;
    this.gl = opts.gl;
    this.programs = opts.programs;

    // Vextex positions
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
          1, 0, 1, 1,   1, 0, 1, 1,   1, 0, 1, 1,  1, 0, 1, 1,
          1, 1, 0, 1,   1, 1, 0, 1,   1, 1, 0, 1,  1, 1, 0, 1,
          1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,  1, 0, 0, 1,
          0, 1, 0, 1,   0, 1, 0, 1,   0, 1, 0, 1,  0, 1, 0, 1,
          0, 1, 1, 1,   0, 1, 1, 1,   0, 1, 1, 1,  0, 1, 1, 1,
          0, 0, 1, 1,   0, 0, 1, 1,   0, 0, 1, 1,  0, 0, 1, 1
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
     aSelColor: {
       size:4,
       offset:0,
       bufferData: undefined,
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

    // Functionality
    this.readState = function() {
      this.attributes.aColorBackup = this.attributes.aColor;
      this.attributes.aColor = this.attributes.aSelColor;
      this.state.renderMode = 'read';
    };
    this.drawState = function() {
      this.attributes.aColor = this.attributes.aColorBackup;
      this.state.renderMode = 'render';
    };

    this.draw = function() {
      this.gl.useProgram(this.programs[this.state.renderMode]);
      var uMVPMatrix = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uMVPMatrix');
      var uModelMatrix = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uModelMatrix');
      var uNormalMatrix = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uNormalMatrix');
      var uAmbientLight = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uAmbientLight');
      var uDiffuseLight = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uDiffuseLight');
      var uLightPosition = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uLightPosition');
      var uFogColor = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uFogColor');
      var uFogDist = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uFogDist');
      var uSampler0 = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uSampler0');
      var mvp = state.mvp;
      this.programs[this.state.renderMode].renderBuffers(this);
      var n = this.indices.length;

      // Model matrix
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
      this.gl.uniformMatrix4fv(uModelMatrix, false, mm);

      // MVP matrix
      mat4.copy(mvp, state.pm);
      mat4.multiply(mvp, mvp, state.vm);
      mat4.multiply(mvp, mvp, mm);
      this.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);

      // Fog
      if (state.app.fog.on) {
        this.gl.uniform3fv(uFogColor, state.app.fog.color);
        this.gl.uniform2fv(uFogDist, state.app.fog.dist);
      }

      // Lighting
      if (this.state.renderMode === 'render') {
        this.gl.uniform3f(uDiffuseLight, state.app.light.diffuse[0], state.app.light.diffuse[1], state.app.light.diffuse[2]);
        this.gl.uniform3f(uAmbientLight, state.app.light.ambient[0], state.app.light.ambient[1], state.app.light.ambient[2]);
        this.gl.uniform3f(uLightPosition, state.app.light.position[0], state.app.light.position[1], state.app.light.position[2]);
        var nm = mat3.normalFromMat4(mat3.create(), mm);
        this.gl.uniformMatrix3fv(uNormalMatrix, false, nm);
      }

      // Textures
      if (this.state.hasTexture) {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, state.app.textures[this.opts.texture]);
        this.gl.uniform1i(uSampler0, 0);
      }

      // Blending
      if (this.state.hasBlend && this.state.renderMode === 'render') {
        this.gl.blendFunc(this.state.blendSrc, this.state.blendDst);
        this.gl.blendEquation(this.state.blendEquation);
        this.gl.disable(this.gl.CULL_FACE);
      }
      else {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.BLEND);
        this.gl.depthMask(true);

        // Culling
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
      }

      // Culling
      this.gl.enable(this.gl.CULL_FACE);
      // this.gl.cullFace(this.gl.FRONT_AND_BACK);
      this.gl.cullFace(this.gl.FRONT);
      // this.gl.cullFace(this.gl.BACK);

      // Draw!
      this.gl.drawElements(this.gl.TRIANGLES, n, this.gl.UNSIGNED_BYTE, 0);
    };

    // Cube Initialization
    this.init = function(_this) {
      var selColor = opts.selColor ? opts.selColor : [0,0,0,0];
      _this.selColor = selColor.map(function(n) { return n/255; });
      var arrays = [
        _this.selColor, _this.selColor, _this.selColor, _this.selColor,
        _this.selColor, _this.selColor, _this.selColor, _this.selColor,
        _this.selColor, _this.selColor, _this.selColor, _this.selColor,
        _this.selColor, _this.selColor, _this.selColor, _this.selColor,
        _this.selColor, _this.selColor, _this.selColor, _this.selColor,
        _this.selColor, _this.selColor, _this.selColor, _this.selColor,
      ];
      _this.attributes.aSelColor.bufferData = new Float32Array([].concat.apply([], arrays));

      _this.state = {
        angle: opts.angle ? opts.angle : [0,0,0],
        blendEquation: opts.blendEquation ? opts.blendEquation : _this.gl.FUNC_ADD,
        blendSrc: opts.blendSrc ? opts.blendSrc : _this.gl.SRC_ALPHA,
        blendDst: opts.blendDst ? opts.blendDst : _this.gl.ONE_MINUS_SRC_ALPHA,
        hasBlend: opts.blend ? true : false,
        hasTexture: opts.texture ? true : false,
        mm: mat4.create(),
        nm: null,
        renderMode: 'render',
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
    var vertexRead   = glUtils.getShader(state.gl.VERTEX_SHADER, glUtils.SL.Shaders.read.vertex),
      fragmentRead = glUtils.getShader(state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.read.fragment),
      vertexRender = glUtils.getShader(state.gl.VERTEX_SHADER, glUtils.SL.Shaders.render.vertex),
      fragmentRender = glUtils.getShader(state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.render.fragment),
      vertexTex    = glUtils.getShader(state.gl.VERTEX_SHADER, glUtils.SL.Shaders.tex.vertex),
      fragmentTex  = glUtils.getShader(state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.tex.fragment);
    state.programs = {
      read: glUtils.createProgram(vertexRead, fragmentRead),
      render: glUtils.createProgram(vertexRender, fragmentRender),
      texture: glUtils.createProgram(vertexTex, fragmentTex),
    };
  }

  function initGL() {
    state.gl.clearColor(0,0,0,1);
  }

  function initState() {
    state.vm = mat4.create();
    state.pm = mat4.create();
    state.mvp = mat4.create();
    state.app.objects = [
      new Cube({
        blend: true,
        blendDst: state.gl.ONE,
        gl: state.gl,
        programs: {
          render: state.programs.texture,
          read: state.programs.read,
        },
        selColor:[255,254,0,0],
        scale:[0.5,0.5,0.5],
        texture:'stainglass',
      }),
      new Cube({
        gl: state.gl,
        programs: {
          render: state.programs.render,
          read: state.programs.read,
        },
        selColor:[255,255,0,0],
        translate:[3,0,0],
      }),
      new Cube({
        gl: state.gl,
        programs: {
          render: state.programs.render,
          read: state.programs.read,
        },
        selColor:[255,253,0,0],
        scale:[0.5,0.5,0.5],
        translate:[-2, 2, 0],
      }),
      new Cube({
        blend: true,
        blendDst: state.gl.ONE,
        gl: state.gl,
        programs: {
          render: state.programs.texture,
          read: state.programs.read,
        },
        selColor:[255,252,0,0],
        scale:[0.6,0.6,0.6],
        texture:'crate',
        translate:[-2, -2, 2],
        angle: [0,35,0],
      }),
      new Cube({
        gl: state.gl,
        programs: {
          render: state.programs.texture,
          read: state.programs.read,
        },
        selColor:[255,251,0,0],
        scale:[0.2,0.2,0.2],
        texture:'crate',
        translate:[2, 2, 2],
        angle: [75,0,0],
      }),
    ];
  }

  function initCanvasTexture() {
    var texture = state.gl.createTexture();
    var textCanvas = document.createElement('canvas');
    textCanvas.width = 256;
    textCanvas.height = 256;
    var ctx = textCanvas.getContext('2d');

    // Setup background
    ctx.fillStyle = 'rgba(53, 60, 145, 1.0)';
    ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

    // Setup font
    ctx.font = '36px bold sans-serif';
    ctx.fillStyle = 'rgba(0, 60, 145, 1.0)';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(10, 160, 190, 1.0)';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 5;

    // Draw out some text
    var text = 'ProgrammingTIL';
    var textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (textCanvas.width-textWidth)/2, textCanvas.height/2);

    // Change the font and draw out more text
    ctx.font = '26px bold sans-serif';
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    text = 'David';
    textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (textCanvas.width-textWidth)/2, textCanvas.height/2 - 60);
    text = 'Parker';
    textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (textCanvas.width-textWidth)/2, textCanvas.height/2 + 60);

    // Put the canvas onto the texture object
    state.gl.pixelStorei(state.gl.UNPACK_FLIP_Y_WEBGL, 1);
    state.gl.bindTexture(state.gl.TEXTURE_2D, texture);
    state.gl.texImage2D(state.gl.TEXTURE_2D, 0, state.gl.RGBA, state.gl.RGBA, state.gl.UNSIGNED_BYTE, textCanvas);
    state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_MAG_FILTER, state.gl.LINEAR);
    state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_MIN_FILTER, state.gl.LINEAR);
    state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_WRAP_S, state.gl.CLAMP_TO_EDGE);
    state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_WRAP_T, state.gl.CLAMP_TO_EDGE);

    state.app.textures['canvastext'] = texture;
  }

  /*
  * State Management
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function updateOverlay() {
    var msg = "Eye position: ("+state.app.eye.x.toFixed(2)+","+state.app.eye.y.toFixed(2)+","+state.app.eye.z.toFixed(2)+")";
    state.ctx.clearRect(0,0,state.ctx.canvas.width,state.ctx.canvas.height);
    state.ctx.save();
    state.ctx.font = "20px Helvetica";
    state.ctx.fillStyle = "white";
    state.ctx.fillText(msg, 10, 25);
    state.ctx.restore();
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
    } else if (state.ui.pressedKeys[90] && !state.ui.pressedKeys[16]) {
      // z
      state.app.eye.z += KEYPRESS_SPEED;
    } else if (state.ui.pressedKeys[90] && state.ui.pressedKeys[16]) {
      // Shift+z
      state.app.eye.z -= KEYPRESS_SPEED;
    }
  }

  /*
  * Rendering / Drawing / Animation
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function animate() {
    state.animation.tick = function() {
      updateOverlay();
      updateState();
      draw();
      requestAnimationFrame(state.animation.tick);
    };
    state.animation.tick();
  }

  function draw() {
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    mat4.perspective(state.pm,
      20, state.canvas.width/state.canvas.height, 1, 100
    );
    mat4.lookAt(state.vm,
      vec3.fromValues(state.app.eye.x,state.app.eye.y,state.app.eye.z),
      vec3.fromValues(0,0,0),
      vec3.fromValues(0,1,0)
    );

    // Note: First you should sort (transparent) objects based on distance -> furthest away first
    // For our purposes, we'll loop through everything twice. Once to draw opaque objects
    // and another for transparent objects.
    state.gl.enable(state.gl.DEPTH_TEST);
    state.gl.disable(state.gl.BLEND);
    state.gl.depthMask(true);
    state.app.objects.forEach(function(obj) {
      if (!obj.state.hasBlend) {
        obj.draw();
      }
    });
    // Leave on the depth test!
    // state.gl.disable(state.gl.DEPTH_TEST);
    state.gl.enable(state.gl.BLEND);
    state.gl.depthMask(false);
    state.app.objects.forEach(function(obj) {
      if (obj.state.hasBlend) {
        obj.draw();
      }
    });
    state.gl.depthMask(true);
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
      state.gl.disable(state.gl.BLEND);
      state.gl.enable(state.gl.DEPTH_TEST);
      state.gl.depthMask(true);
      state.app.objects.forEach(function(obj) {
        obj.readState();
        draw();
      });
      var pixels = Array.from(uiUtils.pixelsFromMouseClick(event, state.canvas, state.gl));
      var obj2 = uiUtils.pickObject(pixels, state.app.objects, 'selColor');
      if (obj2) {
        state.app.objSel = obj2;
        state.ui.mouse.lastX = event.clientX;
        state.ui.mouse.lastY = event.clientY;
        state.ui.dragging = true;
      }
      state.gl.enable(state.gl.BLEND);
      state.gl.disable(state.gl.DEPTH_TEST);
      state.gl.depthMask(false);
      state.app.objects.forEach(function(obj) {
        obj.drawState();
        draw();
      });
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
})(window || this);
