/**
 * @author umair-ali-bhutto
 * This Creates Cube Custom Image On All Sides
 */

// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Load texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('logo.png');

// Create a material with the loaded texture
const material = new THREE.MeshBasicMaterial({ map: texture });

// Add a simple object (e.g., a cube) with the textured material
const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, material);
scene.background = new THREE.Color(0xffffff);
scene.add(cube);

// Set up camera position
camera.position.z = 5;

// Add OrbitControls to enable dragging
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping (inertia)
controls.dampingFactor = 0.25;
controls.enableZoom = false; // Disable zoom

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Required for damping to work
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



