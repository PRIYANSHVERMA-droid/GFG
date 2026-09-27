/* ==========================================================================
   DOOMSDAY — GFG STUDENT CHAPTER × BENNETT UNIVERSITY
   Core Application & Cinematic Animation Controller
   ========================================================================== */

// --- DATA CONSTANTS (Confirmed Event Details & Chapter Profiles) ---
const EVENT_DATE = "OCTOBER 15, 2026";
const EVENT_TIME = "05:30 PM IST";
const EVENT_VENUE = "MAIN AUDITORIUM, BU";
const EVENT_MODE = "OFFLINE // IN-PERSON (CAMPUS)";
const REGISTRATION_URL = "register.html";
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/geeksforgeeks_bu/",
  linkedin: "https://www.linkedin.com/company/geeksforgeeks-bu-student-chapter/",
  github: "https://github.com/gfg-bu",
  discord: "https://discord.gg/bennett-gfg"
};

// Device & Accessibility Flags
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobileDevice = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initDataBinding();
  initLenis();
  initNavigation();
  initIntroSequence();
  initHeroParticles();
  initCosmicCollision();
  initTrailer();
  initBreachAndSelector();
  initHeroCardReveal();
  initCharacterSections();
  initStatDecryptionAnimation();
  initHighlightsInteraction();
  initPerksAndSocialProof();
  initTimelineScroll();
  initMagneticButton();
  initIpCreditsModal();
  initTabVisibilityLifecycle();
});

/* ==========================================================================
   1. DATA BINDING (Inject constants into DOM & wire up links)
   ========================================================================== */
function initDataBinding() {
  // Event stats
  const dateEl = document.getElementById('stat-event-date');
  const timeEl = document.getElementById('stat-event-time');
  const venueEl = document.getElementById('stat-event-venue');
  const modeEl = document.getElementById('stat-event-mode');

  if (dateEl) dateEl.textContent = EVENT_DATE;
  if (timeEl) timeEl.textContent = EVENT_TIME;
  if (venueEl) venueEl.textContent = EVENT_VENUE;
  if (modeEl) modeEl.textContent = EVENT_MODE;

  // Registration links
  const regBtn = document.getElementById('main-register-btn');
  const navRegBtn = document.getElementById('nav-register-cta');
  const heroPrimaryBtn = document.getElementById('hero-primary-cta');
  const mobileRegBtn = document.querySelector('.mobile-nav-link--accent');

  if (regBtn) regBtn.href = REGISTRATION_URL;
  if (navRegBtn && REGISTRATION_URL !== "#") navRegBtn.href = REGISTRATION_URL;
  if (heroPrimaryBtn && REGISTRATION_URL !== "#") heroPrimaryBtn.href = REGISTRATION_URL;
  if (mobileRegBtn && REGISTRATION_URL !== "#") mobileRegBtn.href = REGISTRATION_URL;

  // Social links
  const instaLink = document.getElementById('social-instagram');
  const linkedinLink = document.getElementById('social-linkedin');
  const githubLink = document.getElementById('social-github');
  const discordLink = document.getElementById('social-discord');

  if (instaLink) instaLink.href = SOCIAL_LINKS.instagram;
  if (linkedinLink) linkedinLink.href = SOCIAL_LINKS.linkedin;
  if (githubLink) githubLink.href = SOCIAL_LINKS.github;
  if (discordLink) discordLink.href = SOCIAL_LINKS.discord;
}

/* ==========================================================================
   2. SMOOTH SCROLL (LENIS + GSAP SCROLLTRIGGER INTEGRATION)
   ========================================================================== */
let lenis = null;

function initLenis() {
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis library not loaded; falling back to native scroll.');
    return;
  }

  // Initialize Lenis with refined cinematic inertia
  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.5,
  });

  // Synchronize Lenis with GSAP ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Anchor Link Smooth Scrolling with Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        
        // Close mobile drawer if open
        closeMobileMenu();

        if (lenis) {
          lenis.scrollTo(targetEl, {
            offset: -30,
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   3. GLOBAL NAVIGATION (Consolidated & Synchronized)
   ========================================================================== */
function initNavigation() {
  const nav = document.getElementById('global-nav');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link:not(.mobile-nav-link--accent)');
  const navRegisterCta = document.getElementById('nav-register-cta');

  // Sticky navbar shadow and glassmorphism on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }, { passive: true });

  // Mobile menu drawer toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.classList.toggle('is-active', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Close button inside the mobile menu overlay
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => {
      closeMobileMenu();
    });
  }

  // Close mobile menu on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // Section groupings mapping to single consolidated nav buttons
  const navMappings = [
    {
      key: 'trailer',
      triggers: ['#trailer']
    },
    {
      key: 'heroes',
      triggers: ['#breach-selector', '#hero-doom', '#hero-spiderman', '#hero-thor', '#hero-cap']
    },
    {
      key: 'mission',
      triggers: ['#mission-intro', '#highlights-block']
    },
    {
      key: 'perks',
      triggers: ['#perks-block']
    },
    {
      key: 'timeline',
      triggers: ['#timeline-block']
    },
    {
      key: 'register',
      triggers: ['#register-block']
    }
  ];

  function setActiveKey(activeKey) {
    desktopNavLinks.forEach((link) => {
      if (link.getAttribute('data-section') === activeKey) {
        link.classList.add('nav-active');
      } else {
        link.classList.remove('nav-active');
      }
    });

    mobileNavLinks.forEach((link) => {
      if (link.getAttribute('data-section') === activeKey) {
        link.classList.add('mobile-nav-active');
      } else {
        link.classList.remove('mobile-nav-active');
      }
    });

    if (navRegisterCta) {
      if (activeKey === 'register') {
        navRegisterCta.classList.add('nav-cta-pulse-active');
      } else {
        navRegisterCta.classList.remove('nav-cta-pulse-active');
      }
    }
  }

  // Track active section with ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    navMappings.forEach((group) => {
      group.triggers.forEach((sel) => {
        const el = document.querySelector(sel);
        if (el) {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 55%',
            end: 'bottom 45%',
            onEnter: () => setActiveKey(group.key),
            onEnterBack: () => setActiveKey(group.key),
          });
        }
      });
    });

    // Reset at top hero
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      ScrollTrigger.create({
        trigger: heroEl,
        start: 'top 80%',
        end: 'bottom 60%',
        onEnterBack: () => {
          desktopNavLinks.forEach((l) => l.classList.remove('nav-active'));
          mobileNavLinks.forEach((l) => l.classList.remove('mobile-nav-active'));
        }
      });
    }
  }
}

function closeMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.classList.remove('is-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   4. MARVEL × GFG FLIPBOOK INTRO SEQUENCE (With Mobile Acceleration)
   ========================================================================== */
function initIntroSequence() {
  const intro = document.getElementById('intro-screen');
  const skipBtn = document.getElementById('intro-skip-btn');
  const progressFill = document.getElementById('intro-progress-fill');
  if (!intro) return;

  let introDismissed = false;

  function dismissIntro(withFade = true) {
    if (introDismissed) return;
    introDismissed = true;

    // Explicitly freeze/stop running CSS animations on flipbook to conserve CPU/GPU
    const flipbook = intro.querySelector('.marvel-flipbook-film');
    if (flipbook) {
      flipbook.classList.add('frozen');
    }

    const finish = () => {
      intro.style.display = 'none';
      intro.style.pointerEvents = 'none';
      document.body.classList.remove('is-loading');
      animateHeroEntrance();
    };

    if (withFade && typeof gsap !== 'undefined') {
      gsap.to(intro, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: finish
      });
    } else {
      finish();
    }
  }

  // Skip button click & ESC key handler (interrupts mid-flight, needs own fade)
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissIntro(true);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !introDismissed) {
      dismissIntro(true);
    }
  });

  // Graceful degradation on mobile or reduced motion:
  if (prefersReducedMotion || typeof gsap === 'undefined') {
    dismissIntro(false);
    return;
  }

  // Fast-track on mobile devices for smooth performance & instant responsiveness
  if (isMobileDevice) {
    setTimeout(() => {
      dismissIntro(true);
    }, 450);
    return;
  }

  // Desktop Cinematic Timeline (~1.55s total)
  const tl = gsap.timeline({
    onComplete: () => {
      dismissIntro(false);
    }
  });

  if (progressFill) {
    tl.to(progressFill, {
      width: '100%',
      duration: 1.3,
      ease: 'power1.inOut'
    }, 0);
  }

  tl.fromTo('.marvel-red-box',
      { scale: 0.7, opacity: 0, y: 15 },
      { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'back.out(2)' },
      0.15
    )
    .fromTo('.marvel-studios-strip',
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
      0.35
    )
    .fromTo('.marvel-title-doomsday',
      { scale: 0.85, opacity: 0, letterSpacing: '0.25em' },
      { scale: 1, opacity: 1, letterSpacing: '0.12em', duration: 0.4, ease: 'power3.out' },
      0.55
    )
    .to(intro, {
      opacity: 0,
      scale: 1.03,
      duration: 0.4,
      ease: 'power2.inOut'
    }, 1.15);
}

