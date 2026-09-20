/**
 * hamiltonian.js
 * 
 * Pure JavaScript implementation of the Hamiltonian Path algorithm using backtracking.
 * 
 * Purpose: Finds a path that visits a given set of vertices exactly once, 
 * constrained by the provided adjacency list (graph).
 */

export function findHamiltonianPath(vertices, adjList, startVertex = null) {
    if (!vertices || vertices.length === 0) {
        return { success: false, path: [] };
    }

    const path = [];
    const visited = new Set();
    
    // Backtracking function
    function backtrack(current) {
        path.push(current);
        visited.add(current);
        
        // Base case: if we have visited all required vertices exactly once
        if (path.length === vertices.length) {
            return true;
        }
        
        // Get valid neighbors from the graph
        const neighbors = adjList[current] || [];
        
        for (const neighbor of neighbors) {
            // We only traverse to neighbors that are part of the requested vertices
            // and haven't been visited yet in the current path
            if (vertices.includes(neighbor) && !visited.has(neighbor)) {
                if (backtrack(neighbor)) {
                    return true;
                }
            }
        }
        
        // Backtrack if no valid path found from this point
        path.pop();
        visited.delete(current);
        return false;
    }

    // If a specific start vertex is provided
    if (startVertex) {
        if (vertices.includes(startVertex) && backtrack(startVertex)) {
            return { success: true, path: [...path] };
        }
    } else {
        // Try starting from every vertex
        for (const v of vertices) {
            if (backtrack(v)) {
                return { success: true, path: [...path] };
            }
        }
    }
    
    return { success: false, path: [] };
}
