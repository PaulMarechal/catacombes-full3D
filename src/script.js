import * as THREE from 'three';

import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'; 
import { gsap } from 'gsap'
import TeleportVR from 'teleportvr'

import TWEEN from '@tweenjs/tween.js'
import ThreeMeshUI from 'three-mesh-ui';
import VRControl from 'three-mesh-ui/examples/utils/VRControl.js';
import ShadowedLight from 'three-mesh-ui/examples/utils/ShadowedLight.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

import FontJSON from 'three-mesh-ui/examples/assets/Roboto-msdf.json';
import FontImage from 'three-mesh-ui/examples/assets/Roboto-msdf.png';

import * as TextPanel from "./textPanel.js";
import { roomsParsed } from "./roomInfo.js";
import * as Language from "./language.js";
// import * as XRHand from "./XR_hand.js";

// import GUI from 'lil-gui';

/**
 * Debug
 */
// const gui = new GUI()

let scene, camera, renderer, controls, vrControl, xrRig;
let meshContainer, currentMesh;

const objsToTest = [];
let meshes = []
let tweenFinished = false;

let uiContainer = null;

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const XR_HEIGHT_OFFSET = 0.4; // lower the rig ~40cm in VR

const xrControllers = [null, null];
const xrControllerModelFactory = new XRControllerModelFactory();
const xrGrips = [null, null];

// Global XR ray helper (used by updateButtons)
const _tmpQuat = new THREE.Quaternion();
const _fwd = new THREE.Vector3(0, 0, -1);
function setRayFromController(controller, ray) {
  if (!controller) return false;
  // origin
  controller.getWorldPosition(ray.origin);
  // direction: controller -Z transformed by world rotation
  _tmpQuat.setFromRotationMatrix(controller.matrixWorld);
  ray.direction.copy(_fwd).applyQuaternion(_tmpQuat).normalize();
  return true;
}

// Store desktop (non‑VR) camera transform for restore after VR
const desktopCamPos = new THREE.Vector3();
const desktopCamQuat = new THREE.Quaternion();
const desktopControlsTarget = new THREE.Vector3();

// Loader 3D 
const TORUS_SEGMENTS = 22;
const TORUS_SIDES = 86;
const TORUS_RADIUS = 0.26;
const TORUS_ROTATION = -1.07;
const TORUS_ARC = 4.5;
// Red
const geometryTo = new THREE.TorusGeometry( 2, TORUS_RADIUS, TORUS_SIDES, TORUS_SEGMENTS, TORUS_ARC );
const materialTo = new THREE.MeshBasicMaterial( { color: "#F71735" } );
const torus = new THREE.Mesh( geometryTo, materialTo );

torus.scale.multiplyScalar(0.05);
torus.position.set(-1.8, 1.3, -1.2);

torus.rotation.set(0, -1.8, TORUS_ROTATION);

// Blue
const geometryTo2 = new THREE.TorusGeometry( 1.9,TORUS_RADIUS, TORUS_SIDES, TORUS_SEGMENTS, TORUS_ARC );
const materialTo2 = new THREE.MeshBasicMaterial( { color: "#41EAD4" } );
const torus2 = new THREE.Mesh( geometryTo2, materialTo2);

torus2.scale.multiplyScalar(0.04);
torus2.position.set(-1.8, 1.3, -1.2);
torus2.rotation.set(0.1, -1.8, TORUS_ROTATION);

// White
const geometryTo3 = new THREE.TorusGeometry( 2.1, TORUS_RADIUS, TORUS_SIDES, TORUS_SEGMENTS, TORUS_ARC );
const materialTo3 = new THREE.MeshBasicMaterial( { color: "#FDFFFC" } );
const torus3 = new THREE.Mesh( geometryTo3, materialTo3 );

torus3.scale.multiplyScalar(0.06);
torus3.position.set(-1.8, 1.3, -1.2);
torus3.rotation.set(0.15, -1.8, TORUS_ROTATION);

const loadingManager = new THREE.LoadingManager(
        
    // Loaded
    () => {
		scene.remove(torus)
		scene.remove(torus2)
		scene.remove(torus3)
        scene.children[scene.children.length - 1 ].rotation.y -= 0.005;

    }, 

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal
    }
)

// Texture loader
const textureLoader = new THREE.TextureLoader(loadingManager)

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

var roomNumber = 0


function room3dRoad(roomNumber){
    const title = roomsParsed[roomNumber]?.title || "";
    return `https://catacombes.xyz/${title}/${title}.glb`;
}

function room3dRoad_opt(roomNumber){
    const title = roomsParsed[roomNumber]?.title || "";
    return `https://catacombes.xyz/${title}/${title}_opt.glb`;
}

function seeRoomIn3d(roomNumber){
    return `${roomsParsed[roomNumber]?.title || ""}`;
}

window.addEventListener( 'load', init(room3dRoad(0), room3dRoad_opt(0)) );
window.addEventListener( 'resize', onWindowResize );

// compute mouse position i( normalized device coordinates / raytracing)
// (-1 to +1) for both directions.
const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();
mouse.x = mouse.y = null;

let selectState = false;

window.addEventListener( 'pointermove', ( event ) => {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
} );

window.addEventListener( 'pointerdown', () => {
	selectState = true;
} );

window.addEventListener( 'pointerup', () => {
	selectState = false;
} );

window.addEventListener( 'touchstart', ( event ) => {
	selectState = true;
	mouse.x = ( event.touches[ 0 ].clientX / window.innerWidth ) * 2 - 1;
	mouse.y = -( event.touches[ 0 ].clientY / window.innerHeight ) * 2 + 1;
} );

window.addEventListener( 'touchend', () => {
	selectState = false;
	mouse.x = null;
	mouse.y = null;
} );

//

