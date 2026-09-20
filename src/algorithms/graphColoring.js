/**
 * graphColoring.js
 * 
 * Pure JavaScript implementation of the Backtracking m-Coloring algorithm.
 * 
 * Purpose: Determines if a graph can be colored with at most `m` colors such that
 * no two adjacent vertices share the same color. Supports pre-colored vertices.
 * 
 * In The Last Suspect, colors map to Time Slots (e.g., 4:30 PM, 4:35 PM),
 * and vertices map to Events (Evidence). An edge means two events cannot happen
 * at the same time.
 */

export function solveGraphColoring(vertices, edges, m, preColors = {}) {
    // 1. Build Adjacency List
    const adj = new Map();
    for (const v of vertices) {
        adj.set(v, []);
    }
    for (const [u, v] of edges) {
        if (adj.has(u) && adj.has(v)) {
            adj.get(u).push(v);
            adj.get(v).push(u);
        }
    }

    // 2. Initial Validation of Pre-colored vertices
    // If the user's fixed assignments inherently violate an edge constraint, fail early.
    for (const [u, v] of edges) {
        if (preColors[u] !== undefined && preColors[v] !== undefined) {
            if (preColors[u] === preColors[v]) {
                return { success: false, conflict: [u, v] };
            }
        }
    }

    // Track current color assignments
    const colors = { ...preColors };

    // Helper: Check whether it is safe to assign `color` to `vertex`
    function isSafe(vertex, color) {
        const neighbors = adj.get(vertex) || [];
        for (const neighbor of neighbors) {
            if (colors[neighbor] === color) {
                return false;
            }
        }
        return true;
    }

    // 3. Recursive Backtracking Step
    function backtrack(index) {
        // Base case: If all vertices are colored, we found a valid assignment
        if (index === vertices.length) {
            return true;
        }

        const vertex = vertices[index];

        // If the vertex is already pre-colored (e.g., user pinned it to a timeline slot),
        // we skip assigning it a new color and move to the next vertex.
        if (preColors[vertex] !== undefined) {
            return backtrack(index + 1);
        }

        // Try assigning each available color (0 to m-1)
        for (let c = 0; c < m; c++) {
            if (isSafe(vertex, c)) {
                // Make the assignment
                colors[vertex] = c;

                // Recursively try to color the rest of the graph
                if (backtrack(index + 1)) {
                    return true;
                }

                // If assigning this color didn't lead to a solution,
                // undo the assignment (backtrack) and try the next color.
                delete colors[vertex];
            }
        }

        // If no color can be assigned to this vertex that leads to a full solution, backtrack up.
        return false; 
    }

    // Start backtracking from the first vertex
    if (backtrack(0)) {
        // Calculate the actual number of unique colors used (often <= m)
        const uniqueColors = new Set(Object.values(colors));
        return { 
            success: true, 
            colors: colors, 
            colorCount: uniqueColors.size 
        };
    } else {
        // Graph requires more than `m` colors, or is impossible given preColors
        return { success: false, conflict: ['uncolorable'] };
    }
}
