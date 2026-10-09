// Biblio Atelier - Museum-Grade Interactive Folio Book Reader
// Enables real-time reading of authentic shelf books, codices, and rare manuscripts
// directly from the 3D plinth or shelf with pagination, typography controls, themes, and catalog records.

class BookReader {
  constructor(container) {
    this.container = container;
    this.currentBook = null;
    this.currentPageIndex = 0;
    this.fontSize = 1.05; // rem
    this.theme = 'cream'; // 'cream' | 'parchment' | 'dark'
    this.activeTab = 'text'; // 'text' | 'catalog'
    this._onKeyDown = this.handleKeyDown.bind(this);
    this._lastFocused = null;
    this._isOpen = false;
    this.FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  }

  isOpen() {
    return this._isOpen;
  }

  open(bookData, initialPageIndex = 0) {
    if (!this.container || !bookData) return;
    this._lastFocused = document.activeElement;

    // Normalise pages: a missing or non-array value used to produce
    // "Folio NaN of undefined" and a dead slider.
    const pages = Array.isArray(bookData.pages) ? bookData.pages : [];
    const totalPages = pages.length;
    // The previous index was not reset, so reopening a shorter book left the reader
    // past the end (a placeholder page and a stale slider max).
    this.currentPageIndex = Math.max(0, Math.min(initialPageIndex, Math.max(0, totalPages - 1)));

    this.currentBook = bookData;
    this.activeTab = 'text';
    this.render();
    this.container.classList.add('open');
    this.container.setAttribute('aria-hidden', 'false');
    document.body.classList.add('reader-open');
    this._isOpen = true;
    document.addEventListener('keydown', this._onKeyDown);
    requestAnimationFrame(() => {
      this.container.querySelector(this.FOCUSABLE)?.focus();
    });
  }

  close() {
    if (!this.container || !this._isOpen) return;
    this.container.classList.remove('open');
    this.container.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('reader-open');
    document.removeEventListener('keydown', this._onKeyDown);
    this._isOpen = false;
    this.currentBook = null;
    this.currentPageIndex = 0;
    if (this._lastFocused && typeof this._lastFocused.focus === 'function') {
      this._lastFocused.focus();
    }
    this._lastFocused = null;
  }

  /** Force-close and drop all state — use when the reader is unmounted. */
  destroy() {
    document.removeEventListener('keydown', this._onKeyDown);
    if (this._isOpen) this.close();
    this.currentBook = null;
    this.currentPageIndex = 0;
    if (this.container) {
      this.container.classList.remove('open');
      this.container.setAttribute('aria-hidden', 'true');
      this.container.innerHTML = '';
    }
    document.body.classList.remove('reader-open');
  }

