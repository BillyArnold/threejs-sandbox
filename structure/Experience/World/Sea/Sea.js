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
    this.debugObject = {};

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 512, 512);
  }

  setTextures() {
    this.textures = {};
  }

  setMaterial() {
    this.debugObject.depthColor = "#186691";
    this.debugObject.surfaceColor = "#9bd8ff";

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },
        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4.0 },
        uDepthColor: { value: new THREE.Color(this.debugObject.depthColor) },
        uSurfaceColor: {
          value: new THREE.Color(this.debugObject.surfaceColor),
        },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 2 },
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

      this.debugFolder
        .add(this.material.uniforms.uBigWavesSpeed, "value")
        .min(0)
        .max(4)
        .step(0.001)
        .name("uBigWavesSpeed");

      this.debugFolder.addColor(this.debugObject, "depthColor").onChange(() => {
        this.material.uniforms.uDepthColor.value.set(
          this.debugObject.depthColor,
        );
      });
      this.debugFolder
        .addColor(this.debugObject, "surfaceColor")
        .onChange(() => {
          this.material.uniforms.uSurfaceColor.value.set(
            this.debugObject.surfaceColor,
          );
        });

      this.debugFolder
        .add(this.material.uniforms.uColorOffset, "value")
        .min(0)
        .max(1)
        .step(0.001)
        .name("uColorOffset");
      this.debugFolder
        .add(this.material.uniforms.uColorMultiplier, "value")
        .min(0)
        .max(10)
        .step(0.001)
        .name("uColorMultiplier");

      this.debugFolder
        .add(this.material.uniforms.uBigWavesSpeed, "value")
        .min(0)
        .max(4)
        .step(0.001)
        .name("uBigWavesSpeed");

      this.debugFolder
        .add(this.material.uniforms.uSmallWavesElevation, "value")
        .min(0)
        .max(1)
        .step(0.001)
        .name("uSmallWavesElevation");

      this.debugFolder
        .add(this.material.uniforms.uSmallWavesFrequency, "value")
        .min(0)
        .max(30)
        .step(0.001)
        .name("uSmallWavesFrequency");

      this.debugFolder
        .add(this.material.uniforms.uSmallWavesSpeed, "value")
        .min(0)
        .max(4)
        .step(0.001)
        .name("uSmallWavesSpeed");

      this.debugFolder
        .add(this.material.uniforms.uSmallIterations, "value")
        .min(0)
        .max(10)
        .step(1)
        .name("uSmallIterations");
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