function init(nameRoom, nameRoom_opt) {
	function getEndCameraPosition() {
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		const isPortrait = window.matchMedia("(orientation: portrait)").matches;

		if (isMobile && isPortrait) {
			return { x: -7.2, y: 1.55, z: -3.95 }; // portrait mobile

		}
		if (isMobile) {
			return { x: -6.2, y: 1.5, z: -3.95 }; // mobile paysage
		}
		return { x: -5.8, y: 1.45, z: -3.95 }; // desktop 
	}

	////////////////////////
	//  Basic Three Setup
	////////////////////////
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x505050 );

	// S'assurer que le meta viewport inclut viewport-fit=cover (utile pour les safe-area iOS)
	(function ensureViewportFitCover(){
		const meta = document.querySelector('meta[name="viewport"]');
		const desired = 'width=device-width, initial-scale=1, viewport-fit=cover';
		if (!meta) {
			const m = document.createElement('meta');
			m.name = 'viewport';
			m.content = desired;
			document.head.appendChild(m);
		} else if (!/viewport-fit=cover/.test(meta.content)) {
			meta.content = meta.content.replace(/\s*$/, '');
			// ajouter si absent
			meta.content += (meta.content ? ', ' : '') + 'viewport-fit=cover';
		}
	})();

	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 100 );
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
		camera.position.set( -0.9, 11, 0 );
		// Position de la scène selon l'orientation (portrait = plus proche)
		if (window.matchMedia("(orientation: portrait)").matches) {
			scene.position.set(0, -0.3, -0.9);
		} else {
			scene.position.set(0, -0.3, -1.6);
		}

		if (window.matchMedia("(orientation: portrait)").matches) {
			// L'appareil est en mode portrait
			const displayMobile = document.querySelector('.displayMobile')
			const close_message_turn_mobile = document.getElementById('close_message_turn_mobile')
			displayMobile.style.display = "block";
			displayMobile.style.position = "absolute";
			displayMobile.style.zIndex = "10";
			displayMobile.style.background = "#ffffff";
			displayMobile.style.padding = "50px 20px";
			displayMobile.style.width = "80%";
			displayMobile.style.fontSize = "6vw";
			displayMobile.style.textAlign = "center";
			displayMobile.style.top = "50%";
			displayMobile.style.left = "50%";
			displayMobile.style.transition = "opacity .3s ease-out";
			displayMobile.style.transform = "translate(-50%, -50%)";

			close_message_turn_mobile.addEventListener('click', ()=>{
				displayMobile.style.opacity = '0'
				setTimeout(() => {
					displayMobile.style.display = 'none'
				}, 3000);
			})

		} else {
			// L'appareil est en mode paysage
			document.querySelector(".displayMobile").style.display = "none";
		}

		window.addEventListener("orientationchange", function() {
			const orientation = window.orientation;
			if (orientation === 0 || orientation === 180) {
				// L'appareil est en mode portrait
				document.querySelector(".displayMobile").style.display = "block";
				document.querySelector(".displayMobile").style.position = "absolute";
				document.querySelector(".displayMobile").style.zIndex = "10";
				document.querySelector(".displayMobile").style.background = "#ffffff";
				document.querySelector(".displayMobile").style.borderRadius = "15px";
				// Après le tween, reculer la caméra en portrait mobile
				if (tweenFinished) {
					const p = getEndCameraPosition();
					camera.position.set(p.x, p.y, p.z);
					// Adapter la position de la scène en portrait
					scene.position.set(0, -0.3, -0.9);
				}
			} else if (orientation === 90 || orientation === -90) {
				// L'appareil est en mode paysage
				document.querySelector(".displayMobile").style.display = "none";
				// Après le tween, adapter la distance en paysage mobile
				if (tweenFinished) {
					const p = getEndCameraPosition();
					camera.position.set(p.x, p.y, p.z);
					// Adapter la position de la scène en paysage
					scene.position.set(0, -0.3, -1.6);
				}
			}
		});

	} else {
		camera.position.set( -4.9, 11, -3.9 );
		camera.rotation.set( -2.78, -1.01, -2.83 );
		scene.position.set(0, -0.3, -1.6)
	}

	// const titleFolder = gui.addFolder('Container')
    // titleFolder.add(camera.position, 'x', -30, 30)
    // titleFolder.add(camera.position, 'y', -30, 30)
    // titleFolder.add(camera.position, 'z', -30, 30)
    // titleFolder.add(camera.rotation, 'x', -30, 30)
    // titleFolder.add(camera.rotation, 'y', -30, 30)c
    // titleFolder.add(camera.rotation, 'z', -30, 30)

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.xr.enabled = true;
	renderer.xr.setReferenceSpaceType('local-floor');
	// Append VR button only if immersive-vr is actually supported and we're in a secure context
	(async () => {
		if (!('xr' in navigator)) return;              // No WebXR API = don't show anything
		if (window.isSecureContext === false) return;  // Needs HTTPS = otherwise bail silently
		try {
			const supported = await navigator.xr.isSessionSupported('immersive-vr');
			if (!supported) return;
			const vrBtn = VRButton.createButton(renderer);
			vrBtn.style.bottom = '75px';
			document.body.appendChild(vrBtn);
		} catch (e) {
			// If the capability check fails, do nothing (no fallback banner)
			console.warn('WebXR capability check failed:', e);
		}
	})();
	document.body.appendChild( renderer.domElement );

	// Orbit controls for no-vr
	controls = new OrbitControls( camera, renderer.domElement );
	controls.target = new THREE.Vector3( 0, 1, -1.8 );
	// Prevent rotation/zoom/pan on mobile during intro tween
	if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		// While the intro tween runs, disable user rotation on mobile
		controls.enableRotate = false;
		controls.enableZoom = false;
		controls.enablePan = false;
	}
	// setInterval(() => {
	// 		controls.enableZoom=false 
	// 		controls.enablePan=false        
	// 		controls.minPolarAngle=Math.PI / 3
	// 		controls.maxPolarAngle=Math.PI / 2
	// 		controls.minAzimuthAngle=-Math.PI / 4
	// 		controls.maxAzimuthAngle=Math.PI / 4
	// }, 300);

	controls.enableDamping = true
	document.addEventListener("DOMContentLoaded", () => {
		setTimeout(() => {
			controls.minDistance = 1; 
			controls.maxDistance = 8;	
		}, 7000);
	});

    // controls.maxAzimuthAngle = Math.PI / 6;
    // controls.minAzimuthAngle = - Math.PI / 6; 
	controls.maxPolarAngle = 1.6;
	controls.minPolarAngle = Math.PI / 6;

	/////////
	// Room
	/////////
	const room = new THREE.LineSegments(
		new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
		new THREE.LineBasicMaterial( { color: 0x808080, transparent: true } )
	);

	const roomMesh = new THREE.Mesh(
		new THREE.BoxGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
		new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true } )
	);

	// scene.add( room );
	objsToTest.push( roomMesh );

	/////////////////////////
	// Loading ( main scene )
	/////////////////////////
	/**
	 * Overlay
	 */
	const overlayGeometryMain = new THREE.PlaneGeometry(2, 2, 1, 1)
	const overlayMaterialMain = new THREE.ShaderMaterial({
		transparent: true,
		uniforms:
		{
			uAlpha: { value: 1 }
		},
		vertexShader: `
			void main()
			{
				gl_Position = vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform float uAlpha;

			void main()
			{
				gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
			}
		`
	})	
	const overlay = new THREE.Mesh(overlayGeometryMain, overlayMaterialMain)
	scene.add(overlay)

	const loadingBarElement = document.querySelector('.loading-bar');
	const loading_bar_percent = document.querySelector('#loading_bar_percent');
	const loader_inside_white = document.getElementById('loader_inside_white');

	let displayed = 0;        // pourcentage affiché (0-100)
	let lastRatio = 0;        // ratio de scale (0-1) déjà appliqué
	let rafId = null;

	function updateUI(percent, ratio) {
	// ne jamais reculer
	const safePercent = Math.max(displayed, percent);
	const safeRatio = Math.max(lastRatio, ratio);

	loading_bar_percent.textContent = `${safePercent} %`;
	loader_inside_white.style.width = `${safePercent}%`;

	displayed = safePercent;
	lastRatio = safeRatio;
	}

	function animateTo(targetPercent, ratio) {
	cancelAnimationFrame(rafId);
	const step = () => {
		if (displayed < targetPercent) {
			// easing simple vers la cible
			const delta = Math.max(1, Math.ceil((targetPercent - displayed) * 0.2));
			updateUI(displayed + delta, ratio);
			rafId = requestAnimationFrame(step);
		} else {
			updateUI(targetPercent, ratio);
		}
	};
	step();
	}

	const loadingManagerMain = new THREE.LoadingManager(
		// Loaded
		() => {
			animateTo(100, 1);

			setTimeout(() => {
				gsap.to(overlayMaterialMain.uniforms.uAlpha, { duration: 3, value: 0, delay: 2 });
				loadingBarElement.classList.add('ended');
				setTimeout(() => {
					scene.remove(overlay);
				}, 400);
				setTimeout(() => {
					loadingBarElement.style.display = "none"
				}, 520);
			}, 600);

			const tween = new TWEEN.Tween(camera.position)
			.to(getEndCameraPosition(), 7000)
			.easing(TWEEN.Easing.Cubic.InOut)
			.onComplete(() => {
				tweenFinished = true;
				// After the tween finishes, face the model and lock the camera on mobile
				const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
				// const modelTarget = new THREE.Vector3(-1.99, 1.05, -1.29); // position of the loaded room
				// camera.lookAt(modelTarget);
				// controls.target.copy(modelTarget);

				if (isMobile) {
					// Completely freeze OrbitControls on mobile
					controls.enabled = false;
				} else {
					// Desktop: keep limited navigation if desired
					controls.minPolarAngle = Math.PI / 3;
					controls.maxPolarAngle = Math.PI / 2;
					controls.minAzimuthAngle = -Math.PI / 1.4;
					controls.maxAzimuthAngle = Math.PI / 0.6;
					controls.enableZoom = false;
					controls.enablePan = false;
					controls.enableRotate = true;
				}
			})
			.start();
		},

		// Progress
		(itemUrl, itemsLoaded, itemsTotal) => {
			const ratio = itemsTotal ? (itemsLoaded / itemsTotal) : 0;

			const targetPercent = Math.floor(Math.min(ratio, 0.95) * 100);

			animateTo(targetPercent, ratio);
		}
	);

	const gltfLoaderMain = new GLTFLoader(loadingManagerMain)
	gltfLoaderMain.setDRACOLoader(dracoLoader)


	/* Background scene */
	gltfLoaderMain.load(
		'https://catacombes.xyz/assets/background_homepage/background_scene_catacombes_opt.glb',
		function ( gltf ) {
			gltf.scene.scale.set(1, 1, 1)
			gltf.scene.position.set(-2, 0, -1.3)
			gltf.scene.rotation.set(0, -0.31, 0)
			gltf.scene.name = "backgroundScene"
			scene.add( gltf.scene );

			// const titleFolder = gui.addFolder('Container')
			// titleFolder.add(scene.position, 'x', -30, 30)
			// titleFolder.add(scene.position, 'y', -30, 30)
			// titleFolder.add(scene.position, 'z', -30, 30)
			// titleFolder.add(scene.rotation, 'x', -30, 30)
			// titleFolder.add(scene.rotation, 'y', -30, 30)
			// titleFolder.add(scene.rotation, 'z', -30, 30)
	
		},
		function ( xhr ) {
			// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		},

		function ( error ) {
			console.log( 'An error happened' + error);
		}
	);

	//////////////
	// Torus light
	//////////////
	const textureLoader = new THREE.TextureLoader();
	const geometry_t = new THREE.TorusGeometry( 1, 0.03, 8, 100 ); 
	const material_t = new THREE.MeshStandardMaterial( { 
		color: 0xffffff,
		emissive: 0xffffff,
		emissiveIntensity: 3,
		emissiveMap: textureLoader.load("https://catacombes.xyz/assets/images/gradient/gradient.jpg"),
    	toneMapped: false,
		transparent: true 
	} ); 

	const torus_l = new THREE.Mesh( geometry_t, material_t ); 
	torus_l.position.set(3, 1.1, 0.27);
	torus_l.rotation.y = 1.27
	scene.add( torus_l );

	//////////////
	// Point light
	//////////////
	const point_light_purple = new THREE.PointLight(0x110c17, 0.5); 
	torus_l.add(point_light_purple);
	point_light_purple.position.set(0, 0, 0.5); 

	/////////////////
	// RectAreaLight ( behind user )
	/////////////////
	const rectAreaLight = new THREE.RectAreaLight(0xffffff, 5, 1, 1)
	rectAreaLight.rotation.y = -1.85
	rectAreaLight.position.set(-3.5, 1.4, -1.7)
	scene.add(rectAreaLight)
	
	///////
	// Fog
	///////
	scene.fog = new THREE.FogExp2( 0x232323, 0.08 );

	////////////////
	// Loading torus
	////////////////
	scene.add(torus)
	scene.add(torus2)
	scene.add(torus3)
	

	////////////////////
	// Primitive Meshes
	////////////////////

	meshContainer = new THREE.Group();
	meshContainer.position.set( 0, 1, -1.9 );

	scene.add( meshContainer );

	function initTextPanel() {
		TextPanel.TextPanel(scene, roomNumber);
	}

    gltfLoader.load(
        nameRoom_opt, 
        (gltf) => {
            const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
            gltf.scale = 0.2
            gltf.scene.name = "roomName"
            gltf.scene.scale.set(0.1, 0.1, 0.1)
            gltf.scene.position.set(-1.99, 1.05, -1.29)
            gltf.scene.rotation.y = 0.005
            scene.add(gltf.scene)
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', initTextPanel, { once: true });
			} else {
				initTextPanel();
			}
        }
    )

	////////////////
	// Controllers
	////////////////


