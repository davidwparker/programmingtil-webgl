attribute vec4 aPosition;
attribute vec4 aColor;

uniform mat4 uMVPMatrix;
uniform bool uClicked;

varying vec4 vColor;

void main() {
  gl_Position = uMVPMatrix * aPosition;
  if (uClicked) {
    vColor = vec4(1.0,0.0,0.0,1.0);
  }
  else {
    vColor = aColor;
  }
}
