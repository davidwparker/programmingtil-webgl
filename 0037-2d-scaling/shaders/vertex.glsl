attribute vec4 aPosition;
attribute vec4 aColor;

uniform vec2 uScale;

varying vec4 vColor;

void main() {
  gl_Position.x = aPosition.x * uScale.x;
  gl_Position.y = aPosition.y * uScale.y;
  gl_Position.z = aPosition.z;
  gl_Position.w = 1.0;
  vColor = aColor;
}