function setupXRControllers() {
  for (let i = 0; i < 2; i++) {
    // Raw target-ray controller (button events originate here)
    const c = renderer.xr.getController(i);
    if (c && xrControllers[i] !== c) {
      xrControllers[i] = c;

      // Visible laser pointer
      let laser = c.getObjectByName('xrLaser');
      if (!laser) {
        const geom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, -1)
        ]);
        const mat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 });
        laser = new THREE.Line(geom, mat);
        laser.name = 'xrLaser';
        laser.frustumCulled = false;
        laser.scale.z = 3; // default length
        c.add(laser);
      }

      // Selection events from trigger
      c.addEventListener('selectstart', () => { selectState = true; });
      c.addEventListener('selectend', () => { selectState = false; });

      // Parent to rig if possible
      if (xrRig) xrRig.add(c); else scene.add(c);
    }

    // Controller grip with a model (visual controller in VR)
    const grip = renderer.xr.getControllerGrip(i);
    if (grip && xrGrips[i] !== grip) {
      xrGrips[i] = grip;
      const model = xrControllerModelFactory.createControllerModel(grip);
      grip.add(model);
      if (xrRig) xrRig.add(grip); else scene.add(grip);
    }
  }
}

// Place the user right in front of the ThreeMeshUI panel when entering VR
const _panelPos = new THREE.Vector3();
const _panelQuat = new THREE.Quaternion();
const _panelFwd = new THREE.Vector3(0, 0, -1);
function placeRigInFrontOfPanel(distance = 0.85) {
  if (!uiContainer || !xrRig) return;

  // Panel world position/orientation
  uiContainer.getWorldPosition(_panelPos);
  uiContainer.getWorldQuaternion(_panelQuat);

  // Panel forward in world space (its +Z)
  const forward = _panelFwd.clone().applyQuaternion(_panelQuat).normalize();

  // Target eye position is a bit in front of the panel, centered
  const target = _panelPos.clone().add(forward.multiplyScalar(distance));

  // Compute yaw so the rig faces the panel
  const toPanel = _panelPos.clone().sub(target);
  const yaw = Math.atan2(toPanel.x, toPanel.z);

  // Initial placement (approx)
  xrRig.position.copy(target);
  xrRig.position.y -= XR_HEIGHT_OFFSET; // keep the slightly-lower eye level you wanted
  xrRig.rotation.set(0, yaw, 0);

  // Refine after WebXR applies the first HMD pose
  const refine = () => {
    const wp = new THREE.Vector3();
    camera.getWorldPosition(wp);
    const delta = target.clone().sub(wp);
    xrRig.position.add(delta);
    xrRig.rotation.set(0, yaw, 0);
  };
  requestAnimationFrame(() => requestAnimationFrame(refine));
}

