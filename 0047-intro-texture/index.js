(function(global) {

  /*
  * Constants and Main
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  var canvas,
    gl,
    program,
    texture,
    uSampler;

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);
    initShaders();
    initGL();
    var n = initVertexBuffers(gl);
    initTextures(draw, { n: n });
  }

  /*
  * Initialization
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function initShaders() {
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
      fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
  }

  function initGL() {
    gl.clearColor(0,0,0,1);
  }

  function initVertexBuffers() {
    var points = new Float32Array([
      // Vertex coordinates, texture coordinate
      -0.5,  0.5,   0.0, 1.0,
      -0.5, -0.5,   0.0, 0.0,
       0.5,  0.5,   1.0, 1.0,
       0.5, -0.5,   1.0, 0.0,
    ]);
    points.stride = 4;
    var arrays = [
      {name:'aPosition', size:2, offset:0},
      {name:'aTexCoord', size:2, offset:2},
    ];
    var n = points.length/points.stride;

    var pointsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
    points.FSIZE = points.BYTES_PER_ELEMENT;
    renderBuffers(arrays, points);
    return n;
  }

  function initTextures(callback, args) {
    texture = gl.createTexture();   // Create a texture object
    if (!texture) {
      console.log('Failed to create the texture object');
    }

    var image = new Image();  // Create the image object
    if (!image) {
      console.log('Failed to create the image object');
    }

    // Register the event handler to be called on loading an image
    image.onload = function(){ loadTexture(image, callback, args); };

    // Tell the browser to load an image
    image.src = "/images/txCrate.bmp";
  }

  function loadTexture(image, callback, args) {
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);

    if (callback) {
      callback(args);
    };
  }

  /*
  * Rendering / Drawing / Animation
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function draw(args) {
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture unit 0 to the sampler
    var uSampler = gl.getUniformLocation(program, 'uSampler');
    if (!uSampler) {
      console.log('Failed to get the storage location of uSampler');
      return false;
    }
    gl.uniform1i(uSampler, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, args.n);
  }

  function renderBuffers(arrays, points) {
    var attributes = program.vertexShader.attributes;
    for (var i=0; i<attributes.length; i++) {
      var name = attributes[i].name;
      for (var j=0; j<arrays.length; j++) {
        if (name == arrays[j].name) {
          var attr = gl.getAttribLocation(program, name);
          gl.enableVertexAttribArray(attr);
          gl.vertexAttribPointer(
            attr,
            arrays[j].size,
            gl.FLOAT,
            false,
            points.FSIZE*points.stride,
            points.FSIZE*arrays[j].offset
          );
        }
      }
    }
  }
})(window || this);
