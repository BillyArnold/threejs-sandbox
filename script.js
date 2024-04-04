import * as THREE from "three";
import gsap from "gsap";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

//creating mesh directly instead of separately adding geometry and material
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "red" }),
);
//add cube to group instead of scene
scene.add(mesh);

const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 3);
scene.add(camera);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

const clock = new THREE.Clock();
// let time = Date.now();
//animation
//this tick is the game look
//functions on every frame
const tick = () => {
  //higher framerate will equal faster rotation if done without time check way,
  //so will need to use the time value to make things consistent

  //get timestamp in milliseconds
  //const currentTime = Date.now();
  //get difference between the current time and the previous time
  //const deltaTime = currentTime - time;
  //once delaTime is found, reset time to current time
  //time = currentTime;

  //three js has built in timing as well
  //use pi to rotate 1 per second
  //mesh.rotation.y = clock.getElapsedTime() * Math.PI * 2;

  //below is example of circular motion
  //mesh.rotation.y = Math.sin(clock.getElapsedTime()); // up and down movement
  //mesh.rotation.x = Math.cos(clock.getElapsedTime()); // up and down movement

  //need to render everytime things are recalculated
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
