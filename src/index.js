import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';//bloom

//import { HDRCubeTextureLoader } from 'three/addons/loaders/HDRCubeTextureLoader.js';//hdr
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );

//renderer.toneMapping = THREE.ReinhardToneMapping;
//renderer.outputEncoding = THREE.sRGBEncoding;

renderer.toneMappingExposure =1;

document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
				controls.minDistance = 2;
				controls.maxDistance = 50;

//hdr
const loaderHdr = new RGBELoader();
//loaderHdr.setDataType( THREE.UnsignedByteType );
loaderHdr.load(
  // URL of the HDR cubemap texture
  'kloppenheim_02_puresky_2k.hdr', function (texture){

                texture.mapping = THREE.EquirectangularReflectionMapping;
                //var envMap = pmremGenerator.fromEquirectangular(texture).texture;
                scene.background = texture;
                scene.enviroment = texture;


								renderer.render( scene, camera );

  }
);

//UnrealBloomPass
const params = {
				exposure: 1.0,
				bloomStrength: 0.3,
				bloomThreshold: 0.98,
				bloomRadius: 0.29
			};

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
				bloomPass.threshold = params.bloomThreshold;
				bloomPass.strength = params.bloomStrength;
				bloomPass.radius = params.bloomRadius;

const renderScene = new RenderPass( scene, camera );

const composer = new EffectComposer( renderer );
				composer.addPass( renderScene );
				composer.addPass( bloomPass );


//enw

//light
const pointLight = new THREE.PointLight( 0xffffff, 1 );
camera.add( pointLight );

// const ambientLight = new THREE.AmbientLight( 0x90a0fc, 0.6);
// scene.add( ambientLight );

const directionalLight1 = new THREE.DirectionalLight( 0xFFF0ED, 1.5 );
directionalLight1.position.set(2,2,0);
scene.add( directionalLight1 );

const directionalLight2 = new THREE.DirectionalLight( 0x64a4ff, 1 );
directionalLight2.position.set(-2, 5, 0);
scene.add( directionalLight2 );



//material
const textureLoaderNoAi = new THREE.TextureLoader();
const SuzanneMaterial = new THREE.MeshStandardMaterial( {
						metalness: 0.5,
						roughness: 0.5,
						map: textureLoaderNoAi.load('noai.jpg'),
						//emissive : 0xff0000



					} );

const gui = new dat.GUI();

const options = {
	"nissan_gtr_body": 0x1649cc
};

//Import model
const loader = new GLTFLoader();
loader.load( 'untitled.glb', function ( gltf, maretials) {
  //gltf.material = SuzanneMaterial;
  //gltf.scale.set( 10, 10, 10 );
	const model = gltf.scene;
  scene.add( model);
	console.log(model.getObjectByName("nissan_gtr_body_doar"));

	gui.addColor(options, "nissan_gtr_body").onChange(function(e) {
		model.getObjectByName("nissan_gtr_body_doar").material.color.setHex(e);
	});

model.getObjectByName("nissan_gtr_body_doar").material.metalness = 1;
model.getObjectByName("nissan_gtr_body_doar").material.roughness = 0.6;
},

  undefined, function ( error ) {
  console.error( error );
});

//bloom GUI
gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

					renderer.toneMappingExposure = Math.pow( value, 4.0 );

				} );

				gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

					bloomPass.threshold = Number( value );

				} );

				gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {

					bloomPass.strength = Number( value );

				} );

				gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

					bloomPass.radius = Number( value );

				} );

//add box
const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const cube = new THREE.Mesh( geometry, SuzanneMaterial );
scene.add( cube );

//add plane
// const geometry2 = new THREE.PlaneGeometry( 5, 5);
// const plane = new THREE.Mesh( geometry2 );
// scene.add( plane );
// plane.position.xyz = ( 0, 0, 0 );
// plane.rotation.z = 350;

cube.position.y = 2;
camera.position.z = 5;


function animate() {
requestAnimationFrame( animate );

//cube.rotation.x += 0.01;
cube.rotation.y += 0.01;

renderer.render( scene, camera );
composer.render();
};

animate();
