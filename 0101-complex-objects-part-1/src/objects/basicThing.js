/*
* Primitives and Objects
* www.programmingtil.com
* www.codenameparkerllc.com
*/
// Create a BasicThing
function BasicThing(opts) {
  var opts = opts || {};
  this.id = saKnife.uuid();
  this.opts = opts;
  this.gl = opts.gl;
  this.programs = opts.programs;

  // Vextex positions
  // v0-v1-v2-v3 front
  // v0-v3-v4-v5 right
  // v0-v5-v6-v1 up
  // v1-v6-v7-v2 left
  // v7-v4-v3-v2 down
  // v4-v7-v6-v5 back
  this.attributes = {
    //   aColor: {
    //     size:4,
    //     offset:0,
    //     bufferData: new Float32Array([
    //       1, 0, 1, 1,   1, 0, 1, 1,   1, 0, 1, 1,  1, 0, 1, 1,
    //       1, 1, 0, 1,   1, 1, 0, 1,   1, 1, 0, 1,  1, 1, 0, 1,
    //       1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,  1, 0, 0, 1,
    //       0, 1, 0, 1,   0, 1, 0, 1,   0, 1, 0, 1,  0, 1, 0, 1,
    //       0, 1, 1, 1,   0, 1, 1, 1,   0, 1, 1, 1,  0, 1, 1, 1,
    //       0, 0, 1, 1,   0, 0, 1, 1,   0, 0, 1, 1,  0, 0, 1, 1
    //     ]),
    //   },
    //   aNormal: {
    //     size:3,
    //     offset:0,
    //     bufferData: new Float32Array([
    //       0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,
    //       1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,
    //       0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,
    //      -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,
    //       0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,
    //       0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0
    //     ]),
    //   },
    //   aPosition: {
    //     size:3,
    //     offset:0,
    //     bufferData: new Float32Array([
    //       1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,
    //       1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,
    //       1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,
    //      -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,
    //      -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,
    //       1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0
    //    ]),
    //  },
    aSelColor: {
      size: 4,
      offset: 0,
      bufferData: undefined
    }
    //  aTexCoord: {
    //    size:2,
    //    offset:0,
    //    bufferData: new Float32Array([
    //      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,
    //      0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,
    //      1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,
    //      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,
    //      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,
    //      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0
    //    ]),
    //  },
  };
  this.indices = new Uint8Array([
    0,
    1,
    2,
    0,
    2,
    3, // f
    4,
    5,
    6,
    4,
    6,
    7, // r
    8,
    9,
    10,
    8,
    10,
    11, // u
    12,
    13,
    14,
    12,
    14,
    15, // l
    16,
    17,
    18,
    16,
    18,
    19, // d
    20,
    21,
    22,
    20,
    22,
    23 // b
  ]);
  this.components = [
    new Cube({
      blend: false,
      gl: state.gl,
      programs: {
        render: state.programs.render,
        read: state.programs.read
      },
      selColor: [255, 254, 0, 0]
    }),
    new Cube({
      blend: false,
      gl: state.gl,
      programs: {
        render: state.programs.render,
        read: state.programs.read
      },
      selColor: [255, 254, 0, 0],
      // translate: [0, 2.0, 0],
      // angle: [0, 45, 0],
      translate: [0, 2.5, 0]
    })
  ];

  // Functionality
  this.readState = function() {
    // this.attributes.aColorBackup = this.attributes.aColor;
    // this.attributes.aColor = this.attributes.aSelColor;
    this.state.renderMode = 'read';
  };
  this.drawState = function() {
    // this.attributes.aColor = this.attributes.aColorBackup;
    this.state.renderMode = 'render';
  };

  this.draw = function() {
    this.gl.useProgram(this.programs[this.state.renderMode]);
    for (var i = 0; i < this.components.length; i++) {
      var uMVPMatrix = this.gl.getUniformLocation(
        this.programs[this.state.renderMode],
        'uMVPMatrix'
      );
      var uModelMatrix = this.gl.getUniformLocation(
        this.programs[this.state.renderMode],
        'uModelMatrix'
      );
      var uNormalMatrix = this.gl.getUniformLocation(
        this.programs[this.state.renderMode],
        'uNormalMatrix'
      );
      var uAmbientLight = this.gl.getUniformLocation(
        this.programs[this.state.renderMode],
        'uAmbientLight'
      );
      var uDiffuseLight = this.gl.getUniformLocation(
        this.programs[this.state.renderMode],
        'uDiffuseLight'
      );
      var uLightPosition = this.gl.getUniformLocation(
        this.programs[this.state.renderMode],
        'uLightPosition'
      );
      var uFogColor = this.gl.getUniformLocation(
        this.programs[this.state.renderMode],
        'uFogColor'
      );
      var uFogDist = this.gl.getUniformLocation(
        this.programs[this.state.renderMode],
        'uFogDist'
      );
      var uSampler0 = this.gl.getUniformLocation(
        this.programs[this.state.renderMode],
        'uSampler0'
      );
      var mvp = state.mvp;

      // this.programs[this.state.renderMode].renderBuffers(this);
      this.programs[this.state.renderMode].renderBuffers(this.components[i]);
      var n = this.components[i].indices.length;

      // Model matrix
      var mm = mat4.create();
      if (this.components[i].opts.translate) {
        mat4.translate(mm, mm, this.components[i].opts.translate);
      }
      if (this.components[i].opts.scale) {
        mat4.scale(mm, mm, this.components[i].opts.scale);
      }
      if (
        this.components[i].state.angle[0] ||
        this.components[i].state.angle[1] ||
        this.components[i].state.angle[2]
      ) {
        mat4.rotateX(mm, mm, this.components[i].state.angle[0]);
        mat4.rotateY(mm, mm, this.components[i].state.angle[1]);
        mat4.rotateZ(mm, mm, this.components[i].state.angle[2]);
      }
      this.gl.uniformMatrix4fv(uModelMatrix, false, mm);

      // MVP matrix
      mat4.copy(mvp, state.pm);
      mat4.multiply(mvp, mvp, state.vm);
      mat4.multiply(mvp, mvp, mm);
      this.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);

      // Fog
      if (state.app.fog.on) {
        this.gl.uniform3fv(uFogColor, state.app.fog.color);
        this.gl.uniform2fv(uFogDist, state.app.fog.dist);
      }

      // Lighting
      if (this.state.renderMode === 'render') {
        this.gl.uniform3f(
          uDiffuseLight,
          state.app.light.diffuse[0],
          state.app.light.diffuse[1],
          state.app.light.diffuse[2]
        );
        this.gl.uniform3f(
          uAmbientLight,
          state.app.light.ambient[0],
          state.app.light.ambient[1],
          state.app.light.ambient[2]
        );
        this.gl.uniform3f(
          uLightPosition,
          state.app.light.position[0],
          state.app.light.position[1],
          state.app.light.position[2]
        );
        var nm = mat3.normalFromMat4(mat3.create(), mm);
        this.gl.uniformMatrix3fv(uNormalMatrix, false, nm);
      }

      // Textures
      if (this.state.hasTexture) {
        this.gl.activeTexture(this.components[i].gl.TEXTURE0);
        this.gl.bindTexture(
          this.components[i].gl.TEXTURE_2D,
          state.app.textures[this.components[i].opts.texture]
        );
        this.gl.uniform1i(uSampler0, 0);
      }

      // Blending
      if (
        this.components[i].state.hasBlend &&
        this.components[i].state.renderMode === 'render'
      ) {
        this.gl.blendFunc(
          this.components[i].state.blendSrc,
          this.components[i].state.blendDst
        );
        this.gl.blendEquation(this.components[i].state.blendEquation);
        this.gl.disable(this.components[i].gl.CULL_FACE);
      } else {
        this.gl.enable(this.components[i].gl.DEPTH_TEST);
        this.gl.disable(this.components[i].gl.BLEND);
        this.gl.depthMask(true);

        // Culling
        this.gl.enable(this.components[i].gl.CULL_FACE);
        this.gl.cullFace(this.components[i].gl.BACK);
      }
      // Draw!
      this.gl.drawElements(
        this.components[i].gl.TRIANGLES,
        n,
        this.components[i].gl.UNSIGNED_BYTE,
        0
      );
    }
  };

  // Cube Initialization
  this.init = (function(_this) {
    // var selColor = opts.selColor ? opts.selColor : [0,0,0,0];
    // _this.selColor = selColor.map(function(n) { return n/255; });
    // var arrays = [
    //   _this.selColor, _this.selColor, _this.selColor, _this.selColor,
    //   _this.selColor, _this.selColor, _this.selColor, _this.selColor,
    //   _this.selColor, _this.selColor, _this.selColor, _this.selColor,
    //   _this.selColor, _this.selColor, _this.selColor, _this.selColor,
    //   _this.selColor, _this.selColor, _this.selColor, _this.selColor,
    //   _this.selColor, _this.selColor, _this.selColor, _this.selColor,
    // ];
    // _this.attributes.aSelColor.bufferData = new Float32Array([].concat.apply([], arrays));

    _this.state = {
      angle: opts.angle ? opts.angle : [0, 0, 0],
      blendEquation: opts.blendEquation
        ? opts.blendEquation
        : _this.gl.FUNC_ADD,
      blendSrc: opts.blendSrc ? opts.blendSrc : _this.gl.SRC_ALPHA,
      blendDst: opts.blendDst ? opts.blendDst : _this.gl.ONE_MINUS_SRC_ALPHA,
      hasBlend: opts.blend ? true : false,
      hasTexture: opts.texture ? true : false,
      mm: mat4.create(),
      nm: null,
      renderMode: 'render'
    };
  })(this);
}
