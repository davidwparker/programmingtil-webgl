(function(global){

  var glUtils = {
    VERSION : '0.0.2',
    checkWebGL: function(canvas) {
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
    },

    createProgram: function(gl, vertexShader, fragmentShader) {
      /**
       * Create and return a shader program
       **/
      var program = gl.createProgram();
      gl.attachShader(program, vertexShader);

      // API:
      // gl.detachShader(program, shader);
      //  must be used before linking program
      //gl.detachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      // Check that shader program was able to link to WebGL
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
      }
      //gl.useProgram(program);

      // API:
      // gl.isProgram(program)
      // gl.isShader(shader)
      console.log(gl.isShader(vertexShader));
      // console.log(gl.isShader(program));
      console.log(gl.isProgram(program));

      // API:
      // gl.getAttachedShaders(program);
      // gl.getShaderSource
      console.log(gl.getAttachedShaders(program));
      var shaders = gl.getAttachedShaders(program);
      for (var i=0; i<shaders.length; i++) {
        console.log(gl.getShaderSource(shaders[i]));
      }

      // Validate and use it!
      gl.validateProgram(program)
      if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        var error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
      }

      return program;
    },

    getShader: function(gl,type,source) {
      /**
       * Get, compile, and return an embedded shader object
       **/
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      // Check if compiled successfully
      // console.log(gl.getShaderParameter(shader, gl.COMPILE_STATUS));
      // API:
      // gl.SHADER_TYPE, gl.DELETE_STATUS, gl.COMPILE_STATUS
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("An error occurred compiling the shaders:" + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }
  };

  // Expose glUtils globally
  global.glUtils = glUtils;

}(window || this));
