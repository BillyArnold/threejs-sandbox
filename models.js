import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import CANNON from "cannon";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Debug
 */
const gui = new GUI();
const debugObject = {};

debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
gui.add(debugObject, "createSphere");

debugObject.createBox = () => {
  createBox(Math.random(), Math.random(), Math.random(), {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
gui.add(debugObject, "createBox");

debugObject.reset = () => {
  for (const object of objectsToUpdate) {
    //remove body
    object.body.removeEventListener("collide", playHitSound);
    world.removeBody(object.body);
    object.mesh.removeFromParent();
  }
  objectsToUpdate.splice(0, objectsToUpdate.length); //reset array
};
gui.add(debugObject, "reset");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const gltfLoader = new GLTFLoader();
let mixer = null;

//Models
gltfLoader.load(
  "./images/models/Fox/glTF/Fox.gltf",
  (gltf) => {
    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[2]);
    action.play();
    //success
    console.log(gltf);
    gltf.scene.scale.set(0.03, 0.03, 0.03);
    scene.add(gltf.scene);
  },
  (progress) => {
    //progress
    //console.log(progress);
  },
  (error) => {
    //error
    console.log(error);
  },
);

//animations

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "./images/textures/environmentMaps/0/px.png",
  "./images/textures/environmentMaps/0/nx.png",
  "./images/textures/environmentMaps/0/py.png",
  "./images/textures/environmentMaps/0/ny.png",
  "./images/textures/environmentMaps/0/pz.png",
  "./images/textures/environmentMaps/0/nz.png",
]);

/**
 * Physics
 */
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

//physics materials
const concreteMaterial = new CANNON.Material("concrete");
const plasticMaterial = new CANNON.Material("plastic");
const defaultMaterial = new CANNON.Material("default");

//create contact material to describe how they interact
//restitution is about bounce
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  },
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

//in cannon, a shape is needed to add to a body which can utilise different physics properties
//const sphereShape = new CANNON.Sphere(0.5);
//const sphereBody = new CANNON.Body({
//  mass: 1,
//  position: new CANNON.Vec3(0, 3, 0),
//  shape: sphereShape,
//  //material: defaultMaterial,
//});
//sphereBody.applyLocalForce(
//  new CANNON.Vec3(150, 0, 0),
//  new CANNON.Vec3(0, 0, 0),
//);
//world.addBody(sphereBody);

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0; // object is static and won't move at 0 mass, doesn't actually need to happen as 0 is default;
floorBody.addShape(floorShape);
floorBody.material = defaultMaterial;

//quaternion used for rotation in cannon
//first param is axis, second is angle in radians
//body has to be rotated to match the mesh rotation
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);

world.addBody(floorBody);

/**
 * Test sphere
 */
//const sphere = new THREE.Mesh(
//  new THREE.SphereGeometry(0.5, 32, 32),
//  new THREE.MeshStandardMaterial({
//    metalness: 0.3,
//    roughness: 0.4,
//    envMap: environmentMapTexture,
//    envMapIntensity: 0.5,
//  }),
//);
//sphere.castShadow = true;
//sphere.position.y = 0.5;
//scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  }),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const objectsToUpdate = [];

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const createBox = (width, height, depth, position) => {
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  //cannon js body
  const shape = new CANNON.Box(
    new CANNON.Vec3(width / 2, height / 2, depth / 2),
  );
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });
  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);

  //save in objects to update
  objectsToUpdate.push({ mesh, body });
};

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const createSphere = (radius, position) => {
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  //cannon js body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });
  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);

  //save in objects to update
  objectsToUpdate.push({ mesh, body });
};

const hitSound = new Audio("./images/sounds/hit.mp3");

const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  if (impactStrength > 1.5) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
  }
};

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  //animate sphere
  //below is like wind
  //sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
  if (mixer) {
    mixer.update(deltaTime);
  }
  //update physics world
  world.step(1 / 60, deltaTime, 3);

  //sphere.position.copy(sphereBody.position);
  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