function animateHeroEntrance() {
  if (typeof gsap === 'undefined' || prefersReducedMotion) return;

  const heroTl = gsap.timeline();
  heroTl.from('.hero-eyebrow-wrap', { opacity: 0, y: 15, duration: 0.6, ease: 'power2.out' })
    .from('.hero-title .title-line', {
      opacity: 0,
      y: 35,
      stagger: 0.14,
      duration: 0.75,
      ease: 'power3.out'
    }, '-=0.35')
    .from('.hero-support', { opacity: 0, y: 15, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .from('.hero-actions .btn', {
      opacity: 0,
      y: 15,
      stagger: 0.12,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.35')
    .from('#doom-hero-visual', {
      scale: 0.82,
      opacity: 0,
      duration: 1.1,
      ease: 'power2.out'
    }, '-=0.8');
}

/* ==========================================================================
   5. HERO PARTICLES (Canvas emerald drift)
   ========================================================================== */
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 24 : 52;

  function resizeCanvas() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2 + 0.8;
      this.speedY = Math.random() * 0.7 + 0.25;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.55 + 0.2;
      this.hue = Math.random() > 0.4 ? '58, 255, 160' : '217, 30, 54'; // Emerald with occasional red multiverse flare
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.hue}, ${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.hue}, 0.8)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function renderParticles() {
    ctx.clearRect(0, 0, width, height);

    // Only render if hero is near viewport to save GPU
    if (window.scrollY < window.innerHeight * 1.5) {
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
    }

    requestAnimationFrame(renderParticles);
  }

  renderParticles();
}

/* ==========================================================================
   5.1  COSMIC COLLISION — scroll-driven planet convergence & impact
   Two planet orbs (emerald-green / crimson-red) drift from opposite screen
   edges toward centre as the user scrolls past the #trailer section toward
   #breach-selector. At full convergence the collision syncs with the breach
   fracture crack, then the canvas fades out over ~300 px of additional scroll.
   ========================================================================== */
function initCosmicCollision() {
  if (prefersReducedMotion) return;

  const canvas = document.getElementById('cosmic-collision-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  /* ── dimensions ── */
  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── planet config ── */
  const EMERALD  = { r: 0.058, g: 1.0,  b: 0.627 };   /* #3AFFA0 */
  const CRIMSON  = { r: 0.851, g: 0.118, b: 0.212 };   /* #D91E36 */

  const baseRadius  = isMobileDevice ? 45 : 80;
  const glowRadius  = isMobileDevice ? 90 : 170;
  const ringRadius  = isMobileDevice ? 52 : 95;
  const RING_WIDTH  = isMobileDevice ? 1 : 1.5;

  /* ── state driven by ScrollTrigger ── */
  let progress    = 0;   /* 0 → 1 : convergence phase                */
  let fadeProgress = 0;  /* 0 → 1 : post-collision fade-out phase     */
  let collided     = false;

  /* ── convergence ScrollTrigger (trailer → breach-beat) ── */
  /* Planets start converging after the trailer and collide at the breach */
  ScrollTrigger.create({
    trigger: '#trailer',
    start: 'bottom 80%',
    endTrigger: '#breach-beat',
    end: 'top 80%',
    scrub: true,
    onUpdate: (self) => { progress = self.progress; },
  });

  /* ── fade-out ScrollTrigger (breach-beat → +300px) ── */
  ScrollTrigger.create({
    trigger: '#breach-beat',
    start: 'top 80%',
    end: '+=300',
    scrub: true,
    onUpdate: (self) => { fadeProgress = self.progress; },
  });

  /* ── screen shake & collision state ── */
  let flashAlpha = 0;

  /* ── drawing helpers ── */
  function drawPlanet(cx, cy, col, radius, glow, ring, alpha) {
    if (alpha <= 0.001) return;
    ctx.save();
    ctx.globalAlpha = alpha;

    /* outer glow */
    const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, glow);
    grad.addColorStop(0, `rgba(${col.r * 255 | 0}, ${col.g * 255 | 0}, ${col.b * 255 | 0}, 0.45)`);
    grad.addColorStop(0.5, `rgba(${col.r * 255 | 0}, ${col.g * 255 | 0}, ${col.b * 255 | 0}, 0.12)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, glow, 0, Math.PI * 2);
    ctx.fill();

    /* core orb */
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    core.addColorStop(0, `rgba(${col.r * 255 | 0}, ${col.g * 255 | 0}, ${col.b * 255 | 0}, 0.95)`);
    core.addColorStop(0.7, `rgba(${col.r * 255 | 0}, ${col.g * 255 | 0}, ${col.b * 255 | 0}, 0.55)`);
    core.addColorStop(1, 'transparent');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    /* subtle ring */
    ctx.strokeStyle = `rgba(${col.r * 255 | 0}, ${col.g * 255 | 0}, ${col.b * 255 | 0}, 0.3)`;
    ctx.lineWidth = RING_WIDTH;
    ctx.beginPath();
    ctx.arc(cx, cy, ring, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  /* ── COSMIC PARTICLE EXPLOSION & SHOCKWAVE SYSTEM ── */
  const EXPLOSION_COUNT = isMobileDevice ? 60 : 130;
  const explosionParticles = [];
  const shockwaves = [];

  class ExplosionParticle {
    constructor() {
      this.active = false;
    }
    ignite(ox, oy) {
      this.x = ox + (Math.random() - 0.5) * 16;
      this.y = oy + (Math.random() - 0.5) * 16;
      this.prevX = this.x;
      this.prevY = this.y;

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isMobileDevice ? 9 : 15) + 3;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;

      this.life = 1.0;
      this.decay = Math.random() * 0.012 + 0.006;
      this.drag = Math.random() * 0.02 + 0.95;
      this.r = Math.random() * (isMobileDevice ? 2.5 : 4.5) + 1;

      // Multiverse color scheme: Emerald (Doom), Crimson (Spidey), Solar Gold, White core
      const pick = Math.random();
      if (pick < 0.42) {
        this.color = '58, 255, 160'; // Emerald #3AFFA0
      } else if (pick < 0.84) {
        this.color = '217, 30, 54';  // Crimson #D91E36
      } else if (pick < 0.93) {
        this.color = '255, 220, 110'; // Solar flare gold
      } else {
        this.color = '255, 255, 255'; // Hyperdrive singularity white
      }

      this.active = true;
    }
    update() {
      if (!this.active) return;
      this.prevX = this.x;
      this.prevY = this.y;
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.life -= this.decay;
      if (this.life <= 0) this.active = false;
    }
    draw() {
      if (!this.active) return;
      const alpha = Math.max(0, this.life);

      // High-velocity streak trail
      const speedSq = this.vx * this.vx + this.vy * this.vy;
      if (speedSq > 2.5) {
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `rgba(${this.color}, ${alpha * 0.85})`;
        ctx.lineWidth = Math.max(1, this.r * 0.7);
        ctx.stroke();
      }

      // Luminous particle body
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * (0.6 + 0.4 * alpha), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < EXPLOSION_COUNT; i++) {
    explosionParticles.push(new ExplosionParticle());
  }

  class Shockwave {
    constructor(x, y, maxR, speed, color, maxLine) {
      this.x = x;
      this.y = y;
      this.r = 8;
      this.maxR = maxR;
      this.speed = speed;
      this.color = color;
      this.maxLine = maxLine;
      this.active = true;
    }
    update() {
      if (!this.active) return;
      this.r += this.speed;
      this.speed *= 0.965;
      if (this.r >= this.maxR || this.speed < 0.2) {
        this.active = false;
      }
    }
    draw() {
      if (!this.active) return;
      const progress = this.r / this.maxR;
      const alpha = Math.max(0, (1 - progress) * 0.8);
      const lineWidth = Math.max(0.5, (1 - progress) * this.maxLine);

      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${this.color}, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ── ignite explosion when planets collide ── */
  function triggerCosmicExplosion(cx, cy) {
    if (collided) return;
    collided = true;

    // 1. Screen impact flare
    flashAlpha = 0.85;

    // 2. Camera micro-shake on smooth wrapper
    const wrapper = document.getElementById('smooth-wrapper');
    if (wrapper) {
      gsap.to(wrapper, {
        x: () => (Math.random() - 0.5) * 8,
        y: () => (Math.random() - 0.5) * 6,
        duration: 0.05,
        repeat: 7,
        yoyo: true,
        ease: 'none',
        onComplete: () => gsap.set(wrapper, { x: 0, y: 0 }),
      });
    }

    // 3. Ignite 100+ burst particles
    explosionParticles.forEach(p => p.ignite(cx, cy));

    // 4. Trigger expanding cosmic shockwaves
    shockwaves.length = 0;
    const maxWave = Math.min(W, H) * (isMobileDevice ? 0.7 : 0.85);
    // White singularity ionization ring
    shockwaves.push(new Shockwave(cx, cy, maxWave, 18, '255, 255, 255', 6));
    // Emerald Doom wave
    shockwaves.push(new Shockwave(cx, cy, maxWave * 0.85, 14, '58, 255, 160', 4.5));
    // Crimson Spider-Man wave
    shockwaves.push(new Shockwave(cx, cy, maxWave * 0.72, 10, '217, 30, 54', 4));
  }

  /* ── render loop ── */
  function render() {
    requestAnimationFrame(render);

    /* tab-inactive check (mirror initHeroParticles pattern) */
    if (document.body.classList.contains('tab-inactive')) return;

    const hasActiveFx = explosionParticles.some(p => p.active) || shockwaves.some(sw => sw.active) || flashAlpha > 0.02;

    /* skip when fully faded out and no explosion active */
    if (fadeProgress >= 1 && !hasActiveFx) {
      ctx.clearRect(0, 0, W, H);
      return;
    }

    /* skip when hero is nowhere near viewport and no explosion active */
    const scrollY = window.scrollY || window.pageYOffset;
    const maxVisible = window.innerHeight * 4;
    if (scrollY > maxVisible && !hasActiveFx) {
      ctx.clearRect(0, 0, W, H);
      return;
    }

    ctx.clearRect(0, 0, W, H);

    /* canvas-level fade for the post-collision dissolve */
    const canvasAlpha = 1 - fadeProgress;

    /* ── planet positions ── */
    const margin = isMobileDevice ? 60 : 120;

    /* eased convergence (ease-in-out feel) */
    const t = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    /* emerald: starts top-left, converges to centre */
    const emeraldX = margin + (W / 2 - margin) * t;
    const emeraldY = margin + (H / 2 - margin) * t;

    /* crimson: starts bottom-right, converges to centre */
    const crimsonX = W - margin - (W / 2 - margin) * t;
    const crimsonY = H - margin - (H / 2 - margin) * t;

    const midX = (emeraldX + crimsonX) / 2;
    const midY = (emeraldY + crimsonY) / 2;

    /* radius pulsation (subtle breathing) */
    const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.06;

    /* Upon collision impact (progress > 0.94), planets shatter into the explosion */
    const shatterFactor = progress >= 0.94 ? Math.max(0, 1 - (progress - 0.94) / 0.06) : 1;
    const planetAlpha = canvasAlpha * shatterFactor;

    if (planetAlpha > 0.01) {
      drawPlanet(emeraldX, emeraldY, EMERALD, baseRadius * pulse, glowRadius * pulse, ringRadius * pulse, planetAlpha);
      drawPlanet(crimsonX, crimsonY, CRIMSON, baseRadius * pulse, glowRadius * pulse, ringRadius * pulse, planetAlpha);
    }

    /* ── energy tendrils when close (progress > 0.6) ── */
    if (progress > 0.6 && shatterFactor > 0.1) {
      const tendrilAlpha = ((progress - 0.6) / 0.4) * 0.35 * canvasAlpha * shatterFactor;
      ctx.save();
      ctx.globalAlpha = tendrilAlpha;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = isMobileDevice ? 0.5 : 1;

      const wobble = Math.sin(Date.now() * 0.004) * 30;

      ctx.beginPath();
      ctx.moveTo(emeraldX, emeraldY);
      ctx.quadraticCurveTo(midX + wobble, midY - wobble, crimsonX, crimsonY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(emeraldX, emeraldY);
      ctx.quadraticCurveTo(midX - wobble, midY + wobble, crimsonX, crimsonY);
      ctx.stroke();

      ctx.restore();
    }

    /* ── collision trigger (planets collide at centre) ── */
    if (progress >= 0.94) {
      triggerCosmicExplosion(midX, midY);
    }

    /* ── render shockwaves ── */
    shockwaves.forEach(sw => {
      sw.update();
      sw.draw();
    });

    /* ── render explosion particles ── */
    explosionParticles.forEach(p => {
      p.update();
      p.draw();
    });

    /* ── render impact flare / screen flash ── */
    if (flashAlpha > 0.01) {
      ctx.save();
      // Core radial flare
      const flareR = Math.min(W, H) * (isMobileDevice ? 0.6 : 0.8);
      const flareGrad = ctx.createRadialGradient(midX, midY, 0, midX, midY, flareR);
      flareGrad.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha * 0.9})`);
      flareGrad.addColorStop(0.25, `rgba(58, 255, 160, ${flashAlpha * 0.45})`);
      flareGrad.addColorStop(0.55, `rgba(217, 30, 54, ${flashAlpha * 0.35})`);
      flareGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, W, H);

      // Light ambient flash
      ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.25})`;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      flashAlpha *= 0.89; // Smooth fade-out
    }

    /* Reset collision flag when scrolling back up */
    if (progress < 0.82 && collided) {
      collided = false;
    }
  }

  render();
}

/* ==========================================================================
   5B. TRAILER SECTION (Video Player & Scroll Reveal)
   ========================================================================== */
function initTrailer() {
  const section     = document.getElementById('trailer');
  const video       = document.getElementById('trailer-video');
  const wrap        = document.getElementById('trailer-player-wrap');
  const playOverlay = document.getElementById('trailer-play-overlay');
  const btnPlay     = document.getElementById('trailer-btn-playpause');
  const btnMute     = document.getElementById('trailer-btn-mute');
  const btnFS       = document.getElementById('trailer-btn-fullscreen');
  const progressWrap= document.getElementById('trailer-progress-wrap');
  const progressBar = document.getElementById('trailer-progress-bar');
  const timeDisplay = document.getElementById('trailer-time');

  if (!section || !video || !wrap) return;

  // --- Scroll Reveal ---
  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      once: true,
      onEnter: () => section.classList.add('is-revealed'),
    });

    // Auto-pause when scrolled away
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => { if (!video.paused) video.pause(); },
      onLeaveBack: () => { if (!video.paused) video.pause(); },
    });
  } else {
    // Fallback: reveal immediately
    section.classList.add('is-revealed');
  }

  // --- Format time helper ---
  function fmt(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updateTime() {
    if (timeDisplay) {
      timeDisplay.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
    }
  }

  // --- Play / Pause ---
  function playVideo() {
    video.play().then(() => {
      wrap.classList.add('is-playing');
      if (playOverlay) playOverlay.classList.add('is-hidden');
    }).catch(() => { /* autoplay blocked — user will click again */ });
  }

  function pauseVideo() {
    video.pause();
    wrap.classList.remove('is-playing');
  }

  function togglePlay() {
    if (video.paused || video.ended) {
      playVideo();
    } else {
      pauseVideo();
    }
  }

  // Big play overlay click
  if (playOverlay) {
    playOverlay.addEventListener('click', () => {
      playVideo();
    });
  }

  // Click on video toggles play/pause
  video.addEventListener('click', togglePlay);

  // Small play/pause button
  if (btnPlay) btnPlay.addEventListener('click', togglePlay);

  // When video ends, reset to poster state
  video.addEventListener('ended', () => {
    wrap.classList.remove('is-playing');
    if (playOverlay) playOverlay.classList.remove('is-hidden');
    if (progressBar) progressBar.style.width = '0%';
  });

  // When paused externally (e.g. scroll away)
  video.addEventListener('pause', () => {
    wrap.classList.remove('is-playing');
  });

  video.addEventListener('play', () => {
    wrap.classList.add('is-playing');
    if (playOverlay) playOverlay.classList.add('is-hidden');
  });

  // --- Progress Bar ---
  video.addEventListener('timeupdate', () => {
    if (video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      if (progressBar) progressBar.style.width = `${pct}%`;
    }
    updateTime();
  });

  video.addEventListener('loadedmetadata', updateTime);

  // Click on progress bar to seek
  if (progressWrap) {
    progressWrap.addEventListener('click', (e) => {
      const rect = progressWrap.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      video.currentTime = pct * video.duration;
    });
  }

  // --- Mute / Unmute ---
  video.muted = true; // Start muted for autoplay compatibility

  if (btnMute) {
    btnMute.addEventListener('click', () => {
      video.muted = !video.muted;
      wrap.classList.toggle('is-unmuted', !video.muted);
    });
  }

  // --- Fullscreen ---
  if (btnFS) {
    btnFS.addEventListener('click', () => {
      if (wrap.requestFullscreen) {
        wrap.requestFullscreen();
      } else if (wrap.webkitRequestFullscreen) {
        wrap.webkitRequestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        // iOS Safari
        video.webkitEnterFullscreen();
      }
    });
  }
}

/* ==========================================================================
   6. MULTIVERSE BREACH & HERO SELECTOR (360° 3D TWIRL SYSTEM)
   ========================================================================== */
function initBreachAndSelector() {
  const breachSection = document.getElementById('breach-selector');
  const wrappers = document.querySelectorAll('.hero-card-3d-wrapper');
  const twirlAllBtn = document.getElementById('btn-twirl-all');

  // Background tint shifts toward hovered character's accent color
  const heroTints = {
    doom: 'radial-gradient(circle at 50% 50%, rgba(15, 61, 46, 0.35) 0%, #0E0E0E 75%)',
    spiderman: 'radial-gradient(circle at 50% 50%, rgba(217, 30, 54, 0.2) 0%, #0E0E0E 75%)',
    thor: 'radial-gradient(circle at 50% 50%, rgba(123, 92, 255, 0.22) 0%, #0E0E0E 75%)',
    cap: 'radial-gradient(circle at 50% 50%, rgba(27, 42, 74, 0.45) 0%, #0E0E0E 75%)',
  };

  wrappers.forEach((wrapper) => {
    const heroKey = wrapper.getAttribute('data-hero');
    const flipper = wrapper.querySelector('.hero-card-flipper');
    const glare = wrapper.querySelector('.card-specular-glare');
    const frontCard = wrapper.querySelector('.card-front');
    const backCard = wrapper.querySelector('.card-back');
    const twirlBtn = wrapper.querySelector('.card-twirl-action-btn');
    const flipbackBtn = wrapper.querySelector('.card-flipback-btn');

    // Section ambient background tint on card hover
    wrapper.addEventListener('mouseenter', () => {
      if (breachSection && heroTints[heroKey]) {
        breachSection.style.background = heroTints[heroKey];
      }
    });

    wrapper.addEventListener('mouseleave', () => {
      if (breachSection) {
        breachSection.style.background = '#0E0E0E';
      }
      if (flipper && !flipper.classList.contains('is-flipped')) {
        flipper.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });

    // 3D Parallax Tilt tracking cursor coordinates
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
      wrapper.addEventListener('mousemove', (e) => {
        if (!flipper || flipper.classList.contains('is-flipped') || flipper.classList.contains('is-twirling-360')) {
          return;
        }

        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const rotX = -y * 18;
        const rotY = x * 20;

        flipper.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

        if (glare) {
          const glareX = (x + 0.5) * 100;
          const glareY = (y + 0.5) * 100;
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.16) 0%, transparent 60%)`;
        }
      });
    }

    // 360° Twirl Button Click: Spins card 360° and toggles 3D dossier
    if (twirlBtn && flipper) {
      twirlBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerCard360Twirl(flipper);
      });
    }

    // Flipback Button Click: Returns card to front face
    if (flipbackBtn && flipper) {
      flipbackBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        flipper.classList.remove('is-flipped');
        flipper.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      });
    }

    // Front Card Click & Keyboard activation
    if (frontCard) {
      frontCard.addEventListener('click', () => {
        const targetId = frontCard.getAttribute('data-target');
        scrollToHeroRealm(targetId);
      });

      frontCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const targetId = frontCard.getAttribute('data-target');
          scrollToHeroRealm(targetId);
        } else if (e.key === 'Escape' && flipper && flipper.classList.contains('is-flipped')) {
          e.preventDefault();
          flipper.classList.remove('is-flipped');
          flipper.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
        }
      });
    }

    // Back Card Action Link: Smooth scroll to hero section
    const dossierActionBtn = wrapper.querySelector('.btn-dossier-action');
    if (dossierActionBtn) {
      dossierActionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = dossierActionBtn.getAttribute('href');
        scrollToHeroRealm(targetId);
      });
    }
  });

  // Tablist Keyboard Arrow Navigation (Accessible Roster Selection)
  const cardTabs = Array.from(document.querySelectorAll('.hero-card.card-front[role="tab"]'));
  cardTabs.forEach((card, index) => {
    card.addEventListener('keydown', (e) => {
      let nextIndex = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (index + 1) % cardTabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (index - 1 + cardTabs.length) % cardTabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = cardTabs.length - 1;
      }

      if (nextIndex !== null) {
        cardTabs[nextIndex].focus();
      }
    });
  });

  // Global 360° Multiverse Scan: Sequential cascading 360° twirl across all cards
  if (twirlAllBtn) {
    twirlAllBtn.addEventListener('click', () => {
      const flippers = document.querySelectorAll('.hero-card-flipper');
      twirlAllBtn.classList.add('is-scanning');

      flippers.forEach((flipper, idx) => {
        setTimeout(() => {
          flipper.classList.add('is-twirling-360');
          setTimeout(() => {
            flipper.classList.remove('is-twirling-360');
          }, 950);
        }, idx * 160);
      });

      setTimeout(() => {
        twirlAllBtn.classList.remove('is-scanning');
      }, flippers.length * 160 + 950);
    });
  }

  function triggerCard360Twirl(flipper) {
    flipper.classList.add('is-twirling-360');
    setTimeout(() => {
      flipper.classList.remove('is-twirling-360');
      flipper.classList.toggle('is-flipped');
      if (!flipper.classList.contains('is-flipped')) {
        flipper.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      }
    }, 450);
  }

  function scrollToHeroRealm(targetId) {
    if (!targetId) return;
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      if (lenis) {
        lenis.scrollTo(targetSection, { offset: -30, duration: 1.4 });
      } else {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) {
    return;
  }

  // Breach Scrub: Jagged fracture SVG lines widen as user scrolls
  const breachTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#breach-beat',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
    }
  });

  breachTl.to('.crack-1', { strokeWidth: 5, strokeDashoffset: 15, scale: 1.04, transformOrigin: 'center' }, 0)
          .to('.crack-2', { strokeWidth: 4, strokeDashoffset: -20, scale: 1.03, transformOrigin: 'center' }, 0)
          .to('.crack-3', { strokeWidth: 2.8, strokeDashoffset: 30 }, 0)
          .fromTo('.breach-text-wrap', { scale: 0.95 }, { scale: 1.05 }, 0);

}

