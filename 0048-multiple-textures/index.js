(function(global) {

  /*
  * Constants and Main
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  var canvas,
    gl,
    program,
    n,
    textures = {},
    activeTexture = "/images/txCrate.bmp";

  var IMAGES = [
    "/images/txCrate.bmp",
    "/images/txWood.bmp",
  ];

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);
    initShaders();
    initGL();
    initCallbacks();
    n = initVertexBuffers(gl);
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

  function initCallbacks() {
    document.onkeydown = keyDown;
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
          textures[texture.src] = texture;
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
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  }

  /*
  * Rendering / Drawing / Animation
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function draw(args) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[activeTexture]);
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

  /*
  * UI Events
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function keyDown(event) {
    if (String.fromCharCode(event.keyCode) == "T") {
      activeTexture = (activeTexture === "/images/txCrate.bmp" ? "/images/txWood.bmp" : "/images/txCrate.bmp")
    }
    draw({n:n});
  }
})(window || this);
