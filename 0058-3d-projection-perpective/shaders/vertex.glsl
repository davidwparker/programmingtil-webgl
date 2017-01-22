attribute vec4 aPosition;
attribute vec4 aColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vColor;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
  vColor = aColor;
}
