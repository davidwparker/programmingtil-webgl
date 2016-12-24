(function(global){

  var uiUtils = {
    VERSION : '0.0.1',
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
  };

  // Expose uiUtils globally
  global.uiUtils = uiUtils;

}(window || this));
