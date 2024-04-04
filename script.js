import * as THREE from "three";
import gsap from "gsap";

const sizes = {
  width: 800,
  height: 600,
};

//cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  // - 0.5 so that the middle is 0
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

//creating mesh directly instead of separately adding geometry and material
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "red" }),
);
//add cube to group instead of scene
scene.add(mesh);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
const aspectRatio = sizes.width / sizes.height;
//const camera = new THREE.OrthographicCamera(
//  -1 * aspectRatio,
//  1 * aspectRatio,
//  1,
//  -1,
// 0.1,
//  100,
//);
//camera.position.set(2, 2, 2);
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();
const tick = () => {
  //mesh.rotation.y = clock.getElapsedTime();
  //camera.position.set(cursor.x, -cursor.y, 2);
  //circle camera movement
  // sin and cos combined make the circle shape, timesing the position by pi2 gets the 360 rotation, *3 makes it further away
  camera.position.x = Math.sin(cursor.x * (Math.PI * 2)) * 3;
  camera.position.z = Math.cos(cursor.x * (Math.PI * 2)) * 3;
  camera.position.y = cursor.y * 3;
  camera.lookAt(mesh.position);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
