attribute vec4 aPosition;
attribute vec4 aColor;

uniform float uCosB;
uniform float uSinB;

varying vec4 vColor;

void main() {
  gl_Position.x = aPosition.x * uCosB - aPosition.y * uSinB;
  gl_Position.y = aPosition.x * uSinB + aPosition.y * uCosB;
  gl_Position.z = aPosition.z;
  gl_Position.w = 1.0;
  vColor = aColor;
}
