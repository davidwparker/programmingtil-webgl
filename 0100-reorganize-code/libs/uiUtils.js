(function(global){

  /*
  * uiUtils
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  var uiUtils = {
    VERSION : '0.0.2',
    inCanvas: function(event) {
      var x = event.clientX;
      var y = event.clientY;
      var rect = event.target.getBoundingClientRect();
      return (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom);
    },
    pickObject: function(pixels, objects, key) {
      pixels = pixels.map(function(n) { return n/255; });
      return objects.find(function(obj) {
        return pixels.length==obj[key].length &&
          pixels.every(function(v,i) { return v === obj[key][i]; });
      });
    },
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
