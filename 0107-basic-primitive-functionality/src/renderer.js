(function(global) {
  var KEYPRESS_SPEED = 0.2;

  /*
  * State Management
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function updateOverlay() {
    var msg =
      'Eye position: (' +
      state.app.eye.x.toFixed(2) +
      ',' +
      state.app.eye.y.toFixed(2) +
      ',' +
      state.app.eye.z.toFixed(2) +
      ')';
    state.ctx.clearRect(0, 0, state.ctx.canvas.width, state.ctx.canvas.height);
    state.ctx.save();
    state.ctx.font = '20px Helvetica';
    state.ctx.fillStyle = 'white';
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
  function render() {
    draw();
    if (state.app.animate) {
      animate();
    }
  }

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
    mat4.perspective(
      state.pm,
      20,
      state.canvas.width / state.canvas.height,
      1,
      100
    );
    mat4.lookAt(
      state.vm,
      vec3.fromValues(state.app.eye.x, state.app.eye.y, state.app.eye.z),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 1, 0)
    );

    drawObjects(state.app.objects);
  }

  function drawObjects(
    objects,
    params = {},
    blendFunc = drawBlended,
    opaqueFunc = drawOpaque
  ) {
    // Note: First you should sort (transparent) objects based on distance -> furthest away first
    // For our purposes, we'll loop through everything twice. Once to draw opaque objects
    // and another for transparent objects.
    state.gl.enable(state.gl.DEPTH_TEST);
    state.gl.disable(state.gl.BLEND);
    state.gl.depthMask(true);
    objects.forEach(opaqueFunc, params);
    // Leave on the depth test!
    state.gl.enable(state.gl.BLEND);
    state.gl.depthMask(false);
    objects.forEach(blendFunc, params);
    state.gl.depthMask(true);
  }

  function drawBlended(object) {
    if (object.state.hasBlend) {
      object.draw(this);
    }
  }

  function drawOpaque(object) {
    if (!object.state.hasBlend) {
      object.draw(this);
    }
  }

  var renderer = {
    draw: draw,
    drawObjects: drawObjects,
    render: render
  };

  window.renderer = renderer;
})(window || this);
