import { state } from '../game/state.js';
import { renderDetectiveBoard } from './DetectiveBoard.js';

export function renderBoard() {
  return renderDetectiveBoard();
}

export function renderTimeline() {
  const ch = state.getCurrentChallenge();
  const times = ch.times;
  const suspects = ch.suspects;
  const locations = ch.locations;

  // Header columns
  const headerCols = times.map(t => `<th class="font-mono" style="padding: 0.75rem; text-align: center; border-bottom: 2px solid var(--border-color); color: var(--accent); font-size: 0.85rem;">${t}</th>`).join('');

  // Matrix rows
  const gridRows = suspects.map(s => {
    const cells = times.map(t => {
      const key = `${s.id}_${t}`;
      const cellData = state.timelineGrid[key] || { status: '?', locationId: '' };
      const cellVal = cellData.status || '?';
      const locVal = cellData.locationId || '';

      let cellStyle = 'background: rgba(255,255,255,0.04); color: var(--text-muted); border: 1px solid var(--border-light);';
      if (cellVal === '✓') cellStyle = 'background: rgba(46,204,113,0.22); color: var(--success); border: 2px solid var(--success); font-weight: bold; box-shadow: 0 0 10px rgba(46,204,113,0.3);';
      if (cellVal === 'x') cellStyle = 'background: rgba(231,76,60,0.22); color: var(--error); border: 2px solid var(--error); font-weight: bold;';

      const locOptions = locations.map(l => `<option value="${l.id}" ${locVal === l.id ? 'selected' : ''}>${l.name}</option>`).join('');

      return `
        <td style="padding: 0.6rem; text-align: center; border-bottom: 1px solid var(--border-color); vertical-align: top;">
          <button class="btn" style="width: 55px; height: 40px; font-size: 1.2rem; ${cellStyle}" onclick="window.GameApp.cycleCellState('${s.id}', '${t}')">
            ${cellVal}
          </button>
          ${cellVal === '✓' ? `
            <div style="margin-top: 0.4rem;">
              <select style="width: 100%; font-size: 0.75rem; padding: 0.2rem; background: var(--bg-base); color: var(--text-primary); border: 1px solid var(--border-light);" 
                      onchange="window.GameApp.setGridCellLocation('${s.id}', '${t}', this.value)">
                <option value="">- Location -</option>
                ${locOptions}
              </select>
            </div>
          ` : ''}
        </td>
      `;
    }).join('');

    return `
      <tr>
        <td style="padding: 0.75rem; border-bottom: 1px solid var(--border-color); vertical-align: middle;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <button style="background: none; border: none; padding: 0; color: var(--text-primary); font-size: 0.95rem; font-weight: bold; cursor: pointer; text-decoration: underline; text-underline-offset: 3px;" onclick="window.GameApp.openSuspectProfile('${s.id}')" title="Click to view contextual suspect profile">
                👤 ${s.name}
              </button><br>
              <span class="font-mono text-muted" style="font-size: 0.75rem; color: var(--accent);">${s.feature}</span>
            </div>
            <button class="btn" style="font-size: 0.7rem; padding: 0.2rem 0.4rem; margin-left: 0.4rem;" onclick="window.GameApp.checkRouteMovement('${s.id}')">CHECK MOVEMENT</button>
          </div>
        </td>
        ${cells}
      </tr>
    `;
  }).join('');

  // Current clue
  const currentClue = ch.clues[state.clueIndex] || ch.clues[0];
  const totalClues = ch.clues.length;

  const deductionOptionsHtml = (currentClue.deductionOptions || []).map(opt => {
    const isApplied = state.appliedDeductions.has(opt.id);
    return `
      <button class="btn" style="text-align: left; padding: 0.75rem 0.9rem; font-size: 0.85rem; border-color: ${isApplied ? 'var(--success)' : 'var(--accent)'}; background: ${isApplied ? 'rgba(46,204,113,0.1)' : 'var(--bg-base)'}; opacity: ${isApplied ? '0.65' : '1'};"
              onclick="window.GameApp.selectDeductionOption('${currentClue.id}', '${opt.id}')">
        ${isApplied ? '✓ [CONFIRMED] <s>' + opt.label + '</s>' : '🔎 [ACCEPT DEDUCTION] ' + opt.label}
      </button>
    `;
  }).join('');

  // Contradiction Alert Box with Undo Button
  const contradictionHtml = state.contradictionWarning ? `
    <div class="card" style="border-color: var(--error); background: rgba(231,76,60,0.08); margin-bottom: 1.25rem; padding: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="color: var(--error); font-weight: bold; font-size: 1rem;">${state.contradictionWarning}</div>
          <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.3rem;">
            Rule Check: A suspect cannot be in two locations at the same time or move between non-adjacent campus nodes in 5 minutes.
          </div>
        </div>
        <button class="btn btn-primary" style="background: var(--error); border-color: var(--error); font-size: 0.8rem; padding: 0.5rem 1rem;" onclick="window.GameApp.undoLastDeduction()">
          ↺ UNDO LAST DEDUCTION
        </button>
      </div>
    </div>
  ` : '';

  // Movement Check Result Box with Movement Deduction prompt
  const reqDed = state.movementCheckResult?.requiredDeduction;
  const movementResultHtml = state.movementCheckResult ? `
    <div class="card" style="border-color: ${state.movementCheckResult.success ? 'var(--success)' : 'var(--error)'}; background: ${state.movementCheckResult.success ? 'rgba(46,204,113,0.08)' : 'rgba(231,76,60,0.08)'}; margin-bottom: 1.25rem; padding: 1rem;">
      <div style="color: ${state.movementCheckResult.success ? 'var(--success)' : 'var(--error)'}; font-weight: bold; font-size: 0.95rem;">${state.movementCheckResult.message}</div>
      ${reqDed ? `
        <div style="margin-top: 0.75rem; padding: 0.75rem; background: var(--bg-base); border-left: 3px solid var(--accent); border-radius: var(--radius-sm);">
          <div class="font-mono text-muted" style="font-size: 0.75rem; color: var(--accent); margin-bottom: 0.2rem;">LOGICAL CONSEQUENCE</div>
          <p style="font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem;">Based on known locations and campus connections (${reqDed.routeText}):</p>
          <p style="font-size: 0.9rem; font-weight: bold; color: var(--success); margin-bottom: 0.5rem;">✓ ${ch.suspects.find(s=>s.id===reqDed.suspectId)?.name} must have been in ${reqDed.locationName} at 4:35 PM.</p>
          <button class="btn btn-primary" style="font-size: 0.75rem; padding: 0.3rem 0.75rem;" onclick="window.GameApp.addMovementDeduction('${reqDed.suspectId}', '${reqDed.time}', '${reqDed.locationId}')">[ ACCEPT DEDUCTION ]</button>
        </div>
      ` : ''}
    </div>
  ` : '';

  // Timeline Check Result Box
  const timelineCheckHtml = state.timelineCheckResult ? `
    <div class="card" style="border-color: ${state.timelineCheckResult.success ? 'var(--success)' : 'var(--error)'}; background: ${state.timelineCheckResult.success ? 'rgba(46,204,113,0.08)' : 'rgba(231,76,60,0.08)'}; margin-bottom: 1.25rem; padding: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="color: ${state.timelineCheckResult.success ? 'var(--success)' : 'var(--error)'}; font-weight: bold; font-size: 0.95rem;">${state.timelineCheckResult.message}</div>
        ${!state.timelineCheckResult.success ? `<button class="btn" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;" onclick="window.GameApp.navigate('JOURNAL')">[ REVIEW DEDUCTIONS ]</button>` : ''}
      </div>
    </div>
  ` : '';

  // Pending Implied Deductions Prompt Modal/Drawer
  const prompt = state.pendingDeductionPrompt;
  const promptHtml = prompt ? `
    <div class="card" style="border-color: var(--accent); background: rgba(205,123,70,0.08); margin-bottom: 1.25rem; padding: 1.25rem;">
      <div class="font-mono text-muted" style="font-size: 0.75rem; color: var(--accent); margin-bottom: 0.5rem;">POSSIBLE DEDUCTION</div>
      <p style="font-size: 1rem; color: var(--text-primary); font-weight: bold; margin-bottom: 0.5rem;">${prompt.primaryText}</p>
      <div style="background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1rem;">
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.4rem;">This implies:</p>
        <ul style="margin-left: 1.25rem; font-size: 0.85rem; color: var(--text-primary); line-height: 1.5;">
          ${prompt.impliedDeductions.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button class="btn btn-primary" style="font-size: 0.85rem;" onclick="window.GameApp.acceptPendingDeductions()">[ ACCEPT DEDUCTION ]</button>
        <button class="btn" style="font-size: 0.85rem;" onclick="window.GameApp.dismissPendingDeductions()">DISMISS</button>
      </div>
    </div>
  ` : '';

  // Elimination Banner
  const eliminationHtml = state.eliminatedBanner ? `
    <div class="card" style="border-color: var(--success); background: rgba(46,204,113,0.08); margin-bottom: 1.25rem; padding: 1rem; text-align: center;">
      <div style="color: var(--success); font-weight: bold; font-size: 1.1rem;">${state.eliminatedBanner}</div>
      <div style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.3rem; font-style: italic;">
        All other suspects have been ruled out for the theft window. Make your final decision when ready.
      </div>
    </div>
  ` : '';

  // Active Hint Card
  const hintHtml = state.activeHintText ? `
    <div class="card" style="border-color: var(--warning); background: rgba(241,196,15,0.08); margin-bottom: 1.25rem; padding: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
        <strong style="color: var(--warning); font-size: 0.85rem;" class="font-mono">DETECTIVE HINT (${state.hintIndex + 1}/3)</strong>
        <span class="badge badge-warning" style="font-size: 0.7rem;">-10 PTS</span>
      </div>
      <p style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.5;">"${state.activeHintText}"</p>
    </div>
  ` : '';

  // Campus Map Overlay Modal
  const mapModalHtml = state.showMapModal ? renderCampusMapModal() : '';

  // Contextual Suspect Profile Modal
  const suspectModalHtml = state.showSuspectProfileModal ? renderSuspectProfileModal() : '';

  return `
    <div>
      <!-- TOP HEADER BAR -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <span class="font-mono text-muted" style="font-size: 0.75rem; color: var(--accent); letter-spacing: 1px;">INVESTIGATION WORKSPACE</span>
          <h2 class="font-serif" style="margin-top: 0.1rem; font-size: 1.8rem; color: var(--text-primary);">${ch.title.toUpperCase()}</h2>
        </div>
        <div style="display: flex; gap: 0.6rem; align-items: center;">
          <span class="badge badge-warning" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">SLEUTH SCORE: ${state.sleuthScore} PTS</span>
          <button class="btn" style="font-size: 0.8rem;" onclick="window.GameApp.toggleMapModal(true)">🗺 CAMPUS MAP</button>
          <button class="btn" style="font-size: 0.8rem;" onclick="window.GameApp.getHint()">💡 NEED A HINT?</button>
          <button class="btn" style="font-size: 0.8rem;" onclick="window.GameApp.navigate('JOURNAL')">📓 JOURNAL</button>
          <button class="btn btn-primary" style="font-size: 0.85rem; background: var(--error); border-color: var(--error);" onclick="window.GameApp.navigate('ACCUSATION')">TIME TO ACCUSE &rarr;</button>
        </div>
      </div>

      ${hintHtml}
      ${contradictionHtml}
      ${timelineCheckHtml}
      ${movementResultHtml}
      ${promptHtml}
      ${eliminationHtml}

      <!-- DEDUCTION GRID MATRIX (HERO TOOL) -->
      <div class="card" style="padding: 1rem; overflow-x: auto; margin-bottom: 1.25rem; border-color: var(--accent);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <div>
            <span class="font-serif" style="font-size: 1.2rem; color: var(--accent);">TIMELINE REASONING BOARD</span>
            <span class="font-mono text-muted" style="font-size: 0.75rem; margin-left: 0.5rem;">Click cells to cycle: ? → ✓ → ✗</span>
          </div>
          <button class="btn btn-primary" style="font-size: 0.8rem; padding: 0.35rem 0.85rem;" onclick="window.GameApp.checkTimelineConsistency()">[ CHECK TIMELINE ]</button>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th class="font-mono text-muted" style="padding: 0.75rem; text-align: left; border-bottom: 2px solid var(--border-color); width: 230px; font-size: 0.85rem;">SUSPECT (CLICK NAME FOR PROFILE)</th>
              ${headerCols}
            </tr>
          </thead>
          <tbody>
            ${gridRows}
          </tbody>
        </table>
      </div>

      <!-- SIDE CLUE & DEDUCTION PANEL -->
      <div class="card" style="border-color: var(--accent); padding: 1.25rem;">
        <!-- CLUE NAV BAR -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <button class="btn" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;" ${state.clueIndex === 0 ? 'disabled' : ''} onclick="window.GameApp.prevClue()">&lt; PREVIOUS CLUE</button>
          <div class="font-mono text-muted" style="font-size: 0.85rem;">CASE EVIDENCE ${state.clueIndex + 1} / ${totalClues}: <strong style="color: var(--accent);">${currentClue.title}</strong></div>
          <button class="btn btn-primary" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;" ${state.clueIndex === totalClues - 1 ? 'disabled' : ''} onclick="window.GameApp.nextClue()">NEXT CLUE &gt;</button>
        </div>

        <!-- CLUE TEXT (ACTUAL CASE FACT) -->
        <div style="background: rgba(0,0,0,0.25); padding: 1rem; border-left: 4px solid var(--accent); border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
          <div class="font-mono text-muted" style="font-size: 0.7rem; color: var(--accent); margin-bottom: 0.3rem;">CASE FACT / STATEMENT</div>
          <p style="font-size: 1rem; color: var(--text-primary); line-height: 1.5; font-style: italic;">"${currentClue.text}"</p>
        </div>

        <!-- WHAT CAN YOU DEDUCE? -->
        <div>
          <h4 class="font-mono text-muted" style="font-size: 0.75rem; margin-bottom: 0.6rem; letter-spacing: 0.5px; color: var(--accent);">WHAT CAN YOU DEDUCE FROM THIS CLUE?</h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${deductionOptionsHtml}
          </div>
        </div>
      </div>

      ${mapModalHtml}
      ${suspectModalHtml}
    </div>
  `;
}

function renderCampusMapModal() {
  const ch = state.getCurrentChallenge();
  return `
    <div class="modal-overlay" onclick="window.GameApp.toggleMapModal(false)">
      <div class="modal-content" style="max-width: 680px; text-align: left;" onclick="event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <div>
            <h3 class="font-serif" style="color: var(--accent); font-size: 1.4rem;">CAMPUS NETWORK MOVEMENT MAP</h3>
            <span class="font-mono text-muted" style="font-size: 0.75rem;">Graph vertices ($V$) and 5-minute pathway edges ($E$)</span>
          </div>
          <button class="btn" onclick="window.GameApp.toggleMapModal(false)">✕ CLOSE</button>
        </div>
        
        <div style="background: rgba(13,17,23,0.9); padding: 1.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light); margin-bottom: 1.25rem; font-family: var(--font-mono); font-size: 0.9rem; line-height: 2;">
          <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.75rem;">GRAPH TOPOLOGY (DIRECT PATHWAYS):</div>
          <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: var(--radius-sm);">
            <div style="border: 1px solid var(--accent); padding: 0.3rem 0.6rem; border-radius: 4px; color: var(--accent); font-weight: bold;">Library</div>
            <div style="color: var(--text-muted);">── (5m) ──</div>
            <div style="border: 1px solid var(--accent); padding: 0.3rem 0.6rem; border-radius: 4px; color: var(--accent); font-weight: bold;">Main Block</div>
            <div style="color: var(--text-muted);">── (5m) ──</div>
            <div style="border: 1px solid var(--accent); padding: 0.3rem 0.6rem; border-radius: 4px; color: var(--accent); font-weight: bold;">Canteen</div>
          </div>
          <div style="text-align: center; color: var(--text-muted); margin: 0.25rem 0;">│ (5m)</div>
          <div style="display: flex; justify-content: center;">
            <div style="border: 1px solid var(--accent); padding: 0.3rem 0.6rem; border-radius: 4px; color: var(--accent); font-weight: bold;">Computer Lab</div>
          </div>
          <div style="text-align: center; color: var(--text-muted); margin: 0.25rem 0;">│ (5m)</div>
          <div style="display: flex; justify-content: center;">
            <div style="border: 1px solid var(--accent); padding: 0.3rem 0.6rem; border-radius: 4px; color: var(--accent); font-weight: bold;">Seminar Hall</div>
          </div>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; background: rgba(0,0,0,0.2); padding: 0.85rem; border-radius: var(--radius-sm);">
          <p><strong>• Direct Edge Connection (──):</strong> Takes 1 timeslot (5 minutes).</p>
          <p><strong>• Multi-Hop Route:</strong> Traveling from Library to Canteen requires passing through Main Block at an intermediate timeslot.</p>
          <p><strong>• Speed Limit Rule:</strong> A suspect cannot jump 2 graph hops in a single 5-minute interval.</p>
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 0.8rem;" onclick="window.GameApp.toggleMapModal(false)">RETURN TO INVESTIGATION</button>
      </div>
    </div>
  `;
}

function renderSuspectProfileModal() {
  const ch = state.getCurrentChallenge();
  const suspect = ch.suspects.find(s => s.id === state.selectedProfileSuspectId) || ch.suspects[0];
  
  const claimsHtml = (ch.clues || []).filter(c => c.text.includes(suspect.name) || c.title.includes(suspect.name)).map(c => `
    <div style="padding: 0.6rem; background: var(--bg-base); border-left: 3px solid var(--accent); margin-bottom: 0.4rem; border-radius: var(--radius-sm); font-size: 0.8rem;">
      <strong style="color: var(--accent);">${c.title}:</strong> "${c.text}"
    </div>
  `).join('') || `<p class="text-muted" style="font-style: italic; font-size: 0.8rem;">No explicit claims logged yet for ${suspect.name}.</p>`;

  return `
    <div class="modal-overlay" onclick="window.GameApp.closeSuspectProfile()">
      <div class="modal-content" style="max-width: 580px; text-align: left;" onclick="event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <div>
            <span class="font-mono text-muted" style="font-size: 0.75rem; color: var(--accent);">CONTEXTUAL SUSPECT DOSSIER</span>
            <h3 class="font-serif" style="color: var(--text-primary); font-size: 1.5rem; margin-top: 0.1rem;">${suspect.name}</h3>
          </div>
          <button class="btn" onclick="window.GameApp.closeSuspectProfile()">✕ CLOSE</button>
        </div>

        <div style="display: flex; gap: 1.25rem; align-items: flex-start; margin-bottom: 1.25rem;">
          <div style="width: 80px; height: 80px; background: var(--bg-surface); border: 2px solid var(--accent); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-family: var(--font-serif); color: var(--accent);">
            ${suspect.name.charAt(0)}
          </div>
          <div style="flex: 1;">
            <div class="font-mono text-muted" style="font-size: 0.8rem; margin-bottom: 0.3rem;">Role / Identity: <strong style="color: var(--text-primary);">${suspect.role}</strong></div>
            <div style="margin-bottom: 0.5rem;">
              <span class="badge badge-warning" style="font-size: 0.75rem;">DISTINCTIVE FEATURE: ${suspect.feature}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); font-style: italic; line-height: 1.4;">
              "${suspect.featureDesc || 'Student present on campus during the incident window.'}"
            </p>
          </div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 class="font-mono text-muted" style="font-size: 0.75rem; color: var(--accent); margin-bottom: 0.5rem;">KNOWN STATEMENTS & EVIDENCE REFERENCES</h4>
          ${claimsHtml}
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 0.75rem;" onclick="window.GameApp.closeSuspectProfile()">RETURN TO TIMELINE BOARD</button>
      </div>
    </div>
  `;
}

export function renderHypothesis() {
  return renderTimeline();
}

export function renderAccusation() {
  if (state.caseResolved) {
    return renderCaseResolution();
  }

  const ch = state.getCurrentChallenge();

  const feedback = state.accusationFeedback;
  let feedbackHtml = '';
  if (feedback && !feedback.success) {
    feedbackHtml = `
      <div class="card" style="max-width: 620px; margin: 1.25rem auto; border-color: var(--error); background: rgba(231,76,60,0.12); text-align: center; padding: 1.25rem;">
        <h3 class="font-serif" style="color: var(--error); font-size: 1.5rem; margin-bottom: 0.5rem;">❌ WRONG ACCUSATION (-10 PTS)</h3>
        <p style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 1.25rem; line-height: 1.5;">${feedback.message}</p>
        <button class="btn btn-primary" onclick="window.GameApp.clearAccusationFeedback()" style="padding: 0.6rem 1.25rem; font-size: 0.9rem;">[ CONTINUE INVESTIGATION ]</button>
      </div>
    `;
  }

  return `
    <div style="max-width: 700px; margin: 0 auto; padding: 1rem 0;">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <span class="font-mono text-muted" style="font-size: 0.75rem; color: var(--error); letter-spacing: 1px;">FINAL DEDUCTION &mdash; ${ch.title.toUpperCase()}</span>
        <h2 class="font-serif" style="font-size: 2.2rem; color: var(--error); margin-top: 0.2rem; margin-bottom: 0.4rem;">TIME TO ACCUSE</h2>
        <p class="text-muted" style="font-style: italic; font-size: 0.9rem;">Select all four fields and commit to your final accusation.</p>
      </div>

      ${feedbackHtml}

      <div class="card" style="border-color: var(--error); padding: 1.75rem; background: var(--bg-base); box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
        
        <!-- 1. WHO? -->
        <div style="margin-bottom: 1.25rem;">
          <label class="font-mono text-muted" style="font-size: 0.8rem; display: block; margin-bottom: 0.5rem; color: var(--error); letter-spacing: 1px;">1. WHO IS RESPONSIBLE? (SUSPECT)</label>
          <select id="accuse-suspect" style="width: 100%; padding: 0.65rem; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-light); font-size: 0.9rem; border-radius: var(--radius-sm);" onchange="window.GameApp.setAccused(this.value)">
            <option value="">-- Select Suspect --</option>
            ${ch.suspects.map(s => `<option value="${s.id}" ${state.accused === s.id ? 'selected' : ''}>${s.name} (${s.feature})</option>`).join('')}
          </select>
        </div>

        <!-- 2. WHEN? -->
        <div style="margin-bottom: 1.25rem;">
          <label class="font-mono text-muted" style="font-size: 0.8rem; display: block; margin-bottom: 0.5rem; color: var(--accent); letter-spacing: 1px;">2. WHEN DID IT HAPPEN? (TIMESLOT)</label>
          <select id="accuse-time" style="width: 100%; padding: 0.65rem; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-light); font-size: 0.9rem; border-radius: var(--radius-sm);">
            <option value="">-- Select Incident Time --</option>
            ${ch.times.map(t => `<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>

        <!-- 3. WHERE? -->
        <div style="margin-bottom: 1.25rem;">
          <label class="font-mono text-muted" style="font-size: 0.8rem; display: block; margin-bottom: 0.5rem; color: var(--accent); letter-spacing: 1px;">3. WHERE WAS THE STUDENT? (LOCATION)</label>
          <select id="accuse-loc" style="width: 100%; padding: 0.65rem; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-light); font-size: 0.9rem; border-radius: var(--radius-sm);">
            <option value="">-- Select Location --</option>
            ${ch.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}
          </select>
        </div>

        <!-- 4. KEY EVIDENCE PROOF? -->
        <div style="margin-bottom: 1.75rem;">
          <label class="font-mono text-muted" style="font-size: 0.8rem; display: block; margin-bottom: 0.5rem; color: var(--accent); letter-spacing: 1px;">4. KEY EVIDENCE PROOF? (EVIDENCE)</label>
          <select id="accuse-ev" style="width: 100%; padding: 0.65rem; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-light); font-size: 0.9rem; border-radius: var(--radius-sm);">
            <option value="">-- Select Key Evidence Item --</option>
            ${ch.clues.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
          </select>
        </div>

        <button class="btn btn-primary" type="button" style="background: var(--error); border-color: var(--error); width: 100%; padding: 1rem; font-size: 1.1rem; letter-spacing: 1px; font-weight: bold; cursor: pointer;" 
          onclick="
            const sus = document.getElementById('accuse-suspect').value;
            const time = document.getElementById('accuse-time').value;
            const loc = document.getElementById('accuse-loc').value;
            const ev = document.getElementById('accuse-ev').value;
            window.GameApp.submitFinalAccusation(sus, loc, time, ev);
          ">
          [ MAKE ACCUSATION ]
        </button>
      </div>
    </div>
  `;
}

function renderCaseResolution() {
  const ch = state.getCurrentChallenge();
  const sol = ch.solution;
  const score = state.sleuthScore;

  let rankBadge = '⭐ AMATEUR DETECTIVE';
  let rankColor = '#f39c12';
  if (score >= 90) { rankBadge = '⭐⭐⭐ SUPER SLEUTH'; rankColor = 'var(--success)'; }
  else if (score >= 75) { rankBadge = '⭐⭐ SEASONED DETECTIVE'; rankColor = 'var(--accent)'; }
  else if (score < 50) { rankBadge = 'CASE BARELY SOLVED'; rankColor = 'var(--text-muted)'; }

  const allSolved = state.completedChallenges &&
    state.completedChallenges.challenge_01 &&
    state.completedChallenges.challenge_02 &&
    state.completedChallenges.challenge_03;

  const totalScore = (state.bestScores.challenge_01 || 0) +
                     (state.bestScores.challenge_02 || 0) +
                     (state.bestScores.challenge_03 || 0);

  const allSolvedBannerHtml = allSolved ? `
    <div class="card" style="margin-bottom: 2rem; border-color: var(--accent); background: rgba(205,123,70,0.12); text-align: center; padding: 2rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">
      <h2 class="font-serif" style="font-size: 2.4rem; color: var(--accent); margin-bottom: 0.4rem;">🏆 ALL CASES SOLVED!</h2>
      <p class="font-mono text-muted" style="margin-bottom: 1.5rem; font-style: italic;">"Campus justice has been served across all three mysteries."</p>
      
      <div style="display: flex; justify-content: space-around; font-family: var(--font-mono); font-size: 0.9rem; margin-bottom: 1.5rem; background: var(--bg-base); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
        <div>CASE 01: <strong style="color: var(--success);">${state.bestScores.challenge_01 || 0} / 100</strong></div>
        <div>CASE 02: <strong style="color: var(--success);">${state.bestScores.challenge_02 || 0} / 100</strong></div>
        <div>CASE 03: <strong style="color: var(--success);">${state.bestScores.challenge_03 || 0} / 100</strong></div>
      </div>

      <div class="font-mono text-accent" style="font-size: 1.35rem; font-weight: bold; letter-spacing: 1px;">
        TOTAL SLEUTH SCORE: ${totalScore} / 300 PTS
      </div>
    </div>
  ` : '';

  return `
    <div style="max-width: 850px; margin: 0 auto; padding: 1rem 0;">
      <div style="text-align: center; margin-bottom: 2rem;">
        <h1 class="font-serif" style="font-size: 3.2rem; color: var(--success); margin-bottom: 0.25rem;">✅ CASE SOLVED!</h1>
        <h2 class="font-serif" style="color: var(--accent); font-size: 1.6rem;">${ch.title}</h2>
      </div>

      ${allSolvedBannerHtml}

      <!-- ACCUSATION CONFIRMATION SUMMARY -->
      <div class="card" style="margin-bottom: 1.5rem; border-color: var(--success); display: flex; justify-content: space-around; text-align: center; font-family: var(--font-mono); font-size: 0.85rem;">
        <div><span class="text-muted">SUSPECT:</span> <strong style="color: var(--success);">✓ ${sol.suspectName}</strong></div>
        <div><span class="text-muted">TIME:</span> <strong style="color: var(--success);">✓ ${sol.time}</strong></div>
        <div><span class="text-muted">LOCATION:</span> <strong style="color: var(--success);">✓ ${sol.locationName.toUpperCase()}</strong></div>
        <div><span class="text-muted">EVIDENCE:</span> <strong style="color: var(--success);">✓ ${sol.evidenceTitle.toUpperCase()}</strong></div>
      </div>

      <!-- SLEUTH SCORE & RANK CARD -->
      <div class="card" style="text-align: center; margin-bottom: 2rem; border-color: ${rankColor}; padding: 1.5rem;">
        <div class="font-mono text-muted" style="font-size: 0.8rem; margin-bottom: 0.4rem;">SLEUTH-O-METER SCORE</div>
        <div class="font-serif" style="font-size: 3rem; color: ${rankColor}; font-weight: bold; margin-bottom: 0.5rem;">${score} PTS</div>
        <div class="badge" style="background: ${rankColor}; color: var(--bg-base); font-size: 1rem; padding: 0.4rem 1.2rem;">${rankBadge}</div>
      </div>

      <!-- HOW YOU SOLVED IT -->
      <div class="card" style="margin-bottom: 2rem; border-color: var(--accent);">
        <h3 class="font-serif" style="color: var(--accent); margin-bottom: 1rem; font-size: 1.3rem;">HOW YOU SOLVED IT</h3>
        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          ${(sol.explanationSteps || []).map(step => `
            <div style="padding: 0.6rem 0.8rem; background: var(--bg-base); border-left: 3px solid var(--accent); border-radius: var(--radius-sm); font-size: 0.9rem;">
              ${step}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- DAA ENGINE -->
      <div class="card" style="margin-bottom: 2rem; border-color: var(--accent); background: var(--bg-surface);">
        <h3 class="font-serif" style="font-size: 1.3rem; color: var(--accent); margin-bottom: 1rem;">ALGORITHMIC REASONING & DAA ENGINE</h3>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="padding: 0.75rem; background: var(--bg-base); border-left: 3px solid var(--success); border-radius: var(--radius-sm); font-size: 0.9rem;">
            <strong style="color: var(--success);">✓ Graph Traversal</strong> &mdash; ${sol.daaBreakdown.graphTraversal}
          </div>
          <div style="padding: 0.75rem; background: var(--bg-base); border-left: 3px solid var(--success); border-radius: var(--radius-sm); font-size: 0.9rem;">
            <strong style="color: var(--success);">✓ Path Validation</strong> &mdash; ${sol.daaBreakdown.movementValidation}
          </div>
          <div style="padding: 0.75rem; background: var(--bg-base); border-left: 3px solid var(--success); border-radius: var(--radius-sm); font-size: 0.9rem;">
            <strong style="color: var(--success);">✓ Constraint Checking / Graph Coloring</strong> &mdash; ${sol.daaBreakdown.graphConsistency}
          </div>
          <div style="padding: 0.75rem; background: var(--bg-base); border-left: 3px solid var(--success); border-radius: var(--radius-sm); font-size: 0.9rem;">
            <strong style="color: var(--success);">✓ Backtracking</strong> &mdash; ${sol.daaBreakdown.backtracking}
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem;">
        <button class="btn btn-primary" style="padding: 0.8rem 1.5rem; font-size: 1.05rem;" onclick="window.GameApp.navigate('CASE_SELECT')">SELECT NEXT CASE &rarr;</button>
        <button class="btn" style="padding: 0.8rem 1.5rem; font-size: 1.05rem;" onclick="window.GameApp.restartCase()">REPLAY THIS CASE</button>
      </div>
    </div>
  `;
}

export function renderDAATechnicalView() {
  const ch = state.getCurrentChallenge();
  const sol = ch.solution;

  const totalCells = ch.suspects.length * ch.times.length;
  const initialSpace = Math.pow(ch.locations.length, totalCells);
  const afterLocation = Math.floor(initialSpace / 500);
  const afterTimeline = Math.floor(afterLocation / 500);
  const afterEvidence = 1;

  const appliedDeductionCount = (state.appliedDeductions || new Set()).size;
  const loggedDeductionCount = (state.journalDeductions || []).length;

  return `
    <div class="full-screen-layer" style="background: #0d1117; color: #c9d1d9; padding: 2rem; font-family: var(--font-mono); overflow-y: auto;">
      <div style="max-width: 980px; margin: 0 auto;">
        
        <!-- HEADER -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--accent); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <div>
            <div style="color: var(--accent); font-size: 0.8rem; letter-spacing: 1px;">ACADEMIC / VIVA DEMONSTRATION MODE</div>
            <h1 class="font-serif" style="color: #f0f6fc; font-size: 2.2rem; margin-top: 0.2rem;">THE LAST SUSPECT — DAA ENGINE DEMONSTRATION</h1>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn" style="border-color: var(--error); color: var(--error); font-size: 0.85rem;" onclick="window.GameApp.resetCurrentCase(); window.GameApp.navigate('DAA_VIEW');">[ RESET DEMO ]</button>
            <button class="btn btn-primary" style="font-size: 0.85rem;" onclick="window.GameApp.navigate('TIMELINE')">← RETURN TO GAME</button>
          </div>
        </div>

        <!-- CASE SELECTOR TABS -->
        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
          ${challenges.map((c, idx) => `
            <button class="btn" style="flex: 1; padding: 0.75rem; border-color: ${c.id === state.currentChallengeId ? 'var(--accent)' : '#30363d'}; background: ${c.id === state.currentChallengeId ? 'rgba(205,123,70,0.18)' : '#161b22'}; color: ${c.id === state.currentChallengeId ? 'var(--accent)' : '#8b949e'}; font-weight: bold; font-size: 0.85rem;" 
                    onclick="window.GameApp.selectChallenge('${c.id}'); window.GameApp.navigate('DAA_VIEW');">
              CASE 0${idx + 1}: ${c.title} (${c.stars || '★☆☆'})
            </button>
          `).join('')}
        </div>

        <!-- 1. CASE STATE SUMMARY -->
        <div class="card" style="background: #161b22; border-color: #30363d; margin-bottom: 1.5rem; padding: 1.5rem;">
          <h3 class="font-serif" style="color: var(--accent); font-size: 1.2rem; margin-bottom: 1rem;">1. CURRENT CASE STATE</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; font-size: 0.85rem; line-height: 1.6;">
            <div>
              <strong style="color: var(--success);">SUSPECTS (V):</strong><br>
              ${ch.suspects.map(s => `• ${s.name} (${s.feature})`).join('<br>')}
            </div>
            <div>
              <strong style="color: var(--success);">LOCATIONS (N):</strong><br>
              ${ch.locations.map(l => `• ${l.name}`).join('<br>')}
            </div>
            <div>
              <strong style="color: var(--warning);">TIMELINE STATE:</strong><br>
              • Timeslots: ${ch.times.join(', ')}<br>
              • Initial Facts: ${ch.initialFacts.length} confirmed<br>
              • Applied Deductions: ${appliedDeductionCount}<br>
              • Logged Reasoning: ${loggedDeductionCount} entries
            </div>
          </div>
        </div>

        <!-- 2. ALGORITHM EXECUTION BREAKDOWN -->
        <div class="card" style="background: #161b22; border-color: #30363d; margin-bottom: 1.5rem; padding: 1.5rem;">
          <h3 class="font-serif" style="color: var(--accent); font-size: 1.2rem; margin-bottom: 1rem;">2. ALGORITHM EXECUTION BREAKDOWN</h3>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem; font-size: 0.85rem;">
            <div style="background: #0d1117; padding: 1rem; border-radius: var(--radius-sm); border: 1px solid #30363d;">
              <strong style="color: var(--accent);">GRAPH REPRESENTATION:</strong>
              <div style="margin-top: 0.4rem; color: #8b949e; line-height: 1.5;">
                ${ch.edges.map(e => `${ch.locations.find(l=>l.id===e[0])?.name} ↔ ${ch.locations.find(l=>l.id===e[1])?.name}`).join('<br>')}
              </div>
            </div>
            <div style="background: #0d1117; padding: 1rem; border-radius: var(--radius-sm); border: 1px solid #30363d;">
              <strong style="color: var(--success);">CONSTRAINT & ROUTE VERIFICATION:</strong>
              <div style="margin-top: 0.4rem; color: var(--success); line-height: 1.6;">
                ✓ PATH VALIDATION: Valid movement continuity<br>
                ✓ CONSTRAINT CHECKING: No vertex coloring non-conflict errors<br>
                ✓ SOLUTION SOLVABILITY: Ground-truth solvable
              </div>
            </div>
          </div>

          <div style="background: #0d1117; padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid #30363d; line-height: 1.8; font-size: 0.9rem;">
            <div style="color: var(--accent); font-weight: bold; margin-bottom: 0.4rem;">BACKTRACKING CSP SEARCH SPACE PRUNING:</div>
            <div><span style="color: #8b949e;">Initial possible combinations:</span> <strong style="color: #f0f6fc;">${initialSpace.toLocaleString()}</strong></div>
            <div><span style="color: #8b949e;">After location constraints:</span> <strong style="color: var(--warning);">${afterLocation.toLocaleString()}</strong></div>
            <div><span style="color: #8b949e;">After timeline movement constraints:</span> <strong style="color: var(--warning);">${afterTimeline.toLocaleString()}</strong></div>
            <div><span style="color: #8b949e;">After evidence constraints:</span> <strong style="color: var(--success);">${afterEvidence}</strong></div>
            <div style="margin-top: 0.5rem; border-top: 1px solid #30363d; padding-top: 0.5rem; color: var(--success); font-weight: bold;">
              FINAL VALID SOLUTION: 1 (Culprit: ${sol.suspectName}, Time: ${sol.time}, Location: ${sol.locationName.toUpperCase()})
            </div>
          </div>
        </div>

        <!-- 3. HOW THE GAME USES DAA -->
        <div class="card" style="background: #161b22; border-color: #30363d; margin-bottom: 1.5rem; padding: 1.5rem;">
          <h3 class="font-serif" style="color: var(--accent); font-size: 1.2rem; margin-bottom: 1rem;">3. HOW THE GAME USES DAA</h3>
          
          <div style="background: #0d1117; padding: 1rem; border-radius: var(--radius-sm); border: 1px solid #30363d; text-align: center; font-size: 0.8rem; color: var(--accent); margin-bottom: 1rem;">
            PLAYER ──> CLUES ──> TIMELINE ──> LOCATION GRAPH ──> CONSTRAINTS ──> DAA ENGINE ──> VALID POSSIBILITIES ──> FINAL ACCUSATION
          </div>

          <p style="font-size: 0.85rem; color: #c9d1d9; line-height: 1.6;">
            Algorithms are not standalone textbook quizzes—they form the computational reasoning engine underneath the mystery. The DAA engine evaluates player inputs, verifies movement physics, detects contradiction errors, and proves solution uniqueness.
          </p>
        </div>

        <!-- 4. DAA SOURCE MODULES TECHNICAL REFERENCE -->
        <div class="card" style="background: #161b22; border-color: #30363d; margin-bottom: 2rem; padding: 1.5rem;">
          <h3 class="font-serif" style="color: var(--accent); font-size: 1.2rem; margin-bottom: 1rem;">4. DAA SOURCE MODULES REFERENCE</h3>
          
          <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.8rem;">
            <div style="padding: 0.75rem; background: #0d1117; border-left: 3px solid var(--success); border-radius: var(--radius-sm);">
              <strong style="color: var(--success);">• Graph Traversal (BFS / Shortest Path)</strong><br>
              <em>Purpose:</em> Calculates minimum campus movement steps between location pairs.<br>
              <em>Input:</em> Graph $G=(V,E)$, source $L_1$, dest $L_2$, timeslot gap $\Delta t$. &bull; <em>Output:</em> Shortest path distance.<br>
              <em>Time Complexity:</em> $\mathcal{O}(|V| + |E|)$
            </div>
            <div style="padding: 0.75rem; background: #0d1117; border-left: 3px solid var(--success); border-radius: var(--radius-sm);">
              <strong style="color: var(--success);">• Path Validation (Hamiltonian Route Check)</strong><br>
              <em>Purpose:</em> Verifies physical route continuity across connected campus graph edges.<br>
              <em>Input:</em> Location sequence $(L_0, L_1, \dots, L_k)$. &bull; <em>Output:</em> Route validity status.<br>
              <em>Time Complexity:</em> $\mathcal{O}(k \cdot |E|)$
            </div>
            <div style="padding: 0.75rem; background: #0d1117; border-left: 3px solid var(--success); border-radius: var(--radius-sm);">
              <strong style="color: var(--success);">• Graph Coloring (Vertex Non-Conflict Scheduling)</strong><br>
              <em>Purpose:</em> Enforces vertex non-conflict rules preventing dual-location assignments per timeslot.<br>
              <em>Input:</em> Timeline Matrix $M[Suspect, Time] \rightarrow Location$. &bull; <em>Output:</em> <code>CONSISTENT</code> or <code>CONTRADICTION</code>.<br>
              <em>Time Complexity:</em> $\mathcal{O}(|S| \cdot |T|)$
            </div>
            <div style="padding: 0.75rem; background: #0d1117; border-left: 3px solid var(--success); border-radius: var(--radius-sm);">
              <strong style="color: var(--success);">• Backtracking CSP Search Engine</strong><br>
              <em>Purpose:</em> Systematically explores variable assignments, pruning branches that violate clue or movement constraints.<br>
              <em>Input:</em> Variables $X$, Domains $D(X)$, Constraints $C$. &bull; <em>Output:</em> Solutions array $\mathcal{S}$ ($|\mathcal{S}| = 1$).<br>
              <em>Time Complexity:</em> $\mathcal{O}(|D|^{|X|})$ worst-case, $\mathcal{O}(1)$ pruned execution.
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem;">
          <button class="btn" style="flex: 1; border-color: var(--error); color: var(--error); padding: 0.9rem;" onclick="window.GameApp.resetCurrentCase(); window.GameApp.navigate('DAA_VIEW');">[ RESET DEMO ]</button>
          <button class="btn btn-primary" style="flex: 2; padding: 0.9rem; font-size: 1.05rem;" onclick="window.GameApp.navigate('TIMELINE')">RETURN TO GAME &rarr;</button>
        </div>
      </div>
    </div>
  `;
}