// --- VR: afficher le panneau de texte ("boxContainer") et l'orienter vers l'utilisateur
const _tmpPanelPos = new THREE.Vector3();
const _tmpCamPos = new THREE.Vector3();
function orientOnlyYawTowardsCamera(obj) {
  if (!obj) return;
  obj.getWorldPosition(_tmpPanelPos);
  camera.getWorldPosition(_tmpCamPos);
  const toCam = _tmpCamPos.clone().sub(_tmpPanelPos);
  const yaw = Math.atan2(toCam.x, toCam.z);
  obj.rotation.set(0, yaw, 0); // on garde le panneau droit (pas d'inclinaison)
}
function showTextPanelInVR() {
  let tries = 0;
  const maxTries = 20; // ~2s
  const tick = () => {
    const panel = scene.getObjectByName('boxContainer');
    if (panel) {
      panel.visible = true;
      orientOnlyYawTowardsCamera(panel);
    } else if (tries < maxTries) {
      tries++;
      setTimeout(tick, 100);
    }
  };
  tick();
}

renderer.xr.addEventListener('sessionstart', () => {
	// Snapshot current desktop camera transform to restore on session end
	desktopCamPos.copy(camera.position);
	desktopCamQuat.copy(camera.quaternion);
	if (controls) desktopControlsTarget.copy(controls.target);

	// Create XR rig if needed and add to scene
	if (!xrRig) {
		xrRig = new THREE.Group();
		xrRig.name = 'xrRig';
		scene.add(xrRig);
	}

	// Use the current desktop camera transform as the XR rig anchor (old behavior)
	xrRig.position.set(0, 0, 0);
	xrRig.rotation.set(0, 0, 0);

	xrRig.add(camera);
	camera.position.set(0, 0, 0);
	camera.quaternion.identity?.();


	// Ensure controller grips/controllers are parented consistently so rays line up
	const grip0 = renderer.xr.getControllerGrip(0);
	const grip1 = renderer.xr.getControllerGrip(1);
	if (grip0 && grip0.parent !== xrRig) xrRig.add(grip0);
	if (grip1 && grip1.parent !== xrRig) xrRig.add(grip1);
	if (vrControl && vrControl.controllers) {
		vrControl.controllers.forEach((c) => { if (c && c.parent !== xrRig) xrRig.add(c); });
	}

	xrRig.position.y -= XR_HEIGHT_OFFSET; // lower the whole rig slightly
	setupXRControllers(); // ensure visible lasers & events

	// Show the 3D UI in VR
	if (uiContainer) uiContainer.visible = true;

	// Start the user right in front of the UI panel, facing it
	placeRigInFrontOfPanel(0.0001);
	// Afficher le panneau de texte de la salle et l'orienter vers l'utilisateur
	showTextPanelInVR();
});

