import './styles/variables.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/game.css';
import { renderApp } from './ui/App.js';
import { state } from './game/state.js';
import { case01 } from './cases/case01.js';
import { validateTimeline } from './game/TimelineValidator.js';
import { validateNormalRoute, validateHamiltonianChallenge } from './game/RouteValidator.js';
import { testHypothesis } from './game/HypothesisEngine.js';

import { audio } from './utils/audio.js';

// Setup Global Methods for Vanilla JS templating events
window.GameApp = {
  toggleSound: () => {
    state.toggleSound();
  },
  navigate: (screen, payload) => {
    audio.playClick();
    state.navigate(screen, payload);
  },
  selectChallenge: (challengeId) => {
    audio.playClick();
    state.selectChallenge(challengeId);
  },
  nextClue: () => {
    state.nextClue();
  },
  prevClue: () => {
    state.prevClue();
  },
  selectDeductionOption: (clueId, optionId) => {
    state.selectDeductionOption(clueId, optionId);
  },
  acceptPendingDeductions: () => {
    state.acceptPendingDeductions();
  },
  dismissPendingDeductions: () => {
    state.dismissPendingDeductions();
  },
  undoLastDeduction: () => {
    state.undoLastDeduction();
  },
  cycleCellState: (suspectId, time) => {
    state.cycleCellState(suspectId, time);
  },
  setGridCellLocation: (suspectId, time, locationId) => {
    state.setGridCellLocation(suspectId, time, locationId);
  },
  checkRouteMovement: (suspectId) => {
    state.checkRouteMovement(suspectId);
  },
  submitFinalAccusation: (suspectId, locationId, timeId, evidenceId) => {
    state.submitFinalAccusation(suspectId, locationId, timeId, evidenceId);
  },
  getHint: () => {
    state.getHint();
  },
  toggleHowToPlay: (show) => {
    state.toggleHowToPlay(show);
  },
  interrogate: (suspectId) => {
    state.navigate('INTERROGATE', { suspect: suspectId });
  },
  dialogueOption: (nodeId, qId, suspectId) => {
    if (qId) state.askQuestion(qId, suspectId);
    if (nodeId === 'end') {
      state.navigate('SUSPECTS');
    } else {
      state.dialogueNode = nodeId;
      state.notify();
    }
  },
  presentEvidence: (suspectId, evidenceId) => {
    state.presentEvidence(suspectId, evidenceId);
  },
  clearPresentedEvidenceResponse: () => {
    state.clearPresentedEvidenceResponse();
  },
  closeEvidenceReveal: () => {
    state.closeEvidenceReveal();
  },
  addEvidenceToBoardAndClose: (evidenceId) => {
    state.addEvidenceToBoardAndClose(evidenceId);
  },
  discover: (evidenceId) => {
    state.discover(evidenceId, true);
  },
  addConnection: (id1, id2, relation = 'RELATED TO') => {
    state.addConnection(id1, id2, relation, true);
  },
  removeConnection: (idx) => {
    state.removeConnection(idx);
  },
  assignTimeline: (time, evidenceId) => {
    state.assignTimeline(time, evidenceId);
  },
  testTimeline: () => {
    const res = validateTimeline();
    state.setTimelineResult(res);
  },
  checkRoute: (suspectId) => {
    const suspect = state.caseData.suspects?.find(s => s.id === suspectId);
    if (suspect && suspect.claimedRoute) {
      const res = validateNormalRoute(suspect.claimedRoute);
      state.setRouteResult(suspectId, res);
    }
  },
  addToChallengeRoute: (locId) => {
    state.addToChallengeRoute(locId);
  },
  clearChallengeRoute: () => {
    state.clearChallengeRoute();
  },
  checkChallengeRoute: () => {
    const reqLocations = ["loc_library", "loc_lab", "loc_dept", "loc_canteen"];
    const res = validateHamiltonianChallenge(reqLocations, state.challengeRoute);
    state.setChallengeResult(res);
  },
  setHypothesis: (field, value) => {
    state.setHypothesis(field, value);
  },
  submitHypothesis: () => {
    const personEl = document.getElementById('hypo-person');
    const locEl    = document.getElementById('hypo-loc');
    const timeEl   = document.getElementById('hypo-time');
    const objEl    = document.getElementById('hypo-object');
    if (personEl) state.hypothesis.person   = personEl.value;
    if (locEl)    state.hypothesis.location  = locEl.value;
    if (timeEl)   state.hypothesis.time      = timeEl.value;
    if (objEl)    state.hypothesis.object    = objEl.value;

    const res = testHypothesis();
    state.setHypothesisResult(res);
  },
  setAccused: (suspectId) => {
    state.setAccused(suspectId);
  },
  investigateLocation: (locId) => {
    const locEvidence = state.caseData.locationEvidence?.[locId] || [];
    const found = [];
    locEvidence.forEach(evId => {
      if (!state.discoveredEvidence.has(evId)) {
        state.discover(evId);
        found.push(evId);
      }
    });
    state.setInvestigationResult(locId, found);
  },
  prepareAccusationConfirmation: (suspectId, locationId, timeId, objectId) => {
    state.prepareAccusationConfirmation(suspectId, locationId, timeId, objectId);
  },
  cancelAccusationConfirmation: () => {
    state.cancelAccusationConfirmation();
  },
  confirmFinalAccusation: () => {
    state.confirmFinalAccusation();
  },
  showFinalReport: () => {
    state.showFinalReport = true;
    state.notify();
  },
  restartCasePrompt: () => {
    if (confirm("Restart Challenge 01? All timeline entries will be reset.")) {
      state.restartCase();
    }
  },
  restartCase: () => {
    state.restartCase();
  },
  returnToInvestigation: () => {
    state.accusationFeedback = null;
    state.accused = null;
    state.pendingAccusation = null;
    state.navigate('TIMELINE');
  },

  // --- DETECTIVE BOARD HANDLERS ---
  addNodeToBoard: (id, type, label, sub) => { state.addNodeToBoard(id, type, label, sub); },
  removeNodeFromBoard: (id) => { state.removeNodeFromBoard(id); },
  clickBoardNode: (id) => {
    if (state.boardConnectingFromId) {
      if (state.boardConnectingFromId !== id) {
        state.addConnection(state.boardConnectingFromId, id, 'RELATED TO', true);
      }
      state.boardConnectingFromId = null;
    } else {
      state.boardSelectedNodeId = state.boardSelectedNodeId === id ? null : id;
      state.boardSelectedConnIndex = null;
    }
    state.notify();
  },
  selectBoardNode: (id) => { state.boardSelectedNodeId = id; state.boardSelectedConnIndex = null; state.notify(); },
  selectBoardConnection: (idx) => { state.boardSelectedConnIndex = idx; state.boardSelectedNodeId = null; state.notify(); },
  startConnectingFrom: (id) => { state.boardConnectingFromId = id; state.notify(); },
  finishConnectingTo: (targetId) => {
    if (state.boardConnectingFromId && state.boardConnectingFromId !== targetId) {
      state.addConnection(state.boardConnectingFromId, targetId, 'RELATED TO', true);
    }
    state.boardConnectingFromId = null;
    state.notify();
  },
  cancelConnecting: () => { state.boardConnectingFromId = null; state.notify(); },
  addBoardConnection: (id1, id2, relation = 'RELATED TO') => { state.addConnection(id1, id2, relation, true); },
  removeBoardConnection: (idx) => { state.removeConnection(idx); },
  autoArrangeBoard: () => { state.autoArrangeBoard(); },
  clearPlayerTheory: () => { state.clearPlayerTheory(); },
  testBoardTheory: () => { const res = testHypothesis(); state.setHypothesisResult(res); },
  setBoardFilter: (category) => { state.boardCategoryFilter = category; state.notify(); },
  setBoardSearch: (term) => { state.boardSearchTerm = term; state.notify(); },
  startBoardDrag: (event, nodeId) => {
    event.preventDefault();
    event.stopPropagation();
    const node = state.boardNodes?.find(n => n.id === nodeId);
    if (!node) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const nodeX = node.x || 40;
    const nodeY = node.y || 40;

    const onMouseMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const el = document.getElementById(`board-node-${nodeId}`);
      if (el) {
        el.style.left = `${Math.max(10, Math.min(1200, nodeX + dx))}px`;
        el.style.top = `${Math.max(10, Math.min(800, nodeY + dy))}px`;
      }
    };

    const onMouseUp = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      state.moveBoardNode(nodeId, nodeX + dx, nodeY + dy);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  state.init(case01);
  state.subscribe(() => {
    renderApp(appContainer);
  });
  renderApp(appContainer);
  console.log("The Last Suspect - Mystery-o-Matic Deduction Loop Ready");
});
