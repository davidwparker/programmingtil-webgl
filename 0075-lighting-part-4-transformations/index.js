(function(global) {

  /*
  * Constants and Main
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  var state = {
    gl: null,
    program: 'render',
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
      angle: {
        x: 0,
        y: 0,
      },
      doAnimate: true,
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
     // v0-v1-v2-v3 front
     // v0-v3-v4-v5 right
     // v0-v5-v6-v1 up
     // v1-v6-v7-v2 left
     // v7-v4-v3-v2 down
     // v4-v7-v6-v5 back
    this.attributes = {
      aColor: {
        size:3,
        offset:0,
        bufferData: new Float32Array([
          0, 0, 1,   1, 0, 0,   1, 0, 0,  1, 0, 0,
          0, 0, 1,   1, 0, 0,   1, 0, 0,  1, 0, 0,
          0, 0, 1,   1, 0, 0,   1, 0, 0,  1, 0, 0,
          0, 0, 1,   1, 0, 0,   1, 0, 0,  1, 0, 0,
          0, 0, 1,   1, 0, 0,   1, 0, 0,  1, 0, 0,
          0, 0, 1,   1, 0, 0,   1, 0, 0,  1, 0, 0　
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
      mm: null,
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
    state.gl = glUtils.checkWebGL(state.canvas, { preserveDrawingBuffer: true });
    initCallbacks();
    initShaders();
    initGL();
    initState();
    draw();
    if (state.app.doAnimate) {
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
      fragmentShader = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    state.programs = {
      render: glUtils.createProgram(state.gl, vertexShader, fragmentShader),
      read: glUtils.createProgram(state.gl, vertexShader2, fragmentShader),
    };
  }

  function initGL() {
    state.gl.clearColor(0,0,0,1);
    state.gl.enable(state.gl.DEPTH_TEST);
    state.gl.useProgram(state.programs[state.program]);
  }

  function initState() {
    state.uAmbientLight = state.gl.getUniformLocation(state.programs[state.program], 'uAmbientLight');
    state.uDiffuseLight = state.gl.getUniformLocation(state.programs[state.program], 'uDiffuseLight');
    state.uLightDirection = state.gl.getUniformLocation(state.programs[state.program], 'uLightDirection');
    state.vm = mat4.create();
    state.pm = mat4.create();
    state.mvp = mat4.create();
    state.app.objects = [
      new Cube({selColor:[255,255,0,0]}),
      // new Cube({selColor:[254,0,0,0]}),
    ];
    // mat4.translate(state.app.objects[1].state.mm, state.app.objects[1].state.mm, vec3.fromValues(3,0,0));
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
    var uMVPMatrix = state.gl.getUniformLocation(state.programs[state.program], 'uMVPMatrix');
    var uNormalMatrix = state.gl.getUniformLocation(state.programs[state.program], 'uNormalMatrix');
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
    state.app.objects.forEach(function(obj) {
      state.programs[state.program].renderBuffers(obj);
      var n = obj.indices.length;
      mat4.copy(mvp, pm);
      mat4.multiply(mvp, mvp, vm);
      var newMM = mat4.create();
      mat4.rotateX(newMM, newMM, state.app.angle.x);
      mat4.rotateY(newMM, newMM, state.app.angle.y);
      obj.state.mm = newMM;
      mat4.multiply(mvp, mvp, obj.state.mm);
      state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);

      // Light color (white)
      if (state.program === 'render') {
        state.gl.uniform3f(state.uDiffuseLight, 1.0, 1.0, 1.0);
        state.gl.uniform3f(state.uAmbientLight, 0.2, 0.2, 0.2);

        // Set the light direction (in the world coordinate)
        var lightDirection = vec3.fromValues(0.5,3.0,4.0)

        // Normalize here because we don't need to normalize it every time in vertex shader
        var lightDirectionNormal = vec3.normalize(vec3.create(), lightDirection);
        state.gl.uniform3fv(state.uLightDirection, lightDirectionNormal);

        // Shortcut method
        var nm = mat3.normalFromMat4(mat3.create(), obj.state.mm);
        state.gl.uniformMatrix3fv(uNormalMatrix, false, nm);

        // Longer method
        // var nm = mat4.invert(mat4.create(), obj.state.mm);
        // mat4.transpose(nm, nm);
        // state.gl.uniformMatrix4fv(uNormalMatrix, false, nm);
      }
      state.gl.drawElements(state.gl.TRIANGLES, n, state.gl.UNSIGNED_BYTE, 0);
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
    // Reading
    state.program = 'read';
    state.gl.useProgram(state.programs[state.program]);
    state.app.objects.forEach(function(obj) { obj.readState(); });
    draw();
    var pixels = Array.from(uiUtils.pixelsFromMouseClick(event, state.canvas, state.gl));
    var obj = pickObject(pixels);
    if (obj) {
      var x = event.clientX;
      var y = event.clientY;
      if (uiUtils.inCanvas(event)) {
        state.ui.mouse.lastX = x;
        state.ui.mouse.lastY = y;
        state.ui.dragging = true;
      }
    }
    state.program = 'render';
    state.gl.useProgram(state.programs[state.program]);
    state.app.objects.forEach(function(obj) { obj.drawState(); });
    draw();
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
      state.app.angle.x = state.app.angle.x + dy;
      state.app.angle.y = state.app.angle.y + dx;
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
