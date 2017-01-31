attribute vec4 aPosition;
attribute vec4 aColor;
attribute float aFace; // int cannot be used as an attribute

uniform mat4 uMVPMatrix;
uniform bool uClicked;
uniform int  uPickedFace;

varying vec4 vColor;

void main() {
  gl_Position = uMVPMatrix * aPosition;

  int face = int(aFace);
  vec3 color = (face == uPickedFace) ? vec3(1.0) : aColor.rgb;
  // In case of 0, insert the face number into alpha
  if (uPickedFace == 0) {
    vColor = vec4(color, aFace/255.0);
  } else {
    vColor = vec4(color, aColor.a);
  }
}
