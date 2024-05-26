import Experience from "./Experience";
import * as THREE from "three";
import vertexShader from "./Shaders/loader/vertex.glsl";
import fragmentShader from "./Shaders/loader/fragment.glsl";
import { gsap } from "gsap";

export default class Loader {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uAlpha: { value: 0.5 },
      },
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  updateHTMLLoader(value) {
    document.querySelector(".loading-bar").style.transform = `scaleX(${value})`;
  }

  fadeOut() {
    const htmlLoader = document.querySelector(".loading-bar");
    const loaderDuration = 1;

    gsap.to(htmlLoader, {
      duration: loaderDuration,
      opacity: 0,
    });
    gsap.to(this.material.uniforms.uAlpha, {
      duration: loaderDuration,
      value: 0,
    });
  }
}
