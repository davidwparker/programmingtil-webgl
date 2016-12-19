precision mediump float;

// http://www.html5rocks.com/en/tutorials/webgl/shaders/
// Uniforms are sent to both vertex shaders and fragment shaders
// and contain values that stay the same across the entire frame
// being rendered. A good example of this might be a light's position.
uniform vec4 uFragColor;

void main() {
  gl_FragColor = uFragColor;
}