/* ==========================================================================
   6.1 HERO SELECTOR CARD REVEAL ANIMATION (Center-Out Reveal)
   ========================================================================== */
function initHeroCardReveal() {
  if (typeof gsap === 'undefined') return;

  const cards = gsap.utils.toArray('.hero-card-3d-wrapper');
  if (!cards.length) return;

  if (prefersReducedMotion) {
    gsap.set(cards, { opacity: 1, scale: 1, y: 0 });
    return;
  }

  gsap.set(cards, { opacity: 0, y: 50, scale: 0.82 });

  if (typeof ScrollTrigger === 'undefined') {
    gsap.to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.75 });
    return;
  }

  ScrollTrigger.create({
    trigger: '#selector-beat',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        ease: 'back.out(1.5)',
        stagger: { each: 0.14, from: 'center' }
      });
    }
  });
}

/* ==========================================================================
   7. CHARACTER SECTIONS (Reusable animation architecture)
   ========================================================================== */
function initCharacterSections() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const characters = [
    { id: '#hero-doom', accent: '#3AFFA0', visual: '#char-visual-doom' },
    { id: '#hero-spiderman', accent: '#D91E36', visual: '#char-visual-spiderman' },
    { id: '#hero-thor', accent: '#7B5CFF', visual: '#char-visual-thor' },
    { id: '#hero-cap', accent: '#5E81AC', visual: '#char-visual-cap' },
  ];

  characters.forEach((char) => {
    buildCharacterAnimation(char.id, char.accent, char.visual);
  });

  // Section Boundary Transition Animations
  initSectionTransitions();
}

