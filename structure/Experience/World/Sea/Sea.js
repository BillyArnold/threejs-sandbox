import Experience from "../../Experience";
import * as THREE from "three";
import vertexShader from "./shaders/water/vertex.glsl";
import fragmentShader from "./shaders/water/fragment.glsl";

export default class Sea {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Sea");
    }

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 128, 128);
  }

  setTextures() {
    this.textures = {};
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
      },
    });

    if (this.debug.active) {
      this.debugFolder
        .add(this.material.uniforms.uBigWavesElevation, "value")
        .min(0)
        .max(1)
        .step(0.001)
        .name("uBigWavesElevation");

      this.debugFolder
        .add(this.material.uniforms.uBigWavesFrequency.value, "x")
        .min(0)
        .max(10)
        .step(0.001)
        .name("uBigWavesFrequencyX");

      this.debugFolder
        .add(this.material.uniforms.uBigWavesFrequency.value, "y")
        .min(0)
        .max(10)
        .step(0.001)
        .name("uBigWavesFrequencyY");
    }
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsed * 0.001;
  }
}
