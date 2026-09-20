import { testHypothesis } from './HypothesisEngine.js';
import { audio } from '../utils/audio.js';
import { challenges } from '../cases/challenges.js';
import { case01 } from '../cases/case01.js';

export const state = {
  screen: 'MAIN_MENU', // MAIN_MENU, CASE_SELECT, CASE_INTRO, CAMPUS, SUSPECTS, INTERROGATE, EVIDENCE, BOARD, TIMELINE, HYPOTHESIS, ACCUSATION, JOURNAL, CASE_REPORT
  caseData: case01,
  currentLocation: null,
  currentSuspect: null,
  dialogueNode: 'start',
  discoveredEvidence: new Set(),
  connections: [],
  timelineAssignments: {},
  hypothesis: { person: '', location: '', time: '', object: '' },
  showHowToPlay: false,
  timelineResult: null,
  hypothesisResult: null,
  routeResults: {},
  challengeRoute: [],
  challengeResult: null,
  accused: null,
  accusationResult: null,
  investigationResult: null,
  caseResolved: false,

  // Audio State
  soundEnabled: false,

  // Case Flow & Completion State
  case01Completed: false,
  completedChallenges: {
    challenge_01: false,
    challenge_02: false,
    challenge_03: false
  },
  bestScores: {
    challenge_01: 0,
    challenge_02: 0,
    challenge_03: 0
  },
  accusationConfirmationPending: false,
  pendingAccusation: null,
  accusationFeedback: null,
  wrongAccusationCount: 0,
  hypothesesTestedCount: 0,
  showFinalReport: false,

  // Investigation & Dialogue State
  askedQuestions: new Set(),
  examinedStatements: new Set(),
  investigatedLocations: new Set(),
  interrogatedSuspects: new Set(),
  flags: new Set(),
  pendingRevealEvidence: null,
  presentedEvidenceResponse: null,

  // Detective Board Specific State
  boardNodes: [],
  boardSelectedNodeId: null,
  boardSelectedConnIndex: null,
  boardConnectingFromId: null,
  boardCategoryFilter: 'ALL',
  boardSearchTerm: '',

  // Mystery-o-Matic State for Challenge 01
  currentChallengeId: 'challenge_01',
  sleuthScore: 100,
  clueIndex: 0,
  unlockedClueCount: 2, // Starts with first 2 clues unlocked
  hintIndex: -1,
  activeHintText: null,
  appliedDeductions: new Set(),
  journalDeductions: [],
  timelineGrid: {}, // key: `${suspectId}_${time}` => { status: '?' | '✓' | 'x', locationId: '' }
  historyStack: [], // Array of previous timelineGrid snapshots for Undo
  pendingDeductionPrompt: null, // Prompt object for automatic deduction review
  contradictionWarning: null,
  movementCheckResult: null,
  timelineCheckResult: null,
  eliminatedBanner: null,
  showMapModal: false,
  showSuspectProfileModal: false,
  selectedProfileSuspectId: null,

  listeners: [],

  openSuspectProfile(suspectId) {
    this.selectedProfileSuspectId = suspectId;
    this.showSuspectProfileModal = true;
    this.notify();
  },

  closeSuspectProfile() {
    this.showSuspectProfileModal = false;
    this.selectedProfileSuspectId = null;
    this.notify();
  },

  getCurrentChallenge() {
    return challenges.find(c => c.id === this.currentChallengeId) || challenges[0];
  },

  selectChallenge(challengeId = 'challenge_01') {
    this.currentChallengeId = challengeId;
    this.sleuthScore = 100;
    this.clueIndex = 0;
    this.unlockedClueCount = 2;
    this.hintIndex = -1;
    this.activeHintText = null;
    this.appliedDeductions = new Set();
    this.journalDeductions = [];
    this.timelineGrid = {};
    this.historyStack = [];
    this.pendingDeductionPrompt = null;
    this.contradictionWarning = null;
    this.movementCheckResult = null;
    this.timelineCheckResult = null;
    this.eliminatedBanner = null;
    this.showMapModal = false;
    this.showSuspectProfileModal = false;
    this.selectedProfileSuspectId = null;
    this.caseResolved = false;
    this.accused = null;
    this.accusationFeedback = null;
    this.loadFromLocalStorage();
    this.init(case01);
    this.navigate('CASE_INTRO');
  },

  saveToLocalStorage() {
    try {
      const data = {
        timelineGrid: this.timelineGrid,
        journalDeductions: this.journalDeductions,
        appliedDeductions: Array.from(this.appliedDeductions),
        sleuthScore: this.sleuthScore,
        caseResolved: this.caseResolved,
        clueIndex: this.clueIndex,
        unlockedClueCount: this.unlockedClueCount
      };
      localStorage.setItem(`lastSuspect_${this.currentChallengeId}`, JSON.stringify(data));
      localStorage.setItem('lastSuspect_completed', JSON.stringify(this.completedChallenges));
      localStorage.setItem('lastSuspect_bestScores', JSON.stringify(this.bestScores));
    } catch (e) {}
  },

  loadFromLocalStorage() {
    try {
      const comp = localStorage.getItem('lastSuspect_completed');
      if (comp) this.completedChallenges = JSON.parse(comp);

      const scores = localStorage.getItem('lastSuspect_bestScores');
      if (scores) this.bestScores = JSON.parse(scores);

      const caseData = localStorage.getItem(`lastSuspect_${this.currentChallengeId}`);
      if (caseData) {
        const parsed = JSON.parse(caseData);
        if (parsed.timelineGrid) this.timelineGrid = parsed.timelineGrid;
        if (parsed.journalDeductions) this.journalDeductions = parsed.journalDeductions;
        if (parsed.appliedDeductions) this.appliedDeductions = new Set(parsed.appliedDeductions);
        if (parsed.sleuthScore !== undefined) this.sleuthScore = parsed.sleuthScore;
        if (parsed.caseResolved !== undefined) this.caseResolved = parsed.caseResolved;
        if (parsed.clueIndex !== undefined) this.clueIndex = parsed.clueIndex;
        if (parsed.unlockedClueCount !== undefined) this.unlockedClueCount = parsed.unlockedClueCount;
      }
    } catch (e) {}
  },

  resetCurrentCase() {
    try {
      localStorage.removeItem(`lastSuspect_${this.currentChallengeId}`);
    } catch (e) {}
    this.selectChallenge(this.currentChallengeId);
  },

  resetAllProgress() {
    try {
      localStorage.removeItem('lastSuspect_case01');
      localStorage.removeItem('lastSuspect_case02');
      localStorage.removeItem('lastSuspect_case03');
      localStorage.removeItem('lastSuspect_completed');
      localStorage.removeItem('lastSuspect_bestScores');
    } catch (e) {}
    this.completedChallenges = { challenge_01: false, challenge_02: false, challenge_03: false };
    this.bestScores = { challenge_01: 0, challenge_02: 0, challenge_03: 0 };
    this.selectChallenge('challenge_01');
  },

  saveSnapshot() {
    this.historyStack.push(JSON.parse(JSON.stringify(this.timelineGrid)));
    if (this.historyStack.length > 20) this.historyStack.shift();
  },

  toggleMapModal(show) {
    this.showMapModal = show !== undefined ? show : !this.showMapModal;
    this.notify();
  },

  undoLastDeduction() {
    if (this.historyStack.length > 0) {
      this.timelineGrid = this.historyStack.pop();
      this.contradictionWarning = null;
      this.movementCheckResult = null;
      this.timelineCheckResult = null;
      audio.playClick();
      this.checkElimination();
      this.notify();
    }
  },

  nextClue() {
    const ch = this.getCurrentChallenge();
    if (this.clueIndex < ch.clues.length - 1) {
      this.clueIndex++;
      if (this.clueIndex >= this.unlockedClueCount) {
        this.unlockedClueCount = this.clueIndex + 1;
        this.sleuthScore = Math.max(0, this.sleuthScore - 5);
      }
      audio.playEvidence();
      this.notify();
    }
  },

  prevClue() {
    if (this.clueIndex > 0) {
      this.clueIndex--;
      audio.playClick();
      this.notify();
    }
  },

  getHint() {
    const ch = this.getCurrentChallenge();
    if (this.hintIndex < ch.hints.length - 1) {
      this.hintIndex++;
      const hint = ch.hints[this.hintIndex];
      this.activeHintText = hint.text;
      this.sleuthScore = Math.max(0, this.sleuthScore - hint.cost);
      audio.playClick();
      this.notify();
    }
  },

  selectDeductionOption(clueId, optionId) {
    const ch = this.getCurrentChallenge();
    const clue = ch.clues.find(c => c.id === clueId);
    if (!clue) return;
    const opt = clue.deductionOptions?.find(o => o.id === optionId);
    if (!opt) return;

    if (opt.isCorrect) {
      this.saveSnapshot();
      this.appliedDeductions.add(optionId);
      
      const sName = ch.suspects.find(s => s.id === opt.suspectId)?.name || opt.suspectId;
      const lName = ch.locations.find(l => l.id === opt.locationId)?.name || opt.locationId;
      
      const mainDedText = `✓ ${sName} was in ${lName} at ${opt.time}`;
      if (!this.journalDeductions.includes(mainDedText)) {
        this.journalDeductions.push(mainDedText);
      }

      if (this.unlockedClueCount < ch.clues.length) {
        this.unlockedClueCount = Math.min(ch.clues.length, this.unlockedClueCount + 1);
      }

      const key = `${opt.suspectId}_${opt.time}`;
      this.timelineGrid[key] = { status: '✓', locationId: opt.locationId };

      const implied = [];
      const pendingUpdates = [];
      ch.locations.forEach(loc => {
        if (loc.id !== opt.locationId) {
          const locKey = `${opt.suspectId}_${opt.time}_${loc.id}`;
          const impText = `✗ ${sName} was not in ${loc.name} at ${opt.time}`;
          implied.push(impText);
          pendingUpdates.push({ key: locKey, data: { status: 'x', locationId: loc.id }, text: impText });
        }
      });

      this.pendingDeductionPrompt = {
        primaryText: mainDedText,
        impliedDeductions: implied,
        pendingUpdates
      };

      audio.playClick();
      this.validateGraphConsistency();
      this.checkElimination();
      this.notify();
    } else {
      audio.playContradiction();
      alert('That deduction is not supported by the clue details.');
    }
  },

  acceptPendingDeductions() {
    if (this.pendingDeductionPrompt) {
      this.saveSnapshot();
      this.pendingDeductionPrompt.pendingUpdates.forEach(u => {
        this.timelineGrid[u.key] = u.data;
        if (!this.journalDeductions.includes(u.text)) {
          this.journalDeductions.push(u.text);
        }
      });
      this.pendingDeductionPrompt = null;
      audio.playClick();
      this.notify();
    }
  },

  dismissPendingDeductions() {
    this.pendingDeductionPrompt = null;
    this.notify();
  },

  cycleCellState(suspectId, time) {
    this.saveSnapshot();
    const key = `${suspectId}_${time}`;
    const curr = this.timelineGrid[key] || { status: '?', locationId: '' };
    let nextStatus = '?';
    if (curr.status === '?') nextStatus = '✓';
    else if (curr.status === '✓') nextStatus = 'x';
    else if (curr.status === 'x') nextStatus = '?';

    this.timelineGrid[key] = { status: nextStatus, locationId: curr.locationId };
    audio.playClick();
    this.validateGraphConsistency();
    this.checkElimination();
    this.notify();
  },

  setGridCellLocation(suspectId, time, locationId) {
    this.saveSnapshot();
    const key = `${suspectId}_${time}`;
    this.timelineGrid[key] = { status: '✓', locationId };

    const ch = this.getCurrentChallenge();
    const sName = ch.suspects.find(s => s.id === suspectId)?.name || suspectId;
    const lName = ch.locations.find(l => l.id === locationId)?.name || locationId;
    
    const mainDedText = `✓ ${sName} was in ${lName} at ${time}`;
    if (!this.journalDeductions.includes(mainDedText)) {
      this.journalDeductions.push(mainDedText);
    }

    const implied = [];
    const pendingUpdates = [];
    ch.locations.forEach(loc => {
      if (loc.id !== locationId) {
        const locKey = `${suspectId}_${time}_${loc.id}`;
        const impText = `✗ ${sName} was not in ${loc.name} at ${time}`;
        implied.push(impText);
        pendingUpdates.push({ key: locKey, data: { status: 'x', locationId: loc.id }, text: impText });
      }
    });

    this.pendingDeductionPrompt = {
      primaryText: mainDedText,
      impliedDeductions: implied,
      pendingUpdates
    };

    audio.playClick();
    this.validateGraphConsistency();
    this.checkElimination();
    this.notify();
  },

  addMovementDeduction(suspectId, time, locationId) {
    this.saveSnapshot();
    const ch = this.getCurrentChallenge();
    const sName = ch.suspects.find(s => s.id === suspectId)?.name || suspectId;
    const lName = ch.locations.find(l => l.id === locationId)?.name || locationId;

    const key = `${suspectId}_${time}`;
    this.timelineGrid[key] = { status: '✓', locationId };

    const dedText = `✓ ${sName} must have been in ${lName} at ${time} (Movement Constraint)`;
    if (!this.journalDeductions.includes(dedText)) {
      this.journalDeductions.push(dedText);
    }

    audio.playSolve();
    this.validateGraphConsistency();
    this.checkElimination();
    this.notify();
  },

  checkTimelineConsistency() {
    this.validateGraphConsistency();
    if (this.contradictionWarning) {
      this.timelineCheckResult = {
        success: false,
        message: `⚠ CONTRADICTION FOUND: ${this.contradictionWarning}`
      };
      audio.playContradiction();
    } else {
      this.timelineCheckResult = {
        success: true,
        message: `✓ TIMELINE CONSISTENT: All current placement entries satisfy non-conflict location rules.`
      };
      audio.playSolve();
    }
    this.notify();
  },

  checkRouteMovement(suspectId) {
    const ch = this.getCurrentChallenge();
    const times = ch.times;
    const susName = ch.suspects.find(s => s.id === suspectId)?.name || suspectId;
    const timeIndexMap = { '4:30 PM': 0, '4:35 PM': 1, '4:40 PM': 2, '4:45 PM': 3 };

    const getDist = (loc1, loc2) => {
      if (loc1 === loc2) return 0;
      const isEdge = ch.edges.some(e => (e[0] === loc1 && e[1] === loc2) || (e[0] === loc2 && e[1] === loc1));
      if (isEdge) return 1;
      const locsWithEdges = (start) => ch.edges.filter(e => e[0] === start || e[1] === start).map(e => e[0] === start ? e[1] : e[0]);
      const neighbors1 = locsWithEdges(loc1);
      const neighbors2 = locsWithEdges(loc2);
      if (neighbors1.some(n => neighbors2.includes(n))) return 2;
      return 3;
    };

    let moves = [];
    for (const t of times) {
      const key = `${suspectId}_${t}`;
      const cell = this.timelineGrid[key];
      if (cell && cell.status === '✓' && cell.locationId) {
        moves.push({ time: t, tIdx: timeIndexMap[t], locationId: cell.locationId });
      }
    }

    if (moves.length < 2) {
      this.movementCheckResult = {
        success: false,
        message: `Confirm at least 2 locations on the timeline for ${susName} to verify movement.`
      };
      this.notify();
      return;
    }

    let isPossible = true;
    let conflictMsg = '';
    let routeNames = [];

    moves.forEach(m => {
      const lName = ch.locations.find(l => l.id === m.locationId)?.name || m.locationId;
      routeNames.push(`${lName} (${m.time})`);
    });

    for (let i = 0; i < moves.length - 1; i++) {
      const m1 = moves[i];
      const m2 = moves[i + 1];
      const timeDiff = Math.abs(m2.tIdx - m1.tIdx);
      const dist = getDist(m1.locationId, m2.locationId);

      if (dist > timeDiff) {
        isPossible = false;
        const loc1 = ch.locations.find(l => l.id === m1.locationId)?.name || m1.locationId;
        const loc2 = ch.locations.find(l => l.id === m2.locationId)?.name || m2.locationId;
        const minutes = timeDiff * 5;
        conflictMsg = `${susName} cannot travel from ${loc1} to ${loc2} in ${minutes} minutes (requires at least ${dist * 5} minutes).`;
        break;
      }
    }

    let requiredDeduction = null;
    const m430 = moves.find(m => m.tIdx === 0);
    const m440 = moves.find(m => m.tIdx === 2);
    const has435 = moves.some(m => m.tIdx === 1);

    if (m430 && m440 && !has435 && isPossible) {
      const l1 = m430.locationId;
      const l2 = m440.locationId;
      const candidates = ch.locations.filter(loc => getDist(l1, loc.id) <= 1 && getDist(loc.id, l2) <= 1);

      if (candidates.length === 1) {
        const reqName = candidates[0].name;
        const l1Name = ch.locations.find(l => l.id === l1)?.name;
        const l2Name = ch.locations.find(l => l.id === l2)?.name;
        requiredDeduction = {
          suspectId,
          time: '4:35 PM',
          locationId: candidates[0].id,
          locationName: reqName,
          routeText: `${l1Name} → ${reqName} → ${l2Name}`
        };
      }
    }

    if (isPossible) {
      this.movementCheckResult = {
        success: true,
        message: `MOVEMENT CHECK: ${routeNames.join(' → ')} &bull; ✓ POSSIBLE`,
        requiredDeduction
      };
      audio.playSolve();
    } else {
      this.movementCheckResult = {
        success: false,
        message: `MOVEMENT CHECK: ${routeNames.join(' → ')} &bull; ✗ IMPOSSIBLE (${conflictMsg})`
      };
      audio.playContradiction();
    }
    this.notify();
  },

  validateGraphConsistency() {
    const ch = this.getCurrentChallenge();
    this.contradictionWarning = null;

    const times = ch.times;
    const suspects = ch.suspects;
    const timeIndexMap = { '4:30 PM': 0, '4:35 PM': 1, '4:40 PM': 2, '4:45 PM': 3 };

    const getDist = (loc1, loc2) => {
      if (loc1 === loc2) return 0;
      const isEdge = ch.edges.some(e => (e[0] === loc1 && e[1] === loc2) || (e[0] === loc2 && e[1] === loc1));
      if (isEdge) return 1;
      const locsWithEdges = (start) => ch.edges.filter(e => e[0] === start || e[1] === start).map(e => e[0] === start ? e[1] : e[0]);
      const neighbors1 = locsWithEdges(loc1);
      const neighbors2 = locsWithEdges(loc2);
      if (neighbors1.some(n => neighbors2.includes(n))) return 2;
      return 3;
    };

    for (const sus of suspects) {
      for (const t of times) {
        const confirmedLocs = [];
        ch.locations.forEach(loc => {
          const locKey = `${sus.id}_${t}_${loc.id}`;
          if (this.timelineGrid[locKey]?.status === '✓') confirmedLocs.push(loc.name);
        });
        const primaryKey = `${sus.id}_${t}`;
        if (this.timelineGrid[primaryKey]?.status === '✓' && this.timelineGrid[primaryKey]?.locationId) {
          const pLocName = ch.locations.find(l => l.id === this.timelineGrid[primaryKey].locationId)?.name;
          if (pLocName && !confirmedLocs.includes(pLocName)) confirmedLocs.push(pLocName);
        }

        if (confirmedLocs.length > 1) {
          this.contradictionWarning = `⚠ CONTRADICTION: ${sus.name} CANNOT BE IN TWO LOCATIONS AT THE SAME TIME (${confirmedLocs.join(' and ')} at ${t}).`;
          return;
        }
      }
    }

    for (const sus of suspects) {
      const confirmedMoves = [];
      times.forEach(t => {
        const primaryKey = `${sus.id}_${t}`;
        const c = this.timelineGrid[primaryKey];
        if (c?.status === '✓' && c.locationId) {
          confirmedMoves.push({ time: t, tIdx: timeIndexMap[t], locationId: c.locationId });
        }
      });

      for (let i = 0; i < confirmedMoves.length - 1; i++) {
        for (let j = i + 1; j < confirmedMoves.length; j++) {
          const m1 = confirmedMoves[i];
          const m2 = confirmedMoves[j];
          const timeDiff = Math.abs(m2.tIdx - m1.tIdx);
          const dist = getDist(m1.locationId, m2.locationId);

          if (dist > timeDiff) {
            const l1Name = ch.locations.find(l => l.id === m1.locationId)?.name || m1.locationId;
            const l2Name = ch.locations.find(l => l.id === m2.locationId)?.name || m2.locationId;
            const minutes = timeDiff * 5;
            this.contradictionWarning = `⚠ CONTRADICTION: ${sus.name} cannot move from ${l1Name} (${m1.time}) to ${l2Name} (${m2.time}) in ${minutes} minutes.`;
            return;
          }
        }
      }
    }
  },

  checkElimination() {
    const ch = this.getCurrentChallenge();
    const theftTime = ch.solution.time;
    const theftLoc = ch.solution.location;

    const possibleSuspects = [];
    ch.suspects.forEach(sus => {
      let isEliminated = false;

      if (sus.id === 'sus_rahul' && (this.appliedDeductions.has('d5_correct') || this.appliedDeductions.has('c2_d3_correct') || this.appliedDeductions.has('c3_d4_correct'))) {
        isEliminated = true;
      }

      const primaryKey = `${sus.id}_${theftTime}`;
      const locKey = `${sus.id}_${theftTime}_${theftLoc}`;
      
      const primaryVal = this.timelineGrid[primaryKey];
      const locVal = this.timelineGrid[locKey];

      if (locVal?.status === 'x') isEliminated = true;
      if (primaryVal?.status === '✓' && primaryVal?.locationId && primaryVal.locationId !== theftLoc) isEliminated = true;

      if (!isEliminated) {
        possibleSuspects.push(sus.name);
      }
    });

    if (possibleSuspects.length === 1) {
      this.eliminatedBanner = `ONE POSSIBILITY REMAINS: ${possibleSuspects[0].toUpperCase()}`;
    } else {
      this.eliminatedBanner = null;
    }
  },

  clearAccusationFeedback() {
    this.accusationFeedback = null;
    this.notify();
  },

  submitFinalAccusation(suspectId, locationId, timeId, evidenceId) {
    if (!suspectId || !locationId || !timeId || !evidenceId) {
      this.accusationFeedback = {
        success: false,
        message: "Complete all four accusation fields before submitting."
      };
      audio.playContradiction();
      this.notify();
      return;
    }

    const ch = this.getCurrentChallenge();
    const sol = ch.solution;

    const isSuspectCorrect = suspectId === sol.suspect;
    const isLocCorrect = locationId === sol.location;
    const isTimeCorrect = timeId === sol.time;
    const isEvCorrect = evidenceId === sol.evidenceId;

    if (isSuspectCorrect && isLocCorrect && isTimeCorrect && isEvCorrect) {
      this.caseResolved = true;
      this.case01Completed = true;
      if (this.completedChallenges) {
        this.completedChallenges[this.currentChallengeId] = true;
      }
      if (this.bestScores) {
        const currBest = this.bestScores[this.currentChallengeId] || 0;
        if (this.sleuthScore > currBest) {
          this.bestScores[this.currentChallengeId] = this.sleuthScore;
        }
      }
      this.accusationFeedback = {
        success: true,
        message: "CASE SOLVED! Your solution follows from the movement constraints, timeline deductions, and elimination of the remaining suspects."
      };
      audio.playSolve();
    } else {
      this.wrongAccusationCount++;
      this.sleuthScore = Math.max(0, this.sleuthScore - 10);

      let conflictCategory = "Your suspect selection does not fit the evidence.";
      if (!isSuspectCorrect) {
        conflictCategory = "Suspect Selection: Your accused suspect does not fit the evidence.";
      } else if (!isLocCorrect) {
        conflictCategory = "Incident Location: The selected location conflicts with where the theft took place.";
      } else if (!isTimeCorrect) {
        conflictCategory = "Time Window: The selected time conflicts with the known timeline.";
      } else if (!isEvCorrect) {
        conflictCategory = "Evidence Selection: The selected evidence does not prove the suspect's involvement.";
      }

      this.accusationFeedback = {
        success: false,
        message: `Your accusation does not match the evidence. (${conflictCategory})`
      };
      audio.playContradiction();
    }
    this.notify();
  },

  toggleSound() {
    this.soundEnabled = audio.toggle();
    this.notify();
  },

  init(caseData) {
    this.caseData = caseData || case01;
    this.initBoardNodes();
  },

  subscribe(fn) {
    this.listeners.push(fn);
  },

  notify() {
    this.saveToLocalStorage();
    this.listeners.forEach(fn => fn(this));
  },

  navigate(screen, payload = {}) {
    this.screen = screen;
    if (payload.location) {
      this.currentLocation = payload.location;
    }
    if (payload.suspect) {
      this.currentSuspect = payload.suspect;
      this.dialogueNode = 'start';
      this.interrogatedSuspects.add(payload.suspect);
    }
    this.notify();
  },

  discover(evidenceId, showModal = false) {
    if (!this.caseData) this.caseData = case01;
    if (evidenceId && !this.discoveredEvidence.has(evidenceId)) {
      this.discoveredEvidence.add(evidenceId);
      const ev = this.caseData ? this.caseData.evidence?.find(e => e.id === evidenceId) : null;

      if (this.caseData && this.boardNodes && this.boardNodes.length > 0) {
        if (ev && !this.boardNodes.some(n => n.id === evidenceId)) {
          this.addNodeToBoard(ev.id, 'EVIDENCE', ev.title, ev.type);
        }
      }

      if (showModal && ev) {
        this.pendingRevealEvidence = ev;
      }
      audio.playEvidence();
      this.notify();
    }
  },

  closeEvidenceReveal() {
    this.pendingRevealEvidence = null;
    this.notify();
  },

  addEvidenceToBoardAndClose(evidenceId) {
    const ev = this.caseData ? this.caseData.evidence?.find(e => e.id === evidenceId) : null;
    if (ev) {
      this.addNodeToBoard(ev.id, 'EVIDENCE', ev.title, ev.type);
    }
    this.pendingRevealEvidence = null;
    this.notify();
  },

  askQuestion(qId, suspectId, statementId, unlockedEvId, flag) {
    if (qId) this.askedQuestions.add(qId);
    if (suspectId) this.interrogatedSuspects.add(suspectId);
    if (statementId) this.examinedStatements.add(statementId);
    if (flag) this.flags.add(flag);
    if (unlockedEvId) this.discover(unlockedEvId, true);
    this.notify();
  },

  presentEvidence(suspectId, evidenceId) {
    if (!this.caseData) return;
    const ev = this.caseData.evidence?.find(e => e.id === evidenceId);
    const suspect = this.caseData.suspects?.find(s => s.id === suspectId);
    if (!ev || !suspect) return;

    let responseText = `${suspect.name} inspects ${ev.title}: "Interesting... but I don't see how that contradicts what I said."`;
    this.presentedEvidenceResponse = { suspectName: suspect.name, evidenceTitle: ev.title, text: responseText };
    this.notify();
  },

  clearPresentedEvidenceResponse() {
    this.presentedEvidenceResponse = null;
    this.notify();
  },

  prepareAccusationConfirmation(suspectId, locationId, timeId, objectId) {
    this.accused = suspectId;
    this.pendingAccusation = { suspectId, locationId: locationId || 'loc_canteen', timeId: timeId || '4:35 PM', objectId: objectId || 'samosa' };
    this.accusationConfirmationPending = true;
    this.notify();
  },

  cancelAccusationConfirmation() {
    this.accusationConfirmationPending = false;
    this.notify();
  },

  confirmFinalAccusation() {
    if (!this.pendingAccusation) return;
    const { suspectId, locationId, timeId } = this.pendingAccusation;
    this.submitFinalAccusation(suspectId, locationId, timeId, 'clue_7');
  },

  restartCase() {
    this.selectChallenge(this.currentChallengeId || 'challenge_01');
  },

  initBoardNodes() {
    if (!this.caseData) this.caseData = case01;
    if (this.boardNodes && this.boardNodes.length > 0) return;

    const nodes = [];
    (this.caseData.suspects || []).forEach(s => {
      nodes.push({ id: s.id, type: 'PERSON', label: s.name, sub: s.role, confirmed: true });
    });
    (this.caseData.locations || []).forEach(l => {
      nodes.push({ id: l.id, type: 'LOCATION', label: l.name, sub: l.name, confirmed: true });
    });
    (this.caseData.times || ['4:30 PM', '4:35 PM', '4:40 PM', '4:45 PM']).forEach(t => {
      nodes.push({ id: t, type: 'TIME', label: t, sub: 'Timeslot', confirmed: true });
    });
    nodes.push({ id: 'samosa', type: 'OBJECT', label: 'The Last Samosa', sub: 'Missing Snack', confirmed: true });

    this.boardNodes = nodes;
    this.autoArrangeBoard();
  },

  addNodeToBoard(id, type, label, sub = '') {
    if (!this.boardNodes.some(n => n.id === id)) {
      this.boardNodes.push({ id, type: type.toUpperCase(), label, sub, x: 350, y: 150, confirmed: true });
      this.notify();
    }
  },

  removeNodeFromBoard(id) {
    this.boardNodes = this.boardNodes.filter(n => n.id !== id);
    this.notify();
  },

  moveBoardNode(id, x, y) {
    const node = this.boardNodes.find(n => n.id === id);
    if (node) { node.x = x; node.y = y; this.notify(); }
  },

  autoArrangeBoard() {
    this.notify();
  },

  addConnection(id1, id2, relation = 'RELATED TO', playerCreated = true) {
    if (id1 && id2 && id1 !== id2) {
      this.connections.push({ id1, id2, relation, playerCreated });
      this.notify();
    }
  },

  removeConnection(index) {
    if (index >= 0 && index < this.connections.length) {
      this.connections.splice(index, 1);
      this.notify();
    }
  },

  clearPlayerTheory() {
    this.connections = [];
    this.notify();
  },

  getBoardContradictions() { return []; },
  getTimelineConfidence() { return 'CONSISTENT'; },
  assignTimeline(time, evidenceId) { this.notify(); },
  setHypothesis(field, value) { this.hypothesis[field] = value; this.notify(); },
  toggleHowToPlay(show) { this.showHowToPlay = show; this.notify(); },
  setTimelineResult(res) { this.timelineResult = res; this.notify(); },
  setHypothesisResult(res) { this.hypothesisResult = res; this.notify(); },
  setRouteResult(suspectId, res) { this.routeResults[suspectId] = res; this.notify(); },
  addToChallengeRoute(locationId) { this.notify(); },
  clearChallengeRoute() { this.notify(); },
  setChallengeResult(res) { this.challengeResult = res; this.notify(); },
  setAccused(suspectId) { this.accused = suspectId; this.notify(); },
  setAccusationResult(res) { this.accusationResult = res; this.notify(); },
  setInvestigationResult(location, found) { this.notify(); },
  setCaseResolved(val) { this.caseResolved = val; this.notify(); }
};
