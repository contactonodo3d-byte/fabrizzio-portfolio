
const translations={es:{'viewer.loadError':'No se pudo cargar el modelo. Revisa tu conexión y recarga la página.','measure.button':'Medir','measure.buttonActive':'Medir · activo','measure.tapFirst':'Toca dos puntos sobre el modelo para medir una distancia orientativa.','measure.distance':'Distancia orientativa','measure.point':'Punto'}};let currentLang='es';document.addEventListener('expo-language',event=>{currentLang=event.detail;});translations.en={'viewer.loadError':'Could not load the model. Check your connection and reload.','measure.button':'Measure','measure.buttonActive':'Measure · active','measure.tapFirst':'Tap two points to measure an approximate distance.','measure.distance':'Approximate distance','measure.point':'Point'};translations.pt={'viewer.loadError':'Não foi possível carregar o modelo. Verifique a conexão e recarregue.','measure.button':'Medir','measure.buttonActive':'Medir · ativo','measure.tapFirst':'Toque em dois pontos para medir uma distância aproximada.','measure.distance':'Distância aproximada','measure.point':'Ponto'};
  const viewer = document.getElementById('viewer');
  const loadMsg = document.getElementById('loadMsg');
  const helpBtn = document.getElementById('helpBtn');
  const helpPanel = document.getElementById('helpPanel');

  helpBtn.addEventListener('click', () => {
    helpPanel.classList.toggle('visible');
    helpBtn.setAttribute('aria-expanded', String(helpPanel.classList.contains('visible')));
  });

  viewer.addEventListener('load', () => {
    measureBtn.disabled = false;
    document.getElementById('resetBtn').disabled = false;
    loadMsg.style.display = 'none';
  });
  viewer.addEventListener('error', () => {
    loadMsg.textContent = translations[currentLang]["viewer.loadError"];
  });

  // ---------- MEASURE TOOL ----------
  // Lets you tap two points directly on the model to see the real-world
  // distance between them (in meters, since AR-ready models are exported
  // at true scale). Also useful for finding coordinates to hardcode a
  // permanent dimension hotspot later (see comment near the model-viewer tag).
  const measureBtn = document.getElementById('measureBtn');
  const measureReadout = document.getElementById('measureReadout');
  let measureActive = false;
  let firstPoint = null;

  measureBtn.addEventListener('click', () => {
    measureActive = !measureActive;
    firstPoint = null;
    measureBtn.classList.toggle('active', measureActive);
    measureBtn.setAttribute('aria-pressed', String(measureActive));
    measureBtn.textContent = translations[currentLang][measureActive ? "measure.buttonActive" : "measure.button"];
    measureReadout.classList.toggle('visible', measureActive);
    if(measureActive){
      measureReadout.textContent = translations[currentLang]["measure.tapFirst"];
      viewer.cameraControls = false; // avoid dragging the view while measuring
    } else {
      viewer.cameraControls = true;
    }
  });

  viewer.addEventListener('click', (event) => {
    if(!measureActive) return;
    const rect = viewer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = viewer.positionAndNormalFromPoint(x, y);
    if(!hit){
      measureReadout.textContent = translations[currentLang]["measure.tapFirst"];
      return;
    }
    if(!firstPoint){
      firstPoint = hit.position;
      measureReadout.textContent = `${translations[currentLang]["measure.point"]} 1 ✓ — ${translations[currentLang]["measure.tapFirst"]}`;
    } else {
      const dx = hit.position.x - firstPoint.x;
      const dy = hit.position.y - firstPoint.y;
      const dz = hit.position.z - firstPoint.z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      measureReadout.textContent = `${translations[currentLang]["measure.distance"]}: ${dist.toFixed(2)} m`;
      firstPoint = null;
    }
  });


const status = document.getElementById('viewerStatus');
const reloadBtn = document.getElementById('reloadBtn');
viewer.addEventListener('error', () => { reloadBtn.hidden = false; });
reloadBtn.addEventListener('click', () => location.reload());
document.getElementById('resetBtn').addEventListener('click', () => {
  if(measureActive) measureBtn.click();
  viewer.cameraOrbit = '0deg 80deg 105%';
  viewer.cameraTarget = 'auto auto auto';
  viewer.fieldOfView = 'auto';
});
viewer.addEventListener('load', () => {
  if(viewer.canActivateAR) status.textContent = 'Modelo listo. Toca “Ver con tu cámara” para abrir la cámara y colocar la propuesta.';
});
viewer.addEventListener('ar-status', (event) => {
  if(event.detail.status === 'failed') status.textContent = 'No se pudo iniciar AR. Abre este enlace en Safari de iPhone/iPad o Chrome de Android compatible y vuelve a intentar.';
});
document.getElementById('shareBtn').addEventListener('click', async () => {
  const url = 'https://fabrizzioruiz.com/3d/foody-exhibidor/';
  try {
    if(navigator.share) await navigator.share({title:'FOODY · Exhibidor 3D / AR', url});
    else { await navigator.clipboard.writeText(url); status.textContent = 'Enlace copiado. Puedes enviarlo al cliente para abrirlo desde su teléfono.'; }
  } catch(error) { if(error.name !== 'AbortError') status.textContent = 'Puedes compartir este enlace: ' + url; }
});

// WCAG: let users pause the decorative, repeating camera cue.
const motionBtn = document.getElementById('motionBtn');
viewer.addEventListener('load', () => { motionBtn.hidden = !viewer.canActivateAR; });
motionBtn.addEventListener('click', () => {
  const paused = viewer.classList.toggle('camera-motion-paused');
  motionBtn.setAttribute('aria-pressed', String(paused));
  motionBtn.textContent = paused ? 'Reanudar animación' : 'Pausar animación';
});
viewer.addEventListener('ar-status', (event) => {
  viewer.classList.toggle('camera-ar-active', ['session-started', 'object-placed'].includes(event.detail.status));
});
