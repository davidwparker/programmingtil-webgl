attribute vec4 aPosition;
attribute vec4 aColor;

uniform mat4 uMVPMatrix;

varying vec4 vColor;

void main() {
  gl_Position = uMVPMatrix * aPosition;
  vColor = aColor;
}
