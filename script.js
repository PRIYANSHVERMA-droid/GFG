/* ==========================================================================
   DOOMSDAY — GFG STUDENT CHAPTER × BENNETT UNIVERSITY
   Core Application & Cinematic Animation Controller
   ========================================================================== */

// --- DATA CONSTANTS (Required: exact naming at top of script.js) ---
const EVENT_DATE = "TBD — update before launch";
const EVENT_TIME = "TBD";
const EVENT_VENUE = "TBD";
const EVENT_MODE = "In-person / Bennett University";
const REGISTRATION_URL = "register.html";
const SOCIAL_LINKS = {
  instagram: "#",
  linkedin: "#",
  github: "#"
};

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initDataBinding();
  initLenis();
  initNavigation();
  initIntroSequence();
  initHeroParticles();
  initBreachAndSelector();
  initHeroCardReveal();
  initCharacterSections();
  initHighlightsInteraction();
  initTimelineScroll();
  initMagneticButton();
});

/* ==========================================================================
   1. DATA BINDING (Inject constants into DOM)
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
  const navRegBtn = document.querySelector('.nav-link--register');
  const mobileRegBtn = document.querySelector('.mobile-nav-link--accent');

  if (regBtn) regBtn.href = REGISTRATION_URL;
  if (navRegBtn && REGISTRATION_URL !== "#") navRegBtn.href = REGISTRATION_URL;
  if (mobileRegBtn && REGISTRATION_URL !== "#") mobileRegBtn.href = REGISTRATION_URL;

  // Social links
  const instaLink = document.getElementById('social-instagram');
  const linkedinLink = document.getElementById('social-linkedin');
  const githubLink = document.getElementById('social-github');

  if (instaLink) instaLink.href = SOCIAL_LINKS.instagram;
  if (linkedinLink) linkedinLink.href = SOCIAL_LINKS.linkedin;
  if (githubLink) githubLink.href = SOCIAL_LINKS.github;
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
   3. GLOBAL NAVIGATION
   ========================================================================== */
function initNavigation() {
  const nav = document.getElementById('global-nav');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link:not(.nav-link--register)');
  const sections = document.querySelectorAll('section[id], .timeline-beat[id], .register-beat[id]');

  // Scroll navbar background styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.classList.toggle('is-active', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Close mobile menu on escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // Track active section and underline nav link
  if (typeof ScrollTrigger !== 'undefined') {
    sections.forEach((sec) => {
      const id = sec.getAttribute('id');
      const matchingLink = document.querySelector(`.desktop-nav .nav-link[href="#${id}"]`);

      if (matchingLink) {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveNavLink(matchingLink),
          onEnterBack: () => setActiveNavLink(matchingLink),
        });
      }
    });
  }

  function setActiveNavLink(activeLink) {
    navLinks.forEach((link) => link.classList.remove('nav-active'));
    activeLink.classList.add('nav-active');
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
   4. MARVEL × GFG FLIPBOOK INTRO SEQUENCE
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

  if (prefersReducedMotion || typeof gsap === 'undefined') {
    dismissIntro(false);
    return;
  }

  // Intro Timeline (~1.55s total: compressed, punchy, no wasted beats)
  const tl = gsap.timeline({
    onComplete: () => {
      dismissIntro(false);
    }
  });

  // Animate HUD progress rail
  if (progressFill) {
    tl.to(progressFill, {
      width: '100%',
      duration: 1.3,
      ease: 'power1.inOut'
    }, 0);
  }

  // Sequence: Comic panels flash -> Marvel red badge slams in -> DOOMSDAY reveal -> Zoom/fade out
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

    // Front Card Click: Smooth scroll to hero section
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
