import { state } from '../game/state.js';
import { renderBoard, renderTimeline, renderHypothesis, renderAccusation, renderDAATechnicalView } from './screens2.js';
import { renderCaseJournal } from './CaseJournal.js';
import { challenges } from '../cases/challenges.js';

export function renderScreens() {
  const s = state.screen;
  if (s === 'MAIN_MENU') return renderMainMenu();
  if (s === 'CASE_SELECT') return renderCaseSelect();
  if (s === 'CASE_INTRO') return renderCaseIntro();
  if (s === 'CAMPUS') return renderCampus();
  if (s === 'LOCATION') return renderLocation();
  if (s === 'SUSPECTS') return renderSuspects();
  if (s === 'INTERROGATE') return renderInterrogate();
  if (s === 'EVIDENCE') return renderEvidence();
  if (s === 'JOURNAL') return renderCaseJournal();
  if (s === 'BOARD') return renderBoard();
  if (s === 'TIMELINE') return renderTimeline();
  if (s === 'HYPOTHESIS') return renderHypothesis();
  if (s === 'ACCUSATION') return renderAccusation();
  if (s === 'DAA_VIEW') return renderDAATechnicalView();
  return `<div>Screen not found</div>`;
}

function renderMainMenu() {
  return `
    <div class="full-screen-layer center-content">
      <h1 style="font-size: 3.8rem; letter-spacing: 4px; margin-bottom: 0.5rem;" class="font-serif">THE LAST SUSPECT</h1>
      <p style="font-size: 1.15rem; color: var(--accent); margin-bottom: 3rem; font-style: italic;">Three college mysteries. Three cases to solve.</p>
      
      <div style="display: flex; gap: 1rem; flex-direction: column; width: 320px;">
        <button class="btn btn-primary" onclick="window.GameApp.navigate('CASE_SELECT')" style="padding: 1rem; font-size: 1.15rem;">SELECT CASE</button>
        <button class="btn" onclick="window.GameApp.toggleHowToPlay(true)" style="padding: 0.85rem; font-size: 1rem;">HOW TO PLAY</button>
        <button class="btn" onclick="window.GameApp.navigate('DAA_VIEW')" style="padding: 0.85rem; font-size: 0.9rem; color: var(--accent); border-color: var(--accent);">DAA / TECHNICAL VIEW ⚙</button>
      </div>

      ${state.showHowToPlay ? `
        <div class="modal-overlay" onclick="window.GameApp.toggleHowToPlay(false)">
          <div class="modal-content" onclick="event.stopPropagation()">
            <h2 class="font-serif" style="margin-bottom: 1.5rem; color: var(--accent);">MYSTERY-O-MATIC DEDUCTION LOOP</h2>
            <ul style="text-align: left; line-height: 1.8; color: var(--text-secondary); margin-left: 1.5rem; margin-bottom: 2rem;">
              <li><strong>Initial Facts & Campus Map:</strong> Review known premise and connected locations.</li>
              <li><strong>Timeline Deduction Grid:</strong> Toggle cells between Unknown (?), Present (✓), and Absent (x).</li>
              <li><strong>Distinctive Features:</strong> Inspect suspect profiles to match indirect feature clues (Blue Backpack, Black Cap, etc.).</li>
              <li><strong>Movement Rule:</strong> Adjacent timeslots require adjacent campus graph nodes (5-min / 15-min moves).</li>
              <li><strong>Automatic Deduction Review:</strong> Confirm implied deductions to update journal and grid.</li>
              <li><strong>Final Accusation:</strong> Commit to Who, Where, When, and Evidence when ready.</li>
            </ul>
            <button class="btn btn-primary" style="width: 100%;" onclick="window.GameApp.toggleHowToPlay(false)">UNDERSTOOD</button>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderCaseSelect() {
  const caseCards = challenges.map((c, idx) => {
    const isSolved = state.completedChallenges && state.completedChallenges[c.id];
    const bestScore = state.bestScores && state.bestScores[c.id];
    const numStr = String(idx + 1).padStart(2, '0');

    return `
      <div class="card" style="text-align: left; border-color: ${isSolved ? 'var(--success)' : 'var(--accent)'}; background: var(--bg-base); display: flex; flex-direction: column; justify-content: space-between; padding: 1.5rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span class="font-mono text-muted" style="font-size: 0.75rem; color: var(--accent);">CASE ${numStr}</span>
            <span class="badge ${isSolved ? 'badge-success' : 'badge-warning'}" style="font-size: 0.75rem;">
              ${isSolved ? 'SOLVED ✓' : 'NOT SOLVED'}
            </span>
          </div>

          <h3 class="font-serif" style="font-size: 1.35rem; color: var(--text-primary); margin-bottom: 0.4rem;">${c.title}</h3>
          <div class="font-mono text-muted" style="font-size: 0.8rem; margin-bottom: 1rem;">Difficulty: <strong style="color: var(--accent);">${c.stars || '★☆☆'}</strong> (${c.difficulty})</div>
          <p class="text-muted" style="font-size: 0.85rem; line-height: 1.5; font-style: italic; margin-bottom: 1.5rem;">"${c.subtitle}"</p>
        </div>

        <div>
          ${isSolved && bestScore ? `
            <div class="font-mono text-success" style="font-size: 0.85rem; font-weight: bold; margin-bottom: 1rem; text-align: center; background: rgba(46,204,113,0.1); padding: 0.4rem; border-radius: var(--radius-sm);">
              BEST SCORE: ${bestScore} / 100
            </div>
          ` : ''}
          <button class="btn btn-primary" style="width: 100%; padding: 0.75rem; font-size: 0.95rem;" onclick="window.GameApp.selectChallenge('${c.id}')">
            ${isSolved ? 'REPLAY CASE' : 'PLAY CASE &rarr;'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="full-screen-layer center-content" style="background: var(--bg-surface); padding: 2rem 1rem;">
      <h1 class="font-serif" style="font-size: 3rem; letter-spacing: 2px; margin-bottom: 0.25rem;">THE LAST SUSPECT</h1>
      <p class="font-mono text-accent" style="margin-bottom: 2.5rem; letter-spacing: 1px;">Three college mysteries. Three cases to solve.</p>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1050px; width: 100%; margin-bottom: 2.5rem;">
        ${caseCards}
      </div>

      <button class="btn" onclick="window.GameApp.navigate('MAIN_MENU')">BACK TO MAIN MENU</button>
    </div>
  `;
}

function renderCaseIntro() {
  const ch = state.getCurrentChallenge();
  const initialFactsHtml = ch.initialFacts.map(fact => `
    <li style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 0.9rem;">${fact}</li>
  `).join('');

  return `
    <div class="full-screen-layer center-content" style="background: var(--bg-surface);">
      <div style="max-width: 680px; text-align: left; padding: 2.5rem; border: 1px solid var(--accent); background: var(--bg-base); border-radius: var(--radius-md);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="font-mono text-muted" style="font-size: 0.8rem; color: var(--accent); letter-spacing: 1px;">CASE BRIEFING</span>
          <span class="font-mono" style="font-size: 0.8rem; color: var(--accent);">${ch.stars || '★☆☆'} ${ch.difficulty.toUpperCase()}</span>
        </div>
        
        <h2 class="font-serif" style="font-size: 2rem; margin-bottom: 1rem; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
          ${ch.title}
        </h2>
        
        <p style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem; color: var(--text-primary);">
          ${ch.premise}
        </p>

        <div style="background: rgba(205,123,70,0.08); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid rgba(205,123,70,0.3); margin-bottom: 2rem;">
          <h4 class="font-mono" style="font-size: 0.85rem; color: var(--accent); margin-bottom: 0.75rem; letter-spacing: 0.5px;">INITIAL KNOWN FACTS</h4>
          <ul style="margin-left: 1.25rem; line-height: 1.5;">
            ${initialFactsHtml}
          </ul>
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem;" onclick="window.GameApp.navigate('TIMELINE')">
          BEGIN INVESTIGATION &rarr;
        </button>
      </div>
    </div>
  `;
}

function renderCampus() {
  const ch = state.getCurrentChallenge();
  const icons = {
    'loc_canteen': '☕',
    'loc_library': '📚',
    'loc_lab': '💻',
    'loc_main': '🏛',
    'loc_seminar': '🎤'
  };

  const locs = ch.locations.map(loc => {
    const icon = icons[loc.id] || '📍';
    return `
      <div class="map-node" style="border-color: var(--accent);" onclick="window.GameApp.navigate('LOCATION', {location: '${loc.id}'})">
        <div class="font-mono" style="font-size: 0.85rem; color: var(--accent); margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
          <span>${icon} LOCATION</span>
        </div>
        <h3 class="font-serif">${loc.name}</h3>
        <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.5rem;">${loc.desc || ''}</p>
      </div>
    `;
  }).join('');

  return `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div>
          <h2 class="font-serif" style="margin-bottom: 0.25rem;">CAMPUS GRAPH MAP</h2>
          <p class="text-muted" style="font-size: 0.9rem;">Library &mdash; Main Block &mdash; Canteen | Main Block &mdash; Computer Lab &mdash; Seminar Hall</p>
        </div>
        <button class="btn btn-primary" onclick="window.GameApp.navigate('TIMELINE')">GO TO TIMELINE BOARD &rarr;</button>
      </div>

      <div class="campus-map">
        ${locs}
      </div>
    </div>
  `;
}

function renderLocation() {
  const loc = state.caseData.locations.find(l => l.id === state.currentLocation);
  if (!loc) return `<div>Location not found</div>`;

  return `
    <div>
      <button class="btn" style="margin-bottom: 2rem;" onclick="window.GameApp.navigate('CAMPUS')">&larr; BACK TO MAP</button>
      <div class="card" style="max-width: 650px; margin: 0 auto; text-align: center;">
        <h2 class="font-serif" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--accent);">${loc.name.toUpperCase()}</h2>
        <p style="font-size: 1.05rem; color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">${loc.desc || 'Campus location'}</p>
        
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="btn btn-primary" onclick="window.GameApp.navigate('SUSPECTS')">INSPECT SUSPECT PROFILES</button>
          <button class="btn" onclick="window.GameApp.navigate('TIMELINE')">TIMELINE BOARD</button>
        </div>
      </div>
    </div>
  `;
}

function renderSuspects() {
  const ch = state.getCurrentChallenge();
  const suspects = ch.suspects.map(s => `
    <div class="card suspect-card">
      <div class="suspect-portrait">${s.name.charAt(0)}</div>
      <h3 class="font-serif">${s.name}</h3>
      <p class="font-mono text-muted" style="font-size: 0.75rem; margin: 0.25rem 0;">${s.role}</p>
      <div class="badge badge-warning" style="margin-bottom: 0.5rem; font-size: 0.75rem;">FEATURE: ${s.feature}</div>
      <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 1rem; font-style: italic;">"${s.featureDesc}"</p>
      <button class="btn btn-primary" style="width: 100%; font-size: 0.85rem;" onclick="window.GameApp.interrogate('${s.id}')">VIEW DOSSIER</button>
    </div>
  `).join('');

  return `
    <div>
      <h2 class="font-serif" style="margin-bottom: 0.5rem;">SUSPECT PROFILES & DISTINCTIVE FEATURES</h2>
      <p class="text-muted" style="margin-bottom: 2rem;">Inspect suspect profiles to match indirect clues referencing personal items.</p>
      <div class="suspect-grid">
        ${suspects}
      </div>
    </div>
  `;
}

function renderInterrogate() {
  const ch = state.getCurrentChallenge();
  const suspect = ch.suspects.find(s => s.id === state.currentSuspect);
  if (!suspect) return `<div>Suspect not found</div>`;

  return `
    <div>
      <button class="btn" style="margin-bottom: 1.5rem;" onclick="window.GameApp.navigate('SUSPECTS')">&larr; BACK TO SUSPECT PROFILES</button>
      
      <div style="display: flex; gap: 2rem; max-width: 800px; margin: 0 auto; align-items: start;">
        <div style="width: 260px; text-align: center;">
          <div class="suspect-portrait" style="height: 200px; font-size: 4.5rem;">${suspect.name.charAt(0)}</div>
          <h3 class="font-serif" style="font-size: 1.6rem; color: var(--accent); margin-top: 0.5rem;">${suspect.name}</h3>
          <p class="font-mono text-muted" style="font-size: 0.85rem; margin-bottom: 0.5rem;">${suspect.role}</p>
          <div class="badge badge-warning" style="font-size: 0.8rem;">FEATURE: ${suspect.feature}</div>
        </div>

        <div style="flex: 1;">
          <div class="dialogue-panel" style="margin-top: 0;">
            <h4 class="font-serif" style="color: var(--accent); margin-bottom: 0.5rem;">SUSPECT DOSSIER</h4>
            <p style="margin-bottom: 1rem;"><strong>Distinctive Feature:</strong> ${suspect.feature} &mdash; ${suspect.featureDesc}</p>
            <p class="text-muted">Use this feature description when reading indirect clues to identify who was seen at campus locations.</p>
          </div>
          <br>
          <button class="btn btn-primary" style="width: 100%; padding: 0.75rem;" onclick="window.GameApp.navigate('TIMELINE')">UPDATE TIMELINE BOARD &rarr;</button>
        </div>
      </div>
    </div>
  `;
}

function renderEvidence() {
  return renderCaseJournal();
}
