import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "red" });
//combine geometry and material into a mesh object
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
//mesh.position.x = 0.7;
//mesh.position.y = -0.6;
//mesh.position.z = 1;
//change all positions at once
mesh.position.set(0.7, -0.6, 1);

mesh.scale.set(2, 0.5, 0.5);

//half a rotation or 180degress is pi
//mesh.rotation.reorder('yzx') can be used to make sure that rotations are happening in the right order to be more specific
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;

//quaternion represents rotation but in more mathematical ways
//generally just passing quaternion around objects if necessary

//normalise takes vector length (distance from 0,0,0) and reduces it to 1,
//mesh.position.normalize();
//legnth shows distance from 000
console.log(mesh.position.length());

//add a camera
//fov, aspect
const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 3);
scene.add(camera);

//use lookat, pass in vector3 to show where to look at
camera.lookAt(mesh.position);

console.log(mesh.position.distanceTo(camera.position));

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