renderer.xr.addEventListener('sessionend', () => {
  if (xrRig) {
    scene.attach(camera);
    if (vrControl && vrControl.controllers) vrControl.controllers.forEach((c) => { if (c) scene.attach(c); });
    if (vrControl && vrControl.controllerGrips) vrControl.controllerGrips.forEach((g) => { if (g) scene.attach(g); });
  }
  // Restore desktop camera pose & controls target
  camera.position.copy(desktopCamPos);
  camera.quaternion.copy(desktopCamQuat);
  camera.updateMatrixWorld(true);
  if (controls) {
    controls.target.copy(desktopControlsTarget);
    controls.update();
  }
  // Hide the 3D UI when leaving VR
  if (uiContainer) uiContainer.visible = !IS_MOBILE;
  for (let i = 0; i < 2; i++) {
    const c = xrControllers[i];
    if (c) {
      const laser = c.getObjectByName('xrLaser');
      if (laser) laser.scale.z = 0; // hide
    }
  }
  for (let i = 0; i < 2; i++) {
    if (xrGrips[i]) scene.attach(xrGrips[i]);
  }
});

	document.addEventListener("DOMContentLoaded", (event) => {        
	  	updateMovement();

	  	// Initialize VRControl once DOM is ready
	  	vrControl = VRControl(renderer, scene);

	  	// Add controllers/grips to scene or xrRig if available, both hands
	  	const addToRigOrScene = (obj) => {
			if (!obj) return;
			if (xrRig) xrRig.add(obj); else scene.add(obj);
		};

		if (vrControl && vrControl.controllerGrips && vrControl.controllers) {
			if (vrControl.controllerGrips[0]) addToRigOrScene(vrControl.controllerGrips[0]);
			if (vrControl.controllerGrips[1]) addToRigOrScene(vrControl.controllerGrips[1]);

			if (vrControl.controllers[0]) {
				addToRigOrScene(vrControl.controllers[0]);
				vrControl.controllers[0].addEventListener('selectstart', () => { selectState = true; });
				vrControl.controllers[0].addEventListener('selectend', () => { selectState = false; });
			}
			if (vrControl.controllers[1]) {
				addToRigOrScene(vrControl.controllers[1]);
				vrControl.controllers[1].addEventListener('selectstart', () => { selectState = true; });
				vrControl.controllers[1].addEventListener('selectend', () => { selectState = false; });
			}
		}
		setupXRControllers(); // also set up pointers outside session to be ready
	});


	//////////
	// Panel
	//////////

	makePanel();

	renderer.setAnimationLoop( loop );

}

function goToNextRoom() {
	scene.add(torus);
	scene.add(torus2);
	scene.add(torus3);

	for(let i = 0; i < scene.children.length; i++){
		if(scene.children[i].name === "roomName"){
			scene.remove(scene.children[i]);
		} else if(scene.children[i].name === "boxContainer"){
			scene.remove(scene.children[i])
		}
	}

	roomNumber += 1; 
	if(roomNumber >= roomsParsed.length){
		roomNumber = 0;
	}

	const roomName = room3dRoad(roomNumber)
	const roomName_opt = room3dRoad_opt(roomNumber)

	gltfLoader.load(
		roomName_opt, 
		(gltf) => {
			const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
			gltf.scale = 0.2
			gltf.scene.name = "roomName"
			gltf.scene.scale.set(0.1, 0.1, 0.1)
			gltf.scene.position.set(-1.99, 1.05, -1.29)
			gltf.scene.rotation.y = 0.005
			scene.add(gltf.scene)
			TextPanel.TextPanel(scene, roomNumber)
		}
	)
}

function goToPrevRoom() {
	scene.add(torus);
	scene.add(torus2);
	scene.add(torus3);

	for(let i = 0; i < scene.children.length; i++){
		if(scene.children[i].name === "roomName"){
			scene.remove(scene.children[i]);
		} else if(scene.children[i].name === "boxContainer"){
			scene.remove(scene.children[i])
		}
	}

	if(roomNumber < 1){
		roomNumber = roomsParsed.length;
	}
	roomNumber -= 1; 

	const roomName = room3dRoad(roomNumber)
	const roomName_opt = room3dRoad_opt(roomNumber)
			
	gltfLoader.load(
		roomName_opt, 
		(gltf) => {
			const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
			gltf.scale = 0.2
			gltf.scene.name = "roomName"
			gltf.scene.scale.set(0.1, 0.1, 0.1)
			gltf.scene.position.set(-1.99, 1.05, -1.29)
			gltf.scene.rotation.y = 0.005
			scene.add(gltf.scene)
			TextPanel.TextPanel(scene, roomNumber)
		}
	)
}

function handleVisit3D() {
	window.location.href = `./3D/?room=${seeRoomIn3d(roomNumber)}`;
}

///////////////////
// UI contruction
///////////////////

