// attribute I'm a comment, but I still work...
attribute vec4 aPosition;
attribute vec4 aColor;

varying vec4 vColor;

void main() {
  gl_Position = aPosition;
  gl_PointSize = 1.5;
  vColor = aColor;
}
