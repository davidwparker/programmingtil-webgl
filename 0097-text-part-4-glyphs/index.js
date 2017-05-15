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
  var LETTER_WIDTH = 25;
  var LETTER_HEIGHT = 30;
  var LETTERS = [
    "a", // 0
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k", // 10
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u", // 20
    "v",
    "w",
    "x",
    "y",
    "z", // 25
    " ",
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
        x:0.,
        y:0.,
        z:7.,
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
      textTextures: {},
    },
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
    initLetterTextures();
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
        size:4,
        offset:0,
        bufferData: new Float32Array([
          0.0, 1.0, 0, 1,
          0.0, 0.0, 0, 1,
          1.0, 1.0, 0, 1,
          1.0, 0.0, 0, 1,
       ]),
     },
     aTexCoord: {
       size:2,
       offset:0,
       bufferData: new Float32Array([
         0.0, 1.0,
         0.0, 0.0,
         1.0, 1.0,
         1.0, 0.0,
       ]),
     },
    };
    this.indices = new Uint8Array([
      0,1,2,  2,3,1
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
      var uSampler0 = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uSampler0');
      var uColor = this.gl.getUniformLocation(this.programs[this.state.renderMode], 'uColor');

      // Loop to draw each letter.
      for (var i=0; i < this.state.text.length; i++) {
        var letter = this.state.text[i];
        var mvp = state.mvp;
        this.programs[this.state.renderMode].renderBuffers(this);
        var n = this.indices.length;

        // Model matrix
        var mm = mat4.create();
        if (this.opts.translate) {
          mat4.translate(mm, mm, this.opts.translate);
        }
        var scale = this.opts.scale ? this.opts.scale[0] : 1;
        var translation = i * LETTER_WIDTH/50 * scale;
        mat4.translate(mm, mm, [translation,0,0]);
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
        this.gl.bindTexture(this.gl.TEXTURE_2D, state.app.textTextures[letter]);
        this.gl.uniform1i(uSampler0, 0);
        this.gl.uniform4fv(uColor, this.opts.color);

        // Draw!
        this.gl.polygonOffset(1.0*i, 1.0*i);
        this.gl.drawElements(this.gl.TRIANGLES, n, this.gl.UNSIGNED_BYTE, 0);
      }
    };

    // Cube Initialization
    this.init = function(_this) {
      _this.state = {
        angle: opts.angle ? opts.angle : [0,0,0],
        mm: mat4.create(),
        nm: null,
        renderMode: 'render',
        text: opts.text ? opts.text : '',
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
      vertexText    = glUtils.getShader(state.gl.VERTEX_SHADER, glUtils.SL.Shaders.text.vertex),
      fragmentText  = glUtils.getShader(state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.text.fragment);
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
      new Text({
        color: [1,0,1,1],
        gl: state.gl,
        programs: {
          render: state.programs.text,
          read: state.programs.text,
        },
        scale:[0.5,0.5,0.5],
        text: 'hello',
        translate: [-2,-2,0],
      }),
      new Text({
        color: [0,0,1,1],
        gl: state.gl,
        programs: {
          render: state.programs.text,
          read: state.programs.text,
        },
        text: 'fun times',
        translate: [-3,2,0],
      }),
      new Text({
        color: [0,1,1,1],
        gl: state.gl,
        programs: {
          render: state.programs.text,
          read: state.programs.text,
        },
        scale:[0.6,0.6,0.6],
        text: 'go code',
        translate: [0.3,0,0],
      }),
    ];
  }

  function initLetterTextures() {
    var ctx = document.createElement('canvas').getContext('2d');
    var height = LETTER_HEIGHT;
    var width = LETTER_WIDTH;

    LETTERS.map(function(letter) {
      var texture = state.gl.createTexture();
      var canvas = generateCanvasText(ctx, letter, width, height);
      state.gl.pixelStorei(state.gl.UNPACK_FLIP_Y_WEBGL, 1);
      state.gl.bindTexture(state.gl.TEXTURE_2D, texture);
      state.gl.texImage2D(state.gl.TEXTURE_2D, 0, state.gl.RGBA, state.gl.RGBA, state.gl.UNSIGNED_BYTE, canvas);
      state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_MAG_FILTER, state.gl.LINEAR);
      state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_MIN_FILTER, state.gl.LINEAR);
      state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_WRAP_S, state.gl.CLAMP_TO_EDGE);
      state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_WRAP_T, state.gl.CLAMP_TO_EDGE);
      state.app.textTextures[letter] = texture;
    });
  }

  function generateCanvasText(ctx, text, width, height) {
    ctx.canvas.height = height;
    ctx.canvas.width = width;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    ctx.font = '20px monospace';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width/2, height/2);
    return ctx.canvas;
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
      20, state.canvas.width/state.canvas.height, 5, 100
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
