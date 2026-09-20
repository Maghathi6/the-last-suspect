import { renderSidebar } from './Sidebar.js';
import { renderInfoPanel } from './InfoPanel.js';
import { renderScreens } from './screens.js';
import { state } from '../game/state.js';

export function renderApp(container) {
  const fullScreenModes = ['MAIN_MENU', 'CASE_SELECT', 'CASE_INTRO'];
  
  if (fullScreenModes.includes(state.screen)) {
    container.innerHTML = renderScreens();
    return;
  }

  const ev = state.pendingRevealEvidence;
  const evModal = ev ? `
    <div class="modal-overlay" onclick="window.GameApp.closeEvidenceReveal()">
      <div class="modal-content" style="text-align: center; max-width: 480px; border-color: var(--accent);" onclick="event.stopPropagation()">
        <div class="font-mono" style="font-size: 0.75rem; letter-spacing: 1px; margin-bottom: 0.5rem; color: var(--accent);">NEW EVIDENCE DISCOVERED</div>
        <div style="font-size: 2.5rem; margin: 0.5rem 0;">🧾</div>
        <h3 class="font-serif" style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.3rem;">${ev.title}</h3>
        <div class="badge badge-warning" style="margin-bottom: 1rem;">${ev.type}</div>
        <div style="background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; font-size: 0.85rem; text-align: left; line-height: 1.5;">
          <p style="margin-bottom: 0.3rem;"><strong>Source:</strong> ${ev.source || 'Investigation'}</p>
          <p style="color: var(--text-secondary); font-style: italic;">"${ev.desc}"</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-primary" style="flex: 1;" onclick="window.GameApp.addEvidenceToBoardAndClose('${ev.id}')">ADD TO BOARD</button>
          <button class="btn" style="flex: 1;" onclick="window.GameApp.closeEvidenceReveal()">CLOSE</button>
        </div>
      </div>
    </div>
  ` : '';

  container.innerHTML = `
    <header class="top-bar">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span class="font-mono text-muted" style="font-size: 0.85rem;">SYSTEM /</span>
        <span class="font-serif" style="font-size: 1.1rem; letter-spacing: 0.5px;">${state.caseData.title}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <button class="btn" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; color: var(--accent); border-color: var(--accent);" onclick="window.GameApp.navigate('DAA_VIEW')">
          ⚙ DEMO / DAA MODE
        </button>
        <button class="btn" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;" onclick="window.GameApp.toggleSound()" aria-label="Toggle Audio">
          ${state.soundEnabled ? '🔊 SOUND ON' : '🔇 SOUND OFF'}
        </button>
        <span class="font-mono text-muted" style="font-size: 0.8rem;">STATUS</span>
        <span class="badge ${state.case01Completed ? 'badge-success' : 'badge-warning'}">
          ${state.case01Completed ? 'SOLVED ✓' : 'IN PROGRESS'}
        </span>
      </div>
    </header>

    <aside class="left-sidebar">
      ${renderSidebar()}
    </aside>

    <main class="main-content">
      ${renderScreens()}
    </main>

    <aside class="right-panel">
      ${renderInfoPanel()}
    </aside>

    <footer class="bottom-bar">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span class="text-accent" style="font-weight: bold;">></span>
        <span class="font-mono" style="letter-spacing: 0.5px;">Terminal ready. Awaiting detective input.</span>
      </div>
    </footer>
    ${evModal}
  `;
}
