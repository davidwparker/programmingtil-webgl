attribute vec4 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uMVPMatrix;

varying vec2 vTexCoord;

void main() {
  gl_Position = uMVPMatrix * aPosition;
  vTexCoord = aTexCoord;
}
