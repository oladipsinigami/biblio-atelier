# Biblio Atelier — Everything a Librarian Needs to Know
### Comprehensive Interactive 3D Library Science & Archivist Guide

---

## 📌 Executive Summary

**Biblio Atelier** is a museum-grade, interactive 3D web application built as an immersive educational atelier covering **Library Science, Metadata Cataloging Standards, Preservation Science, Library Management, and Architectural Stacks**.

Designed specifically for librarians, information specialists, library science students, and archivists, it combines an editorial aesthetic inspired by *Anatomy Atelier* with an interactive **Three.js 3D Library Architecture Viewer**, real-time search filtering, a **Librarian Certification Quiz**, and an **Archivist Personal Notes** system.

---

## 🛠️ Technology Stack & Architecture

- **Core Application**: HTML5, Vanilla CSS3 (Custom properties, CSS Grid, Flexbox, Glassmorphism backdrop-filters), and Vanilla JavaScript (ES6 Modules).
- **3D Specimen Engine**: **Three.js** (r128) + **OrbitControls** with anti-aliasing, PCF soft shadow maps, ACES filmic tone mapping, and procedural canvas texture generation.
- **Typography & Aesthetics**:
  - Headings: *Cormorant Garamond* (Google Fonts serif).
  - Body & UI: *DM Sans* (Google Fonts sans-serif).
  - Color Palette: Alabaster cream (`#f7f0e7`), deep chocolate (`#2c221e`), muted parchment (`#e3d8cc`), antique gold (`#c28e46`), and dynamic accent variables (`--item-accent`).

---

## 📚 What Was Built: 9 Core Library Science Modules

### 1. Classification Systems (DDC & LCC)
- **Dewey Decimal Classification (DDC)**: 10 Main Classes (000–900 series), relative location rules, decimal expansion.
- **Library of Congress Classification (LCC)**: 21 Letter Classes (A–Z), Cutter numbers (`.S57`), subject placement.
- **Call Number Anatomy**: Breakdown of location marks, main class numbers, author cutters, and work marks.

### 2. MARC 21 & Dublin Core Metadata Standards
- **MARC 21 Field Tagging**:
  - `Tag 100`: Main Entry — Personal Author
  - `Tag 245`: Title & Statement of Responsibility (`$a`, `$b`, `$c`)
  - `Tag 260/264`: Publication & Distribution Info
  - `Tag 650`: Library of Congress Subject Headings (LCSH)
- **Dublin Core XML**: 15 Core lightweight web metadata elements.
- **OCLC WorldCat Network**: Global shared cataloging infrastructure.

### 3. Academic & Research Library Systems
- **Flagship Libraries**: Harvard Library (20M vols) & Bodleian Library (13M vols).
- **Core Operations**: EZproxy remote database authentication, institutional repositories (DSpace/EPrints), special collections reading rooms, and interlibrary loan (ILLiad).

### 4. Public Libraries & Patron Services
- **Civic Engagement**: Andrew Carnegie's legacy (2,509 libraries funded), digital equity, free public internet, youth storytimes, maker spaces.
- **Digital Circulation**: Libby/OverDrive, Hoopla, Kanopy e-books and streaming.
- **Ethics**: ALA Library Bill of Rights & Patron Privacy protection.

### 5. Preservation & Archival Conservation Vaults
- **Climate Parameters**: Ideal storage vault conditions (60°F ± 5°F / 50% ± 5% Relative Humidity).
- **Paper Acid Burn & Deacidification**: Acid hydrolysis neutralization using magnesium oxide spray & calcium phytate for iron gall ink.
- **Disaster Restoration**: Vacuum freeze-drying techniques for flooded paper collections.

### 6. Digital Repositories & Open Access
- **Platforms & Standards**: Internet Archive, HathiTrust, Europeana, DPLA.
- **Protocols**: IIIF (International Image Interoperability Framework) for deep-zoom manuscript viewing & OAI-PMH XML harvesting.

### 7. Reference Services & Search Syntax
- **Reference Interview**: Methodology transforming vague queries into targeted research strategies.
- **Boolean Logic**: `AND` (Narrows), `OR` (Broadens), `NOT` (Excludes), truncation wildcards (`librar*`), proximity syntax (`NEAR/3`).
- **Source Evaluation**: The CRAAP Test (Currency, Relevance, Authority, Accuracy, Purpose).

### 8. Collection Management & Weeding (MUSTIE)
- **MUSTIE Weeding Formula**: **M**isleading, **U**gly, **S**uperseded, **T**trivial, **I**rrelevant, **E**lsewhere.
- **Acquisitions**: Patron-Driven Acquisition (PDA), Firm Orders, and Approval Plans.

### 9. Special Collections & Rare Materials
- **Handling**: Supports supervised reading-room handling, padded weights, and non-invasive photography.
- **Description**: Connects rare-book care with provenance, descriptive cataloging, and controlled access.

