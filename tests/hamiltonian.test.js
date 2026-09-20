import { describe, it, expect, beforeAll } from 'vitest';
import { findHamiltonianPath } from '../src/algorithms/hamiltonian.js';
import { validateNormalRoute, validateHamiltonianChallenge, isChallengeSolvable } from '../src/game/RouteValidator.js';
import { state } from '../src/game/state.js';

describe('Hamiltonian Path Algorithm', () => {
    beforeAll(() => {
        state.init({
            locations: [
                { id: "loc_canteen", name: "Canteen" },
                { id: "loc_library", name: "Library" },
                { id: "loc_lab", name: "Computer Lab" },
                { id: "loc_main", name: "Main Block" },
                { id: "loc_seminar", name: "Seminar Hall" },
                { id: "loc_hostel", name: "Hostel" },
                { id: "loc_playground", name: "Playground" },
                { id: "loc_dept", name: "Department Block" },
                { id: "loc_parking", name: "Parking Area" }
            ]
        });
    });

    it('1. Single vertex', () => {
        const vertices = ['A'];
        const adj = { 'A': [] };
        const result = findHamiltonianPath(vertices, adj);
        expect(result.success).toBe(true);
        expect(result.path).toEqual(['A']);
    });

    it('2. Linear graph with Hamiltonian path', () => {
        const vertices = ['A', 'B', 'C', 'D'];
        const adj = {
            'A': ['B'],
            'B': ['A', 'C'],
            'C': ['B', 'D'],
            'D': ['C']
        };
        const result = findHamiltonianPath(vertices, adj);
        expect(result.success).toBe(true);
        expect(result.path).toEqual(['A', 'B', 'C', 'D']);
    });

    it('3. Cycle with Hamiltonian path', () => {
        const vertices = ['A', 'B', 'C'];
        const adj = { 'A': ['B', 'C'], 'B': ['A', 'C'], 'C': ['A', 'B'] };
        const result = findHamiltonianPath(vertices, adj);
        expect(result.success).toBe(true);
        expect(result.path.length).toBe(3);
    });

    it('4. Graph without Hamiltonian path', () => {
        const vertices = ['A', 'B', 'C', 'D'];
        const adj = {
            'A': ['B', 'C', 'D'],
            'B': ['A'],
            'C': ['A'],
            'D': ['A']
        };
        const result = findHamiltonianPath(vertices, adj);
        expect(result.success).toBe(false);
        expect(result.path).toEqual([]);
    });

    it('5. Disconnected graph', () => {
        const vertices = ['A', 'B', 'C', 'D'];
        const adj = {
            'A': ['B'], 'B': ['A'],
            'C': ['D'], 'D': ['C']
        };
        const result = findHamiltonianPath(vertices, adj);
        expect(result.success).toBe(false);
        expect(result.path).toEqual([]);
    });

    it('6. Campus graph', () => {
        const validClaim = ["loc_dept", "loc_lab", "loc_canteen"];
        const res1 = validateNormalRoute(validClaim);
        expect(res1.success).toBe(true);

        const invalidClaim = ["loc_library", "loc_lab", "loc_canteen"];
        const res2 = validateNormalRoute(invalidClaim);
        expect(res2.success).toBe(false);
        expect(res2.conflict).toEqual(["loc_library", "loc_lab"]);
    });

    it('7. Required-location challenge', () => {
        const reqLocations = ["loc_library", "loc_lab", "loc_dept", "loc_canteen"];
        
        expect(isChallengeSolvable(reqLocations)).toBe(true);
        
        const validUserPath = ["loc_library", "loc_dept", "loc_lab", "loc_canteen"];
        const res1 = validateHamiltonianChallenge(reqLocations, validUserPath);
        expect(res1.success).toBe(true);

        const invalidPath1 = ["loc_library", "loc_lab", "loc_dept", "loc_canteen"];
        const res2 = validateHamiltonianChallenge(reqLocations, invalidPath1);
        expect(res2.success).toBe(false);
    });
});
