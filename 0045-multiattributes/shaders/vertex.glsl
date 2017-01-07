attribute vec4 aPosition;
attribute vec4 aColor;

uniform mat4 uModelMatrix;

varying vec4 vColor;

void main() {
  gl_Position = uModelMatrix * aPosition;
  vColor = aColor;
}
