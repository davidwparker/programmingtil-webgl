attribute vec4 aPosition;
attribute vec4 aColor;

// http://www.html5rocks.com/en/tutorials/webgl/shaders/
// Varyings are variables declared in the vertex shader that we want
// to share with the fragment shader. To do this we make sure we declare
// a varying variable of the same type and name in both the vertex shader
// and the fragment shader. A classic use of this would be a vertex's normal
// since this can be used in the lighting calculations.
varying vec4 vColor;

void main() {
  gl_Position = aPosition;
  vColor = aColor;
}
