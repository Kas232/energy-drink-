/* ======================================================
   VOLTIS — 3D Can Scene (Three.js) + Site Interactions
   ====================================================== */

(function initCanScene(){
  const wrap = document.getElementById('canvas-wrap');
  const canvasEl = document.getElementById('can-canvas');
  if(!wrap || !canvasEl || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = wrap.clientWidth;
  let height = wrap.clientHeight;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  // ---------- Label texture (drawn on canvas) ----------
  function buildLabelTexture(){
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');

    const grad = ctx.createLinearGradient(0,0,0,c.height);
    grad.addColorStop(0, '#111018');
    grad.addColorStop(0.5, '#1a1430');
    grad.addColorStop(1, '#0A0A0F');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,c.width,c.height);

    ctx.fillStyle = 'rgba(0,240,255,0.12)';
    ctx.fillRect(0, 60, c.width, 6);
    ctx.fillStyle = 'rgba(255,46,99,0.12)';
    ctx.fillRect(0, c.height - 70, c.width, 6);

    ctx.save();
    ctx.translate(c.width/2, c.height/2 - 40);
    ctx.fillStyle = '#D4FF00';
    ctx.shadowColor = '#D4FF00';
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.moveTo(20, -110);
    ctx.lineTo(-70, 20);
    ctx.lineTo(-10, 20);
    ctx.lineTo(-20, 110);
    ctx.lineTo(70, -30);
    ctx.lineTo(10, -30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#F2F2F0';
    ctx.font = '700 90px "Space Grotesk", sans-serif';
    ctx.shadowColor = 'transparent';
    ctx.fillText('VOLTIS', c.width/2, c.height/2 + 130);

    ctx.font = '600 26px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00F0FF';
    ctx.letterSpacing = '6px';
    ctx.fillText('ENERGY  ·  230mg  ·  0g SUGAR', c.width/2, c.height/2 + 175);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
  }

  const canGroup = new THREE.Group();
  scene.add(canGroup);

  const bodyGeo = new THREE.CylinderGeometry(1.55, 1.55, 4.2, 64, 1, false);
  const bodyMat = new THREE.MeshStandardMaterial({
    map: buildLabelTexture(),
    metalness: 0.65,
    roughness: 0.28,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  canGroup.add(body);

  const capMat = new THREE.MeshStandardMaterial({ color: 0xd8d8dc, metalness: 0.9, roughness: 0.2 });
  const topGeo = new THREE.CylinderGeometry(1.55, 1.5, 0.16, 64);
  const topCap = new THREE.Mesh(topGeo, capMat);
  topCap.position.y = 2.18;
  canGroup.add(topCap);
  const botCap = new THREE.Mesh(topGeo, capMat);
  botCap.position.y = -2.18;
  canGroup.add(botCap);

  const ringGeo = new THREE.TorusGeometry(1.5, 0.035, 12, 64);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x2a2a33, metalness: 0.8, roughness: 0.3 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI/2;
  ring.position.y = 2.26;
  canGroup.add(ring);

  canGroup.rotation.z = -0.06;
  canGroup.position.y = -0.1;

  const particleCount = 60;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for(let i=0;i<particleCount;i++){
    const r = 2.6 + Math.random()*1.6;
    const theta = Math.random()*Math.PI*2;
    const y = (Math.random()-0.5)*5;
    positions[i*3]   = Math.cos(theta)*r;
    positions[i*3+1] = y;
    positions[i*3+2] = Math.sin(theta)*r;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00F0FF,
    size: 0.045,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  const particleGeo2 = particleGeo.clone();
  const particleMat2 = particleMat.clone();
  particleMat2.color = new THREE.Color(0xFF2E63);
  particleMat2.size = 0.03;
  const particles2 = new THREE.Points(particleGeo2, particleMat2);
  particles2.rotation.y = 1.2;
  scene.add(particles2);

  scene.add(new THREE.AmbientLight(0x404050, 1.1));

  const keyLight = new THREE.PointLight(0x00F0FF, 18, 20);
  keyLight.position.set(-4, 3, 4);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xFF2E63, 14, 20);
  rimLight.position.set(4, -2, -3);
  scene.add(rimLight);

  const topLight = new THREE.PointLight(0xD4FF00, 8, 15);
  topLight.position.set(0, 5, 2);
  scene.add(topLight);

  const arcMat = new THREE.LineBasicMaterial({ color: 0xD4FF00, transparent: true, opacity: 0 });
  const arcGeo = new THREE.BufferGeometry();
  const arcPoints = new Float32Array(20 * 3);
  arcGeo.setAttribute('position', new THREE.BufferAttribute(arcPoints, 3));
  const arcLine = new THREE.Line(arcGeo, arcMat);
  scene.add(arcLine);

  let arcTimer = 0;
  function fireArc(){
    const pos = arcGeo.attributes.position;
    let x = (Math.random()-0.5)*1.2, y = 2.3;
    for(let i=0;i<20;i++){
      x += (Math.random()-0.5)*0.5;
      y -= 0.24;
      pos.setXYZ(i, x, y, 1.6 + Math.random()*0.3);
    }
    pos.needsUpdate = true;
    arcTimer = 0.25;
  }
  canvasEl.style.cursor = 'pointer';
  canvasEl.addEventListener('click', fireArc);
  canvasEl.addEventListener('touchstart', fireArc, { passive: true });

  let targetRotY = 0.4, targetRotX = 0.1;
  let curRotY = targetRotY, curRotX = targetRotX;

  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotY = 0.4 + nx * 0.6;
    targetRotX = 0.1 + ny * 0.25;
  });

  function handleResize(){
    width = wrap.clientWidth;
    height = wrap.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', handleResize);

  const clock = new THREE.Clock();

  function animate(){
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();

    if(!prefersReducedMotion){
      curRotY += (targetRotY - curRotY) * 0.06;
      curRotX += (targetRotX - curRotX) * 0.06;
      canGroup.rotation.y = curRotY + t * 0.15;
      canGroup.rotation.x = curRotX * 0.4;
      canGroup.position.y = -0.1 + Math.sin(t * 0.8) * 0.12;

      particles.rotation.y = t * 0.12;
      particles2.rotation.y = -t * 0.09;
    }

    if(arcTimer > 0){
      arcTimer -= dt;
      arcMat.opacity = Math.max(0, arcTimer / 0.25);
    }

    renderer.render(scene, camera);
  }
  animate();
})();


(function meterCounter(){
  const el = document.getElementById('meter-value');
  if(!el) return;
  let value = 118342;
  el.textContent = value.toLocaleString();
  setInterval(() => {
    value += Math.floor(Math.random() * 6) + 1;
    el.textContent = value.toLocaleString();
  }, 1400);
})();


(function drawWave(){
  const line = document.getElementById('wave-line');
  if(!line) return;
  const W = 800, H = 120, MID = 60;
  const pointCount = 80;

  function render(t){
    let pts = '';
    for(let i=0;i<=pointCount;i++){
      const x = (W / pointCount) * i;
      const y = MID
        + Math.sin(i * 0.5 + t) * 18
        + Math.sin(i * 0.15 + t * 1.7) * 10
        + (Math.random() - 0.5) * 3;
      pts += `${x.toFixed(1)},${y.toFixed(1)} `;
    }
    line.setAttribute('points', pts.trim());
  }

  let t = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){
    render(0);
    return;
  }
  function loop(){
    t += 0.06;
    render(t);
    requestAnimationFrame(loop);
  }
  loop();
})();


(function revealOnScroll(){
  const items = document.querySelectorAll('.flavor-card, .spec-panel');
  if(!('IntersectionObserver' in window) || !items.length) return;

  items.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => io.observe(el));
})();