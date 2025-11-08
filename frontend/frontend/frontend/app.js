const API = 'https://SEU_BACKEND_URL/api/leads'; // Substituir pelo link real depois

let wallColor = '#ffffff';
let doorType = 'standard';
let finishing = 'economico';
const basePricePerM2 = { economico: 2300, intermediario: 2900, premium: 3700 };
const modelArea = 100;

let houseMesh;

function updateBudget() {
  const multiplier = (doorType === 'standard') ? 1 : doorType === 'mioloSolido' ? 1.1 : 1.3;
  const total = modelArea * basePricePerM2[finishing] * multiplier;
  document.getElementById('budgetValue').innerText = `R$ ${total.toLocaleString('pt-BR')}`;
}

function init3D() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, (window.innerWidth*0.8)/400, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth * 0.8, 400);
  document.getElementById('viewer3d').appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  const geometry = new THREE.BoxGeometry(4, 2.5, 6);
  const material = new THREE.MeshStandardMaterial({ color: wallColor });
  houseMesh = new THREE.Mesh(geometry, material);
  scene.add(houseMesh);

  camera.position.z = 10;

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

document.getElementById('leadForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('landing').style.display = 'none';
  document.getElementById('configurator').style.display = 'block';
  init3D();
  updateBudget();
});

document.getElementById('wallColor').addEventListener('input', e => {
  wallColor = e.target.value;
  houseMesh.material.color.set(wallColor);
  updateBudget();
});

document.getElementById('doorType').addEventListener('change', e => {
  doorType = e.target.value;
  updateBudget();
});

document.getElementById('finishing').addEventListener('change', e => {
  finishing = e.target.value;
  updateBudget();
});

document.getElementById('solicitar').addEventListener('click', async () => {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const telefone = document.getElementById('telefone').value;
  const body = {
    nome,
    email,
    telefone,
    configuracao: { wallColor, doorType, finishing }
  };
  try {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    alert('Lead enviado com sucesso!');
  } catch (err) {
    alert('Erro ao enviar lead.');
  }
});
