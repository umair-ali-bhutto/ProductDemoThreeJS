/**
 * @author umair-ali-bhutto
 *
 * This code creates a 3D scene with a rotating iPhone model and a color palette. 
 * When a color is clicked, the iPhone's materials change to that color, and the camera zooms in.
 * 
 */


import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/GLTFLoader.js';


const colorapi = [
    { color: '#000000', name: 'Black' },
    { color: '#ffffff', name: 'White' },
    { color: '#f700ff', name: 'Pink' },
]

function createcolors(array, appendto) {
    array.forEach(function (el, i) {
        console.log(el.color)
        const coloritem = document.createElement('div');
        coloritem.classList.add('color-item');
        coloritem.style.background = el.color;
        coloritem.title = el.name;
        appendto.appendChild(coloritem)
    })
}

createcolors(colorapi, document.querySelector('.colors-container'))

const scene = new THREE.Scene();
scene.background = new THREE.Color('white')
scene.fog = new THREE.Fog(0xffffff, 0.015, 100);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.7;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


const geometry = new THREE.PlaneGeometry(1000, 1000);
const material = new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide, wireframe: false });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
plane.position.y = -4;
plane.rotation.x = Math.PI / 2

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 8;
controls.minDistance = 2;
controls.enableDamping = true;
controls.dampingFactor = 0.035
controls.maxPolarAngle = Math.PI / 1.7

const modelMaterials = [];

const loader = new GLTFLoader();
loader.load('bulldozers_2020_05_asm.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(0, 0, 0);



    model.traverse((child) => {

        // Khidki
        if (child.isMesh && child.material.name == 'acadf662e623') {
            modelMaterials.push(child.material)
        }
        
        // Handle
        if (child.isMesh && child.material.name == 'm8_73e324d3_bd1ede84') {
            modelMaterials.push(child.material)
        }
        
        // Kachra Picker
        if (child.isMesh && child.material.name == 'm4_73e324d3_bd1ede84') {
            modelMaterials.push(child.material)
        }
        // Hydraulic
        if (child.isMesh && child.material.name == 'm5_73e324d3_bd1ede84') {
            modelMaterials.push(child.material)
        }
        // Seat and Mirror
        if (child.isMesh && child.material.name == 'm7_73e324d3_bd1ede84') {
            modelMaterials.push(child.material)
        }
        // Body
        if (child.isMesh && child.material.name == 'm2_73e324d3_bd1ede84') {
            modelMaterials.push(child.material)
        }
        // Rims
        if (child.isMesh && child.material.name == 'm1_73e324d3_bd1ede84') {
            modelMaterials.push(child.material)
        }


    })

})

new RGBELoader().load('https://assets.codepen.io/7014830/studio.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = texture;
})

window.addEventListener('dblclick', () => {
    console.log(camera.position)
})



const min = -2;
const max = 2;

function getRandomCoordinate(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomSignedNumber(number) {
    const sign = Math.random() < 0.5 ? -1 : 1;
    return number * sign;
}

let clickCounter = 0;

function getAlternatingSignedNumber(value) {
    const sign = Math.floor(clickCounter / 4) % 2 === 0 ? 1 : -1;
    return value * sign;
}



document.querySelectorAll('.color-item').forEach(function (el, i) {
    document.querySelectorAll('.color-item')[i].addEventListener('click', (e) => {

        clickCounter++;

        modelMaterials.forEach(function (material, i) {
            material.color.set(new THREE.Color(e.target.style.background))

            anime({
                targets: camera.position,
                //z: [camera.position.z, 3.95],
                
                x: getRandomCoordinate(min, max),
                y: getRandomCoordinate(min, max),
                z: getAlternatingSignedNumber(5),
                
                //x: [camera.position.x, getRandomCoordinate(min, max)],
                //y: [camera.position.y, getRandomCoordinate(min, max)],
                delay: 10,
                duration: 1000,
                easing: 'easeInOutCubic'
            })


        })


    })
})


camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
};

animate();