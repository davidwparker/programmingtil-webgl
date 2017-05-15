precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uSampler0;
uniform vec4 uColor;

void main() {
  gl_FragColor = texture2D(uSampler0, vTexCoord) * uColor;
}
