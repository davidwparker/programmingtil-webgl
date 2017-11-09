/*
* Primitives and Objects
* www.programmingtil.com
* www.codenameparkerllc.com
*/
function Plane(opts) {
  var opts = opts || {};
  opts.objectType = 'Plane';

  // Vextex positions
  // v0-v1-v2-v3 front
  opts.attributes = {
    aColor: {
      size: 4,
      offset: 0,
      bufferData: new Float32Array([
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1 // front
      ])
    },
    aNormal: {
      size: 3,
      offset: 0,
      bufferData: new Float32Array([
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        1.0 // f
      ])
    },
    aPosition: {
      size: 3,
      offset: 0,
      bufferData: new Float32Array([
        1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0 // f
      ])
    },
    aSelColor: {
      size: 4,
      offset: 0,
      bufferData: undefined
    },
    aTexCoord: {
      size: 2,
      offset: 0,
      bufferData: new Float32Array([
        1.0,
        1.0,
        0.0,
        1.0,
        0.0,
        0.0,
        1.0,
        0.0 // f
      ])
    }
  };
  opts.indices = new Uint8Array([
    0,
    1,
    2,
    0,
    2,
    3 // f
  ]);

  return new BasicPrimitive(opts);
}
