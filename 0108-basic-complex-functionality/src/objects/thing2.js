/*
* Primitives and Objects
* www.programmingtil.com
* www.codenameparkerllc.com
*/
// Create a BasicThing
function Thing2(opts) {
  var opts = opts || {};
  opts.objectType = 'Thing1';
  opts.objects = [
    new Cube({
      blend: false,
      gl: state.gl,
      programs: {
        render: state.programs.texture,
        read: state.programs.read
      },
      selColor: opts.selColor,
      angle: [0, 45, 0],
      texture: 'stainglass'
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
      blend: false,
      gl: state.gl,
      programs: {
        render: state.programs.render,
        read: state.programs.read
      },
      selColor: opts.selColor,
      translate: [0, +2.5, 0]
    })
  ];

  return new BasicComplex(opts);
}
