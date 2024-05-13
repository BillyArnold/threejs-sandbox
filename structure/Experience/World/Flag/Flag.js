import Experience from "../../Experience";
import * as THREE from "three";
import testVertexShader from "./Shaders/test/vertex.glsl";
import testFragmentShader from "./Shaders/test/fragment.glsl";

export default class Flag {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("flag");
    }

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  }

  setTextures() {
    this.textures = {};

    this.textures.flag = this.resources.items.flagTexture;
  }

  setMaterial() {
    const count = this.geometry.attributes.position.count;
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
    }

    this.geometry.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(randoms, 1),
    );

    this.material = new THREE.RawShaderMaterial({
      vertexShader: testVertexShader,
      fragmentShader: testFragmentShader,
      uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 10) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("orange") },
        uTexture: { value: this.textures.flag },
      },
    });

    if (this.debug.active) {
      this.debugFolder
        .add(this.material.uniforms.uFrequency.value, "x")
        .name("Frequency X")
        .min(0)
        .max(20)
        .step(0.01);
      this.debugFolder
        .add(this.material.uniforms.uFrequency.value, "y")
        .name("Frequency Y")
        .min(0)
        .max(20)
        .step(0.01);
    }
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.y = 2 / 3; // aspect
    this.scene.add(this.mesh);
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsed * 0.001;
  }
}
