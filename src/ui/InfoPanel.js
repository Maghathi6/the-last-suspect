import { state } from '../game/state.js';

export function renderInfoPanel() {
  const ch = state.getCurrentChallenge();
  if (!ch) return `<div></div>`;

  const deductionsCount = (state.journalDeductions || []).length;
  const lastDeduction = (state.journalDeductions || []).slice(-1)[0] || 'No deductions added yet.';

  const openQuestionsHtml = (state.openQuestions || []).slice(0, 2).map(q => `
    <div style="font-size: 0.8rem; color: var(--warning); margin-bottom: 0.4rem; padding: 0.3rem 0.5rem; background: rgba(241,196,15,0.08); border-radius: var(--radius-sm);">
      ${q}
    </div>
  `).join('');

  return `
    <style>
      .info-section {
        margin-bottom: 1.5rem;
      }
      .info-section-title {
        font-size: 0.75rem;
        color: var(--accent);
        margin-bottom: 0.6rem;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 0.3rem;
        letter-spacing: 0.5px;
      }
      .sleuth-meter {
        background: rgba(0,0,0,0.25);
        border: 1px solid var(--accent);
        border-radius: var(--radius-sm);
        padding: 0.85rem;
        text-align: center;
      }
    </style>

    <!-- SLEUTH-O-METER -->
    <div class="info-section">
      <h3 class="info-section-title font-mono">SLEUTH-O-METER</h3>
      <div class="sleuth-meter">
        <div class="font-mono text-muted" style="font-size: 0.7rem;">SCORE</div>
        <div class="font-serif text-accent" style="font-size: 2rem; font-weight: bold;">${state.sleuthScore}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">PTS</div>
      </div>
    </div>

    <!-- RECENT DEDUCTION -->
    <div class="info-section">
      <h3 class="info-section-title font-mono">LOGGED DEDUCTIONS (${deductionsCount})</h3>
      <div style="font-size: 0.8rem; color: var(--text-primary); border-left: 2px solid var(--success); padding-left: 0.5rem; line-height: 1.4;">
        ${lastDeduction}
      </div>
    </div>

    <!-- OPEN QUESTIONS -->
    <div class="info-section">
      <h3 class="info-section-title font-mono">OPEN QUESTIONS</h3>
      ${openQuestionsHtml}
    </div>

    <!-- QUICK ACTIONS -->
    <div class="info-section">
      <h3 class="info-section-title font-mono">QUICK ACTIONS</h3>
      <button class="btn" style="width: 100%; margin-bottom: 0.5rem; font-size: 0.8rem;" onclick="window.GameApp.navigate('JOURNAL')">DETECTIVE JOURNAL</button>
      <button class="btn btn-primary" style="width: 100%; font-size: 0.85rem; background: var(--error); border-color: var(--error);" onclick="window.GameApp.navigate('ACCUSATION')">TIME TO ACCUSE</button>
    </div>
  `;
}
