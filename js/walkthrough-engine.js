// Biblio Atelier - High-Definition Cinematic Photorealistic Walkthrough Engine
// Integrates the approved visual environments directly into an interactive 3D spatial tour:
// - Station 0 (0.00): Grand Foyer Colonnade & Entrance Landing (assets/walkthrough/foyer.jpg?v=pure2)
// - Station 1 (0.25): Circulation Desk & Card Catalogue Wing (assets/walkthrough/circulation.jpg?v=pure2)
// - Station 2 (0.50): Grand Reading Hall - Quiet Sanctuary (assets/walkthrough/reading_room.jpg?v=pure2)
// - Station 3 (0.75): Book Bindery & Conservation Craft Lab (assets/walkthrough/bindery.jpg?v=pure2)
// - Station 4 (1.00): Rare Book Vault & Climate Strongroom (assets/walkthrough/vault.jpg?v=pure2)
//
// Realistic First-Person Physical Locomotion Features:
// 1. Organic Human Gait Kinematics: 1.85 Hz sinusoidal vertical dipping (bob), lateral sway, and inertial roll
// 2. Free-Look Mouse Gaze & Rotational Drag: 55° yaw, 35° pitch with smooth physical damping
// 3. Acoustic Footstep Synthesizer: Procedural Web Audio API sound generation, surface-aware (oak parquet, library carpet, workshop timber, vault stone)
// 4. Grand Entrance Threshold Doorway: 3D carved walnut double doors swinging inward as the user steps inside

/* =========================================================================
   A. PROCEDURAL ACOUSTIC FOOTSTEP SYNTHESIZER (Zero Audio Asset Dependency)
   ========================================================================= */
class AcousticFootstepSynthesizer {
  constructor(audioCtx) {
    this.ctx = audioCtx;
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.38, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  playStep(surface, isLeftFoot, intensity = 1.0) {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const footPitchMult = isLeftFoot ? 1.0 : 0.94;
    const footPan = isLeftFoot ? -0.16 : 0.16;

    // Stereo Panner or direct routing fallback
    let pannerNode;
    if (this.ctx.createStereoPanner) {
      pannerNode = this.ctx.createStereoPanner();
      pannerNode.pan.setValueAtTime(footPan, now);
      pannerNode.connect(this.masterGain);
    } else {
      pannerNode = this.masterGain;
    }

    if (surface === 'parquet') {
      // Station 0: Polished Oak Parquet / Marble Landing
      // 1. Leather sole tap transient
      this._noiseTransient(now, pannerNode, {
        filterFreq: 2200 * footPitchMult,
        filterQ: 2.8,
        decay: 0.016,
        gain: 0.28 * intensity
      });
      // 2. Oak body resonance
      this._tonalThud(now, pannerNode, {
        startFreq: 170 * footPitchMult,
        endFreq: 75 * footPitchMult,
        decay: 0.055,
        gain: 0.32 * intensity
      });
    } else if (surface === 'carpet') {
      // Station 1 & 2: Plush Wool Library Runner & Velvet Reading Room Muffled Carpet
      // Cushioned velvet impact, heavily lowpassed, gentle library hush
      this._noiseTransient(now, pannerNode, {
        filterFreq: 220 * footPitchMult,
        filterQ: 0.8,
        decay: 0.035,
        gain: 0.16 * intensity,
        filterType: 'lowpass'
      });
      this._tonalThud(now, pannerNode, {
        startFreq: 85 * footPitchMult,
        endFreq: 42 * footPitchMult,
        decay: 0.075,
        gain: 0.22 * intensity
      });
    } else if (surface === 'timber') {
      // Station 3: Bindery Heavy Workshop Wood Plank Floor
      // Warm hollow timber knock & creak resonance
      this._tonalThud(now, pannerNode, {
        startFreq: 220 * footPitchMult,
        endFreq: 82 * footPitchMult,
        decay: 0.065,
        gain: 0.36 * intensity
      });
      this._noiseTransient(now, pannerNode, {
        filterFreq: 340 * footPitchMult,
        filterQ: 4.0,
        decay: 0.045,
        gain: 0.26 * intensity
      });
    } else if (surface === 'stone') {
      // Station 4: Rare Book Climate Vault Dense Stone Pavers
      // Crisp stone strike transient + concrete body
      this._noiseTransient(now, pannerNode, {
        filterFreq: 1450 * footPitchMult,
        filterQ: 3.5,
        decay: 0.014,
        gain: 0.34 * intensity
      });
      this._tonalThud(now, pannerNode, {
        startFreq: 145 * footPitchMult,
        endFreq: 68 * footPitchMult,
        decay: 0.048,
        gain: 0.30 * intensity
      });
      // Faint vault slap echo (28ms later)
      setTimeout(() => {
        if (!this.ctx || this.ctx.state === 'suspended') return;
        const echoTime = this.ctx.currentTime;
        this._tonalThud(echoTime, pannerNode, {
          startFreq: 120 * footPitchMult,
          endFreq: 60 * footPitchMult,
          decay: 0.035,
          gain: 0.08 * intensity
        });
      }, 28);
    }
  }

  _noiseTransient(now, destination, opts) {
    const bufferSize = Math.max(128, Math.floor(this.ctx.sampleRate * (opts.decay + 0.01)));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = opts.filterType || 'bandpass';
    filter.frequency.setValueAtTime(opts.filterFreq, now);
    filter.Q.setValueAtTime(opts.filterQ || 2.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(opts.gain, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.decay);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    noise.start(now);
    noise.stop(now + opts.decay + 0.01);
  }

  _tonalThud(now, destination, opts) {
    const osc = this.ctx.createOscillator();
    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(opts.startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(10, opts.endFreq), now + opts.decay);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(opts.gain, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.decay);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + opts.decay + 0.01);
  }

  playDoorCreak(isOpen) {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    // 1. Brass lock/latch release mechanism click
    this._noiseTransient(now, this.masterGain, {
      filterFreq: 2600,
      filterQ: 4.0,
      decay: 0.024,
      gain: 0.35
    });
    // 2. Heavy oak wood friction groan on antique iron hinge
    const creakOsc = this.ctx.createOscillator();
    const creakGain = this.ctx.createGain();
    const creakFilter = this.ctx.createBiquadFilter();
    creakOsc.type = 'sawtooth';
    const startF = isOpen ? 95 : 140;
    const endF = isOpen ? 150 : 85;
    creakOsc.frequency.setValueAtTime(startF, now + 0.03);
    creakOsc.frequency.linearRampToValueAtTime(endF, now + 0.55);
    creakFilter.type = 'bandpass';
    creakFilter.frequency.setValueAtTime(380, now + 0.03);
    creakFilter.Q.setValueAtTime(3.2, now + 0.03);
    creakGain.gain.setValueAtTime(0.001, now + 0.03);
    creakGain.gain.linearRampToValueAtTime(0.26, now + 0.12);
    creakGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.60);
    creakOsc.connect(creakFilter);
    creakFilter.connect(creakGain);
    creakGain.connect(this.masterGain);
    creakOsc.start(now + 0.03);
    creakOsc.stop(now + 0.62);
    // 3. Low stone friction / counterweight rumble
    this._tonalThud(now + 0.06, this.masterGain, {
      startFreq: 82,
      endFreq: 38,
      decay: 0.45,
      gain: 0.28
    });
  }

  playGearTick() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    // Crisp brass escapement ratchet click
    this._noiseTransient(now, this.masterGain, {
      filterFreq: 3200,
      filterQ: 5.5,
      decay: 0.012,
      gain: 0.20
    });
    // Metallic chime resonance
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1850, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.04);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  playCelestialChime() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const frequencies = [528, 792, 1056, 1584];
    frequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.001, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.14 / (idx + 1), now + idx * 0.04 + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 2.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 2.3);
    });
  }

  playLanternToggle(isOn) {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    // 1. Brass mechanical latch click
    this._noiseTransient(now, this.masterGain, {
      filterFreq: 2800,
      filterQ: 3.5,
      decay: 0.018,
      gain: 0.32
    });
    if (isOn) {
      // 2. Flint strike spark hiss
      this._noiseTransient(now + 0.015, this.masterGain, {
        filterFreq: 4800,
        filterQ: 4.2,
        decay: 0.045,
        gain: 0.28,
        filterType: 'highpass'
      });
      // 3. Warm flame combustion hum
      this._tonalThud(now + 0.02, this.masterGain, {
        startFreq: 190,
        endFreq: 95,
        decay: 0.12,
        gain: 0.22
      });
    } else {
      // Soft extinguish breath
      this._noiseTransient(now + 0.01, this.masterGain, {
        filterFreq: 800,
        filterQ: 1.2,
        decay: 0.06,
        gain: 0.18,
        filterType: 'lowpass'
      });
    }
  }
}

/* =========================================================================
   B. MAIN HIGH-DEFINITION WALKTHROUGH ENGINE
   ========================================================================= */
