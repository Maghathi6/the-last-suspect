import { describe, it, expect, beforeEach } from 'vitest';
import { state } from '../src/game/state.js';
import { challenges } from '../src/cases/challenges.js';

describe('Multi-Challenge Case Engine (Challenges 01, 02, 03)', () => {
  beforeEach(() => {
    state.completedChallenges = { challenge_01: false, challenge_02: false, challenge_03: false };
    state.bestScores = { challenge_01: 0, challenge_02: 0, challenge_03: 0 };
  });

  it('contains exactly 3 playable challenges', () => {
    expect(challenges.length).toBe(3);
    expect(challenges[0].id).toBe('challenge_01');
    expect(challenges[1].id).toBe('challenge_02');
    expect(challenges[2].id).toBe('challenge_03');
  });

  it('plays and solves Challenge 01 (The Last Samosa) with Karthik as culprit', () => {
    state.selectChallenge('challenge_01');
    expect(state.getCurrentChallenge().title).toBe('THE LAST SAMOSA');
    expect(state.sleuthScore).toBe(100);

    state.submitFinalAccusation('sus_karthik', 'loc_canteen', '4:35 PM', 'clue_7');

    expect(state.caseResolved).toBe(true);
    expect(state.completedChallenges.challenge_01).toBe(true);
    expect(state.bestScores.challenge_01).toBe(100);
  });

  it('plays and solves Challenge 02 (The Missing Attendance Register) with Meena as culprit', () => {
    state.selectChallenge('challenge_02');
    expect(state.getCurrentChallenge().title).toBe('THE MISSING ATTENDANCE REGISTER');
    expect(state.sleuthScore).toBe(100);

    state.submitFinalAccusation('sus_meena', 'loc_staff', '10:30 AM', 'clue_c2_7');

    expect(state.caseResolved).toBe(true);
    expect(state.completedChallenges.challenge_02).toBe(true);
    expect(state.bestScores.challenge_02).toBe(100);
  });

  it('plays and solves Challenge 03 (The Projector Incident) with Priya as culprit', () => {
    state.selectChallenge('challenge_03');
    expect(state.getCurrentChallenge().title).toBe('THE PROJECTOR INCIDENT');
    expect(state.sleuthScore).toBe(100);

    state.submitFinalAccusation('sus_priya', 'loc_class', '2:30 PM', 'clue_c3_7');

    expect(state.caseResolved).toBe(true);
    expect(state.completedChallenges.challenge_03).toBe(true);
    expect(state.bestScores.challenge_03).toBe(100);
  });

  it('maintains independent case states and score tracking across challenges', () => {
    // Solve Challenge 01 with a penalty (score 90)
    state.selectChallenge('challenge_01');
    state.submitFinalAccusation('sus_arun', 'loc_canteen', '4:35 PM', 'clue_7'); // wrong
    state.submitFinalAccusation('sus_karthik', 'loc_canteen', '4:35 PM', 'clue_7'); // correct
    expect(state.bestScores.challenge_01).toBe(90);

    // Solve Challenge 02 with perfect score (score 100)
    state.selectChallenge('challenge_02');
    state.submitFinalAccusation('sus_meena', 'loc_staff', '10:30 AM', 'clue_c2_7');
    expect(state.bestScores.challenge_02).toBe(100);

    // Verify independent progress
    expect(state.completedChallenges.challenge_01).toBe(true);
    expect(state.completedChallenges.challenge_02).toBe(true);
    expect(state.completedChallenges.challenge_03).toBe(false);

    expect(state.bestScores.challenge_01).toBe(90);
    expect(state.bestScores.challenge_02).toBe(100);
    expect(state.bestScores.challenge_03).toBe(0);
  });
});
