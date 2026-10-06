// Shared, lightweight icons for the same actions on Expo and Connect.
const paths = {
  card: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="8" cy="10" r="1.6"/><path d="M5.7 15c.5-2.3 4.1-2.3 4.6 0M13 9h5M13 12h5M13 15h3"/>',
  contact: '<rect x="4" y="3" width="15" height="18" rx="3"/><path d="M19 7h2M19 12h2M19 17h2M4 7H2M4 12H2M4 17H2"/><circle cx="11.5" cy="9" r="2.3"/><path d="M7.3 17c0-5.2 8.4-5.2 8.4 0Z"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z"/><path d="M8 11.5h.01M12.5 11.5h.01M17 11.5h.01"/>',
  whatsapp: '<path d="M20.7 11.6a8.7 8.7 0 0 1-13.1 7.5L3 20.5l1.4-4.4A8.7 8.7 0 1 1 20.7 11.6Z"/><path d="M8.2 7.2c-.4-.1-1.2.5-1.2 1.5 0 2.5 4.1 6.7 6.8 7 .9.1 2-.8 2-1.5l-2.4-1.2-.9 1c-1.4-.6-2.8-2-3.4-3.4l1-.9-1.2-2.4Z"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'
};
export function applyContactIcons() {
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href') || '';
    let type;
    if (/^https:\/\/(wa\.me|api\.whatsapp\.com)(\/|$)/.test(href)) type = 'whatsapp';
    else if (href.startsWith('mailto:')) type = 'email';
    else if (/\.vcf(?:[?#]|$)/.test(href)) type = 'contact';
    else if (/^\/connect\/?(?:[?#]|$)/.test(href)) type = 'card';
    else if (href === '#contacto') type = 'chat';
    if (!type) return;
    link.querySelectorAll('svg.icon').forEach(icon => icon.remove());
    link.insertAdjacentHTML('beforeend', `<svg class="icon icon-${type}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[type]}</svg>`);
  });
}
