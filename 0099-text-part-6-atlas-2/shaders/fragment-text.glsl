precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uSampler0;

void main() {
  gl_FragColor = texture2D(uSampler0, vTexCoord);
}
