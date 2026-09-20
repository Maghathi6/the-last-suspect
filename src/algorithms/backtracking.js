/**
 * backtracking.js
 * 
 * Pure JavaScript generic Backtracking Search engine for Constraint Satisfaction Problems (CSP).
 * 
 * Purpose: Finds solutions to a set of variables given domains and constraints.
 * Allows partial assignments to test if a theory can be completed.
 */

/**
 * Finds up to `limit` solutions for the CSP.
 * 
 * @param {Array<string>} variables - List of variable names
 * @param {Object} domains - Mapping of variable names to arrays of possible values
 * @param {Array<Function>} constraints - Functions that take an assignment and return false if a constraint is violated
 * @param {Object} partialAssignment - Pre-assigned variables
 * @param {number} limit - Max solutions to find
 * @returns {Array<Object>} List of valid complete assignments
 */
export function findAllSolutions(variables, domains, constraints, partialAssignment = {}, limit = 100) {
    const solutions = [];
    
    function backtrack(assignment) {
        if (solutions.length >= limit) return;
        
        // Find the first unassigned variable
        const unassigned = variables.find(v => !(v in assignment));
        
        // If all variables are assigned, we have a valid solution
        if (!unassigned) {
            solutions.push({ ...assignment });
            return;
        }
        
        // Try each possible value in the variable's domain
        for (const value of domains[unassigned]) {
            assignment[unassigned] = value;
            
            // Check if this assignment breaks any constraints
            let isValid = true;
            for (const constraint of constraints) {
                if (constraint(assignment) === false) {
                    isValid = false;
                    break;
                }
            }
            
            // If still valid, recursively assign the next variable
            if (isValid) {
                backtrack(assignment);
            }
            
            // Undo the assignment (backtrack)
            delete assignment[unassigned];
        }
    }
    
    // Start backtracking with the partial assignment provided
    backtrack({ ...partialAssignment });
    return solutions;
}

/**
 * Convenience wrapper to find exactly one solution.
 */
export function solveCSP(variables, domains, constraints, partialAssignment = {}) {
    const solutions = findAllSolutions(variables, domains, constraints, partialAssignment, 1);
    return solutions.length > 0 ? solutions[0] : null;
}
