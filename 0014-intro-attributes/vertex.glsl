// Attributes are values that are applied to individual vertices.
// Attributes are only available to the vertex shader.
// This could be something like each vertex having a distinct color.
// Attributes have a one-to-one relationship with vertices.
attribute vec4 aPosition;

void main() {
  gl_Position = aPosition;
  gl_PointSize = 10.0;
}