function makePanel() {

	// UI HTML sur mobile (fixed en bas) + masquer les boutons 3D
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	if (isMobile) {
		if (!document.getElementById('mobileNavBar')) {
			const bar = document.createElement('div');
			bar.id = 'mobileNavBar';
			bar.style.position = 'fixed';
			bar.style.left = '0';
			bar.style.right = '0';
			bar.style.bottom = '0';
			bar.style.display = 'flex';
			bar.style.justifyContent = 'space-between';
			// bar.style.gap = '5px';
			// bar.style.padding = '12px 16px';
			bar.style.background = 'linear-gradient(to top, rgb(0 0 0 / 39%), rgb(0 0 0 / 0%))';
			bar.style.zIndex = '9999';
			bar.style.padding = '12px 16px';
			bar.style.paddingBottom = 'calc(env(safe-area-inset-bottom, 0px) + 12px)';

			function makeBtn(label) {
				const b = document.createElement('button');
				if (label instanceof HTMLElement || label instanceof SVGElement) {
					b.appendChild(label);
				} else if (typeof label === 'string' && label.trim().startsWith('<')) {
					b.innerHTML = label;
				} else {
					b.textContent = label;
				}
				b.style.display = 'flex';
				b.style.alignItems = 'center';
				b.style.justifyContent = 'center';
				const svg = b.querySelector('svg');
				if (svg) {
					svg.setAttribute('width', '1.9em');
					svg.setAttribute('height', '1.9em');
					if (!svg.getAttribute('fill')) svg.setAttribute('fill', 'currentColor');
				}
				b.style.flex = '1';
				b.style.padding = '6px 14Px';
				const isPortraitNow = window.matchMedia("(orientation: portrait)").matches;
				b.style.fontSize = isPortraitNow ? '3.5vh' : '6.5vh';
				b.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
				// b.style.borderRadius = '10px';
				b.style.border = 'none';
				b.style.cursor = 'pointer';
				b.style.zIndex = '2';
				b.style.background = '#ffffff00';
				b.style.color = '#111';
				// b.style.margin = '8px 0';
				// b.style.border = '1px solid #000'
				// b.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
				return b;
			}

			const prevBtn = makeBtn('<svg  xmlns="http://www.w3.org/2000/svg"  width="60"  height="60"  viewBox="0 0 24 24"  fill="#FFF"  class="icon icon-tabler icons-tabler-filled icon-tabler-caret-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13.883 5.007l.058 -.005h.118l.058 .005l.06 .009l.052 .01l.108 .032l.067 .027l.132 .07l.09 .065l.081 .073l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059v12c0 .852 -.986 1.297 -1.623 .783l-.084 -.076l-6 -6a1 1 0 0 1 -.083 -1.32l.083 -.094l6 -6l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01z" /></svg>');
			const visitBtn = makeBtn('<svg  xmlns="http://www.w3.org/2000/svg"  width="60"  height="60"  viewBox="0 0 24 24"  fill="none"  stroke="#fff"  stroke-width="1"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-cube-3d-sphere"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 17.6l-2 -1.1v-2.5" /><path d="M4 10v-2.5l2 -1.1" /><path d="M10 4.1l2 -1.1l2 1.1" /><path d="M18 6.4l2 1.1v2.5" /><path d="M20 14v2.5l-2 1.12" /><path d="M14 19.9l-2 1.1l-2 -1.1" /><path d="M12 12l2 -1.1" /><path d="M18 8.6l2 -1.1" /><path d="M12 12l0 2.5" /><path d="M12 18.5l0 2.5" /><path d="M12 12l-2 -1.12" /><path d="M6 8.6l-2 -1.1" /></svg>');
			const nextBtn = makeBtn('<svg  xmlns="http://www.w3.org/2000/svg"  width="60"  height="60"  viewBox="0 0 24 24"  fill="#FFF"  class="icon icon-tabler icons-tabler-filled icon-tabler-caret-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057l-.002 -12.059z" /></svg>');

			prevBtn.setAttribute('aria-label', 'précédent');
			visitBtn.setAttribute('aria-label', 'visiter');
			nextBtn.setAttribute('aria-label', 'suivant');

			prevBtn.id = 'mobilePrevBtn';
			visitBtn.id = 'mobileVisitBtn';
			nextBtn.id = 'mobileNextBtn';

			function updateMobileBarTypography() {
				const isPortrait = window.matchMedia("(orientation: portrait)").matches;
				const size = isPortrait ? '3.5vh' : '6.5vh';
				const btns = [prevBtn, visitBtn, nextBtn];
				btns.forEach(b => { if (b) b.style.fontSize = size; });
			}

			updateMobileBarTypography();
			window.addEventListener('orientationchange', updateMobileBarTypography);

			// prevBtn.style.borderRadius = '10px 4px 4px 10px';
			// visitBtn.style.borderRadius = '4px';
			// nextBtn.style.borderRadius = '4px 10px 10px 4px';

			prevBtn.addEventListener('click', goToPrevRoom);
			visitBtn.addEventListener('click', handleVisit3D);
			nextBtn.addEventListener('click', goToNextRoom);

			bar.appendChild(prevBtn);
			bar.appendChild(visitBtn);
			bar.appendChild(nextBtn);
			document.body.appendChild(bar);

			function updateBarBottomOffset() {
				const vv = window.visualViewport;
				let extra = 0;
				if (vv) {
					const occupiedBottom = (window.innerHeight - (vv.height + vv.offsetTop));
					extra = Math.max(0, Math.round(occupiedBottom));
				}
				bar.style.bottom = (extra > 0 ? extra + 'px' : '0');
			}
			updateBarBottomOffset();

			if (window.visualViewport) {
				window.visualViewport.addEventListener('resize', updateBarBottomOffset);
				window.visualViewport.addEventListener('scroll', updateBarBottomOffset);
			}
			window.addEventListener('orientationchange', updateBarBottomOffset);
			window.addEventListener('resize', updateBarBottomOffset);

			const blurOverlay = document.createElement('div');
			blurOverlay.id = 'mobileNavBarBlur';
			blurOverlay.style.position = 'absolute';
			blurOverlay.style.inset = '0';
			blurOverlay.style.pointerEvents = 'none';
			blurOverlay.style.backdropFilter = 'blur(10px)';
			blurOverlay.style.webkitBackdropFilter = 'blur(10px)';
			blurOverlay.style.maskImage = 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,1) 100%)';
			blurOverlay.style.webkitMaskImage = 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,1) 100%)';
			blurOverlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0))';
			bar.appendChild(blurOverlay);
		}
		// (Removed early return so 3D UI is always created)
	}

	// Container block, in which we put the two buttons.
	// We don't define width and height, it will be set automatically from the children's dimensions
	// Note that we set contentDirection: "row-reverse", in order to orient the buttons horizontally

	const container = new ThreeMeshUI.Block( {
		justifyContent: 'center',
		contentDirection: 'row-reverse',
		fontFamily: FontJSON,
		fontTexture: FontImage,
		fontSize: 0.07,
		padding: 0.01,
		borderRadius: 0.09, 
		width: 1.37,
	} );

	// Keep a global reference and hide by default (shown when VR session starts)
	uiContainer = container;
	uiContainer.visible = !IS_MOBILE;

	container.position.set( -3, 0.79, -1.6 );
	container.rotation.y = -1.87;

	scene.add( container );

	// BUTTONS
	// We start by creating objects containing options that we will use with the two buttons,
	// in order to write less code.
	const buttonOptionsLeft = {
		width: 0.4,
		height: 0.15,
		justifyContent: 'center',
		offset: 0.05,
		margin: 0.005,
		borderRadius: [0.075, 0.015, 0.015, 0.075]
	};

    const buttonOptionMiddle = {
        width: 0.5,
		height: 0.15,
		justifyContent: 'center',
		offset: 0.05,
		margin: 0.005,
		borderRadius: 0.015
    }

    const buttonOptionsRight = {
        width: 0.4,
		height: 0.15,
		justifyContent: 'center',
		offset: 0.05,
		margin: 0.005,
		borderRadius: [0.015, 0.075, 0.075, 0.015]
    }

	const hoveredStateAttributes = {
		state: 'hovered',
		attributes: {
			offset: 0.035,
			backgroundColor: new THREE.Color(0x999999),
			backgroundOpacity: 1,
			fontColor: new THREE.Color(0xffffff),
		},
	};

	const idleStateAttributes = {
		state: 'idle',
		attributes: {
			offset: 0.035,
			backgroundColor: new THREE.Color( 0x666666 ),
			backgroundOpacity: 0.3,
			fontColor: new THREE.Color( 0xffffff )
		},
	};

	const idleStateCursorAttributes = document.querySelector(".custom-cursor").classList.remove("custom-cursor--link");

	const buttonPrevious = new ThreeMeshUI.Block( buttonOptionsLeft );
    const show3D = new ThreeMeshUI.Block( buttonOptionMiddle );
	const buttonNext = new ThreeMeshUI.Block( buttonOptionsRight );

	// Add text to buttons
	buttonNext.add(
		new ThreeMeshUI.Text( { content: 'suivant' } )
	);

    show3D.add(
        new ThreeMeshUI.Text( { content: 'Visiter en 3D' } )
    );

	buttonPrevious.add(
		new ThreeMeshUI.Text( { content: 'precedent' } )
	);

	// Create states for the buttons.
	// In the loop, we will call component.setState( 'state-name' ) when mouse hover or click

	const selectedAttributes = {
		offset: 0.02,
		backgroundColor: new THREE.Color( 0x777777 ),
		fontColor: new THREE.Color( 0x222222 )
	};

	buttonNext.setupState( {
		state: 'selected',
		attributes: selectedAttributes,
		onSet: () => { goToNextRoom(); }
	});

	buttonNext.setupState( hoveredStateAttributes);
	buttonNext.setupState( idleStateAttributes);

    show3D.setupState({
        state: 'selected',
        attributes: selectedAttributes,
        onSet: () => { handleVisit3D(); }
    });
    show3D.setupState( hoveredStateAttributes );
	show3D.setupState( idleStateAttributes );

	buttonPrevious.setupState( {
		state: 'selected',
		attributes: selectedAttributes,
		onSet: () => { goToPrevRoom(); }
	});
	buttonPrevious.setupState( hoveredStateAttributes );
	buttonPrevious.setupState( idleStateAttributes );

	container.add( buttonNext, show3D, buttonPrevious );
	objsToTest.push( buttonNext, show3D, buttonPrevious );

}

