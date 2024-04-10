import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

//Textures
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("load start");
};
loadingManager.onLoaded = () => {
  console.log("loading finished");
};
loadingManager.onProgress = () => {
  console.log("progress loading");
};
loadingManager.onError = () => {
  console.log("error loading");
};


const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("./images/door/color.jpg");
colorTexture.colorSpace = THREE.SRGBColorSpace;
const alphaTexture = textureLoader.load("./images/door/opacity.jpg");
const heightTexture = textureLoader.load("./images/door/height.png");
const normalTexture = textureLoader.load("./images/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "./images/door/ambientOcclusion.jpg",
);
const metalnessTexture = textureLoader.load("./images/door/metallic.jpg");
const roughnessTexture = textureLoader.load("./images/door/roughness.jpg");
const matcapTexture = textureLoader.load("./images/matcaps/1.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;
const gradientTexture = textureLoader.load("./images/gradients/5.jpg");

colorTexture.generateMipmaps = false;

colorTexture.minFilter = THREE.NearestFilter;


//Debug
const gui = new GUI({
  width: 340,
  title: "UI naming",
  closeFolders: true,
});
//gui.hide() can hide debug, below hides on h key
window.addEventListener("keydown", (event) => {
  if (event.key == "h") {
    gui.show(gui._hidden);
  }
});
const debugObject = {};

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //update renderer
  renderer.setSize(sizes.width, sizes.height);
});

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

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullScreenElement;

  if (!fullscreenElement) {
    //enter full screen
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullScreen) {
      canvas.webkitRequestFullScreen();
    }
  } else {
    //leave fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else {
      document.webkitExitFullscreen();
    }
  }
});

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

debugObject.color = "red";
debugObject.subdivision = 2;
//const material = new THREE.MeshBasicMaterial({map: colorTexture,});
// const material = new THREE.MeshNormalMaterial({
//   // color: "red",
//   wireframe: false,
//   map: colorTexture,
// });
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

// const material = new THREE.MeshToonMaterial();
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// material.gradientMap = gradientTexture;

// const material = new THREE.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.transparent = true;
// material.normalScale.set(0.5, 0.5);
// material.alphaMap = alphaTexture;

const material = new THREE.MeshPhysicalMaterial();
material.metalness = 1;
material.roughness = 1;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.transparent = true;
// material.normalScale.set(0.5, 0.5);
// material.alphaMap = alphaTexture;

// material.clearcoat = 1;
// material.clearcoatRoughness = 0;
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1,1,1);

// gui.add(material, "metalness").min(0).max(1);
// gui.add(material, "roughness").min(0).max(1);

//iridescence
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];

material.transparent = false;
material.transparent = 0;
material.transmission = 0.5;
material.ior = 1.5;
material.thickness = 0.5;

const Boxgeometry = new THREE.PlaneGeometry(1, 1, 64, 64);
const Spheregeometry = new THREE.SphereGeometry(.5, 64, 64);
const Torusgeometry = new THREE.TorusGeometry(.5, .2, 64, 128);
const Boxmesh = new THREE.Mesh(Boxgeometry, material);
const Spheremesh = new THREE.Mesh(Spheregeometry, material);
const Torusmesh = new THREE.Mesh(Torusgeometry, material);
scene.add(Boxmesh, Spheremesh, Torusmesh);


Spheremesh.position.x = -2;
Torusmesh.position.x = 2;


// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.set(2, 3, 4);
// scene.add(pointLight);


/* Environment map */
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./images/environmentMap/2k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});


const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 5;
camera.lookAt(Boxmesh.position);
scene.add(camera);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//controls
const controls = new OrbitControls(camera, canvas);
//damping
controls.enableDamping = true;

const clock = new THREE.Clock();

const tick = () => {
  //update controls
  controls.update();

  const elapsedTime = clock.getElapsedTime();

  //update objects
  Boxmesh.rotation.y = 0.1 * elapsedTime;
  Spheremesh.rotation.y = 0.1 * elapsedTime;
  Torusmesh.rotation.y = 0.1 * elapsedTime;

  Boxmesh.rotation.x = -0.15 * elapsedTime;
  Spheremesh.rotation.x = -0.15 * elapsedTime;
  Torusmesh.rotation.x = -0.15 * elapsedTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