/**
 * Reusable function to wire up character reveals & scroll intensity
 * @param {string} sectionSelector - e.g. '#hero-doom'
 * @param {string} accentColor - e.g. '#3AFFA0'
 * @param {string} visualSelector - e.g. '#char-visual-doom'
 */
function buildCharacterAnimation(sectionSelector, accentColor, visualSelector) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  if (prefersReducedMotion) return;

  // Staggered text & info reveal
  const copyElements = section.querySelectorAll(
    '.char-eyebrow-row, .char-name, .char-descriptor, .char-divider, .char-bio, .char-traits'
  );

  gsap.from(copyElements, {
    scrollTrigger: {
      trigger: section,
      start: 'top 65%',
    },
    y: 35,
    opacity: 0,
    stagger: 0.1,
    duration: 0.75,
    ease: 'power3.out',
  });

  // Scroll-driven intensity: glow & rotation subtly scale with section scroll progress
  const visual = section.querySelector(visualSelector);
  if (visual) {
    gsap.to(visual, {
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
      scale: 1.08,
      rotation: 6,
      ease: 'none',
    });
  }
}

/* Specific Section-End Boundary Transitions */
function initSectionTransitions() {
  if (prefersReducedMotion) return;

  // 1. Doom -> Spider-Man: green glow fractures outward into red web-line streaks
  gsap.fromTo('#trans-doom-spidey .fracture-out', 
    { strokeDashoffset: 100, strokeWidth: 1 },
    {
      strokeDashoffset: 0,
      strokeWidth: 4,
      scrollTrigger: {
        trigger: '#hero-doom',
        start: 'bottom 40%',
        end: 'bottom top',
        scrub: 1,
      }
    }
  );
  gsap.fromTo('#trans-doom-spidey .web-streak', 
    { opacity: 0, scale: 0.6 },
    {
      opacity: 1,
      scale: 1.15,
      transformOrigin: 'left center',
      scrollTrigger: {
        trigger: '#hero-doom',
        start: 'bottom 35%',
        end: 'bottom top',
        scrub: 1,
      }
    }
  );

  // 2. Spider-Man -> Thor: a web line travels upward and morphs into a lightning bolt
  gsap.fromTo('#trans-spidey-thor .spidey-lead-line',
    { strokeDashoffset: 200 },
    {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: '#hero-spiderman',
        start: 'bottom 40%',
        end: 'bottom top',
        scrub: 1,
      }
    }
  );
  gsap.fromTo('#trans-spidey-thor .lightning-morph',
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: '#hero-spiderman',
        start: 'bottom 30%',
        end: 'bottom top',
        scrub: 0.8,
      }
    }
  );

  // 3. Thor -> Captain America: lightning flash resolves into shield outline
  gsap.fromTo('#trans-thor-cap .trans-flash-ring',
    { scale: 0.5, opacity: 1 },
    {
      scale: 2.2,
      opacity: 0,
      scrollTrigger: {
        trigger: '#hero-thor',
        start: 'bottom 40%',
        end: 'bottom top',
        scrub: 1,
      }
    }
  );
  gsap.fromTo('#trans-thor-cap .trans-shield-ring',
    { scale: 0.7, opacity: 0.2 },
    {
      scale: 1.25,
      opacity: 0.9,
      scrollTrigger: {
        trigger: '#hero-thor',
        start: 'bottom 30%',
        end: 'bottom top',
        scrub: 1,
      }
    }
  );

  // 4. Captain America -> Mission: shield outline expands to fill viewport, fades into next section
  gsap.fromTo('.expanding-shield-ring',
    { width: 90, height: 90, opacity: 0.6 },
    {
      width: '130vw',
      height: '130vw',
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#hero-cap',
        start: 'bottom 50%',
        end: 'bottom top',
        scrub: 1.2,
      }
    }
  );
}

