# Biblio Atelier — Work Report

**Project:** Biblio Atelier — Observable 3D Library Specimen Studio
**Scope of this report:** All changes made across two work phases — (1) bug-fixing and content expansion to a genuine 9 modules, and (2) the new editorial per-module Feature Page layer.
**Stack:** Vanilla JS (no framework, no build step), plain HTML/CSS, Three.js r128 via CDN, static-served. State persisted in `localStorage`.

---

## 1. Executive summary

The app is a museum-styled, 3D-first teaching tool for Library & Information Science. It began with a mismatch between its marketing ("8 domains") and its data (5 modules), several broken interactions, and no long-form reading experience.

Two phases of work were completed:

- **Phase A — Fix real bugs + reach a genuine 9 modules.** Every identified interaction bug was fixed, and four fully-authored modules (with 3D specimens) were added so the module count matches the application.
- **Phase B — Editorial Feature Page.** A full-screen, hero-style "deep reading & feature discovery" page was added for each of the 9 modules.

All changes were verified with `node --check`, a data-integrity script, DOM-ID cross-checks, and a local HTTP server returning 200 for every asset. Live WebGL/browser interaction was **not** machine-testable in this environment (no headless browser with WebGL), so 3D visuals and scroll animations are verified structurally, not visually.

---

## 2. Architecture at a glance

```
index.html            # single page; loads 4 data/logic scripts + Three.js CDN
style.css             # design tokens (:root) + all component styles
js/
  library-data.js     # LIBRARY_DATA[] — the single source of truth for all content
  three-viewer.js     # ThreeBookViewer — builds & renders 3D specimens
  practice-engine.js  # PracticeEngine — quizzes, sandboxes, MUSTIE, scenarios
  feature-page.js     # FeaturePage — NEW editorial deep-reading layer
  app.js              # DOMContentLoaded coordinator; wires everything together
```

**Key conventions to know before editing:**

- **Data-driven.** Nearly all UI is rendered from the `LIBRARY_DATA` array. To add content you add data, not markup.
- **Global-class pattern.** Each logic file defines a class and exposes it via `window.X = X`. `app.js` instantiates them after `DOMContentLoaded`. There is no module system.
- **Design tokens.** All colour/typography lives in CSS custom properties under `:root` (cream `--bg-primary`, chocolate `--text-main`, antique gold `--gold-accent`, `--font-serif` Cormorant Garamond, `--font-sans` DM Sans). Never hard-code these — reference the token.
- **Per-item accent.** Each module has an `accent` colour threaded through the UI via `--item-accent` / `--organ-accent` / `--fp-accent`.

---

## 3. Phase A — Bug fixes

Each item below is *symptom → root cause → fix → where*.

### 3.1 Mobile layout collapse
- **Symptom:** On narrow screens the three-column workspace broke; the info panel and specimen library were unusable.
- **Fix:** Reworked media queries. `@media (max-width:1024px)` stacks the info panel under the viewer (kept visible) and turns the specimen library into an off-canvas drawer (`.organ-library.mobile-open`, `width: min(85%,320px)`). Added `@media (max-width:640px)` for a wrapping topbar and a horizontally-scrolling nav. Added a hamburger `#mobile-library-trigger` in the topbar.
- **Where:** `style.css`, `index.html`, `app.js` (drawer toggle).

### 3.2 View-mode colour loss (UV / Isolate)
- **Symptom:** Switching to UV or Isolate view and back left specimens permanently discoloured, because the "normal" colour was being derived from an already-mutated material.
- **Fix:** On specimen load, cache each mesh's original material: `child.userData.originalMaterial = child.material`. `setViewMode('normal')` now **restores** that cached material instead of recomputing it.
- **Where:** `three-viewer.js` (`loadBookSpecimen`, `setViewMode`).

### 3.3 Reset-camera did nothing
- **Symptom:** The Reset tool button had no effect.
- **Fix:** Added `resetCamera()` that returns the camera and OrbitControls target to their home pose and calls `controls.update()`. `app.js` now calls `setViewMode('normal')` **and** `resetCamera()` on the reset action.
- **Where:** `three-viewer.js`, `app.js`.

### 3.4 Dead navigation buttons
- **Symptom:** Top-nav tabs highlighted but routed nowhere.
- **Fix:** Added a `navButtons` routing map in `app.js` (Classification → select module; Metadata → select MARC module; Sandbox → scroll to the call-number card; Guide → open the feature page). `.active` state now toggles across `.main-nav button`.
- **Where:** `app.js`.

