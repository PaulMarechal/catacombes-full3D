import * as THREE from 'three';

import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import ThreeMeshUI from 'three-mesh-ui';
import VRControl from 'three-mesh-ui/examples/utils/VRControl.js';
import ShadowedLight from 'three-mesh-ui/examples/utils/ShadowedLight.js';

import FontJSON from 'three-mesh-ui/examples/assets/Roboto-msdf.json';
import FontImage from 'three-mesh-ui/examples/assets/Roboto-msdf.png';

import * as TextPanel from "./textPanel.js";
import * as NameRooms from "./roomInfo.js";
import * as Language from "./language.js";

let scene, camera, renderer, controls, vrControl;
let meshContainer, currentMesh;
const objsToTest = [];
let meshes = []


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
torus.position.set(0, 1, -1.9);
torus.rotation.set(0, 0, TORUS_ROTATION);

// Blue
const geometryTo2 = new THREE.TorusGeometry( 1.9,TORUS_RADIUS, TORUS_SIDES, TORUS_SEGMENTS, TORUS_ARC );
const materialTo2 = new THREE.MeshBasicMaterial( { color: "#41EAD4" } );
const torus2 = new THREE.Mesh( geometryTo2, materialTo2);

torus2.scale.multiplyScalar(0.04);
torus2.position.set(0, 1, -1.9);
torus2.rotation.set(0.1, 0, TORUS_ROTATION);

// White
const geometryTo3 = new THREE.TorusGeometry( 1.8, TORUS_RADIUS, TORUS_SIDES, TORUS_SEGMENTS, TORUS_ARC );
const materialTo3 = new THREE.MeshBasicMaterial( { color: "#FDFFFC" } );
const torus3 = new THREE.Mesh( geometryTo3, materialTo3 );

torus3.scale.multiplyScalar(0.06);
torus3.position.set(0, 1, -1.92);
torus3.rotation.set(0.15, 0, TORUS_ROTATION);



const loadingManager = new THREE.LoadingManager(
        
    // Loaded
    () => {
        // console.log("loaded")
		scene.remove(torus)
		scene.remove(torus2)
		scene.remove(torus3)
		// TextPanel.TextPanel(scene, roomNumber)
        scene.children[scene.children.length - 1 ].rotation.y -= 0.005;

    }, 

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
		// console.log("progress")
        const progressRatio = itemsLoaded / itemsTotal
        // console.log(`${Math.round(progressRatio*100)} %`)
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
    return `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/${NameRooms.roomInfos[roomNumber][0]}.glb`
}

function seeRoomIn3d(roomNumber){
    return `${NameRooms.roomInfos[roomNumber][0]}`
}
// console.log(room3dRoad(0));



// const room3dRoad = `https://catacombes.xyz/${nameRoom[0]}/${nameRoom[0]}.glb`



window.addEventListener( 'load', init(room3dRoad(0)) );
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

