const langButtons = document.querySelectorAll('[data-lang]');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
let currentLanguage = 'en';
function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.querySelectorAll('[data-en][data-de]').forEach(element => { element.textContent = element.dataset[language]; });
  langButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
  nav.setAttribute('aria-label', language === 'de' ? 'Hauptnavigation' : 'Main navigation');
  updateMenuLabel();
  document.querySelector('.round-link').setAttribute('aria-label', language === 'de' ? 'Ausgewählte Arbeiten ansehen' : 'Explore selected work');
  document.querySelector('.language').setAttribute('aria-label', language === 'de' ? 'Sprache' : 'Language');
  document.querySelectorAll('.project-image').forEach(link => {
    const img = link.querySelector('img');
    const name = img.dataset.altEn.replace('Screenshot of the ', '').replace(' website', '');
    img.alt = language === 'de' ? img.dataset.altDe : img.dataset.altEn;
    link.setAttribute('aria-label', language === 'de' ? `${name} besuchen (öffnet in einem neuen Tab)` : `Visit ${name} (opens in a new tab)`);
  });

  const result = document.querySelector('.form-result');
  if (!result.hidden) result.textContent = language === 'de' ? 'Vorschau abgeschlossen. Diese Demo hat keine Nachricht gesendet oder gespeichert.' : 'Preview complete. This demo did not send or save a message.';
}
function updateMenuLabel() {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-label', currentLanguage === 'de' ? (open ? 'Menü schließen' : 'Menü öffnen') : (open ? 'Close menu' : 'Open menu'));
}
langButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); updateMenuLabel(); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); updateMenuLabel(); }));
document.querySelector('#demo-form').addEventListener('submit', event => { event.preventDefault(); const result = document.querySelector('.form-result'); result.hidden = false; result.textContent = currentLanguage === 'de' ? 'Vorschau abgeschlossen. Diese Demo hat keine Nachricht gesendet oder gespeichert.' : 'Preview complete. This demo did not send or save a message.'; });


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
