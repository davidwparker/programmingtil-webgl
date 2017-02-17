precision mediump float;

uniform vec3 uDiffuseLight;
uniform vec3 uLightPosition;
uniform vec3 uAmbientLight;
uniform sampler2D uSampler0;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;

void main() {
  vec4 tex0 = texture2D(uSampler0, vTexCoord);

  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(uLightPosition - vPosition);
  float nDotL = max(dot(lightDirection, normal), 0.0);
  // vec3 diffuse = uDiffuseLight * nDotL;
  // vec3 ambient = uAmbientLight;
  // vec3 lightWeight = vec3(diffuse + ambient);
  // gl_FragColor = vec4(tex0.rgb * lightWeight, tex0.a);

  vec3 diffuse = uDiffuseLight * tex0.rgb * nDotL;
  vec3 ambient = uAmbientLight * tex0.rgb;
  vec3 lightColor = vec3(diffuse + ambient);
  gl_FragColor = vec4(lightColor, tex0.a);
}
