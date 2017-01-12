precision mediump float;

uniform sampler2D uSampler0;
uniform sampler2D uSampler1;

varying vec2 vTexCoord;

void main() {
  vec4 tex0 = texture2D(uSampler0, vTexCoord);
  vec4 tex1 = texture2D(uSampler1, vTexCoord);
  gl_FragColor = tex1 * tex0;
}
