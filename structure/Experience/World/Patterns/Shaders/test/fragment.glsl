precision mediump float;

varying vec2 vUv;

void main() {
  //gradient horizontal
  //float strength = vUv.x;
  //gl_FragColor = vec4(strength, strength, strength,  1.0);

  //gradient vertical
  //float strength = vUv.y;
  //gl_FragColor = vec4(strength, strength, strength,  1.0);
  
  //gradient vertical inverse
  //float strength = 1.0 - vUv.y;
  //gl_FragColor = vec4(strength, strength, strength,  1.0);

  //gradient vertical inverse with start point
  float strength = 1.0 - vUv.y;
  //position varying maybe?
  gl_FragColor = vec4(strength, strength, strength,  1.0);
}

