(function(global) {

  /*
  * Constants, State, and Main
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  var OFFSCREEN_WIDTH = 256;
  var OFFSCREEN_HEIGHT = 256;
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
    req: null,
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
    initFramebufferObject();
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
        if (this.state.fbo) {
          this.gl.bindTexture(this.gl.TEXTURE_2D, state.fbo.texture);
        }
        else {
          this.gl.bindTexture(this.gl.TEXTURE_2D, state.app.textures[this.opts.texture]);
        }
        this.gl.uniform1i(uSampler0, 0);
      }

      // Blending
      if (this.state.hasBlend && this.state.renderMode === 'render') {
        this.gl.blendFunc(this.state.blendSrc, this.state.blendDst);
        this.gl.blendEquation(this.state.blendEquation);
      }
      else {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.BLEND);
        this.gl.depthMask(true);
      }

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
        hasFbo: opts.hasFbo ? true : false,
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
    state.canvas.addEventListener('webglcontextlost', webglcontextlost);
  }

  function webglcontextlost(e) {
    // Must prevent default, otherwise we get the error:
    // INVALID_OPERATION: restoreContext: context restoration not allowed
    e.preventDefault();
    console.log('lost', e);
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
    // Must set the initially, if trying to access on the fly, it'll be null later once context is lost
    state.gl.WEBGL_lose_context_ext = state.gl.getExtension('WEBGL_lose_context');
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
        hasFbo: true,
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
        translate:[3,0,0]
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
        hasFbo: true,
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
      state.req = requestAnimationFrame(state.animation.tick);
    };
    state.animation.tick();
  }

  function draw() {
    state.gl.bindFramebuffer(state.gl.FRAMEBUFFER, state.fbo);  // Change the drawing destination to FBO
    state.gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT); // Set a viewport for FBO

    state.gl.clearColor(0.2, 0.2, 0.4, 1.0); // Set clear color (the color is slightly changed)
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);

    mat4.perspective(state.pm,
      20, OFFSCREEN_WIDTH/OFFSCREEN_HEIGHT, 1, 100
    );
    mat4.lookAt(state.vm,
      vec3.fromValues(state.app.eye.x,state.app.eye.y,state.app.eye.z),
      vec3.fromValues(0,0,0),
      vec3.fromValues(0,1,0)
    );

    // Set FBOs
    state.app.objects.forEach(function(obj) {
      if (obj.state.hasTexture && obj.state.hasFbo) {
        obj.state.fbo = state.fbo;
      }
    });

    // Draw opaque and blended objects
    state.gl.enable(state.gl.DEPTH_TEST);
    state.gl.disable(state.gl.BLEND);
    state.gl.depthMask(true);
    state.app.objects.forEach(function(obj) {
      if (!obj.state.hasBlend && !obj.state.hasFbo) {
        obj.draw();
      }
    });
    state.gl.enable(state.gl.BLEND);
    state.gl.depthMask(false);
    state.app.objects.forEach(function(obj) {
      if (obj.state.hasBlend && !obj.state.hasFbo) {
        obj.draw();
      }
    });
    state.gl.depthMask(true);

    // Back to drawing on the main color buffer!
    state.gl.bindFramebuffer(state.gl.FRAMEBUFFER, null);        // Change the drawing destination to color buffer
    state.gl.viewport(0, 0, state.canvas.width, state.canvas.height);  // Set the size of viewport back to that of <canvas>

    state.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT); // Clear the color buffer

    // Draw again...
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
    // Simulate Context lost and restore here.
    if (String.fromCharCode(event.keyCode) == "L") {
      console.log('isContextLost', state.gl.isContextLost());
      if (!state.gl.isContextLost() && state.gl.WEBGL_lose_context_ext) {
        state.gl.WEBGL_lose_context_ext.loseContext();
      }
      else if (state.gl.isContextLost() && state.gl.WEBGL_lose_context_ext) {
        state.gl.WEBGL_lose_context_ext.restoreContext();
      }
    }
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

  /*
  * Framebuffer
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function initFramebufferObject() {
    var framebuffer, texture, depthBuffer;

    // Define the error handling function
    var error = function() {
      if (framebuffer) state.gl.deleteFramebuffer(framebuffer);
      if (texture) state.gl.deleteTexture(texture);
      if (depthBuffer) state.gl.deleteRenderbuffer(depthBuffer);
      return null;
    }

    // Create a frame buffer object (FBO)
    framebuffer = state.gl.createFramebuffer();
    if (!framebuffer) {
      console.log('Failed to create frame buffer object');
      return error();
    }

    // Create a texture object and set its size and parameters
    texture = state.gl.createTexture(); // Create a texture object
    if (!texture) {
      console.log('Failed to create texture object');
      return error();
    }
    state.gl.bindTexture(state.gl.TEXTURE_2D, texture); // Bind the object to target
    state.gl.texImage2D(state.gl.TEXTURE_2D, 0, state.gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, state.gl.RGBA, state.gl.UNSIGNED_BYTE, null);
    state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_MIN_FILTER, state.gl.LINEAR);
    framebuffer.texture = texture; // Store the texture object

    // Create a renderbuffer object and Set its size and parameters
    depthBuffer = state.gl.createRenderbuffer(); // Create a renderbuffer object
    if (!depthBuffer) {
      console.log('Failed to create renderbuffer object');
      return error();
    }
    state.gl.bindRenderbuffer(state.gl.RENDERBUFFER, depthBuffer); // Bind the object to target
    state.gl.renderbufferStorage(state.gl.RENDERBUFFER, state.gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    // Attach the texture and the renderbuffer object to the FBO
    state.gl.bindFramebuffer(state.gl.FRAMEBUFFER, framebuffer);
    state.gl.framebufferTexture2D(state.gl.FRAMEBUFFER, state.gl.COLOR_ATTACHMENT0, state.gl.TEXTURE_2D, texture, 0);
    state.gl.framebufferRenderbuffer(state.gl.FRAMEBUFFER, state.gl.DEPTH_ATTACHMENT, state.gl.RENDERBUFFER, depthBuffer);

    // Check if FBO is configured correctly
    var e = state.gl.checkFramebufferStatus(state.gl.FRAMEBUFFER);
    if (state.gl.FRAMEBUFFER_COMPLETE !== e) {
      console.log('Frame buffer object is incomplete: ' + e.toString());
      return error();
    }

    // Unbind the buffer object
    state.gl.bindFramebuffer(state.gl.FRAMEBUFFER, null);
    state.gl.bindTexture(state.gl.TEXTURE_2D, null);
    state.gl.bindRenderbuffer(state.gl.RENDERBUFFER, null);

    state.fbo = framebuffer;
  }
})(window || this);
