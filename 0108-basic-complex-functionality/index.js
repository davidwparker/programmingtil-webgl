(function(global) {
  /*
  * Constants, State, and Main
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  var IMAGES = [
    { name: 'stainglass', src: '/images/txStainglass.bmp' },
    { name: 'crate', src: '/images/txCrate.bmp' }
  ];

  var state = {
    gl: null,
    programs: {},
    mode: 'render',
    ui: {
      dragging: false,
      mouse: {
        lastX: -1,
        lastY: -1
      },
      pressedKeys: {}
    },
    animation: {},
    app: {
      animate: true,
      eye: {
        x: 2,
        y: 6,
        z: 10,
        w: 1
      },
      fog: {
        color: new Float32Array([0.5, 0.5, 0.5]),
        dist: new Float32Array([60, 80]),
        on: false
      },
      light: {
        ambient: [0.2, 0.2, 0.2],
        diffuse: [1.0, 1.0, 1.0],
        position: [1.0, 2.0, 1.7]
      },
      objects: [],
      textures: {}
    },
    vm: mat4.create(),
    pm: mat4.create(),
    mvp: mat4.create(),
    eyeInArray: function() {
      return [this.app.eye.x, this.app.eye.y, this.app.eye.z, this.app.eye.w];
    }
  };

  glUtils.SL.init({
    callback: function() {
      main();
    }
  });

  function main() {
    initialize();
  }

  window.state = state;
  window.IMAGES = IMAGES;
})(window || this);
