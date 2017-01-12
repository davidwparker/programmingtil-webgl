attribute vec4 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTextCoord;

void main() {
  gl_Position = aPosition;
  vTextCoord = aTexCoord;
}
