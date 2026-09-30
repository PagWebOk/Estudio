/* Flocco & Asociados — interacciones. Sin dependencias, sin build. */

const WA_NUMERO = '5493417480459';
const EMAIL = 'drafloccoana@gmail.com';

const nav = document.getElementById('nav');
const waFloat = document.querySelector('.waFloat');

/* Nav con fondo al scrollear + botón flotante después del hero */
addEventListener('scroll', () => {
  nav.classList.toggle('is-stuck', scrollY > 40);
  waFloat.classList.toggle('is-visible', scrollY > innerHeight * 0.5);
}, { passive: true });

/* Menú mobile */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const abierto = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', abierto);
  burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});

navLinks.addEventListener('click', e => {
  if (e.target.closest('a')) burger.click();
});

/* Aparición de bloques al entrar en viewport */
const reveal = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('is-in');
    reveal.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -12% 0px' });

document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

/* Link activo según la sección visible */
const enlaces = [...document.querySelectorAll('.nav__links a[href^="#"]')];
const spy = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    enlaces.forEach(a => a.classList.toggle('is-active', a.hash === '#' + e.target.id));
  }
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

/* Formulario: arma el mensaje y lo abre en WhatsApp o en el cliente de correo */
function armarMensaje(d) {
  return `Consulta desde la web
Nombre: ${d.nombre}
Teléfono: ${d.tel || '—'}
Email: ${d.email || '—'}
Área: ${d.area || 'Sin especificar'}

${d.mensaje}`;
}

const form = document.getElementById('contactForm');

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.reportValidity()) return;

  const d = Object.fromEntries(new FormData(form));
  const texto = encodeURIComponent(armarMensaje(d));

  if (e.submitter.dataset.mode === 'mail') {
    const asunto = encodeURIComponent('Consulta web — ' + (d.area || 'General'));
    location.href = `mailto:${EMAIL}?subject=${asunto}&body=${texto}`;
  } else {
    open(`https://wa.me/${WA_NUMERO}?text=${texto}`, '_blank', 'noopener');
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

/* Chequeo mínimo: abrir index.html#selftest y mirar la consola */
if (location.hash === '#selftest') {
  const vacio = armarMensaje({ nombre: 'Ana', mensaje: 'Hola' });
  console.assert(vacio.includes('Teléfono: —'), 'falta el guion en campos vacíos');
  console.assert(vacio.includes('Área: Sin especificar'), 'falta el fallback de área');
  console.assert(armarMensaje({ area: 'Sucesiones' }).includes('Área: Sucesiones'), 'no toma el área elegida');
  console.log('selftest ok');
}
