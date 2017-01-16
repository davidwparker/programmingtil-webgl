attribute vec4 aPosition;
attribute vec4 aColor;

uniform mat4 uViewMatrix;

varying vec4 vColor;

void main() {
  gl_Position = uViewMatrix * aPosition;
  vColor = aColor;
}
