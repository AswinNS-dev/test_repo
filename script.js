/* =========================================
   ASWIN N S PORTFOLIO - script.js
   ========================================= */

'use strict';

// ── Theme Management ──────────────────────
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
let isDark = true;

function setTheme(dark) {
  isDark = dark;
  if (dark) {
    body.classList.add('dark-theme');
    body.removeAttribute('data-theme');
  } else {
    body.classList.remove('dark-theme');
    body.setAttribute('data-theme', 'light');
  }
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => setTheme(!isDark));

// Init theme from storage
const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme !== 'light');

// ── Navigation ────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
  updateBackToTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileOverlay.classList.toggle('open');
  body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileOverlay.classList.remove('open');
    body.style.overflow = '';
  });
});

// Active nav section highlighting
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === current) {
      link.classList.add('active');
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Back To Top ───────────────────────────
const backToTop = document.getElementById('backToTop');

function updateBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Custom Cursor ─────────────────────────
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .skill-card, .project-card, .coding-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('expand'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('expand'));
});

// ── Particle Background ───────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.7 ? '#a855f7' : '#00e5ff';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.08;
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  animationId = requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
  cancelAnimationFrame(animationId);
  resizeCanvas();
  initParticles();
  animateParticles();
});

// ── Typing Animation ──────────────────────
const roles = [
  'AI/ML Enthusiast',
  'Software Developer',
  'Data Engineering Learner',
  'GenAI Builder',
  'AI & Data Science Student',
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeLoop() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 70;

  if (!isDeleting && charIndex === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }

  setTimeout(typeLoop, delay);
}

typeLoop();

// ── Scroll Reveal ─────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated Counters ─────────────────────
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = start;
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEls = entry.target.querySelectorAll('[data-target]');
      numEls.forEach(el => {
        if (!el.dataset.animated) {
          el.dataset.animated = 'true';
          animateCounter(el, parseInt(el.dataset.target));
        }
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.hero-stats, .coding-grid').forEach(el => counterObserver.observe(el));

// Coding card fill bars via visibility
const codingCardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.coding-card').forEach(card => codingCardObserver.observe(card));

// ── Contact Form ──────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function validateField(id, errorId, validator, msg) {
  const el = document.getElementById(id);
  const err = document.getElementById(errorId);
  if (!validator(el.value.trim())) {
    el.classList.add('error');
    err.textContent = msg;
    return false;
  }
  el.classList.remove('error');
  err.textContent = '';
  return true;
}

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const nameValid = validateField('formName', 'nameError', v => v.length >= 2, 'Name must be at least 2 characters.');
  const emailValid = validateField('formEmail', 'emailError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email.');
  const subjectValid = validateField('formSubject', 'subjectError', v => v.length >= 3, 'Subject must be at least 3 characters.');
  const messageValid = validateField('formMessage', 'messageError', v => v.length >= 10, 'Message must be at least 10 characters.');

  if (nameValid && emailValid && subjectValid && messageValid) {
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Sending...';

    // Simulate submission (replace with real endpoint if needed)
    setTimeout(() => {
      contactForm.reset();
      formSuccess.classList.add('show');
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'Send Message';
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1200);
  }
});

// Real-time validation feedback
['formName', 'formEmail', 'formSubject', 'formMessage'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('blur', () => {
    el.classList.remove('error');
    const errEl = document.getElementById(id.replace('form', '').toLowerCase() + 'Error');
    if (errEl) errEl.textContent = '';
  });
});

// ── Navbar initial state ──────────────────
updateActiveNav();
