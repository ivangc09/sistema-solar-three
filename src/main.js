import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 50);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const textureLoader = new THREE.TextureLoader();

const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

const light = new THREE.PointLight(0xffffff, 8, 1000);
light.position.set(0, 0, 0);
scene.add(light);

const sunTexture = textureLoader.load('/textures/sun.jpg');

const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    sunMaterial
);
scene.add(sun);

const planetData = [
    { name: "mercury", color: 0xaaaaaa, distance: 10, size: 0.5, speed: 0.04 },
    { name: "venus",    color: 0xffcc99, distance: 14, size: 1.2, speed: 0.015 },
    { name: "earth",   color: 0x3399ff, distance: 18, size: 1.3, speed: 0.01 }
];

const planets = [];

planetData.forEach(data => {
    const texture = textureLoader.load(`./textures/${data.name}.jpg`)

    const material = new THREE.MeshStandardMaterial({map: texture});

    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(data.size, 32, 32),
        material
    );

    planet.userData = { angle: Math.random() * Math.PI * 2, ...data };
    planets.push(planet);
    scene.add(planet);
});

function animate() {
    requestAnimationFrame(animate);

    planets.forEach(planet => {
        planet.userData.angle += planet.userData.speed;
        const a = planet.userData.angle;
        const d = planet.userData.distance;
        planet.position.set(Math.cos(a) * d, 0, Math.sin(a) * d);
        planet.rotation.y += 0.01;
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
