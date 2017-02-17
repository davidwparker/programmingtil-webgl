attribute vec4 aColor;
attribute vec4 aNormal;
attribute vec4 aPosition;

uniform mat4 uMVPMatrix;
uniform vec3 uLightColor;
uniform vec3 uLightDirection;

varying vec4 vColor;

void main() {
  gl_Position = uMVPMatrix * aPosition;

  // normalize the length
  vec3 normal = normalize(aNormal.xyz);

  // Dot product of the light direction and the orientation of a surface (the normal)
  float nDotLight = max(dot(uLightDirection, normal), 0.0);

  // Calculate the color due to diffuse reflection
  vec3 diffuse = uLightColor * aColor.rgb * nDotLight;

  vColor = vec4(diffuse, aColor.a);
}