function init(nameRoom) {

	////////////////////////
	//  Basic Three Setup
	////////////////////////

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x505050 );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
		camera.position.set(0, 1.6, 0);
		scene.position.set(0, -0.2, 0);
	} else {
		camera.position.set( 0, 1.3, -0.3 );
	}

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.xr.enabled = true;
	document.body.appendChild( VRButton.createButton( renderer ) );
	document.body.appendChild( renderer.domElement );

	// Orbit controls for no-vr
	controls = new OrbitControls( camera, renderer.domElement );
	controls.target = new THREE.Vector3( 0, 1, -1.8 );
	controls.enableDamping = true
	controls.minDistance = 1; 
	controls.maxDistance = 2;

    controls.maxAzimuthAngle = Math.PI / 6;
    controls.minAzimuthAngle = - Math.PI / 6; 
	controls.maxPolarAngle = 1.5;
	controls.minPolarAngle = Math.PI / 5;

	/////////
	// Room
	/////////
	const room = new THREE.LineSegments(
		new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
		new THREE.LineBasicMaterial( { color: 0x808080 } )
	);

	const roomMesh = new THREE.Mesh(
		new THREE.BoxGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
		new THREE.MeshBasicMaterial( { side: THREE.BackSide } )
	);

	scene.add(torus)
	scene.add(torus2)
	scene.add(torus3)

	scene.add( room );
	objsToTest.push( roomMesh );

	//////////
	// Light
	//////////

	const light = ShadowedLight( {
		z: 10,
		width: 6,
		bias: -0.0001
	} );

	const hemLight = new THREE.HemisphereLight( 0x808080, 0x606060 );

	scene.add( light, hemLight );

	////////////////
	// Controllers
	////////////////

	vrControl = VRControl( renderer, camera, scene );

	scene.add( vrControl.controllerGrips[ 0 ], vrControl.controllers[ 0 ] );

	vrControl.controllers[ 0 ].addEventListener( 'selectstart', () => {

		selectState = true;

	} );
	vrControl.controllers[ 0 ].addEventListener( 'selectend', () => {

		selectState = false;

	} );

	////////////////////
	// Primitive Meshes
	////////////////////

	meshContainer = new THREE.Group();
	meshContainer.position.set( 0, 1, -1.9 );
	scene.add( meshContainer );

    gltfLoader.load(
        nameRoom, 
        (gltf) => {
            const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
            gltf.scale = 0.2
            gltf.scene.name = "roomName"
            gltf.scene.scale.set(0.1, 0.1, 0.1)
            gltf.scene.position.set(-0.5, 1, -2)
            gltf.scene.rotation.y = 0.005
            scene.add(gltf.scene)
			TextPanel.TextPanel(scene, roomNumber)
        }
    )

	function display_all_rooms(nameRoom, imageRoom){
		const display_all_rooms_small = document.querySelector(".display_all_rooms_small")
		const main_div = document.createElement("div"); 
		main_div.classList.add("display_all_rooms_main_div"); 
		const name_room = document.createElement("h3");
		const image_room = document.createElement("img");

		image_room.setAttribute("src", `https://catacombes.xyz/${imageRoom}/${imageRoom}.png`);
		image_room.setAttribute("alt", imageRoom);
		image_room.classList.add('small_image_room_homepage');
		image_room.classList.add(`${imageRoom}_small`)

		name_room.classList.add('small_name_room_homepage');
		name_room.innerHTML = nameRoom;

		main_div.appendChild(image_room);
		main_div.appendChild(name_room);
		display_all_rooms_small.appendChild(main_div);

	}

	//
	for(let i = 0; i < NameRooms.roomInfos.length; i++){
		meshContainer.add(NameRooms.roomInfos[i][0])
		meshes.push(NameRooms.roomInfos[i][0])
		display_all_rooms(NameRooms.roomInfos[i][0], NameRooms.roomInfos[i][0])
	}

	currentMesh = 0;

	showMesh( currentMesh );


	//////////
	// Panel
	//////////

	makePanel();

	renderer.setAnimationLoop( loop );

}

// Shows the primitive mesh with the passed ID and hide the others

function showMesh( id ) {

	meshes.forEach( ( mesh, i ) => {

		// mesh.visible = i === id ? true : false;
        // mesh.visible = false;
        // init(`https://catacombes.xyz/${nameRoom[id]}/${nameRoom[id]}.glb`)
        
        // console.log(i);
        // console.log(mesh);

	} );

}

///////////////////
// UI contruction
///////////////////

