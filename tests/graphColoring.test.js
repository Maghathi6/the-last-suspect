import { describe, it, expect } from 'vitest';
import { solveGraphColoring } from '../src/algorithms/graphColoring.js';

describe('Graph Coloring Algorithm', () => {
    it('1. Empty graph', () => {
        const vertices = [];
        const edges = [];
        const m = 3;
        const result = solveGraphColoring(vertices, edges, m);
        expect(result.success).toBe(true);
        expect(result.colorCount).toBe(0);
    });

    it('2. Single vertex', () => {
        const vertices = ['A'];
        const edges = [];
        const m = 1;
        const result = solveGraphColoring(vertices, edges, m);
        expect(result.success).toBe(true);
        expect(result.colors['A']).toBe(0);
    });

    it('3. Graph with no edges', () => {
        const vertices = ['A', 'B', 'C'];
        const edges = [];
        const m = 2;
        const result = solveGraphColoring(vertices, edges, m);
        expect(result.success).toBe(true);
        expect(result.colorCount).toBe(1);
    });

    it('4. Two connected vertices', () => {
        const vertices = ['A', 'B'];
        const edges = [['A', 'B']];
        const m = 2;
        const result = solveGraphColoring(vertices, edges, m);
        expect(result.success).toBe(true);
        expect(result.colors['A']).not.toBe(result.colors['B']);
    });

    it('5. Triangle requiring 3 colors', () => {
        const vertices = ['A', 'B', 'C'];
        const edges = [['A', 'B'], ['B', 'C'], ['C', 'A']];
        
        const resultFails2 = solveGraphColoring(vertices, edges, 2);
        expect(resultFails2.success).toBe(false);

        const resultPasses3 = solveGraphColoring(vertices, edges, 3);
        expect(resultPasses3.success).toBe(true);
        expect(resultPasses3.colorCount).toBe(3);
    });

    it('6. Graph that cannot be colored with the given number of colors', () => {
        const vertices = ['A', 'B', 'C', 'D'];
        // Complete graph K4 requires 4 colors
        const edges = [
            ['A', 'B'], ['A', 'C'], ['A', 'D'],
            ['B', 'C'], ['B', 'D'], ['C', 'D']
        ];
        const m = 3;
        const result = solveGraphColoring(vertices, edges, m);
        expect(result.success).toBe(false);
    });

    it('7. Valid timeline graph', () => {
        const vertices = ['ev1', 'ev2', 'ev3'];
        const edges = [['ev1', 'ev2']];
        const m = 4;
        const preColors = { 'ev1': 0, 'ev2': 1 };
        const result = solveGraphColoring(vertices, edges, m, preColors);
        expect(result.success).toBe(true);
    });

    it('8. Invalid timeline graph', () => {
        const vertices = ['ev1', 'ev2'];
        const edges = [['ev1', 'ev2']];
        const m = 4;
        const preColors = { 'ev1': 1, 'ev2': 1 };
        const result = solveGraphColoring(vertices, edges, m, preColors);
        expect(result.success).toBe(false);
        expect(result.conflict).toEqual(['ev1', 'ev2']);
    });

    it('9. Fixed-time conflict', () => {
        const vertices = ['ev1', 'ev2', 'ev3'];
        const edges = [['ev1', 'ev2'], ['ev2', 'ev3']];
        const preColors = { 'ev1': 2, 'ev2': 2 };
        const m = 4;
        const result = solveGraphColoring(vertices, edges, m, preColors);
        expect(result.success).toBe(false);
        expect(result.conflict).toBeDefined();
    });
});
