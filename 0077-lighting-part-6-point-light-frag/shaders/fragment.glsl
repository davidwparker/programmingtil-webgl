precision mediump float;

uniform vec3 uDiffuseLight;
uniform vec3 uLightPosition;
uniform vec3 uAmbientLight;

varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Normalize the normal because it is interpolated and not 1.0 in length any more
  vec3 normal = normalize(vNormal);

  // Calculate the light direction and make its length 1.
  vec3 lightDirection = normalize(uLightPosition - vPosition);

  // The dot product of the light direction and the orientation of a surface (the normal)
  float nDotL = max(dot(lightDirection, normal), 0.0);

  // Calculate the final color from diffuse reflection and ambient reflection
  vec3 diffuse = uDiffuseLight * vColor.rgb * nDotL;
  vec3 ambient = uAmbientLight * vColor.rgb;
  gl_FragColor = vec4(diffuse + ambient, vColor.a);
}
