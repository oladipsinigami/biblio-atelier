# Specimen 3D models — conversion guide

The current application renders all nine specimens with procedural Three.js builders.
The JPG files in `assets/specimens/` are reference images for future modeling work, and
`assets/models/` currently contains no imported meshes. GLB/GLTF/OBJ loader scripts are
present in `index.html`, but external model loading is not yet wired into the viewer.

---

## File names (required)

| Module | File name |
|--------|-----------|
| Classification | `assets/models/classification-bay.glb` |
| MARC | `assets/models/marc-catalog-card.glb` |
| Preservation | `assets/models/preservation-vault-drawer.glb` |
| Reference | `assets/models/reference-desk-stage.glb` |
| Collection / MUSTIE | `assets/models/weeding-cart.glb` |
| Academic | `assets/models/academic-reading-room.glb` |
| Public | `assets/models/public-hub.glb` |
| Digital repos | `assets/models/digital-repository.glb` |
| Special collections | `assets/models/rare-book-cradle.glb` |

Source photos to convert: `assets/specimens/*.jpg`

---

## Recommended pipeline (same idea as Anatomy Atelier)

1. Open [Tripo Studio](https://studio.tripo3d.ai/) (or Meshy / Luma / Rodin).
2. **Image to 3D** → upload the matching JPG from `assets/specimens/`.
3. Generate → export **GLB**, keep under ~5 MB if possible.
4. Save as the exact file name above into `assets/models/`.
5. Add an explicit loader integration in `js/three-viewer.js`, then refresh the app.
   Adding a file alone does not currently change the rendered specimen.

Optional in data: set an explicit path on any module:

```js
specimen: {
  type: "classification-bay",
  model: "assets/models/classification-bay.glb",
  image: "assets/specimens/classification-bay.jpg",
  // ...
}
```

---

## Safe way to involve the assistant (no passwords)

**Do not paste your Tripo/email password into chat.**

Use one of these:

### Option A — You export (simplest)
You convert the 9 images in the browser, drop GLBs into `assets/models/`, and tell me when they’re there so I can tune scale/camera if needed.

### Option B — API key (if your plan has API access)
1. Create an API key in the provider dashboard.
2. Put it only in a local env file that is **not** committed, e.g.:

```bash
# .env.local  (never commit this)
TRIPO_API_KEY=your_key_here
```

3. Tell me the key is in env (or paste **only** the API key once if you accept that risk — never the account password).
4. I can help write a small conversion script that uploads each JPG and downloads GLBs into `assets/models/`.

### Option C — Screen share / live session
You stay logged in; I give step-by-step clicks while you operate the account.

---

## Quality tips

- Prefer a single centered subject, cream background (our Imagine images already are).
- Export textured GLB.
- If the model is huge, re-export with decimation / “web” quality.
- If orientation is wrong, say which specimen and we adjust `prepareLoadedModel` rotation.

---

## Verify after loader integration

```bash
python -m http.server 8123
```

After loader integration is complete, open a specimen and confirm the network tab
shows a 200 for `assets/models/<type>.glb` and that the imported mesh appears on
the plinth. Until then, the procedural builder is the expected rendering path.
