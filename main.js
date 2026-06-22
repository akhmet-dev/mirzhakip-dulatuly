// ═══════════════════════════════════════════
//  ABAI TARYH — GSAP MOTION SYSTEM
//  Awwwards-level animation & scroll choreography
// ═══════════════════════════════════════════

// Load GSAP + ScrollTrigger + SplitText-like functionality
const GSAP_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
const ST_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function init() {
  await loadScript(GSAP_CDN);
  await loadScript(ST_CDN);
  gsap.registerPlugin(ScrollTrigger);

  createTopoBg();
  runLoader();
}

// ── TOPOGRAPHIC BG ──
function createTopoBg() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 1440 900');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  let paths = '';
  for (let i = 0; i < 25; i++) {
    const y = 30 + i * 35;
    let d = `M0 ${y}`;
    for (let x = 0; x <= 1440; x += 120) {
      const cy = y + Math.sin(x * 0.003 + i * 0.7) * 40 + Math.cos(x * 0.005 + i) * 20;
      d += ` L${x} ${cy}`;
    }
    paths += `<path d="${d}" fill="none" stroke="#b85a3a" stroke-width="0.5" opacity="${0.3 + Math.random() * 0.3}"/>`;
  }
  svg.innerHTML = paths;
  document.getElementById('topoBg').appendChild(svg);
}

// ── SPLIT TEXT UTILITIES ──
function splitChars(el) {
  const text = el.textContent;
  el.innerHTML = '';
  const chars = [];
  [...text].forEach(ch => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.display = 'inline-block';
    span.style.willChange = 'transform';
    el.appendChild(span);
    chars.push(span);
  });
  return chars;
}

function splitWords(el) {
  const html = el.innerHTML;
  // Split by spaces, but preserve HTML tags (like <span class="accent">)
  const words = [];
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  function processNode(node, container) {
    if (node.nodeType === 3) {
      // Text node — split into words
      const parts = node.textContent.split(/(\s+)/);
      parts.forEach(part => {
        if (part.trim() === '') {
          if (part.length > 0) container.appendChild(document.createTextNode(part));
        } else {
          const wrapper = document.createElement('span');
          wrapper.className = 'word';
          wrapper.style.display = 'inline-block';
          wrapper.style.overflow = 'hidden';
          wrapper.style.verticalAlign = 'top';
          const inner = document.createElement('span');
          inner.style.display = 'inline-block';
          inner.style.willChange = 'transform';
          inner.textContent = part;
          wrapper.appendChild(inner);
          container.appendChild(wrapper);
          words.push(inner);
        }
      });
    } else if (node.nodeType === 1) {
      // Element node — clone and recurse
      const clone = node.cloneNode(false);
      container.appendChild(clone);
      node.childNodes.forEach(child => processNode(child, clone));
    }
  }

  const frag = document.createDocumentFragment();
  tempDiv.childNodes.forEach(child => processNode(child, frag));
  el.innerHTML = '';
  el.appendChild(frag);
  return words;
}

function splitLines(el) {
  const text = el.textContent;
  el.innerHTML = '';
  const wrapper = document.createElement('span');
  wrapper.style.display = 'inline-block';
  wrapper.style.overflow = 'hidden';
  const inner = document.createElement('span');
  inner.textContent = text;
  inner.style.display = 'inline-block';
  inner.style.willChange = 'transform';
  inner.style.transform = 'translateY(100%)';
  wrapper.appendChild(inner);
  el.appendChild(wrapper);
  return inner;
}

// ── LOADER ──
function runLoader() {
  const tl = gsap.timeline({
    onComplete: () => {
      startPage();
    }
  });

  const loaderChars = splitChars(document.querySelector('.loader__text'));

  tl.to(loaderChars, {
    y: 0,
    duration: 1,
    stagger: 0.06,
    ease: 'expo.out',
    delay: 0.3
  })
  .to('.loader__line', {
    scaleX: 1,
    duration: 0.8,
    ease: 'power2.inOut'
  }, '-=0.5')
  .to('.loader__sub', {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.3')
  .to('.loader', {
    yPercent: -100,
    duration: 1.2,
    ease: 'expo.inOut',
    delay: 0.5
  })
  .set('.loader', { display: 'none' });
}

// ── MAIN PAGE ANIMATIONS ──
function startPage() {
  animateHero();
  initNavScroll();
  initMarquee();
  initScrollReveals();
  initScaleWords();
  initImageParallax();
  initStats();
  initMobileNav();
}

// ── MOBILE NAV ──
function initMobileNav() {
  const burger = document.getElementById('navBurger');
  const mobileNav = document.getElementById('mobileNav');
  const links = mobileNav.querySelectorAll('a');
  let scrollPos = 0;

  if (!burger || !mobileNav) return;

  function openMenu() {
    scrollPos = window.scrollY;
    burger.classList.add('active');
    mobileNav.classList.add('open');
    document.body.classList.add('nav-open');
    document.body.style.top = `-${scrollPos}px`;
  }

  function closeMenu() {
    burger.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.classList.remove('nav-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollPos);
  }

  burger.addEventListener('click', () => {
    if (mobileNav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

// ── HERO ──
function animateHero() {
  const tl = gsap.timeline({ delay: 0.2 });

  // Image zoom in
  tl.to('.hero__image img', {
    scale: 1,
    duration: 2.5,
    ease: 'expo.out'
  }, 0);

  // Eyebrow
  const eyebrowInner = splitLines(document.querySelector('.hero__eyebrow'));
  tl.to(eyebrowInner, {
    y: 0,
    duration: 1,
    ease: 'expo.out'
  }, 0.3);

  // Title chars
  const titleChars = splitChars(document.querySelector('.hero__title'));
  tl.to(titleChars, {
    y: 0,
    duration: 1.2,
    stagger: 0.04,
    ease: 'expo.out'
  }, 0.5);

  // Subtitle
  const subInner = splitLines(document.querySelector('.hero__subtitle'));
  tl.to(subInner, {
    y: 0,
    duration: 1,
    ease: 'expo.out'
  }, 1);

  // Meta items
  tl.to('.hero__meta-item', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
  }, 1.2);
}

// ── NAV ──
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  ScrollTrigger.create({
    start: 80,
    onUpdate: (self) => {
      nav.classList.toggle('scrolled', self.scroll() > 80);
    }
  });

  // Active link tracking
  const links = document.querySelectorAll('.nav__links a');
  document.querySelectorAll('[id]').forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveLink(section.id, links),
      onEnterBack: () => setActiveLink(section.id, links),
    });
  });
}

function setActiveLink(id, links) {
  links.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
  });
}

