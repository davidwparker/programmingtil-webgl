attribute vec4 aPosition;

void main() {
  gl_Position = aPosition;
  gl_PointSize = 10.0;
}
