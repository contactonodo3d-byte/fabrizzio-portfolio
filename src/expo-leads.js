import {t,getLanguage} from './expo-i18n.js';
import {contact} from './expo-contact.js';
import {applyContactIcons} from './contact-icons.js';
const form=document.querySelector('#lead-form');const review=document.querySelector('#lead-review');const preview=document.querySelector('#lead-preview');const status=document.querySelector('#lead-status');const input=document.querySelector('#lead-contact');let prepared='';
function validContact(){const value=input.value.trim();const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)||(/^\+?[\d\s().-]+$/.test(value)&&value.replace(/\D/g,'').length>=8&&value.replace(/\D/g,'').length<=15);input.setCustomValidity(valid?'':t('Escribe un email válido o un teléfono con código de país.'));}
function invalidate(){review.hidden=true;prepared='';status.textContent='';document.querySelector('#lead-whatsapp').removeAttribute('href');document.querySelector('#lead-email').removeAttribute('href');}
form.addEventListener('input',()=>{input.setCustomValidity('');invalidate();});form.addEventListener('change',invalidate);
form.addEventListener('submit',event=>{event.preventDefault();validContact();const name=form.elements.name;name.setCustomValidity(name.value.trim()?'':t('Escribe tu nombre.'));if(!form.reportValidity())return;
const data=new FormData(form);const service=form.elements.service.selectedOptions[0].textContent;
prepared=[t('Hola Fabrizzio, quiero conversar sobre un proyecto.'),`${t('Nombre:')} ${data.get('name').trim()}`,data.get('company').trim()?`${t('Empresa:')} ${data.get('company').trim()}`:'',`${t('Contacto:')} ${data.get('contact').trim()}`,`${t('Necesidad:')} ${service}`,data.get('details').trim()?`${t('Evento / idea:')} ${data.get('details').trim()}`:'',t('Origen: portfolio Expo')].filter(Boolean).join('\n');
preview.textContent=prepared;document.querySelector('#lead-whatsapp').href='https://wa.me/'+contact.whatsapp+'?text='+encodeURIComponent(prepared);document.querySelector('#lead-email').href='mailto:'+contact.email+'?subject='+encodeURIComponent(t('Consulta de proyecto · Expo'))+'&body='+encodeURIComponent(prepared);applyContactIcons();review.hidden=false;review.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
});
form.elements.name.addEventListener('input',()=>form.elements.name.setCustomValidity(''));
document.querySelector('#lead-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(prepared);status.textContent=t('Consulta copiada. Pégala en WhatsApp o email.');}catch{status.textContent=t('Selecciona y copia el texto de tu consulta.');}});
document.addEventListener('expo-language',invalidate);
