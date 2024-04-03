import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "red" });
//combine geometry and material into a mesh object
const mesh = new THREE.Mesh(geometry, material);

//add the mesh to the scene
scene.add(mesh);

//add a camera
//fov, aspect
const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
