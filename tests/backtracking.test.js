import { describe, it, expect, beforeAll } from 'vitest';
import { findAllSolutions, solveCSP } from '../src/algorithms/backtracking.js';
import { state } from '../src/game/state.js';
import { case01 } from '../src/cases/case01.js';
import { testHypothesis } from '../src/game/HypothesisEngine.js';
import { validateCaseUniqueness } from '../src/game/CaseValidator.js';

describe('Backtracking Algorithm (Pure)', () => {
    it('1. Simple solvable CSP', () => {
        const variables = ['x', 'y'];
        const domains = { x: [1, 2], y: [1, 2] };
        const constraints = [(a) => {
            if (a.x !== undefined && a.y !== undefined) return a.x !== a.y;
            return true;
        }];

        const solution = solveCSP(variables, domains, constraints);
        expect(solution).not.toBeNull();
        expect(solution.x).not.toBe(solution.y);
    });

    it('2. Simple impossible CSP', () => {
        const variables = ['x', 'y'];
        const domains = { x: [1], y: [1] };
        const constraints = [(a) => {
            if (a.x !== undefined && a.y !== undefined) return a.x !== a.y;
            return true;
        }];

        const solution = solveCSP(variables, domains, constraints);
        expect(solution).toBeNull();
    });

    it('3. Dead-end followed by successful backtracking', () => {
        const variables = ['x', 'y', 'z'];
        const domains = { x: [1, 2, 3], y: [1, 2, 3], z: [1, 2, 3] };
        const constraints = [(a) => {
            if (a.x !== undefined && a.y !== undefined && a.x >= a.y) return false;
            if (a.y !== undefined && a.z !== undefined && a.y >= a.z) return false;
            return true;
        }];

        const solution = solveCSP(variables, domains, constraints);
        expect(solution).not.toBeNull();
        expect(solution.x).toBeLessThan(solution.y);
        expect(solution.y).toBeLessThan(solution.z);
    });

    it('4. Partial assignment that remains possible', () => {
        const variables = ['x', 'y', 'z'];
        const domains = { x: [1], y: [1, 2], z: [1, 2] };
        const constraints = [(a) => {
            if (a.x !== undefined && a.y !== undefined) return a.x !== a.y;
            if (a.y !== undefined && a.z !== undefined) return a.y !== a.z;
            return true;
        }];

        const solutions = findAllSolutions(variables, domains, constraints, {}, 10);
        expect(solutions.length).toBeGreaterThan(0);
        expect(solutions[0].x).toBe(1);
    });

    it('5. Partial assignment that becomes impossible', () => {
        const variables = ['x', 'y'];
        const domains = { x: [1], y: [1] };
        const constraints = [(a) => {
            if (a.x !== undefined && a.y !== undefined) return a.x !== a.y;
            return true;
        }];

        const solutions = findAllSolutions(variables, domains, constraints, {}, 10);
        expect(solutions.length).toBe(0);
    });

    it('6. Multiple valid solutions', () => {
        const variables = ['x', 'y'];
        const domains = { x: [1, 2, 3], y: [1, 2, 3] };
        const constraints = [(a) => {
            if (a.x !== undefined && a.y !== undefined) return a.x !== a.y;
            return true;
        }];

        const solutions = findAllSolutions(variables, domains, constraints, {}, 100);
        expect(solutions.length).toBe(6);
    });

    it('7. Unique solution', () => {
        const variables = ['x', 'y'];
        const domains = { x: [1], y: [2] };
        const constraints = [];

        const solutions = findAllSolutions(variables, domains, constraints, {}, 10);
        expect(solutions.length).toBe(1);
        expect(solutions[0]).toEqual({ x: 1, y: 2 });
    });
});

describe('Backtracking – Game Integration', () => {
    beforeAll(() => {
        state.init(case01);
        case01.evidence.forEach(e => state.discoveredEvidence.add(e.id));
    });

    it('8. Case 01 uniqueness', () => {
        const result = validateCaseUniqueness();
        expect(result.status).toBe('unique');
        expect(result.count).toBe(1);
    });

    it('9. Invalid Case 01 hypothesis', () => {
        state.hypothesis = { person: 'sus_rahul', location: '', time: '', object: 'samosa' };
        const res = testHypothesis();
        expect(res.success).toBe(false);
    });

    it('10. Valid Case 01 hypothesis', () => {
        state.hypothesis = { person: 'sus_arun', location: 'loc_library', time: '4:30 PM', object: '' };
        const res = testHypothesis();
        expect(res.success).toBe(true);
    });
});