/* ==========================================================================
   8. HIGHLIGHTS INTERACTION (Hover & Tap expansion)
   ========================================================================== */
function initHighlightsInteraction() {
  const items = document.querySelectorAll('.highlight-item');
  items.forEach((item) => {
    item.addEventListener('click', () => {
      // Toggle expansion for touch devices
      item.classList.toggle('is-expanded');
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('is-expanded');
      }
    });
  });
}

/* ==========================================================================
   9. TIMELINE SCRUB & MISSION REVEAL
   ========================================================================== */
function initTimelineScroll() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const timelineContainer = document.querySelector('.timeline-container');
  const railFill = document.getElementById('timeline-rail-fill');
  const steps = document.querySelectorAll('.timeline-step');

  if (!timelineContainer || !railFill || prefersReducedMotion) return;

  // Scrub the vertical timeline rail fill specifically tied to the timeline container height
  ScrollTrigger.create({
    trigger: timelineContainer,
    start: 'top 60%',
    end: 'bottom 60%',
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      railFill.style.height = `${progress * 100}%`;

      // Highlight steps as fill progress passes them
      steps.forEach((step, idx) => {
        const threshold = (idx + 0.3) / steps.length;
        if (progress >= threshold) {
          step.classList.add('is-active');
        } else {
          step.classList.remove('is-active');
        }
      });
    },
  });

  // Highlights cards reveal
  gsap.from('.highlight-item', {
    scrollTrigger: {
      trigger: '#highlights-block',
      start: 'top 75%',
    },
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out',
  });
}

