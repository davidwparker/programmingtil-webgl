(function(global) {

  /*
  * Constants and Main
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  // gl
  var gl, program;
  // ui
  var ui = {
    pressedKeys: {},
  };
  // animation
  var animation = {};
  // app state
  var state = {
    eye: {
      x:0.20,
      y:0.25,
      z:0.25,
    }
  };

  var defaultP = [
     0.0,  0.5, -0.4, 1, Math.random(),Math.random(),Math.random(),1,
    -0.5, -0.5, -0.4, 1, Math.random(),Math.random(),Math.random(),1,
     0.5, -0.5, -0.4, 1, Math.random(),Math.random(),Math.random(),1,

     // Red triangle
     0.5,  0.4, -0.2, 1, 1,0,0,1,
    -0.5,  0.4, -0.2, 1, 1,0,0,1,
     0.0, -0.6, -0.2, 1, 1,0,0,1,

     0.0,  0.5, 0., 1, 0,1,0,1,
    -0.5, -0.5, 0., 1, 0,1,0,1,
     0.5, -0.5, 0., 1, 0,1,0,1,
  ];

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    var canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);
    initCallbacks();
    initShaders();
    initGL();
    animate();
  }

  /*
  * Initialization
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function initCallbacks() {
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
  }

  function initShaders() {
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
      fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    program = glUtils.createProgram(gl, vertexShader, fragmentShader);
  }

  function initGL() {
    gl.clearColor(0,0,0,1);
  }

  /*
  * Rendering / Drawing / Animation
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function animate() {
    var p = defaultP;
    animation.tick = function() {
      updateState();
      draw({p:p});
      requestAnimationFrame(animation.tick);
    };
    animation.tick();
  }

  function updateState() {
    if (ui.pressedKeys[82] && ui.pressedKeys[16]) {
      // Shift+R
      state.eye.x += 0.01;
    } else if (ui.pressedKeys[82]) {
      // R
      state.eye.x -= 0.01;
    }
  }

  function draw(args) {
    var p = (args && args.p) ? args.p : defaultP;

    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var n = initVertexBuffers(p).n;
    var mm = mat4.create();

    // lookAt -
    // out, eye, center, up
    // out = output matrix
    // eye = position of the "camera", or eyes, while "looking at" the center
    // center = the focal point, where we're looking
    // up = the "vertical" up direction from the center
    // var ex=0.25,ey=0.25,ez=1;
    mm = mat4.lookAt(mm,
      vec3.fromValues(state.eye.x,state.eye.y,state.eye.z),
      vec3.fromValues(0,0,0),
      vec3.fromValues(0,1,0)
    );
    var uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
    gl.uniformMatrix4fv(uViewMatrix, false, mm);

    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  function initVertexBuffers(p) {
    var vertices = new Float32Array(p);
    vertices.stride = 8;
    vertices.attributes = [
      {name:'aPosition', size:3, offset:0},
      {name:'aColor',    size:3, offset:4},
    ];
    vertices.n = vertices.length/vertices.stride;
    program.renderBuffers(vertices);
    return vertices;
  }

  /*
  * UI Events
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function keyDown(event) {
    ui.pressedKeys[event.keyCode] = true;
  }

  function keyUp(event) {
    ui.pressedKeys[event.keyCode] = false;
  }
})(window || this);
