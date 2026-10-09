// Biblio Atelier - Editorial Feature Page Layer
// A full-screen, hero-style "reading & feature discovery" page for each module.
// The 3D specimen remains the observational heart; this is the deep-reading layer.

// Canonical escaper lives in js/utils.js (window.BiblioEsc); aliased here so
// this file's existing call sites stay stable.
function PracticePageEsc(value) {
  return window.BiblioEsc(value);
}

class FeaturePage {
  constructor(container) {
    this.el = container;
    this.handlers = {};
    this.current = null;
    this._onScroll = this.updateProgress.bind(this);
    this._observer = null;
    this._lastFocused = null;
    this.FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  }

  /** Mark the page background inert so focus cannot reach behind the overlay. */
  setBackgroundInert(on) {
    [document.querySelector('.app-shell'), document.querySelector('.topbar')].forEach((node) => {
      if (!node) return;
      if (on) {
        node.setAttribute('inert', '');
        node.setAttribute('aria-hidden', 'true');
      } else {
        node.removeAttribute('inert');
        node.removeAttribute('aria-hidden');
      }
    });
  }

  open(mod, handlers) {
    if (!this.el || !mod) return;
    if (!this.el.classList.contains('open')) {
      this._lastFocused = document.activeElement;
    }
    this.current = mod;
    this.handlers = handlers || {};
    this.el.innerHTML = this.render(mod);
    this.el.style.setProperty('--fp-accent', mod.accent || '#c28e46');
    this.bind();
    this.el.classList.add('open');
    this.el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('fp-active');
    this.setBackgroundInert(true);
    this.el.scrollTop = 0;
    this.updateProgress();
    this.el.addEventListener('scroll', this._onScroll, { passive: true });
    this.observeReveal();
    requestAnimationFrame(() => {
      this.el.querySelector(this.FOCUSABLE)?.focus();
    });
  }

  close() {
    if (!this.el) return;
    if (!this.el.classList.contains('open')) return;
    this.el.classList.remove('open');
    this.el.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('fp-active');
    this.el.removeEventListener('scroll', this._onScroll);
    if (this._observer) { this._observer.disconnect(); this._observer = null; }

    // Only release the background if no other overlay is still up.
    const otherOpen = document.querySelector('.modal-backdrop.open, .folio-reader-modal.open');
    if (!otherOpen) this.setBackgroundInert(false);
    if (!otherOpen && this._lastFocused && typeof this._lastFocused.focus === 'function') {
      this._lastFocused.focus();
    }
    this._lastFocused = null;
  }

  render(mod) {
    const kicker = mod.latinName || (mod.specimen && mod.specimen.scientificName) || mod.category || '';
    const sub = mod.description || mod.subtitle || '';
    const features = mod.features || [];
    const deep = mod.deepSections || [];

    return `
      <div class="fp-progress" aria-hidden="true"><i></i></div>

      <header class="fp-topnav">
        <button type="button" class="fp-back" data-fp="close" aria-label="Return to 3D specimen atelier">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to Atelier
        </button>
        <div class="fp-topnav-right">
          <span class="fp-eyebrow">${PracticePageEsc(mod.category)}</span>
          <button type="button" class="fp-quiz-link" data-fp="quiz">Certification Quiz</button>
        </div>
      </header>

      <section class="fp-hero">
        <div class="fp-hero-inner">
          <span class="fp-kicker">${PracticePageEsc(kicker)}</span>
          <h1 class="fp-hero-title">${PracticePageEsc(mod.title)}</h1>
          <span class="fp-accent-line"></span>
          <p class="fp-hero-sub">${PracticePageEsc(sub)}</p>
          <div class="fp-hero-ctas">
            <button type="button" class="fp-cta primary" data-fp="observe" id="fp-hero-observe-btn" title="Close reading layer and examine 3D specimen">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              Observe Specimen ✦
            </button>
            <button type="button" class="fp-cta ghost" data-fp="practice">Start Practice</button>
          </div>
        </div>
        <div class="fp-hero-badge" aria-hidden="true"><span>${PracticePageEsc(mod.thumbGlyph || '\u{1F4D6}')}</span></div>
      </section>

      <section class="fp-features">
        <h2 class="fp-section-title">What makes this specimen distinct</h2>
        <div class="fp-feature-grid">
          ${features.map(f => this.featureCard(f)).join('')}
        </div>
      </section>

      <section class="fp-deep">
        ${deep.map(sec => this.deepSection(sec)).join('')}
        ${mod.readerText ? `
          <article class="fp-section fp-reveal">
            <h3>The Catalog Record</h3>
            <pre class="fp-record">${PracticePageEsc(mod.readerText)}</pre>
          </article>` : ''}
        ${this.practiceBlock(mod)}
      </section>

      <footer class="fp-footer">
        <p class="fp-footer-quote">Learning is an act of quiet observation.</p>
        <div class="fp-footer-ctas">
          <button type="button" class="fp-cta primary" data-fp="observe">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            Observe 3D Specimen
          </button>
          <button type="button" class="fp-cta ghost" data-fp="quiz">Take Certification Quiz</button>
        </div>
      </footer>
    `;
  }

