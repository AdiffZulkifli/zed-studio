/* ============================================
   MEDICMESIR — Main JavaScript
============================================ */

// ── NAVBAR SCROLL ──
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── MOBILE MENU ──
const hamburger = document.querySelector('.hamburger');
const navLinks   = document.querySelector('.nav-links');
const navCta     = document.querySelector('.nav-cta');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    if (navLinks) {
      navLinks.style.display = isOpen ? 'flex' : '';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'fixed';
      navLinks.style.top = '70px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(13,27,42,0.98)';
      navLinks.style.padding = '2rem';
      navLinks.style.gap = '1.5rem';
    }
  });
}

// ── SCROLL FADE-IN ──
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── COUNTER ANIMATION ──
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── SMOOTH ANCHOR LINKS ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── PROGRAMME CARD TILT EFFECT ──
document.querySelectorAll('.programme-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `translateY(-8px) rotateX(${-y * 0.02}deg) rotateY(${x * 0.02}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navItems.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--gold-lite)'
      : '';
  });
});

// ── FORM VALIDATION (contact) ──
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!emailRe.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Message sent! We\'ll be in touch soon.', 'success');
    form.reset();
  });
}

function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = 'toast toast--' + type;
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    background: type === 'success' ? 'var(--gold)' : '#e74c3c',
    color: 'white',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    zIndex: '9999',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    animation: 'fadeInUp 0.4s ease',
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

// ── PARALLAX HERO ──
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  });
}

// ── IMAGE LAZY LOAD ──
document.querySelectorAll('img[data-src]').forEach(img => {
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imgObserver.unobserve(img);
      }
    });
  });
  imgObserver.observe(img);
});

// ── PAGE LOADED ──
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
});
