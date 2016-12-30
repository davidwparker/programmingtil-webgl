attribute vec4 aPosition;
attribute vec4 aColor;

uniform vec2 uCosBSinB;

varying vec4 vColor;

void main() {
  gl_Position.x = aPosition.x * uCosBSinB.x - aPosition.y * uCosBSinB.y;
  gl_Position.y = aPosition.x * uCosBSinB.y + aPosition.y * uCosBSinB.x;
  gl_Position.z = aPosition.z;
  gl_Position.w = 1.0;
  vColor = aColor;
}
