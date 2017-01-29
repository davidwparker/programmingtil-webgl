attribute vec4 aPosition;
attribute vec4 aColor;
attribute vec4 aSelColor;

uniform mat4 uMVPMatrix;
uniform bool uClicked;

varying vec4 vColor;

void main() {
  gl_Position = uMVPMatrix * aPosition;
  if (uClicked) {
    vColor = aSelColor;
  }
  else {
    vColor = aColor;
  }
}
