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
    "/images/ps.png",
    "/images/pb.png",
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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /*
  * Rendering / Drawing / Animation
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function draw(args) {
    // Left texture
    var array0 = [
      -1.0,  0.5,   0.0, 1.0,
      -1.0, -0.5,   0.0, 0.0,
       0.0,  0.5,   1.0, 1.0,
       0.0, -0.5,   1.0, 0.0,
    ];
    // Right texture
    var array1 = [
      0.0,  0.5,   0.0, 1.0,
      0.0, -0.5,   0.0, 0.0,
      1.0,  0.5,   1.0, 1.0,
      1.0, -0.5,   1.0, 0.0,
    ];
    var uSampler0 = gl.getUniformLocation(program, 'uSampler0');
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Left texture
    // var n0 = initVertexBuffers(array0).n;
    // gl.activeTexture(gl.TEXTURE0);
    // gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    // gl.uniform1i(uSampler0, 0);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n0);
    //
    // // Right texture
    // var n1 = initVertexBuffers(array1).n;
    // gl.activeTexture(gl.TEXTURE0);
    // gl.bindTexture(gl.TEXTURE_2D, textures[1]);
    // gl.uniform1i(uSampler0, 0);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n1);

    // Or via a loop!
    var points = [array0,array1];
    for (var i=0;i<IMAGES.length;i++) {
      var n = initVertexBuffers(points[i]).n;
      gl.activeTexture(gl.TEXTURE0+i);
      gl.bindTexture(gl.TEXTURE_2D, textures[i]);
      gl.uniform1i(uSampler0, i);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
  }

  function initVertexBuffers(arr) {
    var vertices = new Float32Array(arr);
    vertices.stride = 4;
    vertices.attributes = [
      {name:'aPosition', size:2, offset:0},
      {name:'aTexCoord', size:2, offset:2},
    ];
    vertices.n = vertices.length/vertices.stride;
    program.renderBuffers(vertices);
    return vertices;
  }
})(window || this);
