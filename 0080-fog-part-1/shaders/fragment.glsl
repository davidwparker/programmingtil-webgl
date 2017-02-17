precision mediump float;

uniform vec3 uDiffuseLight;
uniform vec3 uLightPosition;
uniform vec3 uAmbientLight;
uniform vec3 uFogColor; // Color of Fog
uniform vec2 uFogDist;  // Distance of Fog (starting point, end point)

varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDist;

void main() {
  // Lighting
  // Normalize the normal because it is interpolated and not 1.0 in length any more
  vec3 normal = normalize(vNormal);

  // Calculate the light direction and make its length 1.
  vec3 lightDirection = normalize(uLightPosition - vPosition);

  // The dot product of the light direction and the orientation of a surface (the normal)
  float nDotL = max(dot(lightDirection, normal), 0.0);

  // Calculate the final color from diffuse reflection and ambient reflection
  vec3 diffuse = uDiffuseLight * vColor.rgb * nDotL;
  vec3 ambient = uAmbientLight * vColor.rgb;

  // Fog
  // Calculation of fog factor (factor becomes smaller as it goes further away from eye point)
  float fogFactor = clamp((uFogDist.y - vDist) / (uFogDist.y - uFogDist.x), 0.0, 1.0);

  // Stronger fog as it gets further: uFogColor * (1 - fogFactor) + vColor * fogFactor
  // vec3 color = mix(uFogColor, vec3(vColor), fogFactor);
  vec3 color = mix(uFogColor, vec3(diffuse + ambient), fogFactor);

  gl_FragColor = vec4(color, vColor.a);
}
