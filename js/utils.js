// Biblio Atelier - shared utilities (loaded before all other scripts).
// Single home for HTML escaping and deterministic option shuffling so the
// quiz renderers do not each reinvent (or drift on) both.

/** Escape a value for safe interpolation into text or a double-quoted attribute. */
function biblioEscapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// xmur3 string hash -> mulberry32 PRNG. Deterministic per seed, so a question
// always presents the same order within a session but different questions
// do not share one position for the correct answer.
function biblioSeedRng(seed) {
  let h = 1779033703 ^ String(seed).length;
  for (let i = 0; i < String(seed).length; i++) {
    h = Math.imul(h ^ String(seed).charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle an options array deterministically and report where the correct
 * answer moved to.
 *
 * The dataset used to author every quiz with the correct option first, so the
 * rendered order decided the answer. This keeps the data untouched and fixes
 * the presentation instead. `seed` should be stable per question (module id +
 * question index), so replaying the same question does not reshuffle.
 *
 * @param {Array} options   option values (strings or objects)
 * @param {number} correctIndex  index of the correct option in `options`
 * @param {string} seed     stable per-question seed
 * @returns {{options: Array, answerIndex: number}}
 */
function biblioShuffleOptions(options, correctIndex, seed) {
  const list = Array.isArray(options) ? options.slice() : [];
  const count = list.length;
  const answerAt =
    typeof correctIndex === 'number' && correctIndex >= 0 && correctIndex < count
      ? correctIndex
      : 0;
  if (count < 2) return { options: list, answerIndex: answerAt };

  const rng = biblioSeedRng(seed || 'biblio');
  const indices = list.map((_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = indices[i];
    indices[i] = indices[j];
    indices[j] = tmp;
  }
  return {
    options: indices.map((i) => list[i]),
    answerIndex: indices.indexOf(answerAt),
  };
}

window.BiblioEsc = biblioEscapeHtml;
window.BiblioShuffleOptions = biblioShuffleOptions;
