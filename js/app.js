// Biblio Atelier - Observable Specimen Controller (Specimen Design Guide Alignment)

document.addEventListener('DOMContentLoaded', () => {
  const readStorage = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  };

  // 1. Core State
  let volumes = Array.isArray(window.LIBRARY_DATA) ? window.LIBRARY_DATA : [];
  let activeVolume = volumes[0] || null;
  let favorites = readStorage('biblio_favorites', []);
  let userNotes = readStorage('biblio_notes', {});
  if (!Array.isArray(favorites)) favorites = [];
  if (!userNotes || Array.isArray(userNotes) || typeof userNotes !== 'object') userNotes = {};
  let currentQuizIndex = 0;
  let quizScore = 0;
  let quizAdvanceTimer = null;
  let walkthroughEngine = null;
  let threeViewer = null;
  let activeExperienceMode = 'walkthrough';

  // Browser localStorage is typically 5 MB total; cap a single note well below that
  // so one note can never be the thing that exhausts the quota.
  const MAX_NOTE_LENGTH = 20000;

  // ——— Theme (light / dark) ———
  function getPreferredTheme() {
    const stored = localStorage.getItem('biblio_theme');
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  function applyTheme(theme, { persist = true } = {}) {
    const next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    if (persist) {
      try { localStorage.setItem('biblio_theme', next); } catch (_) { /* ignore */ }
    }
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      const isDark = next === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
    // Sync meta theme-color for mobile browser chrome.
    // index.html ships two media-scoped meta tags; add an unscoped one that JS owns.
    let metaTheme = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute('content', next === 'dark' ? '#12100e' : '#f7f0e7');
    // Keep the WebGL studio background in sync
    if (threeViewer && typeof threeViewer.setTheme === 'function') {
      threeViewer.setTheme(next);
    }
    if (typeof walkthroughEngine !== 'undefined' && walkthroughEngine && typeof walkthroughEngine.setTheme === 'function') {
      walkthroughEngine.setTheme(next);
    }
  }

  // Initialize Practice Engine
  const practiceEngine = typeof window.PracticeEngine !== 'undefined' ? new window.PracticeEngine() : null;

  // Initialize editorial Feature Page (per-module deep-reading layer)
  const featurePageEl = document.getElementById('feature-page');
  const featurePage = (typeof window.FeaturePage !== 'undefined' && featurePageEl)
    ? new window.FeaturePage(featurePageEl)
    : null;

  // Initialize Folio Book Reader
  const bookReaderEl = document.getElementById('book-reader-modal');
  const bookReader = (typeof window.BookReader !== 'undefined' && bookReaderEl)
    ? new window.BookReader(bookReaderEl)
    : null;

  // 2. DOM Element References
  const volumeListEl = document.getElementById('volume-list');
  const searchInputEl = document.getElementById('search-input');
  const threeMountEl = document.getElementById('three-mount');
  const hotspotOverlayEl = document.getElementById('hotspot-overlay');
  const viewerGlowEl = document.getElementById('viewer-glow');
  const autoRotateToggle = document.getElementById('auto-rotate-toggle');
  const layerHud = document.getElementById('layer-hud');
  const layerHudText = document.getElementById('layer-hud-text');
  
  // Info Panel Elements
  const kickerEl = document.getElementById('info-kicker');
  const titleEl = document.getElementById('info-title');
  const subtitleEl = document.getElementById('info-subtitle');
  const stampEl = document.getElementById('specimen-stamp');
  const descEl = document.getElementById('info-desc');
  const keyFactsEl = document.getElementById('key-facts-grid');
  const scholarlyNoteEl = document.getElementById('scholarly-note-text');
  const didYouKnowEl = document.getElementById('did-you-know-text');
  const hotspotIndexEl = document.getElementById('hotspot-index-list');
  const viewCaptionTitle = document.getElementById('view-caption-title');
  const viewerRenderStatus = document.getElementById('viewer-render-status');
  const practicePanelContainer = document.getElementById('practice-panel-container');

  // Bottom Interactive Mount Points
  const callSandboxMount = document.getElementById('call-sandbox-mount');
  const marcPracticeMount = document.getElementById('marc-practice-mount');
  const scenariosMount = document.getElementById('scenarios-mount');
  const mustieMount = document.getElementById('mustie-mount');

  // Modals
  const readerModal = document.getElementById('reader-modal');
  const readerTitle = document.getElementById('reader-modal-title');
  const readerPre = document.getElementById('reader-text-content');
  const closeReaderBtn = document.getElementById('close-reader-modal');
  
  const quizModal = document.getElementById('quiz-modal');
  const quizTitle = document.getElementById('quiz-title');
  const quizContainer = document.getElementById('quiz-container');
  const closeQuizBtn = document.getElementById('close-quiz-modal');

  const hotspotModal = document.getElementById('hotspot-modal');
  const hotspotTitle = document.getElementById('hotspot-modal-title');
  const hotspotLessonText = document.getElementById('hotspot-lesson-text');
  const hotspotQuizContainer = document.getElementById('hotspot-quiz-container');
  const closeHotspotBtn = document.getElementById('close-hotspot-modal');

  const certModal = document.getElementById('cert-modal');
  const openCertBtn = document.getElementById('open-cert-btn');
  const closeCertBtn = document.getElementById('close-cert-modal');
  const printCertBtn = document.getElementById('print-cert-btn');
  const badgesDisplayList = document.getElementById('badges-display-list');
  const progressListEl = document.getElementById('progress-display-list');

  const notesModal = document.getElementById('notes-modal');
  const notesTextarea = document.getElementById('notes-textarea');
  const saveNotesBtn = document.getElementById('save-notes-btn');
  const closeNotesBtn = document.getElementById('close-notes-modal');

  let lastFocusedElement = null;
  const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  // The background is made inert while any full-screen dialog is open so keyboard and
  // screen-reader focus cannot wander behind the overlay.
  let backgroundInertDepth = 0;
  function setBackgroundInert(on) {
    const appShell = document.querySelector('.app-shell');
    const header = document.querySelector('.topbar');
    const studyStrip = document.querySelector('.study-strip-heading');
    if (!appShell) return;
    backgroundInertDepth = on ? backgroundInertDepth + 1 : Math.max(0, backgroundInertDepth - 1);
    const inert = backgroundInertDepth > 0;
    [appShell, header, studyStrip].forEach((el) => {
      if (!el) return;
      if (inert) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
      if (inert) el.setAttribute('aria-hidden', 'true');
      else el.removeAttribute('aria-hidden');
    });
  }

  /** True when any full-screen dialog (modal, feature page, book reader) is open. */
  function anyDialogOpen() {
    return !!document.querySelector(
      '.modal-backdrop.open, .feature-page.open, .folio-reader-modal.open'
    );
  }

  function openModal(modal, focusSelector) {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setBackgroundInert(true);
    const target = focusSelector ? modal.querySelector(focusSelector) : modal.querySelector(focusableSelector);
    requestAnimationFrame(() => target?.focus());
  }

  function closeModal(modal) {
    if (!modal) return;
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (!anyDialogOpen()) setBackgroundInert(false);
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  // 3. Initialize Three.js 3D Specimen Viewer & Walkthrough Engine State
  let compareMode = false;
  let compareReferenceId = null;
  let selectedHotspot = null;
  let layerHudTimeout = null;
  let layerHudFadeTimeout = null;

  function showLayerHud(info) {
    if (!layerHud || !layerHudText || !info) return;
    layerHudText.textContent = info.label;
    layerHud.hidden = false;
    layerHud.classList.remove('fade-out');
    // Both timers must be cleared: rapid layer toggles otherwise leave the fade
    // timer from the previous call running and hide the HUD under a fresh message.
    clearTimeout(layerHudTimeout);
    clearTimeout(layerHudFadeTimeout);
    layerHudTimeout = setTimeout(() => {
      layerHud.classList.add('fade-out');
      layerHudFadeTimeout = setTimeout(() => { layerHud.hidden = true; }, 300);
    }, 2400);
  }

  const calloutEl = document.getElementById('hotspot-callout');
  const calloutTitle = document.getElementById('callout-title');
  const calloutDesc = document.getElementById('callout-desc');
  const calloutClose = document.getElementById('callout-close');
  const calloutLearn = document.getElementById('callout-learn');
  const compareStrip = document.getElementById('compare-strip');

  function updateCallout(hs) {
    selectedHotspot = hs;
    if (!calloutEl) return;
    if (!hs) {
      calloutEl.hidden = true;
      return;
    }
    if (calloutTitle) calloutTitle.textContent = hs.name;
    if (calloutDesc) calloutDesc.textContent = hs.desc || hs.lesson || '';
    calloutEl.hidden = false;
  }

  const modelLoader = document.getElementById('model-loader');
  const loaderTitle = document.getElementById('loader-title');
  const tourProgress = document.getElementById('tour-progress');
  const tourProgressLabel = document.getElementById('tour-progress-label');
  const tourBarFill = document.getElementById('tour-bar-fill');

  const walkthroughMountEl = document.getElementById('walkthrough-canvas-container');
  const specimenMountEl = document.getElementById('specimen-canvas-container') || threeMountEl;
  const walkthroughHud = document.getElementById('walkthrough-hud');
  const btnModeWalkthrough = document.getElementById('btn-mode-walkthrough');
  const btnModeSpecimen = document.getElementById('btn-mode-specimen');
  const switchToSpecimenBtn = document.getElementById('switch-to-specimen-btn');

  // Initialize Library Walkthrough 3D Engine
  if (typeof window.LibraryWalkthroughEngine !== 'undefined' && walkthroughMountEl) {
    try {
      window.walkthroughEngine = walkthroughEngine = new window.LibraryWalkthroughEngine(walkthroughMountEl, {
        onStationChange: (station) => {
          if (viewCaptionTitle) {
            viewCaptionTitle.textContent = station.name;
          }
        },
        onInspectStation: (station) => {
          const targetVol = volumes.find(v => v.id === station.specimenModuleId) || volumes[0];
          if (targetVol) {
            selectVolume(targetVol);
          }
          if (threeViewer) {
            if (station && station.image) {
              threeViewer.setStationBackdrop(station.image);
            }
            threeViewer.performEntrySwoop();
          }
          setExperienceMode('specimen');
        }
      });
    } catch (err) {
      console.warn('Walkthrough engine unavailable:', err);
      walkthroughEngine = null;
    }
  }

  // Initialize ThreeBookViewer on specimenMountEl
  if (typeof window.ThreeBookViewer !== 'undefined' && specimenMountEl) {
    try {
      threeViewer = new window.ThreeBookViewer(specimenMountEl, hotspotOverlayEl, {
      onHotspotSelect: (hs) => {
        updateCallout(hs);
        document.querySelectorAll('.hotspot-index-btn').forEach(b => {
          b.classList.toggle('active', hs && b.getAttribute('data-hs') === hs.id);
        });
      },
      onBookSelect: (bookData) => {
        if (bookReader) {
          bookReader.open(bookData);
        }
      },
      onTourEnd: () => {
        document.getElementById('animate-action-btn')?.classList.remove('active');
        if (tourProgress) tourProgress.hidden = true;
      },
      onTourProgress: (info) => {
        if (!tourProgress) return;
        if (!info.active) {
          tourProgress.hidden = true;
          return;
        }
        tourProgress.hidden = false;
        const name = info.hotspot ? info.hotspot.name : 'Feature';
        if (tourProgressLabel) {
          tourProgressLabel.textContent = `Tour ${info.index + 1}/${info.total} · ${name}`;
        }
        if (tourBarFill) {
          const pct = Math.min(100, Math.round((info.progress || 0) * 100));
          tourBarFill.style.width = `${pct}%`;
        }
      },
      onLoadStart: (vol) => {
        if (!modelLoader) return;
        modelLoader.hidden = false;
        if (loaderTitle) {
          loaderTitle.textContent = `Preparing the ${(vol.specimen && vol.specimen.name) || vol.title}`;
        }
      },
      onLoadEnd: () => {
        if (modelLoader) modelLoader.hidden = true;
      },
      onLayerChange: (info) => {
        showLayerHud(info);
      }
      });
      if (calloutEl && threeViewer.attachCallout) {
        threeViewer.attachCallout(calloutEl);
      }
      window.threeViewer = threeViewer;
      window.volumes = volumes;
    } catch (err) {
      threeViewer = null;
      console.warn('3D specimen viewer unavailable:', err);
    }
  }

  function setExperienceMode(mode) {
    activeExperienceMode = mode;
    const isWalk = mode === 'walkthrough';

    document.body.classList.toggle('mode-walkthrough', isWalk);
    document.body.classList.toggle('mode-specimen', !isWalk);

    if (btnModeWalkthrough) {
      btnModeWalkthrough.classList.toggle('active', isWalk);
      btnModeWalkthrough.setAttribute('aria-selected', String(isWalk));
    }
    if (btnModeSpecimen) {
      btnModeSpecimen.classList.toggle('active', !isWalk);
      btnModeSpecimen.setAttribute('aria-selected', String(!isWalk));
    }

    if (walkthroughMountEl && specimenMountEl) {
      walkthroughMountEl.style.display = isWalk ? 'block' : 'none';
      specimenMountEl.style.display = isWalk ? 'none' : 'block';
    }

    if (walkthroughHud) {
      walkthroughHud.hidden = !isWalk;
    }

    document.querySelectorAll('.viewer-tools, .auto-rotate, .hotspot-index, .tip-note, .view-caption, .diagnostic-telemetry-overlay, #micro-loupe-lens, #xrf-hud-panel, #provenance-hud-panel, #hydration-hud-panel').forEach(el => {
      el.style.display = isWalk ? 'none' : '';
    });

    if (isWalk) {
      if (threeViewer && threeViewer.loupeActive) {
        threeViewer.toggleMicroLoupe();
      }
      if (threeViewer && threeViewer.xrfActive) {
        threeViewer.toggleXRF();
      }
      if (threeViewer && threeViewer.rakingActive) {
        threeViewer.toggleRakingLight();
      }
      if (threeViewer && threeViewer.backlightActive) {
        threeViewer.toggleBacklight();
      }
      if (threeViewer && threeViewer.provenanceActive) {
        threeViewer.toggleProvenanceTimeline();
      }
      if (threeViewer && threeViewer.hydrationActive) {
        threeViewer.toggleHydrationTest();
      }
      if (threeViewer && typeof threeViewer.stopLoop === 'function') threeViewer.stopLoop();
      if (walkthroughEngine) {
        walkthroughEngine.handleResize();
        walkthroughEngine.startLoop();
      }
    } else {
      if (walkthroughEngine && typeof walkthroughEngine.closeCardDrawer === 'function') {
        walkthroughEngine.closeCardDrawer();
      }
      if (walkthroughEngine && typeof walkthroughEngine.returnShelfVolume === 'function') {
        walkthroughEngine.returnShelfVolume();
      }
      if (walkthroughEngine && typeof walkthroughEngine.stopLoop === 'function') walkthroughEngine.stopLoop();

      const curStation = (walkthroughEngine && walkthroughEngine.activeStation)
        ? walkthroughEngine.activeStation
        : { name: 'Grand Reading Hall', image: 'assets/walkthrough/reading_room.jpg' };
      const wbTitle = document.getElementById('workbench-station-title');
      if (wbTitle) wbTitle.textContent = "Conservator's Workbench · " + curStation.name;

      if (threeViewer) {
        if (curStation.image && typeof threeViewer.setStationBackdrop === 'function') {
          threeViewer.setStationBackdrop(curStation.image);
        }
        if (!threeViewer.active3DBook && activeVolume) {
          threeViewer.loadBookSpecimen(activeVolume);
        }
        threeViewer.resumeLoop();
        if (typeof threeViewer.performEntrySwoop === 'function') {
          threeViewer.performEntrySwoop();
        }
        requestAnimationFrame(() => {
          threeViewer.handleResize();
          threeViewer.resumeLoop();
          requestAnimationFrame(() => {
            threeViewer.handleResize();
          });
        });
      }
    }
  }

  window.setExperienceMode = setExperienceMode;

  if (btnModeWalkthrough) {
    btnModeWalkthrough.addEventListener('click', () => setExperienceMode('walkthrough'));
  }
  if (btnModeSpecimen) {
    btnModeSpecimen.addEventListener('click', () => setExperienceMode('specimen'));
  }
  if (switchToSpecimenBtn) {
    switchToSpecimenBtn.addEventListener('click', () => setExperienceMode('specimen'));
  }

  const foyerWalkBtn = document.getElementById('foyer-walk-btn');
  if (foyerWalkBtn) {
    foyerWalkBtn.addEventListener('click', () => {
      if (walkthroughEngine) {
        walkthroughEngine.ensureAudioContext();
        walkthroughEngine.targetProgress = 0.08;
      }
      const hero = document.getElementById('foyer-arrival-hero');
      if (hero) hero.classList.add('fade-out');
    });
  }

  const foyerAtelierBtn = document.getElementById('foyer-atelier-btn');
  if (foyerAtelierBtn) {
    foyerAtelierBtn.addEventListener('click', () => {
      setExperienceMode('specimen');
      if (threeViewer) {
        if (!threeViewer.active3DBook && activeVolume) {
          threeViewer.loadBookSpecimen(activeVolume);
        }
        threeViewer.setStationBackdrop('assets/walkthrough/reading_room.jpg');
        threeViewer.performEntrySwoop();
      }
    });
  }

  const returnWalkBtn = document.getElementById('return-walkthrough-btn');
  if (returnWalkBtn) {
    returnWalkBtn.addEventListener('click', () => {
      if (threeViewer && typeof threeViewer.performExitSwoop === 'function') {
        threeViewer.performExitSwoop(() => {
          setExperienceMode('walkthrough');
        });
      } else {
        setExperienceMode('walkthrough');
      }
    });
  }

  // 3B. Diegetic Sliding In-Game Drawers (Scholar's Satchel & Curatorial Dossier)
  const satchelDrawer = document.querySelector('.organ-library');
  const dossierDrawer = document.querySelector('.info-panel');
  const btnToggleSatchel = document.getElementById('btn-toggle-satchel');
  const btnToggleDossier = document.getElementById('btn-toggle-dossier');
  const closeSatchelBtn = document.getElementById('close-satchel-drawer');
  const closeDossierBtn = document.getElementById('close-dossier-drawer');

  function toggleSatchelDrawer(force) {
    if (!satchelDrawer) return;
    const shouldOpen = typeof force === 'boolean' ? force : !satchelDrawer.classList.contains('drawer-open');
    satchelDrawer.classList.toggle('drawer-open', shouldOpen);
    if (btnToggleSatchel) {
      btnToggleSatchel.classList.toggle('active', shouldOpen);
      btnToggleSatchel.setAttribute('aria-expanded', String(shouldOpen));
    }
  }

  function toggleDossierDrawer(force) {
    if (!dossierDrawer) return;
    const shouldOpen = typeof force === 'boolean' ? force : !dossierDrawer.classList.contains('drawer-open');
    dossierDrawer.classList.toggle('drawer-open', shouldOpen);
    if (btnToggleDossier) {
      btnToggleDossier.classList.toggle('active', shouldOpen);
      btnToggleDossier.setAttribute('aria-expanded', String(shouldOpen));
    }
  }

  function closeAllDrawers() {
    toggleSatchelDrawer(false);
    toggleDossierDrawer(false);
  }

  const btnStandUpWorkbench = document.getElementById('btn-stand-up-workbench');
  if (btnStandUpWorkbench) {
    btnStandUpWorkbench.addEventListener('click', (e) => {
      e.stopPropagation();
      setExperienceMode('walkthrough');
    });
  }

  if (btnToggleSatchel) btnToggleSatchel.addEventListener('click', (e) => { e.stopPropagation(); toggleSatchelDrawer(); });
  if (btnToggleDossier) btnToggleDossier.addEventListener('click', (e) => { e.stopPropagation(); toggleDossierDrawer(); });
  if (closeSatchelBtn) closeSatchelBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSatchelDrawer(false); });
  if (closeDossierBtn) closeDossierBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleDossierDrawer(false); });

  // 3C. Diegetic Archival Menu & Floor Plan Toggles
  const btnToggleArchiveMenu = document.getElementById('btn-toggle-archive-menu');
  const topbarEl = document.querySelector('.topbar');
  function toggleArchiveMenu(force) {
    if (!topbarEl) return;
    const shouldOpen = typeof force === 'boolean' ? force : !topbarEl.classList.contains('menu-open');
    topbarEl.classList.toggle('menu-open', shouldOpen);
    if (btnToggleArchiveMenu) {
      btnToggleArchiveMenu.classList.toggle('active', shouldOpen);
      btnToggleArchiveMenu.setAttribute('aria-expanded', String(shouldOpen));
    }
  }
  if (btnToggleArchiveMenu) {
    btnToggleArchiveMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleArchiveMenu();
    });
  }

  const btnToggleFloorplan = document.getElementById('btn-toggle-floorplan');
  const stationDepthIndicator = document.getElementById('station-depth-indicator');
  function toggleFloorPlan(force) {
    if (!stationDepthIndicator) return;
    const shouldOpen = typeof force === 'boolean' ? force : !stationDepthIndicator.classList.contains('expanded');
    stationDepthIndicator.classList.toggle('expanded', shouldOpen);
    if (btnToggleFloorplan) {
      btnToggleFloorplan.classList.toggle('active', shouldOpen);
      btnToggleFloorplan.setAttribute('aria-expanded', String(shouldOpen));
    }
  }
  if (btnToggleFloorplan) {
    btnToggleFloorplan.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFloorPlan();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Tab') {
      e.preventDefault();
      toggleSatchelDrawer();
    } else if (e.code === 'KeyI') {
      if (!window.walkthroughEngine || !window.walkthroughEngine.isLecternOpen) {
        e.preventDefault();
        toggleDossierDrawer();
      }
    } else if (e.code === 'Escape') {
      if (satchelDrawer?.classList.contains('drawer-open') || dossierDrawer?.classList.contains('drawer-open')) {
        closeAllDrawers();
      } else if (window.walkthroughEngine && window.walkthroughEngine.isInsideOrrery) {
        window.walkthroughEngine.exitOrreryRotunda();
      } else if (document.body.classList.contains('mode-specimen')) {
        setExperienceMode('walkthrough');
      }
    }
  });

  window.biblioApp = window.biblioApp || {};
  window.biblioApp.toggleSatchelDrawer = toggleSatchelDrawer;
  window.biblioApp.toggleDossierDrawer = toggleDossierDrawer;
  window.biblioApp.closeAllDrawers = closeAllDrawers;

  if (calloutClose) {
    calloutClose.addEventListener('click', () => {
      if (threeViewer) threeViewer.clearHotspotSelection();
      updateCallout(null);
    });
  }
  if (calloutLearn) {
    calloutLearn.addEventListener('click', () => {
      if (selectedHotspot && typeof window.showHotspotLesson === 'function') {
        window.showHotspotLesson(selectedHotspot);
      }
    });
  }

  // Apply theme after viewer exists so the canvas matches
  applyTheme(getPreferredTheme(), { persist: false });

  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Follow OS preference only when the user has not chosen explicitly
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSchemeChange = (e) => {
      const stored = localStorage.getItem('biblio_theme');
      if (stored === 'light' || stored === 'dark') return;
      applyTheme(e.matches ? 'dark' : 'light', { persist: false });
    };
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onSchemeChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onSchemeChange);
  }

  // 4. Render Library Science Specimen List in Sidebar
  //
  // Nodes are created once and then diffed. Previously the whole list was torn down
  // and rebuilt on every keystroke, which destroyed and re-created nine 220-330 KB
  // <img> elements (and rebound 18 listeners) per character typed.
  const volumeListNodes = new Map(); // volume id -> { btn, favIcon }
  let lastVolumeFilter = null; // null means "show everything"
  let volumeListEmptyNode = null;

  function buildVolumeNode(vol) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'organ-item';
    btn.dataset.volumeId = vol.id;
    btn.innerHTML = `
        <span class="organ-glyph"></span>
        <span>
          <b></b>
          <small></small>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="favorite" aria-hidden="true" focusable="false">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      `;

    const glyph = btn.querySelector('.organ-glyph');
    if (vol.specimen && vol.specimen.image) {
      const img = document.createElement('img');
      img.src = vol.specimen.image;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      glyph.appendChild(img);
    } else {
      glyph.textContent = vol.thumbGlyph || '🏷';
    }
    btn.querySelector('b').textContent = vol.specimen ? vol.specimen.name : vol.title;
    btn.querySelector('small').textContent = vol.category;

    btn.addEventListener('click', () => selectVolume(vol));
    const favIcon = btn.querySelector('.favorite');
    favIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(vol.id);
    });

    return { btn, favIcon };
  }

  function updateVolumeNode(entry, vol) {
    const { btn, favIcon } = entry;
    btn.style.setProperty('--item-accent', vol.accent);
    btn.classList.toggle('active', !!(activeVolume && activeVolume.id === vol.id));
    btn.setAttribute('aria-current', activeVolume && activeVolume.id === vol.id ? 'true' : 'false');
    const isFav = favorites.includes(vol.id);
    favIcon.setAttribute('fill', isFav ? 'currentColor' : 'none');
    favIcon.setAttribute('aria-label', isFav ? 'Remove from saved modules' : 'Save module');
    btn.setAttribute('aria-label', `${vol.specimen ? vol.specimen.name : vol.title}. ${vol.category}.${isFav ? ' Saved.' : ''}`);
  }

  function renderVolumeList(filteredVolumes) {
    if (!volumeListEl) return;
    const listToRender = filteredVolumes || volumes;
    lastVolumeFilter = filteredVolumes || null;
    const wanted = new Set(listToRender.map((v) => v.id));

    // Drop nodes that fell out of the current filter.
    volumeListNodes.forEach((entry, id) => {
      if (!wanted.has(id)) {
        entry.btn.remove();
        volumeListNodes.delete(id);
      }
    });

    listToRender.forEach((vol) => {
      let entry = volumeListNodes.get(vol.id);
      if (!entry) {
        entry = buildVolumeNode(vol);
        volumeListNodes.set(vol.id, entry);
      }
      updateVolumeNode(entry, vol);
      volumeListEl.appendChild(entry.btn); // appendChild moves existing nodes
    });

    // Always clear the empty-state node first: it must not survive into the next
    // render, where the list has results again.
    if (volumeListEmptyNode) {
      volumeListEmptyNode.remove();
      volumeListEmptyNode = null;
    }

    if (listToRender.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'organ-list-empty';
      empty.textContent = 'No specimens match that search.';
      volumeListEl.appendChild(empty);
      volumeListEmptyNode = empty;
    }
  }

  // 4b. Render Hotspot Index List in 3D Overlay
  function renderHotspotIndex(hotspots) {
    if (!hotspotIndexEl) return;
    hotspotIndexEl.innerHTML = '';
    (hotspots || []).forEach((hs) => {
      const li = document.createElement('li');
      li.className = 'hotspot-index-item';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hotspot-index-btn';
      btn.dataset.hs = hs.id;
      btn.setAttribute('aria-pressed', 'false');

      const name = document.createElement('strong');
      name.textContent = hs.name;
      const desc = document.createElement('span');
      desc.textContent = hs.desc;
      btn.append(name, desc);

      btn.addEventListener('click', () => {
        if (threeViewer) threeViewer.focusHotspot(hs.id, { openLesson: false });
        hotspotIndexEl.querySelectorAll('.hotspot-index-btn').forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      });
      li.appendChild(btn);
      hotspotIndexEl.appendChild(li);
    });
  }

  // 4c. Inspect 3D Physical Book Binding
  function inspect3DBook(targetBook) {
    if (!threeViewer || !targetBook) return;
    threeViewer.open3DBookShowcase(targetBook);
    setToolActive('inspect-book');

    if (viewCaptionTitle) {
      viewCaptionTitle.textContent = `${targetBook.title} (${targetBook.year || 'Historic Volume'})`;
    }
    renderHotspotIndex(threeViewer.hotspots || []);
  }

  /** Restore the viewer caption and hotspot index to the active module. */
  function syncViewerChromeToVolume() {
    if (!activeVolume) return;
    if (viewCaptionTitle) {
      viewCaptionTitle.textContent = activeVolume.latinName || activeVolume.title;
    }
    renderHotspotIndex(activeVolume.hotspots || []);
  }

  // 5. Select Active Library Specimen
  function selectVolume(vol) {
    activeVolume = vol;

    document.documentElement.style.setProperty('--item-accent', vol.accent || '#c28e46');

    renderVolumeList();

    // Load 3D Specimen Model
    if (threeViewer) {
      threeViewer.loadBookSpecimen(vol);
      if (compareMode) {
        const ref = volumes.find(v => v.id === compareReferenceId) || pickCompareReference(vol.id);
        if (ref) {
          compareReferenceId = ref.id;
          threeViewer.setCompare(ref);
        }
      }
    }

    // Update Ambient Glow Color
    if (viewerGlowEl) {
      viewerGlowEl.style.setProperty('--organ-accent', vol.accent);
    }

    // Update Right Detail Info Panel
    if (kickerEl) kickerEl.innerHTML = `<span>◇</span> Library Specimen`;
    if (titleEl) titleEl.textContent = vol.specimen ? vol.specimen.name : vol.title;
    if (subtitleEl) subtitleEl.textContent = vol.specimen ? vol.specimen.scientificName : vol.subtitle;
    if (stampEl) stampEl.textContent = vol.thumbGlyph || '🏷';
    if (descEl) descEl.textContent = vol.description;
    if (viewCaptionTitle) viewCaptionTitle.textContent = vol.latinName || vol.title;
    if (viewerRenderStatus) {
      viewerRenderStatus.textContent = vol.specimen?.model
        ? 'Imported 3D specimen · click books or pins to explore'
        : 'Procedural 3D specimen · click books or pins to explore';
    }

    // The three book-craft tools only do anything on modules that supply shelfBooks.
    // Disable them (rather than leaving dead buttons) where there are none.
    const hasShelfBooks = !!(vol.shelfBooks && vol.shelfBooks.length);
    setBookToolEnabled('inspect-book', hasShelfBooks);
    setBookToolEnabled('open-cover', hasShelfBooks);
    setBookToolEnabled('flip-page', hasShelfBooks);

    const captionReadBtn = document.getElementById('caption-read-book-btn');
    if (captionReadBtn) {
      if (vol.shelfBooks && vol.shelfBooks.length) {
        captionReadBtn.hidden = false;
        captionReadBtn.onclick = () => {
          if (bookReader) bookReader.open(vol.shelfBooks[0]);
        };
      } else {
        captionReadBtn.hidden = true;
      }
    }

    const captionInspectBtn = document.getElementById('caption-inspect-book-btn');
    if (captionInspectBtn) {
      if (vol.shelfBooks && vol.shelfBooks.length) {
        captionInspectBtn.hidden = false;
        captionInspectBtn.onclick = () => {
          inspect3DBook(vol.shelfBooks[0]);
        };
      } else {
        captionInspectBtn.hidden = true;
      }
    }

    // Render Key Facts Grid
    if (keyFactsEl) {
      keyFactsEl.innerHTML = '';
      vol.keyFacts.forEach(fact => {
        const div = document.createElement('div');
        div.innerHTML = `<dt><span>${window.BiblioEsc(fact.icon)}</span> ${window.BiblioEsc(fact.label)}</dt><dd>${window.BiblioEsc(fact.value)}</dd>`;
        keyFactsEl.appendChild(div);
      });
    }

    if (scholarlyNoteEl) scholarlyNoteEl.textContent = vol.scholarlyNote;
    if (didYouKnowEl) didYouKnowEl.textContent = vol.didYouKnow;

    // Render Practice Panel in Right Detail Column
    if (practiceEngine && practicePanelContainer) {
      practiceEngine.renderPracticePanel(vol, practicePanelContainer);
    }

    // Clickable hotspot index (Anatomy Atelier pattern)
    renderHotspotIndex(vol.hotspots || []);

    // Content reveal animation on info panel.
    // Reading offsetWidth forces a synchronous reflow; replay the existing CSS
    // animation through the Web Animations API instead.
    restartRevealAnimation(document.querySelector('.info-panel'), 'reveal-play');
    restartRevealAnimation(document.getElementById('study-strip'), 'study-reveal');

    // Keep compare strip in sync if open
    if (compareMode) renderCompareStrip();

    // Render Bottom Interactive Cards
    if (practiceEngine) {
      if (callSandboxMount) practiceEngine.renderCallNumberSandbox(vol, callSandboxMount);
      if (marcPracticeMount) practiceEngine.renderMARCPractice(vol, marcPracticeMount);
      if (scenariosMount) practiceEngine.renderScenarioCards(vol, scenariosMount);
      if (mustieMount) practiceEngine.renderMUSTIETool(vol, mustieMount);
    }

    // Show or hide bottom cards depending on whether this module supplies their data.
    const hasSandbox = !!vol.callNumberPractice;
    const hasMarc = !!vol.marcPractice;
    const hasScenarios = !!(vol.scenarios && vol.scenarios.length);
    const hasMustie = !!vol.mustiePractice;
    toggleCard('card-call-number-sandbox', hasSandbox);
    toggleCard('card-marc-practice', hasMarc);
    toggleCard('card-scenarios', hasScenarios);
    toggleCard('card-mustie', hasMustie);

    // Hide the tools strip entirely when no practice tools apply
    const toolsStrip = document.querySelector('.tools-strip');
    if (toolsStrip) {
      toolsStrip.classList.toggle('is-empty', !(hasSandbox || hasMarc || hasScenarios || hasMustie));
    }

    // Anatomy-style study strip (updates with every specimen tap)
    renderStudyStrip(vol);
  }

  function toggleCard(cardId, show) {
    const el = document.getElementById(cardId);
    if (el) el.style.display = show ? '' : 'none';
  }

  /**
   * Replay a CSS entry animation without a forced reflow.
   * The old approach (remove class -> read offsetWidth -> re-add) triggered a
   * synchronous layout on every specimen switch, and selectVolume runs on every
   * sidebar click, keypress, tour step and feature-page navigation.
   */
  function restartRevealAnimation(el, className) {
    if (!el) return;
    el.classList.remove(className);
    if (typeof el.getAnimations === 'function') {
      // Re-adding the class in the next frame lets the animation be re-created
      // without us having to read layout to flush the style change.
      requestAnimationFrame(() => el.classList.add(className));
    } else {
      void el.offsetWidth;
      el.classList.add(className);
    }
  }

  /**
   * Study strip — library equivalents of Anatomy Atelier’s bottom cards:
   * close-up · compare · workflow animation · field challenges · where it works
   */
  function renderStudyStrip(vol) {
    const study = vol.study || {};
    const accent = vol.accent || '#c28e46';
    const stripName = document.getElementById('study-strip-specimen-name');
    if (stripName) {
      stripName.textContent = vol.specimen ? vol.specimen.name : vol.title;
    }

    const strip = document.getElementById('study-strip');
    if (strip) strip.style.setProperty('--study-accent', accent);

    // 1. Close-up study
    const micro = study.micro || {};
    const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
    setText('micro-eyebrow', micro.eyebrow || 'Close-up study');
    setText('micro-title', micro.title || 'Micro-structure');
    setText('micro-caption', micro.blurb ? micro.blurb.slice(0, 72) + (micro.blurb.length > 72 ? '…' : '') : 'Loupe view');
    setText('micro-glyph', vol.thumbGlyph || '🔬');
    const microGrid = document.getElementById('micro-grid');
    if (microGrid) {
      microGrid.style.setProperty('--study-accent', accent);
      microGrid.innerHTML = (micro.points || []).slice(0, 4).map(() => '<i></i>').join('') || '<i></i><i></i><i></i><i></i>';
    }

    // 2. Compare domains
    const comparison = study.comparison || {};
    const vsVol = volumes.find(v => v.id === comparison.vsId) || pickCompareReference(vol.id);
    setText('compare-card-title', comparison.title || `Compare with ${vsVol.title}`);
    setText('compare-card-blurb', comparison.blurb || 'Side-by-side library domains');
    setText('compare-duo-a', vol.thumbGlyph || 'A');
    setText('compare-duo-b', vsVol.thumbGlyph || 'B');
    // Only adopt the study default while the user has not explicitly chosen a
    // reference — otherwise every specimen switch silently reverts a Swap choice.
    if (compareReferenceId === null) {
      compareReferenceId = vsVol.id;
    }

    // 3. Workflow in motion
    const fn = study.functionAnim || {};
    setText('anim-card-title', fn.title || `Tour: ${vol.specimen ? vol.specimen.name : vol.title}`);
    setText('anim-card-glyph', vol.thumbGlyph || '🏷');

    // 4. Field challenges
    setText('conditions-eyebrow', study.fieldLabel || 'Field challenges');
    const conditionsList = document.getElementById('conditions-list');
    if (conditionsList) {
      const items = vol.clinicalConditions || [];
      conditionsList.innerHTML = items.length
        ? items.map(c => `<li>${window.BiblioEsc(c)}</li>`).join('')
        : '<li>No field notes catalogued for this specimen yet.</li>';
    }

    // 5. Where it works
    const sys = study.system || {};
    setText('system-card-title', sys.title || vol.category || 'Library domain');
    setText('system-card-glyph', vol.thumbGlyph || '◈');
    const systemMap = document.getElementById('system-map');
    if (systemMap) {
      systemMap.style.setProperty('--map-accent', accent);
      systemMap.innerHTML = `
        <span class="map-ring"></span>
        <span class="map-label">${window.BiblioEsc(sys.place || vol.era || 'Core practice')}</span>
      `;
    }

    if (strip) {
      restartRevealAnimation(strip, 'study-reveal');
    }
  }

  function openStudyModal(kind) {
    const vol = activeVolume;
    if (!vol) return;
    const study = vol.study || {};
    const modal = document.getElementById('study-modal');
    if (!modal) return;

    const icon = document.getElementById('study-modal-icon');
    const kicker = document.getElementById('study-modal-kicker');
    const title = document.getElementById('study-modal-title');
    const blurb = document.getElementById('study-modal-blurb');
    const points = document.getElementById('study-modal-points');
    const facts = document.getElementById('study-modal-facts');

    if (kind === 'micro') {
      const m = study.micro || {};
      if (icon) icon.textContent = '🔬';
      if (kicker) kicker.textContent = m.eyebrow || 'Close-up study';
      if (title) title.textContent = m.title || 'Micro-structure';
      if (blurb) blurb.textContent = m.blurb || '';
      if (points) {
        points.innerHTML = (m.points || []).map(p => `<li>${window.BiblioEsc(p)}</li>`).join('');
        points.hidden = !(m.points && m.points.length);
      }
      if (facts) facts.innerHTML = '';
    } else if (kind === 'system') {
      const s = study.system || {};
      if (icon) icon.textContent = '⌖';
      if (kicker) kicker.textContent = 'Where it works';
      if (title) title.textContent = s.title || vol.category;
      if (blurb) blurb.textContent = s.blurb || vol.description;
      if (points) {
        points.innerHTML = '';
        points.hidden = true;
      }
      if (facts) {
        facts.innerHTML = `
          <div><dt>Domain</dt><dd>${window.BiblioEsc(s.title || vol.category)}</dd></div>
          <div><dt>Place in the library</dt><dd>${window.BiblioEsc(s.place || vol.era)}</dd></div>
          <div><dt>Specimen</dt><dd>${window.BiblioEsc(vol.specimen ? vol.specimen.name : vol.title)}</dd></div>
        `;
      }
    } else if (kind === 'conditions') {
      if (icon) icon.textContent = '📋';
      if (kicker) kicker.textContent = study.fieldLabel || 'Field challenges';
      if (title) title.textContent = `Challenges in ${vol.title}`;
      if (blurb) blurb.textContent = 'Real-world issues professionals meet when working with this domain.';
      if (points) {
        points.innerHTML = (vol.clinicalConditions || []).map(c => `<li>${window.BiblioEsc(c)}</li>`).join('');
        points.hidden = false;
      }
      if (facts) facts.innerHTML = '';
    }

    openModal(modal);
  }

  function closeStudyModal() {
    closeModal(document.getElementById('study-modal'));
  }

  function startGuidedTour() {
    if (!threeViewer) return;
    document.querySelector('.viewer-shell')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const running = threeViewer.playTour();
    document.getElementById('animate-action-btn')?.classList.toggle('active', running);
    if (tourProgress) tourProgress.hidden = !running;
  }

  function openCompareFromStudy() {
    const study = activeVolume && activeVolume.study;
    if (study && study.comparison && study.comparison.vsId) {
      compareReferenceId = study.comparison.vsId;
    }
    toggleCompareMode(true);
    document.getElementById('compare-strip')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Study strip CTAs
  document.getElementById('micro-visual-btn')?.addEventListener('click', () => openStudyModal('micro'));
  document.getElementById('micro-open-btn')?.addEventListener('click', () => openStudyModal('micro'));
  document.getElementById('compare-visual-btn')?.addEventListener('click', openCompareFromStudy);
  document.getElementById('compare-open-btn')?.addEventListener('click', openCompareFromStudy);
  document.getElementById('play-anim-card')?.addEventListener('click', startGuidedTour);
  document.getElementById('play-anim-cta')?.addEventListener('click', startGuidedTour);
  document.getElementById('conditions-open-lesson')?.addEventListener('click', () => openStudyModal('conditions'));
  document.getElementById('system-open-feature')?.addEventListener('click', () => openStudyModal('system'));
  document.getElementById('system-visual-btn')?.addEventListener('click', () => openStudyModal('system'));
  document.getElementById('close-study-modal')?.addEventListener('click', closeStudyModal);
  document.getElementById('study-modal-continue')?.addEventListener('click', closeStudyModal);
  document.getElementById('study-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'study-modal') closeStudyModal();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
    // Never switch specimens underneath an open dialog — this would re-render the
    // quiz, notes and practice panel against a different module mid-interaction.
    if (e.key === '[' || e.key === ']') {
      if (anyDialogOpen()) return;
      if (!volumes.length || !activeVolume) return;
      const idx = volumes.findIndex(v => v.id === activeVolume.id);
      if (idx < 0) return;
      const next = e.key === ']'
        ? volumes[(idx + 1) % volumes.length]
        : volumes[(idx - 1 + volumes.length) % volumes.length];
      selectVolume(next);
      e.preventDefault();
    }
  });

  // Open the editorial feature page with continuous observation loop
  function openFeaturePage(vol) {
    const mod = vol || activeVolume;
    if (!featurePage || !mod) return;
    featurePage.open(mod, {
      observe: (m) => {
        featurePage.close();
        if (m && (!activeVolume || activeVolume.id !== m.id)) {
          selectVolume(m);
        }
        document.querySelector('.viewer-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (threeViewer && activeVolume && activeVolume.hotspots && activeVolume.hotspots.length > 0) {
          setTimeout(() => {
            threeViewer.focusHotspot(activeVolume.hotspots[0].id, { openLesson: false });
          }, 350);
        }
      },
      explore: (m) => {
        featurePage.close();
        if (m && (!activeVolume || activeVolume.id !== m.id)) selectVolume(m);
        document.querySelector('.viewer-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      practice: () => {
        featurePage.close();
        document.getElementById('practice-panel-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      quiz: (m) => {
        featurePage.close();
        if (m) selectVolume(m);
        document.getElementById('quiz-action-btn')?.click();
      },
      sandbox: () => {
        featurePage.close();
        document.getElementById('card-call-number-sandbox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      marc: () => {
        featurePage.close();
        document.getElementById('card-marc-practice')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      mustie: () => {
        featurePage.close();
        document.getElementById('card-mustie')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Show 3D Hotspot Micro-Quiz Modal
  window.showHotspotLesson = function(hs) {
    if (!hotspotModal) return;
    if (hotspotTitle) hotspotTitle.textContent = hs.name;
    if (hotspotLessonText) hotspotLessonText.textContent = hs.lesson || hs.desc;

    if (hotspotQuizContainer && hs.quiz) {
      const q = hs.quiz;
      const box = document.createElement('div');
      box.className = 'practice-question-item';
      box.innerHTML = `
        <p class="question-text"><strong>Micro-Quiz:</strong></p>
        <div class="options-grid"></div>
        <div class="hs-feedback practice-feedback" role="alert" aria-live="assertive" style="display:none; margin-top:8px;"></div>
      `;
      box.querySelector('.question-text').appendChild(document.createTextNode(` ${q.question}`));

      const grid = box.querySelector('.options-grid');
      // Shuffled like the certification quiz: correct-answer order must not
      // leak the solution. Seed is stable per hotspot so replays match.
      const shuffled = window.BiblioShuffleOptions(
        q.options,
        q.correct,
        `${hs.id || hs.name}:quiz`
      );
      const answerIndex = shuffled.answerIndex;
      shuffled.options.forEach((opt, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'practice-opt-btn hs-opt-btn';
        b.dataset.idx = String(idx);
        b.textContent = opt;
        grid.appendChild(b);
      });

      hotspotQuizContainer.replaceChildren(box);

      const btns = box.querySelectorAll('.hs-opt-btn');
      const feedbackEl = box.querySelector('.hs-feedback');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx, 10);
          const isCorrect = idx === answerIndex;
          btns.forEach(b => { b.disabled = true; });

          feedbackEl.style.display = 'block';
          feedbackEl.className = 'practice-feedback success';
          if (isCorrect) {
            btn.classList.add('correct-choice');
            feedbackEl.className = 'practice-feedback success';
          } else {
            btn.classList.add('incorrect-choice');
            feedbackEl.className = 'practice-feedback error';
          }
          feedbackEl.replaceChildren();
          const label = document.createElement('strong');
          label.textContent = isCorrect ? '\u2713 Correct! ' : '\u2717 Incorrect. ';
          feedbackEl.append(label, document.createTextNode(q.explanation || ''));
          // Move focus to the explanation so the result is not purely visual.
          feedbackEl.setAttribute('tabindex', '-1');
          feedbackEl.focus();
        });
      });
    } else if (hotspotQuizContainer) {
      const p = document.createElement('p');
      p.style.fontSize = '0.8rem';
      p.style.color = 'var(--text-muted)';
      p.textContent = 'Study the specimen structure to continue.';
      hotspotQuizContainer.replaceChildren(p);
    }

    openModal(hotspotModal);
  };

  if (closeHotspotBtn) {
    closeHotspotBtn.addEventListener('click', () => closeModal(hotspotModal));
  }

  // Real-Time Search Filtering (debounced — filtering rebuilt the whole sidebar)
  if (searchInputEl) {
    let searchTimer = null;
    const runSearch = (raw) => {
      const query = raw.toLowerCase().trim();
      const filtered = !query
        ? volumes
        : volumes.filter(v =>
            v.title.toLowerCase().includes(query) ||
            v.subtitle.toLowerCase().includes(query) ||
            v.category.toLowerCase().includes(query) ||
            v.era.toLowerCase().includes(query)
          );
      renderVolumeList(filtered);
    };

    searchInputEl.addEventListener('input', (e) => {
      const value = e.target.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => runSearch(value), 140);
    });

    // Searching "collection" would otherwise hide the button that clears it.
    const viewAllBtn = document.getElementById('view-all-specimens');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        if (searchInputEl) searchInputEl.value = '';
        runSearch('');
        document.querySelector('.organ-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  // Favorites Persistence
  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter(f => f !== id);
    } else {
      favorites.push(id);
    }
    try {
      localStorage.setItem('biblio_favorites', JSON.stringify(favorites));
    } catch (_) {
      window.alert('Could not save this module: browser storage is full.');
    }
    renderVolumeList(lastVolumeFilter);
  }

  // Specimen Toolbar — Complete Controls Model
  const toolButtons = document.querySelectorAll('.tool-button');

  /**
   * Sync a toggle's visual state and its ARIA state together. Every toolbar control
   * signals state via a CSS class, so aria-pressed has to be written alongside it or
   * the state is invisible to screen readers.
   */
  function setToggleState(btn, on) {
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', String(!!on));
  }

  function setToolActive(action, sticky = false) {
    toolButtons.forEach(b => {
      const a = b.getAttribute('data-action');
      if (a === 'compare') {
        setToggleState(b, compareMode);
        return;
      }
      if (sticky) {
        if (a === action) setToggleState(b, b.classList.contains('active'));
      } else {
        setToggleState(b, a === action);
      }
    });
  }

  // Remember each toggle's real tooltip so it can be restored when re-enabled.
  const toolTitles = new Map();
  toolButtons.forEach((b) => {
    const a = b.getAttribute('data-action');
    if (a) toolTitles.set(a, b.getAttribute('title') || '');
  });

  function setBookToolEnabled(action, enabled) {
    const btn = document.querySelector(`.tool-button[data-action="${action}"]`);
    if (!btn) return;
    btn.disabled = !enabled;
    btn.setAttribute('aria-disabled', String(!enabled));
    btn.title = enabled
      ? (toolTitles.get(action) || '')
      : 'This module has no shelf books to inspect';
    // A disabled toggle must not keep advertising a stale "on" state.
    if (!enabled) setToggleState(btn, false);
  }

  toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (!threeViewer) return;

      if (action === 'inspect-book') {
        const targetBook = (activeVolume && activeVolume.shelfBooks && activeVolume.shelfBooks[0]);
        if (targetBook) {
          inspect3DBook(targetBook);
        }
      } else if (action === 'open-cover') {
        const targetBook = (activeVolume && activeVolume.shelfBooks && activeVolume.shelfBooks[0]);
        if (!targetBook) return;
        // active3DBook is cleared on every specimen swap, so this always builds the
        // book for the *current* module rather than tweening a removed mesh.
        if (!threeViewer.active3DBook) {
          inspect3DBook(targetBook);
        }
        setToggleState(btn, threeViewer.toggleActiveCoverOpen());
      } else if (action === 'flip-page') {
        const targetBook = (activeVolume && activeVolume.shelfBooks && activeVolume.shelfBooks[0]);
        if (!targetBook) return;
        if (!threeViewer.active3DBook) {
          inspect3DBook(targetBook);
        }
        if (threeViewer.activeBookOpenAmount < 0.3) {
          threeViewer.toggleActiveCoverOpen();
        }
        threeViewer.flipActive3DPage();
      } else if (action === 'rotate') {
        setToolActive('rotate');
        threeViewer.setViewMode('normal');
        threeViewer.toggleAutoRotate(true);
        const sw = autoRotateToggle && autoRotateToggle.querySelector('.switch');
        if (sw) sw.classList.add('on');
        // Keep the switch's announced state in step with its visual state.
        if (autoRotateToggle) autoRotateToggle.setAttribute('aria-pressed', 'true');
      } else if (action === 'zoom-in') {
        threeViewer.zoom(-1);
      } else if (action === 'zoom-out') {
        threeViewer.zoom(1);
      } else if (action === 'isolate') {
        const on = threeViewer.currentViewMode !== 'isolate';
        threeViewer.setViewMode(on ? 'isolate' : 'normal');
        setToggleState(btn, on);
      } else if (action === 'section') {
        setToggleState(btn, threeViewer.toggleCrossSection());
      } else if (action === 'layers') {
        threeViewer.toggleLayers();
        setToggleState(btn, threeViewer.currentLayerIndex !== -1);
      } else if (action === 'uv') {
        const on = threeViewer.currentViewMode !== 'uv';
        threeViewer.setViewMode(on ? 'uv' : 'normal');
        setToggleState(btn, on);
      } else if (action === 'explode') {
        const on = threeViewer.toggleExplode();
        setToggleState(btn, on);
      } else if (action === 'loupe') {
        const on = threeViewer.toggleMicroLoupe();
        setToggleState(btn, on);
      } else if (action === 'raking') {
        const on = threeViewer.toggleRakingLight();
        setToggleState(btn, on);
      } else if (action === 'backlight') {
        const on = threeViewer.toggleBacklight();
        setToggleState(btn, on);
      } else if (action === 'xrf') {
        const on = threeViewer.toggleXRF();
        setToggleState(btn, on);
      } else if (action === 'timeline') {
        const on = threeViewer.toggleProvenanceTimeline();
        setToggleState(btn, on);
      } else if (action === 'hydration') {
        const on = threeViewer.toggleHydrationTest();
        setToggleState(btn, on);
      } else if (action === 'toggle-lamp') {
        threeViewer.toggleBankerLamp();
        setToggleState(btn, threeViewer.lampMode === 'warm');
      } else if (action === 'toggle-architecture') {
        if (threeViewer && typeof threeViewer.toggleSpecimenArchitectureMode === 'function') {
          const newMode = threeViewer.toggleSpecimenArchitectureMode();
          setToggleState(btn, newMode === 'architecture');
          const span = btn.querySelector('span');
          if (span) span.textContent = newMode === 'architecture' ? '🔬 Scanner View' : '🏛 Stacks View';
        }
      } else if (action && action.startsWith('wavelength-')) {
        const mode = action.replace('wavelength-', '');
        const modeKey = mode === 'vis' ? 'visible' : (mode === 'ir' ? 'infrared' : mode);
        if (typeof threeViewer.setWavelengthMode === 'function') {
          threeViewer.setWavelengthMode(modeKey);
        }
        toolButtons.forEach(b => {
          const a = b.getAttribute('data-action');
          if (a && a.startsWith('wavelength-')) {
            setToggleState(b, a === action);
          }
        });
      } else if (action === 'compare') {
        toggleCompareMode();
        setToggleState(btn, compareMode);
      } else if (action === 'record') {
        openModal(document.getElementById('record-modal'));
      } else if (action === 'reset') {
        threeViewer.resetCamera();
        if (typeof threeViewer.setWavelengthMode === 'function') {
          threeViewer.setWavelengthMode('visible');
        }
        if (threeViewer.loupeActive) {
          threeViewer.toggleMicroLoupe();
        }
        if (threeViewer.rakingActive) {
          threeViewer.toggleRakingLight();
        }
        if (threeViewer.backlightActive) {
          threeViewer.toggleBacklight();
        }
        if (threeViewer.xrfActive) {
          threeViewer.toggleXRF();
        }
        if (threeViewer.provenanceActive) {
          threeViewer.toggleProvenanceTimeline();
        }
        if (threeViewer.hydrationActive) {
          threeViewer.toggleHydrationTest();
        }
        if (threeViewer.exploded) {
          threeViewer.setExploded(false);
        }
        const expSlider = document.getElementById('explode-slider');
        if (expSlider) expSlider.value = 0;
        const expReadout = document.getElementById('explode-slider-val');
        if (expReadout) expReadout.textContent = '0%';

        const secSlider = document.getElementById('section-slider');
        if (secSlider) secSlider.value = 0;
        const secReadout = document.getElementById('section-slider-val');
        if (secReadout) secReadout.textContent = '0mm';

        const rakSlider = document.getElementById('raking-slider');
        if (rakSlider) rakSlider.value = 45;
        const rakReadout = document.getElementById('raking-slider-val');
        if (rakReadout) rakReadout.textContent = '45° NW';

        const timeSlider = document.getElementById('timeline-slider');
        if (timeSlider) timeSlider.value = 0;
        const timeReadout = document.getElementById('timeline-slider-val');
        if (timeReadout) timeReadout.textContent = '1485 · Incunabula';

        // Reset can rebuild the specimen (e.g. leaving 3D Book inspection), so the
        // side-panel chrome must be re-synced to the module, not left describing
        // the book that was being inspected.
        syncViewerChromeToVolume();
        toolButtons.forEach(b => {
          const a = b.getAttribute('data-action');
          if (a === 'wavelength-vis') setToggleState(b, true);
          else if (a && a.startsWith('wavelength-')) setToggleState(b, false);
          else if (a === 'toggle-lamp') setToggleState(b, threeViewer.lampMode === 'warm');
          else if (a !== 'compare') setToggleState(b, false);
        });
        const orbit = document.querySelector('.tool-button[data-action="rotate"]');
        if (orbit) setToggleState(orbit, true);
        updateCallout(null);
      } else {
        threeViewer.setViewMode('normal');
        setToolActive(action);
      }
    });
  });

  // Continuous Explosion Scrubber Slider (0% to 100%)
  const explodeSlider = document.getElementById('explode-slider');
  if (explodeSlider) {
    explodeSlider.addEventListener('input', (e) => {
      if (!threeViewer) return;
      const val = parseFloat(e.target.value) / 100;
      threeViewer.setExplodeAmount(val);
    });
  }

  // Laser Cross-Section Slicer (-100mm to +100mm)
  const sectionSlider = document.getElementById('section-slider');
  if (sectionSlider) {
    sectionSlider.addEventListener('input', (e) => {
      if (!threeViewer) return;
      threeViewer.setSectionSlice(parseFloat(e.target.value));
    });
  }

  // Raking Light Azimuth Slider (0° to 360°)
  const rakingSlider = document.getElementById('raking-slider');
  if (rakingSlider) {
    rakingSlider.addEventListener('input', (e) => {
      if (!threeViewer) return;
      threeViewer.setRakingAzimuth(parseFloat(e.target.value));
    });
  }

  // Chronological Provenance Timeline Slider (Epochs 0 to 3)
  const timelineSlider = document.getElementById('timeline-slider');
  if (timelineSlider) {
    timelineSlider.addEventListener('input', (e) => {
      if (!threeViewer) return;
      threeViewer.setProvenanceEpoch(parseInt(e.target.value, 10));
    });
  }

  function pickCompareReference(currentId) {
    if (currentId === 'classification-systems') {
      return volumes.find(v => v.id === 'marc-metadata') || volumes[1];
    }
    if (currentId === 'marc-metadata') {
      return volumes.find(v => v.id === 'classification-systems') || volumes[0];
    }
    if (activeVolume && activeVolume.specimen && activeVolume.specimen.compareWith) {
      const match = volumes.find(v => v.id === activeVolume.specimen.compareWith);
      if (match) return match;
    }
    const idx = volumes.findIndex(v => v.id === currentId);
    return volumes[(idx + 1) % volumes.length];
  }

  function renderCompareStrip() {
    if (!compareStrip || !activeVolume) return;
    const ref = volumes.find(v => v.id === compareReferenceId) || pickCompareReference(activeVolume.id);
    if (!ref) return;
    compareReferenceId = ref.id;

    const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    set('compare-left-glyph', activeVolume.thumbGlyph || '🏷');
    set('compare-left-name', activeVolume.title);
    set('compare-left-cat', activeVolume.category);
    set('compare-right-glyph', ref.thumbGlyph || '📖');
    set('compare-right-name', ref.title);
    set('compare-right-cat', ref.category);
    set('compare-focus', (activeVolume.keyFacts && activeVolume.keyFacts[0]) ? activeVolume.keyFacts[0].value : activeVolume.subtitle);
    set('compare-domain', `${activeVolume.category} · vs · ${ref.category}`);
    compareStrip.hidden = false;
  }

  function toggleCompareMode(force) {
    compareMode = typeof force === 'boolean' ? force : !compareMode;
    if (compareMode) {
      if (!compareReferenceId) {
        const ref0 = pickCompareReference(activeVolume && activeVolume.id);
        if (!ref0) { compareMode = false; return; }
        compareReferenceId = ref0.id;
      }
      const ref = volumes.find(v => v.id === compareReferenceId) || pickCompareReference(activeVolume?.id);
      if (!ref) { compareMode = false; return; }
      compareReferenceId = ref.id;
      renderCompareStrip();
      if (threeViewer) threeViewer.setCompare(ref);
    } else {
      if (compareStrip) compareStrip.hidden = true;
      if (threeViewer) threeViewer.setCompare(null);
    }
    document.getElementById('compare-action-btn')?.classList.toggle('active', compareMode);
    const compareTool = document.querySelector('.tool-button[data-action="compare"]');
    if (compareTool) setToggleState(compareTool, compareMode);
  }

  document.getElementById('compare-close')?.addEventListener('click', () => toggleCompareMode(false));
  document.getElementById('compare-swap')?.addEventListener('click', () => {
    if (!activeVolume) return;
    const others = volumes.filter(v => v.id !== activeVolume.id);
    if (!others.length) return;
    const idx = others.findIndex(v => v.id === compareReferenceId);
    const next = others[(idx + 1) % others.length];
    compareReferenceId = next.id;
    renderCompareStrip();
    if (threeViewer && compareMode) threeViewer.setCompare(next);
  });
  document.getElementById('compare-action-btn')?.addEventListener('click', () => toggleCompareMode());

  // Animate = guided hotspot tour
  document.getElementById('animate-action-btn')?.addEventListener('click', startGuidedTour);

  // Compare strip clicks
  document.getElementById('compare-right')?.addEventListener('click', () => {
    if (!compareMode || !compareReferenceId) return;
    const ref = volumes.find(v => v.id === compareReferenceId);
    if (ref) selectVolume(ref);
  });
  document.getElementById('compare-left')?.addEventListener('click', () => {
    document.querySelector('.viewer-shell')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Keep the two compare panels' accessible names in step with their contents.
  if (compareStrip) {
    const syncCompareLabels = () => {
      const left = document.getElementById('compare-left');
      const right = document.getElementById('compare-right');
      const leftName = document.getElementById('compare-left-name')?.textContent;
      const rightName = document.getElementById('compare-right-name')?.textContent;
      if (left) left.setAttribute('aria-label', `Scroll to the specimen under comparison: ${leftName || ''}`);
      if (right) right.setAttribute('aria-label', `Switch to reference specimen: ${rightName || ''}`);
    };
    new MutationObserver(syncCompareLabels).observe(compareStrip, {
      subtree: true, childList: true, characterData: true
    });
  }

  // Sidebar: saved-modules filter and brand reset (both were dead buttons)
  const savedModulesBtn = document.getElementById('saved-modules-btn');
  let savedOnlyActive = false;
  if (savedModulesBtn) {
    savedModulesBtn.addEventListener('click', () => {
      savedOnlyActive = !savedOnlyActive;
      savedModulesBtn.setAttribute('aria-pressed', String(savedOnlyActive));
      const list = savedOnlyActive
        ? volumes.filter((v) => favorites.includes(v.id))
        : volumes;
      renderVolumeList(list);
    });
  }

  const brandBtn = document.querySelector('.brand');
  if (brandBtn) {
    brandBtn.addEventListener('click', () => {
      const first = volumes[0];
      if (!first) return;
      savedOnlyActive = false;
      if (savedModulesBtn) savedModulesBtn.setAttribute('aria-pressed', 'false');
      if (searchInputEl) searchInputEl.value = '';
      renderVolumeList(volumes);
      selectVolume(first);
      document.querySelector('.viewer-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Auto Rotate Switch
  if (autoRotateToggle) {
    autoRotateToggle.addEventListener('click', () => {
      const switchEl = autoRotateToggle.querySelector('.switch');
      const isOn = switchEl.classList.contains('on');
      switchEl.classList.toggle('on', !isOn);
      autoRotateToggle.setAttribute('aria-pressed', String(!isOn));
      if (threeViewer) {
        threeViewer.toggleAutoRotate(!isOn);
      }
    });
  }

  // Modals Logic
  const openFeaturePageBtn = document.getElementById('open-feature-page-btn');
  if (openFeaturePageBtn) {
    openFeaturePageBtn.addEventListener('click', () => openFeaturePage());
  }

  const viewReaderBtn = document.getElementById('view-reader-btn');
  if (viewReaderBtn) {
    viewReaderBtn.addEventListener('click', () => {
      if (!activeVolume) return;
      if (readerTitle) readerTitle.textContent = activeVolume.title;
      if (readerPre) readerPre.textContent = activeVolume.readerText || "Full librarian documentation active.";
      openModal(readerModal);
    });
  }
  if (closeReaderBtn) {
    closeReaderBtn.addEventListener('click', () => closeModal(readerModal));
  }

  // Quiz Modal
  const quizBtn = document.getElementById('quiz-action-btn');
  if (quizBtn) {
    quizBtn.addEventListener('click', () => {
      if (!activeVolume || !activeVolume.quiz) return;
      currentQuizIndex = 0;
      quizScore = 0;
      renderQuizQuestion();
      openModal(quizModal);
    });
  }
  if (closeQuizBtn) {
    closeQuizBtn.addEventListener('click', () => {
      clearTimeout(quizAdvanceTimer);
      closeModal(quizModal);
    });
  }

  function renderQuizQuestion() {
    if (!activeVolume || !activeVolume.quiz || !quizContainer) return;
    // A pending auto-advance from the previous question must not fire into the
    // next quiz the user opens after closing this one mid-question.
    clearTimeout(quizAdvanceTimer);
    const qData = activeVolume.quiz[currentQuizIndex];
    if (!qData) {
      const total = activeVolume.quiz.length;
      const percentage = total ? Math.round((quizScore / total) * 100) : 0;
      let badgeEarnedMsg = '';
      if (percentage >= 80 && practiceEngine) {
        practiceEngine.awardBadge(activeVolume.id);
        badgeEarnedMsg = `<p class="quiz-badge-unlocked">🏆 Master Badge Unlocked: ${window.BiblioEsc(activeVolume.badgeName || 'Librarian Professional')}</p>`;
      }

      quizContainer.innerHTML = `
        <div class="quiz-complete">
          <h3>Librarian Certification Quiz Complete! ✦</h3>
          <p class="quiz-score-line">You scored <strong>${quizScore}</strong> out of <strong>${activeVolume.quiz.length}</strong> (${percentage}%).</p>
          ${badgeEarnedMsg}
          <button type="button" class="lesson-button" id="restart-quiz">Try Again</button>
        </div>
      `;
      document.getElementById('restart-quiz')?.addEventListener('click', () => {
        currentQuizIndex = 0;
        quizScore = 0;
        renderQuizQuestion();
      });
      return;
    }

    if (quizTitle) quizTitle.textContent = `${activeVolume.title} — Librarian Certification`;
    // Options are shuffled deterministically: the dataset authors every correct
    // answer first, so the presented order must not leak the solution.
    const shuffled = window.BiblioShuffleOptions(
      qData.options,
      qData.answer,
      `${activeVolume.id}:quiz:${currentQuizIndex}`
    );
    const answerIndex = shuffled.answerIndex;
    quizContainer.innerHTML = `
      <p style="font-size:1.05rem; font-weight:600; margin-bottom:16px;">Q${currentQuizIndex + 1}: ${window.BiblioEsc(qData.question)}</p>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${shuffled.options.map((opt, idx) => `
          <button type="button" class="quiz-option-btn" data-idx="${idx}" style="text-align:left; justify-content:flex-start; padding:12px;">
            ${window.BiblioEsc(opt)}
          </button>
        `).join('')}
      </div>
      <div id="quiz-explanation-box" class="practice-feedback" role="alert" aria-live="assertive" style="display:none; margin-top:14px;"></div>
    `;

    const optionBtns = quizContainer.querySelectorAll('.quiz-option-btn');
    const expBox = quizContainer.querySelector('#quiz-explanation-box');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = parseInt(btn.getAttribute('data-idx'), 10);
        const isCorrect = selected === answerIndex;
        optionBtns.forEach(b => { b.disabled = true; });
        expBox.style.display = 'block';

        btn.classList.add(isCorrect ? 'correct-choice' : 'incorrect-choice');
        expBox.className = `practice-feedback ${isCorrect ? 'success' : 'error'}`;
        expBox.replaceChildren();
        const label = document.createElement('strong');
        label.textContent = isCorrect ? '\u2713 Correct! ' : '\u2717 Incorrect. ';
        expBox.append(label, document.createTextNode(qData.explanation || ''));
        if (isCorrect) quizScore++;

        // Focus the explanation: correctness was otherwise signalled by colour only.
        expBox.setAttribute('tabindex', '-1');
        expBox.focus();

        quizAdvanceTimer = setTimeout(() => {
          currentQuizIndex++;
          renderQuizQuestion();
        }, 2200);
      });
    });
  }

  // Progress Certificate Modal
  if (openCertBtn) {
    openCertBtn.addEventListener('click', () => {
      const earnedBadges = readStorage('biblio-badges', []);
      const progress = readStorage('biblio-progress', {});

      if (badgesDisplayList) {
        badgesDisplayList.replaceChildren();

        const safeBadges = Array.isArray(earnedBadges)
          ? earnedBadges.filter((b) => typeof b === 'string')
          : [];

        if (safeBadges.length === 0) {
          const empty = document.createElement('span');
          empty.style.fontSize = '0.85rem';
          empty.style.color = 'var(--text-muted)';
          empty.textContent = 'No badges earned yet. Complete certification quizzes with score \u2265 80% to earn badges!';
          badgesDisplayList.appendChild(empty);
        } else {
          safeBadges.forEach((bId) => {
            const v = volumes.find((vol) => vol.id === bId || vol.badgeId === bId);
            const pill = document.createElement('span');
            pill.className = 'marc-tag-badge badge-pill';
            // textContent, never innerHTML: bId comes from localStorage.
            pill.textContent = v && v.badgeName ? v.badgeName : bId;
            badgesDisplayList.appendChild(pill);
          });
        }
      }

      // Surface the practice-progress record, which was previously written but never read.
      if (progressListEl) {
        progressListEl.replaceChildren();
        const raw = progress;
        const entries = (raw && typeof raw === 'object' && !Array.isArray(raw))
          ? Object.entries(raw).filter(([, v]) => v && typeof v === 'object' && !Array.isArray(v))
          : [];

        if (entries.length === 0) {
          const empty = document.createElement('p');
          empty.style.fontSize = '0.85rem';
          empty.style.color = 'var(--text-muted)';
          empty.textContent = 'No practice questions attempted yet. Open a specimen and try the Librarian Practice Panel.';
          progressListEl.appendChild(empty);
        } else {
          entries.forEach(([moduleId, rec]) => {
            // Clamp here too: a hand-edited record can hold NaN or correct > attempted.
            const attempted = Math.max(0, Number(rec.attempted) || 0);
            const correct = Math.max(0, Math.min(attempted, Number(rec.correct) || 0));
            const pct = attempted ? Math.round((correct / attempted) * 100) : 0;
            const vol = volumes.find((v) => v.id === moduleId);

            const row = document.createElement('div');
            row.className = 'progress-row';

            const label = document.createElement('span');
            label.className = 'progress-label';
            label.textContent = vol ? (vol.specimen ? vol.specimen.name : vol.title) : moduleId;

            const val = document.createElement('span');
            val.className = 'progress-value';
            val.textContent = `${correct}/${attempted} correct \u00b7 ${pct}%`;

            const bar = document.createElement('div');
            bar.className = 'progress-bar';
            bar.setAttribute('role', 'progressbar');
            bar.setAttribute('aria-valuemin', '0');
            bar.setAttribute('aria-valuemax', '100');
            bar.setAttribute('aria-valuenow', String(pct));
            bar.setAttribute('aria-label', `${label.textContent}: ${pct}% correct`);
            const fill = document.createElement('i');
            fill.style.width = `${pct}%`;
            bar.appendChild(fill);

            row.append(label, val, bar);
            progressListEl.appendChild(row);
          });
        }
      }

      openModal(certModal);
    });
  }
  if (closeCertBtn) {
    closeCertBtn.addEventListener('click', () => closeModal(certModal));
  }
  if (printCertBtn) {
    printCertBtn.addEventListener('click', () => window.print());
  }

  // Notes Modal
  const navNotesBtn = document.getElementById('nav-notes-btn');
  if (navNotesBtn) {
    navNotesBtn.addEventListener('click', () => {
      if (!activeVolume) return;
      notesTextarea.value = userNotes[activeVolume.id] || '';
      openModal(notesModal, '#notes-textarea');
    });
  }
  if (saveNotesBtn) {
    saveNotesBtn.addEventListener('click', () => {
      if (!activeVolume) return;
      const key = activeVolume.id;
      const value = notesTextarea.value;

      // A QuotaExceededError here used to be thrown uncaught, which wedged the
      // Save button permanently. Validate length and catch the failure.
      if (value.length > MAX_NOTE_LENGTH) {
        window.alert(`This note is too long (${value.length.toLocaleString()} characters). Please shorten it to under ${MAX_NOTE_LENGTH.toLocaleString()} characters.`);
        notesTextarea.focus();
        return;
      }

      const snapshot = userNotes[key];
      userNotes[key] = value;
      try {
        localStorage.setItem('biblio_notes', JSON.stringify(userNotes));
        window.alert('Librarian notes saved successfully to local archive!');
        closeModal(notesModal);
      } catch (err) {
        // Roll back so the in-memory state never diverges from what is stored.
        if (snapshot === undefined) delete userNotes[key];
        else userNotes[key] = snapshot;
        window.alert('Could not save: browser storage is full. Delete some notes or saved modules and try again.');
        notesTextarea.focus();
      }
    });
  }
  if (closeNotesBtn) {
    closeNotesBtn.addEventListener('click', () => closeModal(notesModal));
  }

  // Top Navigation
  const navButtons = {
    'nav-explore-btn': () => {
      const cls = volumes.find(v => v.id === 'classification-systems');
      if (cls) selectVolume(cls);
      document.querySelector('.viewer-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    'nav-metadata-btn': () => {
      const marc = volumes.find(v => v.id === 'marc-metadata');
      if (marc) selectVolume(marc);
    },
    'nav-sandbox-btn': () => {
      document.getElementById('card-call-number-sandbox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    'nav-reader-btn': () => {
      openFeaturePage();
    }
  };

  const allNavButtons = document.querySelectorAll('.main-nav button');
  allNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      allNavButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const handler = navButtons[btn.id];
      if (handler) handler();
    });
  });

  // Sidebar drawer toggle (mobile)
  const libraryTrigger = document.getElementById('mobile-library-trigger');
  const organLibrary = document.querySelector('.organ-library');
  if (libraryTrigger && organLibrary) {
    const syncDrawerState = () => {
      const open = organLibrary.classList.contains('mobile-open');
      libraryTrigger.setAttribute('aria-expanded', String(open));
    };
    libraryTrigger.addEventListener('click', () => {
      organLibrary.classList.toggle('mobile-open');
      syncDrawerState();
    });
    syncDrawerState();
  }
  if (organLibrary) {
    organLibrary.addEventListener('click', (e) => {
      if (e.target.closest('.organ-item')) {
        organLibrary.classList.remove('mobile-open');
        libraryTrigger?.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Global modal dismissal
  const allModals = document.querySelectorAll('.modal-backdrop');
  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Single Escape / Tab handler covering every dialog type. .modal-backdrop and
  // .folio-reader-modal both toggle an `open` class; the feature page is full-screen
  // and manages its own focus in js/feature-page.js.
  const allDialogs = document.querySelectorAll('.modal-backdrop, .folio-reader-modal');
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      let handled = false;
      allModals.forEach(modal => {
        if (modal.classList.contains('open')) { closeModal(modal); handled = true; }
      });
      if (featurePage && featurePageEl && featurePageEl.classList.contains('open')) {
        featurePage.close();
        handled = true;
      }
      if (bookReader && bookReader.isOpen && bookReader.isOpen()) {
        bookReader.close();
        handled = true;
      }
      if (handled) {
        if (!anyDialogOpen()) setBackgroundInert(false);
        e.preventDefault();
        return;
      }
      if (threeViewer) threeViewer.clearHotspotSelection();
      updateCallout(null);
      return;
    }

    if (e.key === 'Tab') {
      const activeDialog = [...allDialogs].find((d) => d.classList.contains('open'));
      if (!activeDialog) return;
      const focusable = [...activeDialog.querySelectorAll(focusableSelector)]
        .filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || !activeDialog.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !activeDialog.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  const recordDemoBtn = document.getElementById('record-demo-btn');
  const floatingRecordFab = document.getElementById('floating-record-fab');
  const recordModal = document.getElementById('record-modal');
  const closeRecordModalBtn = document.getElementById('close-record-modal');
  const startAutoTourBtn = document.getElementById('start-auto-tour-record-btn');
  const startManualRecordBtn = document.getElementById('start-manual-screen-record-btn');
  const recordingBar = document.getElementById('recording-bar');
  const recordingTimer = document.getElementById('recording-timer');
  const recordingBarStatus = document.getElementById('recording-bar-status');
  const stopRecordingBtn = document.getElementById('stop-recording-btn');

  let mediaRecorder = null;
  let recordedChunks = [];
  let recordingInterval = null;
  let recordingStartTime = 0;
  let activeRecordingStream = null;

  const openRecModal = () => openModal(recordModal);
  if (recordDemoBtn) recordDemoBtn.addEventListener('click', openRecModal);
  if (floatingRecordFab) floatingRecordFab.addEventListener('click', openRecModal);

  if (closeRecordModalBtn) {
    closeRecordModalBtn.addEventListener('click', () => {
      closeModal(recordModal);
    });
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function startRecordingUI(statusText) {
    closeModal(recordModal);
    if (recordingBar) recordingBar.hidden = false;
    if (recordingBarStatus) recordingBarStatus.textContent = statusText || 'Recording in progress…';
    if (recordingTimer) recordingTimer.textContent = '00:00';
    recordingStartTime = Date.now();
    clearInterval(recordingInterval);
    recordingInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
      if (recordingTimer) recordingTimer.textContent = formatTime(elapsed);
    }, 1000);
  }

  function stopRecordingEngine() {
    clearInterval(recordingInterval);
    if (recordingBar) recordingBar.hidden = true;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (activeRecordingStream) {
      activeRecordingStream.getTracks().forEach(track => track.stop());
      activeRecordingStream = null;
    }
  }

  function saveRecordingBlob(filename) {
    if (!recordedChunks.length) return;
    const selectedMime = recordedChunks[0]?.type || 'video/mp4';
    const finalFilename = filename || `biblio-atelier-recording-${Date.now()}.mp4`;
    const targetName = finalFilename.endsWith('.mp4') ? finalFilename : `${finalFilename}.mp4`;

    const blob = new Blob(recordedChunks, { type: selectedMime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = targetName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 250);
  }

  function getSupportedMimeType() {
    const types = [
      'video/mp4;codecs=avc1,mp4a.40.2',
      'video/mp4;codecs=avc1',
      'video/mp4',
      'video/webm;codecs=h264',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm'
    ];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return '';
  }

  // 1. Automatic Choreographed 18-second Feature Showcase Tour Recording
  if (startAutoTourBtn) {
    startAutoTourBtn.addEventListener('click', () => {
      const canvas = threeMountEl ? threeMountEl.querySelector('canvas') : null;
      if (!canvas) {
        alert('3D Canvas not found. Please ensure the specimen is loaded.');
        return;
      }

      if (typeof window.MediaRecorder === 'undefined') {
        alert('MediaRecorder is not supported in your current browser. You can press Windows Key + Alt + R to record your screen directly with Windows.');
        return;
      }

      recordedChunks = [];
      let stream = null;
      try {
        if (typeof canvas.captureStream === 'function') {
          stream = canvas.captureStream(60);
        } else if (typeof canvas.mozCaptureStream === 'function') {
          stream = canvas.mozCaptureStream(60);
        }
      } catch (e) {
        console.warn('captureStream error:', e);
      }

      if (!stream) {
        alert('Canvas capture is not supported by your browser. Please try the "Manual Full Screen Recording" option.');
        return;
      }

      activeRecordingStream = stream;
      const mimeType = getSupportedMimeType();

      try {
        mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      } catch (err) {
        try {
          mediaRecorder = new MediaRecorder(stream);
        } catch (fatalErr) {
          alert('Could not start MediaRecorder: ' + fatalErr.message);
          return;
        }
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        saveRecordingBlob('biblio-atelier-specimen-showcase.mp4');
      };

      mediaRecorder.start(250);
      startRecordingUI('Auto-recording 3D Specimen & Features…');

      const firstVol = volumes[0];
      if (firstVol) selectVolume(firstVol);
      if (threeViewer) {
        threeViewer.resetCamera();
        threeViewer.toggleAutoRotate(true);
      }

      const timeline = [
        { time: 3000, action: () => { if (threeViewer) threeViewer.toggleLayers(); } },
        { time: 5500, action: () => { if (threeViewer) threeViewer.setViewMode('isolate'); } },
        { time: 8000, action: () => { if (threeViewer) { threeViewer.setViewMode('normal'); threeViewer.toggleCrossSection(); } } },
        { time: 10500, action: () => { toggleCompareMode(true); } },
        { time: 13500, action: () => {
          toggleCompareMode(false);
          const marc = volumes.find(v => v.id === 'marc-metadata');
          if (marc) selectVolume(marc);
        }},
        { time: 15500, action: () => {
          if (threeViewer && activeVolume?.hotspots?.length) {
            threeViewer.focusHotspot(activeVolume.hotspots[0].id, { openLesson: false });
          }
        }},
        { time: 18000, action: () => {
          stopRecordingEngine();
        }}
      ];

      timeline.forEach(step => {
        setTimeout(() => {
          if (mediaRecorder && mediaRecorder.state === 'recording') {
            step.action();
          }
        }, step.time);
      });
    });
  }

  // 2. Manual Full-Screen / Window Recording
  if (startManualRecordBtn) {
    startManualRecordBtn.addEventListener('click', async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        alert('Screen capture API is not supported in this browser. Press Win + Alt + R to record using Windows Game Bar.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: { ideal: 60 } },
          audio: true
        });

        recordedChunks = [];
        activeRecordingStream = stream;
        const mimeType = getSupportedMimeType();

        try {
          mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
        } catch (err) {
          mediaRecorder = new MediaRecorder(stream);
        }

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          saveRecordingBlob('biblio-atelier-screen-recording.mp4');
        };

        stream.getVideoTracks()[0].addEventListener('ended', () => {
          stopRecordingEngine();
        });

        mediaRecorder.start(250);
        startRecordingUI('Recording your screen… Click Stop when finished');
      } catch (err) {
        console.warn('Screen recording cancelled or failed:', err);
      }
    });
  }

  if (stopRecordingBtn) {
    stopRecordingBtn.addEventListener('click', () => {
      stopRecordingEngine();
    });
  }

  // Public App APIs for Cross-Engine Interaction
  function openSpecimenInAtelier(specimenId) {
    const target = (typeof LIBRARY_DATA !== 'undefined' ? LIBRARY_DATA : volumes).find(v => v.id === specimenId) || activeVolume;
    if (typeof setExperienceMode === 'function') {
      setExperienceMode('specimen');
    }
    if (target && typeof selectVolume === 'function') {
      selectVolume(target);
    }
  }

  function openBookReaderForVolume(specimenId) {
    if (!bookReader) return;
    const vol = (typeof LIBRARY_DATA !== 'undefined' ? LIBRARY_DATA : volumes).find(v => v.id === specimenId) || activeVolume;
    const codex = (threeViewer && typeof threeViewer.getHistoricCodexData === 'function')
      ? threeViewer.getHistoricCodexData(vol)
      : null;
    const bookData = codex || {
      title: vol.title,
      author: vol.subtitle || 'Rare Volume',
      year: '1495',
      callNumber: vol.badgeId || '813.52',
      pages: [
        { number: 1, title: 'Frontispiece & Rubricated Colophon', content: vol.description || 'Rare Library Volume Colophon.' },
        { number: 2, title: 'Scholarly Commentary', content: vol.scholarlyNote || 'Curatorial analysis.' }
      ]
    };
    bookReader.open(bookData, 0);
  }

  window.biblioApp = {
    openSpecimenInAtelier,
    openBookReader: openBookReaderForVolume,
    setExperienceMode,
    selectVolume: (vol) => selectVolume(vol)
  };

  // Initial Module Selection
  if (activeVolume) {
    selectVolume(activeVolume);
  }

  // Initialize to Walkthrough mode on landing (Step 0: Grand Foyer)
  if (typeof setExperienceMode === 'function') {
    setExperienceMode('walkthrough');
  }
});
