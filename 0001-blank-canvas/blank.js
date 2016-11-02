function checkWebGL(canvas) {
  /**
   * Check if WebGL is available.
   **/
  var contexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"], gl;
  for (var i=0; i < contexts.length; i++) {
    try {
      gl = canvas.getContext(contexts[i]);
    } catch(e) {}
    if (gl) {
      break;
    }
  }
  if (!gl) {
    alert("WebGL not available, sorry! Please use a new version of Chrome or Firefox.");
  }
  return gl;
}

function main() {
  var canvas = document.getElementById("glcanvas"),
      gl = checkWebGL(canvas);

  // Clear to black
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
}