function makePanel() {

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
		borderRadius: 0.1, 
		width: 1.39,
	} );

	container.position.set( 0, 0.6, -1.2 );
	container.rotation.x = -0.55;
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

	// Options for component.setupState().
	// It must contain a 'state' parameter, which you will refer to with component.setState( 'name-of-the-state' ).

	// const hoveredStateAttributes = {
	// 	state: 'hovered',
	// 	attributes: {
	// 		offset: 0.035,
	// 		backgroundColor: new THREE.Color( 0x999999 ),
	// 		backgroundOpacity: 1,
	// 		fontColor: new THREE.Color( 0xffffff )
	// 	},
	// };


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


	// function removeHoveredClass(){
	// 	if (document.querySelector(".custom-cursor").classList.contains("custom-cursor--link")) {
	// 		document.querySelector(".custom-cursor").classList.remove("custom-cursor--link");
	// 	}
	// }

	// Buttons creation, with the options objects passed in parameters.

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
		onSet: () => {
            scene.remove( scene.remove(scene.children[scene.children.length - 1 ]) );
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

			showMesh( currentMesh );

			roomNumber += 1; 
			// console.log(roomNumber)

			if(roomNumber >= NameRooms.roomInfos.length){
				roomNumber = 0;
			}

            const roomName = room3dRoad(roomNumber)

            gltfLoader.load(
                roomName, 
                (gltf) => {
                    const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
                    gltf.scale = 0.2
                    gltf.scene.name = "roomName"
                    gltf.scene.scale.set(0.1, 0.1, 0.1)
                    gltf.scene.position.set(-0.5, 1, -2)
                    gltf.scene.rotation.y = 0.005
                    scene.add(gltf.scene)
					TextPanel.TextPanel(scene, roomNumber)
                }
            )
		}
	});

	buttonNext.setupState( hoveredStateAttributes);
	buttonNext.setupState( idleStateAttributes);

    show3D.setupState({
        state: 'selected',
        attributes: selectedAttributes,
        onSet: () => {
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
				// window.location(`https://catacombes.xyz/${seeRoomIn3d(roomNumber)}/AR`, '_blank')
				if (navigator.xr && navigator.xr.isSessionSupported('immersive-vr')) {
					window.location.href = `https://catacombes.xyz/${seeRoomIn3d(roomNumber)}/3D`
				} else {
					window.location.href = `https://catacombes.xyz/${seeRoomIn3d(roomNumber)}/AR`
				  }
			} else {

				console.log(scene.children)
				window.open(`https://catacombes.xyz/${seeRoomIn3d(roomNumber)}/3D`, '_blank')
			}
        }
    });
    show3D.setupState( hoveredStateAttributes );
	show3D.setupState( idleStateAttributes );

	buttonPrevious.setupState( {
		state: 'selected',
		attributes: selectedAttributes,
		onSet: () => {
			scene.remove( scene.remove(scene.children[scene.children.length - 1 ]) );
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

			showMesh( currentMesh );

			if(roomNumber < 1){
				roomNumber = NameRooms.roomInfos.length;
			}
            roomNumber -= 1; 

			const roomName = room3dRoad(roomNumber)
			
			gltfLoader.load(
                roomName, 
                (gltf) => {
                    const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
                    gltf.scale = 0.2
                    gltf.scene.name = "roomName"
                    gltf.scene.scale.set(0.1, 0.1, 0.1)
                    gltf.scene.position.set(-0.5, 1, -2)
                    gltf.scene.rotation.y = 0.005
                    scene.add(gltf.scene)
					TextPanel.TextPanel(scene, roomNumber)
                }
            )
		}
	});
	buttonPrevious.setupState( hoveredStateAttributes );
	buttonPrevious.setupState( idleStateAttributes );

	container.add( buttonNext, show3D, buttonPrevious );
	objsToTest.push( buttonNext, show3D, buttonPrevious );

}

function find_room_number(liste, nomRecherche) {
    for (let i = 0; i < liste.length; i++) {
        const salle = liste[i];
        if (salle[0] === nomRecherche) {
            return i;
        }
    }
    return -1; 
}