### 3.5 MUSTIE tool not wired
- **Symptom:** The MUSTIE weeding tool existed in the engine but was never mounted.
- **Fix:** Added a `#mustie-mount` card in the learning-cards grid and a `renderMUSTIETool` call in `selectVolume`. Also fixed a duplicate `class` attribute on the MUSTIE feedback element.
- **Where:** `index.html`, `app.js`, `practice-engine.js`.

### 3.6 Modals could not be dismissed by Escape / backdrop
- **Symptom:** Modals only closed via the × button.
- **Fix:** Global handlers in `app.js` — click on a `.modal-backdrop` (outside the card) closes it; `Escape` closes all open modals.
- **Where:** `app.js`.

### 3.7 The 9-vs-5 mismatch
- **Symptom:** UI and documentation described fewer specimens than the data.
- **Fix:** The data now contains nine authored modules, and the documentation consistently describes all nine.

### 3.8 Data-driven card visibility
- **Added:** `toggleCard(cardId, show)` hides bottom learning cards for modules that don't supply that tool's data, so no empty tools render.
- **Where:** `app.js`.

---

## 4. Phase A — Three new modules (genuine 8)

Three modules were added to `LIBRARY_DATA`, each fully populated (not stubs):

| id | Accent | 3D specimen type | Builder added |
|----|--------|------------------|---------------|
| `academic-libraries` | `#3f6f8f` | `academic-reading-room` | `createAcademicReadingRoomSpecimen` |
| `public-libraries` | `#b0455f` | `public-hub` | `createPublicHubSpecimen` |
| `digital-repositories` | `#2f8f7f` | `digital-repository` | `createDigitalRepositorySpecimen` |

Each module includes: `keyFacts`, `hotspots` (with micro-quizzes), `practice`, `scenarios`, `readerText`, a certification `quiz`, and a `badge`. In `three-viewer.js`, specimen construction was refactored to a **builder dispatch object** mapping `specimen.type → builder function`, invoked with `build.call(this, volData)`. The digital-repository specimen has an animated ring (`repositoryRing.rotation.z += 0.01` in `animate()`).

Collection-management absorbed the expanded MUSTIE practice (3 books); preservation-science had its stray MUSTIE data removed.

---

## 5. Phase B — Editorial Feature Page

Goal (from `BIBLIO_ATELIER_FEATURE_PAGES.md`): a calm, premium, editorial page per module with a hero, a **unique** feature grid, scrollable scholarly sections, light interactivity, and footer CTAs — consistent with the atelier aesthetic.

### 5.1 New file — `js/feature-page.js`
A `FeaturePage` class following the existing global-class pattern (`window.FeaturePage = FeaturePage`). It renders a full-screen overlay from a module's `hero`/`features`/`deepSections`/`readerText`.

Structure produced:
- **Reading progress bar** — sticky top; width tracks scroll (`updateProgress`).
- **Top nav** — "Back to Atelier" + a quiz shortcut.
- **Hero** — Latin kicker, Cormorant Garamond title, gold accent line, subtitle, two CTAs (*Explore the Specimen*, *Start Practice*), and a glyph badge.
- **Feature grid** — one card per `features[]` item. Non-interactive cards **expand** on click to reveal `detail`; interactive cards carry a `data-action` that deep-links to a tool.
- **Deep sections** — each `deepSections[]` entry; `formatContent` converts blank-line-separated text into paragraphs and `-`/`•` lines into bullet lists.
- **Catalog record** + **Practice block** — quick buttons to the module's real tools (sandbox / MARC / MUSTIE / quiz).
- **Footer CTA** — *Return to Specimen* + *Take the Certification Quiz*.
- **Interactivity** — reveal-on-scroll via `IntersectionObserver` (`.fp-reveal` → `.in-view`), smooth scroll, Escape to close.

Interaction is handled by one delegated binder over `[data-fp], [data-action], .fp-feature-card`. (An early version selected only `[data-fp],[data-action]`, which silently skipped non-interactive cards so they never expanded — fixed by adding `.fp-feature-card` to the selector.)

### 5.2 Content — `js/library-data.js`
A `FEATURE_PAGE_CONTENT` object keyed by module `id`, merged onto `LIBRARY_DATA` in a `forEach` after the array literal. This keeps the (large) module definitions lean while giving every module **6 unique features + 3 deep sections**. Features are genuinely module-specific — e.g.:

