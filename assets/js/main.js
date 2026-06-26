/* ============================================================
   Rahul Tammalla Portfolio — Main JS
============================================================ */


// === CUSTOM CURSOR (desktop only) ===
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (cursorDot && cursorRing && window.innerWidth > 768) {
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows exactly
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Ring lags behind with easing
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Ring morphs on interactive elements
  const interactives = document.querySelectorAll('a, button, .other-card, .exp-tab, .fp-img-placeholder');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide when cursor leaves window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
  });
}


// === NAVBAR: hide on scroll-down, show on scroll-up ===
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  nav.classList.toggle('scrolled', current > 50);

  if (current <= 0) {
    nav.classList.remove('hidden');
  } else if (current > lastScroll && current > 100) {
    nav.classList.add('hidden');
  } else if (current < lastScroll) {
    nav.classList.remove('hidden');
  }
  lastScroll = current;
}, { passive: true });


// === MOBILE DRAWER ===
const hamburger     = document.getElementById('hamburger');
const drawer        = document.getElementById('drawer');
const drawerClose   = document.getElementById('drawerClose');
const drawerOverlay = document.getElementById('drawerOverlay');

const openDrawer  = () => {
  drawer.classList.add('open');
  drawerOverlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
};
const closeDrawer = () => {
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('visible');
  document.body.style.overflow = '';
};

hamburger.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);
document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeDrawer));


// === EXPERIENCE TABS ===
const tabs      = document.querySelectorAll('.exp-tab');
const panels    = document.querySelectorAll('.exp-panel');
const indicator = document.querySelector('.tab-indicator');

function activateTab(btn) {
  const target = btn.dataset.tab;
  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.querySelector(`[data-panel="${target}"]`).classList.add('active');
  const idx = Array.from(tabs).indexOf(btn);
  if (indicator) indicator.style.transform = `translateY(${idx * 42}px)`;
}

tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab)));


// === SCROLL REVEAL (IntersectionObserver) ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// === STAGGER grid children ===
document.querySelectorAll('.other-grid, .skills-block').forEach(grid => {
  grid.querySelectorAll('.other-card, .skill-group').forEach((child, i) => {
    child.style.transitionDelay = `${i * 70}ms`;
  });
});


// === ACTIVE NAV LINK (highlights current section) ===
const sections    = document.querySelectorAll('section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active-link'));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active-link');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));


// === STAT COUNTER (animated on first scroll-into-view) ===
const statNums = document.querySelectorAll('.stat-num');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el       = entry.target;
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const startTs  = performance.now();

    (function tick(now) {
      const elapsed  = now - startTs;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    })(performance.now());

    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

statNums.forEach(el => counterObserver.observe(el));
