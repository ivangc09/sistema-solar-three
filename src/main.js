import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 80);

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

const planetInfo = {
    "mercury": "Mercury was named after Hermes, the messenger of the Greek gods from Olympus. Only slightly larger than our Moon, it is the smallest planet in the solar system and the closest to the Sun.",
    "venus": "After the Sun and the Moon, Venus is the brightest object visible in the sky from Earth. Part of Venus's brightness is due to its proximity to Earth, as it is the closest planet to us.",
    "earth": "Earth is the fifth-largest planet and the third closest to the Sun in the solar system. The composition of its oxygen-rich atmosphere and the presence of liquid water, this distance from Earth to the Sun, which lies within the habitable zone of a star, are responsible for making our planet the only one in the solar system where life has so far been found.",
    "mars": "Mars is the fourth planet from the Sun and the second smallest planet in the solar system. It is often called the Red Planet because of its reddish appearance, which is due to iron oxide (rust) on its surface.",
    "jupiter": "Jupiter is the largest planet in the solar system and the fifth from the Sun. It is a gas giant with a mass more than twice that of all the other planets combined.",
    "saturn": "Saturn is the sixth planet from the Sun and the second largest in the solar system, after Jupiter. It is a gas giant with an average radius about nine times that of Earth.",
    "uranus": "Uranus is the seventh planet from the Sun and the third largest in the solar system. It is a gas giant with an average radius about four times that of Earth.",
    "neptune": "Neptune is the eighth and farthest planet from the Sun in the solar system. It is a gas giant with an average radius about four times that of Earth."
}

const planetData = [
  {
    name: "mercury",
    color: 0xaaaaaa,
    distance: 10,
    size: 0.5,
    speed: 0.04,
    diameter: "4,879 km",
    distanceFromSun: "58 million km",
    orbitalSpeed: "47.87 km/s",
    info: planetInfo.mercury
  },
  {
    name: "venus",
    color: 0xffcc99,
    distance: 14,
    size: 1.0,
    speed: 0.015,
    diameter: "12,104 km",
    distanceFromSun: "108 million km",
    orbitalSpeed: "35.02 km/s",
    info: planetInfo.venus
  },
  {
    name: "earth",
    color: 0x3399ff,
    distance: 18,
    size: 1.2,
    speed: 0.01,
    diameter: "12,742 km",
    distanceFromSun: "150 million km",
    orbitalSpeed: "29.78 km/s",
    info: planetInfo.earth
  },
  {
    name: "mars",
    color: 0xff3300,
    distance: 22,
    size: 0.8,
    speed: 0.008,
    diameter: "6,779 km",
    distanceFromSun: "228 million km",
    orbitalSpeed: "24.07 km/s",
    info: planetInfo.mars
  },
  {
    name: "jupiter",
    color: 0xff9966,
    distance: 30,
    size: 2.5,
    speed: 0.002,
    diameter: "139,820 km",
    distanceFromSun: "778 million km",
    orbitalSpeed: "13.07 km/s",
    info: planetInfo.jupiter
  },
  {
    name: "saturn",
    color: 0xffcc66,
    distance: 38,
    size: 2.0,
    speed: 0.0015,
    diameter: "116,460 km",
    distanceFromSun: "1,433 million km",
    orbitalSpeed: "9.69 km/s",
    info: planetInfo.saturn
  },
  {
    name: "uranus",
    color: 0x66ccff,
    distance: 46,
    size: 1.7,
    speed: 0.001,
    diameter: "50,724 km",
    distanceFromSun: "2,872 million km",
    orbitalSpeed: "6.81 km/s",
    info: planetInfo.uranus
  },
  {
    name: "neptune",
    color: 0x3366cc,
    distance: 54,
    size: 1.6,
    speed: 0.0008,
    diameter: "49,244 km",
    distanceFromSun: "4,495 million km",
    orbitalSpeed: "5.43 km/s",
    info: planetInfo.neptune
  }
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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoCard = document.getElementById("infoCard");

window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        const planet = intersects[0].object;
        const data = planet.userData;
        const planetName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        infoCard.style.display = "block";
        infoCard.innerHTML = `
            <div style="text-align: center; font-weight: bold; font-size: 1.2em;">
                ${planetName}
            </div><br>
            Diameter: ${data.diameter}<br>
            Distance from Sun: ${data.distanceFromSun}<br>
            Speed: ${data.orbitalSpeed}<br><br>
            ${data.info}
    `;
    } else {
        infoCard.style.display = "none";
    }
});