  render() {
    if (!this.currentBook) return;
    const b = this.currentBook;
    const pages = Array.isArray(b.pages) ? b.pages : [];
    const totalPages = pages.length;
    const p = pages[this.currentPageIndex] || {
      chapter: b.title,
      header: b.author,
      content: "This volume's digitized folios are currently being cataloged in the conservation lab."
    };

    const formattedContent = this.formatBookText(p.content);

    this.container.innerHTML = `
      <div class="folio-modal-backdrop" id="folio-modal-backdrop">
        <div class="folio-book-wrapper theme-${this.theme}" id="folio-book-frame" style="--reader-font-size: ${this.fontSize}rem;">
          
          <!-- Top Folio Header Bar -->
          <header class="folio-header">
            <div class="folio-meta-left">
              <span class="folio-call-badge">${window.BiblioEsc(b.callNumber || '025.4')}</span>
              <div class="folio-title-group">
                <h2 class="folio-book-title">${window.BiblioEsc(b.title)}</h2>
                <span class="folio-book-author">${window.BiblioEsc(b.author)} (${window.BiblioEsc(b.year || 'c. 19th c.')})</span>
              </div>
            </div>

            <div class="folio-header-actions">
              <!-- View Tabs -->
              <div class="folio-tab-group" role="tablist">
                <button type="button" class="folio-tab-btn ${this.activeTab === 'text' ? 'active' : ''}" data-tab="text" role="tab" aria-selected="${this.activeTab === 'text'}">
                  📖 Folio Text
                </button>
                <button type="button" class="folio-tab-btn ${this.activeTab === 'catalog' ? 'active' : ''}" data-tab="catalog" role="tab" aria-selected="${this.activeTab === 'catalog'}">
                  🏷 MARC Record
                </button>
              </div>

              <!-- Theme Toggles -->
              <div class="folio-theme-picker" aria-label="Paper tone picker">
                <button type="button" class="folio-theme-btn cream ${this.theme === 'cream' ? 'active' : ''}" data-theme="cream" title="Cream Bond Paper"></button>
                <button type="button" class="folio-theme-btn parchment ${this.theme === 'parchment' ? 'active' : ''}" data-theme="parchment" title="Archival Parchment"></button>
                <button type="button" class="folio-theme-btn dark ${this.theme === 'dark' ? 'active' : ''}" data-theme="dark" title="Dark Reading Vault"></button>
                <button type="button" class="folio-theme-btn leather ${this.theme === 'leather' ? 'active' : ''}" data-theme="leather" title="Morocco Leather Binding Tone"></button>
              </div>

              <!-- Font Sizer -->
              <div class="folio-font-scaler">
                <button type="button" class="font-scale-btn" data-scale="-1" title="Decrease font size">A-</button>
                <button type="button" class="font-scale-btn" data-scale="1" title="Increase font size">A+</button>
              </div>

              <!-- Close Button -->
              <button type="button" class="folio-close-btn" id="folio-close-btn" aria-label="Close book reader">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </header>

          <!-- Main Folio Spread Area -->
          <main class="folio-spread-container">
            ${this.activeTab === 'text' ? `
              <!-- Two-Page / Single Leaf Spread -->
              <article class="folio-leaf">
                <div class="folio-running-head">
                  <span>${window.BiblioEsc(p.chapter || b.title)}</span>
                  <span class="folio-pagination">Folio ${this.currentPageIndex + 1} of ${totalPages}</span>
                </div>

                <div class="folio-body-text">
                  ${p.header ? `<h3 class="folio-chapter-heading">${window.BiblioEsc(p.header)}</h3>` : ''}
                  ${formattedContent}
                  ${p.note ? `<aside class="folio-scholarly-note"><strong>Archivist's Annotation:</strong> ${window.BiblioEsc(p.note)}</aside>` : ''}
                </div>

                <div class="folio-running-foot">
                  <span>Biblio Atelier · Specimen Reading Room</span>
                  <span>${window.BiblioEsc(b.cutter || '.D519')}</span>
                </div>
              </article>
            ` : `
              <!-- Catalog Card Record View -->
              <div class="folio-catalog-view">
                <div class="folio-card-3x5">
                  <div class="card-red-rule"></div>
                  <div class="card-hole"></div>
                  <pre class="catalog-typewriter-text">${window.BiblioEsc(this.formatCatalogRecord(b))}</pre>
                </div>
                <div class="folio-citation-box">
                  <h4>Scholarly Citation</h4>
                  <div class="citation-row">
                    <code>${window.BiblioEsc(this.generateCitation(b, 'APA'))}</code>
                    <button type="button" class="copy-cite-btn" data-cite="apa">Copy APA</button>
                  </div>
                  <div class="citation-row">
                    <code>${window.BiblioEsc(this.generateCitation(b, 'MLA'))}</code>
                    <button type="button" class="copy-cite-btn" data-cite="mla">Copy MLA</button>
                  </div>
                </div>
              </div>
            `}
          </main>

          <!-- Bottom Page Navigation Bar -->
          <footer class="folio-footer">
            <button type="button" class="folio-nav-btn prev" id="folio-prev-btn" ${this.currentPageIndex === 0 ? 'disabled' : ''}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
              Previous Leaf
            </button>

            <div class="folio-slider-container">
              <input type="range" class="folio-page-slider" id="folio-page-slider" min="0" max="${Math.max(0, totalPages - 1)}" value="${this.currentPageIndex}" aria-label="Page slider" />
              <span class="folio-leaf-counter">Page ${this.currentPageIndex + 1} / ${totalPages}</span>
            </div>

            <button type="button" class="folio-nav-btn next" id="folio-next-btn" ${this.currentPageIndex >= totalPages - 1 ? 'disabled' : ''}>
              Next Leaf
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </footer>

        </div>
      </div>
    `;

    this.bindEvents();
  }