class LibraryWalkthroughEngine {
  constructor(mountElement, options = {}) {
    this.hasThree = typeof THREE !== 'undefined';
    if (!this.hasThree) {
      console.warn('Three.js not found. Walkthrough engine cannot initialize.');
      return;
    }

    this.mount = mountElement;
    this.options = options;
    // AbortController owns every listener bindEvents registers: one abort()
    // in destroy()/stopLoop() detaches them all, so switching back to specimen
    // mode cannot leave keyboard or pointer handlers driving this engine.
    this._events = new AbortController();
    this.noiseSource = null;
    this.onStationChange = typeof options.onStationChange === 'function' ? options.onStationChange : null;
    this.onInspectStation = typeof options.onInspectStation === 'function' ? options.onInspectStation : null;
    this.onProgressChange = typeof options.onProgressChange === 'function' ? options.onProgressChange : null;

    this.width = mountElement.clientWidth || window.innerWidth;
    this.height = mountElement.clientHeight || window.innerHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Spline & Walk Navigation State
    this.currentProgress = 0.0;
    this.targetProgress = 0.0;
    this.walkSpeed = 0.00075;
    this.keySpeed = 0.035;
    this.activeStationIndex = 0;
    this.activeStation = null;
    this.isRunning = false;
    this._rafId = null;

    // Organic Gait Kinematics State
    this.stepPhase = 0.0;
    this.lastProgress = 0.0;
    this.smoothedVelocity = 0.0;
    this.walkIntensity = 0.0;
    this.lastStepCycle = 0;
    this.gaitFrequency = 1.85; // Natural human walking cadence (~1.85 steps/sec)
    this.bobAmplitude = 0.048; // Vertical dipping on footfalls
    this.swayAmplitude = 0.024; // Lateral weight shift
    this.rollAmplitude = 0.012; // Natural head tilt

    // Lateral Strafe Kinematics (A / D Keys)
    this.strafeX = 0.0;
    this.targetStrafeX = 0.0;

    // Free-Look & Rotational Gaze State
    this.camYaw = 0.0;
    this.camPitch = 0.0;
    this.targetCamYaw = 0.0;
    this.targetCamPitch = 0.0;
    this.maxYaw = 55 * Math.PI / 180; // 55° look-around left & right
    this.maxPitch = 35 * Math.PI / 180; // 35° look-up to ceilings & down to parquet
    this.dragYawOffset = 0.0;
    this.dragPitchOffset = 0.0;
    this.keysDown = {};

    // Web Audio Synthesizer State
    this.audioCtx = null;
    this.footstepSynth = null;
    this.isAudioPlaying = false;
    this.audioGain = null;

    // Atmospheric Weather State
    this.currentWeather = 'morning';
    this.ambientLightRef = null;
    this.dirLightRef = null;

    // Handheld Brass Lantern State
    this.isLanternOn = true;
    this.lanternLight = null;
    this.lanternBaseIntensity = 3.2;
    this.lanternColor = 0xffa84c;
    this.lanternBtn = null;

    // Phase 4: Volumetric God-Rays
    this.godRays = [];
    this.godRayTexture = null;

    // Phase 4: Secret Bookcase Passage State
    this.isSecretPassageOpen = false;
    this.secretDoorAngle = 0.0;
    this.targetSecretDoorAngle = 0.0;
    this.secretPassageGroup = null;
    this.secretBookcasePivot = null;
    this.keystoneBookMesh = null;
    this.sconceLight = null;
    this.secretPromptEl = null;
    this.secretPromptTitle = null;
    this.secretPromptCta = null;
    this.isNearSecretPassage = false;

    // Phase 4: 3D Celestial Clockwork Orrery State
    this.isInsideOrrery = false;
    this.orreryGroup = null;
    this.orreryRings = [];
    this.orreryPlanets = [];
    this.orreryGears = [];
    this.orrerySunLight = null;
    this.orrerySunCorona = null;
    this.orrerySpeedMultiplier = 1.0;
    this.lastGearTickTime = 0.0;
    this.orreryHudEl = null;
    this.orreryCamGlide = 0.0;
    this.mercuryPivot = null;
    this.venusPivot = null;
    this.earthPivot = null;
    this.moonPivot = null;
    this.marsPivot = null;
    this.ambientNoiseFilter = null;

    // Card Catalog Drawer State
    this.catalogModal = null;
    this.currentCardIndex = 0;
    this.catalogCards = [
      {
        call: '813.52 F27a',
        author: 'FAULKNER, WILLIAM, 1897–1962.',
        title: 'As I lay dying.',
        imprint: 'New York, Random House [c1930]',
        notes: '252 p. 19 cm. First edition, first printing. Cloth binding stamped in green and brown.',
        tracings: '1. Mississippi—Fiction. 2. Bereavement—Fiction. I. Title.'
      },
      {
        call: '813.54 S16c',
        author: 'SALINGER, J. D. (JEROME DAVID), 1919–2010.',
        title: 'The catcher in the rye.',
        imprint: 'Boston, Little, Brown and Company, 1951.',
        notes: '277 p. 20 cm. First edition. Bound in black cloth; gilt spine lettering.',
        tracings: '1. Teenage boys—Fiction. 2. New York (N.Y.)—Fiction. I. Title.'
      },
      {
        call: '823.91 J88u',
        author: 'JOYCE, JAMES, 1882–1941.',
        title: 'Ulysses.',
        imprint: 'Paris, Shakespeare and Company, 1922.',
        notes: '732 p. 26 cm. One of 1,000 numbered copies on handmade paper. Original Greek-blue paper wrappers.',
        tracings: '1. Dublin (Ireland)—Fiction. 2. Psychological fiction. I. Title.'
      },
      {
        call: '813.52 H48f',
        author: 'HEMINGWAY, ERNEST, 1899–1961.',
        title: 'A farewell to arms.',
        imprint: 'New York, C. Scribner’s Sons, 1929.',
        notes: '355 p. 20 cm. First trade edition, first issue with no legal disclaimer on p. x.',
        tracings: '1. World War, 1914-1918—Fiction. 2. Ambulance drivers—Fiction. I. Title.'
      }
    ];

    // 3D Shelf Pull Volumes per Station
    this.shelfBooks = {
      0: {
        specimenId: 'fitzgerald-gatsby',
        call: '813.52 F55g',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald (New York)',
        imprint: 'First Edition · 1925 CE',
        desc: 'First printing in original dark emerald cloth binding with blind-stamped publisher seal and gilt spine lettering. Printed on unbleached antique wove paper.',
        format: 'Octavo (8vo)',
        binding: 'Emerald Green Cloth',
        sewing: 'Machine Tape Sewn',
        status: 'Pristine First Edition'
      },
      1: {
        specimenId: 'marc-metadata',
        call: '813.52 F27a',
        title: 'As I Lay Dying',
        author: 'William Faulkner (New York)',
        imprint: 'First Edition · 1930 CE',
        desc: 'Seminal modernist stream-of-consciousness novel. Bound in publisher’s beige buckram cloth with maroon title stamping. Contains Library of Congress catalog card.',
        format: 'Twelvemo (12mo)',
        binding: 'Beige Buckram Cloth',
        sewing: 'Recessed Cord Sewing',
        status: 'Circulation Archive Reserve'
      },
      2: {
        specimenId: 'classification-systems',
        call: 'INC-1495-ARIS',
        title: 'Aristoteles Graece (Organon)',
        author: 'Aldus Manutius (Venice)',
        imprint: 'Editio Princeps · 1495 CE',
        desc: 'The historic first printed Greek edition of Aristotle by the Aldine Press in Venice. Hand-bound in full blind-tooled calfskin over quarter-sawn oak boards.',
        format: 'Chancery Folio',
        binding: 'Blind-Tooled Calf over Oak',
        sewing: 'Alum-Tawed Leather Bands',
        status: 'Permanent Rare Reserve'
      },
      3: {
        specimenId: 'preservation-science',
        call: 'RBC-FAB-1543',
        title: 'De Humani Corporis Fabrica',
        author: 'Andreas Vesalius (Basel)',
        imprint: 'Folio Edition · 1543 CE',
        desc: 'Landmark Renaissance anatomical atlas printed by Johannes Oporinus in Basel with woodcut plates. Period pigskin binding exhibiting iron-gall ink conservation repairs.',
        format: 'Imperial Folio',
        binding: 'Pigskin with Brass Clasps',
        sewing: '5 Split-Leather Thongs',
        status: 'Active Conservation Treatment'
      },
      4: {
        specimenId: 'special-collections',
        call: 'VAULT-INC-1455',
        title: 'Biblia Latina (42-Line Bible)',
        author: 'Johannes Gutenberg (Mainz)',
        imprint: 'Movable Type · c. 1455 CE',
        desc: 'Two-volume Latin Vulgate Bible printed with movable metal type in Mainz. Rubricated red and blue illuminated initials on handmade Italian rag paper.',
        format: 'Royal Folio',
        binding: 'Contemporary Blind-Stamped Calf',
        sewing: 'Heavy Double Linen Cords',
        status: 'Climate Vault · Level 5 Security'
      }
    };

    this.shelfPromptEl = null;
    this.shelfLecternModal = null;
    this.isLecternOpen = false;
    this.shelfPromptVisible = false;
    this.currentPulledBook = null;

    // Station Waypoints (Progress 0.0 to 1.0)
    this.planeDistance = 7.5;
    this.stations = [
      {
        id: 'foyer',
        index: 0,
        progress: 0.0,
        name: 'Grand Foyer Entrance',
        locationTitle: 'Level 01 — Grand Entrance',
        specimenModuleId: 'classification-systems',
        image: 'assets/walkthrough/foyer.jpg?v=pure2',
        surface: 'parquet',
        cta: 'Walk Forward to Step Inside',
        z: 20
      },
      {
        id: 'circulation',
        index: 1,
        progress: 0.25,
        name: 'Circulation Desk & Card Index',
        locationTitle: 'Ground Floor — Circulation & Access',
        specimenModuleId: 'marc-metadata',
        image: 'assets/walkthrough/circulation.jpg?v=pure2',
        surface: 'carpet',
        cta: 'Press E or Click to Search Card Index',
        z: 10
      },
      {
        id: 'reading-room',
        index: 2,
        progress: 0.50,
        name: 'Grand Reading Hall (Quiet Sanctuary)',
        locationTitle: 'Main Floor — Silent Sanctuary',
        specimenModuleId: 'academic-libraries',
        image: 'assets/walkthrough/reading_room.jpg?v=pure2',
        surface: 'carpet',
        cta: 'Press E or Click to Read at Desk',
        z: 0
      },
      {
        id: 'bindery',
        index: 3,
        progress: 0.75,
        name: 'Bindery & Conservation Lab',
        locationTitle: 'Mezzanine — Bookbinding Atelier',
        specimenModuleId: 'preservation-science',
        image: 'assets/walkthrough/bindery.jpg?v=pure2',
        surface: 'timber',
        cta: 'Press E or Click to Enter Craft Workshop',
        z: -10
      },
      {
        id: 'vault',
        index: 4,
        progress: 1.0,
        name: 'Rare Book Climate Vault',
        locationTitle: 'Sub-Level — Strongroom Sanctuary',
        specimenModuleId: 'special-collections',
        image: 'assets/walkthrough/vault.jpg?v=pure2',
        surface: 'stone',
        cta: 'Press E or Click to Open Specimen Atelier',
        z: -20
      }
    ];

    // DOM Bindings
    this.foyerHeroEl = document.getElementById('foyer-arrival-hero');
    this.explorationPromptEl = document.getElementById('exploration-hud-prompt');
    this.promptIcon = document.getElementById('hud-prompt-icon');
    this.promptKicker = document.getElementById('hud-prompt-kicker');
    this.promptTitle = document.getElementById('hud-prompt-title');
    this.promptActions = document.getElementById('hud-prompt-actions');
    this.depthItems = document.querySelectorAll('.depth-item');
    this.depthTrackFill = document.getElementById('depth-track-fill');
    this.compassText = document.getElementById('compass-location-text');
    this.audioBtn = document.getElementById('ambient-audio-btn');

    this.stationPlanes = [];
    this.orreryMesh = null;
    this.doorPortalGroup = null;
    this.leftDoorPivot = null;
    this.rightDoorPivot = null;
    this.doorMaterial = null;
    this._renderedPromptStation = null;

    this.initScene();
    this.buildHighDefinitionWorld();
    this.bindEvents();
    this.startLoop();
    // Publish only after full construction: a thrown init must not leave a
    // half-built engine reachable as the global.
    window.walkthroughEngine = this;
  }

