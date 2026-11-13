import { applyContactIcons } from './contact-icons.js';
import { t, getLanguage, refreshTranslations } from './expo-i18n.js';
import { contact } from './expo-contact.js';
import { setupMediaViewer } from './selected-projects.js';

document.querySelectorAll('[data-image]').forEach(button => {
  button.className = 'media-preview';
  button.dataset.mediaSrc = button.dataset.image;
  button.dataset.mediaType = 'image';
  button.dataset.mediaLabel = button.dataset.caption;
});
setupMediaViewer(getLanguage());
const menu = document.querySelector('#expo-menu');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  document.querySelector('#expo-mobile').hidden = !open;
});
function updateContact() {
  const message = t('Hola Fabrizzio, quiero conversar sobre el diseño de un stand para mi empresa.');
  const url = 'https://wa.me/' + contact.whatsapp + '?text=' + encodeURIComponent(message);
  document.querySelectorAll('[data-whatsapp]').forEach(link => link.href = url);
  document.querySelector('#direct-contact').innerHTML = '<a class="button primary" href="' + url + '">' + t('Escríbeme por WhatsApp') + '</a><a class="text-link" href="mailto:' + contact.email + '">' + contact.email + '</a>';
  applyContactIcons();
}
updateContact();
document.addEventListener('expo-language', updateContact);
document.querySelector('#load-viewer').addEventListener('click',async(event)=>{event.target.disabled=true;document.querySelector('#viewer-status').textContent=t('Cargando visualizador…');try{await import('@google/model-viewer');const viewer=document.createElement('model-viewer');for(const [key,value]of Object.entries({src:'/expo/assets/model.glb','ios-src':'/expo/assets/model.usdz',alt:'Concepto de stand Gestecner Navegestic',ar:'','ar-modes':'webxr scene-viewer quick-look','camera-controls':'','shadow-intensity':'1',exposure:'0.9'}))viewer.setAttribute(key,value);const ar=document.createElement('button');ar.slot='ar-button';ar.className='button primary ar-button';ar.textContent=t('Ver en tu espacio');ar.insertAdjacentHTML('beforeend','<svg class="icon icon-forward-doodle" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.3c2.2 2 4.4 4.1 6.8 6.7-2.3 2.5-4.6 4.7-6.7 6.8M10.7 5.2c2.3 2.1 4.5 4.2 6.8 6.8-2.4 2.5-4.6 4.6-6.7 6.7M19 5.4c-.1 2.2.1 4.4 0 6.6.1 2.3-.1 4.5 0 6.7"/></svg>');viewer.append(ar);viewer.addEventListener('error',()=>{const fallback=document.createElement('p');fallback.textContent=t('No se pudo cargar el modelo. Revisa tu conexión e intenta nuevamente.');document.querySelector('#viewer-shell').replaceChildren(fallback);});document.querySelector('#viewer-shell').replaceChildren(viewer);}catch{document.querySelector('#viewer-status').textContent=t('No se pudo cargar. Comprueba tu conexión y vuelve a intentar.');event.target.disabled=false;}});


import './expo-leads.js';
refreshTranslations();
