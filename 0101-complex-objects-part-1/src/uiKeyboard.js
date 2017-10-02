/*
* UI Keyboard Events
* www.programmingtil.com
* www.codenameparkerllc.com
*/
function keydown(event) {
  state.ui.pressedKeys[event.keyCode] = true;
}

function keyup(event) {
  state.ui.pressedKeys[event.keyCode] = false;
}