function click_on_others_rooms() {
    const display_all_rooms_main_div = document.querySelectorAll(".display_all_rooms_main_div");
	display_all_rooms_main_div[0].classList.add("selected_room_on_list")

    display_all_rooms_main_div.forEach((display) => {

        display.addEventListener("click", (event) => {

			document.querySelector(".selected_room_on_list").classList.remove("selected_room_on_list")

            const image = event.currentTarget.querySelector(".small_image_room_homepage");

            if (image) {
                const alt_value = image.getAttribute("alt");

				console.log(alt_value)

				const class_name_elem = `.${alt_value}_small`


				document.querySelector(class_name_elem).parentNode.classList.add("selected_room_on_list")

				const room_number = find_room_number(NameRooms.roomInfos, alt_value);
				
				roomNumber = room_number;

				scene.remove( scene.remove(scene.children[scene.children.length - 1 ]) );
				console.log(scene)
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

				gltfLoader.load(
					roomName, 
					(gltf) => {
						const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
						gltf.scale = 0.2
						gltf.scene.name = "roomName"
						gltf.scene.scale.set(0.1, 0.1, 0.1)
						gltf.scene.position.set(-0.5, 1, -2)
						gltf.scene.rotation.y = 0.005
						scene.add(gltf.scene)
						TextPanel.TextPanel(scene, room_number)
					}
				)
            }
        });
    });
}

click_on_others_rooms()

function display_all_room_div(){
	const display_all_rooms_small = document.querySelector(".display_all_rooms_small"); 
	const display_all_rooms_button = document.querySelector(".display_all_rooms_button");
	
	let timeoutId;

	display_all_rooms_button.addEventListener("click", () => {
		display_all_rooms_small.style.right = "10px"; 
		display_all_rooms_small.style.opacity = "1"

		display_all_rooms_button.style.right = "-40px"
		display_all_rooms_button.style.opacity = "0"

		display_all_rooms_small.addEventListener("mouseleave", () => {
			timeoutId = setTimeout(() => {
				display_all_rooms_small.style.right = "-180px";
				display_all_rooms_small.style.opacity = "0";
	
				display_all_rooms_button.style.right = "0px";
				display_all_rooms_button.style.opacity = "1";
			}, 4000);
		});
	})


}

display_all_room_div() 

// Handle resizing the viewport
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

removeVRButton()


function loop() {

	// Update manually ThreeeMeshUI.update() -> better performance
	ThreeMeshUI.update();

	controls.update();

	for(let i = 0; i < scene.children.length; i++){
		if(scene.children[i].name === "roomName"){
			if(torus){
				torus.remove()
			}
			scene.children[i].rotation.y -= 0.005;
		}
	}

	if ( torus ){
		torus.rotation.z -= 0.031;
		torus2.rotation.z -= 0.034;
		torus3.rotation.z -= 0.033;
	}
    
	renderer.render( scene, camera );
    
	updateButtons();
    
}

// Called in the loop, get intersection with either the mouse or the VR controllers,
function updateButtons() {

	// Find closest intersecting object
	let intersect;

	if ( renderer.xr.isPresenting ) {

		vrControl.setFromController( 0, raycaster.ray );

		intersect = raycast();

		// Position the little white dot at the end of the controller pointing ray
		if ( intersect ) vrControl.setPointerAt( 0, intersect.point );

	} else if ( mouse.x !== null && mouse.y !== null ) {

		raycaster.setFromCamera( mouse, camera );

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

	// Update non-targeted buttons state
	objsToTest.forEach( ( obj ) => {

		if ( ( !intersect || obj !== intersect.object ) && obj.isUI ) {

			// Component.setState internally call component.set with the options you defined in component.setupState
			obj.setState( 'idle' );

		}

	} );

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
	const vrButton = document.getElementById("VRButton")

	if ('xr' in navigator) {
		// If VR is supported
		navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
			if (!supported) {
				setTimeout(() => {
				  	vrButton.animate(
						{opacity: 0},
						{duration: 3500, fill: 'forwards'}
				  	).onfinish = () => {
						vrButton.style.display = "none";
				  	}
				}, 9000);
			}			
		});
	} else {
		// If webXR is not supported  
		let webxrButton = document.getElementById("WEBXRButton")
		if(webxrButton){
			setTimeout(() => {
				webxrButton.animate(
					{opacity: 0},
					{duration: 1000, fill: 'forwards'}
				).onfinish = () => {
					webxrButton.style.display = "none";
				}
		  	}, 9000);
		}	
	}
}

console.log("Developed with 🍔 by Paul Maréchal")