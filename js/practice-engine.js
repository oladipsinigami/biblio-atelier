// Biblio Atelier - Practice & Interactive Tools Engine

class PracticeEngine {
  constructor() {
    this.progress = this.readStorage('biblio-progress', {});
    this.badges = this.readStorage('biblio-badges', []);
    // Shape validation: a hand-edited or corrupted value must not be able to turn
    // `.correct += 1` into NaN or make `.includes` throw.
    if (!this.progress || Array.isArray(this.progress) || typeof this.progress !== 'object') {
      this.progress = {};
    } else {
      Object.keys(this.progress).forEach((key) => {
        const rec = this.progress[key];
        if (!rec || typeof rec !== 'object' || Array.isArray(rec)) {
          delete this.progress[key];
          return;
        }
        rec.attempted = Math.max(0, Number(rec.attempted) || 0);
        rec.correct = Math.max(0, Math.min(rec.attempted, Number(rec.correct) || 0));
      });
    }
    if (!Array.isArray(this.badges)) this.badges = [];
    else this.badges = this.badges.filter((b) => typeof b === 'string');
  }

  readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  /**
   * Escape a value for safe interpolation into a double-quoted HTML attribute.
   * Canonical implementation lives in js/utils.js (window.BiblioEsc).
   */
  static attr(value) {
    return window.BiblioEsc(value);
  }

  /**
   * Build a feedback box without trusting data-derived HTML.
   * `role="alert"` makes the result announced; focus is deliberately left on the
   * button the user just pressed so focus is not stolen mid-interaction.
   */
  static feedback(node, tone, label, body) {
    node.className = `practice-feedback ${tone}`;
    node.style.display = 'block';
    const strong = document.createElement('strong');
    strong.textContent = label;
    node.replaceChildren(strong, document.createTextNode(body || ''));
  }

  // TASK 1.1 - Reusable Practice Panel System
  renderPracticePanel(moduleData, containerEl) {
    if (!containerEl || !moduleData) return;

    containerEl.innerHTML = `
      <div class="practice-card-shell">
        <div class="practice-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <h3>Librarian Practice Panel</h3>
        </div>
        <div id="practice-questions-list"></div>
      </div>
    `;

    const qListEl = containerEl.querySelector('#practice-questions-list');
    const questions = moduleData.practice || [];

    if (questions.length === 0) {
      qListEl.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted);">No practice items loaded for this module.</p>`;
      return;
    }

