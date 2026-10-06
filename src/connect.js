import {t, refreshTranslations} from './expo-i18n.js';
const button=document.querySelector('#share');const label=document.querySelector('#share-label');const status=document.querySelector('#share-status');const url='https://fabrizzioruiz.com/connect/';
function syncLanguage(){label.textContent=t(navigator.share?'Compartir mi contacto':'Copiar enlace de contacto');status.textContent='';document.title=t('Conecta con Fabrizzio Ruiz');}
document.addEventListener('expo-language',syncLanguage);refreshTranslations();syncLanguage();
if(navigator.share||navigator.clipboard){button.hidden=false;button.addEventListener('click',async()=>{try{if(navigator.share){await navigator.share({title:'Fabrizzio Ruiz · Exhibition & Digital Design',url});status.textContent='';}else{await navigator.clipboard.writeText(url);status.textContent=t('Enlace copiado. Puedes enviarlo por WhatsApp o email.');}}catch(error){if(error.name!=='AbortError')status.textContent=t('Puedes compartir este enlace:')+' '+url;}});}