/* ==========================================================================
   10. MAGNETIC BUTTON (Register CTA)
   ========================================================================== */
function initMagneticButton() {
  const magneticBtn = document.querySelector('.btn-magnetic');
  if (!magneticBtn || prefersReducedMotion) return;

  const content = magneticBtn.querySelector('.btn-magnetic-content') || magneticBtn;

  // Only enable on desktop screens where hover exists
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    magneticBtn.addEventListener('mousemove', (e) => {
      const rect = magneticBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Subtle displacement toward cursor within a small radius
      const moveX = x * 0.28;
      const moveY = y * 0.28;

      if (typeof gsap !== 'undefined') {
        gsap.to(magneticBtn, {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(content, {
          x: moveX * 0.3,
          y: moveY * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        magneticBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    });

    magneticBtn.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to([magneticBtn, content], {
          x: 0,
          y: 0,
          duration: 0.55,
          ease: 'elastic.out(1, 0.4)'
        });
      } else {
        magneticBtn.style.transform = 'translate(0px, 0px)';
      }
    });
  }
}

/* ==========================================================================
   11. QUANTUM CYPHER STAT DECRYPTION (Intentional Sci-Fi Reveal Effect)
   ========================================================================== */
function initStatDecryptionAnimation() {
  const statCards = document.querySelectorAll('.stat-card[data-decode-target]');
  const missionSection = document.getElementById('mission');
  if (!statCards.length || !missionSection) return;

  const glyphs = ['0', '1', 'Δ', 'Ω', 'Ψ', 'X', '#', '§', '9', '7', 'Z', '%', 'K'];

  function decodeCard(card, delayMs) {
    const valueEl = card.querySelector('.stat-value');
    if (!valueEl) return;
    const targetText = card.getAttribute('data-decode-target') || valueEl.textContent;
    const totalFrames = 22;
    let frame = 0;

    setTimeout(() => {
      card.classList.add('is-decrypting');
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const revealedCount = Math.floor(progress * targetText.length);

        let scrambled = '';
        for (let i = 0; i < targetText.length; i++) {
          if (targetText[i] === ' ' || targetText[i] === '/' || targetText[i] === ':' || targetText[i] === ',') {
            scrambled += targetText[i];
          } else if (i < revealedCount) {
            scrambled += targetText[i];
          } else {
            scrambled += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }

        valueEl.textContent = scrambled;

        if (frame >= totalFrames) {
          clearInterval(interval);
          valueEl.textContent = targetText;
          card.classList.remove('is-decrypting');
          card.classList.add('is-decoded');
        }
      }, 35);
    }, delayMs);
  }

  if (typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    ScrollTrigger.create({
      trigger: '.stats-panel-grid',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        statCards.forEach((card, idx) => {
          decodeCard(card, idx * 140);
        });
      }
    });
  } else {
    statCards.forEach((card) => {
      const val = card.querySelector('.stat-value');
      const target = card.getAttribute('data-decode-target');
      if (val && target) val.textContent = target;
      card.classList.add('is-decoded');
    });
  }
}

