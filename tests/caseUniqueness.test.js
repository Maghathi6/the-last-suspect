import { describe, it, expect } from 'vitest';
import { validateChallengeUniqueness, validateAllCasesUniqueness } from '../src/game/CaseValidator.js';

describe('Ground-Truth Case Uniqueness Validation (CSP Solver)', () => {
  it('verifies Challenge 01 (The Last Samosa) produces exactly 1 valid solution', () => {
    const result = validateChallengeUniqueness('challenge_01');
    expect(result.count).toBe(1);
    expect(result.status).toBe('unique');
  });

  it('verifies Challenge 02 (The Missing Attendance Register) produces exactly 1 valid solution', () => {
    const result = validateChallengeUniqueness('challenge_02');
    expect(result.count).toBe(1);
    expect(result.status).toBe('unique');
  });

  it('verifies Challenge 03 (The Projector Incident) produces exactly 1 valid solution', () => {
    const result = validateChallengeUniqueness('challenge_03');
    expect(result.count).toBe(1);
    expect(result.status).toBe('unique');
  });

  it('validates all 3 challenges together in a single batch pass', () => {
    const results = validateAllCasesUniqueness();
    expect(results.length).toBe(3);
    results.forEach(res => {
      expect(res.count).toBe(1);
      expect(res.status).toBe('unique');
    });
  });
});
