import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

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
const material = new THREE.MeshBasicMaterial({
  //color: debugObject.color,
  wireframe: false,
  map: colorTexture,
});

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const cubeTweaks = gui.addFolder("Cube Stuff");
//debug y
//params are min max step for drag and drop
cubeTweaks.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
cubeTweaks.add(mesh, "visible");
cubeTweaks.add(material, "wireframe");
cubeTweaks
  .addColor(debugObject, "color")
  .onChange(() => material.color.set(debugObject.color));

debugObject.spin = () => {
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
};

gui
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision,
    );
  });

gui.add(debugObject, "spin");

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 3;
camera.lookAt(mesh.position);
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

const tick = () => {
  //update controls
  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
