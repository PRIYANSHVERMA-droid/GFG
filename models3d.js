/* ==========================================================================
   DOOMSDAY — 3D MODEL INTEGRATION SYSTEM
   Full native Three.js integration for:
   1. Hero Section: Doctor Doom Mask background with interactive mouse
      tracking and cinematic scroll-driven 3D transforms.
   2. Hero Roster Cards: 4 interactive 3D models
      - Doctor Doom: Doom Mask (assets/Modles/doom_mask.glb)
      - Spider-Man: 3D Spider Logo (assets/Modles/spider_logo3d.glb)
      - Thor: Thunder Bolt (assets/Modles/lightning_bolt.glb)
      - Captain America: Vibranium Shield (assets/Modles/shield.glb)
      With idle float, card hover tilt, 360° twirl scan, and scroll scrub.
   3. Character Showcase Sections:
      - Doctor Doom: Native 3D Doom Mask with Latverian emerald aura
      - Spider-Man: Full rigged character with web-line accent
      - Thor: Celestial lightning bolt with cosmic energy
      - Captain America: Tactical Steve Rogers with orbiting vibranium shield
   ========================================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
      console.warn('[models3d] Three.js or GLTFLoader not available — keeping CSS placeholders.');
      return;
    }

    initHeroDoomScene();
    initHeroCardScenes();
    initNativeCharacterScenes();
  });

  /* ----------------------------------------------------------------------
     SHARED DRACO DECODER POOL
     Reused by all loaders so workers are initialized once and remain warm.
     ---------------------------------------------------------------------- */
  var sharedDracoLoader = null;

  function getDracoLoader() {
    if (!sharedDracoLoader && typeof THREE !== 'undefined' && THREE.DRACOLoader) {
      sharedDracoLoader = new THREE.DRACOLoader();
      sharedDracoLoader.setDecoderPath('assets/vendor/draco/');
    }
    return sharedDracoLoader;
  }

  function createGLTFLoader() {
    var loader = new THREE.GLTFLoader();
    var draco = getDracoLoader();
    if (draco) loader.setDRACOLoader(draco);
    return loader;
  }

  /* ----------------------------------------------------------------------
     UTILITY: PIVOT WRAPPER & BOUNDING BOX NORMALIZATION
     Wraps any raw model in a centered pivot so rotations never wobble.
     ---------------------------------------------------------------------- */
  function normalizeAndPivot(rawModel, targetSize, baseEuler, customNormalize) {
    if (baseEuler) {
      rawModel.rotation.set(baseEuler[0] || 0, baseEuler[1] || 0, baseEuler[2] || 0);
    }
    rawModel.updateMatrixWorld(true);

    var pivot = new THREE.Group();
    pivot.add(rawModel);

    if (typeof customNormalize === 'function') {
      customNormalize(rawModel, pivot);
    } else {
      var box = new THREE.Box3().setFromObject(rawModel);
      var center = box.getCenter(new THREE.Vector3());
      var size = box.getSize(new THREE.Vector3());
      var maxDim = Math.max(size.x, size.y, size.z) || 1;
      var scale = targetSize / maxDim;

      rawModel.scale.setScalar(scale);
      rawModel.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    }

    return pivot;
  }

  /* ======================================================================
     1. HERO SECTION: DOCTOR DOOM MASK (Background 3D Model)
     Features:
     - Sinister Latverian lighting (emerald rim + eye glow + metallic speculars)
     - Hover breathing & organic idle floating
     - Mouse parallax tracking (turns head towards user cursor)
     - Scroll animation (scrubs rotation, parallax depth and scale)
     - IntersectionObserver to pause rendering when scrolled past hero
     ====================================================================== */
  function initHeroDoomScene() {
    var canvasEl = document.getElementById('hero-doom-canvas');
    var container = document.getElementById('doom-hero-visual');
    var heroSection = document.getElementById('hero');
    if (!canvasEl || !container || !heroSection) return;

    var modelPath = canvasEl.getAttribute('data-model') || 'assets/Modles/doom_mask.glb';
    var renderer, scene, camera, pivot, rawModel;
    var rafId = null;
    var isIntersecting = true;
    var scrollProgress = 0;

    // Mouse parallax tracking
    var mouseTargetX = 0;
    var mouseTargetY = 0;
    var mouseCurX = 0;
    var mouseCurY = 0;

    function init() {
      var width = container.clientWidth || 600;
      var height = container.clientHeight || 600;

      renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      if ('outputEncoding' in renderer && THREE.sRGBEncoding !== undefined) {
        renderer.outputEncoding = THREE.sRGBEncoding;
      }

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(42, width / Math.max(height, 1), 0.1, 100);
      camera.position.set(0, 0, 3.8);
      camera.lookAt(0, 0, 0);

      // Latverian Arcane Lighting Setup
      var ambient = new THREE.AmbientLight(0x0e2418, 1.2);
      scene.add(ambient);

      // Key light: crisp metallic reflections on the steel mask
      var keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
      keyLight.position.set(3, 4, 4);
      scene.add(keyLight);

      // Fill light: soft emerald glow
      var fillLight = new THREE.DirectionalLight(0x1a4532, 0.8);
      fillLight.position.set(-2, 1, 3);
      scene.add(fillLight);

      // Signature Latverian Rim: high-energy green glow outlining the hood
      var rimLight = new THREE.DirectionalLight(0x3AFFA0, 2.6);
      rimLight.position.set(-3.5, 2.5, -3);
      scene.add(rimLight);

      // Eerie Point light inside the mask eye sockets
      var eyeLight = new THREE.PointLight(0x3AFFA0, 2.2, 4);
      eyeLight.position.set(0, 0.25, 0.6);
      scene.add(eyeLight);

      // Load Doom Mask
      var loader = createGLTFLoader();
      loader.load(modelPath, function (gltf) {
        rawModel = gltf.scene;

        // Tune materials for rich metallic reflections
        rawModel.traverse(function (child) {
          if (child.isMesh && child.material) {
            var mat = child.material;
            if (mat.name && mat.name.indexOf('DoomMask') !== -1) {
              mat.metalness = Math.max(mat.metalness || 0, 0.85);
              mat.roughness = Math.min(mat.roughness || 0.4, 0.28);
            }
          }
        });

        // Face forward with slight menacing downward tilt
        pivot = normalizeAndPivot(rawModel, 2.7, [0.08, Math.PI, 0]);
        scene.add(pivot);

        canvasEl.classList.add('model-ready');
        container.classList.add('has-live-model');

        if (reducedMotion) {
          renderer.render(scene, camera);
        } else {
          startLoop();
        }
      }, undefined, function (err) {
        console.error('[models3d] Failed to load hero doom mask:', err);
      });

      // Mouse move listener on hero section
      heroSection.addEventListener('mousemove', function (e) {
        var rect = heroSection.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width - 0.5;
        var relY = (e.clientY - rect.top) / rect.height - 0.5;
        mouseTargetX = relX * 0.55;
        mouseTargetY = relY * 0.35;
      }, { passive: true });

      heroSection.addEventListener('mouseleave', function () {
        mouseTargetX = 0;
        mouseTargetY = 0;
      }, { passive: true });

      window.addEventListener('resize', handleResize, { passive: true });

      // ScrollTrigger for Scroll Animation
      if (!reducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          onUpdate: function (self) {
            scrollProgress = self.progress;
          }
        });
      }

      // IntersectionObserver to pause RAF when scrolled out of view
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            isIntersecting = entry.isIntersecting;
            if (isIntersecting && !rafId && !reducedMotion && pivot) {
              startLoop();
            }
          });
        }, { rootMargin: '100px 0px' });
        io.observe(heroSection);
      }
    }

    function startLoop() {
      if (rafId !== null) return;
      var startTime = performance.now();

      function loop(now) {
        if (!isIntersecting) {
          rafId = null;
          return;
        }
        rafId = requestAnimationFrame(loop);

        var time = (now - startTime) * 0.001;

        // Smooth mouse lerp
        mouseCurX += (mouseTargetX - mouseCurX) * 0.06;
        mouseCurY += (mouseTargetY - mouseCurY) * 0.06;

        if (pivot) {
          // Hover bobbing & breathing
          var hoverY = Math.sin(time * 1.4) * 0.07;
          var breathPitch = Math.sin(time * 1.1) * 0.03;

          // Scroll-driven yaw and pitch transforms
          // As user scrolls down, mask turns smoothly and pushes slightly into the multiverse
          var scrollYaw = scrollProgress * Math.PI * 0.55;
          var scrollPitch = -scrollProgress * 0.2;
          var scrollZ = -scrollProgress * 0.7;
          var scrollTransY = -scrollProgress * 0.35;

          pivot.position.y = hoverY + scrollTransY;
          pivot.position.z = scrollZ;

          pivot.rotation.y = Math.PI + mouseCurX + scrollYaw;
          pivot.rotation.x = 0.08 + mouseCurY + breathPitch + scrollPitch;

          // Subtle scale adjustment on scroll
          var s = 1.0 + scrollProgress * 0.12;
          pivot.scale.set(s, s, s);
        }

        renderer.render(scene, camera);
      }

      rafId = requestAnimationFrame(loop);
    }

    function handleResize() {
      if (!renderer || !camera || !container) return;
      var w = container.clientWidth;
      var h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (reducedMotion && pivot) renderer.render(scene, camera);
    }

    init();
  }

  /* ======================================================================
     2. HERO ROSTER CARDS: 4 INTERACTIVE 3D MODELS
     Models:
     - Card 01: Doctor Doom Mask (doom_mask.glb)
     - Card 02: Spider-Man Logo (spider_logo3d.glb)
     - Card 03: Thor Lightning Bolt (lightning_bolt.glb)
     - Card 04: Captain America Shield (shield.glb)
     Features:
     - Continuous organic floating and subtle idle rotation
     - Card mouse tilt interaction
     - 360° Twirl button and Global 360° Multiverse Scan spin animation
     - Scroll animation: scrubs rotation across breach passage
     - Shared IntersectionObserver on roster section
     ====================================================================== */
  function initHeroCardScenes() {
    var canvases = document.querySelectorAll('canvas.card-3d-canvas[data-card-hero]');
    var rosterSection = document.getElementById('breach-selector');
    if (canvases.length === 0 || !rosterSection) return;

    var cardControllers = [];
    var isRosterVisible = false;
    var rosterScrollProgress = 0;

    // Card model specific configurations calibrated for cinematic framing
    var cardConfigs = {
      doom: {
        baseRotation: [0.05, 0, 0],
        targetSize: 2.15,
        accent: 0x3AFFA0,
        idleAxis: 'y'
      },
      spiderman: {
        baseRotation: [0, 0, 0],
        targetSize: 2.2,
        accent: 0xD91E36,
        idleAxis: 'y'
      },
      thor: {
        baseRotation: [0, 0, 0.12],
        targetSize: 2.2,
        accent: 0x7B5CFF,
        idleAxis: 'y'
      },
      cap: {
        baseRotation: [Math.PI / 2, 0, 0],
        targetSize: 2.25,
        accent: 0x5E81AC,
        idleAxis: 'y'
      }
    };

    canvases.forEach(function (canvasEl) {
      var heroKey = canvasEl.getAttribute('data-card-hero');
      var modelPath = canvasEl.getAttribute('data-model');
      var cfg = cardConfigs[heroKey] || { baseRotation: [0, 0, 0], targetSize: 2.0, accent: 0xffffff };
      var wrapperEl = canvasEl.closest('.hero-card-3d-wrapper');
      var cardFront = canvasEl.closest('.hero-card');

      var renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      var w = canvasEl.parentElement.clientWidth || 200;
      var h = canvasEl.parentElement.clientHeight || 140;
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      if ('outputEncoding' in renderer && THREE.sRGBEncoding !== undefined) {
        renderer.outputEncoding = THREE.sRGBEncoding;
      }

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(45, w / Math.max(h, 1), 0.1, 100);
      camera.position.set(0, 0, 3.5);
      camera.lookAt(0, 0, 0);

      // Studio card lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.75));
      var key = new THREE.DirectionalLight(0xffffff, 1.3);
      key.position.set(2.5, 3.5, 3.5);
      scene.add(key);

      var rim = new THREE.DirectionalLight(cfg.accent, 1.6);
      rim.position.set(-2.5, 1.5, -2.5);
      scene.add(rim);

      var pivot = null;
      var spinOffset = 0;
      var hoverTiltX = 0;
      var hoverTiltY = 0;

      var loader = createGLTFLoader();
      loader.load(modelPath, function (gltf) {
        var rawModel = gltf.scene;

        // Custom material touches
        if (heroKey === 'thor') {
          // Give lightning bolt electric shine
          rawModel.traverse(function (c) {
            if (c.isMesh && c.material) {
              c.material.metalness = 0.8;
              c.material.roughness = 0.2;
              c.material.emissive = new THREE.Color(0x7B5CFF);
              c.material.emissiveIntensity = 0.25;
            }
          });
        }

        pivot = normalizeAndPivot(rawModel, cfg.targetSize, cfg.baseRotation);
        scene.add(pivot);

        canvasEl.classList.add('model-ready');
        if (cardFront) cardFront.classList.add('has-live-card-model');

        if (reducedMotion) renderer.render(scene, camera);
      }, undefined, function (err) {
        console.error('[models3d] Failed to load card model ' + modelPath, err);
      });

      // Card hover tilt tracking
      if (wrapperEl) {
        wrapperEl.addEventListener('mousemove', function (e) {
          var rect = wrapperEl.getBoundingClientRect();
          var px = (e.clientX - rect.left) / rect.width - 0.5;
          var py = (e.clientY - rect.top) / rect.height - 0.5;
          hoverTiltY = px * 0.45;
          hoverTiltX = -py * 0.35;
        }, { passive: true });

        wrapperEl.addEventListener('mouseleave', function () {
          hoverTiltX = 0;
          hoverTiltY = 0;
        }, { passive: true });
      }

      function twirl360() {
        if (reducedMotion || typeof gsap === 'undefined') return;
        var obj = { val: 0 };
        gsap.to(obj, {
          val: Math.PI * 2,
          duration: 0.95,
          ease: 'power2.inOut',
          onUpdate: function () {
            spinOffset = obj.val;
          },
          onComplete: function () {
            spinOffset = 0;
          }
        });
      }

      cardControllers.push({
        heroKey: heroKey,
        renderer: renderer,
        scene: scene,
        camera: camera,
        getPivot: function () { return pivot; },
        twirl360: twirl360,
        render: function (time, scrollP) {
          if (!pivot) return;
          var idleBob = Math.sin(time * 2.0 + cardControllers.indexOf(this)) * 0.04;
          var idleDrift = Math.sin(time * 0.8 + cardControllers.indexOf(this)) * 0.06;
          // Smooth scroll scrub: faces forward when section is in view, tilts subtly as you scroll
          var scrollRotation = (scrollP - 0.5) * Math.PI * 0.35;

          pivot.position.y = idleBob;
          // rawModel already has baseEuler applied inside pivot wrapper
          pivot.rotation.y = idleDrift + scrollRotation + spinOffset + hoverTiltY;
          pivot.rotation.x = hoverTiltX;

          renderer.render(scene, camera);
        },
        resize: function () {
          var nw = canvasEl.parentElement.clientWidth;
          var nh = canvasEl.parentElement.clientHeight;
          if (nw === 0 || nh === 0) return;
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        }
      });
    });

    // Hook into card 360° twirl buttons and "360° MULTIVERSE SCAN" button
    var twirlAllBtn = document.getElementById('btn-twirl-all');
    if (twirlAllBtn) {
      twirlAllBtn.addEventListener('click', function () {
        cardControllers.forEach(function (ctrl, idx) {
          setTimeout(function () {
            ctrl.twirl360();
          }, idx * 160);
        });
      });
    }

    var individualTwirlBtns = document.querySelectorAll('.card-twirl-action-btn[data-twirl]');
    individualTwirlBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var hero = btn.getAttribute('data-twirl');
        var ctrl = cardControllers.find(function (c) { return c.heroKey === hero; });
        if (ctrl) ctrl.twirl360();
      });
    });

    // ScrollTrigger on roster section
    if (!reducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: rosterSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.0,
        onUpdate: function (self) {
          rosterScrollProgress = self.progress;
        }
      });
    }

    // IntersectionObserver to pause all 4 card renders when section is offscreen
    var rafCardId = null;
    function runCardsLoop(timeNow) {
      if (!isRosterVisible) {
        rafCardId = null;
        return;
      }
      rafCardId = requestAnimationFrame(runCardsLoop);
      var t = timeNow * 0.001;
      cardControllers.forEach(function (ctrl) {
        ctrl.render(t, rosterScrollProgress);
      });
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isRosterVisible = entry.isIntersecting;
          if (isRosterVisible && !rafCardId && !reducedMotion) {
            rafCardId = requestAnimationFrame(runCardsLoop);
          }
        });
      }, { rootMargin: '200px 0px' });
      io.observe(rosterSection);
    } else {
      isRosterVisible = true;
      rafCardId = requestAnimationFrame(runCardsLoop);
    }

    window.addEventListener('resize', function () {
      cardControllers.forEach(function (ctrl) { ctrl.resize(); });
    }, { passive: true });
  }

  /* ======================================================================
     3. FULL-PAGE CHARACTER SHOWCASE SECTIONS
     Native Three.js scenes for Doctor Doom, Spider-Man, Thor, Captain America.
     Lazy-mounted via IntersectionObserver and disposed when scrolled away.
     ====================================================================== */
  function createCharacterScene(canvasEl, modelPath, options) {
    var container = canvasEl.parentElement;
    var renderer = null, scene = null, camera = null;
    var pivot = null, accentPivot = null;
    var rafId = null;
    var scrollProgress = 0;
    var idleYaw = 0;
    var heroKey = canvasEl.id.replace('canvas-', '');

    function init() {
      renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      if ('outputEncoding' in renderer && THREE.sRGBEncoding !== undefined) {
        renderer.outputEncoding = THREE.sRGBEncoding;
      }

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / Math.max(container.clientHeight, 1),
        0.1,
        100
      );
      camera.position.set(0, 0.45, 3.6);
      camera.lookAt(0, 0, 0);

      // Section lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.65));
      var key = new THREE.DirectionalLight(0xffffff, 1.3);
      key.position.set(2, 3, 4);
      scene.add(key);

      var rim = new THREE.DirectionalLight(new THREE.Color(options.accent || '#ffffff'), 1.8);
      rim.position.set(-2.5, 2, -3);
      scene.add(rim);

      // Extra character-specific lights
      if (heroKey === 'doom') {
        var eyePoint = new THREE.PointLight(0x3AFFA0, 2.0, 3.5);
        eyePoint.position.set(0, 0.2, 0.5);
        scene.add(eyePoint);
      } else if (heroKey === 'thor') {
        var stormPoint = new THREE.PointLight(0x7B5CFF, 2.5, 4);
        stormPoint.position.set(0, 0, 0.5);
        scene.add(stormPoint);
      }

      var loader = createGLTFLoader();

      loader.load(modelPath, function (gltf) {
        var rawModel = gltf.scene;

        if (heroKey === 'spiderman') {
          // Spider-Man custom normalize to keep full body centered in frame
          pivot = normalizeAndPivot(rawModel, 2.4, [0, 0, 0], function (obj) {
            var scale = 2.4 / 1.67;
            obj.scale.setScalar(scale);
            obj.position.set(0, -0.835 * scale, 0);
          });
        } else if (heroKey === 'doom') {
          pivot = normalizeAndPivot(rawModel, 2.6, [0.06, Math.PI, 0]);
        } else if (heroKey === 'thor') {
          pivot = normalizeAndPivot(rawModel, 2.5, [0, 0, 0.12]);
        } else if (heroKey === 'cap') {
          pivot = normalizeAndPivot(rawModel, 2.6, [0, Math.PI, 0]);
        } else {
          pivot = normalizeAndPivot(rawModel, 2.5, [0, 0, 0]);
        }

        scene.add(pivot);

        canvasEl.classList.add('model-ready');
        container.classList.add('has-live-model');

        if (reducedMotion) renderOnce();
      }, undefined, function (err) {
        console.error('[models3d] Failed to load character model ' + modelPath, err);
      });

      // Optional orbiting accent model (Captain America's Shield)
      if (options.accentModel) {
        loader.load(options.accentModel, function (gltf) {
          var rawAccent = gltf.scene;
          accentPivot = normalizeAndPivot(rawAccent, 0.95, [-Math.PI / 2, 0, 0]);
          scene.add(accentPivot);
          if (reducedMotion && accentPivot) {
            accentPivot.position.set(1.15, -0.15, 0.3);
            renderOnce();
          }
        }, undefined, function (err) {
          console.error('[models3d] Accent model failed (non-fatal):', err);
        });
      }

      window.addEventListener('resize', handleResize, { passive: true });

      if (reducedMotion) {
        renderOnce();
        return;
      }
      animate();
    }

    function animate(time) {
      rafId = requestAnimationFrame(animate);
      idleYaw += 0.002;

      if (pivot) {
        // Quarter turn scrub across section passage + idle drift
        pivot.rotation.y = scrollProgress * Math.PI * 0.5 + idleYaw;
      }

      if (accentPivot && typeof time === 'number') {
        var t = time * 0.001;
        accentPivot.position.x = Math.cos(t * 0.55) * 1.35;
        accentPivot.position.z = Math.sin(t * 0.55) * 1.35;
        accentPivot.position.y = Math.sin(t * 1.2) * 0.12;
        accentPivot.rotation.y = t * 0.8;
      }

      renderer.render(scene, camera);
    }

    function renderOnce() {
      if (renderer && scene && camera) renderer.render(scene, camera);
    }

    function handleResize() {
      if (!renderer || !camera) return;
      var w = container.clientWidth;
      var h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (reducedMotion) renderOnce();
    }

    function dispose() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      window.removeEventListener('resize', handleResize);
      canvasEl.classList.remove('model-ready');
      container.classList.remove('has-live-model');

      if (scene) {
        scene.traverse(function (obj) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            var mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach(function (m) {
              Object.keys(m).forEach(function (k) {
                if (m[k] && m[k].isTexture) m[k].dispose();
              });
              if (m.dispose) m.dispose();
            });
          }
        });
      }

      if (renderer) {
        renderer.dispose();
        if (renderer.forceContextLoss) renderer.forceContextLoss();
      }

      renderer = scene = camera = pivot = accentPivot = null;
    }

    return {
      init: init,
      dispose: dispose,
      setScrollProgress: function (p) { scrollProgress = p; },
      started: false
    };
  }

  function initNativeCharacterScenes() {
    var canvases = document.querySelectorAll('canvas.character-canvas[data-model]');
    if (canvases.length === 0) return;

    var registry = new Map();

    canvases.forEach(function (canvasEl) {
      var section = canvasEl.closest('.character-section');
      if (!section) return;
      var controller = createCharacterScene(canvasEl, canvasEl.getAttribute('data-model'), {
        accent: canvasEl.getAttribute('data-accent'),
        accentModel: canvasEl.getAttribute('data-accent-model')
      });
      registry.set(section, controller);
    });

    if (registry.size === 0) return;

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var controller = registry.get(entry.target);
          if (!controller) return;
          if (entry.isIntersecting && !controller.started) {
            controller.init();
            controller.started = true;
          } else if (!entry.isIntersecting && controller.started) {
            controller.dispose();
            controller.started = false;
          }
        });
      }, { rootMargin: '250px 0px' });

      registry.forEach(function (controller, section) { io.observe(section); });
    } else {
      registry.forEach(function (controller) {
        if (!controller.started) { controller.init(); controller.started = true; }
      });
    }

    if (!reducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      registry.forEach(function (controller, section) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: function (self) { controller.setScrollProgress(self.progress); }
        });
      });
    }
  }

})();
