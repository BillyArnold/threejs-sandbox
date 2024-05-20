precision mediump float;

varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

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
  //float strength = vUv.y * 10.0;
  //gl_FragColor = vec4(strength, strength, strength,  1.0);
  
  //blinds
  //float strength = mod(vUv.y * 10.0, 1.0);
  //gl_FragColor = vec4(strength, strength, strength,  1.0);

  //blinds blocky
  //float strength = mod(vUv.y * 10.0, 1.0);
  //strength = step(0.5, strength);
  //gl_FragColor = vec4(strength, strength, strength,  1.0);
  
  //square grid
  //float strength = step(0.8, mod(vUv.y * 10.0, 1.0));
  //strength += step(0.8, mod(vUv.x * 10.0, 1.0));
  //gl_FragColor = vec4(strength, strength, strength,  1.0);

  //minecraft grid
  vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
  float strength = random(gridUv);
  gl_FragColor = vec4(strength, strength, strength,  1.0);
}