    questions.forEach((q, idx) => {
      const qBox = document.createElement('div');
      qBox.className = 'practice-question-item';
      const question = document.createElement('p');
      question.className = 'question-text';
      const qLabel = document.createElement('strong');
      qLabel.textContent = `Q${idx + 1}: `;
      question.append(qLabel, document.createTextNode(q.question));

      const grid = document.createElement('div');
      grid.className = 'options-grid';
      const feedbackEl = document.createElement('div');
      feedbackEl.className = 'practice-feedback';
      feedbackEl.setAttribute('role', 'alert');
      feedbackEl.setAttribute('aria-live', 'polite');
      feedbackEl.style.display = 'none';

      // Data stores `correct` as the option text, not an index. Shuffle for
      // display (the data authors the answer first) and resolve the answer by
      // position so duplicate option texts can't both read as correct.
      const optionList = Array.isArray(q.options) ? q.options : [];
      const shuffled = window.BiblioShuffleOptions(
        optionList,
        optionList.indexOf(q.correct),
        `${moduleData.id}:practice:${idx}`
      );
      const btns = [];
      shuffled.options.forEach((opt, optIdx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'practice-opt-btn';
        btn.textContent = opt;
        btn.dataset.val = opt;
        btn.dataset.correct = String(optIdx === shuffled.answerIndex);
        btn.setAttribute('aria-pressed', 'false');
        grid.appendChild(btn);
        btns.push(btn);
      });

      qBox.append(question, grid, feedbackEl);

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const isCorrect = btn.dataset.correct === 'true';

          btns.forEach(b => {
            b.disabled = true;
            if (b.dataset.correct === 'true') {
              b.classList.add('correct-choice');
              b.setAttribute('aria-pressed', 'true');
            }
          });
          btn.setAttribute('aria-pressed', 'true');

          if (isCorrect) {
            btn.classList.add('correct-choice');
            PracticeEngine.feedback(feedbackEl, 'success', '\u2713 Correct! ', q.explanation);
            this.recordProgress(moduleData.id, true);
          } else {
            btn.classList.add('incorrect-choice');
            PracticeEngine.feedback(feedbackEl, 'error', '\u2717 Incorrect. ', q.explanation);
            this.recordProgress(moduleData.id, false);
          }
        });
      });

      qListEl.appendChild(qBox);
    });
  }

  // Save Progress & Check Badge Award
  recordProgress(moduleId, isCorrect) {
    if (!this.progress[moduleId]) {
      this.progress[moduleId] = { attempted: 0, correct: 0 };
    }
    this.progress[moduleId].attempted += 1;
    if (isCorrect) this.progress[moduleId].correct += 1;

    try {
      localStorage.setItem('biblio-progress', JSON.stringify(this.progress));
    } catch (_) {
      // Progress is non-essential; a full quota must not break the exercise.
    }

    // Award Badge if score >= 80%
    const rec = this.progress[moduleId];
    const modScore = rec.attempted ? (rec.correct / rec.attempted) * 100 : 0;
    if (modScore >= 80) {
      this.awardBadge(moduleId);
    }
  }

  // TASK 1.2 - Badges System
  awardBadge(moduleId) {
    const volData = (window.LIBRARY_DATA || []).find(v => v.id === moduleId);
    if (!volData || !volData.badgeId) return;

    if (!this.badges.includes(volData.badgeId)) {
      this.badges.push(volData.badgeId);
      try {
        localStorage.setItem('biblio-badges', JSON.stringify(this.badges));
      } catch (_) {
        // Badge stays in memory for this session even if it cannot be persisted.
      }
      this.showBadgeToast(volData.badgeName);
    }
  }

  showBadgeToast(badgeName) {
    const toast = document.createElement('div');
    toast.className = 'badge-toast-popup';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const content = document.createElement('div');
    content.className = 'toast-content';
    const head = document.createElement('span');
    head.textContent = '\u{1F3C6} New Badge Earned!';
    const name = document.createElement('strong');
    name.textContent = badgeName || '';
    content.append(head, name);

    toast.appendChild(content);
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // TASK 2.1 - Call Number Constructor Sandbox
  renderCallNumberSandbox(volData, containerEl) {
    if (!containerEl || !volData.callNumberPractice) return;
    const data = volData.callNumberPractice;
    const A = PracticeEngine.attr;

    containerEl.innerHTML = `
      <div class="sandbox-shell">
        <header class="sandbox-header">
          <h3>Call Number Construction Sandbox</h3>
          <p>Construct the call number for: <em>${A(data.targetBook.title)} (${A(data.targetBook.year)})</em></p>
        </header>

        <div class="call-number-preview-box">
          <div class="spine-label-preview">
            <span id="preview-class">000</span>
            <span id="preview-sub">.00</span>
            <span id="preview-cutter">.A00</span>
            <span id="preview-workmark">a</span>
          </div>
        </div>

        <div class="sandbox-steps-container">
          ${data.steps.map((step, sIdx) => `
            <div class="sandbox-step">
              <label for="sandbox-step-${sIdx}">${A(step.stepName)}</label>
              <select class="sandbox-select" id="sandbox-step-${sIdx}" data-step="${sIdx}">
                <option value="">-- Choose Option --</option>
                ${step.options.map(o => `<option value="${A(o.value)}" data-correct="${o.correct ? 'true' : 'false'}">${A(o.label)}</option>`).join('')}
              </select>
            </div>
          `).join('')}
        </div>

        <button type="button" class="lesson-button" id="check-call-num-btn" style="width:100%; margin-top:14px;">Check Call Number</button>
        <div id="sandbox-feedback" class="practice-feedback" role="alert" aria-live="polite" style="display:none; margin-top:10px;"></div>
      </div>
    `;

    const selects = containerEl.querySelectorAll('.sandbox-select');
    const feedbackEl = containerEl.querySelector('#sandbox-feedback');
    const checkBtn = containerEl.querySelector('#check-call-num-btn');

    selects.forEach(sel => {
      sel.addEventListener('change', () => {
        const stepIdx = sel.getAttribute('data-step');
        if (stepIdx === '0') containerEl.querySelector('#preview-class').textContent = sel.value || '000';
        if (stepIdx === '1') containerEl.querySelector('#preview-sub').textContent = sel.value || '.00';
        if (stepIdx === '2') containerEl.querySelector('#preview-cutter').textContent = sel.value || '.A00';
        if (stepIdx === '3') containerEl.querySelector('#preview-workmark').textContent = sel.value || 'a';
      });
    });

    checkBtn.addEventListener('click', () => {
      // An unanswered step must not read as correct just because nothing is selected.
      let allCorrect = selects.length > 0;
      selects.forEach(sel => {
        const selectedOpt = sel.options[sel.selectedIndex];
        if (!selectedOpt || selectedOpt.value === '' || selectedOpt.getAttribute('data-correct') !== 'true') {
          allCorrect = false;
        }
      });

      if (allCorrect) {
        const code = document.createElement('code');
        code.textContent = data.finalTargetCallNumber;
        PracticeEngine.feedback(feedbackEl, 'success', '\u2713 Perfect Classification! ', 'Target call number matches: ');
        feedbackEl.appendChild(code);
      } else {
        PracticeEngine.feedback(
          feedbackEl, 'error', '\u2717 Incorrect Assembly. ',
          'Review the DDC 000 class and Cutter table rules.'
        );
      }
    });
  }

  // TASK 2.2 - MARC Field Tag Practice
  renderMARCPractice(volData, containerEl) {
    if (!containerEl || !volData.marcPractice) return;
    const data = volData.marcPractice;
    const A = PracticeEngine.attr;

    containerEl.innerHTML = `
      <div class="sandbox-shell">
        <header class="sandbox-header">
          <h3>MARC 21 Field Cataloging Practice</h3>
          <p>Complete the required fields for: <strong>${A(data.targetRecord.title)}</strong></p>
        </header>

        <div class="marc-inputs-list">
          ${data.fields.map((f, fIdx) => `
            <div class="marc-input-row">
              <span class="marc-tag-badge">Tag ${A(f.tag)}</span>
              <div style="flex:1;">
                <label for="marc-field-${fIdx}" style="font-size:0.8rem; font-weight:600; display:block;">${A(f.label)}</label>
                <input type="text" class="marc-input-field" id="marc-field-${fIdx}" data-tag="${A(f.tag)}" placeholder="${A(f.placeholder)}" aria-describedby="marc-feedback" style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--border-color);" />
              </div>
            </div>
          `).join('')}
        </div>

        <button type="button" class="lesson-button" id="check-marc-btn" style="width:100%; margin-top:14px;">Validate MARC Record</button>
        <div id="marc-feedback" class="practice-feedback" role="alert" aria-live="polite" style="display:none; margin-top:10px;"></div>
      </div>
    `;

    const checkBtn = containerEl.querySelector('#check-marc-btn');
    const feedbackEl = containerEl.querySelector('#marc-feedback');

    checkBtn.addEventListener('click', () => {
      const inputs = containerEl.querySelectorAll('.marc-input-field');
      let score = 0;

      inputs.forEach(inp => {
        const tag = inp.getAttribute('data-tag');
        const fData = data.fields.find(f => f.tag === tag);
        const ok = fData && inp.value.trim().toLowerCase() === String(fData.expected).toLowerCase();
        if (ok) {
          score++;
          inp.style.borderColor = '#10b981';
          inp.setAttribute('aria-invalid', 'false');
        } else {
          inp.style.borderColor = '#ef4444';
          inp.setAttribute('aria-invalid', 'true');
        }
      });

      if (score === data.fields.length) {
        PracticeEngine.feedback(
          feedbackEl, 'success', '\u2713 MARC 21 Record Validated! ',
          'All tags and subfields match Library of Congress standards.'
        );
      } else {
        PracticeEngine.feedback(
          feedbackEl, 'error', '\u2717 Verification Failed. ',
          `Corrected ${score} of ${data.fields.length} MARC tags.`
        );
      }
    });
  }

  // TASK 2.3 - MUSTIE Weeding Decision Tool
  renderMUSTIETool(volData, containerEl) {
    if (!containerEl || !volData.mustiePractice) return;
    const data = volData.mustiePractice;
    const A = PracticeEngine.attr;

    containerEl.innerHTML = `
      <div class="sandbox-shell">
        <header class="sandbox-header">
          <h3>MUSTIE Weeding Decision Tool</h3>
          <p>Evaluate library books and determine whether to Keep or Withdraw:</p>
        </header>

        <div class="mustie-items-list">
          ${data.books.map((b, idx) => `
            <div class="mustie-book-card">
              <h4>${A(b.title)}</h4>
              <p style="font-size:0.8rem; color:var(--text-muted);"><strong>Circulation:</strong> ${A(b.circs)}</p>
              <p style="font-size:0.8rem; color:var(--text-muted);"><strong>Condition:</strong> ${A(b.condition)}</p>

              <div class="mustie-actions" style="margin-top:10px; display:flex; gap:8px;">
                <button type="button" class="mustie-btn" data-idx="${idx}" data-choice="Keep" aria-pressed="false">Keep Book</button>
                <button type="button" class="mustie-btn" data-idx="${idx}" data-choice="Withdraw" aria-pressed="false">Withdraw Book</button>
              </div>
              <div class="mustie-res-feedback practice-feedback" id="mustie-res-${idx}" role="alert" aria-live="polite" style="display:none; margin-top:8px;"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const btns = containerEl.querySelectorAll('.mustie-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const choice = btn.getAttribute('data-choice');
        const b = data.books[idx];
        const resEl = containerEl.querySelector(`#mustie-res-${idx}`);
        if (!b || !resEl) return;

        if (String(b.recommended).includes(choice)) {
          PracticeEngine.feedback(resEl, 'success', '\u2713 Correct Decision! ', b.reason);
        } else {
          PracticeEngine.feedback(
            resEl, 'error', '\u2717 Reconsider. ',
            `Recommendation is ${b.recommended}: ${b.reason}`
          );
        }

        // Mark the chosen action and clear its sibling, so state is not colour-only.
        btns.forEach((other) => {
          if (other.getAttribute('data-idx') !== String(idx)) return;
          const chosen = other === btn;
          other.classList.toggle('is-chosen', chosen);
          other.setAttribute('aria-pressed', String(chosen));
        });
      });
    });
  }

  // TASK 1.4 - Scenario Cards
  renderScenarioCards(volData, containerEl) {
    if (!containerEl || !volData.scenarios) return;
    const scenarios = volData.scenarios;
    const A = PracticeEngine.attr;

    containerEl.innerHTML = `
      <div class="sandbox-shell">
        <header class="sandbox-header">
          <h3>Real-World Librarian Decision Cases</h3>
        </header>

      ${scenarios.map((sc, scIdx) => {
        // Shuffle options (the data authors every correct option first).
        const shuffled = window.BiblioShuffleOptions(
          Array.isArray(sc.options) ? sc.options : [],
          (sc.options || []).findIndex((o) => o && o.correct),
          `${volData.id}:scenario:${sc.id || scIdx}`
        );
        return `
        <div class="scenario-card-item">
          <h4>${A(sc.title)}</h4>
          <p class="scenario-situation">${A(sc.situation)}</p>
          <p class="question-text"><strong>Decision required:</strong> ${A(sc.question)}</p>
          <div class="options-grid">
            ${shuffled.options.map(opt => `
              <button type="button" class="practice-opt-btn scen-opt-btn" data-correct="${opt.correct ? 'true' : 'false'}" data-feedback="${A(opt.feedback)}" aria-pressed="false">${A(opt.text)}</button>
            `).join('')}
          </div>
          <div class="scenario-feedback practice-feedback" role="alert" aria-live="polite" style="display:none; margin-top:8px;"></div>
        </div>
      `;
      }).join('')}
      </div>
    `;

    const sBtns = containerEl.querySelectorAll('.scen-opt-btn');
    sBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.scenario-card-item');
        const feedbackEl = card.querySelector('.scenario-feedback');
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        // Escaped on write, then inserted as text rather than HTML on read.
        const feedbackMsg = btn.getAttribute('data-feedback');

        btn.setAttribute('aria-pressed', 'true');
        PracticeEngine.feedback(
          feedbackEl,
          isCorrect ? 'success' : 'error',
          isCorrect ? '\u2713 Professional Choice: ' : '\u2717 Policy Conflict: ',
          feedbackMsg
        );
      });
    });
  }
}

if (typeof window !== 'undefined') {
  window.PracticeEngine = PracticeEngine;
}