/* ==========================================================================
   12. PERKS & SOCIAL PROOF SCROLL ANIMATIONS
   ========================================================================== */
function initPerksAndSocialProof() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) {
    return;
  }

  // Perks Cards Stagger
  if (document.querySelector('.perks-grid')) {
    gsap.from('.perk-card', {
      scrollTrigger: {
        trigger: '.perks-grid',
        start: 'top 78%',
      },
      y: 35,
      opacity: 0,
      stagger: 0.1,
      duration: 0.65,
      ease: 'power2.out'
    });
  }
}

/* ==========================================================================
   13. LEGAL & 3D CREDITS MODAL CONTROLLER
   ========================================================================== */
function initIpCreditsModal() {
  const modal = document.getElementById('ip-credits-modal');
  const openBtn = document.getElementById('open-ip-credits-btn');
  const closeBtn = document.getElementById('close-ip-credits-btn');
  const ackBtn = document.getElementById('modal-ack-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    if (openBtn) {
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.focus();
    }
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (ackBtn) ackBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   14. TAB VISIBILITY LIFECYCLE (Battery & CPU conservation)
   ========================================================================== */
function initTabVisibilityLifecycle() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.classList.add('tab-inactive');
    } else {
      document.body.classList.remove('tab-inactive');
    }
  });
}
