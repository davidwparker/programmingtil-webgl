attribute vec4 aPosition;

uniform mat4 uModelMatrix;

void main() {
  gl_Position = uModelMatrix * aPosition;
}