- **Classification:** Relative Location Map, Decimal Expansion Explorer, DDC vs LCC, Call Number Anatomy (→ sandbox), Subject Hierarchy Tree, Shelving Logic Simulator.
- **MARC:** Field Tag Visualizer, Subfield Builder (→ MARC tool), Indicator Guide, Dublin Core Comparison, WorldCat Anatomy, Common Errors.
- **Preservation:** Climate Controls, Acid Migration, Disaster Decision Tree (→ quiz), Degradation Timeline, Vault Design, Deacidification.
- …and unique sets for Reference, Collection, Academic, Public, and Digital Repositories.

Each interactive feature's `action` is one of `sandbox`/`marc`/`mustie`/`quiz`, and each was verified to have backing data in its module.

### 5.3 Styling — `style.css`
~400 lines appended, using existing tokens plus a per-module `--fp-accent`. Covers the progress bar, sticky nav, hero, feature grid (with expand animation), deep sections (accent-barred headings, bulleted lists, monospace catalog record), practice block, footer, reveal-on-scroll transitions, and a `@media (max-width:720px)` stack. No new colours were introduced — everything derives from the atelier palette.

### 5.4 Wiring — `index.html` + `js/app.js`
- `index.html`: added the `#feature-page` container, the `js/feature-page.js` script tag (before `app.js`), and an *Explore this specimen's feature page* button in the info panel.
- `app.js`: instantiates `FeaturePage`; `openFeaturePage(vol)` opens it for the active module and supplies handlers — `explore`/`quiz` return to the correct specimen (re-selecting it if needed), `practice`/`sandbox`/`marc`/`mustie` close the page and scroll to the relevant tool. The *Library Guide* nav tab also opens the page; Escape closes it.

---

## 6. How to work with the code

### 6.1 Run it locally
Any static server works; from the project root:
```bash
python -m http.server 8107
# then open http://localhost:8107/
```
(Opening `index.html` via `file://` also works, but a server avoids any path/CORS surprises with the CDN scripts.)

### 6.2 Add a new module
1. Append an object to `LIBRARY_DATA` in `js/library-data.js` with the standard shape (`id, title, subtitle, category, accent, specimen{type,...}, keyFacts, hotspots, practice, quiz, badge`, etc.).
2. If it needs a new 3D form, add a builder in `js/three-viewer.js` and register it in the builder-dispatch object under the same `specimen.type`.
3. Add a `FEATURE_PAGE_CONTENT[id]` entry with `features[]` (4–6) and `deepSections[]` (≥3) for its feature page.
4. No HTML change is needed — the sidebar and feature page render from data.

### 6.3 Add a feature-page CTA that opens a tool
Give a feature `{ interactive: true, action: 'sandbox' | 'marc' | 'mustie' | 'quiz' }`. Make sure the module actually supplies that tool's data (`callNumberPractice` / `marcPractice` / `mustiePractice`, or a `quiz`). The handler map in `app.js`'s `openFeaturePage` routes the rest.

### 6.4 Style changes
Edit tokens in `:root` to reshade globally; edit the relevant component block otherwise. Feature-page styles are namespaced with the `fp-` prefix.

---

## 7. Verification performed

- **Syntax:** `node --check` passes on all five JS files.
- **Data integrity:** a Node script loads `LIBRARY_DATA` and confirms 9 modules, each with 6 features / 3 deep sections, and that every interactive `sandbox`/`marc`/`mustie` action has backing practice data.
- **DOM wiring:** every `getElementById` target used by the feature-page wiring exists in `index.html`; the script tag is present.
- **Serving:** local HTTP server returns **200** for `/`, `index.html`, `style.css`, and all five JS files.

### Not verified (environment limits)
- Live 3D rendering / OrbitControls interaction and the scroll-driven animations require a real browser with WebGL, which isn't available headless here. Recommend a manual click-through: open each module → open its feature page → confirm the hero, card expansion, reveal-on-scroll, progress bar, and that every CTA returns to the correct specimen or tool.

---

## 8. Files changed

| File | Nature of change |
|------|------------------|
| `js/feature-page.js` | **New** — FeaturePage renderer + interactivity |
| `js/library-data.js` | +3 modules (Phase A); +`FEATURE_PAGE_CONTENT` merge (Phase B) |
| `js/three-viewer.js` | Material caching, builder dispatch, 3 new specimen builders, `resetCamera`, ring animation |
| `js/practice-engine.js` | MUSTIE feedback attribute fix |
| `js/app.js` | Bug-fix wiring (nav, drawer, reset, modals, card visibility) + FeaturePage init & handlers |
| `index.html` | Hamburger trigger, MUSTIE card, feature-page container + script + entry button |
| `style.css` | Responsive rework (Phase A) + ~400 lines of feature-page styles (Phase B) |
