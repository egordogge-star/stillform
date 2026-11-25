const langButtons = document.querySelectorAll('[data-lang]');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
const copyStatus = document.querySelector('.copy-status');
let currentLanguage = 'en';
let copyResult = '';
function updateCopyStatus() {
  const messages = {
    success: { en: 'Email address copied.', de: 'E-Mail-Adresse kopiert.' },
    failure: { en: 'Could not copy automatically. Please select the address above and copy it.', de: 'Automatisches Kopieren nicht möglich. Bitte markieren und kopieren Sie die Adresse oben.' }
  };
  copyStatus.textContent = copyResult ? messages[copyResult][currentLanguage] : '';
}
function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.querySelectorAll('[data-en][data-de]').forEach(element => { element.textContent = element.dataset[language]; });
  langButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
  nav.setAttribute('aria-label', language === 'de' ? 'Hauptnavigation' : 'Main navigation');
  updateMenuLabel();
  updateCopyStatus();
  document.querySelector('.round-link').setAttribute('aria-label', language === 'de' ? 'Ausgewählte Arbeiten ansehen' : 'Explore selected work');
  document.querySelector('.language').setAttribute('aria-label', language === 'de' ? 'Sprache' : 'Language');
  document.querySelectorAll('.project-image').forEach(link => {
    const img = link.querySelector('img');
    const name = img.dataset.altEn.replace('Screenshot of the ', '').replace(' website', '');
    img.alt = language === 'de' ? img.dataset.altDe : img.dataset.altEn;
    link.setAttribute('aria-label', language === 'de' ? `${name} besuchen (öffnet in einem neuen Tab)` : `Visit ${name} (opens in a new tab)`);
  });

}
function updateMenuLabel() {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-label', currentLanguage === 'de' ? (open ? 'Menü schließen' : 'Menü öffnen') : (open ? 'Close menu' : 'Open menu'));
}
langButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); updateMenuLabel(); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); updateMenuLabel(); }));
document.querySelector('#copy-email').addEventListener('click', async () => {
  const address = 'stillform.web@gmail.com';
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(address);
    copyResult = 'success';
  } catch (error) {
    const field = document.createElement('textarea');
    field.value = address;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(field);
    field.select();
    try { copyResult = document.execCommand('copy') ? 'success' : 'failure'; }
    catch (fallbackError) { copyResult = 'failure'; }
    field.remove();
    document.querySelector('#copy-email').focus();
  }
  updateCopyStatus();
});


document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    updateMenuLabel();
    menu.focus();
  }
});
window.matchMedia('(min-width: 601px)').addEventListener('change', event => {
  if (event.matches) {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    updateMenuLabel();
  }
});

