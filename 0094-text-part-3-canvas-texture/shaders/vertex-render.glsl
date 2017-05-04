attribute vec4 aColor;
attribute vec4 aNormal;
attribute vec4 aPosition;

uniform mat4 uMVPMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;

varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDist;

void main() {
  gl_Position = uMVPMatrix * aPosition;

  vColor = aColor;
  vNormal = normalize(uNormalMatrix * vec3(aNormal));
  vPosition = vec3(uModelMatrix * aPosition);
  vDist = gl_Position.w;
}
