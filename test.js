/**
 * @author umair-ali-bhutto
 *
 * This code creates a 3D scene using the Three.js library, featuring a rotating Tractor model.
 * It also includes a color palette that allows users to change the Tractor's materials by clicking on different colors.
 * Additionally, clicking on a color causes the camera to animate and zoom in, enhancing the user's interaction with the model.
 * 
 * Key Features:
 * 1. **Scene Setup**: Initializes the Three.js scene, camera, and renderer.
 * 2. **Model Loading**: Loads a 3D Tractor model in GLTF format and adds it to the scene.
 * 3. **Material Management**: Manages the materials of the Tractor model to avoid duplicates and supports dynamic material changes.
 * 4. **Environment Map**: Loads an HDR environment map to enhance the scene's lighting and reflections.
 * 5. **Color Palette**: Generates a set of color options that users can click to change the Tractor's color.
 * 6. **Camera Animation**: Animates the camera position when a color is selected, providing a zoom-in effect.
 * 7. **Responsive Design**: Adjusts the camera and renderer settings when the window is resized to maintain the correct aspect ratio.
 * 
 * Libraries and Tools:
 * - **Three.js**: For creating and displaying animated 3D graphics.
 * - **OrbitControls**: For enabling user-controlled camera movements.
 * - **RGBELoader**: For loading HDR environment maps.
 * - **GLTFLoader**: For loading GLTF models.
 * - **Anime.js**: For smooth animations of the camera.
 * 
 * The code is structured to be modular and easy to extend, allowing for additional features such as more complex animations, additional models, or interactive elements.
 */


import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/GLTFLoader.js';

// Define an array of colors with their names
const colors = [
    { color: '#000000', name: 'Black' },
    { color: 'rgb(255,0,0)', name: 'Red' },
    { color: '#ffffff', name: 'White' }
];

// Function to create color items and append them to the specified element
function createcolors(array, appendto) {
    array.forEach(function (el) {
        const coloritem = document.createElement('div');
        coloritem.classList.add('color-item');
        coloritem.style.background = el.color;
        coloritem.title = el.name;
        appendto.appendChild(coloritem);
    });
}

// Call the createcolors function to create color items in the '.colors-container' element
createcolors(colors, document.querySelector('.colors-container'));

var themes = {};

// Function to load themes from 'themes.json'
function loadThemes() {
    const path = 'themes.json';
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => { themes = data; })
        .catch(error => { console.error('There was a problem with the fetch operation:', error); });
}

// Call the loadThemes function to load themes
loadThemes();

// Create a new scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');
scene.fog = new THREE.Fog(0xffffff, 0.015, 100);

// Create a camera with perspective view
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a WebGL renderer with antialiasing
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.7;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// Adjust camera and renderer size on window resize
window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Create a plane geometry and add it to the scene
const geometry = new THREE.PlaneGeometry(1000, 1000);
const material = new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide, wireframe: false });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
plane.position.y = -4;
plane.rotation.x = Math.PI / 2;

// Create orbit controls for the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 10;
controls.minDistance = 1;
controls.enableDamping = true;
controls.dampingFactor = 0.035;
controls.maxPolarAngle = Math.PI / 1.7;

const modelMaterials = [];
const materials = [];

// Function to load materials if they are not duplicates
function loadNonDuplicateMaterials(material) {
    if (!materials.includes(material.name)) {
        modelMaterials.push(material);
        materials.push(material.name);
    }
}

// Load the GLTF model
const loader = new GLTFLoader();
loader.load('bulldozers_2020_05_asm.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(0, 0, -1);

    // Traverse the model and load non-duplicate materials based on their names
    model.traverse((child) => {
        if (child.isMesh) {
            switch (child.material.name) {
                case 'acadf662e623': // Window
                case 'm8_73e324d3_bd1ede84': // Handle
                case 'm4_73e324d3_bd1ede84': // Bucket
                case 'm5_73e324d3_bd1ede84': // Hydraulic
                case 'm7_73e324d3_bd1ede84': // Seat and Mirror
                case 'm2_73e324d3_bd1ede84': // Body
                case 'm1_73e324d3_bd1ede84': // Rims
                    loadNonDuplicateMaterials(child.material);
                    break;
                default:
                    break;
            }
        }
    });
});

// Load the HDR environment map
new RGBELoader().load('studio.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});

// Get a random coordinate between min and max values
const min = -3;
const max = 3;
function getRandomCoordinate(min, max) {
    return Math.random() * (max - min) + min;
}

let clickCounter = 0;

// Get a number with alternating sign based on the click counter
function getAlternatingSignedNumber(value) {
    const sign = Math.floor(clickCounter / 10) % 2 === 0 ? 1 : -1;
    return value * sign;
}

// Add click event listeners to the color items
document.querySelectorAll('.color-item').forEach(function (el, i) {
    document.querySelectorAll('.color-item')[i].addEventListener('click', (e) => {
        clickCounter++;

        var theme = themes[e.target.title];

        // Change the material colors based on the selected theme or color
        modelMaterials.forEach(function (material) {
            if(theme != undefined){
                material.color.set(new THREE.Color(theme[convertMaterialNameToEnglish(material.name)]))
            }
        });

        // Animate the camera position on color item click
        anime({
            targets: camera.position,
            x: getRandomCoordinate(min, max),
            y: getRandomCoordinate(min, max),
            z: getAlternatingSignedNumber(5),
            delay: 10,
            duration: 500,
            easing: 'easeInOutCubic'
        });
    });
});

// Set the initial camera position
camera.position.z = 5;

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Convert material name to English for the theme lookup
function convertMaterialNameToEnglish(materialName) {
    let englishName = '';
    switch (materialName) {
        case 'acadf662e623': // Window
            englishName = 'window';
            break;
        case 'm8_73e324d3_bd1ede84': // Handle
            englishName = 'handle';
            break;
        case 'm4_73e324d3_bd1ede84': // Bucket
            englishName = 'bucket';
            break;
        case 'm5_73e324d3_bd1ede84': // Hydraulic
            englishName = 'hydraulic';
            break;
        case 'm7_73e324d3_bd1ede84': // Seat and Mirror
            englishName = 'seat_and_mirror';
            break;
        case 'm2_73e324d3_bd1ede84': // Body
            englishName = 'body';
            break;
        case 'm1_73e324d3_bd1ede84': // Rims
            englishName = 'rims';
            break;
        default:
            break;
    }
    return englishName;
}

/**
 * @copyright
 * 
 * 
     :::    :::   :::   :::       :::     ::::::::::: ::::::::: 
    :+:    :+:  :+:+: :+:+:    :+: :+:       :+:     :+:    :+: 
   +:+    +:+ +:+ +:+:+ +:+  +:+   +:+      +:+     +:+    +:+  
  +#+    +:+ +#+  +:+  +#+ +#++:++#++:     +#+     +#++:++#:    
 +#+    +#+ +#+       +#+ +#+     +#+     +#+     +#+    +#+    
#+#    #+# #+#       #+# #+#     #+#     #+#     #+#    #+#     
########  ###       ### ###     ### ########### ###    ###      

 * 
 * 
 */