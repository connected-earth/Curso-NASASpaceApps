
// Cria a cena 3D
const scene = new THREE.Scene();

// Cria a Camera 
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near_plane = 0.1;
const far_plane = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near_plane, far_plane);
camera.position.z = 4;

// Cria o Renderizador 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.earth-render').appendChild(renderer.domElement);

// Cria Controle 
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.enablePan = false;

// Cria Texturas
const texture_loader = new THREE.TextureLoader();
const earth_texture = texture_loader.load("assets/earth_map.jpg");
const moon_texture = texture_loader.load("assets/moon_map.jpg");

// Cria a Terra 3D 
const radius = 1;
const globo_geometry = new THREE.SphereGeometry(radius, 64, 64);
// const globo_geometry = new THREE.BoxGeometry(1, 1, 1);
const globo_material = new THREE.MeshStandardMaterial({map: earth_texture});
const globo = new THREE.Mesh(globo_geometry, globo_material);
scene.add(globo);

// Cria a Lua 3D
const moon_pivot = new THREE.Object3D();
scene.add(moon_pivot);

const moon_radius = 0.25;
const moon_geometry = new THREE.SphereGeometry(moon_radius, 64, 64);
const moon_material = new THREE.MeshStandardMaterial({map: moon_texture });
const moon = new THREE.Mesh(moon_geometry, moon_material);
moon.position.set(0, 0, 2);
moon_pivot.add(moon);

// Adiciona Luzes 
const light = new THREE.DirectionalLight('rgb(255, 255, 225)', 1.0);
light.position.set(5, 3, 5);
scene.add(light);

const ambient_light = new THREE.AmbientLight('rgb(255, 255, 255)');
scene.add(light);

function animate(){
    requestAnimationFrame(animate);

    globo.rotation.y += 0.01;
    // globo.rotation.x += 0.01;


    controls.update();
    moon_pivot.rotation.y += 0.02;

    renderer.render(scene, camera);
}
animate();

function window_resize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', window_resize);
