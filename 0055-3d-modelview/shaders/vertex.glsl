attribute vec4 aPosition;
attribute vec4 aColor;

uniform mat4 uModelViewMatrix;

varying vec4 vColor;

void main() {
  gl_Position = uModelViewMatrix * aPosition;
  vColor = aColor;
}
