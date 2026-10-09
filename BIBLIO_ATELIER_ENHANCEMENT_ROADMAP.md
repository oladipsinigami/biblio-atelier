# Biblio Atelier — AI Implementation Roadmap
### Optimized for Gemini Flash (and similar coding models)

**Purpose of this file**  
This document is written so you can copy sections directly into Gemini Flash and get high-quality, consistent code.  
Every major feature is broken into **atomic, copy-paste ready tasks**.

**Current Stack (do not change unless necessary)**  
- HTML5 + Vanilla CSS3 + Vanilla JavaScript (ES6 Modules)  
- Three.js r128 + OrbitControls  
- Data in `js/library-data.js`  
- Interactive engine in `js/practice-engine.js`  
- Main logic in `js/app.js` and `js/three-viewer.js`  
- localStorage for notes, badges, and progress  

---

## PHASE 1 — Quick Wins ✅ (COMPLETED)

### TASK 1.1 — Create a reusable Practice Panel system ✅
- Created `renderPracticePanel(moduleData, containerEl)` in `js/practice-engine.js`
- Inserted `<div id="practice-panel-container"></div>` in right detail column
- Implemented practice questions, instant green/red feedback + detailed explanations
- Stored scores in localStorage under `biblio-progress`

### TASK 1.2 — Upgrade Certification Quiz with explanations + badges ✅
- Added `explanation` field to all quiz questions
- Immediate explanation feedback on right/wrong answer
- Awarded badges (`ddc-navigator`, `marc-tagger`, `preservation-guardian`, `reference-pro`, `collection-manager`) when score ≥ 80%
- Stored badges in localStorage: `biblio-badges`

### TASK 1.3 — Hotspot Micro-Quiz ✅
- Clicking a 3D hotspot opens a micro-lesson modal + 1 quick test question
- Camera lerps smoothly towards target 3D hotspot coordinates

### TASK 1.4 — Scenario Cards (“You are the librarian”) ✅
- Realistic decision-making scenario cards integrated in `library-data.js` and rendered via `practice-engine.js`

---

## PHASE 2 — High-Value Interactive Tools ✅ (COMPLETED)

### TASK 2.1 — Call Number Constructor (Priority) ✅
- Interactive step-by-step call number builder for Main Class -> Subdivision -> Author Cutter -> Workmark
- Live spine label preview (`020.54 .D519i`) with instant verification feedback

### TASK 2.2 — Simple MARC Field Practice ✅
- Interactive inputs for Tags 100, 245, 260/264, 650
- Real-time validation against Library of Congress MARC standards

### TASK 2.3 — MUSTIE Decision Tool ✅
- Interactive MUSTIE weeding decision simulator evaluating physical book records + circulation stats
- Instant feedback mapping to MUSTIE acronym (**M**, **U**, **S**, **T**, **I**, **E**)

---

## PHASE 3 — Progress & Polish ✅ (COMPLETED)

### TASK 3.1 — Progress Dashboard ✅
- MLS Certification Progress modal displaying earned badges and total mastery

### TASK 3.2 — Export Certificate ✅
- Printable Official MLS Master Certificate layout (`window.print()`)

### TASK 3.3 — Accessibility & Mobile ✅
- Keyboard accessibility, responsive grid layout, and touch support

---

## Data & Code Conventions

- All learning content inside `js/library-data.js`
- Interactive engine inside `js/practice-engine.js`
- 3D Viewer inside `js/three-viewer.js`
- Main coordinator inside `js/app.js`
- Saved progress under `biblio-progress` & badges under `biblio-badges`

### PHASE 4 — Production Hardening

The educational prototype is feature-complete, but the following production tasks remain:

- Add imported GLB/GLTF/OBJ loading with a procedural fallback and loading/error states.
- Run a real-browser accessibility pass for WebGL controls, modal focus, reduced motion, and screen readers.
- Fact-check cataloging and preservation content with a qualified LIS specialist.
- Add a versioned persistence schema before introducing accounts or server synchronization.

**End of AI Implementation Roadmap — Core interactive tasks completed; production hardening remains.**