---

## ⚙️ How It Works: Application Mechanics & User Flow

```
+-----------------------------------------------------------------------------------+
|                                  TOPBAR HEADER                                    |
| Brand Mark | Navigation Tabs (Classification, MARC, Guide...) | Search Bar | Profile  |
+--------------------------+----------------------------------+---------------------+
| SIDEBAR LIBRARY SCIENCE  | CENTER 3D SPECIMEN VIEWER        | RIGHT DETAIL PANEL  |
| - DDC & LCC System       | - Three.js 3D Library Stack      | - Module Title      |
| - MARC 21 Metadata       | - Screen-Space Hotspot Markers   | - Key Facts Grid    |
| - Academic Libraries     | - Floating Controls Toolbar:     | - Scholarly Note    |
| - Public Services        |   [Orbit] [Dewey Map] [UV Scan]  | - Trivia Box        |
| - Preservation Vaults    |   [Exploded Stacks] [Reset]      | - View Guide Button |
| - Digital Repositories   | - Auto-Rotate Switch Toggle      | - Action Grid Buttons|
| - Reference Interview    |                                  |   (Call #, Quiz)    |
| - Collection Weeding     |                                  |                     |
+--------------------------+----------------------------------+---------------------+
|                      BOTTOM EXTENDED LEARNING CARDS GRID                          |
| Micro-Scan Card  |  Comparative Analysis Card  |  Management Rules & Workflows Card   |
+-----------------------------------------------------------------------------------+
```

### 1. 3D Viewer Mechanics (`js/three-viewer.js`)
- **Initialization**: Creates a WebGL canvas inside `.three-mount`, sets up a perspective camera, studio spot/fill lighting, and a mahogany shadow plinth with a gold rim.
- **Procedural Mesh Generation**: Generates 3D oak shelves (`THREE.BoxGeometry`) filled with book volumes. Spine textures are dynamically created on HTML5 Canvases with grain noise, gold rib bands, and call number labels (`025.43 D519c`).
- **Screen-Space Hotspots**: Raycasts 3D coordinates into NDC space, converting them into interactive HTML hotspot pins (`.hotspot-pin`) overlaid on the canvas. Clicking a pin smoothly lerps the camera towards the target.
- **Special Mode Transforms**:
  - **Orbit Mode**: Enables 360° rotation with dampening.
  - **Dewey Map Mode**: Applies classification subject colors across shelf books.
  - **Climate UV Scan Mode**: Replaces materials with a glowing cyan cyber-UV wireframe shader (`0x00f3ff`).
  - **Exploded Stacks Mode**: Lerps shelf boards and books apart along local axes.

### 2. State & UI Coordinator (`js/app.js`)
- **Active Module Selection**: Clicking any module in the left sidebar updates the active volume state, reloads the 3D model, sets ambient glows, populates the key facts grid, updates microscopic scans, and updates comparison cards.
- **Real-Time Search Engine**: Listens to keyup/input events on `#search-input`, filtering titles, authors, categories, and eras instantaneously.
- **Interactive Modals**:
  - **Librarian Master Guide**: Displays complete paginated documentation in `#reader-modal`.
  - **Librarian Certification Quiz**: Evaluates user answers interactively with real-time score tracking and feedback.
  - **Archivist Notes**: Allows writing custom notes per module, saved persistently in browser `localStorage`.

---

## 📂 File Structure & Location

All project files are saved in `c:\Users\oladips\Downloads\interactive library`:

| File Path | Description |
| :--- | :--- |
| [index.html](file:///c:/Users/oladips/Downloads/interactive%20library/index.html) | Main HTML5 web application shell & structural layout |
| [style.css](file:///c:/Users/oladips/Downloads/interactive%20library/style.css) | Complete CSS design system, typography, glassmorphism, & hotspot overlay styles |
| [js/library-data.js](file:///c:/Users/oladips/Downloads/interactive%20library/js/library-data.js) | Comprehensive JavaScript dataset for the 9 core Library Science modules |
| [js/three-viewer.js](file:///c:/Users/oladips/Downloads/interactive%20library/js/three-viewer.js) | Three.js 3D Viewer Engine (3D Library Stacks, Hotspots, UV Scan, Exploded View) |
| [js/app.js](file:///c:/Users/oladips/Downloads/interactive%20library/js/app.js) | Main application state manager, search engine, 3D controls, & quiz controller |
| [PROJECT_SUMMARY.md](file:///c:/Users/oladips/Downloads/interactive%20library/PROJECT_SUMMARY.md) | This project summary and technical reference guide |

---

## 🚀 How to Run the Application

1. Open your terminal in `c:\Users\oladips\Downloads\interactive library`.
2. Start the local server by running:
   ```bash
   python -m http.server 3000
   ```
3. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```
