(function(global){

  var uiUtils = {
    VERSION : '0.0.2',
    pixelInputToGLCoord: function(event, canvas) {
      var x = event.clientX,
        y = event.clientY,
        midX = canvas.width/2,
        midY = canvas.height/2,
        rect = event.target.getBoundingClientRect();
      x = ((x - rect.left) - midX) / midX;
      y = (midY - (y - rect.top)) / midY;
      return {x:x,y:y};
    },
    pixelInputToCanvasCoord: function(event, canvas) {
      var x = event.clientX,
        y = event.clientY,
        rect = event.target.getBoundingClientRect();
      x = x - rect.left;
      y = rect.bottom - y;
      return {x:x,y:y};
    },
    pixelsFromMouseClick: function(event, canvas, gl) {
      var point = uiUtils.pixelInputToCanvasCoord(event, canvas);
      var pixels = new Uint8Array(4);
      gl.readPixels(point.x, point.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      return pixels;
    }
  };
  global.uiUtils = uiUtils;

}(window || this));
