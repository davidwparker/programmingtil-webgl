attribute vec4 aPosition;
attribute vec4 aColor;

uniform vec4 uTranslation;

varying vec4 vColor;

void main() {
  gl_Position = aPosition + uTranslation;
  vColor = aColor;
}
