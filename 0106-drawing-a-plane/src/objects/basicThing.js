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
  this.components = [
    new Cube({
      blend: false,
      gl: state.gl,
      programs: {
        render: state.programs.texture,
        read: state.programs.read
      },
      selColor: opts.selColor,
      angle: [0, 45, 0],
      texture: 'crate'
    }),
    new Cube({
      blend: false,
      gl: state.gl,
      programs: {
        render: state.programs.render,
        read: state.programs.read
      },
      selColor: opts.selColor,
      translate: [0, -2.5, 0]
    }),
    new Cube({
      blend: true,
      blendDst: state.gl.ONE,
      gl: state.gl,
      programs: {
        render: state.programs.texture,
        read: state.programs.read
      },
      selColor: opts.selColor,
      translate: [-2.5, 0, 0],
      texture: 'stainglass'
    }),
    new Cube({
      blend: true,
      blendDst: state.gl.ONE,
      gl: state.gl,
      programs: {
        render: state.programs.texture,
        read: state.programs.read
      },
      selColor: opts.selColor,
      translate: [+2.5, 0, 0],
      texture: 'stainglass'
    })
  ];

  // Functionality
  this.readState = function() {
    this.components.forEach(function(comp) {
      comp.readState();
    });
  };
  this.drawState = function() {
    this.components.forEach(function(comp) {
      comp.drawState();
    });
  };

  this.draw = function() {
    renderer.drawObjects(
      this.components,
      this,
      this.drawBlended,
      this.drawOpaque
    );
  };

  this.drawBlended = function(component) {
    if (component.state.hasBlend) {
      component.draw({ mm: this.computeMM() });
    }
  };

  this.drawOpaque = function(component) {
    if (!component.state.hasBlend) {
      component.draw({ mm: this.computeMM() });
    }
  };

  this.computeMM = function() {
    var mm = mat4.create();
    if (this.opts.translate) {
      mat4.translate(mm, mm, this.opts.translate);
    }
    if (this.opts.scale) {
      mat4.scale(mm, mm, this.opts.scale);
    }
    if (this.state.angle[0] || this.state.angle[1] || this.state.angle[2]) {
      mat4.rotateX(mm, mm, this.state.angle[0]);
      mat4.rotateY(mm, mm, this.state.angle[1]);
      mat4.rotateZ(mm, mm, this.state.angle[2]);
    }
    return mm;
  };

  // Initialization
  this.init = (function(_this) {
    var selColor = opts.selColor ? opts.selColor : [0, 0, 0, 0];
    _this.selColor = selColor.map(function(n) {
      return n / 255;
    });

    _this.state = {
      angle: opts.angle ? opts.angle : [0, 0, 0],
      mm: mat4.create()
    };
  })(this);
}
