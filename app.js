import {MindARThree} from 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.0/dist/mindar-face.prod.js';

const mindarThree = new MindARThree({container: document.body});
const {renderer, scene, camera} = mindarThree;

const ambient = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 0.5);
dir.position.set(0, 5, 5);
scene.add(dir);

const loader = new THREE.GLTFLoader();

async function loadModel(url, scale, position, rotation = [0, Math.PI, 0]) {
  const gltf = await loader.loadAsync(url);
  const obj = gltf.scene;
  obj.scale.set(...scale);
  obj.position.set(...position);
  obj.rotation.set(...rotation);
  return obj;
}

// Очки
const glasses = await loadModel(
  './models/glasses.glb',
  [0.06, 0.06, 0.06],
  [0, 0.02, 0]
);

// Шляпа
const hat = await loadModel(
  './models/hat.glb',
  [0.12, 0.12, 0.12],
  [0, 0.15, 0]
);

const anchor = mindarThree.addAnchor(0);
anchor.group.add(glasses);
anchor.group.add(hat);

glasses.visible = false;
hat.visible     = false;

document.getElementById('effect').addEventListener('change', e => {
  const sel = e.target.value;

  // Скрыть всё
  glasses.visible = false;
  hat.visible     = false;

  // Показать выбранный
  if (sel === 'glasses') glasses.visible = true;
  else if (sel === 'hat') hat.visible = true;
});

let smooth = 0.2;
const prevPos = new THREE.Vector3();
const prevQuat = new THREE.Quaternion();

renderer.setAnimationLoop(() => {
  const {position, quaternion} = anchor.group;
  prevPos.lerp(position, smooth);
  prevQuat.slerp(quaternion, smooth);
  anchor.group.position.copy(prevPos);
  anchor.group.quaternion.copy(prevQuat);

  renderer.render(scene, camera);
});

await mindarThree.start();