function find_room_number(liste, nomRecherche) {
    for (let i = 0; i < liste.length; i++) {
        const salle = liste[i];
        if ((salle && (salle.title || salle[0])) === nomRecherche) {
            return i;
        }
    }
    return -1;
}

function click_on_others_rooms() {
    const display_all_rooms_main_div = document.querySelectorAll(".display_all_rooms_main_div");

    display_all_rooms_main_div.forEach((display) => {

        display.addEventListener("click", (event) => {

            const previouslySelected = document.querySelector(".selected_room_on_list");
            if (previouslySelected) {
                previouslySelected.classList.remove("selected_room_on_list");
            }

            const image = event.currentTarget.querySelector(".small_image_room_homepage");

            if (image) {
                const alt_value = image.getAttribute("alt");

				// (alt_value)
				const class_name_elem = `.${alt_value}_small`

				// console.log(class_name_elem)
				document.querySelector(class_name_elem).parentNode.classList.add("selected_room_on_list")

				const room_number = find_room_number(roomsParsed, alt_value);
				
				roomNumber = room_number;

				scene.add(torus);
				scene.add(torus2);
				scene.add(torus3);

				for(let i = 0; i < scene.children.length; i++){
					if(scene.children[i].name === "roomName"){
						scene.remove(scene.children[i]);
					} else if(scene.children[i].name === "boxContainer"){
						scene.remove(scene.children[i])
					}
				}

				const roomName = room3dRoad(room_number)
				const roomName_opt = room3dRoad_opt(room_number)

				gltfLoader.load(
					roomName_opt, 
					(gltf) => {
						const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
						gltf.scale = 0.2
						gltf.scene.name = "roomName"
						gltf.scene.scale.set(0.1, 0.1, 0.1)
						gltf.scene.position.set(-1.99, 1.05, -1.29)
						gltf.scene.rotation.y = 0.005
						scene.add(gltf.scene)
						
						TextPanel.TextPanel(scene, room_number)
					}
				)
            }
        });
    });
}

