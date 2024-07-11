// Define global variables for scene, camera, and renderer
let scene, camera, renderer;

// Function to initialize Three.js scene
function init() {
  // Create a scene
  scene = new THREE.Scene();

  // Create a camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Create a WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create an OBJ loader
  const loader = new THREE.OBJLoader();

  // Load the OBJ model
  loader.load(
    '85-cottage_obj/cottage_obj.obj', // Replace with the path to your OBJ file
    function(object) {
      // Add the loaded object to the scene
      scene.add(object);
    },
    function(xhr) {
      // Progress callback (optional)
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(error) {
      // Error callback
      console.error('An error happened', error);
    }
  );

  // Event listener for window resize
  window.addEventListener('resize', onWindowResize);
}

// Function to animate the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Function to handle window resize event
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Call the init function to set up the scene
init();

// Start the animation loop
animate();
