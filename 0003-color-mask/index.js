(function() {

  var canvas = document.getElementById("glcanvas"),
      gl = glUtils.checkWebGL(canvas);

  // Clear to red
  gl.clearColor(1.0, 0.0, 0.0, 1.0);

  // turn off the red channel! -> black
  gl.colorMask(false,false,false,true);

  // turn off the alpha channel! -> blank!
  // gl.colorMask(true,true,true,false);

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);


})();
