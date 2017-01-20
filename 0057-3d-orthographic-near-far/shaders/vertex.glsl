attribute vec4 aPosition;
attribute vec4 aColor;

uniform mat4 uProjectionMatrix;

varying vec4 vColor;

void main() {
  gl_Position = uProjectionMatrix * aPosition;
  vColor = aColor;
}
