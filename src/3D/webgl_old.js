import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';

// import TeleportVR from 'teleportvr';
//import VRControl from 'https://catacombes.xyz/assets/utils/VRControls.js';
// import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
// import { gsap } from 'gsap';

// Get model URL from script tag
const modelUrl = window.MODEL_URL;
const title_rooms_div = document.querySelector('.title_rooms')
const title_rooms = document.querySelector('.title_rooms h2')
const text_rooms = document.querySelector('.title_rooms p')

// Scene, Overlay, Loading
const scene = new THREE.Scene(); 
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { uAlpha: { value: 1 } },
    vertexShader: `void main(){ gl_Position = vec4(position, 1.0); }`,
    fragmentShader: `uniform float uAlpha; void main(){ gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha); }`
});
// scene.add(new THREE.Mesh(overlayGeometry, overlayMaterial));

const loadingBarElement = document.querySelector('.loading-bar');
const loadingPercent = document.createElement("h2");
loadingPercent.className = "loadingPercent";
loadingPercent.innerHTML = "1%";
loadingPercent.style.color = "#fff";
loadingPercent.style.textAlign = "center";
loadingPercent.style.textAlign = "center";
document.body.appendChild(loadingPercent);

const loadingManager = new THREE.LoadingManager(() => {
    /*
    gsap.delayedCall(1, () => {
        gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 4, value: 0 });
        loadingBarElement.classList.add('ended');
        loadingPercent.remove();
        title_rooms_div.style.opacity = "1"
        title_rooms
        text_rooms
    });
    */
}, (itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal;
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;
    loadingPercent.innerHTML = `${Math.round(progressRatio * 100)} %`;
});

// Lights
function lightingSetup(scene) {
    const ambientLight = new THREE.AmbientLight(0x404040, 1); 
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x404040, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
}

lightingSetup(scene);

// Load model
const loader = new GLTFLoader(loadingManager);
loader.load(modelUrl, gltf => {
    const model = gltf.scene;

    model.position.y = -1.5;
    model.traverse((child) => {
        if (child.isMesh) {
            child.geometry.computeVertexNormals(); 
            child.material.flatShading = false;     
            child.material.needsUpdate = true;
        }
    });

    scene.add(model);
}, undefined, error => {
    console.error(error);
});

// Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight };
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera & Renderer
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.set(-3.67, 2.41, 7.28);
scene.add(camera);

const canvas = document.querySelector(".canvas_rooms");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;         // oui
renderer.toneMapping = THREE.NoToneMapping;  
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1.0;

// VR Setup
/*
document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;
renderer.setAnimationLoop(() => renderer.render(scene, camera));
*/
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 10;
controls.minDistance = 2;

// TeleportVR & Controllers
// const teleportVR = new TeleportVR(scene, camera);
// const controllerModelFactory = new XRControllerModelFactory();
// const vrControl = VRControl(renderer, camera, scene);
// scene.add(vrControl.controllerGrips[0], vrControl.controllers[0]);

// vrControl.controllers[0].addEventListener('selectstart', () => {});
// vrControl.controllers[0].addEventListener('selectend', () => {});
/*
const controllerGrip0 = renderer.xr.getControllerGrip(0);
controllerGrip0.add(controllerModelFactory.createControllerModel(controllerGrip0));
controllerGrip0.addEventListener('connected', e => teleportVR.add(0, controllerGrip0, e.data.gamepad));

const controllerGrip1 = renderer.xr.getControllerGrip(1);
controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
controllerGrip1.addEventListener('connected', e => teleportVR.add(1, controllerGrip1, e.data.gamepad));
*/
// Animate
const tick = () => {
    // teleportVR.update();
    controls.update();
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};
tick();
