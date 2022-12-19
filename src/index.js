import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
				controls.minDistance = 2;
				controls.maxDistance = 50;


const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );

scene.background = new THREE.Color( 0x404040 );

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const SuzanneMaterial = new THREE.MeshPhongMaterial( {
						specular: 0x000000,
						map: textureLoader.load('noai.jpg'),
						shininess: 10
					} );


loader.load( 'Suzanne.glb', function ( gltf ) {
  //gltf.material = SuzanneMaterial;
  //gltf.scale.set( 10, 10, 10 );

  scene.add( gltf.scene );
},

  undefined, function ( error ) {
  console.error( error );
} );


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const cube = new THREE.Mesh( geometry, SuzanneMaterial );
scene.add( cube );

camera.position.z = 2;

function animate() {
requestAnimationFrame( animate );

//cube.rotation.x += 0.01;

cube.rotation.y += 0.01;

renderer.render( scene, camera );
};

animate();
