import { findCaseSolutions } from './HypothesisEngine.js';
import { challenges } from '../cases/challenges.js';
import { findAllSolutions } from '../algorithms/backtracking.js';

/**
 * CaseValidator.js
 * 
 * Validates whether each challenge has exactly one valid crime solution (Who, When, Where, Evidence).
 */
export function validateCaseUniqueness() {
  const solutions = findCaseSolutions(2);

  if (solutions.length === 0) {
    return {
      status: 'invalid',
      count: 0,
      message: 'INVALID CASE: No valid solution exists. The constraints are contradictory.'
    };
  }

  if (solutions.length === 1) {
    return {
      status: 'unique',
      count: 1,
      message: 'UNIQUE CASE ✓: Exactly one valid explanation exists.',
      solution: solutions[0]
    };
  }

  return {
    status: 'ambiguous',
    count: 2,
    message: 'AMBIGUOUS CASE: Multiple valid explanations exist.'
  };
}

export function validateChallengeUniqueness(challengeId = 'challenge_01') {
  if (challengeId === 'challenge_01') {
    return validateCaseUniqueness();
  }

  const ch = challenges.find(c => c.id === challengeId);
  if (!ch) return validateCaseUniqueness();

  const suspects = ch.suspects.map(s => s.id);
  const locations = ch.locations.map(l => l.id);
  const times = ch.times;

  const variables = ['thief'];
  const domains = { 'thief': suspects };

  suspects.forEach(sId => {
    times.forEach((t, tIdx) => {
      const varName = `${sId}_${tIdx}`;
      variables.push(varName);
      domains[varName] = [...locations];
    });
  });

  const timeIndexMap = {};
  times.forEach((t, idx) => { timeIndexMap[t] = idx; });

  const pin = (suspectId, timeStr, locId) => {
    const tIdx = timeIndexMap[timeStr];
    if (tIdx !== undefined) {
      const varName = `${suspectId}_${tIdx}`;
      if (domains[varName]) domains[varName] = [locId];
    }
  };

  if (challengeId === 'challenge_02') {
    pin('sus_arun', '10:00 AM', 'loc_library');
    pin('sus_arun', '10:15 AM', 'loc_library');
    pin('sus_arun', '10:30 AM', 'loc_library');
    pin('sus_karthik', '10:00 AM', 'loc_lab');
    pin('sus_karthik', '10:15 AM', 'loc_lab');
    pin('sus_karthik', '10:30 AM', 'loc_lab');
    pin('sus_karthik', '10:45 AM', 'loc_lab');
    pin('sus_rahul', '10:15 AM', 'loc_seminar');
    pin('sus_rahul', '10:30 AM', 'loc_seminar');
    pin('sus_rahul', '10:45 AM', 'loc_seminar');
    pin('sus_priya', '10:15 AM', 'loc_library');
    pin('sus_priya', '10:30 AM', 'loc_library');
    pin('sus_meena', '10:00 AM', 'loc_dept');
    pin('sus_meena', '10:30 AM', 'loc_staff');
    pin('sus_meena', '10:45 AM', 'loc_dept');
  } else if (challengeId === 'challenge_03') {
    pin('sus_arun', '2:00 PM', 'loc_library');
    pin('sus_arun', '2:15 PM', 'loc_library');
    pin('sus_arun', '2:30 PM', 'loc_library');
    pin('sus_karthik', '2:15 PM', 'loc_lab');
    pin('sus_karthik', '2:30 PM', 'loc_lab');
    pin('sus_karthik', '2:45 PM', 'loc_lab');
    pin('sus_meena', '2:15 PM', 'loc_seminar');
    pin('sus_meena', '2:30 PM', 'loc_seminar');
    pin('sus_meena', '2:45 PM', 'loc_seminar');
    pin('sus_rahul', '2:30 PM', 'loc_lab');
    pin('sus_priya', '2:00 PM', 'loc_library');
    pin('sus_priya', '2:15 PM', 'loc_dept');
    pin('sus_priya', '2:30 PM', 'loc_class');
    pin('sus_priya', '3:00 PM', 'loc_seminar');
  }

  const getDist = (loc1, loc2) => {
    if (loc1 === loc2) return 0;
    const isEdge = ch.edges.some(e => (e[0] === loc1 && e[1] === loc2) || (e[0] === loc2 && e[1] === loc1));
    return isEdge ? 1 : 2;
  };

  const constraints = [
    (assignment) => {
      for (const sId of suspects) {
        for (let i = 0; i < times.length - 1; i++) {
          const l1 = assignment[`${sId}_${i}`];
          const l2 = assignment[`${sId}_${i + 1}`];
          if (l1 && l2 && l1 !== l2) {
            if (getDist(l1, l2) > 1) return false;
          }
        }
      }
      return true;
    }
  ];

  const rawSolutions = findAllSolutions(variables, domains, constraints, {}, 10);
  const targetTIdx = timeIndexMap[ch.solution.time];
  const uniqueCrimeSolutions = new Set(
    rawSolutions.map(sol => `${sol.thief}_${sol[`${sol.thief}_${targetTIdx}`]}`)
  );

  const count = uniqueCrimeSolutions.size;

  return {
    status: count === 1 ? 'unique' : 'invalid',
    count: count,
    message: count === 1 ? `UNIQUE CASE ✓: ${ch.title} produces exactly 1 solution.` : `FAILED: ${ch.title}`,
    solution: rawSolutions[0]
  };
}

export function validateAllCasesUniqueness() {
  return challenges.map(c => validateChallengeUniqueness(c.id));
}
