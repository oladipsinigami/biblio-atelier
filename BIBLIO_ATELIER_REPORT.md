# Biblio Atelier — Technical & Architectural Report
### Observable 3D Library Specimen Studio & Master Librarian Guide

---

## Executive Summary

**Biblio Atelier** is a museum-grade interactive 3D web application designed as an educational atelier for Library & Information Science (LIS), Bibliographic Cataloging, Preservation Science, and Library Management.

Inspired by the editorial elegance, calm atmosphere, and high-fidelity 3D specimen observation model of [Anatomy Atelier](https://anatomy-livid.vercel.app/) by @thebuggeddev, Biblio Atelier shifts the learning experience from a room full of generic books into **an isolated, observable 3D library specimen on a mahogany-and-gold plinth** for every major domain of librarianship.

```
                  +----------------------------------------------+
                  |              BIBLIO ATELIER                  |
                  |  Observable 3D Library Specimen Studio       |
                  +-----------------------+----------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
  [ 3D SPECIMEN ENGINE ]      [ LIBRARIAN KNOWLEDGE BASE ]   [ INTERACTIVE PRACTICE ENGINE ]
  - Three.js WebGL Renderer   - DDC & LCC Classification     - Reusable Practice Panels
  - Mahogany & Gold Plinth    - MARC 21 & Dublin Core        - Call # Construction Sandbox
  - Screen-Space Hotspots     - Preservation & Acid Burn     - MARC Tagging Validator
  - Orbit / Isolate / UV      - Boolean Reference Syntax     - MUSTIE Weeding Simulator
  - Specimen View Modes       - MUSTIE Weeding Formula       - MLS Certification Badges
```

---

## 1. Design Philosophy & Visual Aesthetic

Biblio Atelier adopts a calm, contemplative, museum-atelier design language:

- **Color Palette**:
  - Background: Soft Alabaster Cream (`#f7f0e7`)
  - Primary Structural Text: Deep Chocolate (`#2c221e`)
  - Secondary Accent: Antique Gold (`#c28e46`)
  - Dynamic Accent Variables: `--item-accent` custom-tailored per module (`#b85c37`, `#5a8b66`, `#d49b4b`, `#785b88`)
- **Typography System**:
  - Headings & Titles: *Cormorant Garamond* (Google Fonts serif) for editorial authority.
  - UI Labels & Code Inputs: *DM Sans* (Google Fonts sans-serif) and Monospace font stacks for cataloging codes.
- **Glassmorphic Surface Design**: Floating 3D controls toolbar and tip overlays using `backdrop-filter: blur(12px)` and semi-transparent parchment glass (`rgba(255, 252, 247, 0.82)`).

---

## 2. The 3D Observable Specimen Architecture

Instead of cluttering the viewport with complex multi-shelf environments, every module places **one central, precision-crafted specimen** on a Mahogany Plinth with a polished Brass Rim Edge:

| Library Science Module | Observable 3D Specimen | Latin / Scholarly Designation | Key Observable Features |
| :--- | :--- | :--- | :--- |
| **Classification Systems** | **The Classification Bay Specimen** | *Specimen Locationis Relativae* | Single oak shelving bay exhibiting relative location indexing, DDC decimal expansions (`025.43`), and Cutter number alignment (`.S57`). |
| **MARC 21 & Metadata** | **The MARC Catalog Card Specimen** | *Specimen Tagging Bibliographici* | 3D physical catalog card on a brass desktop stand overlaid with glowing digital MARC field tags (`100`, `245`, `260`, `650`). |
| **Preservation Science** | **The Archival Vault Drawer Specimen** | *Specimen Archivi Conservativi* | Archival metal vault drawer under UV light showcasing cellulose acid degradation, thermo-hygrometer sensors, and acid-free Mylar boxes. |
| **Reference Services** | **The Reference Desk Stage Specimen** | *Specimen Syntaxeos Informaticae* | Reference desk stage with glowing 3D Boolean logic Venn diagram rings (`AND`, `OR`, `NOT`) and search syntax nodes. |
| **Collection Management** | **The Weeding Cart Specimen** | *Specimen Deselectionis Collectionis* | Mobile archival weeding cart with volume condition tags, physical wear indicators, and circulation turnover heatmaps. |

---

## 3. Comprehensive Library Science Knowledge Base

Biblio Atelier synthesizes everything a librarian needs to know across 9 core domains:

1. **Classification Systems (DDC & LCC)**:
   - **Dewey Decimal Classification (DDC)**: 10 Main Classes (000–900 series), decimal expansion rules, relative location indexing.
   - **Library of Congress Classification (LCC)**: 21 Letter Classes (A–Z), Cutter-Sanborn alphanumeric author codes.
2. **MARC 21 & Dublin Core Metadata Standards**:
   - **MARC 21 Tagging Structure**: Field `100` (Main Author `$a`), Field `245` (Title Statement `$a $b $c`), Field `260/264` (Imprint), Field `650` (LCSH Subject Heading).
   - **Dublin Core XML**: 15 Core Web metadata elements.
   - **OCLC WorldCat**: Shared global cataloging database with 540M+ MARC records.
3. **Academic & Research Libraries**:
   - **Flagship Institutions**: Harvard Library (20M vols) & Bodleian Library (13M vols).
   - **Operations**: EZproxy remote authentication, DSpace/EPrints repositories, special collection reading rooms, ILLiad interlibrary loans.
4. **Public Libraries & Patron Services**:
   - **Civic Heritage**: Carnegie library grants (2,509 libraries funded), digital equity, free internet access, youth storytimes, maker spaces.
   - **Digital Circulation**: Libby/OverDrive, Hoopla, Kanopy.
   - **Ethics**: ALA Library Bill of Rights & Patron Privacy protection.
5. **Preservation & Archival Conservation Vaults**:
   - **Vault Standards**: 60°F ± 5°F (15.5°C) & 50% ± 5% Relative Humidity. Mold bloom occurs when RH > 65%.
   - **Deacidification**: Neutralizing alum-rosin paper acid burn using magnesium oxide spray & calcium phytate.
   - **Disaster Restoration**: Vacuum freeze-drying sublimates ice out of waterlogged paper without swelling.
6. **Digital Repositories & Open Access**:
   - **Frameworks**: IIIF (International Image Interoperability Framework) for deep-zoom manuscript viewing & OAI-PMH XML metadata harvesting.
7. **Reference Services & Search Syntax**:
   - **Reference Interview**: Open-ended inquiry techniques clarifying patron research goals.
   - **Search Operators**: Boolean `AND` (Narrows), `OR` (Broadens), `NOT` (Excludes), asterisk truncation wildcards (`librar*`), CRAAP evaluation test.
8. **Collection Development & Weeding (MUSTIE)**:
   - **MUSTIE Formula**: **M**isleading, **U**gly, **S**uperseded, **T**trivial, **I**rrelevant, **E**lsewhere.
   - **Acquisition Models**: Patron-Driven Acquisition (PDA), Firm Orders, Approval Plans.
9. **Special Collections & Rare Materials**:
   - Supervised reading-room handling, padded weights, provenance, and descriptive cataloging for rare materials.

---

## 4. Interactive Learning Engine Architecture

Built in `js/practice-engine.js`, the learning engine transforms passive reading into active observation:

- **Reusable Practice Panel**: Renders interactive multiple-choice practice items in the right detail column with instant green/red feedback and detailed explanation boxes.
- **Call Number Construction Sandbox**: A step-by-step builder wizard (Main Class -> Subdivision -> Cutter -> Workmark) with a live 3D spine label preview (`020.54 .D519i`).
- **MARC 21 Tag Practice Tool**: Input validator for subfield entries `$a`, `$b`, `$c` tested against Library of Congress authority standards.
- **MUSTIE Weeding Decision Tool**: Interactive decision simulator evaluating physical book condition + circulation stats, mapping outcomes to MUSTIE letters (**M**, **U**, **S**, **T**, **I**, **E**).
- **Librarian Scenario Cards**: Real-world decision case studies ("Scattered AI Books", "Archival Water Leak", "Panicked Student Query").
- **MLS Master Certification & Badge System**: Tracks progress in `localStorage` under `biblio-progress` and awards custom badges (`biblio-badges`) when score ≥ 80%, providing a printable official certificate (`window.print()`).

---

## 5. Codebase File Mapping

All source code files are located in `c:\Users\oladips\Downloads\interactive library`:

| File Path | Function & Role |
| :--- | :--- |
| [index.html](file:///c:/Users/oladips/Downloads/interactive%20library/index.html) | HTML5 shell, navigation bar, 3D mount, info panel, and modal drawers |
| [style.css](file:///c:/Users/oladips/Downloads/interactive%20library/style.css) | Complete design tokens, typography, glassmorphism, & print certificate styles |
| [js/library-data.js](file:///c:/Users/oladips/Downloads/interactive%20library/js/library-data.js) | Museum-grade dataset containing 3D specimen metadata, hotspots, & practice items |
| [js/three-viewer.js](file:///c:/Users/oladips/Downloads/interactive%20library/js/three-viewer.js) | Three.js 3D Specimen Rendering Engine (Plinth, 3D Specimens, Hotspots, UV Scan) |
| [js/practice-engine.js](file:///c:/Users/oladips/Downloads/interactive%20library/js/practice-engine.js) | Modular practice engine for Sandboxes, MARC validation, MUSTIE tool, & badges |
| [js/app.js](file:///c:/Users/oladips/Downloads/interactive%20library/js/app.js) | Main coordinator managing active specimen state, search engine, & quiz modals |
| [PROJECT_SUMMARY.md](file:///c:/Users/oladips/Downloads/interactive%20library/PROJECT_SUMMARY.md) | High-level project summary and quick reference guide |

---

## 6. How to Run & Verify

1. Launch your command prompt in `c:\Users\oladips\Downloads\interactive library`.
2. Start the local server:
   ```bash
   python -m http.server 3000
   ```
3. Open your browser to:
   `http://localhost:3000`

---

*Report compiled by Antigravity AI — Google DeepMind Team.*
