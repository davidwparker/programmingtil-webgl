attribute vec4 aNormal;
attribute vec4 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uMVPMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;

void main() {
  gl_Position = uMVPMatrix * aPosition;

  vTexCoord = aTexCoord;
  vNormal = normalize(uNormalMatrix * vec3(aNormal));
  vPosition = vec3(uModelMatrix * aPosition);
}
