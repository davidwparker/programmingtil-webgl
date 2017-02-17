attribute vec4 aColor;
attribute vec4 aNormal;
attribute vec4 aPosition;

uniform mat4 uMVPMatrix;
uniform mat3 uNormalMatrix;
// uniform mat4 uNormalMatrix;
uniform vec3 uAmbientLight;
uniform vec3 uDiffuseLight;
uniform vec3 uLightDirection;

varying vec4 vColor;

void main() {
  gl_Position = uMVPMatrix * aPosition;

  // normalize the length
  // Recalculate the normal based on the model matrix and make its length 1.
  vec3 normal = normalize(uNormalMatrix * vec3(aNormal));
  // vec3 normal = normalize(vec3(uNormalMatrix * aNormal));

  // Dot product of the light direction and the orientation of a surface (the normal)
  float nDotLight = max(dot(uLightDirection, normal), 0.0);

  // Calculate the color due to diffuse and ambient reflection
  vec3 diffuse = uDiffuseLight * aColor.rgb * nDotLight;
  vec3 ambient = uAmbientLight * aColor.rgb;

  vColor = vec4(diffuse + ambient, aColor.a);
}
