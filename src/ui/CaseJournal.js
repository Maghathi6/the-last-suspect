import { state } from '../game/state.js';

export function renderCaseJournal() {
  const ch = state.getCurrentChallenge();
  if (!ch) return `<div>No active challenge</div>`;

  const initialFactsHtml = (ch.initialFacts || []).map(f => `
    <div style="padding: 0.6rem 0.8rem; background: var(--bg-surface); border-left: 3px solid var(--accent); margin-bottom: 0.4rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
      <span style="color: var(--text-primary);">✓ ${f}</span>
    </div>
  `).join('');

  const deductionsHtml = (state.journalDeductions || []).map(d => `
    <div style="padding: 0.6rem 0.8rem; background: var(--bg-surface); border-left: 3px solid var(--success); margin-bottom: 0.4rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
      <span style="color: var(--success); font-weight: bold;">${d.startsWith('✓') ? '✓' : '✗'} DEDUCTION:</span>
      <span style="color: var(--text-primary); margin-left: 0.4rem;">${d}</span>
    </div>
  `).join('') || `<p class="text-muted" style="font-style: italic; font-size: 0.85rem;">No deductions logged yet. Read clues and click deduction options to log deductions.</p>`;

  const questionsHtml = (state.openQuestions || []).map(q => `
    <div style="padding: 0.6rem 0.8rem; background: var(--bg-surface); border-left: 3px solid var(--warning); margin-bottom: 0.4rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
      <span style="color: var(--warning); font-weight: bold;">${q}</span>
    </div>
  `).join('');

  return `
    <div style="max-width: 850px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div>
          <h2 class="font-serif" style="margin-bottom: 0.25rem; color: var(--accent);">DETECTIVE JOURNAL</h2>
          <p class="text-muted" style="font-size: 0.85rem;">Official Reasoning Log &mdash; Challenge 01: The Last Samosa</p>
        </div>
        <button class="btn btn-primary" onclick="window.GameApp.navigate('TIMELINE')">GO TO TIMELINE BOARD &rarr;</button>
      </div>

      <!-- KNOWN FACTS -->
      <div class="card" style="margin-bottom: 1.5rem; border-color: var(--accent);">
        <h3 class="font-serif" style="font-size: 1.1rem; color: var(--accent); margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem;">KNOWN FACTS</h3>
        ${initialFactsHtml}
      </div>

      <!-- DEDUCTIONS -->
      <div class="card" style="margin-bottom: 1.5rem; border-color: var(--success);">
        <h3 class="font-serif" style="font-size: 1.1rem; color: var(--success); margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem;">DEDUCTIONS</h3>
        ${deductionsHtml}
      </div>

      <!-- OPEN QUESTIONS -->
      <div class="card" style="margin-bottom: 1.5rem; border-color: var(--warning);">
        <h3 class="font-serif" style="font-size: 1.1rem; color: var(--warning); margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem;">OPEN QUESTIONS</h3>
        ${questionsHtml}
      </div>
    </div>
  `;
}