  /* =========================================================================
     1. SCENE SETUP & CINEMATIC FIRST-PERSON CAMERA
     ========================================================================= */
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1512);

    this.camera = new THREE.PerspectiveCamera(54, this.width / this.height, 0.1, 100);
    this.camera.rotation.order = 'YXZ';
    this.camera.position.set(0, 0, 26);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.mount.innerHTML = '';
    this.mount.appendChild(this.renderer.domElement);

    // Warm Ambient & Directional Key/Fill Lighting for 3D In-World Workbenches
    const ambient = new THREE.AmbientLight(0xfff6eb, 1.2);
    this.scene.add(ambient);
    this.ambientLightRef = ambient;

    const dirLight = new THREE.DirectionalLight(0xffecd2, 1.15);
    dirLight.position.set(4, 8, 12);
    this.scene.add(dirLight);
    this.dirLightRef = dirLight;

    const fillLight = new THREE.DirectionalLight(0xc8e0ff, 0.65);
    fillLight.position.set(-4, -2, 6);
    this.scene.add(fillLight);

    // Handheld Brass Lantern (Camera-Mounted Dynamic Light)
    this.lanternLight = new THREE.PointLight(this.lanternColor, this.lanternBaseIntensity, 24, 1.7);
    this.lanternLight.position.set(0.40, -0.30, -0.55);
    this.camera.add(this.lanternLight);
    this.scene.add(this.camera);
  }

  /* =========================================================================
     2. HIGH-DEFINITION SPATIAL ENVIRONMENT BUILDER
     ========================================================================= */
  buildHighDefinitionWorld() {
    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);

    const textureLoader = new THREE.TextureLoader();

    // Create high-res environment planes for each station
    this.stations.forEach((st, idx) => {
      const planeGeo = new THREE.PlaneGeometry(16, 9);
      const texture = textureLoader.load(st.image);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      if (this.renderer && this.renderer.capabilities) {
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      }

      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: idx === 0 ? 1.0 : 0.0,
        depthWrite: false
      });

      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.position.set(0, 0, st.z);
      this.worldGroup.add(planeMesh);

      this.stationPlanes.push({
        mesh: planeMesh,
        material: planeMat,
        station: st
      });
    });

    // 3D Entrance Threshold Doorway Portal
    this.buildThresholdDoorway(textureLoader);

    // Secret Celestial Orrery Rotunda Environment Plane
    const orreryTexture = textureLoader.load('assets/walkthrough/orrery.jpg?v=pure2');
    orreryTexture.generateMipmaps = true;
    orreryTexture.minFilter = THREE.LinearMipmapLinearFilter;
    orreryTexture.magFilter = THREE.LinearFilter;
    if (this.renderer && this.renderer.capabilities) {
      orreryTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    }

    const orreryMat = new THREE.MeshBasicMaterial({
      map: orreryTexture,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    this.orreryMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), orreryMat);
    this.orreryMesh.position.set(0, 0, 0);
    this.orreryMesh.visible = false;
    this.worldGroup.add(this.orreryMesh);

    // Atmospheric warm golden dust particles
    this.buildAtmosphericDust();

    // Phase 4: Volumetric God-Rays Streaming from Clerestory Windows
    this.buildVolumetricGodRays();

    // Scale planes to cover viewport with generous free-look margins
    this.updatePlaneCover();
  }

  /* =========================================================================
     3. 3D ENTRANCE THRESHOLD DOORWAY (Foreground Carved Walnut Doors)
     ========================================================================= */
  buildThresholdDoorway(textureLoader) {
    this.doorPortalGroup = new THREE.Group();
    this.doorPortalGroup.visible = false; // New foyer.jpg has magnificent open double doors
    // Positioned at z = 23.6, between camera start (z = 26.0) and Station 0 plane (z = 20.0)
    this.doorPortalGroup.position.set(0, 0, 23.6);
    // this.worldGroup.add(this.doorPortalGroup); -- disabled so foyer colonnade is unobstructed

    const foyerTexture = textureLoader.load('assets/walkthrough/foyer.jpg?v=pure2');
    foyerTexture.generateMipmaps = true;
    foyerTexture.minFilter = THREE.LinearMipmapLinearFilter;
    foyerTexture.magFilter = THREE.LinearFilter;
    if (this.renderer && this.renderer.capabilities) {
      foyerTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    }

    this.doorMaterial = new THREE.MeshBasicMaterial({
      map: foyerTexture,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const setQuadUVs = (geo, uMin, uMax, vMin, vMax) => {
      const uvs = new Float32Array([
        uMin, vMax,
        uMax, vMax,
        uMin, vMin,
        uMax, vMin
      ]);
      geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    };

    // Door leaf dimensions matched to camera frustum at z = 23.6 (distance = 2.4 units)
    // Frustum width ~ 4.45, height ~ 2.50
    const doorW = 1.35;
    const doorH = 2.70;

    // --- LEFT DOOR LEAF ---
    // Left door in foyer.jpg spans u: 0.00 to 0.28
    this.leftDoorPivot = new THREE.Group();
    this.leftDoorPivot.position.set(-2.25, 0.0, 0.0);

    const leftDoorGeo = new THREE.PlaneGeometry(doorW, doorH);
    leftDoorGeo.translate(doorW / 2, 0, 0); // Origin at hinge on left edge
    setQuadUVs(leftDoorGeo, 0.0, 0.28, 0.0, 1.0);
    const leftDoorMesh = new THREE.Mesh(leftDoorGeo, this.doorMaterial);
    this.leftDoorPivot.add(leftDoorMesh);
    this.doorPortalGroup.add(this.leftDoorPivot);

    // --- RIGHT DOOR LEAF ---
    // Right door in foyer.jpg spans u: 0.72 to 1.00
    this.rightDoorPivot = new THREE.Group();
    this.rightDoorPivot.position.set(2.25, 0.0, 0.0);

    const rightDoorGeo = new THREE.PlaneGeometry(doorW, doorH);
    rightDoorGeo.translate(-doorW / 2, 0, 0); // Origin at hinge on right edge
    setQuadUVs(rightDoorGeo, 0.72, 1.0, 0.0, 1.0);
    const rightDoorMesh = new THREE.Mesh(rightDoorGeo, this.doorMaterial);
    this.rightDoorPivot.add(rightDoorMesh);
    this.doorPortalGroup.add(this.rightDoorPivot);
  }

  buildAtmosphericDust() {
    const dustCount = 400;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = 25 - Math.random() * 50;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xffe8ba,
      size: 0.04,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.dustParticles = new THREE.Points(geo, pMat);
    this.worldGroup.add(this.dustParticles);
  }

  /* =========================================================================
     4. USER INTERACTION: FREE-LOOK, SCROLL, TOUCH, KEYBOARD & AUDIO
     ========================================================================= */
  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.footstepSynth = new AcousticFootstepSynthesizer(this.audioCtx);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  bindEvents() {
    const signal = this._events.signal;

    // 1. Mouse Wheel Scroll-to-Walk with Momentum
    const handleWheel = (e) => {
      e.preventDefault();
      this.ensureAudioContext();
      const delta = Math.sign(e.deltaY) * this.walkSpeed * Math.min(Math.abs(e.deltaY), 45);
      this.targetProgress = Math.max(0.0, Math.min(1.0, this.targetProgress + delta));
    };
    this.mount.addEventListener('wheel', handleWheel, { signal, passive: false });

    // 2. Free-Look Mouse Gaze & Rotational Dragging
    let isPointerDown = false;
    let startPointerX = 0;
    let startPointerY = 0;

    this.mount.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, .depth-item, .tool-item, .station-target-reticle')) return;
      this.ensureAudioContext();
      isPointerDown = true;
      startPointerX = e.clientX;
      startPointerY = e.clientY;
    }, { signal });

    window.addEventListener('pointermove', (e) => {
      // Natural first-person gaze across viewport:
      // Moving mouse up looks up at chandeliers & vaults; moving mouse down looks down at folios & parquet
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      this.targetCamYaw = -nx * this.maxYaw;
      this.targetCamPitch = -ny * this.maxPitch;

      // Rotational dragging for even wider inspection
      if (isPointerDown) {
        const dx = e.clientX - startPointerX;
        const dy = e.clientY - startPointerY;
        startPointerX = e.clientX;
        startPointerY = e.clientY;
        this.dragYawOffset = Math.max(-0.6, Math.min(0.6, this.dragYawOffset - dx * 0.003));
        this.dragPitchOffset = Math.max(-0.4, Math.min(0.4, this.dragPitchOffset - dy * 0.003));
      }
    }, { signal });

    window.addEventListener('pointerup', () => {
      isPointerDown = false;
    }, { signal });
    window.addEventListener('pointercancel', () => {
      isPointerDown = false;
    }, { signal });

    // 3. Touch Drag on Mobile
    let touchStartY = 0;
    this.mount.addEventListener('touchstart', (e) => {
      this.ensureAudioContext();
      if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
    }, { signal, passive: true });

    this.mount.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touchCurrentY = e.touches[0].clientY;
        const deltaY = touchStartY - touchCurrentY;
        touchStartY = touchCurrentY;
        this.targetProgress = Math.max(0.0, Math.min(1.0, this.targetProgress + deltaY * 0.0018));
      }
    }, { signal, passive: true });

    // 4. Keyboard Navigation (Hold W/S for continuous walking, A/D to turn, E to inspect, F to pull shelf volume)
    // Gate on isRunning: with the loop stopped (specimen experience) these keys
    // must not fire walkthrough actions or audio.
    window.addEventListener('keydown', (e) => {
      if (!this.isRunning) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      this.ensureAudioContext();
      this.keysDown[e.code] = true;

      if (e.code === 'KeyE' || e.code === 'Space') {
        if (this.activeStation && this.activeStation.index > 0) {
          e.preventDefault();
          if (this.activeStation.index === 1 && !this.isLecternOpen && (!this.catalogModal || this.catalogModal.hidden)) {
            this.openCardDrawer();
          } else {
            this.triggerInspectStation(this.activeStation);
          }
        }
      }

      if (e.code === 'Enter') {
        if (this.activeStation && this.activeStation.index > 0) {
          e.preventDefault();
          this.triggerInspectStation(this.activeStation);
        }
      }

      if (e.code === 'KeyF') {
        e.preventDefault();
        if (this.isLecternOpen) {
          this.returnShelfVolume();
        } else if (this.activeStation && this.activeStation.index > 0) {
          this.pullShelfVolume();
        }
      }

      if (e.code === 'KeyL') {
        e.preventDefault();
        this.toggleLantern();
      }

      if (e.code === 'KeyX') {
        e.preventDefault();
        this.handleSecretPassageAction();
      }

      if (e.code === 'KeyT') {
        if (this.isInsideOrrery) {
          e.preventDefault();
          this.cycleOrrerySpeed();
        }
      }

      if (e.code === 'Escape') {
        if (this.isInsideOrrery) {
          e.preventDefault();
          this.exitOrreryRotunda();
        } else if (this.isLecternOpen) {
          this.returnShelfVolume();
        } else if (this.catalogModal && !this.catalogModal.hidden) {
          this.closeCardDrawer();
        }
      }
    }, { signal });

    window.addEventListener('keyup', (e) => {
      this.keysDown[e.code] = false;
    }, { signal });

    // 5. Station Depth Indicator Clicks
    this.depthItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.ensureAudioContext();
        const stationIdx = parseInt(item.getAttribute('data-station'), 10);
        const targetStation = this.stations.find(s => s.index === stationIdx);
        if (targetStation) {
          this.targetProgress = targetStation.progress;
        }
      }, { signal });
    });


    // Exploration HUD Prompt Action Delegation
    if (this.explorationPromptEl) {
      this.explorationPromptEl.addEventListener('click', (e) => {
        const chip = e.target.closest('.hud-action-chip');
        if (!chip) return;
        e.stopPropagation();
        this.ensureAudioContext();
        const action = chip.getAttribute('data-action');
        if (action === 'catalog') {
          this.openCardDrawer();
        } else if (action === 'pull-book') {
          this.pullShelfVolume();
        } else if (action === 'secret-passage') {
          this.handleSecretPassageAction();
        } else if (action === 'inspect') {
          if (this.activeStation && this.activeStation.index > 0) {
            this.triggerInspectStation(this.activeStation);
          }
        } else if (action === 'atelier') {
          if (this.activeStation && this.activeStation.index > 0) {
            this.triggerInspectStation(this.activeStation);
          }
        }
      }, { signal });
    }
    // 6. Reticle Click (ring & button)
    if (this.reticleEl) {
      this.reticleEl.addEventListener('click', () => {
        if (this.activeStation && this.activeStation.index > 0) {
          this.triggerInspectStation(this.activeStation);
        }
      }, { signal });
    }

    // 7. Circulation Card Drawer Buttons
    const digitizeBtn = document.getElementById('btn-inspect-catalog-specimen');
    if (digitizeBtn) {
      digitizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetStation = this.stations.find(s => s.index === 1);
        if (targetStation) this.triggerInspectStation(targetStation);
      }, { signal });
    }

    const openDrawerBtn = document.getElementById('btn-open-card-drawer');
    if (openDrawerBtn) {
      openDrawerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openCardDrawer();
      }, { signal });
    }

    const closeDrawerBtn = document.getElementById('close-catalog-drawer');
    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener('click', () => this.closeCardDrawer(), { signal });
    }

    const prevCardBtn = document.getElementById('card-prev-btn');
    if (prevCardBtn) {
      prevCardBtn.addEventListener('click', () => this.flipCard(-1), { signal });
    }

    const nextCardBtn = document.getElementById('card-next-btn');
    if (nextCardBtn) {
      nextCardBtn.addEventListener('click', () => this.flipCard(1), { signal });
    }

    // 7B. 3D Shelf Volume Pull Prompt & Lectern Inspection
    const shelfPromptBtn = document.getElementById('shelf-pull-action-btn');
    if (shelfPromptBtn) {
      shelfPromptBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.pullShelfVolume();
      }, { signal });
    }

    const closeLecternBtn = document.getElementById('close-lectern-btn');
    if (closeLecternBtn) {
      closeLecternBtn.addEventListener('click', () => this.returnShelfVolume(), { signal });
    }

    const returnLecternBtn = document.getElementById('btn-lectern-return');
    if (returnLecternBtn) {
      returnLecternBtn.addEventListener('click', () => this.returnShelfVolume(), { signal });
    }

    const readLecternBtn = document.getElementById('btn-lectern-read');
    if (readLecternBtn) {
      readLecternBtn.addEventListener('click', () => {
        if (this.currentPulledBook && window.biblioApp && typeof window.biblioApp.openBookReader === 'function') {
          this.returnShelfVolume();
          window.biblioApp.openBookReader(this.currentPulledBook.specimenId);
        }
      }, { signal });
    }

    const atelierLecternBtn = document.getElementById('btn-lectern-atelier');
    if (atelierLecternBtn) {
      atelierLecternBtn.addEventListener('click', () => {
        this.inspectVolumeInAtelier();
      }, { signal });
    }

    // 8. Walkthrough Atmospheric Weather Buttons
    const weatherBtns = document.querySelectorAll('.weather-btn');
    weatherBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-weather');
        this.setWeather(mode);
      }, { signal });
    });

    // 7C. Secret Passage & Celestial Orrery Buttons
    const secretActionBtn = document.getElementById('btn-secret-passage-action');
    if (secretActionBtn) {
      secretActionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleSecretPassageAction();
      }, { signal });
    }

    const leaveOrreryBtn = document.getElementById('btn-leave-orrery');
    if (leaveOrreryBtn) {
      leaveOrreryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.exitOrreryRotunda();
      }, { signal });
    }

    const orrerySpeedBtn = document.getElementById('btn-orrery-speed');
    if (orrerySpeedBtn) {
      orrerySpeedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.cycleOrrerySpeed();
      }, { signal });
    }

    // 8B. Handheld Brass Lantern Button
    const lanternBtn = document.getElementById('btn-toggle-lantern');
    if (lanternBtn) {
      lanternBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleLantern();
      }, { signal });
    }

    // 9. Bindery Tools Palette Click to Inspect
    const binderyTools = document.querySelectorAll('.bindery-tools-palette .tool-item');
    binderyTools.forEach(tool => {
      tool.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetStation = this.stations.find(s => s.index === 3);
        if (targetStation) this.triggerInspectStation(targetStation);
      }, { signal });
    });

    // 10. Ambient Audio Toggle
    if (this.audioBtn) {
      this.audioBtn.addEventListener('click', () => {
        this.ensureAudioContext();
        this.toggleAmbientAudio();
      }, { signal });
    }

    // 11. Window Resize
    window.addEventListener('resize', () => {
      this.handleResize();
    }, { signal });
  }

  /* =========================================================================
     5B. ATMOSPHERIC WEATHER & CARD CATALOG DRAWER IMPLEMENTATIONS
     ========================================================================= */
  setWeather(mode) {
    if (!mode) return;
    this.currentWeather = mode;

    document.querySelectorAll('.weather-btn').forEach(b => {
      const active = b.getAttribute('data-weather') === mode;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });

    if (this.ambientLightRef && this.dirLightRef) {
      if (mode === 'morning') {
        this.ambientLightRef.color.setHex(0xfff6eb);
        this.ambientLightRef.intensity = 1.25;
        this.dirLightRef.color.setHex(0xffecd2);
        this.dirLightRef.intensity = 1.15;
        if (this.renderer) this.renderer.toneMappingExposure = 1.08;
      } else if (mode === 'golden') {
        this.ambientLightRef.color.setHex(0xffb366);
        this.ambientLightRef.intensity = 0.95;
        this.dirLightRef.color.setHex(0xff9933);
        this.dirLightRef.intensity = 1.65;
        if (this.renderer) this.renderer.toneMappingExposure = 1.18;
      } else if (mode === 'rain') {
        this.ambientLightRef.color.setHex(0x7594b8);
        this.ambientLightRef.intensity = 0.55;
        this.dirLightRef.color.setHex(0x5075a3);
        this.dirLightRef.intensity = 0.45;
        if (this.renderer) this.renderer.toneMappingExposure = 0.92;
        this.playThunderRumble();
      }
    }

    // Dynamic Volumetric God-Ray Weather Color & Opacity Modulation
    if (this.godRays && this.godRays.length > 0) {
      this.godRays.forEach(r => {
        if (mode === 'morning') {
          r.material.color.setHex(0xfff8e8);
          r.material.opacity = r.baseOpacity;
        } else if (mode === 'golden') {
          r.material.color.setHex(0xff9e33);
          r.material.opacity = r.baseOpacity * 1.55;
        } else if (mode === 'rain') {
          r.material.color.setHex(0x5075a3);
          r.material.opacity = r.baseOpacity * 0.50;
        }
      });
    }

    // Dynamic Weather Soundscape Modulation
    if (this.ambientNoiseFilter && this.audioCtx && this.isAudioPlaying) {
      const now = this.audioCtx.currentTime;
      if (mode === 'rain') {
        this.ambientNoiseFilter.type = 'bandpass';
        this.ambientNoiseFilter.frequency.setValueAtTime(2200, now);
        this.ambientNoiseFilter.Q.setValueAtTime(1.8, now);
        if (this.audioGain) this.audioGain.gain.setValueAtTime(0.38, now);
      } else if (mode === 'golden') {
        this.ambientNoiseFilter.type = 'lowpass';
        this.ambientNoiseFilter.frequency.setValueAtTime(450, now);
        if (this.audioGain) this.audioGain.gain.setValueAtTime(0.28, now);
      } else {
        this.ambientNoiseFilter.type = 'lowpass';
        this.ambientNoiseFilter.frequency.setValueAtTime(650, now);
        if (this.audioGain) this.audioGain.gain.setValueAtTime(0.30, now);
      }
    }
  }

  playThunderRumble() {
    this.ensureAudioContext();
    if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(45, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 1.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now);
    filter.frequency.linearRampToValueAtTime(60, now + 1.8);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 2.1);

    // Lightning Flash through Cathedral Clerestories
    if (this.godRays && this.godRays.length > 0) {
      this.godRays.forEach(r => {
        r.material.color.setHex(0xeaf2ff);
        r.material.opacity = Math.min(0.85, r.baseOpacity * 3.6);
      });
      setTimeout(() => {
        if (this.currentWeather === 'rain' && this.godRays) {
          this.godRays.forEach(r => {
            r.material.color.setHex(0x5075a3);
            r.material.opacity = r.baseOpacity * 0.50;
          });
        }
      }, 150);
    }
  }

  openCardDrawer() {
    this.catalogModal = document.getElementById('catalog-drawer-modal');
    if (!this.catalogModal) return;
    this.catalogModal.hidden = false;
    this.renderCurrentCard();
    this.triggerCardSound('slide');
  }

  closeCardDrawer() {
    if (!this.catalogModal) this.catalogModal = document.getElementById('catalog-drawer-modal');
    if (this.catalogModal) this.catalogModal.hidden = true;
  }

  flipCard(direction) {
    const N = this.catalogCards.length;
    this.currentCardIndex = (this.currentCardIndex + direction + N) % N;
    this.renderCurrentCard();
    this.triggerCardSound('flick');
  }

  renderCurrentCard() {
    const track = document.getElementById('drawer-cards-track');
    const counter = document.getElementById('drawer-card-counter');
    if (!track) return;

    const card = this.catalogCards[this.currentCardIndex];
    if (counter) {
      counter.textContent = `Card ${this.currentCardIndex + 1} of ${this.catalogCards.length}`;
    }

    track.innerHTML = `
      <div class="catalog-card-item">
        <div class="card-call-line">${card.call}</div>
        <div class="card-author-line">${card.author}</div>
        <div class="card-title-line">${card.title}</div>
        <div class="card-notes-line">${card.imprint}<br/>${card.notes}</div>
        <div class="card-tracings-line">${card.tracings}</div>
        <div class="card-rod-hole" title="Brass filing retaining rod hole" aria-hidden="true"></div>
      </div>
    `;
  }

  triggerCardSound(type) {
    this.ensureAudioContext();
    if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    if (type === 'flick') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.04);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    }

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  /* =========================================================================
     5C. 3D SHELF VOLUME PULL & READING LECTERN INSPECTION
     ========================================================================= */
  pullShelfVolume() {
    const stationIdx = this.activeStation ? this.activeStation.index : 2;
    const book = this.shelfBooks[stationIdx] || this.shelfBooks[2];
    this.currentPulledBook = book;

    this.shelfLecternModal = document.getElementById('shelf-lectern-modal');
    if (!this.shelfLecternModal) return;

    const callEl = document.getElementById('lectern-book-call');
    if (callEl) callEl.textContent = book.call;
    const titleEl = document.getElementById('lectern-book-title');
    if (titleEl) titleEl.textContent = book.title;
    const authorEl = document.getElementById('lectern-book-author');
    if (authorEl) authorEl.textContent = book.author;
    const imprintEl = document.getElementById('lectern-book-imprint');
    if (imprintEl) imprintEl.textContent = book.imprint;
    const descEl = document.getElementById('lectern-book-desc');
    if (descEl) descEl.textContent = book.desc;

    const fmtEl = document.getElementById('lectern-stat-format');
    if (fmtEl) fmtEl.textContent = book.format;
    const bindEl = document.getElementById('lectern-stat-binding');
    if (bindEl) bindEl.textContent = book.binding;
    const sewEl = document.getElementById('lectern-stat-sewing');
    if (sewEl) sewEl.textContent = book.sewing;
    const statEl = document.getElementById('lectern-stat-status');
    if (statEl) statEl.textContent = book.status;

    this.shelfLecternModal.hidden = false;
    this.isLecternOpen = true;

    if (this.shelfPromptEl) this.shelfPromptEl.hidden = true;

    this.playShelfSlideSound();
  }

  returnShelfVolume() {
    if (!this.shelfLecternModal) this.shelfLecternModal = document.getElementById('shelf-lectern-modal');
    if (this.shelfLecternModal) this.shelfLecternModal.hidden = true;
    this.isLecternOpen = false;

    this.playShelfSlideSound();

    if (this.shelfPromptVisible && this.shelfPromptEl) {
      this.shelfPromptEl.hidden = false;
    }
  }

  inspectVolumeInAtelier() {
    const book = this.currentPulledBook;
    this.returnShelfVolume();

    if (window.biblioApp && typeof window.biblioApp.openSpecimenInAtelier === 'function') {
      window.biblioApp.openSpecimenInAtelier(book ? book.specimenId : 'classification-systems');
    }
  }

  /* =========================================================================
     5D. HANDHELD BRASS LANTERN SYSTEM
     ========================================================================= */
  toggleLantern() {
    this.ensureAudioContext();
    this.isLanternOn = !this.isLanternOn;
    if (this.lanternLight) {
      this.lanternLight.visible = this.isLanternOn;
    }
    if (this.footstepSynth && typeof this.footstepSynth.playLanternToggle === 'function') {
      this.footstepSynth.playLanternToggle(this.isLanternOn);
    }
    this.updateLanternHUD();
  }

  updateLanternHUD() {
    if (!this.lanternBtn) this.lanternBtn = document.getElementById('btn-toggle-lantern');
    if (this.lanternBtn) {
      this.lanternBtn.classList.toggle('active', this.isLanternOn);
      this.lanternBtn.setAttribute('aria-pressed', String(this.isLanternOn));
      const statusText = document.getElementById('lantern-status-text');
      if (statusText) {
        statusText.textContent = this.isLanternOn ? 'LIT' : 'OFF';
      }
    }
  }

  playShelfSlideSound() {
    this.ensureAudioContext();
    if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.32);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(150, now + 0.32);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.33);
  }

  triggerInspectStation(station) {
    if (this._swooping) return;
    this.performInspectionSwoop(station, () => {
      if (typeof this.onInspectStation === 'function') {
        this.onInspectStation(station);
      }
    });
  }

  performInspectionSwoop(station, onComplete) {
    if (this._swooping) return;
    this._swooping = true;
    this.ensureAudioContext();

    // Synthesize motorized optical zoom servo whoosh
    if (this.audioCtx && this.audioCtx.state !== 'suspended') {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const filter = this.audioCtx.createBiquadFilter();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(2.5, now);

      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.72);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.75);
    }

    const startPos = this.camera.position.clone();
    const startRotX = this.camera.rotation.x;
    const startFov = this.camera.fov;

    // Glide forward smoothly with optical cinematic focal pull
    const targetZ = startPos.z - 4.2;
    const targetY = startPos.y - 0.45;

    const targetPos = new THREE.Vector3(0, targetY, targetZ);
    const targetRotX = -0.22;
    const targetFov = 34;

    const startTime = performance.now();
    const duration = 720;
    let completed = false;

    const finish = () => {
      if (completed) return;
      completed = true;
      this._swooping = false;
      this.camera.position.copy(startPos);
      this.camera.rotation.x = startRotX;
      this.camera.fov = startFov;
      this.camera.updateProjectionMatrix();
      if (typeof onComplete === 'function') onComplete();
    };

    const animateSwoop = () => {
      if (completed) return;
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      // Smooth easeInOutCubic
      const k = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(startPos, targetPos, k);
      this.camera.rotation.x = startRotX + (targetRotX - startRotX) * k;
      this.camera.fov = startFov + (targetFov - startFov) * k;
      this.camera.updateProjectionMatrix();
      if (this.renderer && this.scene) {
        this.renderer.render(this.scene, this.camera);
      }

      if (progress < 1.0) {
        requestAnimationFrame(animateSwoop);
      } else {
        finish();
      }
    };

    requestAnimationFrame(animateSwoop);
    setTimeout(finish, duration + 60);
  }

  performExitSwoop(onComplete) {
    this.ensureAudioContext();
    if (this.audioCtx && this.audioCtx.state !== 'suspended') {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.55);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.58);
    }
    if (typeof onComplete === 'function') onComplete();
  }

  /* =========================================================================
     5. AMBIENT LIBRARY SOUNDSCAPE (Web Audio API)
     ========================================================================= */
  toggleAmbientAudio() {
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    if (this.isAudioPlaying) {
      this.isAudioPlaying = false;
      this.updateAudioHUD(false);
      if (this.audioGain) {
        // Fade out, then stop the looping source. The gain ramp used to be the
        // only thing that changed, leaving the buffer source running forever.
        this.audioGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.audioGain.gain.setValueAtTime(this.audioGain.gain.value, this.audioCtx.currentTime);
        this.audioGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.6);
      }
      // stopAmbientSoundscape is idempotent, so this timeout is safe even if
      // destroy() runs first.
      setTimeout(() => this.stopAmbientSoundscape(), 700);
    } else {
      this.startPinkNoiseSoundscape();
      this.isAudioPlaying = true;
      this.updateAudioHUD(true);
    }
  }

  startPinkNoiseSoundscape() {
    if (!this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }

    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;
    this.noiseSource = noiseSource;

    const filter = this.audioCtx.createBiquadFilter();
    this.ambientNoiseFilter = filter;
    filter.type = 'lowpass';
    filter.frequency.value = 650;

    this.audioGain = this.audioCtx.createGain();
    this.audioGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
    this.audioGain.gain.linearRampToValueAtTime(0.3, this.audioCtx.currentTime + 1.2);

    noiseSource.connect(filter);
    filter.connect(this.audioGain);
    this.audioGain.connect(this.audioCtx.destination);
    noiseSource.start();
  }

  /**
   * Fully stop the pink-noise soundscape. Stopping the gain ramp alone left a
   * looping buffer source connected and audible-graph alive forever, so every
   * re-enable stacked another running source.
   */
  stopAmbientSoundscape() {
    if (this.audioGain) {
      try { this.audioGain.gain.cancelScheduledValues(this.audioCtx.currentTime); } catch (_) {}
      try { this.audioGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime); } catch (_) {}
    }
    if (this.noiseSource) {
      try { this.noiseSource.stop(); } catch (_) {}
      try { this.noiseSource.disconnect(); } catch (_) {}
      this.noiseSource = null;
    }
    if (this.ambientNoiseFilter) {
      try { this.ambientNoiseFilter.disconnect(); } catch (_) {}
      this.ambientNoiseFilter = null;
    }
    if (this.audioGain) {
      try { this.audioGain.disconnect(); } catch (_) {}
      this.audioGain = null;
    }
  }

  updateAudioHUD(isPlaying) {
    if (!this.audioBtn) return;
    this.audioBtn.setAttribute('aria-pressed', String(isPlaying));
    const iconMuted = this.audioBtn.querySelector('.audio-icon-muted');
    const iconPlaying = this.audioBtn.querySelector('.audio-icon-playing');
    if (iconMuted && iconPlaying) {
      iconMuted.style.display = isPlaying ? 'none' : 'block';
      iconPlaying.style.display = isPlaying ? 'block' : 'none';
    }
  }

  /* =========================================================================
     6. RENDER LOOP, ORGANIC GAIT, FREE LOOK & ACOUSTIC TIMING
     ========================================================================= */
  startLoop() {
    this.isRunning = true;
    const render = () => {
      if (!this.isRunning) return;
      this._rafId = requestAnimationFrame(render);
      const delta = Math.min(this.clock.getDelta(), 0.1);
      const time = this.clock.getElapsedTime();

      this.updateCamera(delta, time);
      this.renderer.render(this.scene, this.camera);
    };
    this._rafId = requestAnimationFrame(render);
  }

  stopLoop() {
    this.isRunning = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  getSurfaceAtProgress(t) {
    if (t < 0.12) return 'parquet';
    if (t < 0.62) return 'carpet';
    if (t < 0.88) return 'timber';
    return 'stone';
  }

  triggerAcousticFootstep(isLeftFoot, intensity) {
    if (!this.footstepSynth) return;
    const surface = this.getSurfaceAtProgress(this.currentProgress);
    this.footstepSynth.playStep(surface, isLeftFoot, intensity);
  }

  updateCamera(delta, time) {
    // 1. Continuous Keyboard Walking & Turning
    let keyWalk = 0;
    if (this.keysDown['KeyW'] || this.keysDown['ArrowUp']) keyWalk += 1;
    if (this.keysDown['KeyS'] || this.keysDown['ArrowDown']) keyWalk -= 1;
    if (keyWalk !== 0) {
      this.targetProgress = Math.max(0.0, Math.min(1.0, this.targetProgress + keyWalk * delta * 0.16));
    }

    let keyTurn = 0;
    if (this.keysDown['ArrowLeft']) keyTurn += 1;
    if (this.keysDown['ArrowRight']) keyTurn -= 1;
    if (keyTurn !== 0) {
      this.dragYawOffset = Math.max(-0.6, Math.min(0.6, this.dragYawOffset + keyTurn * delta * 0.8));
    }

    // Lateral Strafe Exploration (KeyA = Strafe Left, KeyD = Strafe Right)
    let keyStrafe = 0;
    if (this.keysDown['KeyA']) keyStrafe -= 1;
    if (this.keysDown['KeyD']) keyStrafe += 1;
    if (keyStrafe !== 0) {
      this.targetStrafeX = Math.max(-2.2, Math.min(2.2, this.targetStrafeX + keyStrafe * delta * 2.8));
    } else {
      // Gentle natural self-stabilizing centering towards aisle center
      this.targetStrafeX *= Math.max(0, 1.0 - delta * 1.6);
    }
    this.strafeX += (this.targetStrafeX - this.strafeX) * 0.14;

    // 2. Smooth Lerp Camera Trajectory
    this.currentProgress += (this.targetProgress - this.currentProgress) * 0.12;
    if (Math.abs(this.targetProgress - this.currentProgress) < 0.0004) {
      this.currentProgress = this.targetProgress;
    }
    const t = Math.max(0, Math.min(1, this.currentProgress));

    // 3. Physical Locomotion Kinematics (Organic Gait & Velocity)
    const dProg = this.currentProgress - this.lastProgress;
    this.lastProgress = this.currentProgress;
    const rawVelocity = Math.abs(dProg) / Math.max(0.0005, delta);
    this.smoothedVelocity += (rawVelocity - this.smoothedVelocity) * 0.14;

    const isWalking = (this.smoothedVelocity > 0.008) || (Math.abs(keyStrafe) > 0);
    const targetIntensity = isWalking ? Math.min(1.0, Math.max(this.smoothedVelocity * 1.8, Math.abs(keyStrafe) * 0.72)) : 0.0;
    this.walkIntensity += (targetIntensity - this.walkIntensity) * (isWalking ? 0.25 : 0.10);

    if (this.walkIntensity > 0.01) {
      // Step phase accumulation based on walking cadence
      const stepSpeed = Math.PI * 2 * this.gaitFrequency * Math.max(0.7, Math.min(1.6, this.smoothedVelocity * 1.2));
      this.stepPhase += delta * stepSpeed;

      // Detect bottom of footfall cycle (multiples of PI)
      const stepCycle = Math.floor(this.stepPhase / Math.PI);
      if (stepCycle !== this.lastStepCycle && this.walkIntensity > 0.16) {
        this.lastStepCycle = stepCycle;
        const isLeftFoot = (stepCycle % 2 === 0);
        this.triggerAcousticFootstep(isLeftFoot, this.walkIntensity);
      }
    }

    // Sinusoidal Head-Bob Kinematics
    const bobY = Math.sin(this.stepPhase * 2.0) * this.bobAmplitude * this.walkIntensity;
    const swayX = Math.cos(this.stepPhase) * this.swayAmplitude * this.walkIntensity;
    const gaitRoll = -Math.sin(this.stepPhase) * this.rollAmplitude * this.walkIntensity;

    // Resting breathing micro-sway when motionless
    const idleBreathY = Math.sin(time * 1.5) * 0.0035 * (1.0 - this.walkIntensity);
    const idleBreathX = Math.cos(time * 0.9) * 0.0025 * (1.0 - this.walkIntensity);

    // 4. Free-Look & Mouse Gaze Smoothing
    this.camYaw += (this.targetCamYaw + this.dragYawOffset - this.camYaw) * 0.08;
    this.camPitch += (this.targetCamPitch + this.dragPitchOffset - this.camPitch) * 0.08;
    this.dragYawOffset *= 0.94;
    this.dragPitchOffset *= 0.94;

    // 5. Update Camera Position & First-Person Orientation
    const totalZDist = 40;
    const currentZ = 26 - t * totalZDist;

    // Smooth Orrery Chamber Viewpoint Lerp
    if (this.isInsideOrrery) {
      this.orreryCamGlide += (1.0 - this.orreryCamGlide) * 0.12;
    } else {
      this.orreryCamGlide += (0.0 - this.orreryCamGlide) * 0.12;
    }

    const walkX = this.strafeX + swayX + idleBreathX + this.camYaw * 0.15;
    const walkY = bobY + idleBreathY - this.camPitch * 0.10;
    const walkZ = currentZ;

    const orreryTargetX = 6.2 + swayX * 0.15 + this.camYaw * 0.15;
    const orreryTargetY = 0.20 + bobY * 0.15 - this.camPitch * 0.10;
    const orreryTargetZ = 3.25;

    this.camera.position.x = walkX * (1 - this.orreryCamGlide) + orreryTargetX * this.orreryCamGlide;
    this.camera.position.y = walkY * (1 - this.orreryCamGlide) + orreryTargetY * this.orreryCamGlide;
    this.camera.position.z = walkZ * (1 - this.orreryCamGlide) + orreryTargetZ * this.orreryCamGlide;

    this.camera.rotation.y = this.camYaw;
    this.camera.rotation.x = this.camPitch;
    this.camera.rotation.z = gaitRoll - this.camYaw * 0.035;

    // 5B. Animate Handheld Brass Lantern flame micro-flicker & physical gait inertia
    if (this.isLanternOn && this.lanternLight) {
      const flicker = 1.0 + Math.sin(time * 8.5) * 0.05 + Math.sin(time * 19.3) * 0.035 + (Math.random() - 0.5) * 0.025;
      this.lanternLight.intensity = this.lanternBaseIntensity * flicker;
      const swayLanternX = 0.40 + Math.cos(this.stepPhase) * 0.04 * this.walkIntensity;
      const swayLanternY = -0.30 + Math.sin(this.stepPhase * 2.0) * 0.025 * this.walkIntensity;
      this.lanternLight.position.set(swayLanternX, swayLanternY, -0.55);
    }

    // 6. Animate Grand Entrance Doorway Threshold
    this.updateThresholdDoorway(t);

    // 7. Update Station Visual Planes
    this.updateStationPlanes(t, currentZ);

    // 8. Animate Atmospheric Golden Dust Motes
    if (this.dustParticles && this.dustParticles.geometry) {
      const pos = this.dustParticles.geometry.attributes.position.array;
      for (let i = 0; i < this.dustParticles.geometry.attributes.position.count; i++) {
        pos[i * 3 + 1] += Math.sin(time + i) * 0.001 - 0.0004;
        if (pos[i * 3 + 1] < -4.5) pos[i * 3 + 1] = 4.5;
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 9. Animate Phase 4 World Features
    this.updateSecretPassage(time, delta);
    this.updateCelestialOrrery(time, delta);
    this.updateVolumetricGodRays(time);

    this.updateHUD(t);
  }

  /* =========================================================================
     7. ENTRANCE THRESHOLD DOORWAY ANIMATION (Station 0)
     ========================================================================= */
  updateThresholdDoorway(t) {
    return; // Open colonnade view without door slices
    if (!this.doorPortalGroup || !this.leftDoorPivot || !this.rightDoorPivot) return;

    if (t < 0.08) {
      this.doorPortalGroup.visible = true;

      // Door opening swing progression (0.0 to 0.055)
      const openProgress = Math.min(1.0, t / 0.055);
      const easedOpen = openProgress * openProgress * (3 - 2 * openProgress);

      // Swing doors open inward into the colonnade (~75°)
      const maxSwingAngle = 75 * Math.PI / 180;
      this.leftDoorPivot.rotation.y = - easedOpen * maxSwingAngle;
      this.rightDoorPivot.rotation.y = + easedOpen * maxSwingAngle;

      // Part doors laterally as they swing open
      this.leftDoorPivot.position.x = -2.25 - easedOpen * 0.45;
      this.rightDoorPivot.position.x = 2.25 + easedOpen * 0.45;

      // Smoothly fade out as user steps past the threshold
      if (t > 0.045) {
        const fade = Math.max(0, Math.min(1, 1.0 - (t - 0.045) / 0.03));
        if (this.doorMaterial) this.doorMaterial.opacity = fade;
      } else {
        if (this.doorMaterial) this.doorMaterial.opacity = 1.0;
      }
    } else {
      this.doorPortalGroup.visible = false;
      if (this.doorMaterial) this.doorMaterial.opacity = 0.0;
    }
  }

  /* =========================================================================
     8. ZERO-GHOSTING STATION PROJECTION & COVER SCALING
     ========================================================================= */
  updateStationPlanes(t, currentZ) {
    if (this.isInsideOrrery) {
      // Hide all standard station planes
      this.stationPlanes.forEach(sp => {
        sp.mesh.visible = false;
        sp.material.opacity = 0.0;
      });

      // Display high-definition photorealistic Orrery Rotunda
      if (this.orreryMesh) {
        this.orreryMesh.visible = true;
        this.orreryMesh.material.opacity = 1.0;
        this.orreryMesh.position.set(
          this.camera.position.x,
          this.camera.position.y,
          this.camera.position.z - this.planeDistance
        );
        this.orreryMesh.renderOrder = 1;
      }
      return;
    }

    // Normal library station rendering
    if (this.orreryMesh) {
      this.orreryMesh.visible = false;
      this.orreryMesh.material.opacity = 0.0;
    }

    const N = this.stations.length - 1; // 4
    const p = Math.max(0, Math.min(N, t * N));
    const activeIdx = Math.floor(p);
    const u = p - activeIdx; // 0.0 to 1.0

    this.stationPlanes.forEach((sp, idx) => {
      // Keep active station planes centered along camera gaze to prevent edge voids
      sp.mesh.position.x = this.camera.position.x;
      sp.mesh.position.y = this.camera.position.y;

      if (activeIdx === N) {
        if (idx === N) {
          sp.mesh.visible = true;
          sp.material.opacity = 1.0;
          sp.mesh.position.z = currentZ - this.planeDistance;
          sp.mesh.renderOrder = 1;
        } else {
          sp.mesh.visible = false;
          sp.material.opacity = 0.0;
        }
        return;
      }

      // Crisp architectural threshold transition
      if (idx === activeIdx) {
        if (u < 0.75) {
          sp.mesh.visible = true;
          sp.material.opacity = 1.0;
          sp.mesh.position.z = currentZ - this.planeDistance + u * 0.75;
          sp.mesh.renderOrder = 1;
        } else if (u <= 0.90) {
          sp.mesh.visible = true;
          const trans = (u - 0.75) / 0.15;
          const ease = trans * trans * (3 - 2 * trans);
          sp.material.opacity = Math.max(0, 1.0 - ease);
          sp.mesh.position.z = currentZ - this.planeDistance + 0.75 + ease * 0.25;
          sp.mesh.renderOrder = 1;
        } else {
          sp.mesh.visible = false;
          sp.material.opacity = 0.0;
        }
      } else if (idx === activeIdx + 1) {
        if (u < 0.75) {
          sp.mesh.visible = false;
          sp.material.opacity = 0.0;
        } else if (u <= 0.90) {
          sp.mesh.visible = true;
          const trans = (u - 0.75) / 0.15;
          const ease = trans * trans * (3 - 2 * trans);
          sp.material.opacity = Math.min(1.0, ease);
          sp.mesh.position.z = currentZ - this.planeDistance - (1.0 - ease) * 0.25;
          sp.mesh.renderOrder = 2;
        } else {
          sp.mesh.visible = true;
          sp.material.opacity = 1.0;
          sp.mesh.position.z = currentZ - this.planeDistance - (1.0 - u) * 0.75;
          sp.mesh.renderOrder = 1;
        }
      } else {
        sp.mesh.visible = false;
        sp.material.opacity = 0.0;
      }
    });
  }

  updatePlaneCover() {
    if (!this.camera) return;
    const aspect = this.width / this.height;
    const vFovRad = (this.camera.fov * Math.PI) / 180;
    const visHeight = 2 * Math.tan(vFovRad / 2) * this.planeDistance;
    const visWidth = visHeight * aspect;

    const imgAspect = 16 / 9;
    let planeW, planeH;

    // Generous cover margin (1.42x) for 55° yaw and 35° pitch look-around
    const coverMargin = 2.15;

    if (aspect > imgAspect) {
      planeW = visWidth * coverMargin;
      planeH = planeW / imgAspect;
    } else {
      planeH = visHeight * coverMargin;
      planeW = planeH * imgAspect;
    }

    this.stationPlanes.forEach((sp) => {
      sp.mesh.scale.set(planeW / 16, planeH / 9, 1);
    });
    if (this.orreryMesh) {
      this.orreryMesh.scale.set(planeW / 16, planeH / 9, 1);
    }
  }

  /* =========================================================================
     9. DYNAMIC STATION HUDS & PROXIMITY
     ========================================================================= */
  updateHUD(t) {
    // 1. Identify nearest station
    let nearestStation = this.stations[0];
    let minDistance = 999;
    this.stations.forEach((s) => {
      const dist = Math.abs(t - s.progress);
      if (dist < minDistance) {
        minDistance = dist;
        nearestStation = s;
      }
    });

    // 2. Foyer Landing Hero
    if (this.foyerHeroEl) {
      if (t > 0.015) {
        this.foyerHeroEl.classList.add('fade-out');
        if (t > 0.12) {
          this.foyerHeroEl.hidden = true;
        }
      } else {
        this.foyerHeroEl.hidden = false;
        this.foyerHeroEl.classList.remove('fade-out');
      }
    }

    if (this.activeStation !== nearestStation) {
      this.activeStation = nearestStation;
      if (this.compassText) {
        this.compassText.textContent = nearestStation.locationTitle;
      }
      // Update Depth Track List
      this.depthItems.forEach((item) => {
        const idx = parseInt(item.getAttribute('data-station'), 10);
        if (idx === nearestStation.index) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      if (typeof this.onStationChange === 'function') {
        this.onStationChange(nearestStation);
      }
    }

    // 3. Update Depth Track Line Fill
    if (this.depthTrackFill) {
      this.depthTrackFill.style.height = `${t * 100}%`;
    }

    // 4. Unified Exploration HUD Prompt
    if (this.explorationPromptEl) {
      const isNearStation = minDistance < 0.12 && nearestStation.index > 0 && !this.isInsideOrrery && !this.isLecternOpen && (!this.catalogModal || this.catalogModal.hidden);
      
      if (isNearStation) {
        this.explorationPromptEl.hidden = false;
        this.renderExplorationPrompt(nearestStation);
      } else {
        this.explorationPromptEl.hidden = true;
      }
    }

    if (typeof this.onProgressChange === 'function') {
      this.onProgressChange(t);
    }
  }

  renderExplorationPrompt(station) {
    if (!this.promptIcon || !this.promptKicker || !this.promptTitle || !this.promptActions) return;

    if (this._renderedPromptStation === station.index) return;
    this._renderedPromptStation = station.index;

    const book = this.shelfBooks[station.index] || this.shelfBooks[2];
    const shortBookTitle = book ? `${book.title}` : 'Rare Volume';

    if (station.index === 1) {
      this.promptIcon.textContent = '🏛️';
      this.promptKicker.textContent = 'STATION 1 · CIRCULATION DESK';
      this.promptTitle.textContent = 'Oak Card Catalog & Archives';
      this.promptActions.innerHTML = `
        <button type="button" class="hud-action-chip primary" data-action="catalog">
          <kbd>[E]</kbd> <span>Search Card Index</span>
        </button>
        <button type="button" class="hud-action-chip" data-action="pull-book">
          <kbd>[F]</kbd> <span>Pull ${shortBookTitle}</span>
        </button>
        <button type="button" class="hud-action-chip" data-action="atelier">
          <kbd>[Enter]</kbd> <span>Specimen Atelier</span>
        </button>
      `;
    } else if (station.index === 2) {
      this.promptIcon.textContent = '📖';
      this.promptKicker.textContent = 'STATION 2 · GRAND READING HALL';
      this.promptTitle.textContent = 'Silent Scholarly Sanctuary';
      const secretLabel = this.isSecretPassageOpen ? 'Enter Celestial Orrery' : 'Reveal Keystone Grimoire';
      this.promptActions.innerHTML = `
        <button type="button" class="hud-action-chip primary" data-action="inspect">
          <kbd>[E]</kbd> <span>Study at Reading Desk</span>
        </button>
        <button type="button" class="hud-action-chip" data-action="pull-book">
          <kbd>[F]</kbd> <span>Pull ${shortBookTitle}</span>
        </button>
        <button type="button" class="hud-action-chip secret-chip" data-action="secret-passage">
          <kbd>[X]</kbd> <span>${secretLabel}</span>
        </button>
      `;
    } else if (station.index === 3) {
      this.promptIcon.textContent = '⚖️';
      this.promptKicker.textContent = 'STATION 3 · BINDERY LAB';
      this.promptTitle.textContent = 'Hand Conservation & Tooling Atelier';
      this.promptActions.innerHTML = `
        <button type="button" class="hud-action-chip primary" data-action="inspect">
          <kbd>[E]</kbd> <span>Enter Craft Bench</span>
        </button>
        <button type="button" class="hud-action-chip" data-action="pull-book">
          <kbd>[F]</kbd> <span>Pull ${shortBookTitle}</span>
        </button>
        <button type="button" class="hud-action-chip" data-action="atelier">
          <kbd>[Enter]</kbd> <span>Conservator's Workbench</span>
        </button>
      `;
    } else if (station.index === 4) {
      this.promptIcon.textContent = '🔒';
      this.promptKicker.textContent = 'STATION 4 · CLIMATE VAULT';
      this.promptTitle.textContent = 'Sub-Level Incunabula Strongroom';
      this.promptActions.innerHTML = `
        <button type="button" class="hud-action-chip primary" data-action="inspect">
          <kbd>[E]</kbd> <span>Inspect Codex in Vitrine</span>
        </button>
        <button type="button" class="hud-action-chip" data-action="pull-book">
          <kbd>[F]</kbd> <span>Pull ${shortBookTitle}</span>
        </button>
        <button type="button" class="hud-action-chip" data-action="atelier">
          <kbd>[Enter]</kbd> <span>Conservator's Workbench</span>
        </button>
      `;
    }
  }

  handleResize() {
    this.width = this.mount.clientWidth || window.innerWidth;
    this.height = this.mount.clientHeight || window.innerHeight;
    if (this.camera && this.renderer) {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.updatePlaneCover();
    }
  }

  setTheme(theme) {
    // Retains rich photographic contrast in both light and dark themes
  }


  /* =========================================================================
     PHASE 4: PROCEDURAL VOLUMETRIC GOD-RAYS, SECRET PASSAGE & CELESTIAL ORRERY
     ========================================================================= */
  createGodRayTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 512);

    // Vertical falloff gradient (warm golden sunbeam)
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, 'rgba(255, 238, 185, 0)');
    grad.addColorStop(0.15, 'rgba(255, 232, 175, 0.45)');
    grad.addColorStop(0.55, 'rgba(245, 205, 140, 0.22)');
    grad.addColorStop(1, 'rgba(220, 175, 90, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 512);

    // Subtle atmospheric dust striations
    ctx.fillStyle = 'rgba(255, 245, 220, 0.04)';
    for (let i = 0; i < 18; i++) {
      const rx = 35 + Math.random() * 186;
      const rw = 2 + Math.random() * 6;
      ctx.fillRect(rx, 20, rw, 470);
    }

    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  buildVolumetricGodRays() {
    this.godRays = [];
    this.godRayTexture = this.createGodRayTexture();

    // High clerestory window rays positioned near upper arches, never blocking floor gaze
    const rayConfigs = [
      { name: 'foyer_ray', x: -4.2, y: 3.8, z: 19.5, rx: 0.10, ry: 0.22, rz: -0.32, w: 4.8, h: 9.0, baseOpacity: 0.16 },
      { name: 'circulation_ray', x: 4.0, y: 3.6, z: 9.5, rx: -0.10, ry: -0.20, rz: 0.32, w: 4.5, h: 8.8, baseOpacity: 0.18 },
      { name: 'reading_ray', x: -3.8, y: 4.0, z: -0.5, rx: 0.08, ry: 0.18, rz: -0.28, w: 5.0, h: 9.5, baseOpacity: 0.20 },
      { name: 'bindery_ray', x: 3.5, y: 3.6, z: -10.5, rx: -0.08, ry: -0.18, rz: 0.28, w: 4.2, h: 8.5, baseOpacity: 0.16 },
      { name: 'vault_ray', x: -3.2, y: 3.4, z: -20.5, rx: 0.06, ry: 0.15, rz: -0.24, w: 3.8, h: 7.8, baseOpacity: 0.14 }
    ];

    rayConfigs.forEach(cfg => {
      const geo = new THREE.PlaneGeometry(cfg.w, cfg.h);
      const mat = new THREE.MeshBasicMaterial({
        map: this.godRayTexture,
        transparent: true,
        opacity: cfg.baseOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      mesh.rotation.set(cfg.rx, cfg.ry, cfg.rz);
      this.worldGroup.add(mesh);
      this.godRays.push({ mesh, material: mat, baseOpacity: cfg.baseOpacity });
    });
  }



  handleSecretPassageAction() {
    this.ensureAudioContext();
    if (!this.isSecretPassageOpen) {
      this.toggleSecretPassage();
    } else if (!this.isInsideOrrery) {
      this.enterOrreryRotunda();
    } else {
      this.exitOrreryRotunda();
    }
  }

  toggleSecretPassage() {
    this.ensureAudioContext();
    this.isSecretPassageOpen = !this.isSecretPassageOpen;
    this._renderedPromptStation = null;
    this.targetSecretDoorAngle = this.isSecretPassageOpen ? -Math.PI * 0.48 : 0.0;

    if (this.footstepSynth && typeof this.footstepSynth.playDoorCreak === 'function') {
      this.footstepSynth.playDoorCreak(this.isSecretPassageOpen);
    }

    if (this.isSecretPassageOpen) {
      if (this.secretPromptTitle) this.secretPromptTitle.textContent = "Secret Passage Open · Ancient Copernican Sanctuary";
      if (this.secretPromptCta) this.secretPromptCta.textContent = "✦ Press X or Click to Enter Celestial Orrery Rotunda";
    } else {
      if (this.isInsideOrrery) {
        this.exitOrreryRotunda();
      }
      if (this.secretPromptTitle) this.secretPromptTitle.textContent = "Keystone Volume · Tabulae Rudolphinae";
      if (this.secretPromptCta) this.secretPromptCta.textContent = "✦ Press X or Click to Reveal Secret Passage";
    }
  }

  enterOrreryRotunda() {
    this.ensureAudioContext();
    this.isInsideOrrery = true;
    document.body.classList.add('in-orrery');

    if (this.compassText) {
      this.compassText.textContent = "Secret Rotunda — Celestial Clockwork Orrery";
    }

    if (this.footstepSynth && typeof this.footstepSynth.playCelestialChime === 'function') {
      this.footstepSynth.playCelestialChime();
    }

    this.orreryHudEl = document.getElementById('orrery-hud-overlay');
    if (this.orreryHudEl) this.orreryHudEl.hidden = false;

    if (this.explorationPromptEl) this.explorationPromptEl.hidden = true;
  }

  exitOrreryRotunda() {
    this.ensureAudioContext();
    this.isInsideOrrery = false;
    document.body.classList.remove('in-orrery');

    if (this.compassText && this.activeStation) {
      this.compassText.textContent = this.activeStation.locationTitle;
    }

    if (this.footstepSynth && typeof this.footstepSynth.playDoorCreak === 'function') {
      this.footstepSynth.playDoorCreak(false);
    }

    this.orreryHudEl = document.getElementById('orrery-hud-overlay');
    if (this.orreryHudEl) this.orreryHudEl.hidden = true;

    this._renderedPromptStation = null;
    if (this.explorationPromptEl && Math.abs(this.currentProgress - 0.50) < 0.12) {
      this.explorationPromptEl.hidden = false;
    }
  }

  cycleOrrerySpeed() {
    this.ensureAudioContext();
    if (this.orrerySpeedMultiplier === 1.0) {
      this.orrerySpeedMultiplier = 2.5;
    } else if (this.orrerySpeedMultiplier === 2.5) {
      this.orrerySpeedMultiplier = 6.0;
    } else {
      this.orrerySpeedMultiplier = 1.0;
    }

    const labelEl = document.getElementById('orrery-speed-label');
    if (labelEl) {
      labelEl.textContent = `⚡ Orbit: ${this.orrerySpeedMultiplier}x Speed`;
    }

    if (this.footstepSynth && typeof this.footstepSynth.playGearTick === 'function') {
      this.footstepSynth.playGearTick();
    }
  }

  updateSecretPassage(time, delta) {
    // Smooth bookcase door hinge rotation
    this.secretDoorAngle += (this.targetSecretDoorAngle - this.secretDoorAngle) * 0.08;
    if (this.secretBookcasePivot) {
      this.secretBookcasePivot.rotation.y = this.secretDoorAngle;
    }

    // Pulse Keystone Volume ("Tabulae Rudolphinae") emissive aura
    if (this.keystoneBookMesh && this.keystoneBookMesh.material) {
      const pulse = 0.55 + Math.sin(time * 3.2) * 0.25;
      this.keystoneBookMesh.material.emissiveIntensity = pulse;
    }

    // Flicker secret sconce candle flame
    if (this.sconceLight) {
      this.sconceLight.intensity = 1.4 + Math.sin(time * 12.0) * 0.2 + (Math.random() - 0.5) * 0.1;
    }
  }

  updateCelestialOrrery(time, delta) {
    if (!this.isInsideOrrery) return;

    // Procedural Escapement Ticking Sound when inside orrery
    const tickInterval = 0.60 / this.orrerySpeedMultiplier;
    if (time - this.lastGearTickTime >= tickInterval) {
      this.lastGearTickTime = time;
      if (this.footstepSynth && typeof this.footstepSynth.playGearTick === 'function') {
        this.footstepSynth.playGearTick();
      }
    }
  }

  updateSecretPassage(time, delta) {
    // Secret passage state is tracked cleanly without low-poly mesh clutter
  }

  updateVolumetricGodRays(time) {
    if (!this.godRays) return;
    this.godRays.forEach((r, idx) => {
      if (r.mesh && r.material) {
        const breathe = 0.95 + Math.sin(time * 0.8 + idx * 1.3) * 0.08;
        if (this.currentWeather === 'rain') {
          r.material.opacity = r.baseOpacity * 0.50 * breathe;
        } else if (this.currentWeather === 'golden') {
          r.material.opacity = r.baseOpacity * 1.55 * breathe;
        } else {
          r.material.opacity = r.baseOpacity * breathe;
        }
      }
    });
  }

  /**
   * Dispose GPU resources owned by this engine's scene. Geometries, materials
   * and textures are built per instance, so they are safe to free; the seen-sets
   * keep shared references from being disposed twice.
   */
  disposeScene() {
    if (!this.scene) return;
    const seenGeo = new Set();
    const seenMat = new Set();
    const seenTex = new Set();
    this.scene.traverse((obj) => {
      if (obj.geometry && !seenGeo.has(obj.geometry)) {
        seenGeo.add(obj.geometry);
        obj.geometry.dispose();
      }
      const mats = Array.isArray(obj.material)
        ? obj.material
        : (obj.material ? [obj.material] : []);
      mats.forEach((m) => {
        if (!m || seenMat.has(m)) return;
        seenMat.add(m);
        ['map', 'normalMap', 'roughnessMap', 'emissiveMap', 'alphaMap'].forEach((slot) => {
          const tex = m[slot];
          if (tex && !seenTex.has(tex)) {
            seenTex.add(tex);
            tex.dispose();
          }
        });
        m.dispose();
      });
    });
    this.scene.clear();
  }

  destroy() {
    this.stopLoop();
    // Detach every listener registered in bindEvents (wheel, pointer, touch,
    // keyboard, ~15 HUD buttons, resize) — previously none were removed, and
    // the global keydown handler kept acting on specimen-mode keystrokes.
    if (this._events) {
      this._events.abort();
      this._events = null;
    }
    this.stopAmbientSoundscape();
    document.body.classList.remove('in-orrery');
    if (window.walkthroughEngine === this) window.walkthroughEngine = null;
    this.disposeScene();
    if (this.audioCtx) {
      try { this.audioCtx.close(); } catch (_) {}
    }
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}

// Attach to global window
if (typeof window !== 'undefined') {
  window.LibraryWalkthroughEngine = LibraryWalkthroughEngine;
}
