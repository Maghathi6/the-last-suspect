import { CampusGraph } from './Campus.js';
import { findHamiltonianPath } from '../algorithms/hamiltonian.js';
import { state } from './state.js';

/**
 * Normal Route Validation:
 * Validates if a claimed sequence of consecutive movements is physically possible.
 */
export function validateNormalRoute(routeArray) {
    if (!routeArray || routeArray.length < 2) return { success: true, message: "Route is valid." };

    for (let i = 0; i < routeArray.length - 1; i++) {
        const current = routeArray[i];
        const next = routeArray[i+1];
        const neighbors = CampusGraph[current] || [];
        
        if (!neighbors.includes(next)) {
            const loc1 = state.caseData.locations.find(l => l.id === current)?.name || current;
            const loc2 = state.caseData.locations.find(l => l.id === next)?.name || next;
            return { 
                success: false, 
                message: `There is no direct path between ${loc1} and ${loc2}.`,
                conflict: [current, next]
            };
        }
    }
    return { success: true, message: "Nothing about this route contradicts the campus layout." };
}

/**
 * Hamiltonian Challenge:
 * Validates if the user successfully constructed a path visiting all required locations exactly once.
 */
export function validateHamiltonianChallenge(requiredLocations, userPath) {
    if (!userPath || userPath.length === 0) {
        return { success: false, message: "Please build a route first." };
    }
    
    // 1. Must visit all exactly once
    if (userPath.length !== requiredLocations.length) {
        return { success: false, message: "Route must visit all required locations exactly once." };
    }
    
    for (const loc of requiredLocations) {
        if (!userPath.includes(loc)) {
            return { success: false, message: "Missing a required location in the route." };
        }
    }
    
    const uniqueVisits = new Set(userPath);
    if (uniqueVisits.size !== userPath.length) {
        return { success: false, message: "Locations can only be visited once." };
    }

    // 2. Validate physical continuity
    const normalCheck = validateNormalRoute(userPath);
    if (!normalCheck.success) {
        return normalCheck;
    }

    return { success: true, message: "Challenge complete! A valid continuous route was found." };
}

/**
 * Solve Challenge:
 * Uses the algorithm to silently check if a challenge is solvable.
 */
export function isChallengeSolvable(requiredLocations) {
    const result = findHamiltonianPath(requiredLocations, CampusGraph);
    return result.success;
}
