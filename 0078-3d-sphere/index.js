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
        x:3.0,
        y:3.0,
        z:4.0,
      },
      objects: [],
    },
  };

  // Create a sphere
  function Sphere(opts) {
    var opts = opts || {};
    this.id = uuid();
    this.opts = opts;
    this.attributes = {
      aColor: {
        size:3,
        offset:0,
        bufferData: null,
      },
      aPosition: {
        size:3,
        offset:0,
        bufferData: null,
      }
    };
    this.indices = null;
    this.state = {
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

    // Initialization
    this.init = function(_this) {
      var SPHERE_DIV = 12;
      var i, ai, si, ci;
      var j, aj, sj, cj;
      var p1, p2;

      // Vertices
      var vertices = [], indices = [];
      for (j = 0; j <= SPHERE_DIV; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
          ai = i * 2 * Math.PI / SPHERE_DIV;
          si = Math.sin(ai);
          ci = Math.cos(ai);

          vertices.push(si * sj);  // X
          vertices.push(cj);       // Y
          vertices.push(ci * sj);  // Z
        }
      }
      _this.attributes.aPosition.bufferData = new Float32Array(vertices);
      _this.attributes.aColor.bufferData = new Float32Array(vertices);

      // Indices
      for (j = 0; j < SPHERE_DIV; j++) {
        for (i = 0; i < SPHERE_DIV; i++) {
          p1 = j * (SPHERE_DIV+1) + i;
          p2 = p1 + (SPHERE_DIV+1);

          indices.push(p1);
          indices.push(p2);
          indices.push(p1 + 1);

          indices.push(p1 + 1);
          indices.push(p2);
          indices.push(p2 + 1);
        }
      }
      _this.indices = new Uint8Array(indices);

      // Selection color
      var selColor = [];
      _this.selColor = _this.selColor.map(function(n) { return n/255; });
      for (j = 0; j <= SPHERE_DIV; j++) {
        for (i = 0; i <= SPHERE_DIV; i++) {
          selColor.push(_this.selColor[0]);
          selColor.push(_this.selColor[1]);
          selColor.push(_this.selColor[2]);
          selColor.push(_this.selColor[3]);
        }
      }
      _this.attributes.aSelColor = {
        size:4,
        offset:0,
        bufferData: new Float32Array(selColor),
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
      fragmentShader = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    state.programs = {
      render: glUtils.createProgram(state.gl, vertexShader, fragmentShader),
      read: glUtils.createProgram(state.gl, vertexShader, fragmentShader),
    };
  }

  function initGL() {
    state.gl.clearColor(0,0,0,1);
    state.gl.enable(state.gl.DEPTH_TEST);
    state.gl.useProgram(state.programs[state.program]);
  }

  function initState() {
    state.vm = mat4.create();
    state.pm = mat4.create();
    state.mvp = mat4.create();
    state.app.objects = [
      new Sphere(),
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
    var uMVPMatrix = state.gl.getUniformLocation(state.programs[state.program], 'uMVPMatrix');
    var vm = state.vm;
    var pm = state.pm;
    var mvp = state.mvp;
    mat4.perspective(pm,
      20, state.canvas.width/state.canvas.height, 1, 100
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
      mat4.multiply(mvp, mvp, obj.state.mm);
      mat4.rotateX(mvp, mvp, state.app.angle.x);
      mat4.rotateY(mvp, mvp, state.app.angle.y);
      state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
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
