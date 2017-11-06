/*
* UI Mouse Events
* www.programmingtil.com
* www.codenameparkerllc.com
*/
function mousedown(event) {
  if (uiUtils.inCanvas(event)) {
    state.gl.disable(state.gl.BLEND);
    state.gl.enable(state.gl.DEPTH_TEST);
    state.gl.depthMask(true);
    state.app.objects.forEach(function(obj) {
      obj.readState();
    });
    renderer.draw();
    var pixels = Array.from(
      uiUtils.pixelsFromMouseClick(event, state.canvas, state.gl)
    );
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
    });
    renderer.draw();
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
    var factor = 10 / state.canvas.height;
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
