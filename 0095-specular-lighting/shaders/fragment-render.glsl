#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uDiffuseLight;
uniform vec3 uLightPosition;
uniform vec3 uAmbientLight;
uniform vec3 uFogColor;
uniform vec2 uFogDist;
uniform mat4 uViewMatrix;

varying vec4 vColor;
varying vec3 vNormal;
varying vec4 vPosition;
varying float vDist;

void main() {
  // Lighting
  // Normalize the normal because it is interpolated and not 1.0 in length any more
  vec3 normal = normalize(vNormal);

  // Calculate the light position based on the view matrix, with the light's vector
  // minus the position of the model, then normalize.
  vec3 lightPosition = vec3(uViewMatrix * vec4(uLightPosition, 1) - vPosition);
  vec3 lightDirection = normalize(lightPosition);

  // The dot product of the light direction and the orientation of a surface (the normal)
  // This will be the "diffuse factor"
  float nDotL = max(dot(lightDirection, normal), 0.0);

  // Specular vars to canculate
  float specularPower = 120.0;
  float specular = 0.0;

  if (nDotL > 0.0) {
    // viewing vector
    vec3 viewVec = vec3(0,0,1.0);

    // reflective vector
    vec3 reflectVec = reflect(-lightDirection, normal);

    // determine the specularFactor based on the dot product of viewing and reflective,
    // taking at least a minimum of 0.0
    float specularFactor = max(dot(reflectVec, viewVec), 0.0);
    specular = pow(specularFactor, specularPower);
  }

  // minimum color + baseline diffuse factor + specular
  gl_FragColor.rgb = vec3(0.1,0.1,0.1) + vec3(0.4, 0.4, 0.4) * nDotL + specular;
  gl_FragColor.a = vColor.a;

  // // Calculate the final color from diffuse reflection and ambient reflection
  // vec3 diffuse = uDiffuseLight * vColor.rgb * nDotL;
  // vec3 ambient = uAmbientLight * vColor.rgb;
  // gl_FragColor = vec4(diffuse + ambient, vColor.a);

  // Fog
  // Calculation of fog factor (factor becomes smaller as it goes further away from eye point)
  // float fogFactor = clamp((uFogDist.y - vDist) / (uFogDist.y - uFogDist.x), 0.0, 1.0);
  //
  // // Stronger fog as it gets further: uFogColor * (1 - fogFactor) + vColor * fogFactor
  // vec3 color = mix(uFogColor, vec3(vColor), fogFactor);
  // vec3 lightColor = vec3(diffuse + ambient);
  // color = mix(color, lightColor, 0.05);
  //
  // gl_FragColor = vec4(color, vColor.a);
}
