(function(global) {

  /*
  * Constants and Main
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  var canvas,
    gl,
    program,
    textures = [];

  var IMAGES = [
    "/images/txCrate.bmp",
  ];

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);
    initShaders();
    initGL();
    initTextures(draw);
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
  }

  function initGL() {
    gl.clearColor(0,0,0,1);
  }

  function initVertexBuffers(points) {
    var vertices = new Float32Array(points);
    vertices.stride = 4;
    vertices.attributes = [
      {name:'aPosition', size:2, offset:0},
      {name:'aTexCoord', size:2, offset:2},
    ];
    vertices.n = vertices.length/vertices.stride;
    program.renderBuffers(vertices);
    return vertices;
  }

  function initTextures(callback, args) {
    var promises = [];
    for (var i=0; i<IMAGES.length; i++) {
      var image_src = IMAGES[i];
      var prom = new Promise(function(resolve, reject) {
        var texture = gl.createTexture();
        if (!texture) {
          reject(new Error('Failed to create the texture object'));
        }
        texture.src = image_src;
        var image = new Image();
        if (!image) {
          reject(new Error('Failed to create the image object'));
        }
        image.onload = function(){
          textures.push(texture);
          loadTexture(image, texture);
          resolve("success");
        };
        image.src = image_src;
      });
      promises.push(prom);
    }

    Promise.all(promises).then(function() {
      if (callback) {
        callback(args);
      }
    }, function(error) {
      console.log('Error loading images', error);
    })
  }

  function loadTexture(image, texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // TEXTURE_MAG_FILTER
    // Texture magnification filter
    // gl.LINEAR (default), gl.NEAREST.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //default
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // console.log(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER));

    // TEXTURE_MIN_FILTER
    // Texture minification filter
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    // * choose the best mip, then pick one pixel from that mip
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    // * choose the best mip, then blend 4 pixels from that mip
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR); //default
    // * choose the best 2 mips, choose 1 pixel from each, blend them
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    // * choose the best 2 mips. choose 4 pixels from each, blend them
    // console.log(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER));
    // NOTE: We'll get into details about the importance of these algorithms in a later episode.

    // TEXTURE_WRAP_S
    // Wrapping function for texture coordinate s
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); //default
    // console.log(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S));

    // TEXTURE_WRAP_T
    // Wrapping function for texture coordinate t
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT); //default
    // console.log(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T));

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /*
  * Rendering / Drawing / Animation
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function draw(args) {
    var points0 = [
      -0.5, -0.5,   -2, -2,
      -0.5,  0.5,   -2,  2,
       0.5, -0.5,    2, -2,
      -0.5,  0.5,   -2,  2,
       0.5,  0.5,    2,  2,
       0.5, -0.5,    2, -2,
    ];

    var uSampler0 = gl.getUniformLocation(program, 'uSampler0');
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var points = [points0];
    for (var i=0;i<IMAGES.length;i++) {
      var n = initVertexBuffers(points[i]).n;
      gl.activeTexture(gl.TEXTURE0+i);
      gl.bindTexture(gl.TEXTURE_2D, textures[i]);
      gl.uniform1i(uSampler0, i);
      gl.drawArrays(gl.TRIANGLES, 0, n);
    }
  }
})(window || this);
