/*
* Primitives and Objects
* www.programmingtil.com
* www.codenameparkerllc.com
*/
function BasicComplex(opts) {
  var opts = opts || {};
  this.id = saKnife.uuid();
  this.opts = opts;
  this.objects = opts.objects;

  this.readState = function() {
    this.objects.forEach(function(comp) {
      comp.readState();
    });
  };
  this.drawState = function() {
    this.objects.forEach(function(comp) {
      comp.drawState();
    });
  };

  this.draw = function() {
    renderer.drawObjects(this.objects, this, this.drawBlended, this.drawOpaque);
  };

  this.drawBlended = function(object) {
    if (object.state.hasBlend) {
      object.draw({ mm: this.computeMM() });
    }
  };

  this.drawOpaque = function(object) {
    if (!object.state.hasBlend) {
      object.draw({ mm: this.computeMM() });
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