  featureCard(f) {
    const action = f.interactive && f.action ? f.action : '';
    // Non-interactive cards expand in place, so they need aria-expanded.
    const expandable = !action;
    return `
      <button type="button" class="fp-feature-card fp-reveal${f.interactive ? ' interactive' : ''}" ${action ? `data-action="${PracticePageEsc(action)}"` : ''} data-expandable="${expandable}"${expandable ? ' aria-expanded="false"' : ''}>
        <span class="fp-feat-icon" aria-hidden="true">${PracticePageEsc(f.icon || '◇')}</span>
        <h4>${PracticePageEsc(f.title)}</h4>
        <p>${PracticePageEsc(f.description)}</p>
        ${f.detail ? `<div class="fp-feat-detail"><p>${PracticePageEsc(f.detail)}</p></div>` : ''}
        <span class="fp-feat-more" aria-hidden="true">${f.interactive ? 'Open tool' : 'Read more'}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </span>
      </button>
    `;
  }

  deepSection(sec) {
    return `
      <article class="fp-section fp-reveal" id="fp-sec-${PracticePageEsc(sec.id)}">
        <h3>${PracticePageEsc(sec.title)}</h3>
        ${this.formatContent(sec.content)}
      </article>
    `;
  }

  practiceBlock(mod) {
    const btns = [];
    if (mod.callNumberPractice) btns.push(['sandbox', '\u{1F3F7}', 'Call Number Sandbox']);
    if (mod.marcPractice) btns.push(['marc', '\u{1F4BB}', 'MARC Field Practice']);
    if (mod.mustiePractice) btns.push(['mustie', '\u{1F5C2}', 'MUSTIE Simulator']);
    btns.push(['quiz', '\u2726', 'Certification Quiz']);

    return `
      <article class="fp-section fp-practice-block fp-reveal">
        <h3>Practice the Concept</h3>
        <p>Move from reading to doing — open a hands-on tool for this specimen.</p>
        <div class="fp-practice-btns">
          ${btns.map(([a, icon, label]) => `
            <button type="button" class="fp-practice-btn" data-action="${a}">
              <span aria-hidden="true">${icon}</span> ${label}
            </button>
          `).join('')}
        </div>
      </article>
    `;
  }

  formatContent(content) {
    if (!content) return '';
    return content.split(/\n\n+/).map(block => {
      const trimmed = block.trim();
      if (/^[-•]\s/.test(trimmed)) {
        const items = trimmed.split(/\n/).filter(Boolean)
          .map(li => `<li>${PracticePageEsc(li.replace(/^[-•]\s*/, ''))}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${PracticePageEsc(trimmed).replace(/\n/g, '<br/>')}</p>`;
    }).join('');
  }

  bind() {
    this.el.querySelectorAll('[data-fp], [data-action], .fp-feature-card').forEach(node => {
      node.addEventListener('click', () => {
        const fp = node.getAttribute('data-fp');
        const action = node.getAttribute('data-action');

        if (fp === 'close') return this.close();

        if (node.classList.contains('fp-feature-card') && !action) {
          const expanded = node.classList.toggle('expanded');
          node.setAttribute('aria-expanded', String(expanded));
          return;
        }

        const name = fp || action;
        if (!name) return;
        const handler = this.handlers[name];
        if (typeof handler === 'function') handler(this.current);
      });
    });
  }

  updateProgress() {
    const bar = this.el.querySelector('.fp-progress i');
    if (!bar) return;
    const max = this.el.scrollHeight - this.el.clientHeight;
    const pct = max > 0 ? (this.el.scrollTop / max) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }

  observeReveal() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = this.el.querySelectorAll('.fp-reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(t => t.classList.add('in-view'));
      return;
    }
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { root: this.el, threshold: 0.12 });
    targets.forEach(t => this._observer.observe(t));
  }
}

if (typeof window !== 'undefined') {
  window.FeaturePage = FeaturePage;
}
