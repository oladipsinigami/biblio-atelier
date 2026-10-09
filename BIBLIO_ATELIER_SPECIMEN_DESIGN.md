# Biblio Atelier — Specimen Design Guide
### Shift from “Books on Shelves” to “Observable Library Specimen”

**Inspiration source**  
[Anatomy Atelier](https://anatomy-livid.vercel.app/) by @thebuggeddev  
GitHub: https://github.com/thebuggeddev/anatomy

This document re-orients Biblio Atelier so it feels like the same class of experience as Anatomy Atelier:  
**a single, beautiful, explorable specimen** rather than a room full of books.

---

## 1. What Makes Anatomy Atelier Feel Special

| Element | How Anatomy Atelier does it | Why it works |
|---------|-----------------------------|--------------|
| **Central object** | One high-quality 3D organ on a plinth | Focus. The eye knows what to look at. |
| **Aesthetic** | Soft alabaster cream (`#f7f0e7`), soft studio lighting, museum/atelier mood | Calm, premium, “serious learning” feeling |
| **Interaction model** | Click dots (hotspots) on the model → short label + detail | Discovery by looking, not by reading a list |
| **Toolbar** | Rotate · Zoom · Isolate · Cross-section · Layers · Compare · Reset | Tools that change *how you see* the specimen |
| **Supporting panels** | Microscopic view, Compare, Function animation, Clinical notes, System context | Deepen understanding without leaving the specimen |
| **Tone** | “Learning is an act of curiosity” | Poetic, respectful, not gamified cartoon |

The current Biblio Atelier feels like “a 3D library room with many books”.  
Anatomy Atelier feels like “a single precious specimen you are invited to study”.

---

## 2. New Design Philosophy for Biblio Atelier

**Core principle**  
Treat every major library-science concept as a **specimen** that can be placed on a virtual plinth and examined from every angle.

Instead of generating many books on many shelves, generate **one primary 3D object per module** (or a small, focused architectural fragment) and make that object richly interactive.

### Recommended Specimens (one per module)

| Module | Suggested 3D Specimen | What the user observes |
|--------|-----------------------|------------------------|
| Classification Systems | A single elegant oak bookcase bay with color-coded spine ranges + call-number labels | Relative location, hierarchy, DDC vs LCC placement |
| MARC 21 & Metadata | A floating “MARC record card” or a cataloguing desk with a physical catalog card + digital overlay | Field structure, indicators, subfields |
| Academic Libraries | A reading-room desk + special-collections case | Institutional scale, access rules |
| Public Libraries | A Carnegie-style public library entrance or a makerspace table | Civic role, equity |
| Preservation | A climate-controlled vault drawer or a damaged book under UV light | Temperature, humidity, acid damage, restoration |
| Digital Repositories | A glowing IIIF viewer / digital stack fragment | Interoperability, open access |
| Reference Services | A reference desk with a dialogue “stage” | Interview stages, Boolean logic |
| Collection Management | A weeding cart + MUSTIE decision board | Selection, deselection |

The 3D viewer always shows **one clear specimen**. Everything else (facts, practice, notes) supports the observation of that specimen.

---

## 3. Interaction Model to Copy from Anatomy Atelier

### Primary Controls (toolbar above or below the canvas)
- **Orbit / Rotate**
- **Zoom**
- **Isolate** (hide everything except the selected part)
- **Cross-section / Cutaway** (for shelves or vaults)
- **Layers** (e.g. show only DDC colors, only call numbers, only condition labels)
- **Compare** (side-by-side with another specimen or system)
- **Reset**
- **Auto-rotate** toggle

### Hotspots
- Small elegant dots or pins on the specimen
- Click → camera gently moves + a clean label + short scholarly description appears
- Optional micro-quiz attached to the hotspot (as previously planned)

### Supporting Content (right or bottom panel)
Keep the same elegant structure Anatomy uses:

- **Key Facts** (short, scannable)
- **Scholarly Note**
- **Micro-view** or “Close examination”
- **Compare** (DDC vs LCC, physical vs digital, etc.)
- **Practice** (the interactive exercises)
- **Clinical / Professional Notes** (real-world implications for librarians)

---

## 4. Visual & Aesthetic Rules (match Anatomy)

- Background: soft alabaster cream `#f7f0e7`
- Primary text / structure: deep chocolate `#2c221e`
- Accent: antique gold `#c28e46` + dynamic `--item-accent`
- Lighting: soft studio key + fill, gentle shadow under the specimen (mahogany plinth with gold rim is already good)
- Typography: Cormorant Garamond for titles, DM Sans for UI
- No clutter. Large breathing space around the 3D specimen.
- The 3D object should feel like a museum piece, not a game asset.

---

## 5. Concrete Implementation Guidance for Gemini Flash

When prompting Gemini, use language like this:

```
Redesign the 3D viewer so the main focus is a single high-quality specimen 
(not a full room of books). 

Follow the interaction pattern of Anatomy Atelier:
- One central object on a plinth
- Toolbar: Orbit, Isolate, Layers, Compare, Reset, Auto-rotate
- Hotspots as small elegant dots
- Clicking a hotspot focuses the camera and shows a short scholarly description

Keep the existing color palette and glassmorphism UI.
Prefer elegant, calm, museum-atelier atmosphere over busy library stacks.
```

### Suggested new data shape for a specimen

```js
{
  id: "classification-bay",
  name: "Classification Bay",
  scientificName: "Relative Location Specimen",
  system: "Knowledge Organization",
  model: "/models/classification-bay.glb",   // or procedural
  accent: "#c28e46",
  description: "A single oak bay showing how DDC and LCC place related works in physical space.",
  hotspots: [
    {
      id: "ddc-000",
      label: "000 – Computer Science",
      detail: "General works and computer science begin here. Notice the decimal expansion allows infinite specificity.",
      position: [0.2, 1.1, 0.05],
      color: "#4a90d9"
    }
    // ...
  ],
  layers: ["call-numbers", "subject-colors", "condition"],
  compareWith: "lcc-bay"
}
```

---

## 6. Migration Path (Practical)

1. **Keep the current book-stack viewer** as a secondary “Exploded Stacks” mode.
2. **Make the default view** a focused specimen (one bay, one vault drawer, one catalog card, etc.).
3. Gradually replace procedural multi-shelf generation with higher-quality single specimens (GLB or carefully crafted procedural).
4. Move the rich interaction (hotspots, layers, isolate, compare) onto the new specimens.
5. The practice panels and quizzes stay exactly as planned in the previous roadmap — they simply become more meaningful because the user has already *observed* the concept on the specimen.

---

## 7. Success Criteria

The user should feel:

> “I am examining a carefully prepared library specimen the way an anatomist examines a heart.”

Not:

> “I am looking at a 3D library full of books.”

When that shift is achieved, the learning experience becomes observational, contemplative, and memorable — exactly what Anatomy Atelier does so well.

---

**Next action**  
Use this document + the previous AI Implementation Roadmap together.  
Tell Gemini: “Follow the Specimen Design Guide. The 3D viewer must feel like Anatomy Atelier, not like a bookshelf room.”
