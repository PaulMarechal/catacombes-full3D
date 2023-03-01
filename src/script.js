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
import SnakeImage from "three-mesh-ui/examples/assets/spiny_bush_viper.jpg";

import * as TextPanel from "./textPanel.js";
import * as NameRooms from "./roomInfo.js";

let scene, camera, renderer, controls, vrControl;
let meshContainer, currentMesh;
const objsToTest = [];
let meshes = []

//console.log(NameRooms.roomInfos[0][0])

const geometryTo = new THREE.TorusGeometry( 2, 0.26, 22, 86, 4.5 );
const materialTo = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const torus = new THREE.Mesh( geometryTo, materialTo );

torus.scale.multiplyScalar(0.05);
torus.position.set(0, 1, -1.9);
torus.rotation.set(0, 0, -1.07);



const loadingManager = new THREE.LoadingManager(
        
    // Loaded
    () => {
        console.log("loaded")
		scene.remove(torus)
		// TextPanel.TextPanel(scene, roomNumber)
        scene.children[scene.children.length - 1 ].rotation.y += 0.01;

    }, 

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
		// console.log("progress")
        const progressRatio = itemsLoaded / itemsTotal
        console.log(`${Math.round(progressRatio*100)} %`)
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

// compute mouse position in normalized device coordinates
// (-1 to +1) for both directions.
// Used to raycasting against the interactive elements

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

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.xr.enabled = true;
	document.body.appendChild( VRButton.createButton( renderer ) );
	document.body.appendChild( renderer.domElement );

	// Orbit controls for no-vr

	controls = new OrbitControls( camera, renderer.domElement );
	camera.position.set( 0, 1.6, 0 );
	controls.target = new THREE.Vector3( 0, 1, -1.8 );

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

	//

    gltfLoader.load(
        nameRoom, 
        (gltf) => {
            const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
            gltf.scale = 0.2
            gltf.scene.name = "roomName"
            console.log(gltf);
            gltf.scene.scale.set(0.1, 0.1, 0.1)
            gltf.scene.position.set(-0.5, 1, -2)
            gltf.scene.rotation.y = 0.6
            scene.add(gltf.scene)
			TextPanel.TextPanel(scene, roomNumber)
            console.log("Go! Go! Go!");
        }
    )

	//

	for(let i = 0; i < NameRooms.roomInfos.length; i++){
		meshContainer.add(NameRooms.roomInfos[i][0])
		meshes.push(NameRooms.roomInfos[i][0])
	}

	currentMesh = 0;

	showMesh( currentMesh );
    
    // console.log(currentMesh);
    // console.log("/////////");
    // console.log(meshes);
    // console.log("/////////");

	//////////
	// Panel
	//////////

    console.log(scene);

	makePanel();

	//

	renderer.setAnimationLoop( loop );

}

// Shows the primitive mesh with the passed ID and hide the others

