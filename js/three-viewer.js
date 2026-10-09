// Biblio Atelier - Three.js Observable Specimen Rendering Engine (Museum-Grade Quality)

/* =========================================================================
   A. PROCEDURAL AUDIO DIAGNOSTIC SYNTHESIZER (Zero Audio Asset Dependency)
   ========================================================================= */
class AudioDiagnosticSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
  }

  ensureContext() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        this.ctx = new AC();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playServo(duration = 0.55, pitchDirection = 1) {
    this.ensureContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.8, now);

    const startFreq = pitchDirection > 0 ? 115 : 240;
    const midFreq = pitchDirection > 0 ? 280 : 160;
    const endFreq = pitchDirection > 0 ? 80 : 70;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.linearRampToValueAtTime(midFreq, now + duration * 0.45);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);

    filter.frequency.setValueAtTime(startFreq * 2.2, now);
    filter.frequency.linearRampToValueAtTime(midFreq * 2.2, now + duration * 0.45);
    filter.frequency.exponentialRampToValueAtTime(endFreq * 2.2, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playLatchClick() {
    this.ensureContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1550, now);
    osc1.frequency.exponentialRampToValueAtTime(110, now + 0.04);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(280, now);
    osc2.frequency.exponentialRampToValueAtTime(60, now + 0.058);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.058);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.06);
    osc2.stop(now + 0.06);
  }

  playSpectralChime(mode = 'uv') {
    this.ensureContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const baseFreq = mode === 'uv' ? 880 : (mode === 'infrared' ? 587.33 : (mode === 'xray' ? 1174.66 : 740));
    [baseFreq, baseFreq * 1.5, baseFreq * 2.0].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      gain.gain.setValueAtTime(0.12 / (i + 1), now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65 + i * 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.04);
      osc.stop(now + 0.85);
    });
  }

  playSpectrometerChirp() {
    this.ensureContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playRheostatHum() {
    this.ensureContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, now);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playCardFlick() {
    this.ensureContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playDrawerSlide() {
    this.ensureContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(95, now + 0.28);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playEpochShift() {
    this.ensureContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.55);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(280, now + 0.55);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.56);
  }

  playPipetteTap() {
    this.ensureContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.025);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  playWaterDrop() {
    this.ensureContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.05);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.055);
  }

  playCapillaryHiss() {
    this.ensureContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(2.5, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.26);
  }

  playShelfSlide() {
    this.ensureContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.35);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.linearRampToValueAtTime(180, now + 0.35);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.20, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.36);
  }
}

class ThreeBookViewer {
  constructor(mountElement, overlayElement, options = {}) {
    // If the Three.js CDN failed to load there is nothing to render. Bail out cleanly
    // instead of throwing, so the rest of the application still works.
    this.hasThree = typeof THREE !== 'undefined';
    this.available = this.hasThree;
    if (!this.hasThree) return;

    this.mount = mountElement;
    this.overlay = overlayElement;
    this.width = mountElement.clientWidth || 800;
    this.height = mountElement.clientHeight || 600;
    this.onHotspotSelect = typeof options.onHotspotSelect === 'function' ? options.onHotspotSelect : null;
    this.onBookSelect = typeof options.onBookSelect === 'function' ? options.onBookSelect : null;
    this.onTourEnd = typeof options.onTourEnd === 'function' ? options.onTourEnd : null;
    this.onTourProgress = typeof options.onTourProgress === 'function' ? options.onTourProgress : null;
    this.onLoadStart = typeof options.onLoadStart === 'function' ? options.onLoadStart : null;
    this.onLoadEnd = typeof options.onLoadEnd === 'function' ? options.onLoadEnd : null;
    this.onLayerChange = typeof options.onLayerChange === 'function' ? options.onLayerChange : null;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.plinthGroup = null;
    this.secondaryPlinthGroup = null;

    this.raycaster = typeof THREE !== 'undefined' ? new THREE.Raycaster() : null;
    this.mouse = typeof THREE !== 'undefined' ? new THREE.Vector2() : null;
    this.hoveredBookMesh = null;
    this.pointerDownPos = { x: 0, y: 0 };
    this.shelfTooltipEl = null;

    this.specimenGroup = null;
    this.compareSpecimenGroup = null;
    this.currentSpecimenData = null;
    this.compareSpecimenData = null;

    this.hotspots = [];
    this.hotspotElements = [];
    this.textureCache = new Map();

    this.currentViewMode = 'normal'; // normal | isolate | uv | layers | exploded | section
    this.autoRotateWanted = true;
    this.selectedHotspotId = null;
    this.selectedMeshPart = null;
    this.currentLayerIndex = -1; // -1 = all layers visible

    this.exploded = false;
    this.sectionOn = false;
    this.compareActive = false;

    this.tourActive = false;
    this.tourIndex = 0;
    this.tourTimer = 0;

    this.clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

    // High-Tech Diagnostic Scanner & Caliper Components
    this.laserSweepMesh = null;
    this.laserSweepFan = null;
    this.laserSweepX = 0;
    this.caliperLinesMesh = null;
    this.diagnosticBackdropMesh = null;
    this.activeStationBackdrop = null;
    this.wavelengthMode = 'visible'; // visible | uv | infrared | xray
    this.telemetryContainer = null;
    this.telemetrySvg = null;
    this.telemetryBadgesLayer = null;
    this.telemetryBadges = [];
    this.audioDiagnostic = new AudioDiagnosticSynthesizer();
    this._wasExploded = false;

    // Premier Interactive Diagnostic Tools State
    this.loupeActive = false;
    this.loupeEl = null;
    this.loupeCanvas = null;
    this.loupeCtx = null;
    this.bankerLampSpot = null;
    this.lampMode = 'warm';
    this.carrelDeskApron = null;

    // Raking Light State (Grazing Incidence Examination at 8° elevation)
    this.rakingLight = null;
    this.rakingActive = false;
    this.rakingAzimuth = 45;

    // Transmitted Backlight & Watermark State
    this.backlightMesh = null;
    this.backlightActive = false;
    this.originalLeafMaterials = new Map();

    // XRF Elemental Spectroscopy State
    this.xrfActive = false;
    this.xrfPanel = null;
    this.xrfCanvas = null;
    this.xrfCtx = null;

    // Chronological Provenance Timeline State (1485 -> 1620 -> 1840 -> Present)
    this.provenanceActive = false;
    this.currentEpochIndex = 0;
    this.provenancePanel = null;
    this.originalBookMaterials = null;

    // Micro-Hydration Spot Test State (Porosimetry 0.5 µL DI-H2O)
    this.hydrationActive = false;
    this.hydrationDropletActive = false;
    this.hydrationStartTime = 0;
    this.hydrationPanel = null;
    this.hydrationCanvas = null;
    this.hydrationCtx = null;
    this.hydrationDropletMesh = null;
    this.hydrationContactAngle = 79.4;
    this.hydrationRafId = null;

    // Frame specimen with museum-grade proportion
    this.homeCamera = { x: 0.18, y: 0.42, z: 2.75 };
    this.homeTarget = { x: 0, y: -0.04, z: 0 };
    this.compareHomeCamera = { x: 0, y: 0.45, z: 3.4 };
    this.compareHomeTarget = { x: 0, y: -0.04, z: 0 };

    this.camTween = null;
    this.explodeAmount = 0;
    this.explodeTarget = 0;
    this.calloutEl = null;
    this.clock = new THREE.Clock();

    // Reusable scratch objects — the render loop must not allocate.
    this._scratchVec = new THREE.Vector3();
    this._scratchVecB = new THREE.Vector3();
    this._explodeDir = new THREE.Vector3();
    this._lastTourEmit = 0;

    // Render-loop gating: pause when hidden or scrolled out of view.
    this._running = true;
    this._rafId = null;
    this._loopStarted = false;

    this.prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    this.initScene();
    try {
      const t = document.documentElement.getAttribute('data-theme');
      if (t === 'dark' || t === 'light') this.setTheme(t);
    } catch (_) { /* ignore */ }
    this.setupRenderGating();
    this.startLoop();
    this.handleResize();
  }

  /* =========================================================================
     0. RESOURCE MANAGEMENT, TEXTURE CACHING & RENDER-LOOP GATING
     ========================================================================= */

  /**
   * Cache a generated canvas texture by key. Specimens are rebuilt on every module
   * switch, and most texture generators produce identical output for identical
   * arguments — without this, each switch re-rasterises hundreds of canvases and
   * uploads fresh GPU textures.
   */
  cachedTexture(key, factory) {
    if (this.textureCache.has(key)) return this.textureCache.get(key);
    const tex = factory();
    this.textureCache.set(key, tex);
    return tex;
  }

  /**
   * Recursively free GPU resources owned by a subtree. Three.js does not garbage
   * collect geometries, materials or textures; without this every specimen switch
   * leaks ~80 geometries, ~70 materials and ~50 GPU-resident textures.
   */
  disposeObject(root, { disposeTextures = true } = {}) {
    if (!root || typeof root.traverse !== 'function') return;
    const seenTextures = new Set();

    root.traverse((child) => {
      if (child.geometry && typeof child.geometry.dispose === 'function') {
        child.geometry.dispose();
      }

      const mats = Array.isArray(child.material) ? child.material : (child.material ? [child.material] : []);
      mats.forEach((mat) => {
        if (!mat) return;
        // Materials minted by setViewMode (uv / isolate) are not shared, so always free them.
        // Originals are tracked in the cache and must be kept alive.
        if (mat.userData && mat.userData.isViewModeMaterial) {
          if (disposeTextures && mat.map && !seenTextures.has(mat.map)) {
            seenTextures.add(mat.map);
            if (mat.map.dispose) mat.map.dispose();
          }
          mat.dispose();
          return;
        }

        if (disposeTextures && mat.map && !seenTextures.has(mat.map)) {
          seenTextures.add(mat.map);
          // Never free a cached texture: other specimens still reference it.
          if (!this.textureCacheHas(mat.map) && mat.map.dispose) mat.map.dispose();
        }
      });

      if (child.isPoints && child.material) {
        if (child.material.map && !this.textureCacheHas(child.material.map)) {
          child.material.map.dispose();
        }
        child.material.dispose();
      }
    });

    if (root.parent) root.parent.remove(root);
  }

  textureCacheHas(texture) {
    for (const cached of this.textureCache.values()) {
      if (cached === texture) return true;
    }
    return false;
  }

  /** Remove the current specimen (and compare specimen) and free their resources. */
  clearSpecimenGroup() {
    if (this.specimenGroup) {
      this.disposeObject(this.specimenGroup);
      this.specimenGroup = null;
    }
    if (this.compareSpecimenGroup) {
      this.disposeObject(this.compareSpecimenGroup);
      this.compareSpecimenGroup = null;
    }
    this.hoveredBookMesh = null;
    this.active3DBook = null;
    this.activeBookOpenTween = null;
    this.activeBookPageTween = null;
    this.activeBookOpenAmount = 0;
    this.activeBookPageFlip = 0;
  }

  /* ---- Render-loop gating: no GPU work while hidden or off-screen ---- */
  setupRenderGating() {
    this._onVisibilityChange = () => {
      if (document.hidden) this.pauseLoop();
      else if (document.body.classList.contains('mode-specimen')) this.resumeLoop();
    };
    document.addEventListener('visibilitychange', this._onVisibilityChange);

    if (typeof IntersectionObserver !== 'undefined' && this.mount) {
      this._visibilityObserver = new IntersectionObserver((entries) => {
        const isIntersecting = entries.some((e) => e.isIntersecting);
        this._inViewport = isIntersecting;
        if (isIntersecting && !document.hidden && document.body.classList.contains('mode-specimen')) {
          this.resumeLoop();
          this.handleResize();
        } else if (!isIntersecting && !document.body.classList.contains('mode-specimen')) {
          this.pauseLoop();
        }
      }, { threshold: 0 });
      this._visibilityObserver.observe(this.mount);
    } else {
      this._inViewport = true;
    }
  }

  pauseLoop() {
    this._running = false;
    this._loopStarted = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  stopLoop() {
    this.pauseLoop();
  }

  resumeLoop() {
    if (!this.renderer || !this.hasThree) return;
    this._running = true;
    if (!this._loopStarted) {
      this._loopStarted = true;
      this._rafId = requestAnimationFrame(() => this.animate());
    }
  }

  startLoop() {
    this.resumeLoop();
  }

  /** Full teardown — call when unmounting the viewer. */
  dispose() {
    this._running = false;
    this._loopStarted = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this._resizeRetryId) cancelAnimationFrame(this._resizeRetryId);
    this._resizeRetryId = null;

    if (this._visibilityObserver) { this._visibilityObserver.disconnect(); this._visibilityObserver = null; }
    if (this._onVisibilityChange) { document.removeEventListener('visibilitychange', this._onVisibilityChange); }
    if (this._resizeObserver) { this._resizeObserver.disconnect(); this._resizeObserver = null; }
    // Window and canvas listeners used to survive teardown, so a viewer built
    // on the same mount double-bound every resize and keydown.
    if (this._onResize) { window.removeEventListener('resize', this._onResize); this._onResize = null; }
    if (this._onKeyDown && this.renderer) {
      this.renderer.domElement.removeEventListener('keydown', this._onKeyDown);
    }
    this._onKeyDown = null;

    this.clearSpecimenGroup();
    if (this.secondaryPlinthGroup) { this.disposeObject(this.secondaryPlinthGroup); this.secondaryPlinthGroup = null; }
    if (this.plinthGroup) { this.disposeObject(this.plinthGroup); this.plinthGroup = null; }
    if (this.dust) { this.disposeObject(this.dust); this.dust = null; }
    // The station backdrop swaps its texture per module; its previous maps were
    // never freed. Free them here along with the mesh itself.
    if (this.diagnosticBackdropMesh) {
      const backdrop = this.diagnosticBackdropMesh;
      if (backdrop.material) {
        if (backdrop.material.map && backdrop.material.map.dispose) backdrop.material.map.dispose();
        if (backdrop.material.dispose) backdrop.material.dispose();
      }
      this.diagnosticBackdropMesh = null;
    }

    this.textureCache.forEach((tex) => { if (tex && tex.dispose) tex.dispose(); });
    this.textureCache.clear();

    if (this.audioDiagnostic && this.audioDiagnostic.ctx) {
      try { this.audioDiagnostic.ctx.close(); } catch (_) {}
    }

    if (this.controls && typeof this.controls.dispose === 'function') this.controls.dispose();
    if (this.renderer) {
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
      this.renderer = null;
    }
    this.scene = null;
  }

  /* =========================================================================
     1. SCENE SETUP & STUDIO LIGHTING
     ========================================================================= */
  initScene() {
    this.scene = new THREE.Scene();
    this._theme = 'light';
    this.scene.background = new THREE.Color(0xf7f0e7);

    this.camera = new THREE.PerspectiveCamera(36, this.width / this.height, 0.1, 100);
    this.camera.position.set(this.homeCamera.x, this.homeCamera.y, this.homeCamera.z);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.localClippingEnabled = true;

    this.mount.appendChild(this.renderer.domElement);
    this.renderer.domElement.setAttribute(
      'aria-label',
      'Interactive 3D library specimen studio. Drag to orbit, scroll to zoom, click pins to examine features.'
    );
    this.renderer.domElement.tabIndex = 0;
    this._onKeyDown = (e) => this.onKeyDown(e);
    this.renderer.domElement.addEventListener('keydown', this._onKeyDown);

    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.055;
      this.controls.autoRotate = this.autoRotateWanted;
      this.controls.autoRotateSpeed = 0.75;
      this.controls.minDistance = 1.35;
      this.controls.maxDistance = 5.8;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.1;
      this.controls.enablePan = false;
      this.controls.target.set(this.homeTarget.x, this.homeTarget.y, this.homeTarget.z);
      this.controls.addEventListener('start', () => {
        this._interactionUntil = performance.now() + 3200;
      });
    }

    this._onResize = () => this.handleResize();
    window.addEventListener('resize', this._onResize);
    if (typeof ResizeObserver !== 'undefined' && this.mount) {
      this._resizeObserver = new ResizeObserver(() => this.handleResize());
      this._resizeObserver.observe(this.mount);
    }

    // Studio Lighting: Key + Warm Fill + Cool Rim + Ambient
    const ambientLight = new THREE.AmbientLight(0xfff6ec, 0.95);
    ambientLight.name = 'ambientLight';
    this.scene.add(ambientLight);

    // Warm Key Spot with Soft Shadows
    const keySpot = new THREE.SpotLight(0xfff5ea, 2.6);
    keySpot.position.set(2.8, 5.2, 3.8);
    keySpot.angle = 0.65;
    keySpot.penumbra = 0.5;
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    keySpot.shadow.bias = -0.0001;
    keySpot.name = 'keySpot';
    this.scene.add(keySpot);

    // Warm Fill Light from front-left
    const fillLight = new THREE.DirectionalLight(0xffecd6, 0.85);
    fillLight.position.set(-3.2, 2.2, 2.0);
    fillLight.name = 'fillLight';
    this.scene.add(fillLight);

    // Cool Rim / Backlight for specular rim definition
    const rimLight = new THREE.DirectionalLight(0xd4e4f7, 0.95);
    rimLight.position.set(1.6, 3.5, -3.6);
    rimLight.name = 'rimLight';
    this.scene.add(rimLight);

    // Interactive Banker's Desk Lamp Spot
    this.bankerLampSpot = new THREE.SpotLight(0xffdf99, 2.4);
    this.bankerLampSpot.position.set(-1.4, 0.95, 0.75);
    this.bankerLampSpot.target.position.set(0, 0, 0);
    this.bankerLampSpot.angle = 0.78;
    this.bankerLampSpot.penumbra = 0.6;
    this.bankerLampSpot.castShadow = true;
    this.bankerLampSpot.name = 'bankerLampSpot';
    this.scene.add(this.bankerLampSpot);
    this.scene.add(this.bankerLampSpot.target);

    // Interactive Raking Light (Grazing Incidence at 8° elevation)
    this.rakingLight = new THREE.DirectionalLight(0xffedd5, 0);
    this.rakingLight.castShadow = true;
    this.rakingLight.shadow.mapSize.width = 1024;
    this.rakingLight.shadow.mapSize.height = 1024;
    this.rakingLight.shadow.bias = -0.0001;
    this.rakingLight.name = 'rakingLight';
    this.updateRakingLightPosition();
    this.scene.add(this.rakingLight);

