#ifdef GL_ES
precision mediump float;
#endif

attribute vec4 aColor;
attribute vec4 aNormal;
attribute vec4 aPosition;

uniform mat4 uMVPMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uViewMatrix;

varying vec4 vColor;
varying vec3 vNormal;
varying vec4 vPosition;
varying float vDist;

void main() {
  gl_Position = uMVPMatrix * aPosition;

  vColor = aColor;
  vNormal = normalize(uNormalMatrix * vec3(aNormal));

  // Calculate the modelView of the model, and set the vPosition
  mat4 modelViewMatrix = uViewMatrix * uModelMatrix;
  vPosition = modelViewMatrix * aPosition;
  vDist = gl_Position.w;
}
