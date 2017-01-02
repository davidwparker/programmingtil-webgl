// https://www.davidwparker.com
// https://www.codenameparkerllc.com
// https://www.programmingtil.com
attribute vec4 aPosition;
attribute vec4 aColor;

uniform mat4 uTransformationMatrix;

varying vec4 vColor;

void main() {
  gl_Position = uTransformationMatrix * aPosition;
  vColor = aColor;
}
