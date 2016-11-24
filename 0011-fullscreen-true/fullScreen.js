(function(global) {

  // Get canvas element and check if WebGL enabled
  var canvas = document.getElementById("glcanvas"),
      gl = glUtils.checkWebGL(canvas);

  /*
   * All sizing functions
   */
  function resizer() {
    /**
     * Callback for when the screen is resized
     **/
     console.log('resizer-ing');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }

  function onFullscreenChange() {
    console.log('onFullscreenChange');
    /**
     * Callback for when the screen is resized
     * This starts by looking at the value of the fullscreenElement attribute on the document
     * (checking it prefixed with both moz, ms, and webkit).
     * If it's null, the document is currently in windowed mode, so we need to switch to fullscreen mode.
     * Switching to fullscreen mode is done by calling either element.mozRequestFullScreen() msRequestFullscreen()
     * or webkitRequestFullscreen(), depending on which is available.
     * via: https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
     **/
    if(!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
        console.log('do resizer');
      resizer();
    }
  }

  // Due to security policy, must be initiated by user
  // Note the spelling differences: https://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html#dom-element-requestfullscreen
  global.fullscreen = function() {
    console.log('fullscreen');
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
    else if(canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen();
    }
    else if(canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
    else if (canvas.mozRequestFullScreen){
      canvas.mozRequestFullScreen();
    }
  }

  // Register window and document callbacks
  window.addEventListener('resize',resizer);
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('mozfullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);

  resizer();

  // Clear to black
  gl.clearColor(1.0, 1.0, 0.0, 1.0);

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

})(window || this);
