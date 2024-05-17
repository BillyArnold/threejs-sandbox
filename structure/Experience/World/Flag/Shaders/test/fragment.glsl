precision mediump float;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

uniform vec3 uColor;
uniform sampler2D uTexture;

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 2.0 + 0.5;
  gl_FragColor = textureColor;
  //gl_FragColor = vec4(uColor, 1.0);
  //gl_FragColor = vec4(0.5, vRandom, 1.0, 1.0);
}