// ── MARQUEE ──
function initMarquee() {
  const track = document.querySelector('.marquee__track');
  const speed = 80; // px per second
  const width = track.scrollWidth / 2;

  gsap.to(track, {
    x: -width,
    duration: width / speed,
    ease: 'none',
    repeat: -1,
  });
}

// ── SCROLL REVEALS ──
function initScrollReveals() {
  // Standard reveals
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
        invalidateOnRefresh: true,
      },
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'expo.out',
    });
  });

  // Chapter lines
  gsap.utils.toArray('.chapter__line').forEach(line => {
    gsap.to(line, {
      scrollTrigger: {
        trigger: line,
        start: 'top 85%',
      },
      scaleX: 1,
      duration: 1.5,
      ease: 'expo.inOut',
    });
  });

  // Section titles — word reveal (preserves line breaks)
  gsap.utils.toArray('.section__title').forEach(title => {
    if (title.querySelector('.word')) return;
    const words = splitWords(title);
    gsap.fromTo(words,
      { y: '100%', opacity: 0 },
      {
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
        },
        y: '0%',
        opacity: 1,
        duration: 0.9,
        stagger: 0.04,
        ease: 'expo.out',
      }
    );
  });

  // Quote blocks — border + text
  gsap.utils.toArray('.quote-block').forEach(q => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: q,
        start: 'top 80%',
      }
    });
    tl.fromTo(q, 
      { borderLeftColor: 'transparent' },
      { borderLeftColor: '#b85a3a', duration: 0.6, ease: 'power2.out' }
    );
    tl.fromTo(q.querySelector('.quote-block__text'),
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1, ease: 'expo.out' },
      0.2
    );
    tl.fromTo(q.querySelector('.quote-block__attr'),
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
      0.6
    );
  });

  // Concept cards — staggered
  gsap.utils.toArray('.concepts').forEach(grid => {
    gsap.fromTo(grid.querySelectorAll('.concept'),
      { opacity: 0, y: 60 },
      {
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
        },
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'expo.out',
      }
    );
  });

  // Timeline items
  gsap.utils.toArray('.timeline__item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -40 },
      {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        },
        opacity: 1,
        x: 0,
        duration: 1,
        delay: i * 0.1,
        ease: 'expo.out',
      }
    );
  });

  // Comparison columns
  gsap.utils.toArray('.comparison').forEach(comp => {
    const cols = comp.querySelectorAll('.comparison__col');
    gsap.fromTo(cols[0],
      { opacity: 0, x: -50 },
      {
        scrollTrigger: { trigger: comp, start: 'top 80%' },
        opacity: 1, x: 0, duration: 1, ease: 'expo.out'
      }
    );
    gsap.fromTo(cols[1],
      { opacity: 0, x: 50 },
      {
        scrollTrigger: { trigger: comp, start: 'top 80%' },
        opacity: 1, x: 0, duration: 1, delay: 0.15, ease: 'expo.out'
      }
    );
  });
}

// ── SCALE WORDS — SCROLL SCRUB ──
function initScaleWords() {
  gsap.utils.toArray('.scale-word__text').forEach(word => {
    gsap.fromTo(word,
      { x: '15%', opacity: 0.5 },
      {
        scrollTrigger: {
          trigger: word.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
        x: '-15%',
        opacity: 1,
        ease: 'none',
      }
    );
  });
}

// ── IMAGE PARALLAX ──
function initImageParallax() {
  gsap.utils.toArray('.split__image img').forEach(img => {
    gsap.to(img, {
      scrollTrigger: {
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      scale: 1,
      y: -60,
      ease: 'none',
    });
  });
}

// ── STATS COUNT-UP ──
function initStats() {
  const section = document.getElementById('statsSection');
  if (!section) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      // Count up numbers
      section.querySelectorAll('.stat__number').forEach(el => {
        const target = parseInt(el.dataset.target);
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2.5,
          ease: 'expo.out',
          onUpdate: function() { el.textContent = Math.round(this.targets()[0].val); }
        });
      });

      // Progress bars
      section.querySelectorAll('.stat__bar-fill').forEach(bar => {
        gsap.to(bar, {
          scaleX: parseInt(bar.dataset.width) / 100,
          duration: 1.8,
          delay: 0.3,
          ease: 'expo.out'
        });
      });

      // Stagger stat blocks
      gsap.fromTo(section.querySelectorAll('.stat'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out' }
      );
    }
  });
}

// ── START ──
document.addEventListener('DOMContentLoaded', init);
