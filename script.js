// ==========================================
// МІРЖАҚЫП ДУЛАТҰЛЫ — WEBSITE SCRIPTS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // === LOADER ===
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1800);

  // === NAVBAR SCROLL ===
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  // === BURGER MENU ===
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close menu when link clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // === ACTIVE NAV LINK ===
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (navLink) {
        if (scrollPos >= top && scrollPos < bottom) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  }

  // === COUNTER ANIMATION ===
  const counters = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 1500;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current).toLocaleString('kk-KZ');
      }, 16);
    });
  }

  // === INTERSECTION OBSERVER ===
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe AOS elements
  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

  // Observe timeline items
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(item);
  });

  // Observe pub cards
  document.querySelectorAll('.pub-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(card);
  });

  // Observe lit cards
  document.querySelectorAll('.lit-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(card);
  });

  // Observe social cards
  document.querySelectorAll('.social-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(card);
  });

  // Observe lit-main
  document.querySelectorAll('.lit-main').forEach(el => observer.observe(el));

  // Observe quote block
  document.querySelectorAll('.quote-block').forEach(el => observer.observe(el));

  // Observe colleagues
  document.querySelectorAll('.colleagues-section').forEach(el => observer.observe(el));

  // Stats bar observer
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsBar);
  }

  // === SMOOTH SCROLL ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPos = target.offsetTop - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // === PARALLAX EFFECT (Hero) ===
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  });

  // === CURSOR GLOW EFFECT on Cards ===
  document.querySelectorAll('.pub-card, .lit-card, .social-card, .timeline-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(201,146,42,0.08) 0%, rgba(255,255,255,0.02) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // === TITLE TYPING EFFECT (optional enhancement) ===
  // Already handled by CSS animation

  console.log('🌟 Міржақып Дулатұлы сайты жүктелді!');
  console.log('📚 "Оян, қазақ!" — 1909');
});
