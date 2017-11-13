/*
* Primitives and Objects
* www.programmingtil.com
* www.codenameparkerllc.com
*/
// Create a BasicThing
function Thing1(opts) {
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
      translate: [0, +1.25, 0],
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
      translate: [0, -1.25, 0]
    })
  ];

  return new BasicComplex(opts);
}