  formatBookText(rawText) {
    if (!rawText) return '';
    // Escape before formatting: the paragraph markup below is intentional,
    // the text itself is data-derived.
    const safe = window.BiblioEsc(rawText);
    const paragraphs = safe.split(/\n\n+/);
    return paragraphs.map((para, idx) => {
      const trimmed = para.trim();
      if (!trimmed) return '';
      // First paragraph gets illuminated drop cap
      if (idx === 0) {
        const firstLetter = trimmed.charAt(0);
        const rest = trimmed.slice(1);
        return `<p class="folio-para first-para"><span class="folio-drop-cap">${firstLetter}</span>${rest.replace(/\n/g, '<br/>')}</p>`;
      }
      return `<p class="folio-para">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    }).join('');
  }

  formatCatalogRecord(b) {
    if (b.catalogRecord) return b.catalogRecord;
    return `LEADER 01142cam a2200301 a 4500
001 ${b.id || 'rec-102938'}
008 240101s${b.year || '1900'}    xxu      b    000 0 eng  
050 00 $a ${b.callNumber || 'Z668'} $b ${b.cutter || '.D519'}
082 00 $a ${b.callNumber || '025.4'} $2 23
100 1# $a ${b.author || 'Anonymous'}
245 10 $a ${b.title} / $c ${b.author}.
264 #1 $a [S.l.] : $b Historical Library Press, $c [${b.year || '1876'}]
300    $a 1 volume (various folios) ; $c 22 cm
500    $a Preserved in the Biblio Atelier Specimen Collection.
650 #0 $a ${b.category || 'Library science'}.
650 #0 $a Books $x History $y 19th century.`;
  }

  generateCitation(b, style) {
    if (style === 'APA') {
      return `${b.author || 'Author, A.'} (${b.year || 'n.d.'}). ${b.title}. Historical Atelier Archive.`;
    }
    return `${b.author || 'Author, A.'} ${b.title}. ${b.year || 'n.d.'}, Biblio Atelier Specimen Collection.`;
  }

  bindEvents() {
    // Close button & backdrop click
    const closeBtn = document.getElementById('folio-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const backdrop = document.getElementById('folio-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.close();
      });
    }

    // Page buttons
    const prevBtn = document.getElementById('folio-prev-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevPage());

    const nextBtn = document.getElementById('folio-next-btn');
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextPage());

    // Page slider
    const slider = document.getElementById('folio-page-slider');
    if (slider) {
      // Dragging must trigger no re-render: render() rebuilds the footer and
      // would replace the slider element mid-drag, aborting the drag.
      slider.addEventListener('input', (e) => {
        this.updatePageReadouts(parseInt(e.target.value, 10));
      });
      slider.addEventListener('change', (e) => {
        this.goToPage(parseInt(e.target.value, 10));
      });
    }

    // Tab switching (Text vs Catalog)
    this.container.querySelectorAll('.folio-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.getAttribute('data-tab');
        this.render();
      });
    });

    // Theme switching
    this.container.querySelectorAll('.folio-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.theme = btn.getAttribute('data-theme');
        this.render();
      });
    });

    // Font scaling
    this.container.querySelectorAll('.font-scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.getAttribute('data-scale')) * 0.1;
        this.fontSize = Math.max(0.85, Math.min(1.45, this.fontSize + delta));
        const frame = document.getElementById('folio-book-frame');
        if (frame) frame.style.setProperty('--reader-font-size', `${this.fontSize}rem`);
      });
    });

    // Copy Citation buttons
    this.container.querySelectorAll('.copy-cite-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const style = btn.getAttribute('data-cite') === 'apa' ? 'APA' : 'MLA';
        const text = this.generateCitation(this.currentBook, style);
        const showCopied = () => {
          const orig = btn.textContent;
          btn.textContent = '✓ Copied!';
          setTimeout(() => { btn.textContent = orig; }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(showCopied).catch(() => {
            this.fallbackCopy(text, btn);
          });
        } else {
          this.fallbackCopy(text, btn);
        }
      });
    });
  }

  /** Clipboard fallback for denied permission or non-secure contexts. */
  fallbackCopy(text, btn) {
    const orig = btn.textContent;
    let ok = false;
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ok = document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (_) { ok = false; }
    btn.textContent = ok ? '✓ Copied!' : 'Copy failed';
    setTimeout(() => { btn.textContent = orig; }, 1800);
  }

  /**
   * Refresh the "Folio X of Y" readouts without re-rendering, so dragging the
   * page slider stays smooth.
   */
  updatePageReadouts(index) {
    if (!this.currentBook) return;
    const pages = Array.isArray(this.currentBook.pages) ? this.currentBook.pages : [];
    const idx = Math.max(0, Math.min(index, Math.max(0, pages.length - 1)));
    const counter = this.container.querySelector('.folio-leaf-counter');
    if (counter) counter.textContent = `Page ${idx + 1} / ${pages.length}`;
    const pagination = this.container.querySelector('.folio-pagination');
    if (pagination) pagination.textContent = `Folio ${idx + 1} of ${pages.length}`;
  }

  nextPage() {
    if (!this.currentBook) return;
    const total = this.pageCount();
    if (this.currentPageIndex < total - 1) {
      this.currentPageIndex++;
      this.render();
    }
  }

  prevPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.render();
    }
  }

  goToPage(index) {
    if (!this.currentBook) return;
    const total = this.pageCount();
    this.currentPageIndex = Math.max(0, Math.min(index, total - 1));
    this.render();
  }

  /** Page count that tolerates a missing or non-array pages field. */
  pageCount() {
    return this.currentBook && Array.isArray(this.currentBook.pages)
      ? this.currentBook.pages.length
      : 0;
  }

  handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }

    // Keep Tab inside the reader: without this, focus walks out to the page behind.
    if (e.key === 'Tab') {
      const focusable = [...this.container.querySelectorAll(this.FOCUSABLE)]
        .filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }

    // Do not hijack arrow keys while the user is in a control.
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      this.nextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      this.prevPage();
    }
  }
}

if (typeof window !== 'undefined') {
  window.BookReader = BookReader;
}