// click_on_others_rooms()

// Handle resizing the viewport
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

removeVRButton()

/* Effet neon */
const composer = new EffectComposer(renderer);
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.35, 
    0.0,
    1.0
);
const outputPass = new OutputPass();
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(outputPass);


let isInVR = false; 
function toggleNeonEffect(inVR) {
    if (inVR) {
        composer.passes = [];
    } else {
        composer.addPass(renderScene);
        composer.addPass(bloomPass);
        composer.addPass(outputPass);
    }
}

function updateFog(time) {
    let gradient = Math.sin(time * 0.05); 
    let colorValue = Math.abs(gradient); 
    let color = new THREE.Color(colorValue, colorValue, colorValue); 

    let minDensity = 0.01;

    let density = 0.04 + Math.sin(time * 0.025) * 0.02; 

    density = Math.max(density, minDensity);

    scene.fog.color.copy(color);
    scene.fog.density = density;
}

// Movement with joystick ( oculus )
function updateMovement() {
	const controllers = [];
    controllers.forEach((controller) => {
        const gamepad = controller.inputSource.gamepad;
        if (gamepad && gamepad.axes.length > 2) {
            const xAxis = gamepad.axes[2]; // Joystick horizontal
            const yAxis = gamepad.axes[3]; // Joystick vertical

            const speed = 0.1;
            camera.position.x -= xAxis * speed;
            camera.position.z -= yAxis * speed;
        }
    });
}

function loop() {

	controls.update();

	let time = performance.now() * 0.001;
	
	updateFog(time);

	TWEEN.update();

	for(let i = 0; i < scene.children.length; i++){
		if(scene.children[i].name === "roomName"){
			if(torus){
				torus.remove()
			}
			scene.children[i].rotation.y -= 0.005;
		}
	}


	if ( torus ){
		torus.rotation.z -= 0.030;
		torus2.rotation.z -= 0.033;
		torus3.rotation.z -= 0.036;
	}


	if ('xr' in navigator) { 

        navigator.xr.isSessionSupported('immersive-vr').then(function (supported) {
            if (supported) {
                if (!isInVR) {
                    isInVR = true;
                    toggleNeonEffect(true); 
                }
            } else {
                if (isInVR) {
                    isInVR = false;
                    toggleNeonEffect(false); 
                }
            }
        }).catch(function (error) {
            console.error("Erreur WebXR : ", error);
        });
	}
    
	renderer.render( scene, camera );
	
	updateButtons();

	// Update manually ThreeeMeshUI.update() -> better performance
	ThreeMeshUI.update();
	
	composer.render();
    
}

// Called in the loop, get intersection with either the mouse or the VR controllers,
function updateButtons() {

  // Find closest intersecting object
  let intersect;

  if ( renderer.xr.isPresenting ) {
    let hit = null;

    // Try ThreeMeshUI VRControl (if available)
    if (vrControl && typeof vrControl.setFromController === 'function') {
      vrControl.setFromController(0, raycaster.ray);
      hit = raycast();
      if (!hit) {
        vrControl.setFromController(1, raycaster.ray);
        hit = raycast();
        if (hit && typeof vrControl.setPointerAt === 'function') vrControl.setPointerAt(1, hit.point);
      } else if (typeof vrControl.setPointerAt === 'function') {
        vrControl.setPointerAt(0, hit.point);
      }
    }

    // Fallback: derive rays directly from WebXR controllers (matrixWorld)
    if (!hit) {
      for (let i = 0; i < 2; i++) {
        const c = xrControllers[i];
        if (!c) continue;
        if (!setRayFromController(c, raycaster.ray)) continue;
        const maybe = raycast();
        const laser = c.getObjectByName('xrLaser');
        if (laser) laser.scale.z = maybe ? maybe.distance : 3;
        if (maybe) { hit = maybe; break; }
      }
    }

    intersect = hit;
  } else if ( mouse.x !== null && mouse.y !== null ) {
    raycaster.setFromCamera(mouse, camera);
    intersect = raycast();
  }

  // Update targeted button state (if any)
  if ( intersect && intersect.object.isUI ) {
    if ( selectState ) {
      // Component.setState internally call component.set with the options you defined in component.setupState
      intersect.object.setState( 'selected' );
    } else {
      // Component.setState internally call component.set with the options you defined in component.setupState
      intersect.object.setState( 'hovered' );
    }
  }

  objsToTest.forEach( ( obj ) => {
    if ( ( !intersect || obj !== intersect.object ) && obj.isUI ) {
      // Component.setState internally call component.set with the options you defined in component.setupState
      obj.setState( 'idle' );
    }
  });

  if (!intersect && renderer.xr.isPresenting) {
    for (let i = 0; i < 2; i++) {
      const c = xrControllers[i];
      if (!c) continue;
      const laser = c.getObjectByName('xrLaser');
      if (laser) laser.scale.z = 3;
    }
  }
}

function raycast() {

	return objsToTest.reduce( ( closestIntersection, obj ) => {

		const intersection = raycaster.intersectObject( obj, true );

		if ( !intersection[ 0 ] ) return closestIntersection;
		if ( !closestIntersection || intersection[ 0 ].distance < closestIntersection.distance ) {
			intersection[ 0 ].object = obj;
			return intersection[ 0 ];
		}
		return closestIntersection;
	}, null );

}


function removeVRButton(){
  const vrButton = document.getElementById('VRButton');
  if (!vrButton) return;

  if ('xr' in navigator) {
    navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
      if (!supported) {
        setTimeout(() => {
          vrButton.animate(
            { opacity: 0 },
            { duration: 3500, fill: 'forwards' }
          ).onfinish = () => {
            vrButton.style.display = 'none';
          };
        }, 9000);
      }
    }).catch(() => {/* ignore */});
  }
}

console.log("Developed with 🍔 by Paul Maréchal")