    // Subtle floating dust motes (atelier atmosphere)
    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 42;
    const positions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4.5;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0xc28e46, size: 0.02, transparent: true, opacity: 0.25 })
    );
    this.scene.add(this.dust);

    this.createMahoganyPlinth();
    this.createCaliperLines();
    this.setupTelemetryOverlay();
    this.setupMicroLoupe();
    this.setupXRF();
    this.setupProvenanceTimeline();
    this.setupHydrationTest();
    this.setupShelfBookInteractions();
  }

  /* =========================================================================
     2. HIGH-TECH DIAGNOSTIC OPTICAL SCANNER PLINTH & ENVIRONMENT CONTINUITY
     ========================================================================= */
  createDiagnosticGridTexture() {
    return this.cachedTexture('curatorial-mat-texture', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // 1. Deep forest green archival baize / felt cloth
      ctx.fillStyle = '#16241c';
      ctx.fillRect(0, 0, 1024, 1024);

      // 2. Subtle cloth weave and radial shading
      const radGrad = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
      radGrad.addColorStop(0, 'rgba(28, 44, 34, 0.95)');
      radGrad.addColorStop(0.70, 'rgba(20, 32, 24, 0.98)');
      radGrad.addColorStop(1, 'rgba(10, 16, 12, 1.0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Felt texture noise
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      for (let i = 0; i < 4000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      // 3. Antique Gold Foil Concentric Calibration Rings
      const rings = [120, 200, 280, 360, 440, 485];
      rings.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(512, 512, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === rings.length - 1 ? 'rgba(202, 162, 85, 0.75)' : 'rgba(202, 162, 85, 0.28)';
        ctx.lineWidth = idx === rings.length - 1 ? 2.8 : 1.2;
        ctx.stroke();
      });

      // 4. Polar Degree & Spine Alignment Ticks (0°–360°)
      for (let a = 0; a < 360; a += 15) {
        const rad = (a * Math.PI) / 180;
        const r1 = 450;
        const r2 = a % 45 === 0 ? 480 : 466;
        ctx.beginPath();
        ctx.moveTo(512 + Math.cos(rad) * r1, 512 + Math.sin(rad) * r1);
        ctx.lineTo(512 + Math.cos(rad) * r2, 512 + Math.sin(rad) * r2);
        ctx.strokeStyle = a % 90 === 0 ? 'rgba(218, 178, 98, 0.85)' : 'rgba(202, 162, 85, 0.45)';
        ctx.lineWidth = a % 45 === 0 ? 2 : 1;
        ctx.stroke();

        if (a % 45 === 0) {
          const textR = 430;
          const tx = 512 + Math.cos(rad) * textR;
          const ty = 512 + Math.sin(rad) * textR;
          ctx.save();
          ctx.translate(tx, ty);
          ctx.rotate(rad + Math.PI / 2);
          ctx.fillStyle = 'rgba(218, 178, 98, 0.65)';
          ctx.font = '600 11px "DM Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(a + '°', 0, 0);
          ctx.restore();
        }
      }

      // 5. Center crosshair & book centering guides
      ctx.strokeStyle = 'rgba(218, 178, 98, 0.55)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(512 - 60, 512); ctx.lineTo(512 + 60, 512);
      ctx.moveTo(512, 512 - 60); ctx.lineTo(512, 512 + 60);
      ctx.stroke();

      // Rectangular book cradle footprint guide
      ctx.strokeStyle = 'rgba(202, 162, 85, 0.32)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(512 - 160, 512 - 210, 320, 420);
      ctx.setLineDash([]);

      // 6. Classical Archival Typography
      ctx.fillStyle = 'rgba(218, 178, 98, 0.75)';
      ctx.font = '600 13px "Cormorant Garamond", serif';
      ctx.textAlign = 'center';
      ctx.fillText('BIBLIO ATELIER · TABULA CURATORIALIS', 512, 185);
      ctx.font = 'italic 11px "Cormorant Garamond", serif';
      ctx.fillText('Ex Libris Archivi — Conservatio et Descriptio Bibliographica', 512, 204);

      ctx.font = '500 10px "DM Sans", sans-serif';
      ctx.fillStyle = 'rgba(202, 162, 85, 0.55)';
      ctx.fillText('PRECISION SPECIMEN STAGE · CALIBRATED METRIC RULER', 512, 835);

      const tex = new THREE.CanvasTexture(canvas);
      if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
      return tex;
    });
  }

  createLaserSweepTexture() {
    return this.cachedTexture('diagnostic-laser-sweep', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 64, 512);
      const tex = new THREE.CanvasTexture(canvas);
      if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
      return tex;
    });
  }

  createMahoganyPlinth() {
    this.plinthGroup = new THREE.Group();
    this.plinthGroup.name = 'plinthGroup';

    // 1. Warm Oak Library Parquet Room Floor Disc (Grounds the entire turntable)
    const floorGeo = new THREE.CylinderGeometry(5.2, 5.2, 0.04, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1f1610,
      roughness: 0.65,
      metalness: 0.04
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.44;
    floorMesh.receiveShadow = true;
    this.plinthGroup.add(floorMesh);

    // 2. Soft Ambient Occlusion Radial Drop Shadow
    const shadowGeo = new THREE.CircleGeometry(1.68, 64);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: this.createContactShadowTexture(),
      transparent: true,
      opacity: 0.82,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.name = 'contactShadow';
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.418;
    this.plinthGroup.add(shadowMesh);

    // 3. French-Polished Dark Mahogany Wood Base
    const baseGeo = new THREE.CylinderGeometry(1.42, 1.48, 0.12, 64);
    const mahoganyMat = new THREE.MeshStandardMaterial({
      color: 0x2b1810,
      roughness: 0.35,
      metalness: 0.06
    });
    const baseMesh = new THREE.Mesh(baseGeo, mahoganyMat);
    baseMesh.position.y = -0.36;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.plinthGroup.add(baseMesh);

    // 4. Solid Brushed Satin Brass Bezel Trim Ring
    const rimGeo = new THREE.TorusGeometry(1.36, 0.022, 20, 64);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc8a255,
      roughness: 0.28,
      metalness: 0.88
    });
    const rimMesh = new THREE.Mesh(rimGeo, brassMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -0.25;
    rimMesh.castShadow = true;
    this.plinthGroup.add(rimMesh);

    // 5. Upper Mahogany Turntable Disc
    const topTierGeo = new THREE.CylinderGeometry(1.34, 1.34, 0.035, 64);
    const topMesh = new THREE.Mesh(topTierGeo, mahoganyMat);
    topMesh.position.y = -0.265;
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    this.plinthGroup.add(topMesh);

    // 6. Inlaid Forest-Green Archival Baize Mat (Circular — zero square corner clipping!)
    const matTex = this.createDiagnosticGridTexture();
    const matPlane = new THREE.Mesh(
      new THREE.CircleGeometry(1.33, 64),
      new THREE.MeshStandardMaterial({
        map: matTex,
        roughness: 0.65,
        metalness: 0.08
      })
    );
    matPlane.rotation.x = -Math.PI / 2;
    matPlane.position.y = -0.246;
    matPlane.receiveShadow = true;
    this.plinthGroup.add(matPlane);

    // 7. Museum Conservator's Archival V-Cradle & Handling Accessories
    const cradleGroup = new THREE.Group();
    cradleGroup.name = 'bookCradleGroup';

    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x1a1719,
      roughness: 0.94,
      metalness: 0.02
    });
    const brassTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.22
    });

    // Sub-group oriented to match book showcase angle (y: -0.35, x: 0.12)
    const bookCradleStand = new THREE.Group();
    bookCradleStand.rotation.set(0.12, -0.35, 0);
    bookCradleStand.position.set(0, 0.08, 0);

    // Contoured V-Cradle base pad resting below the book tail
    const baseBed = new THREE.Mesh(
      new THREE.BoxGeometry(0.50, 0.032, 0.28),
      velvetMat
    );
    baseBed.position.set(0, -0.316, 0);
    baseBed.receiveShadow = true;
    bookCradleStand.add(baseBed);

    // Soft cushioned spine trough channel at x = -0.20
    const spineTrough = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.024, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x110f12, roughness: 0.96 })
    );
    spineTrough.position.set(-0.20, -0.306, 0);
    spineTrough.receiveShadow = true;
    bookCradleStand.add(spineTrough);

    // Rear Board Archival Support Wing (tilted along -Z to cradle the back cover)
    const rearWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.034, 0.16),
      velvetMat
    );
    rearWing.position.set(0, -0.302, -0.11);
    rearWing.rotation.x = -0.22;
    rearWing.receiveShadow = true;
    rearWing.castShadow = true;
    bookCradleStand.add(rearWing);

    // Front Board Archival Support Wing (tilted along +Z to cradle the front cover when closed or opened)
    const frontWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.034, 0.16),
      velvetMat
    );
    frontWing.position.set(0, -0.302, 0.11);
    frontWing.rotation.x = 0.22;
    frontWing.receiveShadow = true;
    frontWing.castShadow = true;
    bookCradleStand.add(frontWing);

    // Brushed satin brass retaining lip on the tail edge
    const brassLedge = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.016, 0.014),
      brassTrimMat
    );
    brassLedge.position.set(0, -0.296, 0.14);
    brassLedge.receiveShadow = true;
    brassLedge.castShadow = true;
    bookCradleStand.add(brassLedge);

    cradleGroup.add(bookCradleStand);

    // Archival Snake Weights (Forest green silk-braided lead-shot weights with turned brass finials)
    const snakeMat = new THREE.MeshStandardMaterial({
      color: 0x1b3427,
      roughness: 0.74,
      metalness: 0.08
    });
    const snakeGeo = new THREE.CylinderGeometry(0.010, 0.010, 0.44, 16);
    const finialGeo = new THREE.CylinderGeometry(0.013, 0.011, 0.024, 16);

    // Left Snake Weight resting elegantly on the green baize mat
    const leftSnakeGroup = new THREE.Group();
    const leftSnake = new THREE.Mesh(snakeGeo, snakeMat);
    leftSnake.rotation.x = Math.PI / 2;
    leftSnake.rotation.z = -0.22;
    leftSnake.position.set(-0.36, -0.238, 0.02);
    leftSnake.receiveShadow = true;
    leftSnake.castShadow = true;
    leftSnakeGroup.add(leftSnake);

    const lCap1 = new THREE.Mesh(finialGeo, brassTrimMat);
    lCap1.rotation.x = Math.PI / 2;
    lCap1.rotation.z = -0.22;
    lCap1.position.set(-0.41, -0.238, -0.19);
    leftSnakeGroup.add(lCap1);

    const lCap2 = new THREE.Mesh(finialGeo, brassTrimMat);
    lCap2.rotation.x = Math.PI / 2;
    lCap2.rotation.z = -0.22;
    lCap2.position.set(-0.31, -0.238, 0.23);
    leftSnakeGroup.add(lCap2);
    cradleGroup.add(leftSnakeGroup);

    // Right Snake Weight resting on the opposite side
    const rightSnakeGroup = new THREE.Group();
    const rightSnake = new THREE.Mesh(snakeGeo, snakeMat);
    rightSnake.rotation.x = Math.PI / 2;
    rightSnake.rotation.z = 0.20;
    rightSnake.position.set(0.36, -0.238, -0.02);
    rightSnake.receiveShadow = true;
    rightSnake.castShadow = true;
    rightSnakeGroup.add(rightSnake);

    const rCap1 = new THREE.Mesh(finialGeo, brassTrimMat);
    rCap1.rotation.x = Math.PI / 2;
    rCap1.rotation.z = 0.20;
    rCap1.position.set(0.32, -0.238, -0.23);
    rightSnakeGroup.add(rCap1);

    const rCap2 = new THREE.Mesh(finialGeo, brassTrimMat);
    rCap2.rotation.x = Math.PI / 2;
    rCap2.rotation.z = 0.20;
    rCap2.position.set(0.40, -0.238, 0.19);
    rightSnakeGroup.add(rCap2);
    cradleGroup.add(rightSnakeGroup);

    // Folded white cotton inspection gloves resting on the edge of the turntable mat
    const gloveMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.95,
      metalness: 0.0
    });
    const gloveGroup = new THREE.Group();
    const glovePalm = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.016, 0.18),
      gloveMat
    );
    glovePalm.position.set(0.46, -0.238, 0.26);
    glovePalm.rotation.y = -0.35;
    glovePalm.receiveShadow = true;
    glovePalm.castShadow = true;
    gloveGroup.add(glovePalm);

    const gloveCuff = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.020, 0.05),
      gloveMat
    );
    gloveCuff.position.set(0.49, -0.236, 0.33);
    gloveCuff.rotation.y = -0.35;
    gloveCuff.receiveShadow = true;
    gloveGroup.add(gloveCuff);
    cradleGroup.add(gloveGroup);

    this.plinthGroup.add(cradleGroup);
    this.cradleGroup = cradleGroup;

    // Laser sweeps are deactivated for authentic historical realism
    this.laserSweepMesh = null;
    this.laserSweepFan = null;

    this.scene.add(this.plinthGroup);
  }

  createSecondaryPlinth() {
    if (this.secondaryPlinthGroup) return;
    this.secondaryPlinthGroup = this.plinthGroup.clone(true);
    this.secondaryPlinthGroup.name = 'secondaryPlinthGroup';
    this.scene.add(this.secondaryPlinthGroup);
  }

  setStationBackdrop(imagePath) {
    const finalPath = imagePath || this.activeStationBackdrop || 'assets/walkthrough/reading_room.jpg?v=pure2';
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(finalPath, (tex) => {
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      if (this.renderer && this.renderer.capabilities) {
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      }

      if (!this.diagnosticBackdropMesh) {
        // Curved panoramic cyclorama that naturally wraps 180° around the workbench
        const bgGeo = new THREE.CylinderGeometry(18, 18, 16, 64, 1, true, Math.PI * 0.40, Math.PI * 1.2);
        const bgMat = new THREE.MeshBasicMaterial({
          map: tex,
          side: THREE.BackSide,
          depthWrite: false,
          depthTest: true
        });
        this.diagnosticBackdropMesh = new THREE.Mesh(bgGeo, bgMat);
        this.diagnosticBackdropMesh.position.set(0, 1.8, 0);
        this.diagnosticBackdropMesh.name = 'diagnosticStationBackdrop';
        this.scene.add(this.diagnosticBackdropMesh);
      } else {
        // Free the previous backdrop map before replacing it — each module
        // switch otherwise leaves a GPU texture behind forever.
        const prevMap = this.diagnosticBackdropMesh.material.map;
        this.diagnosticBackdropMesh.material.map = tex;
        this.diagnosticBackdropMesh.material.needsUpdate = true;
        this.diagnosticBackdropMesh.visible = true;
        if (prevMap && prevMap !== tex && prevMap.dispose) prevMap.dispose();
      }
      this.activeStationBackdrop = imagePath;
    });
  }

  /* =========================================================================
     2b. GLOWING CYAN LASER CALIPER LINES (Dynamic Buffer Geometry)
     ========================================================================= */
  createCaliperLines() {
    if (this.caliperLinesMesh) return;
    const maxLines = 64;
    const positions = new Float32Array(maxLines * 6);
    const colors = new Float32Array(maxLines * 6);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.caliperLinesMesh = new THREE.LineSegments(geometry, material);
    this.caliperLinesMesh.name = 'laserCaliperLines';
    this.caliperLinesMesh.visible = false;
    this.scene.add(this.caliperLinesMesh);
  }

  updateCaliperLines(amount) {
    if (!this.caliperLinesMesh) return;
    if (amount <= 0.01 || !this.active3DBook || !this.active3DBook.userData.anatomicalParts) {
      this.caliperLinesMesh.visible = false;
      return;
    }

    const parts = this.active3DBook.userData.anatomicalParts;
    const geo = this.caliperLinesMesh.geometry;
    const posAttr = geo.attributes.position;
    const colAttr = geo.attributes.color;
    const posArr = posAttr.array;
    const colArr = colAttr.array;

    this.active3DBook.updateWorldMatrix(true, false);
    const spineLocal = this._scratchVec.set(-0.20, 0, 0);
    const spineWorld = this.active3DBook.localToWorld(spineLocal.clone());

    let vIdx = 0;
    const rLine = 0.82, gLine = 0.68, bLine = 0.38; // Antique Gold leader lines
    const rGold = 0.95, gGold = 0.82, bGold = 0.35;

    parts.forEach((part) => {
      if (!part.object || !part.object.visible) return;
      part.object.updateWorldMatrix(true, false);

      const partWorld = new THREE.Vector3();
      part.object.getWorldPosition(partWorld);
      if (part.anchorOffset) {
        partWorld.add(part.anchorOffset);
      }

      // Connecting line: Spine Anchor -> Part Center
      posArr[vIdx * 3]     = spineWorld.x;
      posArr[vIdx * 3 + 1] = spineWorld.y;
      posArr[vIdx * 3 + 2] = spineWorld.z;
      colArr[vIdx * 3]     = rLine * 0.45;
      colArr[vIdx * 3 + 1] = gLine * 0.45;
      colArr[vIdx * 3 + 2] = bLine * 0.45;
      vIdx++;

      posArr[vIdx * 3]     = partWorld.x;
      posArr[vIdx * 3 + 1] = partWorld.y;
      posArr[vIdx * 3 + 2] = partWorld.z;
      colArr[vIdx * 3]     = rLine;
      colArr[vIdx * 3 + 1] = gLine;
      colArr[vIdx * 3 + 2] = bLine;
      vIdx++;

      // Perpendicular Caliper Bracket Tick
      const tickY = 0.024;
      posArr[vIdx * 3]     = partWorld.x;
      posArr[vIdx * 3 + 1] = partWorld.y - tickY;
      posArr[vIdx * 3 + 2] = partWorld.z;
      colArr[vIdx * 3]     = rGold;
      colArr[vIdx * 3 + 1] = gGold;
      colArr[vIdx * 3 + 2] = bGold;
      vIdx++;

      posArr[vIdx * 3]     = partWorld.x;
      posArr[vIdx * 3 + 1] = partWorld.y + tickY;
      posArr[vIdx * 3 + 2] = partWorld.z;
      colArr[vIdx * 3]     = rGold;
      colArr[vIdx * 3 + 1] = gGold;
      colArr[vIdx * 3 + 2] = bGold;
      vIdx++;
    });

    // Zero out unused vertices
    for (let i = vIdx * 3; i < posArr.length; i++) {
      posArr[i] = 0;
      colArr[i] = 0;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    geo.setDrawRange(0, vIdx);

    this.caliperLinesMesh.material.opacity = Math.min(1.0, amount * 1.15);
    this.caliperLinesMesh.visible = true;
  }

  /* =========================================================================
     2c. FLOATING GLASSMORPHIA DIAGNOSTIC TELEMETRY BADGES
     ========================================================================= */
  setupTelemetryOverlay() {
    this.telemetryContainer = document.getElementById('diagnostic-telemetry-overlay');
    if (!this.telemetryContainer && this.overlay) {
      this.telemetryContainer = document.createElement('div');
      this.telemetryContainer.id = 'diagnostic-telemetry-overlay';
      this.telemetryContainer.className = 'diagnostic-telemetry-overlay';
      this.overlay.appendChild(this.telemetryContainer);
    }
    if (!this.telemetryContainer) return;

    this.telemetrySvg = document.getElementById('telemetry-svg-canvas');
    if (!this.telemetrySvg) {
      this.telemetrySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.telemetrySvg.id = 'telemetry-svg-canvas';
      this.telemetrySvg.setAttribute('class', 'telemetry-svg-canvas');
      this.telemetryContainer.appendChild(this.telemetrySvg);
    }

    this.telemetryBadgesLayer = document.getElementById('telemetry-badges-layer');
    if (!this.telemetryBadgesLayer) {
      this.telemetryBadgesLayer = document.createElement('div');
      this.telemetryBadgesLayer.id = 'telemetry-badges-layer';
      this.telemetryBadgesLayer.className = 'telemetry-badges-layer';
      this.telemetryContainer.appendChild(this.telemetryBadgesLayer);
    }
  }

  buildTelemetryBadges(parts) {
    if (!this.telemetryBadgesLayer || !this.telemetrySvg) return;
    this.telemetryBadgesLayer.innerHTML = '';
    this.telemetrySvg.innerHTML = '';
    this.telemetryBadges = [];

    parts.forEach((part, idx) => {
      // Create HTML glassmorphic badge
      const badge = document.createElement('div');
      badge.className = 'telemetry-badge';
      badge.id = `telemetry-badge-${part.id}`;
      badge.style.opacity = '0';
      badge.style.display = 'none';

      let metricsHtml = '';
      if (part.metrics) {
        metricsHtml = Object.entries(part.metrics).map(([k, v]) => `
          <div class="metric-col"><small>${k}</small><b>${v}</b></div>
        `).join('');
      }

      badge.innerHTML = `
        <div class="badge-header">
          <span class="badge-tag">${part.tag || `ASM-0${idx + 1}`}</span>
          <span class="badge-status-dot"></span>
        </div>
        <strong class="badge-title">${part.name}</strong>
        <span class="badge-spec">${part.spec || ''}</span>
        <div class="badge-metrics">${metricsHtml}</div>
      `;

      this.telemetryBadgesLayer.appendChild(badge);

      // Create SVG leader line path and anchor circle
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'telemetry-leader-line');
      path.setAttribute('id', `telemetry-line-${part.id}`);
      this.telemetrySvg.appendChild(path);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'telemetry-anchor-dot');
      circle.setAttribute('r', '3');
      circle.setAttribute('id', `telemetry-dot-${part.id}`);
      this.telemetrySvg.appendChild(circle);

      this.telemetryBadges.push({
        part,
        badge,
        path,
        circle,
        side: (idx % 2 === 0) ? 'right' : 'left',
        verticalSlot: idx
      });
    });
  }

  updateTelemetryOverlay(amount) {
    if (!this.telemetryContainer || !this.telemetryBadges.length || !this.camera) return;

    if (amount <= 0.12) {
      this.telemetryBadges.forEach(({ badge, path, circle }) => {
        badge.style.display = 'none';
        badge.style.opacity = '0';
        path.setAttribute('d', '');
        circle.setAttribute('cx', '-100');
      });
      return;
    }

    const dom = this.renderer ? this.renderer.domElement : null;
    const w = dom ? dom.clientWidth : this.width;
    const h = dom ? dom.clientHeight : this.height;
    const opacity = Math.min(1.0, (amount - 0.12) / 0.55);

    const projected = this._scratchVec;

    this.telemetryBadges.forEach(({ part, badge, path, circle, side }, idx) => {
      if (!part.object || !part.object.visible) {
        badge.style.display = 'none';
        path.setAttribute('d', '');
        circle.setAttribute('cx', '-100');
        return;
      }

      part.object.getWorldPosition(projected);
      if (part.anchorOffset) projected.add(part.anchorOffset);

      projected.project(this.camera);

      // If behind camera plane, hide
      if (projected.z > 1.0) {
        badge.style.display = 'none';
        path.setAttribute('d', '');
        circle.setAttribute('cx', '-100');
        return;
      }

      const sx = (projected.x * 0.5 + 0.5) * w;
      const sy = (-projected.y * 0.5 + 0.5) * h;

      // Layout slots along left or right flanks of viewer
      const badgeW = 190;
      const badgeH = 75;
      let bx, by;

      if (side === 'left') {
        bx = Math.max(16, sx - badgeW - 65);
      } else {
        bx = Math.min(w - badgeW - 16, sx + 65);
      }
      by = Math.max(65, Math.min(h - badgeH - 45, sy - (idx % 4 - 1.5) * 45));

      badge.style.display = 'block';
      badge.style.transform = `translate(${bx}px, ${by}px)`;
      badge.style.opacity = opacity.toFixed(3);

      // Draw Leader Line from Anchor Point to Badge
      circle.setAttribute('cx', sx.toFixed(1));
      circle.setAttribute('cy', sy.toFixed(1));

      const edgeX = (side === 'left') ? (bx + badgeW) : bx;
      const edgeY = by + badgeH / 2;
      const midX = (sx + edgeX) / 2;

      path.setAttribute('d', `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${midX.toFixed(1)} ${sy.toFixed(1)} ${edgeX.toFixed(1)} ${edgeY.toFixed(1)}`);
      path.style.opacity = opacity.toFixed(3);
    });
  }

  setupShelfBookInteractions() {
    if (!this.renderer || !this.renderer.domElement) return;
    const dom = this.renderer.domElement;

    // Create floating shelf tooltip
    this.shelfTooltipEl = document.createElement('div');
    this.shelfTooltipEl.className = 'shelf-book-tooltip';
    this.shelfTooltipEl.hidden = true;
    if (this.overlay) {
      this.overlay.appendChild(this.shelfTooltipEl);
    } else {
      this.mount.appendChild(this.shelfTooltipEl);
    }

    dom.addEventListener('pointerdown', (e) => {
      this.pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    // Raycasting a 100+ mesh subtree on every pointermove is far too expensive while
    // orbiting. Throttle to one test per animation frame and reuse the last rect.
    let pendingMove = null;
    let moveFrame = 0;
    let cachedRect = null;

    const runHoverTest = () => {
      moveFrame = 0;
      if (!pendingMove) return;
      const e = pendingMove;
      pendingMove = null;
      if (!this.mouse || !this.camera || !this.specimenGroup) return;

      cachedRect = cachedRect || dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - cachedRect.left) / cachedRect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - cachedRect.top) / cachedRect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.specimenGroup.children, true);

      let foundBook = null;
      for (const hit of intersects) {
        let obj = hit.object;
        while (obj && obj !== this.specimenGroup) {
          if (obj.userData && obj.userData.isShelfBook) {
            foundBook = obj;
            break;
          }
          obj = obj.parent;
        }
        if (foundBook) break;
      }

      if (foundBook) {
        dom.style.cursor = 'pointer';
        if (this.hoveredBookMesh !== foundBook) {
          if (this.hoveredBookMesh && this.hoveredBookMesh.userData.origZ !== undefined) {
            this.hoveredBookMesh.position.z = this.hoveredBookMesh.userData.origZ;
          }
          this.hoveredBookMesh = foundBook;
          if (foundBook.userData.origZ !== undefined) {
            foundBook.position.z = foundBook.userData.origZ + 0.055;
          }
        }
        if (this.shelfTooltipEl && foundBook.userData.bookData) {
          const b = foundBook.userData.bookData;
          if (this.shelfTooltipEl.dataset.bookId !== String(b.id)) {
            this.shelfTooltipEl.dataset.bookId = String(b.id);
            this.shelfTooltipEl.replaceChildren();
            const strong = document.createElement('strong');
            strong.textContent = `📖 ${b.title}`;
            const small = document.createElement('small');
            small.textContent = `${b.author ? b.author + ' · ' : ''}Click to Read Folio`;
            this.shelfTooltipEl.append(strong, small);
          }
          this.shelfTooltipEl.style.left = `${e.clientX - cachedRect.left + 14}px`;
          this.shelfTooltipEl.style.top = `${e.clientY - cachedRect.top + 14}px`;
          this.shelfTooltipEl.hidden = false;
        }
      } else {
        if (this.hoveredBookMesh) {
          if (this.hoveredBookMesh.userData.origZ !== undefined) {
            this.hoveredBookMesh.position.z = this.hoveredBookMesh.userData.origZ;
          }
          this.hoveredBookMesh = null;
          dom.style.cursor = 'default';
        }
        if (this.shelfTooltipEl) this.shelfTooltipEl.hidden = true;
      }
    };

    dom.addEventListener('pointermove', (e) => {
      pendingMove = e;
      cachedRect = null;
      if (!moveFrame) moveFrame = requestAnimationFrame(runHoverTest);
    });

    dom.addEventListener('pointerleave', () => {
      pendingMove = null;
      if (moveFrame) { cancelAnimationFrame(moveFrame); moveFrame = 0; }
      if (this.hoveredBookMesh) {
        if (this.hoveredBookMesh.userData.origZ !== undefined) {
          this.hoveredBookMesh.position.z = this.hoveredBookMesh.userData.origZ;
        }
        this.hoveredBookMesh = null;
        dom.style.cursor = 'default';
      }
      if (this.shelfTooltipEl) this.shelfTooltipEl.hidden = true;
    });

    dom.addEventListener('pointerup', (e) => {
      const dx = Math.abs(e.clientX - this.pointerDownPos.x);
      const dy = Math.abs(e.clientY - this.pointerDownPos.y);
      if (dx > 7 || dy > 7) return; // ignore orbit drags

      if (this.hoveredBookMesh && this.hoveredBookMesh.userData.bookData) {
        const b = this.hoveredBookMesh.userData.bookData;
        if (this.onBookSelect) {
          this.onBookSelect(b);
        }
      }
    });
  }

  /* =========================================================================
     3. PROCEDURAL TEXTURES & REAL 3D BOOK ANATOMY ENGINE
     ========================================================================= */
  createWoodTexture(baseHex = '#4a3629', grainHex = '#2f2017') {
    return this.cachedTexture(`wood-${baseHex}-${grainHex}`, () => this._generateWood(baseHex, grainHex));
  }

  _generateWood(baseHex, grainHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = grainHex;
    for (let i = 0; i < 600; i++) {
      ctx.globalAlpha = 0.04 + Math.random() * 0.08;
      const x = Math.random() * 256;
      const w = 1 + Math.random() * 3;
      ctx.fillRect(x, 0, w, 256);
    }
    ctx.globalAlpha = 1.0;
    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  // Master Archival Library Binding - Front Cover Procedural Texture
  createLibraryCoverTexture(bookData = {}) {
    const key = `lib-cover-${bookData.id || bookData.title || 'default'}`;
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1536;
    const ctx = canvas.getContext('2d');

    const spineHex = bookData.spineColor || '#4a151b';
    const c = new THREE.Color(spineHex);

    // 1. Rich Morocco Leather & Calfskin Base Tone with Vignette
    const bgGrad = ctx.createRadialGradient(512, 768, 120, 512, 768, 850);
    bgGrad.addColorStop(0, `rgb(${Math.min(255, (c.r * 255 * 1.25) | 0)}, ${Math.min(255, (c.g * 255 * 1.25) | 0)}, ${Math.min(255, (c.b * 255 * 1.25) | 0)})`);
    bgGrad.addColorStop(0.7, `rgb(${(c.r * 255 * 0.85) | 0}, ${(c.g * 255 * 0.85) | 0}, ${(c.b * 255 * 0.85) | 0})`);
    bgGrad.addColorStop(1, `rgb(${(c.r * 255 * 0.45) | 0}, ${(c.g * 255 * 0.45) | 0}, ${(c.b * 255 * 0.45) | 0})`);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1536);

    // 2. Tactile Morocco Leather Pebble Grain
    for (let i = 0; i < 4500; i++) {
      const gx = Math.random() * 1024;
      const gy = Math.random() * 1536;
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(gx, gy, 2.5, 2.5);
      ctx.fillStyle = 'rgba(255,255,255,0.035)';
      ctx.fillRect(gx + 1, gy + 1, 1.5, 1.5);
    }

    // 3. 24-Karat Gold-Leaf Fillet Borders & Tooling
    ctx.save();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(60, 60, 904, 1416);

    ctx.strokeStyle = '#f3d078';
    ctx.lineWidth = 2;
    ctx.strokeRect(74, 74, 876, 1388);

    ctx.strokeStyle = '#c28e46';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(96, 96, 832, 1344);

    // Ornate French Renaissance Corner Arabesques & Fleurons
    const drawCornerFleuron = (cx, cy, flipX, flipY) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      ctx.strokeStyle = '#d4af37';
      ctx.fillStyle = '#f3d078';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.arc(40, 40, 24, Math.PI, Math.PI * 1.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(60, 10);
      ctx.lineTo(60, 20);
      ctx.lineTo(20, 20);
      ctx.lineTo(20, 60);
      ctx.lineTo(10, 60);
      ctx.closePath();
      ctx.fill();

      // Small rosette
      ctx.beginPath();
      ctx.arc(32, 32, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    drawCornerFleuron(96, 96, false, false);
    drawCornerFleuron(928, 96, true, false);
    drawCornerFleuron(96, 1440, false, true);
    drawCornerFleuron(928, 1440, true, true);

    // 4. Central Gilt Cartouche / Medallion
    const midX = 512, midY = 460;
    const cartoucheGrad = ctx.createRadialGradient(midX, midY, 10, midX, midY, 160);
    cartoucheGrad.addColorStop(0, 'rgba(212, 175, 55, 0.22)');
    cartoucheGrad.addColorStop(0.8, 'rgba(194, 142, 70, 0.08)');
    cartoucheGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = cartoucheGrad;
    ctx.beginPath();
    ctx.arc(midX, midY, 160, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(midX, midY, 140, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#f3d078';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(midX, midY, 128, 0, Math.PI * 2);
    ctx.stroke();

    // Central Library Emblem (Open Book & Torch of Knowledge)
    ctx.fillStyle = '#f3d078';
    ctx.font = '54px serif';
    ctx.textAlign = 'center';
    ctx.fillText("🏛", midX, midY + 18);

    // 5. Embossed Gold Typography
    const title = bookData.title || "Library Science Monograph";
    const author = bookData.author || "Melvil Dewey";
    const year = bookData.year || "1876";

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = '#fff4d6';
    ctx.font = '700 58px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';

    // Word wrap title
    const words = title.split(' ');
    let line = '';
    let startY = 740;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 720 && n > 0) {
        ctx.fillText(line.trim(), midX, startY);
        line = words[n] + ' ';
        startY += 68;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), midX, startY);
    ctx.restore();

    // Gold divider rule
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(340, startY + 36);
    ctx.lineTo(684, startY + 36);
    ctx.stroke();

    // Small center diamond
    ctx.fillStyle = '#f3d078';
    ctx.beginPath();
    ctx.arc(midX, startY + 36, 6, 0, Math.PI * 2);
    ctx.fill();

    // Author
    ctx.fillStyle = '#e8d2a6';
    ctx.font = 'italic 38px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(author, midX, startY + 95);

    // Library Imprint Seal at Bottom
    ctx.fillStyle = '#c5a059';
    ctx.font = '600 24px "DM Sans", sans-serif';
    ctx.letterSpacing = '5px';
    ctx.fillText(`BIBLIO ATELIER ARCHIVES · ${year}`, midX, 1380);

    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 8;
    this.textureCache.set(key, tex);
    return tex;
  }

  // Master Archival Spine Texture with 5 Raised Ribs & Printed Call Number Label
  createLibrarySpineTexture(bookData = {}) {
    const key = `lib-spine-${bookData.id || bookData.title || 'default'}`;
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const spineHex = bookData.spineColor || '#4a151b';
    const c = new THREE.Color(spineHex);

    // 1. Leather Tone
    ctx.fillStyle = `rgb(${(c.r * 255 * 0.9) | 0}, ${(c.g * 255 * 0.9) | 0}, ${(c.b * 255 * 0.9) | 0})`;
    ctx.fillRect(0, 0, 256, 1024);

    // 2. Leather Stippling
    for (let i = 0; i < 1200; i++) {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(Math.random() * 256, Math.random() * 1024, 2, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(Math.random() * 256, Math.random() * 1024, 1.5, 1.5);
    }

    // 3. 5 Gilded Raised Rib Bands (Traditional Hubs)
    const ribY = [110, 310, 510, 710, 910];
    ribY.forEach(y => {
      // Dark leather shadow above/below
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, y - 10, 256, 4);
      ctx.fillRect(0, y + 10, 256, 4);

      // Gold fillet tooling
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(16, y - 5, 224, 10);
      ctx.fillStyle = '#f3d078';
      ctx.fillRect(16, y - 1.5, 224, 3);
    });

    // 4. Gold Author in Top Compartment
    const author = bookData.author || "Melvil Dewey";
    ctx.save();
    ctx.translate(128, 210);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#f3d078';
    ctx.font = '600 22px "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
    const displayAuthor = author.length > 20 ? author.slice(0, 18) + '…' : author;
    ctx.fillText(displayAuthor.toUpperCase(), 0, 6);
    ctx.restore();

    // 5. Gold Title in Center Compartment (Compartment 2 & 3)
    const title = bookData.title || "Dewey Decimal";
    ctx.save();
    ctx.translate(128, 410);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#fff4d6';
    ctx.font = '700 26px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    const maxLen = 22;
    const displayTitle = title.length > maxLen ? title.slice(0, maxLen - 1) + '…' : title;
    ctx.fillText(displayTitle.toUpperCase(), 0, 8);
    ctx.restore();

    // 6. Archival Call Number Label in Bottom Compartment (Compartment 4)
    const callNumber = bookData.callNumber || "025.4 D519";
    const labelX = 36, labelY = 760, labelW = 184, labelH = 105;

    // Off-white paper label
    ctx.fillStyle = '#f8f4eb';
    ctx.fillRect(labelX, labelY, labelW, labelH);
    ctx.strokeStyle = '#b8a688';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(labelX, labelY, labelW, labelH);

    // Red library double rule
    ctx.strokeStyle = '#c53030';
    ctx.lineWidth = 1;
    ctx.strokeRect(labelX + 4, labelY + 4, labelW - 8, labelH - 8);

    // Black printed call number text
    ctx.fillStyle = '#1a1614';
    ctx.font = 'bold 24px "DM Mono", "Courier New", monospace';
    ctx.textAlign = 'center';
    const callParts = callNumber.split(' ');
    if (callParts.length > 1) {
      ctx.fillText(callParts[0], 128, labelY + 42);
      ctx.font = 'bold 20px "DM Mono", "Courier New", monospace';
      ctx.fillText(callParts.slice(1).join(' '), 128, labelY + 76);
    } else {
      ctx.fillText(callNumber, 128, labelY + 62);
    }

    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    this.textureCache.set(key, tex);
    return tex;
  }

  // Normal/Bump Texture for Tactile Leather Grain & Embossing
  createLibraryBumpTexture() {
    if (this.textureCache.has('lib-bump')) return this.textureCache.get('lib-bump');
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 768);

    // Leather grain stippling
    for (let i = 0; i < 2200; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#999999' : '#666666';
      ctx.fillRect(Math.random() * 512, Math.random() * 768, 2, 2);
    }

    // Embossed gold borders (raised in normal map)
    ctx.strokeStyle = '#d5d5d5';
    ctx.lineWidth = 5;
    ctx.strokeRect(30, 30, 452, 708);
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 432, 688);

    const tex = new THREE.CanvasTexture(canvas);
    this.textureCache.set('lib-bump', tex);
    return tex;
  }

  createMarbledEndpaperTexture(tone = 'crimson') {
    return this.cachedTexture(`endpaper-${tone}`, () => this._generateMarbledEndpaper(tone));
  }

  _generateMarbledEndpaper(tone) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const base = tone === 'crimson' ? '#2b0910' : '#14202b';
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 512);

    // Combed French Marbling Waves
    const colors = tone === 'crimson'
      ? ['#6e1324', '#a82338', '#d4af37', '#1a0408', '#f5d77f']
      : ['#23496d', '#4f8ca8', '#c28e46', '#0e1a24', '#ecd8a5'];

    for (let y = 0; y < 512; y += 8) {
      for (let x = 0; x < 512; x += 12) {
        const c = colors[(x + y) % colors.length];
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.45;
        ctx.beginPath();
        const wave = Math.sin((x + y * 0.5) * 0.08) * 12;
        ctx.ellipse(x + wave, y, 14, 6, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;

    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  createHeadbandTexture(c1 = '#b31b2c', c2 = '#d4af37') {
    return this.cachedTexture(`headband-${c1}-${c2}`, () => this._generateHeadband(c1, c2));
  }

  _generateHeadband(c1, c2) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = c2;
    for (let x = 0; x < 64; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 6, 0);
      ctx.lineTo(x + 12, 64);
      ctx.lineTo(x + 6, 64);
      ctx.closePath();
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    return tex;
  }

  createBookSpineTexture(label = '', baseHex = 0x8c6239, title = '') {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const c = new THREE.Color(baseHex);
    ctx.fillStyle = `rgb(${(c.r * 255) | 0},${(c.g * 255) | 0},${(c.b * 255) | 0})`;
    ctx.fillRect(0, 0, 128, 256);

    // Leather grain stippling
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = 'rgba(0,0,0,0.04)';
      ctx.fillRect(Math.random() * 128, Math.random() * 256, 2, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(Math.random() * 128, Math.random() * 256, 1, 1);
    }

    // Gold tooling bands
    ctx.fillStyle = 'rgba(212, 164, 90, 0.9)';
    ctx.fillRect(10, 18, 108, 3);
    ctx.fillRect(10, 24, 108, 1.5);
    ctx.fillRect(10, 228, 108, 1.5);
    ctx.fillRect(10, 234, 108, 3);

    // Raised spine ribs simulation
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(0, 72, 128, 3);
    ctx.fillRect(0, 172, 128, 3);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(0, 75, 128, 2);
    ctx.fillRect(0, 175, 128, 2);

    // Book title in gold along upper/mid spine
    if (title) {
      ctx.save();
      ctx.translate(64, 120);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = 'rgba(240, 204, 138, 0.96)';
      ctx.font = '600 11px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      const maxLen = 22;
      const displayTitle = title.length > maxLen ? title.slice(0, maxLen - 1) + '…' : title;
      ctx.fillText(displayTitle.toUpperCase(), 0, 4);
      ctx.restore();
    }

    // Call number label in sharp serif along bottom
    if (label) {
      ctx.save();
      ctx.translate(64, title ? 204 : 130);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = 'rgba(255, 250, 242, 0.95)';
      ctx.font = 'bold 12px "Cormorant Garamond", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, 0, 4);
      ctx.restore();
    }

    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  createCoverTexture(title = '', author = '', baseHex = 0x8c6239) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    const c = new THREE.Color(baseHex);
    ctx.fillStyle = `rgb(${(c.r * 255) | 0},${(c.g * 255) | 0},${(c.b * 255) | 0})`;
    ctx.fillRect(0, 0, 256, 384);

    // Leather grain texture
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = 'rgba(0,0,0,0.035)';
      ctx.fillRect(Math.random() * 256, Math.random() * 384, 2, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.025)';
      ctx.fillRect(Math.random() * 256, Math.random() * 384, 1, 1);
    }

    // Outer double gold border
    ctx.strokeStyle = 'rgba(218, 175, 98, 0.9)';
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 14, 228, 356);
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, 216, 344);

    // Corner rosettes
    const corners = [[14, 14], [242, 14], [14, 370], [242, 370]];
    ctx.fillStyle = 'rgba(218, 175, 98, 0.95)';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Book Title in gold serif
    if (title) {
      ctx.fillStyle = 'rgba(255, 245, 225, 0.98)';
      ctx.font = 'bold 20px "Cormorant Garamond", Georgia, serif';
      ctx.textAlign = 'center';
      const words = title.split(' ');
      let line = '';
      let y = 140;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 180 && n > 0) {
          ctx.fillText(line.trim(), 128, y);
          line = words[n] + ' ';
          y += 24;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), 128, y);

      ctx.strokeStyle = 'rgba(218, 175, 98, 0.7)';
      ctx.beginPath();
      ctx.moveTo(88, y + 16);
      ctx.lineTo(168, y + 16);
      ctx.stroke();

      if (author) {
        ctx.font = 'italic 13px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = 'rgba(235, 205, 155, 0.92)';
        ctx.fillText(author, 128, y + 36);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  createPageBlockTexture(style = 'gold') {
    return this.cachedTexture(`pageblock-${style}`, () => this._generatePageBlock(style));
  }

  _generatePageBlock(style) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Base tone
    if (style === 'blood-gold') {
      const g = ctx.createLinearGradient(0, 0, 256, 0);
      g.addColorStop(0, '#5a121c');
      g.addColorStop(0.3, '#b8860b');
      g.addColorStop(0.7, '#d4af37');
      g.addColorStop(1, '#6b1420');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    } else {
      ctx.fillStyle = '#f5eed8';
      ctx.fillRect(0, 0, 256, 256);
    }

    // Fine paper leaf lines
    for (let y = 0; y < 256; y += 2) {
      const alpha = 0.08 + Math.random() * 0.12;
      ctx.fillStyle = style === 'blood-gold' ? `rgba(255, 215, 0, ${alpha})` : `rgba(120, 95, 60, ${alpha})`;
      ctx.fillRect(0, y, 256, 1);
    }

    // Edge metallic vignette
    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
    grad.addColorStop(0.12, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.88, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  /* =========================================================================
     3B. REAL 3D BOOK GEOMETRIC ASSEMBLY (MUSEUM-GRADE LIBRARY CRAFTSMANSHIP)
     ========================================================================= */
  createReal3DBookMesh(bookData, options = {}) {
    const mode = options.mode || 'shelf';
    const isPrimary = !!options.isPrimary;
    const hasFiligree = bookData.hasFiligree !== false;

    const bW = options.width || 0.42;
    const bH = options.height || 0.58;
    const bT = options.thickness || 0.12;
    const boardThick = 0.018;
    const squareOverhang = 0.014;

    const hex = typeof bookData.spineColor === 'string'
      ? parseInt(bookData.spineColor.replace('#', '0x'), 16)
      : (bookData.spineColor || 0x4a151b);

    const bookGroup = new THREE.Group();
    bookGroup.userData.isReal3DBook = true;
    bookGroup.userData.isShelfBook = true;
    bookGroup.userData.bookData = bookData;

    // 1. Textures & Materials
    const coverTex = this.createLibraryCoverTexture(bookData);
    const spineTex = this.createLibrarySpineTexture(bookData);
    const bumpTex = this.createLibraryBumpTexture();
    const pageEdgeTex = this.createPageBlockTexture(bookData.giltEdges === 'deckled' ? 'deckled' : 'gold');
    const marbledTex = this.createMarbledEndpaperTexture('gold');
    const headbandTex = this.createHeadbandTexture('#1b2c50', '#d4af37');

    const leatherMat = new THREE.MeshStandardMaterial({
      map: coverTex,
      bumpMap: bumpTex,
      bumpScale: 0.014,
      roughness: 0.42,
      metalness: 0.12
    });

    const spineLeatherMat = new THREE.MeshStandardMaterial({
      map: spineTex,
      bumpMap: bumpTex,
      bumpScale: 0.014,
      roughness: 0.40,
      metalness: 0.14
    });

    const backLeatherMat = new THREE.MeshStandardMaterial({
      color: hex,
      bumpMap: bumpTex,
      bumpScale: 0.012,
      roughness: 0.44,
      metalness: 0.10
    });

    const marbledMat = new THREE.MeshStandardMaterial({
      map: marbledTex,
      roughness: 0.55
    });

    const pageEdgeMat = new THREE.MeshStandardMaterial({
      map: pageEdgeTex,
      roughness: 0.42,
      metalness: bookData.giltEdges === 'deckled' ? 0.08 : 0.62
    });

    const brassGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.90,
      roughness: 0.22
    });

    // 2. Back Hardcover Board Assembly
    const backBoardMat = [backLeatherMat, backLeatherMat, backLeatherMat, backLeatherMat, marbledMat, backLeatherMat];
    const backBoardMesh = new THREE.Mesh(
      new THREE.BoxGeometry(bW, bH + 2 * squareOverhang, boardThick),
      backBoardMat
    );
    backBoardMesh.position.set(0, 0, -bT / 2 + boardThick / 2);
    backBoardMesh.castShadow = true;
    backBoardMesh.receiveShadow = true;
    backBoardMesh.name = 'rearBoard';
    backBoardMesh.userData.originalMaterial = backBoardMat;
    bookGroup.add(backBoardMesh);

    // 3. Multi-Quire Textblock (Divided into 3 distinct anatomical gathering signatures)
    const pbW = bW - squareOverhang * 2;
    const pbH = bH;
    const pbT = bT - boardThick * 2 - 0.006;
    const quireT = pbT / 3 - 0.003;
    const pageMatArr = [pageEdgeMat, pageEdgeMat, pageEdgeMat, pageEdgeMat, marbledMat, marbledMat];

    // Gathering I: Fore-Quire Signatures 1–4
    const quireFrontMesh = new THREE.Mesh(
      new THREE.BoxGeometry(pbW, pbH, quireT),
      pageMatArr
    );
    quireFrontMesh.position.set(squareOverhang / 2, 0, pbT / 3);
    quireFrontMesh.castShadow = true;
    quireFrontMesh.receiveShadow = true;
    quireFrontMesh.name = 'quireFront';
    quireFrontMesh.userData.originalMaterial = pageMatArr;
    bookGroup.add(quireFrontMesh);

    // Gathering II: Center Text Core Signatures 5–8 (With structural unbleached linen sewing stitches)
    const quireCenterMesh = new THREE.Mesh(
      new THREE.BoxGeometry(pbW, pbH, quireT),
      pageMatArr
    );
    quireCenterMesh.position.set(squareOverhang / 2, 0, 0);
    quireCenterMesh.castShadow = true;
    quireCenterMesh.receiveShadow = true;
    quireCenterMesh.name = 'quireCenter';
    quireCenterMesh.userData.originalMaterial = pageMatArr;

    // 5 All-Along Sewing Stitches along the spine fold of the center gathering
    const stitchMat = new THREE.MeshStandardMaterial({ color: 0xf5eedc, roughness: 0.85 });
    for (let s = 0; s < 5; s++) {
      const stitchY = -(pbH * 0.38) + s * (pbH * 0.19);
      const stitch = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.016, 8), stitchMat);
      stitch.position.set(-pbW / 2 + 0.002, stitchY, 0);
      stitch.rotation.z = Math.PI / 2;
      quireCenterMesh.add(stitch);
    }
    bookGroup.add(quireCenterMesh);

    // Gathering III: Tail Endleaf Signatures 9–12
    const quireRearMesh = new THREE.Mesh(
      new THREE.BoxGeometry(pbW, pbH, quireT),
      pageMatArr
    );
    quireRearMesh.position.set(squareOverhang / 2, 0, -pbT / 3);
    quireRearMesh.castShadow = true;
    quireRearMesh.receiveShadow = true;
    quireRearMesh.name = 'quireRear';
    quireRearMesh.userData.originalMaterial = pageMatArr;
    bookGroup.add(quireRearMesh);

    // 4. Curved Arched Spine & 5 Raised Sewing Ribs Assembly
    const spineAssemblyGroup = new THREE.Group();
    spineAssemblyGroup.name = 'spineAssembly';
    const spineRadius = bT / 2;
    const spineGeo = new THREE.CylinderGeometry(
      spineRadius,
      spineRadius,
      bH + 2 * squareOverhang,
      24,
      1,
      false,
      Math.PI * 0.5,
      Math.PI
    );
    const spineMesh = new THREE.Mesh(spineGeo, spineLeatherMat);
    spineMesh.position.set(-bW / 2, 0, 0);
    spineMesh.castShadow = true;
    spineMesh.userData.originalMaterial = spineLeatherMat;
    spineAssemblyGroup.add(spineMesh);

    // 5 Raised Spine Ribs (Structural Linen Sewing Hubs)
    const spineRibsGroup = new THREE.Group();
    for (let r = 0; r < 5; r++) {
      const ribY = -(bH * 0.38) + r * (bH * 0.19);
      const ribGeo = new THREE.TorusGeometry(spineRadius + 0.003, 0.007, 8, 24, Math.PI);
      const ribMesh = new THREE.Mesh(ribGeo, brassGoldMat);
      ribMesh.position.set(-bW / 2, ribY, 0);
      ribMesh.rotation.y = Math.PI / 2;
      ribMesh.rotation.z = Math.PI / 2;
      ribMesh.userData.originalMaterial = brassGoldMat;
      spineRibsGroup.add(ribMesh);
    }
    spineAssemblyGroup.add(spineRibsGroup);
    bookGroup.add(spineAssemblyGroup);

    // 5. Two-Tone Woven Headband & Tailband Endbands Group
    const endbandsGroup = new THREE.Group();
    endbandsGroup.name = 'endbandsGroup';
    const headbandMat = new THREE.MeshStandardMaterial({ map: headbandTex, roughness: 0.65 });
    const headbandGeo = new THREE.CylinderGeometry(0.012, 0.012, pbT, 16);
    const headbandTop = new THREE.Mesh(headbandGeo, headbandMat);
    headbandTop.rotation.x = Math.PI / 2;
    headbandTop.position.set(-bW / 2 + 0.015, pbH / 2 + 0.003, 0);
    headbandTop.userData.originalMaterial = headbandMat;
    endbandsGroup.add(headbandTop);

    const headbandBottom = new THREE.Mesh(headbandGeo, headbandMat);
    headbandBottom.rotation.x = Math.PI / 2;
    headbandBottom.position.set(-bW / 2 + 0.015, -pbH / 2 - 0.003, 0);
    headbandBottom.userData.originalMaterial = headbandMat;
    endbandsGroup.add(headbandBottom);
    bookGroup.add(endbandsGroup);

    // 6. Silk Satin Ribbon Bookmark & Brass Charm Group
    const ribbonGroup = new THREE.Group();
    ribbonGroup.name = 'ribbonGroup';
    const ribbonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-bW / 2 + 0.02, pbH / 2 + 0.008, 0),
      new THREE.Vector3(0, pbH / 2 + 0.004, pbT * 0.2),
      new THREE.Vector3(pbW * 0.2, 0, pbT * 0.3),
      new THREE.Vector3(pbW * 0.35, -pbH / 2, pbT * 0.25),
      new THREE.Vector3(pbW * 0.42, -pbH / 2 - 0.08, pbT * 0.15),
      new THREE.Vector3(pbW * 0.45, -pbH / 2 - 0.15, pbT * 0.05)
    ]);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 32, 0.008, 6, false);
    const ribbonColorHex = typeof bookData.ribbonColor === 'string'
      ? parseInt(bookData.ribbonColor.replace('#', '0x'), 16)
      : (bookData.ribbonColor || 0x1a2c42);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: ribbonColorHex,
      roughness: 0.35,
      metalness: 0.15
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.userData.originalMaterial = ribbonMat;
    ribbonGroup.add(ribbonMesh);

    const charmGroup = new THREE.Group();
    charmGroup.position.set(pbW * 0.45, -pbH / 2 - 0.15, pbT * 0.05);
    const charmCap = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.02, 12), brassGoldMat);
    charmCap.rotation.x = Math.PI;
    charmGroup.add(charmCap);
    const charmFob = new THREE.Mesh(new THREE.OctahedronGeometry(0.012, 0), brassGoldMat);
    charmFob.position.y = -0.018;
    charmGroup.add(charmFob);
    ribbonGroup.add(charmGroup);
    bookGroup.add(ribbonGroup);

    // 7. Front Hardcover Board with Hinge Pivot (0 to 125 degrees opening)
    const frontCoverPivot = new THREE.Group();
    frontCoverPivot.name = 'frontCoverPivot';
    frontCoverPivot.position.set(-bW / 2, 0, bT / 2);

    const frontBoardMat = [leatherMat, leatherMat, leatherMat, leatherMat, leatherMat, marbledMat];
    const frontBoardMesh = new THREE.Mesh(
      new THREE.BoxGeometry(bW, bH + 2 * squareOverhang, boardThick),
      frontBoardMat
    );
    frontBoardMesh.position.set(bW / 2, 0, -boardThick / 2);
    frontBoardMesh.castShadow = true;
    frontBoardMesh.receiveShadow = true;
    frontBoardMesh.name = 'frontBoard';
    frontBoardMesh.userData.originalMaterial = frontBoardMat;
    frontCoverPivot.add(frontBoardMesh);

    // Classical 3D Chased Brass Corner Protectors
    if (hasFiligree) {
      const cornerGroup = new THREE.Group();
      cornerGroup.name = 'brassCornerProtectors';

      const cornerPositions = [
        { x: 0.04, y: (bH / 2) + squareOverhang - 0.04 },
        { x: bW - 0.04, y: (bH / 2) + squareOverhang - 0.04 },
        { x: 0.04, y: -(bH / 2) - squareOverhang + 0.04 },
        { x: bW - 0.04, y: -(bH / 2) - squareOverhang + 0.04 }
      ];
      cornerPositions.forEach(pos => {
        const cornerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.006), brassGoldMat);
        cornerMesh.position.set(pos.x, pos.y, 0.003);
        cornerMesh.userData.originalMaterial = brassGoldMat;
        cornerGroup.add(cornerMesh);
      });

      // Brass Fore-Edge Clasp Fitting
      const claspMesh = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.08, 0.008), brassGoldMat);
      claspMesh.position.set(bW - 0.005, 0, 0.003);
      claspMesh.userData.originalMaterial = brassGoldMat;
      cornerGroup.add(claspMesh);

      frontCoverPivot.add(cornerGroup);
    }

    bookGroup.add(frontCoverPivot);
    bookGroup.userData.frontCoverPivot = frontCoverPivot;

    // 8. 3D Flippable Title Page Leaf
    const flippableLeafPivot = new THREE.Group();
    flippableLeafPivot.name = 'flippableLeafPivot';
    flippableLeafPivot.position.set(-bW / 2 + squareOverhang, 0, 0);
    const leafMat = new THREE.MeshStandardMaterial({
      map: marbledTex,
      roughness: 0.7
    });
    const leafMesh = new THREE.Mesh(
      new THREE.BoxGeometry(pbW, pbH, 0.003),
      leafMat
    );
    leafMesh.position.set(pbW / 2, 0, 0);
    leafMesh.userData.originalMaterial = leafMat;
    flippableLeafPivot.add(leafMesh);
    bookGroup.add(flippableLeafPivot);
    bookGroup.userData.flippableLeafPivot = flippableLeafPivot;

    // Register Anatomical Sub-Assemblies for Real-Time 3D Disassembly & Calipers
    bookGroup.userData.anatomicalParts = [
      {
        id: 'front-board',
        name: 'Front Hardcover Board',
        tag: 'ASM-01 · COV',
        spec: 'Morocco Leather / Millboard Core',
        metrics: { 'THK': '3.4mm', 'pH': '6.8', 'TOOLING': '24k' },
        object: frontCoverPivot,
        restPos: frontCoverPivot.position.clone(),
        restRot: frontCoverPivot.rotation.clone(),
        explodeOffset: new THREE.Vector3(0.10, 0, 0.36),
        explodeRot: new THREE.Euler(0, -0.22, 0),
        anchorOffset: new THREE.Vector3(bW / 2, 0, 0)
      },
      {
        id: 'quire-front',
        name: 'Gathering I (Quires 1–4)',
        tag: 'ASM-02 · QIR-1',
        spec: '16-Page Rag Vellum (Cotton/Linen)',
        metrics: { 'PAGES': '64p', 'GSM': '120', 'GILT': 'Burnished' },
        object: quireFrontMesh,
        restPos: quireFrontMesh.position.clone(),
        restRot: quireFrontMesh.rotation.clone(),
        explodeOffset: new THREE.Vector3(0.05, 0, 0.16),
        explodeRot: new THREE.Euler(0, -0.06, 0),
        anchorOffset: new THREE.Vector3(0, 0, 0)
      },
      {
        id: 'quire-center',
        name: 'Gathering II (Text Core)',
        tag: 'ASM-03 · QIR-2',
        spec: 'Core Signatures & Linen All-Along Sewing',
        metrics: { 'STITCH': '18mm', 'THREAD': '3-Ply', 'STATUS': 'SOUND' },
        object: quireCenterMesh,
        restPos: quireCenterMesh.position.clone(),
        restRot: quireCenterMesh.rotation.clone(),
        explodeOffset: new THREE.Vector3(0, 0, 0),
        explodeRot: new THREE.Euler(0, 0, 0),
        anchorOffset: new THREE.Vector3(0, 0, 0)
      },
      {
        id: 'quire-rear',
        name: 'Gathering III (Endleaves)',
        tag: 'ASM-04 · QIR-3',
        spec: 'Deckled Tail Signatures & Waste Sheets',
        metrics: { 'TENSILE': '79 N', 'FOLD': '1840', 'ACID': 'pH 7.1' },
        object: quireRearMesh,
        restPos: quireRearMesh.position.clone(),
        restRot: quireRearMesh.rotation.clone(),
        explodeOffset: new THREE.Vector3(0.05, 0, -0.16),
        explodeRot: new THREE.Euler(0, 0.06, 0),
        anchorOffset: new THREE.Vector3(0, 0, 0)
      },
      {
        id: 'rear-board',
        name: 'Rear Hardcover Board',
        tag: 'ASM-05 · COV',
        spec: 'Beveled Oak Core & Marbled Paste-Down',
        metrics: { 'THK': '3.4mm', 'GRAIN': 'Quarter', 'WARP': '0.0mm' },
        object: backBoardMesh,
        restPos: backBoardMesh.position.clone(),
        restRot: backBoardMesh.rotation.clone(),
        explodeOffset: new THREE.Vector3(0.10, 0, -0.36),
        explodeRot: new THREE.Euler(0, 0.22, 0),
        anchorOffset: new THREE.Vector3(0, 0, 0)
      },
      {
        id: 'spine-assembly',
        name: 'Spine & 5 Raised Cords',
        tag: 'ASM-06 · SPN',
        spec: 'Unbleached Linen Cords & Flexible Arch',
        metrics: { 'CORDS': '5 Raised', 'TENSION': '45 N', 'LINING': 'Cambric' },
        object: spineAssemblyGroup,
        restPos: spineAssemblyGroup.position.clone(),
        restRot: spineAssemblyGroup.rotation.clone(),
        explodeOffset: new THREE.Vector3(-0.35, 0, 0),
        explodeRot: new THREE.Euler(0, 0, 0),
        anchorOffset: new THREE.Vector3(0, 0, 0)
      },
      {
        id: 'endbands',
        name: 'Hand-Woven Silk Endbands',
        tag: 'ASM-07 · BND',
        spec: 'Two-Tone Silk Chevron Over Alum-Tawed Core',
        metrics: { 'CORE': 'Alum Taw', 'WEAVE': 'Twill', 'LOCK': 'Spine-Tie' },
        object: endbandsGroup,
        restPos: endbandsGroup.position.clone(),
        restRot: endbandsGroup.rotation.clone(),
        explodeOffset: new THREE.Vector3(-0.16, 0, 0),
        explodeRot: new THREE.Euler(0, 0, 0),
        anchorOffset: new THREE.Vector3(0, 0, 0)
      },
      {
        id: 'ribbon-marker',
        name: 'Silk Marker & Brass Fob',
        tag: 'ASM-08 · MRK',
        spec: 'Satin Bookmark Ribbon & Fire-Gilt Brass Tip',
        metrics: { 'WIDTH': '6mm', 'WEIGHT': '8.2g', 'PLATING': '24k Gilt' },
        object: ribbonGroup,
        restPos: ribbonGroup.position.clone(),
        restRot: ribbonGroup.rotation.clone(),
        explodeOffset: new THREE.Vector3(0.08, -0.18, 0.10),
        explodeRot: new THREE.Euler(0, -0.15, 0),
        anchorOffset: new THREE.Vector3(0, 0, 0)
      }
    ];

    // Build Diagnostic Telemetry Badges if in showcase or primary mode
    if (mode === 'showcase' || isPrimary) {
      this.buildTelemetryBadges(bookGroup.userData.anatomicalParts);
    }

    // Interactive Animation Methods
    bookGroup.userData.openProgress = 0;
    bookGroup.setOpenAmount = (progress) => {
      bookGroup.userData.openProgress = progress;
      const targetAngle = progress * (Math.PI * 0.70);
      frontCoverPivot.rotation.y = -targetAngle;
      flippableLeafPivot.rotation.y = -targetAngle * 0.45;
    };

    bookGroup.setPageFlip = (progress) => {
      flippableLeafPivot.rotation.y = -progress * Math.PI * 0.65;
    };

    if (mode === 'shelf') {
      bookGroup.rotation.y = Math.PI / 2;
    } else if (mode === 'horizontal') {
      bookGroup.rotation.x = -Math.PI / 2;
      bookGroup.rotation.z = 0;
    } else if (mode === 'showcase') {
      bookGroup.rotation.set(0.12, -0.35, 0);
    }

    return bookGroup;
  }

  createContactShadowTexture() {
    return this.cachedTexture('contact-shadow', () => this._generateContactShadow());
  }

  _generateContactShadow() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.82)');
    grad.addColorStop(0.45, 'rgba(15, 10, 5, 0.40)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  createCatalogCardTexture(title = "Shakespeare, William", callNo = "822.33 S57") {
    return this.cachedTexture(`catalogcard-${title}-${callNo}`, () => this._generateCatalogCard(title, callNo));
  }

  _generateCatalogCard(title, callNo) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');

    // Ivory rag paper
    ctx.fillStyle = '#fdf9f0';
    ctx.fillRect(0, 0, 512, 320);

    // Faint red classification line
    ctx.strokeStyle = 'rgba(200, 80, 70, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, 0);
    ctx.lineTo(90, 320);
    ctx.stroke();

    // Red top rule
    ctx.strokeStyle = 'rgba(200, 80, 70, 0.25)';
    ctx.beginPath();
    ctx.moveTo(0, 60);
    ctx.lineTo(512, 60);
    ctx.stroke();

    // Call number
    ctx.fillStyle = '#9e2a2b';
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillText(callNo, 16, 42);

    // Typewritten bibliographic lines
    ctx.fillStyle = '#2c221e';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText(title, 106, 42);
    ctx.fillText("Mr. William Shakespeares comedies,", 106, 85);
    ctx.fillText("histories, & tragedies. Published", 106, 115);
    ctx.fillText("according to the True Originall Copies.", 106, 145);
    ctx.fillText("London : Printed by Isaac Iaggard, 1623.", 106, 185);

    ctx.font = '13px "Courier New", monospace';
    ctx.fillStyle = '#6b5c54';
    ctx.fillText("1. English drama -- Early modern, 1500-1600.", 106, 230);
    ctx.fillText("LCCN: 20-12845 // Dewey: 822.33", 106, 260);

    // Center punched rod hole
    ctx.fillStyle = '#3a2e28';
    ctx.beginPath();
    ctx.arc(256, 290, 9, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  createHygrometerDialTexture(temp = "60.2°F", rh = "49.8%") {
    return this.cachedTexture(`hygrometer-${temp}-${rh}`, () => this._generateHygrometerDial(temp, rh));
  }

  _generateHygrometerDial(temp, rh) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Dark dial face
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(0, 0, 256, 256);

    // Dial border
    ctx.strokeStyle = '#c28e46';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 244, 244);

    // Header
    ctx.fillStyle = '#a0aec0';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("VAULT CLIMATE MONITOR", 128, 38);

    // Temp Box
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(24, 60, 208, 70);
    ctx.fillStyle = '#68d391';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(temp, 128, 110);
    ctx.fillStyle = '#a0aec0';
    ctx.font = '11px sans-serif';
    ctx.fillText("TEMP (IDEAL 60°F ± 5°)", 128, 125);

    // RH Box
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(24, 145, 208, 70);
    ctx.fillStyle = '#4fd1c5';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(rh, 128, 195);
    ctx.fillStyle = '#a0aec0';
    ctx.font = '11px sans-serif';
    ctx.fillText("RH (IDEAL 50% ± 5%)", 128, 210);

    // Status indicator
    ctx.fillStyle = '#38a169';
    ctx.beginPath();
    ctx.arc(220, 34, 6, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  /* =========================================================================
     4. SPECIMEN BUILDERS (ALL 8 MODULES + SPECIAL COLLECTIONS)
     ========================================================================= */

  // SPECIMEN 1: Classification Oak Bay Specimen
  createClassificationBaySpecimen(volData) {
    const oakWood = this.createWoodTexture('#44332c', '#2c1e18');
    const oakMat = new THREE.MeshStandardMaterial({
      map: oakWood,
      roughness: 0.45,
      metalness: 0.1
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc28e46,
      metalness: 0.85,
      roughness: 0.2
    });

    // Main Bay Frame (Stiles & Shelves)
    const frameworkGroup = new THREE.Group();
    frameworkGroup.userData.layer = 'shelf-framework';

    // Left & Right Vertical Stiles
    const stileGeo = new THREE.BoxGeometry(0.08, 1.45, 0.55);
    const leftStile = new THREE.Mesh(stileGeo, oakMat);
    leftStile.position.set(-0.84, 0.08, 0);
    leftStile.castShadow = true;
    frameworkGroup.add(leftStile);

    const rightStile = new THREE.Mesh(stileGeo, oakMat);
    rightStile.position.set(0.84, 0.08, 0);
    rightStile.castShadow = true;
    frameworkGroup.add(rightStile);

    // Top Molded Crown Cornice
    const crown = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.10, 0.62), oakMat);
    crown.position.set(0, 0.78, 0);
    crown.castShadow = true;
    frameworkGroup.add(crown);

    // Bottom Baseboard Plinth
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.12, 0.62), oakMat);
    base.position.set(0, -0.58, 0);
    base.castShadow = true;
    frameworkGroup.add(base);

    // 3 Shelves with Brass Label Lip Holders
    const shelfY = [0.42, -0.06, -0.52];
    const shelfLabels = ["000 GENERALITIES", "300 SOCIAL SCIENCES", "800 LITERATURE"];
    shelfY.forEach((y, sIdx) => {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.05, 0.52), oakMat);
      shelf.position.set(0, y, 0);
      shelf.castShadow = true;
      frameworkGroup.add(shelf);

      // Brass shelf label plate
      const brassPlate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.015), brassMat);
      brassPlate.position.set(0, y, 0.265);
      frameworkGroup.add(brassPlate);
    });

    this.specimenGroup.add(frameworkGroup);

    // Book Volumes on Middle & Top Shelves with Call Numbers
    const booksGroup = new THREE.Group();
    booksGroup.userData.layer = 'call-numbers';

    const shelfBooks = (volData && volData.shelfBooks) || [];
    const ddcColors = [0x10090d, 0x384860, 0x2c4533, 0x785b88, 0x8c6239, 0xd49b4b, 0xa0423b, 0x4a6b82, 0x5a7a58];
    const ddcLabels = ['813.6 G963s', '025 .A84', '090 .M36', '340 .L41', '370 .E28', '380 .C73', '813 .M48', '822 .S57', '891 .T14'];
    let startX = -0.72;

    const count = Math.max(9, shelfBooks.length);
    for (let i = 0; i < count; i++) {
      const isPrimary = (i === 0);
      const bW = 0.38 + (i % 2) * 0.02;
      const bH = 0.44 + (i % 4) * 0.02;
      const bT = 0.11 + (i % 3) * 0.015;
      const hex = ddcColors[i % ddcColors.length];
      const defaultLabel = ddcLabels[i % ddcLabels.length];
      const bookData = shelfBooks[i] || {
        id: `ddc-book-${i}`,
        title: `Classification Treatise ${defaultLabel}`,
        author: "Melvil Dewey et al.",
        year: "1876",
        callNumber: defaultLabel,
        cutter: defaultLabel.split(' ')[1] || '.D51',
        category: "Library Science",
        pages: [{ chapter: "Class System", header: defaultLabel, content: "Historical classification treatise." }]
      };

      const bMesh = this.createReal3DBookMesh(bookData, {
        mode: 'shelf',
        width: bW,
        height: bH,
        thickness: bT,
        isPrimary: isPrimary
      });

      // Position along shelf
      const baseZ = isPrimary ? 0.075 : 0.035;
      bMesh.position.set(startX + bT / 2, 0.16 + (bH - 0.42) / 2, baseZ);
      if (isPrimary) {
        bMesh.rotation.y = Math.PI / 2 + 0.06;
      }
      bMesh.userData.layer = 'call-numbers';
      bMesh.userData.cutter = bookData.callNumber || defaultLabel;
      bMesh.userData.origZ = baseZ;
      booksGroup.add(bMesh);

      // Contact shadow on the shelf board underneath the book
      if (isPrimary) {
        const shadowGeo = new THREE.PlaneGeometry(bT * 1.8, bW * 1.2);
        const shadowMat = new THREE.MeshBasicMaterial({
          map: this.createContactShadowTexture(),
          transparent: true,
          opacity: 0.65,
          depthWrite: false
        });
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        shadowMesh.rotation.x = -Math.PI / 2;
        shadowMesh.position.set(startX + bT / 2, -0.034, baseZ - 0.04);
        booksGroup.add(shadowMesh);
      }

      startX += bT + 0.024;
    }

    // Brass Bookends
    const bookendL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 0.32), brassMat);
    bookendL.position.set(-0.76, 0.12, 0.04);
    booksGroup.add(bookendL);

    const bookendR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 0.32), brassMat);
    bookendR.position.set(startX, 0.12, 0.04);
    booksGroup.add(bookendR);

    this.specimenGroup.add(booksGroup);
  }

  // SPECIMEN 2: 3D MARC Catalog Record Card Specimen
  createMARCCatalogCardSpecimen(volData) {
    const cardGroup = new THREE.Group();
    cardGroup.userData.layer = 'card-base';

    // Articulated Brass Museum Stand
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc28e46,
      metalness: 0.9,
      roughness: 0.18
    });

    const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.52, 0.09, 36), brassMat);
    standBase.position.y = -0.56;
    standBase.receiveShadow = true;
    cardGroup.add(standBase);

    const standStem = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.65, 20), brassMat);
    standStem.position.set(0, -0.22, 0);
    cardGroup.add(standStem);

    const swivelJoint = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 20), brassMat);
    swivelJoint.position.set(0, 0.1, 0);
    cardGroup.add(swivelJoint);

    // Archival 3x5 Catalog Card with high-res typography texture
    const cardTex = this.createCatalogCardTexture("Shakespeare, William, 1564-1616.", "822.33 S57");
    const cardMat = new THREE.MeshStandardMaterial({
      map: cardTex,
      roughness: 0.5,
      metalness: 0.05
    });

    const cardMesh = new THREE.Mesh(new THREE.BoxGeometry(1.60, 1.00, 0.015), cardMat);
    cardMesh.position.set(0, 0.15, 0.02);
    cardMesh.castShadow = true;
    cardGroup.add(cardMesh);

    this.specimenGroup.add(cardGroup);

    // Floating 3D Holographic MARC Tag Overlay
    const tagGroup = new THREE.Group();
    tagGroup.userData.layer = 'field-tags';

    const tags = [
      { label: "LEADER 01425cam", y: 0.52, color: 0x8b5cf6 },
      { label: "100 1# $a Author", y: 0.38, color: 0x10b981 },
      { label: "245 10 $a Title $c Resp", y: 0.22, color: 0xc28e46 },
      { label: "260 ## $a Imprint $c Date", y: 0.06, color: 0x3b82f6 },
      { label: "650 #0 $a Subject LCSH", y: -0.10, color: 0xec4899 }
    ];

    tags.forEach(t => {
      const tagMat = new THREE.MeshBasicMaterial({
        color: t.color,
        transparent: true,
        opacity: 0.88,
        wireframe: false
      });
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.11, 0.02), tagMat);
      bracket.position.set(0, t.y, 0.05);
      bracket.userData.layer = 'subfield-delimiters';
      tagGroup.add(bracket);
    });

    this.specimenGroup.add(tagGroup);
  }

  // SPECIMEN 3: Archival Preservation Vault Drawer Specimen
  createPreservationVaultDrawerSpecimen(volData) {
    const vaultGroup = new THREE.Group();
    vaultGroup.userData.layer = 'vault-chassis';

    const vaultSteel = new THREE.MeshStandardMaterial({
      color: 0x2d3748,
      roughness: 0.32,
      metalness: 0.7
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc28e46,
      metalness: 0.85,
      roughness: 0.2
    });

    // Vault Drawer Chassis
    const drawerOuter = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.48, 1.3), vaultSteel);
    drawerOuter.position.set(0, -0.22, 0);
    drawerOuter.castShadow = true;
    vaultGroup.add(drawerOuter);

    // Brass Index Pull Handle
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.018, 16, 32), brassMat);
    handle.position.set(0, -0.22, 0.66);
    vaultGroup.add(handle);

    // Phase Box Enclosure (Acid-Free Archival Board)
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x5a8b66, roughness: 0.65 });
    const phaseBox = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.30, 0.9), boxMat);
    phaseBox.position.set(0, 0.05, 0);
    phaseBox.castShadow = true;
    vaultGroup.add(phaseBox);

    // Damaged Rare Volume Inside
    const acidWood = this.createWoodTexture('#8b4513', '#3a1700');
    const damagedMat = new THREE.MeshStandardMaterial({
      map: acidWood,
      roughness: 0.75
    });
    const damagedBook = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.18, 0.65), damagedMat);
    damagedBook.position.set(0, 0.18, 0);
    damagedBook.userData.layer = 'acid-damage';
    vaultGroup.add(damagedBook);

    // Digital Thermo-Hygrometer Display Sensor
    const dialTex = this.createHygrometerDialTexture("60.0°F", "50.0%");
    const dialMat = new THREE.MeshBasicMaterial({ map: dialTex });
    const sensorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.02), dialMat);
    sensorPanel.position.set(-0.52, 0.25, 0.38);
    sensorPanel.rotation.y = 0.35;
    sensorPanel.userData.layer = 'climate-sensors';
    vaultGroup.add(sensorPanel);

    // UV Light Inspection Bar
    const uvMat = new THREE.MeshBasicMaterial({ color: 0x9333ea });
    const uvTube = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 16), uvMat);
    uvTube.rotation.z = Math.PI / 2;
    uvTube.position.set(0, 0.45, 0);
    uvTube.userData.layer = 'uv-inspection';
    vaultGroup.add(uvTube);

    this.specimenGroup.add(vaultGroup);
  }

  // SPECIMEN 4: Reference Desk Stage Specimen
  createReferenceDeskStageSpecimen(volData) {
    const deskGroup = new THREE.Group();
    deskGroup.userData.layer = 'desk-framework';

    const walnutWood = this.createWoodTexture('#3e2b20', '#251710');
    const deskMat = new THREE.MeshStandardMaterial({
      map: walnutWood,
      roughness: 0.4
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc28e46,
      metalness: 0.85,
      roughness: 0.2
    });

    // Reference Consultation Desk Tabletop
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.10, 0.95), deskMat);
    desk.position.set(0, -0.28, 0);
    desk.castShadow = true;
    deskGroup.add(desk);

    // Leather Blotter Pad
    const blotterMat = new THREE.MeshStandardMaterial({ color: 0x223026, roughness: 0.6 });
    const blotter = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.015, 0.65), blotterMat);
    blotter.position.set(0, -0.22, 0.05);
    deskGroup.add(blotter);

    // Banker's Desk Lamp with Emerald Glass Shade
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 0.04, 20), brassMat);
    lampBase.position.set(0.60, -0.21, -0.25);
    deskGroup.add(lampBase);

    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.38, 16), brassMat);
    lampStem.position.set(0.60, -0.02, -0.25);
    deskGroup.add(lampStem);

    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0x155724,
      roughness: 0.25,
      emissive: 0x0b3d17,
      emissiveIntensity: 0.6
    });
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.09, 24), shadeMat);
    shade.position.set(0.60, 0.16, -0.25);
    deskGroup.add(shade);

    this.specimenGroup.add(deskGroup);

    // Glowing 3D Boolean Venn Diagram Intersection Rings
    const vennGroup = new THREE.Group();
    vennGroup.userData.layer = 'boolean-venn';

    const ringMatA = new THREE.MeshBasicMaterial({ color: 0xd49b4b, wireframe: true });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.016, 16, 64), ringMatA);
    ringA.position.set(-0.24, 0.25, 0.05);
    vennGroup.add(ringA);

    const ringMatB = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true });
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.016, 16, 64), ringMatB);
    ringB.position.set(0.24, 0.25, 0.05);
    vennGroup.add(ringB);

    // Glowing Central "AND" Intersection Node
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), nodeMat);
    node.position.set(0, 0.25, 0.05);
    vennGroup.add(node);

    this.specimenGroup.add(vennGroup);
  }

  // SPECIMEN 5: Archival Weeding Cart Specimen
  createWeedingCartSpecimen(volData) {
    const cartGroup = new THREE.Group();
    cartGroup.userData.layer = 'cart-chassis';

    const cartMat = new THREE.MeshStandardMaterial({
      color: 0x6b4f7a,
      roughness: 0.45,
      metalness: 0.35
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x2d3748,
      roughness: 0.3,
      metalness: 0.8
    });

    // Two-Tier Book Cart Chassis
    const cartBase = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.75, 0.58), cartMat);
    cartBase.position.set(0, -0.10, 0);
    cartBase.castShadow = true;
    cartGroup.add(cartBase);

    // Tubular Steel Push Handles
    for (const x of [-0.68, 0.68]) {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.85, 16), steelMat);
      handle.position.set(x, 0.20, 0);
      cartGroup.add(handle);
    }

    // 4 Swivel Caster Wheels
    for (const cx of [-0.52, 0.52]) {
      for (const cz of [-0.22, 0.22]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 20), steelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(cx, -0.54, cz);
        cartGroup.add(wheel);
      }
    }

    this.specimenGroup.add(cartGroup);

    // Evaluated Volumes with MUSTIE Condition Flag Bookmarks
    const evalGroup = new THREE.Group();
    evalGroup.userData.layer = 'mustie-rubric';

    const flags = [
      { color: 0xef4444, label: "M: Misleading" },
      { color: 0xf59e0b, label: "U: Ugly" },
      { color: 0x3b82f6, label: "S: Superseded" }
    ];

    flags.forEach((f, idx) => {
      const bookMat = new THREE.MeshStandardMaterial({ color: 0x3a3028, roughness: 0.6 });
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.38, 0.45), bookMat);
      book.position.set(-0.35 + idx * 0.32, 0.20, 0);
      book.castShadow = true;
      evalGroup.add(book);

      // Flag Bookmark
      const flagMat = new THREE.MeshBasicMaterial({ color: f.color });
      const flag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.02), flagMat);
      flag.position.set(-0.35 + idx * 0.32, 0.42, 0.15);
      evalGroup.add(flag);
    });

    this.specimenGroup.add(evalGroup);
  }

  // SPECIMEN 6: Academic & Research Reading Room Specimen
  createAcademicReadingRoomSpecimen(volData) {
    const tableGroup = new THREE.Group();
    tableGroup.userData.layer = 'scholar-table';

    const tableWood = this.createWoodTexture('#442c1d', '#25150c');
    const tableMat = new THREE.MeshStandardMaterial({
      map: tableWood,
      roughness: 0.4
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc28e46,
      metalness: 0.85,
      roughness: 0.2
    });

    // Scholar's Table
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.09, 0.95), tableMat);
    table.position.set(0, -0.26, 0);
    table.castShadow = true;
    table.receiveShadow = true;
    tableGroup.add(table);

    // Turned Table Legs with Brass Ferrules
    for (const lx of [-0.78, 0.78]) {
      for (const lz of [-0.38, 0.38]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.025, 0.52, 16), tableMat);
        leg.position.set(lx, -0.54, lz);
        tableGroup.add(leg);

        const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.06, 16), brassMat);
        ferrule.position.set(lx, -0.77, lz);
        tableGroup.add(ferrule);
      }
    }

    this.specimenGroup.add(tableGroup);

    // Stack of Research Folios
    const stackGroup = new THREE.Group();
    stackGroup.userData.layer = 'research-stack';

    const stackColors = ['#1e293b', '#2d4356', '#224229', '#4a1525'];
    const shelfBooks = (volData && volData.shelfBooks) || [];
    for (let i = 0; i < 4; i++) {
      const bookData = shelfBooks[i] || {
        id: `academic-folio-${i}`,
        title: (i === 0) ? "Philosophiae Naturalis Principia Mathematica" : `Scholarly Treatise Vol. ${i + 1}`,
        author: (i === 0) ? "Sir Isaac Newton" : "Academic Library Collection",
        year: (i === 0) ? "1687" : "19th c.",
        callNumber: (i === 0) ? "531 N563p" : `378.${i} S36`,
        spineColor: stackColors[i],
        bindingType: "classical-leather",
        category: "Academic Librarianship",
        pages: [{ chapter: "Scholarly Communication", header: `Tract ${i + 1}`, content: "Digitized academic volume." }]
      };

      const folio = this.createReal3DBookMesh(bookData, {
        mode: 'horizontal',
        width: 0.42,
        height: 0.58,
        thickness: 0.09
      });
      folio.position.set(-0.38 + i * 0.012, -0.18 + i * 0.095, 0.12);
      folio.rotation.y = (i - 1.5) * 0.07;
      folio.userData.isShelfBook = true;
      folio.userData.bookData = bookData;
      folio.userData.origZ = 0.12;
      stackGroup.add(folio);
    }

    this.specimenGroup.add(stackGroup);

    // Floating Holographic Discovery-Layer Terminal
    const discGroup = new THREE.Group();
    discGroup.userData.layer = 'discovery-layer';

    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.65,
      wireframe: true
    });
    const terminalScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.45), screenMat);
    terminalScreen.position.set(0.25, 0.38, 0.10);
    discGroup.add(terminalScreen);

    this.specimenGroup.add(discGroup);
  }

  // SPECIMEN 7: Public Library Community Hub Specimen
  createPublicHubSpecimen(volData) {
    const hubGroup = new THREE.Group();
    hubGroup.userData.layer = 'welcome-desk';

    const oakMat = new THREE.MeshStandardMaterial({ color: 0x9c5b36, roughness: 0.45 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xc28e46, metalness: 0.85, roughness: 0.2 });

    // Curved Welcome & Circulation Counter
    const desk = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.52, 40), oakMat);
    desk.position.set(0, -0.38, 0);
    desk.castShadow = true;
    hubGroup.add(desk);

    const brassCounterTop = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.06, 40), brassMat);
    brassCounterTop.position.set(0, -0.10, 0);
    hubGroup.add(brassCounterTop);

    // RFID Self-Checkout Kiosk with Screen
    const kioskMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.5 });
    const kiosk = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.55, 0.08), kioskMat);
    kiosk.position.set(0.42, 0.24, 0.32);
    kiosk.rotation.y = -0.38;
    kiosk.userData.layer = 'self-checkout';
    hubGroup.add(kiosk);

    const kioskScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.24, 0.36),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.9 })
    );
    kioskScreen.position.set(0.42, 0.26, 0.365);
    kioskScreen.rotation.y = -0.38;
    kioskScreen.userData.layer = 'self-checkout';
    hubGroup.add(kioskScreen);

    // Circular Storytime Braided Rug
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x785b88, roughness: 0.9 });
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.015, 36), rugMat);
    rug.position.set(-0.58, -0.61, 0.22);
    rug.userData.layer = 'storytime-zone';
    hubGroup.add(rug);

    // Community Collection Bins
    const binColors = [0x5a8b66, 0xd49b4b, 0x3b82f6];
    binColors.forEach((c, idx) => {
      const binMat = new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 });
      const bin = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.28), binMat);
      bin.position.set(-0.78 + idx * 0.28, -0.48, -0.36);
      bin.castShadow = true;
      bin.userData.layer = 'community-bins';
      hubGroup.add(bin);
    });

    this.specimenGroup.add(hubGroup);
  }

  // SPECIMEN 8: Digital Repository Server Rack Specimen
  createDigitalRepositorySpecimen(volData) {
    const rackGroup = new THREE.Group();
    rackGroup.userData.layer = 'server-rack';

    const serverSteel = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.7
    });

    // Server Chassis
    const rack = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.35, 0.65), serverSteel);
    rack.position.set(0, 0, 0);
    rack.castShadow = true;
    rackGroup.add(rack);

    // Pulsing Blade Server Trays (OAI-PMH, IIIF, Handle Feeds)
    const bladeGroup = new THREE.Group();
    bladeGroup.userData.layer = 'blade-feeds';

    const feedColors = [0x10b981, 0x3b82f6, 0xc28e46, 0x8b5cf6, 0x00f3ff, 0xec4899];
    for (let i = 0; i < 8; i++) {
      const color = feedColors[i % feedColors.length];
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.82, 0.07, 0.02),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.88 })
      );
      blade.position.set(0, 0.54 - i * 0.14, 0.335);
      bladeGroup.add(blade);
    }
    rackGroup.add(bladeGroup);
    this.specimenGroup.add(rackGroup);

    // Orbiting Open Access IIIF Data Ring
    const ringGroup = new THREE.Group();
    ringGroup.userData.layer = 'oa-ring';

    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.016, 16, 64), ringMat);
    ring.rotation.x = Math.PI / 2.3;
    ring.position.set(0, 0.12, 0);
    ringGroup.add(ring);
    this.repositoryRing = ring;

    // Orbiting Jewel Metadata Nodes
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const node = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 0), nodeMat);
      node.position.set(Math.cos(a) * 0.75, 0.12, Math.sin(a) * 0.75);
      node.userData.layer = 'metadata-nodes';
      ringGroup.add(node);
    }

    this.specimenGroup.add(ringGroup);
  }

  // SPECIMEN 9: Rare Book Cradle Specimen (Special Collections)
  createRareBookCradleSpecimen(volData) {
    const cradleGroup = new THREE.Group();
    cradleGroup.userData.layer = 'foam-cradle';

    const foamMat = new THREE.MeshStandardMaterial({ color: 0xded4c2, roughness: 0.85 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xc28e46, metalness: 0.8, roughness: 0.25 });

    // High-Density Foam Wedges (110° opening support)
    const leftWedge = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.14, 0.75), foamMat);
    leftWedge.position.set(-0.30, -0.34, 0);
    leftWedge.rotation.z = 0.25;
    leftWedge.castShadow = true;
    cradleGroup.add(leftWedge);

    const rightWedge = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.14, 0.75), foamMat);
    rightWedge.position.set(0.30, -0.34, 0);
    rightWedge.rotation.z = -0.25;
    rightWedge.castShadow = true;
    cradleGroup.add(rightWedge);

    // Open Rare Deluxe 3D Binding on Cradle
    const shelfBooks = (volData && volData.shelfBooks) || [];
    const rareBookData = shelfBooks[0] || {
      id: "gutenberg-1455-master",
      title: "Biblia Latina: 42-Line Gutenberg Bible",
      author: "Johannes Gutenberg",
      year: "c. 1455",
      callNumber: "093 .B582",
      cutter: ".B582",
      bindingType: "classical-leather",
      spineColor: "#2b1810",
      accentColor: "#d4a45a",
      ribbonColor: "#8b2635",
      giltEdges: "gold"
    };

    const bookGroup = this.createReal3DBookMesh(rareBookData, {
      mode: 'showcase',
      width: 0.44,
      height: 0.62,
      thickness: 0.12
    });
    bookGroup.userData.layer = 'rare-binding';
    bookGroup.position.set(0, -0.16, 0);
    bookGroup.rotation.set(-0.25, 0, 0);
    // Open the cover on the cradle!
    if (typeof bookGroup.setOpenAmount === 'function') {
      bookGroup.setOpenAmount(0.85);
    }
    cradleGroup.add(bookGroup);

    // Archival Cotton Handling Gloves
    const gloveGroup = new THREE.Group();
    gloveGroup.userData.layer = 'cotton-gloves';

    const gloveMat = new THREE.MeshStandardMaterial({ color: 0xfdfbf7, roughness: 0.9 });
    const glove1 = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.04, 0.18), gloveMat);
    glove1.position.set(-0.68, -0.45, 0.18);
    glove1.rotation.y = 0.35;
    gloveGroup.add(glove1);

    const glove2 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.035, 0.16), gloveMat);
    glove2.position.set(-0.70, -0.42, 0.06);
    glove2.rotation.y = 0.55;
    gloveGroup.add(glove2);

    cradleGroup.add(gloveGroup);

    // Rubricated Manuscript Leaf & Padded Brass Disc Weight
    const msGroup = new THREE.Group();
    msGroup.userData.layer = 'manuscript-leaf';

    const leafMat = new THREE.MeshStandardMaterial({ color: 0xeedcbd, roughness: 0.6 });
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.005, 0.48), leafMat);
    leaf.position.set(0.68, -0.42, 0);
    leaf.rotation.y = -0.22;
    msGroup.add(leaf);

    const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.035, 20), brassMat);
    weight.position.set(0.68, -0.395, 0.12);
    msGroup.add(weight);

    cradleGroup.add(msGroup);
    this.specimenGroup.add(cradleGroup);
  }

  /* =========================================================================
     5. SPECIMEN LOADING & DISPATCH
     ========================================================================= */
  finalizeSpecimen(volData) {
    if (!this.specimenGroup) return;

    this.specimenGroup.traverse((child) => {
      if (child.isMesh) {
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }
        child.userData.restPosition = child.position.clone();
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (m && m.clippingPlanes !== undefined) m.clippingPlanes = null;
        });
      }
    });

    this._displayScale = 1.05;
    this.specimenGroup.scale.setScalar(0.48);
    this.specimenGroup.position.set(0, 0.02, 0);
    this._intro = { t: 0, duration: 0.65 };

    const targetCam = this.compareActive ? this.compareHomeCamera : this.homeCamera;
    const targetLook = this.compareActive ? this.compareHomeTarget : this.homeTarget;

    this.tweenCamera(
      { x: targetCam.x, y: targetCam.y + 0.1, z: targetCam.z + 0.35 },
      targetLook,
      0.05
    );
    setTimeout(() => {
      this.tweenCamera(targetCam, targetLook, 0.65);
    }, 30);

    this.hotspots = volData.hotspots || [];
    this.createHotspotOverlay();
    if (this.plinthGroup) this.plinthGroup.visible = true;

    setTimeout(() => {
      if (this.onLoadEnd) this.onLoadEnd(volData);
    }, 350);
  }

  getHistoricCodexData(volData) {
    if (volData.shelfBooks && volData.shelfBooks.length) {
      return volData.shelfBooks[0];
    }
    const codexCatalog = {
      'classification-systems': {
        id: 'dewey-1876-first-edition',
        title: "A Classification and Subject Index for Cataloguing and Arranging Books",
        author: "Melvil Dewey",
        year: "1876",
        spineColor: "#1d3824",
        callNumber: "025.43 D51",
        condition: "Historic Amherst First Edition · Archival Conservation",
        binding: "Full green morocco, gilt spine fillet rules, deckled edges",
        cords: "5 Raised Hemp Bands",
        pages: 44
      },
      'marc-metadata': {
        id: 'marc-pilot-project-1968',
        title: "The MARC Pilot Project: Final Report on Machine-Readable Cataloging",
        author: "Henriette D. Avram",
        year: "1968",
        spineColor: "#182c48",
        callNumber: "025.30285 A96",
        condition: "Library of Congress Monograph · Pristine",
        binding: "Deep navy goatskin with 24K gold foil stamp tooling",
        cords: "Recessed Cord Machine Sewing",
        pages: 183
      },
      'academic-libraries': {
        id: 'diderot-encyclopedie-1751',
        title: "Encyclopédie, ou dictionnaire raisonné des sciences, des arts et des métiers",
        author: "Denis Diderot & Jean d'Alembert",
        year: "1751",
        spineColor: "#54161c",
        callNumber: "034 D55e",
        condition: "French Royal Folio · Acid Deterioration Stabilized",
        binding: "Crimson calfskin, gilt arabesque corner fleurons, marbled endpapers",
        cords: "6 Heavy Raised Cords",
        pages: 940
      },
      'preservation-science': {
        id: 'vesalius-fabrica-1543',
        title: "De Humani Corporis Fabrica Libri Septem",
        author: "Andreas Vesalius",
        year: "1543",
        spineColor: "#422314",
        callNumber: "RBC-FAB-1543",
        condition: "Renaissance Binding · Iron-Gall Ink Corrosive Flaking · pH 5.4",
        binding: "Blind-tooled pigskin over bevelled oak boards, brass clasps",
        cords: "5 Split-Alum Tawed Leather Bands",
        pages: 663
      },
      'special-collections': {
        id: 'kelmscott-chaucer-1896',
        title: "The Works of Geoffrey Chaucer Now Newly Imprinted",
        author: "Geoffrey Chaucer (William Morris & Edward Burne-Jones)",
        year: "1896",
        spineColor: "#3d1f2b",
        callNumber: "K-CH-1896",
        condition: "Masterpiece Private Press Folio · Climate Vault Reserve",
        binding: "Full white pigskin blind-tooled by Doves Bindery, silver clasps",
        cords: "6 Double Raised Linen Cords",
        pages: 556
      },
      'public-libraries': {
        id: 'carnegie-league-peace-1906',
        title: "A League of Peace: A Rectorial Address to St. Andrews",
        author: "Andrew Carnegie",
        year: "1906",
        spineColor: "#3e1826",
        callNumber: "172.4 C28",
        condition: "Author Inscription · Archival Mylar Slipcase",
        binding: "Burgundy morocco with gilt civic torch emblems",
        cords: "4 Raised Cords",
        pages: 48
      },
      'digital-repositories': {
        id: 'codex-sinaiticus-facsimile-1911',
        title: "Codex Sinaiticus Petropolitanus: Uncial Script Facsimile",
        author: "Helen & Kirsopp Lake (Oxford Clarendon Press)",
        year: "1911",
        spineColor: "#2b251e",
        callNumber: "220.48 C66",
        condition: "Phototypic Facsimile · Spectral IIIF Reference",
        binding: "Heavy brown buckram over bevelled millboard, morocco spine label",
        cords: "5 Tapes Machine Sewn",
        pages: 430
      },
      'reference-services': {
        id: 'diderot-encyclopedie-methodique-1782',
        title: "L'Encyclopédie méthodique: Système des Connaissances Humaines",
        author: "Charles-Joseph Panckoucke",
        year: "1782",
        spineColor: "#5a3618",
        callNumber: "034 P19e",
        condition: "Complete Scholarly Reference Set · Rag Paper Intact",
        binding: "Mottled hazel calfskin, gilt spine compartments, red morocco label",
        cords: "5 Raised Cords",
        pages: 820
      },
      'collection-management': {
        id: 'ranganathan-five-laws-1931',
        title: "The Five Laws of Library Science",
        author: "Shiyali Ramamrita Ranganathan",
        year: "1931",
        spineColor: "#163a34",
        callNumber: "020.1 R19f",
        condition: "Madras First Edition · Rare Circulation Provenance",
        binding: "Teal cloth-backed boards with embossed gold spine lettering",
        cords: "4 Heavy Cloth Tapes",
        pages: 438
      }
    };
    return codexCatalog[volData.id] || {
      id: volData.id + '-historic-codex',
      title: volData.specimen ? volData.specimen.name : volData.title,
      author: volData.specimen ? volData.specimen.scientificName : (volData.subtitle || 'Historic Volume'),
      year: '1751',
      spineColor: volData.accent || '#4a151b',
      callNumber: volData.callNumber || '020.92 B58',
      condition: 'Archival Conservation Required',
      binding: 'Morocco leather with gilt tooling',
      cords: '5 Raised Cords',
      pages: 420
    };
  }

  loadBookSpecimen(volData, viewType = 'scanner') {
    if (this.onLoadStart) this.onLoadStart(volData);

    this.stopTour(true);
    this.clearHotspotSelection();
    this.exploded = false;
    this.explodeTarget = 0;
    this.explodeAmount = 0;
    this.sectionOn = false;
    this._sectionTween = null;
    this.currentViewMode = 'normal';
    this.currentLayerIndex = -1;
    this.repositoryRing = null;
    this.active3DBook = null;
    this.currentSpecimenMode = viewType;

    this.clearSpecimenGroup();

    this.currentSpecimenData = volData;
    this.specimenGroup = new THREE.Group();
    this.specimenGroup.name = 'specimenGroup';
    this.scene.add(this.specimenGroup);

    if (viewType === 'architecture') {
      const specType = volData.specimen ? volData.specimen.type : 'classification-bay';
      const build = this.specimenBuilders()[specType] || this.createClassificationBaySpecimen;
      build.call(this, volData);
      this.finalizeSpecimen(volData);
      return;
    }

    // Default & Premier Mode: HIGH-TECH DIAGNOSTIC SCANNER WITH MASTER ARTICULATED CODEX
    const backdropMap = {
      'classification-systems': 'assets/walkthrough/reading_room.jpg?v=pure2',
      'marc-metadata': 'assets/walkthrough/circulation.jpg?v=pure2',
      'academic-libraries': 'assets/walkthrough/reading_room.jpg?v=pure2',
      'preservation-science': 'assets/walkthrough/bindery.jpg?v=pure2',
      'special-collections': 'assets/walkthrough/vault.jpg?v=pure2',
      'public-libraries': 'assets/walkthrough/foyer.jpg?v=pure2',
      'digital-repositories': 'assets/walkthrough/reading_room.jpg?v=pure2',
      'reference-services': 'assets/walkthrough/circulation.jpg?v=pure2',
      'collection-management': 'assets/walkthrough/bindery.jpg?v=pure2'
    };
    const roomImg = backdropMap[volData.id] || 'assets/walkthrough/reading_room.jpg?v=pure2';
    this.setStationBackdrop(roomImg);

    // Build the master physical book with articulated anatomical assemblies
    const targetBook = this.getHistoricCodexData(volData);

    const bookMesh = this.createReal3DBookMesh(targetBook, {
      mode: 'showcase',
      width: 0.44,
      height: 0.60,
      thickness: 0.125,
      isPrimary: true
    });
    bookMesh.position.set(0, 0.08, 0);
    this.specimenGroup.add(bookMesh);
    this.active3DBook = bookMesh;
    this.activeBookOpenAmount = 0;
    this.activeBookPageFlip = 0;

    // Contact shadow on plinth
    const shadowGeo = new THREE.PlaneGeometry(0.85, 0.85);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: this.createContactShadowTexture(),
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.name = 'contactShadow';
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -0.22, 0);
    this.specimenGroup.add(shadowMesh);

    // Build Diagnostic Telemetry Badges for book anatomical parts
    if (bookMesh.userData.anatomicalParts) {
      this.buildTelemetryBadges(bookMesh.userData.anatomicalParts);
    }

    // Ensure plinth and laser sweep are active and visible
    if (this.plinthGroup) this.plinthGroup.visible = true;
    if (this.laserSweepMesh) this.laserSweepMesh.visible = true;

    // Frame camera on the high-tech diagnostic scanner stage
    this.tweenCamera(
      { x: 0.22, y: 0.32, z: 1.85 },
      { x: 0, y: 0.05, z: 0 },
      0.85
    );

    this.hotspots = volData.hotspots || [];
    this.createHotspotOverlay();

    setTimeout(() => {
      if (this.onLoadEnd) this.onLoadEnd(volData);
    }, 350);
  }

  toggleSpecimenArchitectureMode() {
    if (!this.currentSpecimenData) return;
    const nextMode = this.currentSpecimenMode === 'architecture' ? 'scanner' : 'architecture';
    this.loadBookSpecimen(this.currentSpecimenData, nextMode);
    return nextMode;
  }

  /** Single source of truth for the specimen builder registry. */
  specimenBuilders() {
    return {
      'marc-catalog-card': this.createMARCCatalogCardSpecimen,
      'preservation-vault-drawer': this.createPreservationVaultDrawerSpecimen,
      'reference-desk-stage': this.createReferenceDeskStageSpecimen,
      'weeding-cart': this.createWeedingCartSpecimen,
      'academic-reading-room': this.createAcademicReadingRoomSpecimen,
      'public-hub': this.createPublicHubSpecimen,
      'digital-repository': this.createDigitalRepositorySpecimen,
      'classification-bay': this.createClassificationBaySpecimen,
      'rare-book-cradle': this.createRareBookCradleSpecimen
    };
  }

  /* =========================================================================
     6. TOOLBAR ACTIONS: ISOLATE, LAYERS, COMPARE, SECTION, UV, RESET
     ========================================================================= */

  setViewMode(mode) {
    const previousMode = this.currentViewMode;
    this.currentViewMode = mode;
    if (!this.specimenGroup) return;

    if (mode !== 'section' && this.sectionOn) {
      this.sectionOn = false;
      this.applyClipping(false);
    }

    this.specimenGroup.traverse((child) => {
      if (!child.isMesh) return;
      if (!child.userData.originalMaterial) {
        child.userData.originalMaterial = child.material;
      }

      // View-mode materials are per-mesh and owned by the viewer — free the previous
      // set before swapping in a new one, otherwise every toggle leaks a full set.
      if (previousMode !== mode && child.userData.viewModeMaterials) {
        child.userData.viewModeMaterials.forEach((m) => m.dispose());
      }
      child.userData.viewModeMaterials = null;

      if (mode === 'uv' || mode === 'isolate') {
        const proto = mode === 'uv'
          ? new THREE.MeshBasicMaterial({
              color: 0x00f3ff,
              wireframe: true,
              transparent: true,
              opacity: 0.9
            })
          : new THREE.MeshStandardMaterial({
              color: 0xc28e46,
              roughness: 0.25,
              metalness: 0.35,
              transparent: true,
              opacity: 0.85
            });
        proto.userData.isViewModeMaterial = true;

        const original = child.userData.originalMaterial;
        const replacement = Array.isArray(original)
          ? original.map(() => proto.clone())
          : proto;
        if (Array.isArray(replacement)) replacement.forEach((m) => { m.userData.isViewModeMaterial = true; });
        child.material = replacement;
        child.userData.viewModeMaterials = Array.isArray(replacement) ? replacement : [replacement];
      } else {
        child.material = child.userData.originalMaterial;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          if (!mat) return;
          if (this.sectionOn) {
            mat.clippingPlanes = [this.clipPlane];
            mat.needsUpdate = true;
          }
        });
      }
    });

    if (this.plinthGroup) {
      this.plinthGroup.visible = mode !== 'isolate';
    }
  }

  toggleLayers() {
    if (!this.currentSpecimenData || !this.currentSpecimenData.specimen) return null;
    const layers = this.currentSpecimenData.specimen.layers || [];
    if (!layers.length) return null;

    // Cycle layers: -1 (all) -> 0 -> 1 -> ... -> -1
    this.currentLayerIndex++;
    if (this.currentLayerIndex >= layers.length) {
      this.currentLayerIndex = -1;
    }

    const activeLayer = this.currentLayerIndex === -1 ? 'all' : layers[this.currentLayerIndex];

    this.specimenGroup.traverse((child) => {
      if (child.userData && child.userData.layer) {
        if (activeLayer === 'all') {
          child.visible = true;
        } else {
          child.visible = (child.userData.layer === activeLayer);
        }
      }
    });

    if (this.onLayerChange) {
      this.onLayerChange({
        layer: activeLayer,
        label: activeLayer === 'all' ? 'All Specimen Layers' : `Layer: ${activeLayer.replace(/-/g, ' ').toUpperCase()}`,
        index: this.currentLayerIndex,
        total: layers.length
      });
    }

    return activeLayer;
  }

  /**
   * Set compare mode from an explicit reference volume (or null to disable).
   * This must NOT be a blind toggle: selectVolume() re-applies the current compare
   * state on every specimen change, so toggling would silently switch it back off.
   */
  setCompare(secondaryVolData) {
    const shouldBeActive = !!secondaryVolData;

    if (shouldBeActive && this.compareActive && this.compareSpecimenData === secondaryVolData) {
      return this.compareActive; // already showing exactly this reference
    }

    this.compareActive = shouldBeActive;

    if (shouldBeActive) {
      this.compareSpecimenData = secondaryVolData;
      this.createSecondaryPlinth();

      // Smoothly reposition primary to left
      this.specimenGroup.position.x = -0.72;
      this.plinthGroup.position.x = -0.72;

      // Build secondary specimen on the right
      this.clearCompareSpecimenGroup();
      this.compareSpecimenGroup = new THREE.Group();
      this.compareSpecimenGroup.name = 'compareSpecimenGroup';
      this.scene.add(this.compareSpecimenGroup);

      const specType = secondaryVolData.specimen ? secondaryVolData.specimen.type : 'marc-catalog-card';

      // Temporarily set specimenGroup to compare group to run builder
      const primaryGroup = this.specimenGroup;
      this.specimenGroup = this.compareSpecimenGroup;
      const build = this.specimenBuilders()[specType] || this.createMARCCatalogCardSpecimen;
      build.call(this, secondaryVolData);
      this.specimenGroup = primaryGroup;

      this.compareSpecimenGroup.position.set(0.72, 0.02, 0);
      this.compareSpecimenGroup.scale.setScalar(0.48);
      if (this.secondaryPlinthGroup) {
        this.secondaryPlinthGroup.position.set(0.72, 0, 0);
        this.secondaryPlinthGroup.visible = true;
      }

      this.tweenCamera(this.compareHomeCamera, this.compareHomeTarget, 0.75);
    } else {
      // Restore single specimen layout
      this.compareSpecimenData = null;
      this.clearCompareSpecimenGroup();
      if (this.secondaryPlinthGroup) {
        this.secondaryPlinthGroup.visible = false;
      }

      if (this.specimenGroup) this.specimenGroup.position.x = 0;
      if (this.plinthGroup) this.plinthGroup.position.x = 0;
      this.tweenCamera(this.homeCamera, this.homeTarget, 0.75);
    }

    return this.compareActive;
  }

  clearCompareSpecimenGroup() {
    if (this.compareSpecimenGroup) {
      this.disposeObject(this.compareSpecimenGroup);
      this.compareSpecimenGroup = null;
    }
  }

  setExploded(state) {
    this.exploded = !!state;
    this.explodeTarget = this.exploded ? 1.0 : 0.0;
    if (this.exploded) this.currentViewMode = 'exploded';
    else if (this.currentViewMode === 'exploded') this.currentViewMode = 'normal';
    if (this.audioDiagnostic) {
      this.audioDiagnostic.playServo(0.65, this.exploded ? 1 : -1);
    }
    const slider = document.getElementById('explode-slider');
    if (slider) slider.value = this.exploded ? 100 : 0;
    const readout = document.getElementById('explode-slider-val');
    if (readout) readout.textContent = this.exploded ? '100%' : '0%';
    const explodeBtn = document.getElementById('tool-explode-btn');
    if (explodeBtn) {
      explodeBtn.classList.toggle('active', this.exploded);
      explodeBtn.setAttribute('aria-pressed', String(this.exploded));
    }
    return this.exploded;
  }

  setExplodeAmount(val) {
    const clamped = Math.max(0, Math.min(1, val));
    this.explodeTarget = clamped;
    this.exploded = clamped > 0.04;
    if (this.controls) {
      this.controls.autoRotate = this.autoRotateWanted && !this.exploded;
    }
    const explodeBtn = document.getElementById('tool-explode-btn');
    if (explodeBtn) {
      explodeBtn.classList.toggle('active', this.exploded);
      explodeBtn.setAttribute('aria-pressed', String(this.exploded));
    }
    const readout = document.getElementById('explode-slider-val');
    if (readout) {
      readout.textContent = `${Math.round(clamped * 100)}%`;
    }
    const slider = document.getElementById('explode-slider');
    if (slider && Math.abs(parseFloat(slider.value) - clamped * 100) > 0.8) {
      slider.value = Math.round(clamped * 100);
    }
  }

  toggleExplode() {
    return this.setExploded(!this.exploded);
  }

  toggleCrossSection() {
    this.sectionOn = !this.sectionOn;
    this.applyClipping(this.sectionOn);
    const sliderBox = document.getElementById('section-slider-box');
    if (sliderBox) sliderBox.style.display = this.sectionOn ? 'inline-flex' : 'none';

    if (this.sectionOn) {
      this.currentViewMode = 'section';
      this.clipPlane.constant = 0.04;
    } else {
      this._sectionTween = null;
      if (this.currentViewMode === 'section') this.currentViewMode = 'normal';
    }
    const secBtn = document.querySelector('.tool-button[data-action="section"]');
    if (secBtn) {
      secBtn.classList.toggle('active', this.sectionOn);
      secBtn.setAttribute('aria-pressed', String(this.sectionOn));
    }
    return this.sectionOn;
  }

  setSectionSlice(percent) {
    if (!this.sectionOn) {
      this.toggleCrossSection();
    }
    // percent is -100 to +100 -> depth -0.32 to +0.32
    const depth = (percent / 100) * 0.32;
    this.clipPlane.constant = depth;
    const readout = document.getElementById('section-slider-val');
    if (readout) {
      const mm = (depth * 100).toFixed(1);
      readout.textContent = `${mm > 0 ? '+' : ''}${mm}mm`;
    }
  }

  toggleBankerLamp() {
    this.lampMode = this.lampMode === 'warm' ? 'daylight' : 'warm';
    if (this.bankerLampSpot) {
      if (this.lampMode === 'warm') {
        this.bankerLampSpot.color.setHex(0xffdf99);
        this.bankerLampSpot.intensity = 2.4;
      } else {
        this.bankerLampSpot.color.setHex(0xd8ecff);
        this.bankerLampSpot.intensity = 2.0;
      }
    }
    if (this.audioDiagnostic) {
      this.audioDiagnostic.playLatchClick();
    }
    const label = document.getElementById('lamp-label');
    if (label) {
      label.textContent = this.lampMode === 'warm' ? 'Lamp 2700K' : 'Lamp 5500K';
    }
    const btn = document.getElementById('tool-lamp-btn');
    if (btn) {
      btn.classList.toggle('active', this.lampMode === 'warm');
    }
    return this.lampMode;
  }

  setupMicroLoupe() {
    this.loupeEl = document.getElementById('micro-loupe-lens');
    this.loupeCanvas = document.getElementById('loupe-canvas');
    if (this.loupeCanvas) {
      this.loupeCtx = this.loupeCanvas.getContext('2d');
    }

    if (this.mount) {
      this.mount.addEventListener('pointermove', (e) => {
        if (!this.loupeActive) return;
        this.updateLoupeAt(e.clientX, e.clientY);
      });
    }
  }

  toggleMicroLoupe() {
    this.loupeActive = !this.loupeActive;
    if (this.loupeEl) {
      this.loupeEl.hidden = !this.loupeActive;
      this.loupeEl.setAttribute('aria-hidden', String(!this.loupeActive));
    }
    const btn = document.getElementById('tool-loupe-btn');
    if (btn) {
      btn.classList.toggle('active', this.loupeActive);
      btn.setAttribute('aria-pressed', String(this.loupeActive));
    }
    if (this.audioDiagnostic) {
      this.audioDiagnostic.playServo(0.45, this.loupeActive ? 1 : -1);
    }
    return this.loupeActive;
  }

  updateLoupeAt(clientX, clientY) {
    if (!this.loupeEl || !this.loupeCanvas || !this.loupeCtx || !this.mount) return;
    const rect = this.mount.getBoundingClientRect();
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    if (relX < 0 || relX > rect.width || relY < 0 || relY > rect.height) {
      this.loupeEl.style.display = 'none';
      return;
    }
    this.loupeEl.style.display = 'block';
    this.loupeEl.style.left = `${relX}px`;
    this.loupeEl.style.top = `${relY}px`;

    const ndcX = (relX / rect.width) * 2 - 1;
    const ndcY = -(relY / rect.height) * 2 + 1;
    this.raycaster.setFromCamera({ x: ndcX, y: ndcY }, this.camera);

    let hitPartName = 'Morocco Leather Grain Follicles';
    let hitType = 'leather';
    if (this.specimenGroup) {
      const hits = this.raycaster.intersectObjects(this.specimenGroup.children, true);
      if (hits.length > 0) {
        const obj = hits[0].object;
        const name = (obj.name || (obj.parent && obj.parent.name) || '').toLowerCase();
        if (name.includes('leaf') || name.includes('page') || name.includes('quire') || name.includes('gathering') || name.includes('textblock')) {
          hitPartName = 'Rag Cotton Cellulose Laid Paper';
          hitType = 'paper';
        } else if (name.includes('cord') || name.includes('spine') || name.includes('endband') || name.includes('ribbon') || name.includes('marker')) {
          hitPartName = 'Twisted Linen Flax & Silk Core';
          hitType = 'textile';
        } else if (name.includes('gilt') || name.includes('tooling') || name.includes('gold')) {
          hitPartName = '24k Fire-Gilt Leaf Tooling';
          hitType = 'gold';
        } else {
          hitPartName = 'Morocco Leather Grain Follicles';
          hitType = 'leather';
        }
      }
    }

    const labelEl = document.getElementById('loupe-sample-label');
    if (labelEl) labelEl.textContent = hitPartName;

    const coordsEl = document.getElementById('loupe-coords');
    if (coordsEl) {
      const uX = Math.round(relX * 2.4);
      const uY = Math.round(relY * 2.4);
      coordsEl.textContent = `POS: [${uX}, ${uY}] · 40.0× · 120µm`;
    }

    this.drawMicroscopicSurface(hitType, relX, relY);
  }

  drawMicroscopicSurface(type, seedX, seedY) {
    const ctx = this.loupeCtx;
    const W = this.loupeCanvas.width;
    const H = this.loupeCanvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, W / 2 - 2, 0, Math.PI * 2);
    ctx.clip();

    if (type === 'leather') {
      const baseGrad = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W / 2);
      baseGrad.addColorStop(0, '#5a1e12');
      baseGrad.addColorStop(0.7, '#381008');
      baseGrad.addColorStop(1, '#1e0804');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = 'rgba(20, 6, 3, 0.65)';
      const sX = (seedX * 3) % 25;
      const sY = (seedY * 3) % 25;
      for (let x = -20; x < W + 20; x += 14) {
        for (let y = -20; y < H + 20; y += 14) {
          const px = x + ((y * 7) % 6) + Math.sin(x + sX) * 2;
          const py = y + ((x * 5) % 6) + Math.cos(y + sY) * 2;
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(160, 80, 50, 0.35)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      ctx.strokeStyle = 'rgba(25, 8, 4, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(30, 40); ctx.lineTo(95, 110); ctx.lineTo(170, 90); ctx.lineTo(190, 160);
      ctx.moveTo(80, 180); ctx.lineTo(110, 130); ctx.lineTo(160, 175);
      ctx.stroke();

    } else if (type === 'paper') {
      ctx.fillStyle = '#f3ebe0';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(180, 160, 140, 0.35)';
      ctx.lineWidth = 2.5;
      for (let y = 18; y < H; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(140, 120, 100, 0.45)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 40; i++) {
        const x1 = ((i * 37 + seedX) % W);
        const y1 = ((i * 53 + seedY) % H);
        const x2 = x1 + Math.cos(i) * 35;
        const y2 = y1 + Math.sin(i) * 35;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(x1 + 10, y1 - 8, x2, y2);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(42, 28, 18, 0.82)';
      ctx.beginPath();
      ctx.arc(W / 2 + 10, H / 2 - 5, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(65, 45, 30, 0.6)';
      ctx.lineWidth = 1.5;
      for (let a = 0; a < Math.PI * 2; a += 0.35) {
        ctx.beginPath();
        ctx.moveTo(W / 2 + 10 + Math.cos(a) * 18, H / 2 - 5 + Math.sin(a) * 18);
        ctx.lineTo(W / 2 + 10 + Math.cos(a) * 32, H / 2 - 5 + Math.sin(a) * 32);
        ctx.stroke();
      }

    } else if (type === 'textile') {
      ctx.fillStyle = '#221812';
      ctx.fillRect(0, 0, W, H);

      for (let x = 20; x < W; x += 32) {
        ctx.fillStyle = (x % 64 === 0) ? '#a88252' : '#705436';
        ctx.fillRect(x, 0, 24, H);
        ctx.strokeStyle = 'rgba(255, 230, 180, 0.25)';
        ctx.lineWidth = 1.5;
        for (let y = 0; y < H; y += 14) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 24, y + 16);
          ctx.stroke();
        }
      }

    } else {
      const goldGrad = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W / 2);
      goldGrad.addColorStop(0, '#ffe885');
      goldGrad.addColorStop(0.5, '#c89e32');
      goldGrad.addColorStop(1, '#664d12');
      ctx.fillStyle = goldGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 30; i++) {
        const x = (i * 29 + seedX) % W;
        const y = (i * 47 + seedY) % H;
        ctx.strokeRect(x, y, 18, 12);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(x + 2, y + 2, 4, 4);
      }
    }

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
    ctx.lineWidth = 1;
    [35, 70, 95].forEach(r => {
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    for (let d = -80; d <= 80; d += 20) {
      if (d === 0) continue;
      ctx.beginPath();
      ctx.moveTo(W / 2 + d, H / 2 - 4); ctx.lineTo(W / 2 + d, H / 2 + 4);
      ctx.moveTo(W / 2 - 4, H / 2 + d); ctx.lineTo(W / 2 + 4, H / 2 + d);
      ctx.stroke();
    }

    ctx.restore();
  }

  /* =========================================================================
     4. RAKING LIGHT, TRANSMITTED BACKLIGHT & XRF SPECTROMETRY
     ========================================================================= */
  updateRakingLightPosition() {
    if (!this.rakingLight) return;
    const rad = (this.rakingAzimuth * Math.PI) / 180;
    const radius = 2.4;
    const x = Math.cos(rad) * radius;
    const z = Math.sin(rad) * radius;
    const y = 0.20; // 8° elevation angle (grazing incidence)
    this.rakingLight.position.set(x, y, z);
  }

  setRakingAzimuth(deg) {
    this.rakingAzimuth = parseFloat(deg) % 360;
    this.updateRakingLightPosition();
    const readout = document.getElementById('raking-slider-val');
    if (readout) {
      const cardinal = this.getCardinalDirection(this.rakingAzimuth);
      readout.textContent = `${Math.round(this.rakingAzimuth)}° ${cardinal}`;
    }
  }

  getCardinalDirection(deg) {
    const directions = ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE'];
    const idx = Math.round(deg / 45) % 8;
    return directions[idx];
  }

  toggleRakingLight() {
    this.rakingActive = !this.rakingActive;
    if (this.rakingLight) {
      this.rakingLight.intensity = this.rakingActive ? 3.4 : 0;
    }
    // In raking mode, dim ambient and key lights so the dramatic micro-grazing shadows pop
    const amb = this.scene.getObjectByName('ambientLight');
    const key = this.scene.getObjectByName('keySpot');
    if (amb) amb.intensity = this.rakingActive ? 0.22 : 0.95;
    if (key) key.intensity = this.rakingActive ? 0.35 : 2.6;

    const btn = document.getElementById('tool-raking-btn');
    if (btn) {
      btn.classList.toggle('active', this.rakingActive);
      btn.setAttribute('aria-pressed', String(this.rakingActive));
    }
    const box = document.getElementById('raking-slider-box');
    if (box) box.style.display = this.rakingActive ? 'inline-flex' : 'none';

    if (this.audioDiagnostic) {
      this.audioDiagnostic.playRheostatHum();
    }
    return this.rakingActive;
  }

  toggleBacklight() {
    this.backlightActive = !this.backlightActive;
    
    // Ensure book cover is opened to inspect the illuminated leaf
    if (this.backlightActive && this.activeBookOpenAmount < 0.3) {
      this.toggleActiveCoverOpen();
    }

    // Create or toggle diffuse backlight glowing panel underneath the leaf
    if (!this.backlightMesh) {
      const geo = new THREE.PlaneGeometry(0.72, 1.05);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xfffbee,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide
      });
      this.backlightMesh = new THREE.Mesh(geo, mat);
      this.backlightMesh.rotation.x = -Math.PI / 2;
      this.backlightMesh.position.set(0.38, 0.05, 0);
      this.backlightMesh.name = 'backlightMesh';
      this.scene.add(this.backlightMesh);
    }

    if (this.backlightMesh) {
      this.backlightMesh.visible = this.backlightActive;
    }

    // Apply backlit watermark texture to leaf meshes
    if (this.specimenGroup) {
      this.specimenGroup.traverse((child) => {
        if (child.isMesh && (child.name.includes('leaf') || child.name.includes('page') || child.name.includes('Textblock') || child.name.includes('Gathering'))) {
          if (this.backlightActive) {
            if (!this.originalLeafMaterials.has(child.id)) {
              this.originalLeafMaterials.set(child.id, child.material);
            }
            child.material = this.getWatermarkBacklitMaterial();
          } else {
            if (this.originalLeafMaterials.has(child.id)) {
              child.material = this.originalLeafMaterials.get(child.id);
            }
          }
        }
      });
    }

    // Dim overhead key light when backlighting to let transmitted illumination shine through
    const key = this.scene.getObjectByName('keySpot');
    if (key) key.intensity = this.backlightActive ? 0.45 : 2.6;

    const btn = document.getElementById('tool-backlight-btn');
    if (btn) {
      btn.classList.toggle('active', this.backlightActive);
      btn.setAttribute('aria-pressed', String(this.backlightActive));
    }
    if (this.audioDiagnostic) {
      this.audioDiagnostic.playSpectralChime('visible');
    }
    return this.backlightActive;
  }

  getWatermarkBacklitMaterial() {
    return this.cachedTexture('watermark-backlit-mat', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1440;
      const ctx = canvas.getContext('2d');

      // Translucent parchment slurry base
      ctx.fillStyle = '#f8f4ea';
      ctx.fillRect(0, 0, 1024, 1440);

      // Fine wire lines (laid paper mold wires) spaced every 5px (~1.2mm)
      ctx.strokeStyle = 'rgba(215, 200, 175, 0.45)';
      ctx.lineWidth = 1;
      for (let y = 10; y < 1440; y += 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }

      // Vertical chain lines spaced every 72px (~28mm) with subtle pulp shadow
      for (let x = 64; x < 1024; x += 72) {
        ctx.strokeStyle = 'rgba(240, 230, 210, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1440);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(165, 145, 120, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 1, 0);
        ctx.lineTo(x + 1, 1440);
        ctx.stroke();
      }

      // Authentic 15th-Century Historic Watermark: Aldine Anchor & Dolphin
      ctx.save();
      ctx.translate(512, 720);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = 'rgba(180, 160, 130, 0.6)';
      ctx.shadowBlur = 3;
      ctx.lineWidth = 3.5;

      // Anchor ring & stock
      ctx.beginPath();
      ctx.arc(0, -180, 28, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -152); ctx.lineTo(0, 180); // Shank
      ctx.moveTo(-110, -90); ctx.lineTo(110, -90); // Stock
      ctx.stroke();

      // Anchor arms & flukes
      ctx.beginPath();
      ctx.arc(0, 70, 130, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();

      // Dolphin entwined around anchor shank
      ctx.beginPath();
      ctx.moveTo(-40, 160);
      ctx.bezierCurveTo(-120, 60, -90, -40, 10, -60);
      ctx.bezierCurveTo(90, -75, 110, -120, 60, -145);
      ctx.stroke();

      // Watermark Maker's Monogram: "A · M" (Aldus Manutius)
      ctx.font = 'bold 38px serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.textAlign = 'center';
      ctx.fillText('A · M', 0, 230);
      ctx.restore();

      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 4;
      return new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.75,
        metalness: 0.05,
        emissive: 0xfff8e8,
        emissiveIntensity: 0.38,
        side: THREE.DoubleSide
      });
    });
  }

  setupXRF() {
    this.xrfPanel = document.getElementById('xrf-hud-panel');
    this.xrfCanvas = document.getElementById('xrf-spectrum-canvas');
    if (this.xrfCanvas) {
      this.xrfCtx = this.xrfCanvas.getContext('2d');
    }
    if (this.mount) {
      this.mount.addEventListener('pointermove', (e) => {
        if (!this.xrfActive) return;
        this.updateXRFAt(e.clientX, e.clientY);
      });
    }
  }

  toggleXRF() {
    this.xrfActive = !this.xrfActive;
    if (this.xrfPanel) {
      this.xrfPanel.hidden = !this.xrfActive;
      this.xrfPanel.setAttribute('aria-hidden', String(!this.xrfActive));
    }
    const btn = document.getElementById('tool-xrf-btn');
    if (btn) {
      btn.classList.toggle('active', this.xrfActive);
      btn.setAttribute('aria-pressed', String(this.xrfActive));
    }
    if (this.audioDiagnostic) {
      this.audioDiagnostic.playSpectrometerChirp();
    }
    if (this.xrfActive) {
      this.updateXRFAt(window.innerWidth / 2, window.innerHeight / 2);
    }
    return this.xrfActive;
  }

  updateXRFAt(clientX, clientY) {
    if (!this.xrfActive || !this.xrfCtx || !this.mount) return;
    const rect = this.mount.getBoundingClientRect();
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;
    if (relX < 0 || relX > rect.width || relY < 0 || relY > rect.height) return;

    const ndcX = (relX / rect.width) * 2 - 1;
    const ndcY = -(relY / rect.height) * 2 + 1;
    this.raycaster.setFromCamera({ x: ndcX, y: ndcY }, this.camera);

    let matType = 'gold';
    if (this.specimenGroup) {
      const hits = this.raycaster.intersectObjects(this.specimenGroup.children, true);
      if (hits.length > 0) {
        const name = (hits[0].object.name || '').toLowerCase();
        if (name.includes('leaf') || name.includes('page') || name.includes('textblock')) {
          matType = (Math.round(relX) % 2 === 0) ? 'cinnabar' : 'irongall';
        } else if (name.includes('cord') || name.includes('endband') || name.includes('spine')) {
          matType = 'verdigris';
        } else if (name.includes('gold') || name.includes('tooling') || name.includes('gilt')) {
          matType = 'gold';
        } else {
          matType = 'leather_calcium';
        }
      }
    }

    this.drawXRFSpectrum(matType);
  }

  drawXRFSpectrum(type) {
    const ctx = this.xrfCtx;
    const W = this.xrfCanvas.width;
    const H = this.xrfCanvas.height;
    ctx.clearRect(0, 0, W, H);

    // Spectrum grid lines (0 to 12 keV)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let kev = 1; kev <= 12; kev++) {
      const x = (kev / 12) * W;
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Material data profiles
    const profiles = {
      gold: {
        name: '24k Fire-Gilt Leaf Tooling',
        desc: 'Au: 96.4% · Cu: 3.2% · Ag: 0.4% trace. Gold bole underlayer.',
        peaks: [
          { label: 'Au-Lα', kev: 9.71, amp: 85, color: '#fbbf24' },
          { label: 'Au-Lβ', kev: 11.44, amp: 65, color: '#fbbf24' },
          { label: 'Cu-Kα', kev: 8.04, amp: 38, color: '#34d399' }
        ]
      },
      irongall: {
        name: 'Iron Gall Ink (Ferrous Tannate)',
        desc: 'Fe: 72.4% · S: 18.2% · K: 5.6% · Ca: 3.8%. Vitriol / oak gall acid corrosion index: 2.1.',
        peaks: [
          { label: 'Fe-Kα', kev: 6.40, amp: 90, color: '#38bdf8' },
          { label: 'Fe-Kβ', kev: 7.06, amp: 44, color: '#38bdf8' },
          { label: 'S-Kα', kev: 2.31, amp: 32, color: '#fbbf24' }
        ]
      },
      cinnabar: {
        name: 'Vermilion Rubrication (Cinnabar HgS)',
        desc: 'Hg: 86.2% · S: 13.8%. Native mercury sulfide crystal illuminated red rubrication.',
        peaks: [
          { label: 'Hg-Lα', kev: 9.99, amp: 92, color: '#f87171' },
          { label: 'Hg-Lβ', kev: 11.82, amp: 52, color: '#f87171' },
          { label: 'S-Kα', kev: 2.31, amp: 28, color: '#fbbf24' }
        ]
      },
      verdigris: {
        name: 'Verdigris Copper Resinate & Silk Mordant',
        desc: 'Cu: 78.5% · Al: 12.1% · Fe: 9.4%. Alum-mordanted silk endband pigments.',
        peaks: [
          { label: 'Cu-Kα', kev: 8.04, amp: 88, color: '#34d399' },
          { label: 'Cu-Kβ', kev: 8.90, amp: 42, color: '#34d399' },
          { label: 'Al-Kα', kev: 1.49, amp: 24, color: '#94a3b8' }
        ]
      },
      leather_calcium: {
        name: 'Vegetable-Tanned Morocco Goatskin',
        desc: 'Ca: 64.2% · S: 22.1% · Fe: 13.7%. Lime pit depilation & sumac pyrogallol tannins.',
        peaks: [
          { label: 'Ca-Kα', kev: 3.69, amp: 78, color: '#e2e8f0' },
          { label: 'S-Kα', kev: 2.31, amp: 36, color: '#fbbf24' },
          { label: 'Fe-Kα', kev: 6.40, amp: 26, color: '#38bdf8' }
        ]
      }
    };

    const prof = profiles[type] || profiles.gold;

    // Update DOM readouts
    const nameEl = document.getElementById('xrf-pigment-name');
    if (nameEl) nameEl.textContent = prof.name;
    const descEl = document.getElementById('xrf-pigment-desc');
    if (descEl) descEl.textContent = prof.desc;

    const chipsEl = document.getElementById('xrf-peaks-list');
    if (chipsEl) {
      chipsEl.innerHTML = prof.peaks.map(p => 
        `<span class="xrf-peak-chip" style="color:${p.color}; border-color:${p.color}88; background:${p.color}22">${p.label}: ${p.kev} keV</span>`
      ).join('');
    }

    // Draw baseline noise
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.85)';
    ctx.lineWidth = 1.6;

    for (let x = 0; x < W; x++) {
      const kev = (x / W) * 12;
      let y = H - 8 - Math.random() * 3; // baseline noise
      
      // Add Gaussian peaks
      prof.peaks.forEach(p => {
        const d = kev - p.kev;
        const peakHeight = p.amp * Math.exp(-(d * d) / (2 * 0.04));
        y -= peakHeight;
      });

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
    ctx.fill();

    // Draw peak labels
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    prof.peaks.forEach(p => {
      const px = (p.kev / 12) * W;
      const py = H - 8 - p.amp - 6;
      ctx.fillStyle = p.color;
      ctx.fillText(p.label, px, Math.max(12, py));
    });
  }

  /* =========================================================================
     4B. CHRONOLOGICAL PROVENANCE TIMELINE (1485 -> PRESENT)
     ========================================================================= */
  setupProvenanceTimeline() {
    this.provenancePanel = document.getElementById('provenance-hud-panel');
    const slider = document.getElementById('timeline-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.setProvenanceEpoch(val);
      });
    }
  }

  toggleProvenanceTimeline() {
    this.provenanceActive = !this.provenanceActive;
    if (this.provenancePanel) {
      this.provenancePanel.hidden = !this.provenanceActive;
      this.provenancePanel.setAttribute('aria-hidden', String(!this.provenanceActive));
    }
    const btn = document.getElementById('tool-timeline-btn');
    if (btn) {
      btn.classList.toggle('active', this.provenanceActive);
      btn.setAttribute('aria-pressed', String(this.provenanceActive));
    }
    const box = document.getElementById('timeline-slider-box');
    if (box) {
      box.style.display = this.provenanceActive ? 'inline-flex' : 'none';
    }

    if (this.audioDiagnostic) {
      this.audioDiagnostic.playEpochShift();
    }

    if (this.provenanceActive) {
      this.setProvenanceEpoch(this.currentEpochIndex);
    } else {
      // Restore the pre-timeline values snapshotted in updateProvenanceMaterials.
      if (this.active3DBook) {
        this.active3DBook.traverse((child) => {
          if (!child.isMesh || !child.material) return;
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            const base = mat && mat.userData && mat.userData.provenanceBase;
            if (!base) return;
            mat.color.setHex(base.color);
            if (base.roughness !== null && typeof mat.roughness === 'number') mat.roughness = base.roughness;
            if (base.metalness !== null && typeof mat.metalness === 'number') mat.metalness = base.metalness;
          });
        });
      }
    }
    return this.provenanceActive;
  }

  setProvenanceEpoch(idx) {
    this.currentEpochIndex = Math.max(0, Math.min(3, parseInt(idx, 10) || 0));

    const epochs = [
      {
        index: 0,
        year: '1485 CE',
        badge: '1485 · Incunabula',
        epochBadge: 'EPOCH I · 1485 CE',
        title: 'Venetian Renaissance Incunabula',
        seal: 'SEAL: ALDUS ✦ VERIFIED',
        location: 'Venice, Atelier of Aldus Manutius',
        physical: 'Pristine white alum-tawed pigskin binding, 24k mirror-burnished gold leaf fillet tooling, unblemished rag cotton paper, flexible split-leather sewing supports, pigskin clasps.',
        ph: 'pH 7.8 (Alkaline)',
        phPct: '85%',
        phColor: '#10b981',
        foxing: '0.0% (Pristine)',
        foxingPct: '0%',
        collagen: '98% (Supple)',
        collagenPct: '98%',
        leatherColor: 0x9e2e38,
        leatherRoughness: 0.32,
        leatherMetalness: 0.16,
        paperColor: 0xfffef5,
        goldColor: 0xffd700,
        goldMetalness: 0.95,
        goldRoughness: 0.18
      },
      {
        index: 1,
        year: '1620 CE',
        badge: '1620 · Monastic',
        epochBadge: 'EPOCH II · 1620 CE',
        title: 'Monastic Scriptorium Provenance',
        seal: 'SEAL: S. MARCI ✦ VERIFIED',
        location: 'Venice, Benedictine Monastery of San Marco',
        physical: 'Warm honey-amber vellum patina, faint iron gall oxidation halo along margin notes, calligraphic Latin provenance inscription ("Ex Bibliotheca S. Marci 1620"), subtle handling wear on board fore-edges.',
        ph: 'pH 6.8 (Neutral)',
        phPct: '70%',
        phColor: '#34d399',
        foxing: '4.2% (Early Patina)',
        foxingPct: '8%',
        collagen: '82% (Intact)',
        collagenPct: '82%',
        leatherColor: 0x7a2228,
        leatherRoughness: 0.44,
        leatherMetalness: 0.12,
        paperColor: 0xf5ecd5,
        goldColor: 0xd4af37,
        goldMetalness: 0.82,
        goldRoughness: 0.28
      },
      {
        index: 2,
        year: '1840 CE',
        badge: '1840 · Victorian',
        epochBadge: 'EPOCH III · 1840 CE',
        title: 'Victorian Bibliophile Rebind & Age Foxing',
        seal: 'CREST: LORD ELLESMERE',
        location: 'London, Private Gentlemen’s Library, Mayfair',
        physical: 'Period Victorian rebacked dark morocco spine with 5 raised cords, armorial gilt bookplate on front pastedown, prominent red-brown iron foxing bloom spots across outer margins caused by coal-smoke acidity.',
        ph: 'pH 5.2 (Acid Hydrolysis)',
        phPct: '42%',
        phColor: '#ef4444',
        foxing: '38.5% (Foxing Active)',
        foxingPct: '45%',
        collagen: '54% (Brittle)',
        collagenPct: '54%',
        leatherColor: 0x3d1a20,
        leatherRoughness: 0.58,
        leatherMetalness: 0.08,
        paperColor: 0xe8d4aa,
        goldColor: 0xa88434,
        goldMetalness: 0.65,
        goldRoughness: 0.42
      },
      {
        index: 3,
        year: 'Present Day',
        badge: 'Present · Archival',
        epochBadge: 'EPOCH IV · PRESENT DAY',
        title: 'Museum Conservation & Diagnostic Stage',
        seal: 'ARCHIVAL LAB ✦ CERTIFIED',
        location: 'Special Collections Conservation Science Atelier',
        physical: 'Stabilized binding with semi-translucent Japanese Kozo tissue spine hinge repair, Klucel G leather consolidation, acid-free buffered interleaving, barcode accession tag BA-INC-1485-01, climate-vault monitored.',
        ph: 'pH 6.6 (Deacidified Buffer)',
        phPct: '68%',
        phColor: '#10b981',
        foxing: '38.5% (Stabilized)',
        foxingPct: '38%',
        collagen: '76% (Consolidated)',
        collagenPct: '76%',
        leatherColor: 0x482026,
        leatherRoughness: 0.46,
        leatherMetalness: 0.11,
        paperColor: 0xf0e5cb,
        goldColor: 0xbfa048,
        goldMetalness: 0.75,
        goldRoughness: 0.32
      }
    ];

    const cur = epochs[this.currentEpochIndex];

    const slider = document.getElementById('timeline-slider');
    if (slider) slider.value = this.currentEpochIndex;
    const badgeEl = document.getElementById('timeline-slider-val');
    if (badgeEl) badgeEl.textContent = cur.badge;

    // Update Provenance HUD readouts
    const epochBadge = document.getElementById('provenance-epoch-badge');
    if (epochBadge) epochBadge.textContent = cur.epochBadge;
    const epochTitle = document.getElementById('provenance-epoch-title');
    if (epochTitle) epochTitle.textContent = cur.title;
    const seal = document.querySelector('.provenance-curator-seal');
    if (seal) seal.textContent = cur.seal;
    const loc = document.getElementById('provenance-location');
    if (loc) loc.textContent = cur.location;
    const phys = document.getElementById('provenance-physical');
    if (phys) phys.textContent = cur.physical;

    const phVal = document.getElementById('prov-ph-val');
    if (phVal) phVal.textContent = cur.ph;
    const phBar = document.getElementById('prov-ph-bar');
    if (phBar) { phBar.style.width = cur.phPct; phBar.style.backgroundColor = cur.phColor; }

    const foxVal = document.getElementById('prov-foxing-val');
    if (foxVal) foxVal.textContent = cur.foxing;
    const foxBar = document.getElementById('prov-foxing-bar');
    if (foxBar) foxBar.style.width = cur.foxingPct;

    const colVal = document.getElementById('prov-collagen-val');
    if (colVal) colVal.textContent = cur.collagen;
    const colBar = document.getElementById('prov-collagen-bar');
    if (colBar) colBar.style.width = cur.collagenPct;

    if (this.audioDiagnostic) {
      this.audioDiagnostic.playEpochShift();
    }

    // Morph Materials on Active 3D Book
    this.updateProvenanceMaterials(cur);
  }

  updateProvenanceMaterials(epoch) {
    if (!this.active3DBook) return;

    this.active3DBook.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      const name = (child.name || (child.parent && child.parent.name) || '').toLowerCase();

      mats.forEach(mat => {
        if (!mat || !mat.color) return;

        // Snapshot each untouched material once. These materials are shared
        // across meshes, so writing epoch values directly repainted the whole
        // specimen permanently; clones keep the restore intact.
        if (!mat.userData.provenanceBase) {
          mat.userData.provenanceBase = {
            color: mat.color.getHex(),
            roughness: typeof mat.roughness === 'number' ? mat.roughness : null,
            metalness: typeof mat.metalness === 'number' ? mat.metalness : null
          };
        }

        // Cover & spine leather
        if (name.includes('cover') || name.includes('board') || name.includes('spine')) {
          if (epoch.leatherColor) {
            mat.color.setHex(epoch.leatherColor);
            if (typeof mat.roughness === 'number') mat.roughness = epoch.leatherRoughness;
            if (typeof mat.metalness === 'number') mat.metalness = epoch.leatherMetalness;
          }
        }
        // Page block & text leaves
        else if (name.includes('page') || name.includes('leaf') || name.includes('quire') || name.includes('block')) {
          if (epoch.paperColor) {
            mat.color.setHex(epoch.paperColor);
          }
        }
        // Gold foil & brass toolings
        else if (name.includes('gilt') || name.includes('gold') || name.includes('fleuron') || name.includes('tooling')) {
          if (epoch.goldColor) {
            mat.color.setHex(epoch.goldColor);
            if (typeof mat.metalness === 'number') mat.metalness = epoch.goldMetalness;
            if (typeof mat.roughness === 'number') mat.roughness = epoch.goldRoughness;
          }
        }
      });
    });
  }

  /* =========================================================================
     4C. MICRO-HYDRATION SPOT TEST & CONTACT ANGLE POROSIMETRY (0.5 µL DI-H2O)
     ========================================================================= */
  setupHydrationTest() {
    this.hydrationPanel = document.getElementById('hydration-hud-panel');
    this.hydrationCanvas = document.getElementById('hydration-drop-canvas');
    if (this.hydrationCanvas) {
      this.hydrationCtx = this.hydrationCanvas.getContext('2d');
    }

    const blotBtn = document.getElementById('blot-hydration-btn');
    if (blotBtn) {
      blotBtn.addEventListener('click', () => {
        this.blotHydrationDroplet();
      });
    }

    if (this.mount) {
      this.mount.addEventListener('pointerdown', (e) => {
        if (!this.hydrationActive) return;
        const rect = this.mount.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          this.depositWaterDroplet(e.clientX, e.clientY);
        }
      });
    }
  }

  toggleHydrationTest() {
    this.hydrationActive = !this.hydrationActive;
    if (this.hydrationPanel) {
      this.hydrationPanel.hidden = !this.hydrationActive;
      this.hydrationPanel.setAttribute('aria-hidden', String(!this.hydrationActive));
    }
    const btn = document.getElementById('tool-hydration-btn');
    if (btn) {
      btn.classList.toggle('active', this.hydrationActive);
      btn.setAttribute('aria-pressed', String(this.hydrationActive));
    }

    if (this.audioDiagnostic) {
      this.audioDiagnostic.playPipetteTap();
    }

    if (this.hydrationActive) {
      this.drawDropletProfile(0, 79.4);
    } else {
      this.blotHydrationDroplet();
    }
    return this.hydrationActive;
  }

  depositWaterDroplet(clientX, clientY) {
    if (!this.hydrationActive || !this.specimenGroup) return;

    const rect = this.mount.getBoundingClientRect();
    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera({ x: ndcX, y: ndcY }, this.camera);

    const hits = this.raycaster.intersectObjects(this.specimenGroup.children, true);
    if (hits.length === 0) return;

    const hit = hits[0];
    const hitObj = hit.object;
    const name = (hitObj.name || (hitObj.parent && hitObj.parent.name) || '').toLowerCase();

    // Determine substrate profile
    let substrateTitle = 'Gelatin-Sized Rag Cotton Leaf (15th c.)';
    let sizingDesc = 'Capillary absorption rate: 0.038 mm/s. Gelatin sizing intact; high hydrophobic surface tension.';
    let initialAngle = 79.4;
    let finalAngle = 38.2;
    let friability = 'Stable (0% Bleed)';
    let friabilityColor = '#10b981';

    if (name.includes('cover') || name.includes('board') || name.includes('leather')) {
      substrateTitle = 'Full-Grain Goat Vellum Binding';
      sizingDesc = 'Dense collagen lipid matrix. High water repellency; contact angle remains steep.';
      initialAngle = 86.8;
      finalAngle = 64.0;
      friability = 'Resistant (Hydrophobic)';
      friabilityColor = '#38bdf8';
    } else if (name.includes('gilt') || name.includes('gold')) {
      substrateTitle = '24k Burnished Gold Leaf Tooling';
      sizingDesc = 'Impermeable metallic leaf barrier over rabbit-skin glue bole underlayer.';
      initialAngle = 92.5;
      finalAngle = 88.0;
      friability = 'Inert Surface';
      friabilityColor = '#fbbf24';
    }

    const subName = document.getElementById('hydration-substrate-name');
    if (subName) subName.textContent = substrateTitle;
    const subDesc = document.getElementById('hydration-sizing-desc');
    if (subDesc) subDesc.textContent = sizingDesc;
    const inkChip = document.getElementById('hydration-ink-chip');
    if (inkChip) {
      inkChip.textContent = `Ink Friability: ${friability}`;
      inkChip.style.color = friabilityColor;
      inkChip.style.borderColor = `${friabilityColor}88`;
      inkChip.style.background = `${friabilityColor}22`;
    }

    // Play synthesis sounds
    if (this.audioDiagnostic) {
      this.audioDiagnostic.playPipetteTap();
      setTimeout(() => { if (this.audioDiagnostic) this.audioDiagnostic.playWaterDrop(); }, 60);
      setTimeout(() => { if (this.audioDiagnostic) this.audioDiagnostic.playCapillaryHiss(); }, 120);
    }

    // Create 3D Droplet Mesh at hit location
    if (!this.hydrationDropletMesh) {
      const dropGeo = new THREE.SphereGeometry(0.016, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2);
      const dropMat = new THREE.MeshPhysicalMaterial({
        color: 0x93c5fd,
        roughness: 0.04,
        metalness: 0.08,
        transmission: 0.95,
        ior: 1.333,
        transparent: true,
        opacity: 0.88,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02
      });
      this.hydrationDropletMesh = new THREE.Mesh(dropGeo, dropMat);
      this.hydrationDropletMesh.name = 'hydrationDropletMesh';
      this.scene.add(this.hydrationDropletMesh);
    }

    this.hydrationDropletMesh.visible = true;
    const normal = hit.face ? hit.face.normal : new THREE.Vector3(0, 1, 0);
    this.hydrationDropletMesh.position.copy(hit.point).addScaledVector(normal, 0.002);
    this.hydrationDropletMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    this.hydrationDropletMesh.scale.set(1, 1, 1);

    // Start absorption animation loop
    this.hydrationDropletActive = true;
    this.hydrationStartTime = performance.now();
    const duration = 5000;

    const statusText = document.getElementById('hydration-status-text');
    if (statusText) statusText.textContent = 'ABSORBING · REAL-TIME CAPILLARY UPTAKE';

    if (this.hydrationRafId) cancelAnimationFrame(this.hydrationRafId);

    const animateAbsorption = () => {
      if (!this.hydrationDropletActive) return;
      const elapsed = performance.now() - this.hydrationStartTime;
      const progress = Math.min(1, elapsed / duration);

      const curAngle = initialAngle - (initialAngle - finalAngle) * progress;
      this.hydrationContactAngle = curAngle;

      if (this.hydrationDropletMesh) {
        const hScale = Math.max(0.12, 1 - progress * 0.85);
        const rScale = 1 + progress * 0.45;
        this.hydrationDropletMesh.scale.set(rScale, hScale, rScale);
      }

      this.drawDropletProfile(progress, curAngle);

      const timerChip = document.getElementById('hydration-timer-chip');
      if (timerChip) {
        const remaining = Math.max(0, ((duration - elapsed) / 1000)).toFixed(1);
        timerChip.textContent = progress < 1 ? `Uptake: ${remaining}s Remaining` : 'Status: Absorbed / Equilibrium';
      }

      if (progress < 1) {
        this.hydrationRafId = requestAnimationFrame(animateAbsorption);
      } else {
        if (statusText) statusText.textContent = 'DIAGNOSTIC COMPLETE · BLOT OR SCAN AGAIN';
      }
    };

    this.hydrationRafId = requestAnimationFrame(animateAbsorption);
  }

  drawDropletProfile(progress, currentAngle = 79.4) {
    if (!this.hydrationCanvas || !this.hydrationCtx) return;
    const ctx = this.hydrationCtx;
    const W = this.hydrationCanvas.width;
    const H = this.hydrationCanvas.height;

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(14, 165, 233, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    const baseY = H - 24;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(12, baseY);
    ctx.lineTo(W - 12, baseY);
    ctx.stroke();

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let i = 20; i < W - 20; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, baseY);
      ctx.lineTo(i + (i % 5) - 2, baseY + 12);
      ctx.stroke();
    }

    const cx = W / 2;
    const radius = 48 + progress * 16;
    const height = Math.max(8, 42 - progress * 26);
    
    ctx.beginPath();
    ctx.moveTo(cx - radius, baseY);
    ctx.quadraticCurveTo(cx, baseY - height * 2.1, cx + radius, baseY);
    ctx.closePath();

    const grad = ctx.createLinearGradient(cx, baseY - height * 2, cx, baseY);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
    grad.addColorStop(1, 'rgba(14, 165, 233, 0.22)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx - radius * 0.35, baseY - height * 1.3, 8, 4, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();

    const rad = (currentAngle * Math.PI) / 180;
    const tangentLen = 38;
    const tx = (cx - radius) + Math.cos(rad) * tangentLen;
    const ty = baseY - Math.sin(rad) * tangentLen;

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx - radius, baseY);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(cx - radius, baseY, 16, 0, -rad, true);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    const angleVal = document.getElementById('hydration-angle-val');
    if (angleVal) angleVal.textContent = `θ = ${currentAngle.toFixed(1)}°`;
  }

  blotHydrationDroplet() {
    this.hydrationDropletActive = false;
    if (this.hydrationRafId) {
      cancelAnimationFrame(this.hydrationRafId);
      this.hydrationRafId = null;
    }

    if (this.audioDiagnostic) {
      this.audioDiagnostic.playPipetteTap();
    }

    if (this.hydrationDropletMesh) {
      this.hydrationDropletMesh.visible = false;
    }

    const timerChip = document.getElementById('hydration-timer-chip');
    if (timerChip) {
      timerChip.textContent = 'Moisture Blotted & Stabilized';
      timerChip.style.color = '#10b981';
      timerChip.style.borderColor = '#10b98188';
      timerChip.style.background = '#10b98122';
    }

    const statusText = document.getElementById('hydration-status-text');
    if (statusText) statusText.textContent = 'BLOTTED · READY FOR NEW DROPLET TEST';

    this.drawDropletProfile(1, 0);
  }

  applyClipping(enabled) {
    if (!this.specimenGroup) return;
    this.specimenGroup.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (!mat) return;
        mat.clippingPlanes = enabled ? [this.clipPlane] : null;
        mat.needsUpdate = true;
      });
    });
  }

  zoom(direction) {
    const z = THREE.MathUtils.clamp(
      this.camera.position.z + direction * 0.55,
      1.4,
      6.0
    );
    this.tweenCamera(
      { x: this.camera.position.x, y: this.camera.position.y, z },
      this.controls ? this.controls.target : this.homeTarget,
      0.45
    );
  }

  resetCamera() {
    this.stopTour();
    this.clearHotspotSelection();
    this.exploded = false;
    this.explodeTarget = 0;
    this.explodeAmount = 0;
    this.sectionOn = false;
    this._sectionTween = null;
    this.applyClipping(false);
    this.setViewMode('normal');
    this.currentLayerIndex = -1;

    if (this.compareActive) {
      this.setCompare(null);
    }

    if (this.provenanceActive) {
      this.toggleProvenanceTimeline();
    }
    if (this.hydrationActive) {
      this.toggleHydrationTest();
    }
    this.blotHydrationDroplet();

    // "Inspect Binding" replaces the specimen with a single book. Reset must rebuild
    // the specimen, otherwise Reset leaves the viewer stranded in inspection mode.
    if (this.active3DBook && this.currentSpecimenData) {
      const vol = this.currentSpecimenData;
      this.active3DBook = null;
      this.loadBookSpecimen(vol);
      if (this.compareActive && this.compareSpecimenData) {
        this.setCompare(this.compareSpecimenData);
      }
      return;
    }

    // Showcase opened with no volume context (open3DBookShowcase): exit the
    // showcase instead of leaving stale book state behind.
    if (this.active3DBook) {
      this.close3DBookShowcase();
      this.tweenCamera(this.homeCamera, this.homeTarget, 0.8);
      return;
    }

    if (this.specimenGroup) {
      this.specimenGroup.traverse((c) => { c.visible = true; });
      this.specimenGroup.rotation.set(0, 0, 0);
    }

    this.tweenCamera(this.homeCamera, this.homeTarget, 0.8);
  }

  toggleAutoRotate(enable) {
    this.autoRotateWanted = enable;
    if (this.controls) {
      this.controls.autoRotate = enable && !this.selectedHotspotId;
    }
  }

  /** Exit a single-book showcase, freeing its scene and clearing book state. */
  close3DBookShowcase() {
    this.activeBookOpenTween = null;
    this.activeBookPageTween = null;
    this.activeBookOpenAmount = 0;
    this.activeBookPageFlip = 0;
    this.active3DBook = null;
    this.clearSpecimenGroup();
    this.createHotspotOverlay();
  }

  /* =========================================================================
     7. 3D HOTSPOT PINS & CALLOUT FOCUS
     ========================================================================= */
  createHotspotOverlay() {
    if (!this.overlay) return;
    // Remove only this overlay's pins: the overlay is a shared node that also
    // holds the shelf tooltip, which a wholesale innerHTML = '' detached.
    Array.from(this.overlay.querySelectorAll('.hotspot-pin')).forEach((pin) => pin.remove());
    this.hotspotElements = [];

    this.hotspots.forEach((hs) => {
      const pinBtn = document.createElement('button');
      pinBtn.type = 'button';
      pinBtn.className = 'hotspot-pin';
      pinBtn.dataset.hotspotId = hs.id;
      pinBtn.setAttribute('aria-label', `${hs.name} — Study this feature`);
      pinBtn.setAttribute('tabindex', '0');
      pinBtn.innerHTML = `
        <span class="pin-pulse"></span>
        <span class="pin-dot"></span>
        <div class="hotspot-tooltip">
          <strong></strong>
          <span></span>
        </div>
      `;
      // Tooltip content is data-derived: insert as text, never as markup.
      const tipName = pinBtn.querySelector('.hotspot-tooltip strong');
      const tipDesc = pinBtn.querySelector('.hotspot-tooltip span');
      if (tipName) tipName.textContent = hs.name;
      if (tipDesc) tipDesc.textContent = hs.desc;

      pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.focusHotspot(hs.id, { openLesson: true });
      });
      pinBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.focusHotspot(hs.id, { openLesson: true });
        }
      });
      pinBtn.addEventListener('pointerenter', () => {
        pinBtn.classList.add('is-hover');
        if (this.mount) this.mount.style.cursor = 'pointer';
      });
      pinBtn.addEventListener('pointerleave', () => {
        pinBtn.classList.remove('is-hover');
        if (this.mount) this.mount.style.cursor = '';
      });

      this.overlay.appendChild(pinBtn);
      this.hotspotElements.push({
        element: pinBtn,
        position: hs.position,
        id: hs.id,
        hotspot: hs
      });
    });
  }

  updateHotspotPositions() {
    if (!this.camera || !this.hotspotElements.length) return;

    const groupOffset = this.specimenGroup ? this.specimenGroup.position : null;
    const ox = groupOffset ? groupOffset.x : 0;
    const oy = groupOffset ? groupOffset.y : 0;
    const oz = groupOffset ? groupOffset.z : 0;
    const vec = this._scratchVec;

    this.hotspotElements.forEach((item) => {
      const p = item.position;
      vec.set(p[0] + ox, p[1] + oy, p[2] + oz);
      vec.project(this.camera);

      const x = (vec.x * 0.5 + 0.5) * this.width;
      const y = (-(vec.y * 0.5) + 0.5) * this.height;

      // Skip style writes when nothing moved — these force layout on every frame.
      if (item.lastX !== x) { item.element.style.left = `${x}px`; item.lastX = x; }
      if (item.lastY !== y) { item.element.style.top = `${y}px`; item.lastY = y; }

      const behind = vec.z > 1.0;
      const isSelected = item.id === this.selectedHotspotId;

      if (item.lastBehind !== behind) {
        item.element.style.display = behind ? 'none' : 'block';
        item.lastBehind = behind;
      }
      const opacity = behind ? '0' : (isSelected ? '1' : '0.94');
      if (item.lastOpacity !== opacity) {
        item.element.style.opacity = opacity;
        item.lastOpacity = opacity;
      }
      if (item.lastSelected !== isSelected) {
        item.element.classList.toggle('is-selected', isSelected);
        item.lastSelected = isSelected;
      }
    });

    this.positionCallout();
  }

  attachCallout(el) {
    this.calloutEl = el;
  }

  positionCallout() {
    if (!this.calloutEl || !this.selectedHotspotId) return;
    const item = this.hotspotElements.find((h) => h.id === this.selectedHotspotId);
    if (!item) return;

    const groupOffset = this.specimenGroup ? this.specimenGroup.position : null;
    const p = item.position;
    const vec = this._scratchVecB;
    vec.set(
      p[0] + (groupOffset ? groupOffset.x : 0),
      p[1] + (groupOffset ? groupOffset.y : 0),
      p[2] + (groupOffset ? groupOffset.z : 0)
    );
    vec.project(this.camera);

    if (vec.z > 1) {
      if (this.calloutEl.dataset.behind !== 'true') this.calloutEl.dataset.behind = 'true';
      return;
    }

    const x = (vec.x * 0.5 + 0.5) * this.width;
    const y = (-(vec.y * 0.5) + 0.5) * this.height;

    const tx = `${Math.round(x)}px`;
    const ty = `${Math.round(y)}px`;
    if (this._calloutX !== x || this._calloutY !== y) {
      this.calloutEl.style.transform = `translate3d(${tx}, ${ty}, 0)`;
      this._calloutX = x;
      this._calloutY = y;
    }
    const side = x > this.width * 0.58 ? 'left' : 'right';
    if (this.calloutEl.dataset.side !== side) this.calloutEl.dataset.side = side;
    if (this.calloutEl.dataset.behind !== 'false') this.calloutEl.dataset.behind = 'false';
  }

  focusHotspot(id, { openLesson = false } = {}) {
    const hs = this.hotspots.find((h) => h.id === id);
    if (!hs || !hs.position) return;

    if (this.selectedHotspotId === id && !openLesson) {
      this.clearHotspotSelection();
      return;
    }

    this.selectedHotspotId = id;
    this._interactionUntil = performance.now() + 4200;

    const groupOffset = this.specimenGroup ? this.specimenGroup.position.x : 0;
    const [px, py, pz] = hs.position;
    const camPos = {
      x: (px + groupOffset) * 1.45 + 0.30,
      y: py * 1.15 + 0.48,
      z: Math.max(2.1, Math.abs(pz) * 1.7 + 2.15)
    };

    const targetPos = { x: px + groupOffset, y: py, z: pz };
    this.tweenCamera(camPos, targetPos, 0.85);

    if (this.onHotspotSelect) this.onHotspotSelect(hs);
    if (openLesson && typeof window.showHotspotLesson === 'function') {
      setTimeout(() => window.showHotspotLesson(hs), 350);
    }
  }

  clearHotspotSelection() {
    this.selectedHotspotId = null;
    if (this.onHotspotSelect) this.onHotspotSelect(null);
  }

  /* =========================================================================
     8. GUIDED SPECIMEN TOUR & ANIMATION LOOP
     ========================================================================= */
  playTour() {
    if (!this.hotspots.length) return false;
    if (this.tourActive) {
      this.stopTour();
      return false;
    }
    this.tourActive = true;
    this.tourIndex = 0;
    this.tourTimer = 0;
    this.focusHotspot(this.hotspots[0].id, { openLesson: false });
    if (this.onTourProgress) {
      this.onTourProgress({ index: 0, total: this.hotspots.length, active: true, hotspot: this.hotspots[0] });
    }
    return true;
  }

  stopTour(silent) {
    const was = this.tourActive;
    this.tourActive = false;
    this.tourIndex = 0;
    this.tourTimer = 0;
    if (this.onTourProgress) {
      this.onTourProgress({ index: 0, total: this.hotspots.length, active: false, hotspot: null });
    }
    if (was && !silent && this.onTourEnd) this.onTourEnd();
  }

  tweenCamera(toPos, toTarget, duration = 0.8) {
    if (this.prefersReducedMotion) {
      this.camera.position.set(toPos.x, toPos.y, toPos.z);
      if (this.controls) this.controls.target.set(toTarget.x, toTarget.y, toTarget.z);
      this.camTween = null;
      return;
    }

    const fromPos = this.camera.position.clone();
    const fromTarget = this.controls
      ? this.controls.target.clone()
      : new THREE.Vector3(0, 0, 0);

    this.camTween = {
      t: 0,
      duration: Math.max(0.05, duration),
      fromPos,
      toPos: new THREE.Vector3(toPos.x, toPos.y, toPos.z),
      fromTarget,
      toTarget: new THREE.Vector3(toTarget.x, toTarget.y, toTarget.z)
    };
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  onKeyDown(e) {
    // Canvas shortcuts must not fire while any dialog is open.
    const openDialog = document.querySelector(
      '.modal-backdrop.open, .feature-page.open, .folio-reader-modal.open'
    );
    if (openDialog) return;

    if (e.key === 'ArrowLeft' && this.specimenGroup) this.specimenGroup.rotation.y -= 0.12;
    if (e.key === 'ArrowRight' && this.specimenGroup) this.specimenGroup.rotation.y += 0.12;
    if (e.key === '+' || e.key === '=') this.zoom(-1);
    if (e.key === '-' || e.key === '_') this.zoom(1);
    if (e.key === 'Escape') {
      this.clearHotspotSelection();
      this.stopTour();
    }
    if (e.key === 'l' || e.key === 'L') {
      this.toggleLayers();
    }
  }

  setTheme(theme) {
    this._theme = theme === 'dark' ? 'dark' : 'light';
    if (!this.scene) return;

    const bg = this._theme === 'dark' ? 0x161210 : 0xf7f0e7;
    this.scene.background = new THREE.Color(bg);

    this.scene.traverse((obj) => {
      if (obj.name === 'ambientLight') {
        obj.intensity = this._theme === 'dark' ? 0.55 : 0.95;
        obj.color.setHex(this._theme === 'dark' ? 0xc8bcaa : 0xfff6ec);
      }
      if (obj.name === 'keySpot') {
        obj.intensity = this._theme === 'dark' ? 1.8 : 2.6;
      }
      if (obj.name === 'fillLight') {
        obj.intensity = this._theme === 'dark' ? 0.55 : 0.85;
      }
      if (obj.name === 'rimLight') {
        obj.intensity = this._theme === 'dark' ? 0.65 : 0.95;
      }
    });

    if (this.dust && this.dust.material) {
      this.dust.material.opacity = this._theme === 'dark' ? 0.14 : 0.25;
    }

    if (this.renderer) {
      this.renderer.toneMappingExposure = this._theme === 'dark' ? 1.06 : 1.18;
    }
  }

  handleResize() {
    if (!this.mount || !this.camera || !this.renderer) return;
    const w = this.mount.clientWidth;
    const h = this.mount.clientHeight;
    if (w <= 10 || h <= 10) {
      // Hidden or zero-sized mount (the specimen container ships display:none).
      // Retry a bounded number of times: rescheduling unconditionally spun a
      // permanent rAF loop doing layout reads every frame.
      if (this._resizeRetryId) cancelAnimationFrame(this._resizeRetryId);
      this._resizeRetries = (this._resizeRetries || 0) + 1;
      if (this._resizeRetries > 10) return;
      this._resizeRetryId = requestAnimationFrame(() => this.handleResize());
      return;
    }
    this._resizeRetries = 0;
    if (this._resizeRetryId) { cancelAnimationFrame(this._resizeRetryId); this._resizeRetryId = null; }
    if (w === this.width && h === this.height) return;
    this.width = w;
    this.height = h;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  /* =========================================================================
     9. INTERACTIVE 3D PHYSICAL BOOK SPECIMEN & BINDING VIEWER
     ========================================================================= */
  open3DBookShowcase(bookData) {
    if (!bookData) return null;
    this.stopTour(true);
    this.clearHotspotSelection();
    this.exploded = false;
    this.explodeTarget = 0;
    this.explodeAmount = 0;
    this.sectionOn = false;
    this._sectionTween = null;
    this.currentViewMode = 'normal';
    this.active3DBook = null;

    this.clearSpecimenGroup();

    this.specimenGroup = new THREE.Group();
    this.specimenGroup.name = '3DBookShowcaseGroup';
    this.scene.add(this.specimenGroup);

    // Build the master physical book with articulated anatomical assemblies
    const bookMesh = this.createReal3DBookMesh(bookData, {
      mode: 'showcase',
      width: 0.44,
      height: 0.60,
      thickness: 0.125,
      isPrimary: true
    });
    bookMesh.position.set(0, 0.08, 0);
    this.specimenGroup.add(bookMesh);
    this.active3DBook = bookMesh;
    this.activeBookOpenAmount = 0;
    this.activeBookPageFlip = 0;

    // Contact shadow on plinth
    const shadowGeo = new THREE.PlaneGeometry(0.85, 0.85);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: this.createContactShadowTexture(),
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -0.22, 0);
    this.specimenGroup.add(shadowMesh);

    // Build Diagnostic Telemetry Badges for book anatomical parts
    if (bookMesh.userData.anatomicalParts) {
      this.buildTelemetryBadges(bookMesh.userData.anatomicalParts);
    }

    // Frame camera for 3D book inspection
    this.tweenCamera(
      { x: 0.22, y: 0.32, z: 1.85 },
      { x: 0, y: 0.05, z: 0 },
      0.85
    );

    // Overlay hotspots for physical library binding features
    this.hotspots = [
      {
        id: 'binding-tooling', name: '24k Gold-Tooled Morocco Binding', position: [0.15, 0.25, 0.12],
        desc: 'Hand-bound in rich morocco leather with 24-karat gold fillet borders and corner fleurons.',
        lesson: 'Gold tooling is applied hot into damp leather with filled brass tools. Real gold leaf is beaten thinner than human hair, then laid and burnished — the tooling is decorative, not structural.',
        quiz: {
          question: 'Why must gold tooling be applied to a damp leather cover?',
          options: ['Damp leather is soft enough to take the impression of hot brass tools', 'Damp leather dissolves the gold leaf so it bonds chemically', 'Leather must be wet to keep the gold from tarnishing', 'Humidity makes the glue used for the endpapers stronger'],
          correct: 0,
          explanation: 'Morocco leather is vegetable-tanned and still contains natural oils. Wetting swells the fibres and softens them so a heated, gold-filled brass tool presses a clean impression without cracking the grain.'
        }
      },
      {
        id: 'raised-ribs', name: '5 Raised Leather Spine Bands', position: [-0.22, 0.12, 0.0],
        desc: 'Traditional structural sewing hubs protecting the sewn linen thread gatherings.',
        lesson: 'Convex "sewing supports" are glued to the boards before sewing. As the linen thread is pulled tight it cinches against the support, swelling it into a raised rib. These ribs absorb the strain of opening so the cords do not cut through the spine.',
        quiz: {
          question: 'What is the structural purpose of raised bands on a traditional binding?',
          options: ['They let the cords seat and spread the pull of sewing across a wider area of the spine', 'They are purely decorative ridges imitating an older style', 'They mark where the book block begins and ends', 'They hold the endpapers in place with glue'],
          correct: 0,
          explanation: 'Sewing supports (often millboard or alum-tawed skin) are glued to the boards. The thread pulls the supports outward, forming ribs. The ridges distribute tension so the linen threads are not cut off at the fold.'
        }
      },
      {
        id: 'call-label', name: 'Archival Call Number Label', position: [-0.18, -0.25, 0.0],
        desc: 'Crisp printed paper label indicating relative location and Cutter classification.',
        lesson: 'The label carries the full call number, normally as main class, decimal, and Cutter. Even after the book moves, the label travels with it — which is exactly what makes relative location work. Libraries have largely moved to barcode labels, but the call number remains the human-readable location key.',
        quiz: {
          question: 'In a relative-location system, why must a call number be permanently attached to the volume?',
          options: ['Because a volume can be reshelved anywhere, so the label is the only thing that still records its address', 'Because call numbers determine the order in which books are circulated', 'Because the call number is what the catalogue searches by title', 'Because labels prevent books from being misplaced by patrons'],
          correct: 0,
          explanation: 'A book may leave for repair, be reshelved, or move to a different branch. Its call number is the only durable record of where it belongs, which is the entire premise of relative location.'
        }
      },
      {
        id: 'gilded-edges', name: 'Burnished Gold-Leaf Edging', position: [0.22, -0.15, 0.0],
        desc: 'Metallic gold gilding on the 3-sided page block preventing dust and UV degradation.',
        lesson: 'The fore-edge and head are gilded so dust and dirt cannot settle into the page edges, and the reflective leaf throws light back under the text. Because gold tarnishes with sulfur, alkaline buffer is not used here; a thin lacquer is applied instead.',
        quiz: {
          question: 'Why is a lacquer applied over gilded page edges instead of an alkaline buffering treatment?',
          options: ['Alkaline buffer would react with the gold leaf and cause it to tarnish', 'Buffer cannot be applied to the edge of a book block', 'Lacquer makes the pages waterproof and is the only moisture protection', 'Gold leaf requires a pH-neutral rather than alkaline environment'],
          correct: 0,
          explanation: 'Calcium carbonate and magnesium carbonate buffers are alkaline and will react with gold leaf, accelerating tarnishing. Gilded edges are therefore protected with a clear lacquer or a glassine flap instead.'
        }
      },
      {
        id: 'silk-bookmark', name: 'Woven Silk Ribbon & Headbands', position: [0.18, -0.32, 0.05],
        desc: 'Two-tone silk endbands securing the spine core with satin bookmark.',
        lesson: 'Endbands are worked over a core at the head and tail of the spine to close the cover and keep the spine profile from fraying. Bookmarks are a later commercial addition: silk and ribbon markers became common once books were being sold by the page rather than bound to order.',
        quiz: {
          question: 'What is the actual function of a woven endband at the head and tail of a book?',
          options: ['To close off and stabilise the ends of the spine sewing', 'To mark the reader\'s place in the text', 'To decorate the binding where the cover meets the spine', 'To attach the bookmark ribbon to the cover boards'],
          correct: 0,
          explanation: 'Endbands (or "headbands") are woven over a core at the head and tail, tying the spine sewing closed and stopping the spine ends from fraying. A separate ribbon is a marker, not a structural part.'
        }
      }
    ];
    this.createHotspotOverlay();

    if (this.plinthGroup) this.plinthGroup.visible = true;
    return bookMesh;
  }

  toggleActiveCoverOpen() {
    if (!this.active3DBook) return false;
    const target = this.activeBookOpenAmount > 0.5 ? 0 : 1;
    this.activeBookOpenTween = {
      from: this.activeBookOpenAmount,
      to: target,
      t: 0,
      duration: 0.75
    };
    return target === 1;
  }

  flipActive3DPage() {
    if (!this.active3DBook) return false;
    const target = this.activeBookPageFlip > 0.5 ? 0 : 1;
    this.activeBookPageTween = {
      from: this.activeBookPageFlip,
      to: target,
      t: 0,
      duration: 0.65
    };
    return target === 1;
  }

  /* =========================================================================
     10. MULTISPECTRAL DIAGNOSTIC WAVELENGTH MODES (Visible / UV / IR / X-Ray)
     ========================================================================= */
  setWavelengthMode(mode) {
    this.wavelengthMode = mode;
    if (this.audioDiagnostic) {
      this.audioDiagnostic.playSpectralChime(mode);
    }

    const ambientLight = this.scene.getObjectByName('ambientLight');
    const keySpot = this.scene.getObjectByName('keySpot');
    const fillLight = this.scene.getObjectByName('fillLight');
    const rimLight = this.scene.getObjectByName('rimLight');

    if (mode === 'uv') {
      // 365nm UV Fluorescence: Deep Indigo & Ultraviolet Spot
      if (ambientLight) { ambientLight.color.setHex(0x180d32); ambientLight.intensity = 0.85; }
      if (keySpot) { keySpot.color.setHex(0x6b2cf5); keySpot.intensity = 3.6; }
      if (fillLight) { fillLight.color.setHex(0x00f0ff); fillLight.intensity = 1.4; }
      if (rimLight) { rimLight.color.setHex(0x00ff88); rimLight.intensity = 1.2; }
    } else if (mode === 'infrared') {
      // 940nm Infrared Reflectography: Monochromatic High-Contrast Penetration
      if (ambientLight) { ambientLight.color.setHex(0x282828); ambientLight.intensity = 0.95; }
      if (keySpot) { keySpot.color.setHex(0xf5f5f5); keySpot.intensity = 2.4; }
      if (fillLight) { fillLight.color.setHex(0xd0d0d0); fillLight.intensity = 1.1; }
      if (rimLight) { rimLight.color.setHex(0xffffff); rimLight.intensity = 1.2; }
    } else if (mode === 'xray') {
      // Electron X-Ray Tomography: Cyan Laser Halo
      if (ambientLight) { ambientLight.color.setHex(0x001d2c); ambientLight.intensity = 0.95; }
      if (keySpot) { keySpot.color.setHex(0x00e5ff); keySpot.intensity = 3.8; }
      if (fillLight) { fillLight.color.setHex(0x0088b3); fillLight.intensity = 1.5; }
      if (rimLight) { rimLight.color.setHex(0xffffff); rimLight.intensity = 1.5; }
    } else {
      // Visible Spectrum: Natural Warm Museum Lighting
      const isDark = this._theme === 'dark';
      if (ambientLight) { ambientLight.color.setHex(isDark ? 0xc8bcaa : 0xfff6ec); ambientLight.intensity = isDark ? 0.55 : 0.95; }
      if (keySpot) { keySpot.color.setHex(0xfff5ea); keySpot.intensity = isDark ? 1.8 : 2.6; }
      if (fillLight) { fillLight.color.setHex(0xffecd6); fillLight.intensity = isDark ? 0.55 : 0.85; }
      if (rimLight) { rimLight.color.setHex(0xd4e4f7); rimLight.intensity = isDark ? 0.65 : 0.95; }
    }

    if (this.specimenGroup) {
      this.specimenGroup.traverse((child) => {
        if (!child.isMesh) return;
        if (child.name === 'contactShadow' || child.name.includes('shadow') || child.name.includes('Shadow') || (child.geometry && child.geometry.type === 'PlaneGeometry' && child.position.y < -0.20)) return;
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }

        // Free the previous wavelength-mode material set before minting a new
        // one — this runs on every call, not only on mode change, so repeated
        // selections of the same mode cannot leak a set either.
        if (child.userData.wavelengthMaterials) {
          child.userData.wavelengthMaterials.forEach((m) => m.dispose());
          child.userData.wavelengthMaterials = null;
        }

        if (mode === 'xray') {
          const isStructural = child.name === 'spineAssembly' ||
            (child.parent && child.parent.name === 'spineAssembly') ||
            (child.parent && child.parent.name === 'endbandsGroup') ||
            child.name === 'raisedCords' ||
            child.geometry.type === 'CylinderGeometry';

          if (isStructural) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: 0x00e5ff,
              emissiveIntensity: 2.2,
              roughness: 0.15
            });
          } else {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x112836,
              roughness: 0.35,
              metalness: 0.15,
              transparent: true,
              opacity: 0.38,
              depthWrite: false
            });
          }
        } else if (mode === 'uv') {
          // 365nm UV Fluorescence:
          // Paper textblock leaves fluoresce pale greenish-ivory
          // Leather boards absorb UV, glowing very faint deep organic violet
          const isPaper = child.name.includes('quire') ||
            child.name.includes('leaf') ||
            child.name.includes('page') ||
            child.name === 'quireFront' ||
            child.name === 'quireCenter' ||
            child.name === 'quireRear';

          if (isPaper) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x223632,
              emissive: 0x4ade80,
              emissiveIntensity: 0.38,
              roughness: 0.65,
              metalness: 0.05
            });
          } else {
            // Leather binding boards & spine
            child.material = new THREE.MeshStandardMaterial({
              color: 0x181022,
              emissive: 0x3b1458,
              emissiveIntensity: 0.18,
              roughness: 0.52,
              metalness: 0.12
            });
          }
        } else if (mode === 'infrared') {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xf5f0e6,
            roughness: 0.88,
            metalness: 0.02
          });
        } else {
          child.material = child.userData.originalMaterial;
        }

        // Track freshly minted mode materials so the next call can free them.
        if (mode !== 'visible' && child.material !== child.userData.originalMaterial) {
          const current = Array.isArray(child.material) ? child.material : [child.material];
          current.forEach((m) => { m.userData.isWavelengthMaterial = true; });
          child.userData.wavelengthMaterials = current;
        }
      });
    }

    return mode;
  }

  /* =========================================================================
     11. CINEMATIC IN-WORLD CAMERA SWOOP TRANSITIONS
     ========================================================================= */
  performEntrySwoop(onComplete) {
    if (this.audioDiagnostic) {
      this.audioDiagnostic.playServo(0.85, 1);
    }
    this.camera.position.set(0, 1.45, 4.2);
    if (this.controls) {
      this.controls.target.set(0, 0, 0);
    }
    this.tweenCamera(
      { x: this.homeCamera.x, y: this.homeCamera.y, z: this.homeCamera.z },
      this.homeTarget,
      0.85
    );
    setTimeout(() => {
      if (typeof onComplete === 'function') onComplete();
    }, 850);
  }

  performExitSwoop(onComplete) {
    if (this.audioDiagnostic) {
      this.audioDiagnostic.playServo(0.65, -1);
    }
    this.tweenCamera(
      { x: 0, y: 1.45, z: 4.2 },
      { x: 0, y: 0, z: 0 },
      0.65
    );
    setTimeout(() => {
      if (typeof onComplete === 'function') onComplete();
    }, 650);
  }

  animate() {
    if (!this._running || !this.renderer) {
      this._loopStarted = false;
      return;
    }
    this._rafId = requestAnimationFrame(() => this.animate());

    const delta = this.clock ? Math.min(this.clock.getDelta(), 0.05) : 0.016;
    const now = performance.now();
    const reduceMotion = this.prefersReducedMotion;

    // 1. Camera Tweening
    if (this.camTween) {
      this.camTween.t += delta / this.camTween.duration;
      const k = this.easeOutCubic(Math.min(1, this.camTween.t));
      this.camera.position.lerpVectors(this.camTween.fromPos, this.camTween.toPos, k);
      if (this.controls) {
        this.controls.target.lerpVectors(this.camTween.fromTarget, this.camTween.toTarget, k);
      }
      if (this.camTween.t >= 1) this.camTween = null;
    }

    // 2. Active 3D Book Cover Open Tween
    if (this.activeBookOpenTween && this.active3DBook) {
      this.activeBookOpenTween.t += delta / this.activeBookOpenTween.duration;
      const k = this.easeOutCubic(Math.min(1, this.activeBookOpenTween.t));
      this.activeBookOpenAmount = this.activeBookOpenTween.from + (this.activeBookOpenTween.to - this.activeBookOpenTween.from) * k;
      if (typeof this.active3DBook.setOpenAmount === 'function') {
        this.active3DBook.setOpenAmount(this.activeBookOpenAmount);
      }
      if (this.activeBookOpenTween.t >= 1) this.activeBookOpenTween = null;
    }

    // 3. Active 3D Book Page Flip Tween
    if (this.activeBookPageTween && this.active3DBook) {
      this.activeBookPageTween.t += delta / this.activeBookPageTween.duration;
      const k = this.easeOutCubic(Math.min(1, this.activeBookPageTween.t));
      this.activeBookPageFlip = this.activeBookPageTween.from + (this.activeBookPageTween.to - this.activeBookPageTween.from) * k;
      if (typeof this.active3DBook.setPageFlip === 'function') {
        this.active3DBook.setPageFlip(this.activeBookPageFlip);
      }
      if (this.activeBookPageTween.t >= 1) this.activeBookPageTween = null;
    }

    // 4. Specimen intro scale-in
    if (this._intro && this.specimenGroup) {
      if (reduceMotion) {
        this._intro.t = 1;
      } else {
        this._intro.t += delta / this._intro.duration;
      }
      const k = this.easeOutCubic(Math.min(1, this._intro.t));
      const end = this._displayScale || 1.05;
      const s = 0.5 + (end - 0.5) * k;
      this.specimenGroup.scale.setScalar(s);
      this.specimenGroup.position.z = -0.45 * (1 - k);
      this.specimenGroup.position.y = 0.02;
      if (this._intro.t >= 1) this._intro = null;
    }

    // 5. Dynamic Laser Sweep Oscillating Beam
    if (this.laserSweepMesh && this.laserSweepFan && !reduceMotion) {
      const sweepX = Math.sin(now * 0.0018) * 0.46;
      this.laserSweepMesh.position.x = sweepX;
      this.laserSweepFan.position.x = sweepX;
      const sweepPulse = 0.55 + 0.3 * Math.sin(now * 0.004);
      this.laserSweepMesh.material.opacity = sweepPulse;
      this.laserSweepFan.material.opacity = sweepPulse * 0.55;
    }

    // 6. Holographic Exploded Anatomy Disassembly & Calipers
    if (!reduceMotion) {
      this.explodeAmount += (this.explodeTarget - this.explodeAmount) * Math.min(1, delta * 6.5);
    } else {
      this.explodeAmount = this.explodeTarget;
    }

    // Mechanical Latch Audio Click Detection
    if (this.explodeTarget === 0 && this.explodeAmount < 0.02 && this._wasExploded) {
      this._wasExploded = false;
      if (this.audioDiagnostic) this.audioDiagnostic.playLatchClick();
    } else if (this.explodeAmount > 0.15) {
      this._wasExploded = true;
    }

    // Animate Anatomical Parts
    if (this.active3DBook && this.active3DBook.userData.anatomicalParts) {
      const parts = this.active3DBook.userData.anatomicalParts;
      parts.forEach((part) => {
        if (!part.object) return;
        part.object.position.lerpVectors(
          part.restPos,
          this._scratchVec.copy(part.restPos).add(part.explodeOffset),
          this.explodeAmount
        );
        if (part.explodeRot) {
          part.object.rotation.x = part.restRot.x + part.explodeRot.x * this.explodeAmount;
          part.object.rotation.y = part.restRot.y + part.explodeRot.y * this.explodeAmount;
          part.object.rotation.z = part.restRot.z + part.explodeRot.z * this.explodeAmount;
        }
      });

      this.updateCaliperLines(this.explodeAmount);
      this.updateTelemetryOverlay(this.explodeAmount);
    } else if (this.specimenGroup && Math.abs(this.explodeAmount) > 0.001) {
      const dir = this._explodeDir;
      this.specimenGroup.traverse((child) => {
        if (!child.isMesh || !child.userData.restPosition) return;
        const rest = child.userData.restPosition;
        dir.copy(rest);
        if (dir.lengthSq() < 0.0001) dir.set(0, 1, 0);
        else dir.normalize();
        child.position.copy(rest).addScaledVector(dir, this.explodeAmount * 0.38);
      });
    } else if (this.specimenGroup && this.explodeTarget === 0 && this.explodeAmount < 0.001) {
      this.specimenGroup.traverse((child) => {
        if (child.isMesh && child.userData.restPosition) {
          child.position.copy(child.userData.restPosition);
        }
      });
    }

    // 7. Cross-Section Sweep
    if (this._sectionTween) {
      if (reduceMotion) {
        this._sectionTween.t = 1;
      } else {
        this._sectionTween.t += delta / this._sectionTween.duration;
      }
      const k = this.easeOutCubic(Math.min(1, this._sectionTween.t));
      this.clipPlane.constant =
        this._sectionTween.from + (this._sectionTween.to - this._sectionTween.from) * k;
      if (this._sectionTween.t >= 1) this._sectionTween = null;
    }

    // 8. Guided Tour through Hotspots
    if (this.tourActive && this.hotspots.length) {
      this.tourTimer += delta;
      if (this.onTourProgress && now - this._lastTourEmit > 100) {
        this._lastTourEmit = now;
        const frac = (this.tourIndex + Math.min(1, this.tourTimer / 3.4)) / this.hotspots.length;
        this.onTourProgress({
          index: this.tourIndex,
          total: this.hotspots.length,
          active: true,
          progress: frac,
          hotspot: this.hotspots[this.tourIndex]
        });
      }
      if (this.tourTimer > 3.4) {
        this.tourTimer = 0;
        const next = this.tourIndex + 1;
        if (next >= this.hotspots.length) {
          this.stopTour();
        } else {
          this.tourIndex = next;
          this.focusHotspot(this.hotspots[this.tourIndex].id, { openLesson: false });
        }
      }
    }

    // 9. Auto-Rotate Handling
    if (this.controls) {
      const interacting = this._interactionUntil && now < this._interactionUntil;
      this.controls.autoRotate =
        !reduceMotion &&
        this.autoRotateWanted && !this.selectedHotspotId && !interacting && !this.tourActive && !this.compareActive && this.explodeAmount < 0.05;
      this.controls.update();
    }

    // 10. Atmosphere Dust Drift
    if (this.dust && !reduceMotion) {
      this.dust.rotation.y += delta * 0.035;
    }

    if (this.repositoryRing && this.specimenGroup && this.repositoryRing.parent) {
      this.repositoryRing.rotation.z += 0.008;
    }

    this.updateHotspotPositions();
    this.renderer.render(this.scene, this.camera);
  }
}

if (typeof window !== 'undefined') {
  window.ThreeBookViewer = ThreeBookViewer;
}
