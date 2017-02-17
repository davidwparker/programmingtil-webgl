attribute vec4 aColor;
attribute vec4 aNormal;
attribute vec4 aPosition;

uniform mat4 uMVPMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;
uniform vec3 uAmbientLight; //Ambient light color
uniform vec3 uDiffuseLight; //Light color
uniform vec3 uLightPosition;

varying vec4 vColor;

void main() {
  gl_Position = uMVPMatrix * aPosition;

  // normalize the length
  // Recalculate the normal based on the model matrix and make its length 1.
  vec3 normal = normalize(uNormalMatrix * vec3(aNormal));

  // Calculate world coordinate of vertex
  vec4 vertexPosition = uModelMatrix * aPosition;

  // Calculate the light direction and make it 1.0 in length
  vec3 lightDirection = normalize(uLightPosition - vec3(vertexPosition));

  // Dot product of the light direction and the orientation of a surface (the normal)
  float nDotLight = max(dot(lightDirection, normal), 0.0);
  // float nDotLight = 1.0;

  // Calculate the color due to diffuse and ambient reflection
  vec3 diffuse = uDiffuseLight * aColor.rgb * nDotLight;
  vec3 ambient = uAmbientLight * aColor.rgb;

  vColor = vec4(diffuse + ambient, aColor.a);
}
