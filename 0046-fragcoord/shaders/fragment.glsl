precision mediump float;

uniform float uWidth;
uniform float uHeight;

void main() {
  // representing these values as xyzw as rgba
  // gl_FragCoord contains xyzw, from the window coordinates.
  // we need to convert them to color ranges

  // convert x,y,z to range [0,+1]
  float x = gl_FragCoord.x/uWidth;
  float y = gl_FragCoord.y/uHeight;
  // depth is always the same in window coordinates
  float z = gl_FragCoord.z;
  // gl_FragColor = vec4(x, y, z, 1.0);
  gl_FragColor = vec4(x, y, 0.0, 1.0);
}
