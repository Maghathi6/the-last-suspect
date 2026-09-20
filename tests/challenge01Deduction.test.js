import { describe, it, expect, beforeEach } from 'vitest';
import { state } from '../src/game/state.js';

describe('Challenge 01 Deduction & Movement Engine', () => {
  beforeEach(() => {
    state.selectChallenge('challenge_01');
  });

  it('initializes Challenge 01 from a fresh state', () => {
    expect(state.sleuthScore).toBe(100);
    expect(state.clueIndex).toBe(0);
    expect(state.unlockedClueCount).toBe(2);
    expect(state.caseResolved).toBe(false);
    expect(Object.keys(state.timelineGrid).length).toBe(0);
  });

  it('cycles cell states between ?, ✓, and x', () => {
    state.cycleCellState('sus_arun', '4:30 PM');
    expect(state.timelineGrid['sus_arun_4:30 PM'].status).toBe('✓');

    state.cycleCellState('sus_arun', '4:30 PM');
    expect(state.timelineGrid['sus_arun_4:30 PM'].status).toBe('x');

    state.cycleCellState('sus_arun', '4:30 PM');
    expect(state.timelineGrid['sus_arun_4:30 PM'].status).toBe('?');
  });

  it('verifies a valid 1-step movement on campus graph', () => {
    state.timelineGrid['sus_arun_4:30 PM'] = { status: '✓', locationId: 'loc_library' };
    state.timelineGrid['sus_arun_4:35 PM'] = { status: '✓', locationId: 'loc_main' };

    state.checkRouteMovement('sus_arun');
    expect(state.movementCheckResult.success).toBe(true);
    expect(state.movementCheckResult.message).toContain('POSSIBLE');
  });

  it('detects invalid teleportation across non-adjacent nodes in 5 minutes', () => {
    state.timelineGrid['sus_arun_4:30 PM'] = { status: '✓', locationId: 'loc_library' };
    state.timelineGrid['sus_arun_4:35 PM'] = { status: '✓', locationId: 'loc_canteen' };

    state.checkRouteMovement('sus_arun');
    expect(state.movementCheckResult.success).toBe(false);
    expect(state.movementCheckResult.message).toContain('IMPOSSIBLE');
  });

  it('derives intermediate location via backtracking (Library 4:30 PM -> Canteen 4:40 PM forces Main Block at 4:35 PM)', () => {
    state.timelineGrid['sus_arun_4:30 PM'] = { status: '✓', locationId: 'loc_library' };
    state.timelineGrid['sus_arun_4:40 PM'] = { status: '✓', locationId: 'loc_canteen' };

    state.checkRouteMovement('sus_arun');
    expect(state.movementCheckResult.success).toBe(true);
    expect(state.movementCheckResult.requiredDeduction).not.toBeNull();
    expect(state.movementCheckResult.requiredDeduction.locationId).toBe('loc_main');
    expect(state.movementCheckResult.requiredDeduction.locationName).toBe('Main Block');
  });

  it('detects contradiction when moving requires more hops than available timeslots', () => {
    state.timelineGrid['sus_arun_4:30 PM'] = { status: '✓', locationId: 'loc_library' };
    state.timelineGrid['sus_arun_4:40 PM'] = { status: '✓', locationId: 'loc_seminar' };

    state.validateGraphConsistency();
    expect(state.contradictionWarning).not.toBeNull();
    expect(state.contradictionWarning).toContain('cannot move from Library (4:30 PM) to Seminar Hall (4:40 PM) in 10 minutes');
  });

  it('reverts state using undoLastDeduction()', () => {
    state.cycleCellState('sus_arun', '4:30 PM');
    expect(state.timelineGrid['sus_arun_4:30 PM'].status).toBe('✓');

    state.undoLastDeduction();
    expect(state.timelineGrid['sus_arun_4:30 PM']).toBeUndefined();
  });

  it('triggers process of elimination banner when Karthik is the only suspect remaining at Canteen at 4:35 PM', () => {
    state.timelineGrid['sus_arun_4:35 PM'] = { status: '✓', locationId: 'loc_main' };
    state.timelineGrid['sus_priya_4:35 PM'] = { status: '✓', locationId: 'loc_lab' };
    state.timelineGrid['sus_meena_4:35 PM'] = { status: '✓', locationId: 'loc_seminar' };
    state.appliedDeductions.add('d5_correct'); // Rahul asleep

    state.checkElimination();
    expect(state.eliminatedBanner).toBe('ONE POSSIBILITY REMAINS: KARTHIK');
  });

  it('resolves case on correct final accusation and gives feedback on incorrect accusation', () => {
    // Wrong accusation
    state.submitFinalAccusation('sus_arun', 'loc_canteen', '4:35 PM', 'clue_7');
    expect(state.caseResolved).toBe(false);
    expect(state.sleuthScore).toBe(90);
    expect(state.accusationFeedback.success).toBe(false);
    expect(state.accusationFeedback.message).toContain('Suspect Selection');

    // Correct accusation
    state.submitFinalAccusation('sus_karthik', 'loc_canteen', '4:35 PM', 'clue_7');
    expect(state.caseResolved).toBe(true);
    expect(state.case01Completed).toBe(true);
    expect(state.accusationFeedback.success).toBe(true);
  });
});