function showMesh( id ) {

	meshes.forEach( ( mesh, i ) => {

		// mesh.visible = i === id ? true : false;
        // mesh.visible = false;
        // init(`https://catacombes.xyz/${nameRoom[id]}/${nameRoom[id]}.glb`)
        
        console.log(i);
        console.log(mesh);

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
		padding: 0.02,
		borderRadius: 0.11
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
		margin: 0.02,
		borderRadius: [0.075, 0, 0, 0.075]
	};

    const buttonOptionMiddle = {
        width: 0.4,
		height: 0.15,
		justifyContent: 'center',
		offset: 0.05,
		margin: 0.02,
		borderRadius: 0
    }

    const buttonOptionsRight = {
        width: 0.4,
		height: 0.15,
		justifyContent: 'center',
		offset: 0.05,
		margin: 0.02,
		borderRadius: [0, 0.075, 0.075, 0]
    }

	// Options for component.setupState().
	// It must contain a 'state' parameter, which you will refer to with component.setState( 'name-of-the-state' ).

	const hoveredStateAttributes = {
		state: 'hovered',
		attributes: {
			offset: 0.035,
			backgroundColor: new THREE.Color( 0x999999 ),
			backgroundOpacity: 1,
			fontColor: new THREE.Color( 0xffffff )
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

	// Buttons creation, with the options objects passed in parameters.

	const buttonPrevious = new ThreeMeshUI.Block( buttonOptionsLeft );
    const show3D = new ThreeMeshUI.Block( buttonOptionMiddle );
	const buttonNext = new ThreeMeshUI.Block( buttonOptionsRight );

	// Add text to buttons

	buttonNext.add(
		new ThreeMeshUI.Text( { content: 'next' } )
	);

    show3D.add(
        new ThreeMeshUI.Text( { content: 'show 3D' } )
    );

	buttonPrevious.add(
		new ThreeMeshUI.Text( { content: 'previous' } )
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
			console.log("scene children");
			console.log(scene)
			for(let i = 0; i < scene.children.length; i++){
				if(scene.children[i].name === "roomName"){
					scene.remove(scene.children[i]);
				} else if(scene.children[i].name === "boxContainer"){
					// console.log(scene.children[i]);
					scene.remove(scene.children[i])
				}
			}
			//console.log(scene.children[9].name === "boxContainer");
			//console.log(scene)
			//if( scene.children[scene.children.length - 1 ].name === "boxContainer" ){ 
				// scene.children[scene.children.length - 2].remove()
			//	console.log("Yoooo la miff")
			//	scene.remove(scene.children[scene.children.length - 1 ].name === "boxContainer")
			//}
			

			//TextPanel.TextPanel(scene, roomNumber)


			showMesh( currentMesh );

            roomNumber += 1; 
            const roomName = room3dRoad(roomNumber)

            console.log(roomName);

            gltfLoader.load(
                roomName, 
                (gltf) => {
                    const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
					// TextPanel.TextPanel(scene, roomNumber)
                    gltf.scale = 0.2
                    gltf.scene.name = "roomName"
                    console.log(gltf);
                    gltf.scene.scale.set(0.1, 0.1, 0.1)
                    gltf.scene.position.set(-0.5, 1, -2)
                    gltf.scene.rotation.y = 0.6
                    scene.add(gltf.scene)
					TextPanel.TextPanel(scene, roomNumber)
                    console.log(`Go! Go! Go! ${roomNumber}`);
                }
            )
            console.log(scene)
		}
	} );
	buttonNext.setupState( hoveredStateAttributes );
	buttonNext.setupState( idleStateAttributes );

	//

    show3D.setupState({
        state: 'selected',
        attributes: selectedAttributes,
        onSet: () => {
            console.log(seeRoomIn3d(roomNumber));
            document.location.href=`https://catacombes.xyz/${seeRoomIn3d(roomNumber)}`;
        }
    });
    show3D.setupState( hoveredStateAttributes );
	show3D.setupState( idleStateAttributes );

	buttonPrevious.setupState( {
		state: 'selected',
		attributes: selectedAttributes,
		onSet: () => {

			currentMesh -= 1;
			if ( currentMesh < 0 ) currentMesh = NameRooms.roomInfos.length;
			showMesh( currentMesh );

		}
	} );
	buttonPrevious.setupState( hoveredStateAttributes );
	buttonPrevious.setupState( idleStateAttributes );

	//

	container.add( buttonNext, show3D, buttonPrevious );
	objsToTest.push( buttonNext, show3D, buttonPrevious );

}

// Handle resizing the viewport

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}

//


function loop() {

	// Don't forget, ThreeMeshUI must be updated manually.
	// This has been introduced in version 3.0.0 in order
	// to improve performance
	ThreeMeshUI.update();

	controls.update();
    // console.log(scene.children[8])

    // if( scene.children[8] && scene.children[scene.children.length - 1 ].name === "roomName" ){ 
	// 	if(torus){
	// 		torus.remove()
	// 	}
    //     scene.children[scene.children.length - 1 ].rotation.y -= 0.01;
    // }

	for(let i = 0; i < scene.children.length; i++){
		if(scene.children[i].name === "roomName"){
			if(torus){
				torus.remove()
			}
			scene.children[i].rotation.y -= 0.01;
		}
	}

	if ( torus ){
		torus.rotation.z -= 0.03;
	}
    
	renderer.render( scene, camera );
    
	updateButtons();
    
}

// Called in the loop, get intersection with either the mouse or the VR controllers,
// then update the buttons states according to result

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

//

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