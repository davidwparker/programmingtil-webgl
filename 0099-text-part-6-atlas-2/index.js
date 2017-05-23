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
    {name:"atlas", src:"/images/atlas.png"},
  ];
  var atlas = {
    height: 8,
    width: 8,
    textureHeight: 40,
    textureWidth: 64,
    glyphs: {
      'a': { x:  0, y:  0, width: 8, },
      'b': { x:  8, y:  0, width: 8, },
      'c': { x: 16, y:  0, width: 8, },
      'd': { x: 24, y:  0, width: 8, },
      'e': { x: 32, y:  0, width: 8, },
      'f': { x: 40, y:  0, width: 8, },
      'g': { x: 48, y:  0, width: 8, },
      'h': { x: 56, y:  0, width: 8, },
      'i': { x:  0, y:  8, width: 8, },
      'j': { x:  8, y:  8, width: 8, },
      'k': { x: 16, y:  8, width: 8, },
      'l': { x: 24, y:  8, width: 8, },
      'm': { x: 32, y:  8, width: 8, },
      'n': { x: 40, y:  8, width: 8, },
      'o': { x: 48, y:  8, width: 8, },
      'p': { x: 56, y:  8, width: 8, },
      'q': { x:  0, y: 16, width: 8, },
      'r': { x:  8, y: 16, width: 8, },
      's': { x: 16, y: 16, width: 8, },
      't': { x: 24, y: 16, width: 8, },
      'u': { x: 32, y: 16, width: 8, },
      'v': { x: 40, y: 16, width: 8, },
      'w': { x: 48, y: 16, width: 8, },
      'x': { x: 56, y: 16, width: 8, },
      'y': { x:  0, y: 24, width: 8, },
      'z': { x:  8, y: 24, width: 8, },
      '0': { x: 16, y: 24, width: 8, },
      '1': { x: 24, y: 24, width: 8, },
      '2': { x: 32, y: 24, width: 8, },
      '3': { x: 40, y: 24, width: 8, },
      '4': { x: 48, y: 24, width: 8, },
      '5': { x: 56, y: 24, width: 8, },
      '6': { x:  0, y: 32, width: 8, },
      '7': { x:  8, y: 32, width: 8, },
      '8': { x: 16, y: 32, width: 8, },
      '9': { x: 24, y: 32, width: 8, },
      '-': { x: 32, y: 32, width: 8, },
      '*': { x: 40, y: 32, width: 8, },
      '!': { x: 48, y: 32, width: 8, },
      '?': { x: 56, y: 32, width: 8, },
    },
  };

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
        x:0.,
        y:0.,
        z:5.,
        w:1.,
      },
      objects: [],
      overlay: true,
      textures: {},
    },
  };

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    state.canvas = document.getElementById("glcanvas");
    if (state.app.overlay) {
      state.overlay = document.getElementById("overlay");
      state.ctx = state.overlay.getContext("2d");
    }
    state.gl = glUtils.checkWebGL(state.canvas, {
      preserveDrawingBuffer: true,
    });
    initCallbacks();
    initShaders();
    initGL();
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
  // A plane
  function Plane(opts) {
    var opts = opts || {};
    this.id = saKnife.uuid();
    this.opts = opts;
    this.gl = opts.gl;
    this.programs = opts.programs;

    // Vextex positions
    // v0-v1-v2-v3 front
    this.attributes = {
      aPosition: {
        size:3,
        offset:0,
        bufferData: new Float32Array([
          1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0
       ]),
     },
     aTexCoord: {
       size:2,
       offset:0,
       bufferData: new Float32Array([
         1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0
       ]),
     },
    };
    this.indices = new Uint8Array([
      0, 1, 2,   0, 2, 3
    ]);

    // Functionality
    this.readState = function() {
      this.state.renderMode = 'read';
    };
    this.drawState = function() {
      this.state.renderMode = 'render';
    };

    this.draw = function() {
      this.gl.useProgram(this.programs[this.state.renderMode]);
      var uMVPMatrix = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uMVPMatrix');
      var uModelMatrix = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uModelMatrix');
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

      if (this.state.hasTexture) {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, state.app.textures[this.opts.texture]);
        this.gl.uniform1i(uSampler0, 0);
      }
      this.gl.drawElements(this.gl.TRIANGLES, n, this.gl.UNSIGNED_BYTE, 0);
    };

    this.init = function(_this) {
      _this.state = {
        angle: opts.angle ? opts.angle : [0,0,0],
        hasTexture: opts.texture ? true : false,
        mm: mat4.create(),
        renderMode: 'render',
      };
    }(this);
  }

  // Create Text
  function Text(opts) {
    var opts = opts || {};
    this.id = saKnife.uuid();
    this.opts = opts;
    this.gl = opts.gl;
    this.programs = opts.programs;

    // Vextex positions
    // v0-v1-v2-v3 front
    this.attributes = {
      aPosition: {
        size:2,
        offset:0,
      },
      aTexCoord: {
        size:2,
        offset:0,
      },
    };

    // Functionality
    this.readState = function() {
      this.state.renderMode = 'read';
    };
    this.drawState = function() {
      this.state.renderMode = 'render';
    };
    this.draw = function() {
      this.gl.useProgram(this.programs[this.state.renderMode]);
      var uMVPMatrix = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uMVPMatrix');
      var uSampler0 = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uSampler0');
      this.programs[this.state.renderMode].renderBuffers(this);
      var n = this.indices.length;
      var mvp = state.mvp;
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

      // MVP matrix
      mat4.copy(mvp, state.pm);
      mat4.multiply(mvp, mvp, state.vm);
      mat4.multiply(mvp, mvp, mm);
      this.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);

      // Textures
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, state.app.textures['atlas']);
      this.gl.uniform1i(uSampler0, 0);

      // Draw!
      this.gl.drawElements(this.gl.TRIANGLES, n, this.gl.UNSIGNED_BYTE, 0);
    };

    // Text Initialization
    this.init = function(_this) {
      _this.state = {
        angle: opts.angle ? opts.angle : [0,0,0],
        mm: mat4.create(),
        renderMode: 'render',
        text: opts.text ? opts.text : '',
      };

      // Creating the positions and tex coords
      var len = _this.state.text.length;
      var numVertices = len * 6;
      var indices = new Uint8Array(numVertices);
      var positions = new Float32Array(numVertices * 2);
      var texcoords = new Float32Array(numVertices * 2);
      var offset = 0;
      var indexOffset = 0;
      var x = 0;
      var maxX = atlas.textureWidth;
      var maxY = atlas.textureHeight;
      for (var i = 0; i < _this.state.text.length; i++) {
        var letter = _this.state.text[i];
        var glyph = atlas.glyphs[letter];
        if (glyph) {
          var x2 = x + glyph.width;
          var u1 = glyph.x / maxX;
          var v1 = (glyph.y + atlas.height - 1) / maxY;
          var u2 = (glyph.x + glyph.width - 1) / maxX;
          var v2 = glyph.y / maxY;

          // 6 vertices per letter
          // 0
          indices[indexOffset + 0] = indexOffset + 0;
          positions[offset + 0] = x/8;
          positions[offset + 1] = 0/8;
          texcoords[offset + 0] = u1;
          texcoords[offset + 1] = v1;

          // 1
          indices[indexOffset + 1] = indexOffset +1;
          positions[offset + 2] = x2/8;
          positions[offset + 3] = 0/8;
          texcoords[offset + 2] = u2;
          texcoords[offset + 3] = v1;

          // 2
          indices[indexOffset + 2] = indexOffset + 2;
          positions[offset + 4] = x/8;
          positions[offset + 5] = atlas.height/8;
          texcoords[offset + 4] = u1;
          texcoords[offset + 5] = v2;

          // 2
          indices[indexOffset + 3] = indexOffset + 3;
          positions[offset + 6] = x/8;
          positions[offset + 7] = atlas.height/8;
          texcoords[offset + 6] = u1;
          texcoords[offset + 7] = v2;

          // 1
          indices[indexOffset + 4] = indexOffset + 4;
          positions[offset + 8] = x2/8;
          positions[offset + 9] = 0/8;
          texcoords[offset + 8] = u2;
          texcoords[offset + 9] = v1;

          // 3
          indices[indexOffset + 5] = indexOffset + 5;
          positions[offset + 10] = x2/8;
          positions[offset + 11] = atlas.height/8;
          texcoords[offset + 10] = u2;
          texcoords[offset + 11] = v2;

          x += glyph.width;
          offset += 12;
          indexOffset += 6;
        } else {
          // Missing character
          x += atlas.width;
        }
      }

      var vertices = {
        position: new Float32Array(positions.buffer, 0, offset),
        texCoord: new Float32Array(texcoords.buffer, 0, offset),
      };
      _this.attributes.aPosition.bufferData = vertices.position;
      _this.attributes.aTexCoord.bufferData = vertices.texCoord;
      _this.indices = indices;
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
    var vertexRead = glUtils.getShader(state.gl.VERTEX_SHADER, glUtils.SL.Shaders.read.vertex),
      fragmentRead = glUtils.getShader(state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.read.fragment),
      vertexRender = glUtils.getShader(state.gl.VERTEX_SHADER, glUtils.SL.Shaders.render.vertex),
      fragmentRender = glUtils.getShader(state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.render.fragment),
      vertexTex    = glUtils.getShader(state.gl.VERTEX_SHADER, glUtils.SL.Shaders.tex.vertex),
      fragmentTex  = glUtils.getShader(state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.tex.fragment);
      vertexText   = glUtils.getShader(state.gl.VERTEX_SHADER, glUtils.SL.Shaders.text.vertex),
      fragmentText = glUtils.getShader(state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.text.fragment);
    state.programs = {
      read: glUtils.createProgram(vertexRead, fragmentRead),
      render: glUtils.createProgram(vertexRender, fragmentRender),
      texture: glUtils.createProgram(vertexTex, fragmentTex),
      text: glUtils.createProgram(vertexText, fragmentText),
    };
  }

  function initGL() {
    state.gl.clearColor(0,0,0,1);
    state.gl.enable(state.gl.POLYGON_OFFSET_FILL);
  }

  function initState() {
    state.vm = mat4.create();
    state.pm = mat4.create();
    state.mvp = mat4.create();
    state.app.objects = [
      // new Plane({
      //   gl: state.gl,
      //   programs: {
      //     render: state.programs.text,
      //     read: state.programs.text,
      //   },
      //   texture: 'atlas',
      // }),

      new Text({
        gl: state.gl,
        programs: {
          render: state.programs.text,
          read: state.programs.text,
        },
        scale: [0.5,0.5,0.5],
        text: 'hi friends',
        translate: [-3,0,0],
      }),
    ];
  }

  /*
  * State Management
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function updateOverlay() {
    if (state.app.overlay) {
      var msg = "Eye position: ("+state.app.eye.x.toFixed(2)+","+state.app.eye.y.toFixed(2)+","+state.app.eye.z.toFixed(2)+")";
      state.ctx.clearRect(0,0,state.ctx.canvas.width,state.ctx.canvas.height);
      state.ctx.save();
      state.ctx.font = "20px Helvetica";
      state.ctx.fillStyle = "white";
      state.ctx.fillText(msg, 10, 25);
      state.ctx.restore();
    }
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
      if (state.app.overlay) { updateOverlay(); }
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
