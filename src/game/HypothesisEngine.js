import { findAllSolutions, solveCSP } from '../algorithms/backtracking.js';
import { CampusGraph } from './Campus.js';
import { state } from './state.js';

/**
 * HypothesisEngine.js
 * 
 * Converts Case 01 into a Constraint Satisfaction Problem (CSP)
 * and uses the generic backtracking solver to validate player theories.
 *
 * Variables: Each suspect gets a location variable per time slot.
 *   e.g. "sus_arun_0" = where was Arun at time index 0 (4:30 PM)?
 *   Plus a single "thief" variable = who took the samosa?
 *
 * Domains: All campus location IDs (for location vars) or all suspect IDs (for thief).
 *   Evidence narrows domains before search begins (domain pruning).
 *
 * Constraints: Functions that reject invalid partial assignments.
 */

const TIME_LABELS = ["4:30 PM", "4:35 PM", "4:40 PM", "4:45 PM"];
const TIME_INDEX  = { "4:30 PM": 0, "4:35 PM": 1, "4:40 PM": 2, "4:45 PM": 3 };

/**
 * Build the CSP model from the current case data.
 * @param {boolean} assumeAllEvidence - If true, apply all evidence constraints (for case validation).
 */
function buildCSP(assumeAllEvidence = false) {
    const suspects  = state.caseData.suspects;
    const locations = state.caseData.locations;
    const locIds    = locations.map(l => l.id);
    const susIds    = suspects.map(s => s.id);

    // --- Variables ---
    const variables = ['thief'];
    const domains   = { 'thief': [...susIds] };

    for (const s of suspects) {
        for (let t = 0; t < 4; t++) {
            const v = `${s.id}_${t}`;
            variables.push(v);
            domains[v] = [...locIds]; // copy so pruning is independent
        }
    }

    // --- Domain pruning from evidence (reduces search space drastically) ---
    const has = (id) => assumeAllEvidence || state.discoveredEvidence.has(id);

    // Helper: pin a variable to a single value
    const pin = (varName, value) => {
        if (domains[varName]) domains[varName] = [value];
    };

    // Evidence: Library Photo — Arun was at Library at 4:30 PM
    if (has('ev_lib_photo'))    pin('sus_arun_0', 'loc_library');

    // Evidence: CCTV — Rahul was at Canteen the whole time (sleeping)
    if (has('ev_cctv')) {
        pin('sus_rahul_0', 'loc_canteen');
        pin('sus_rahul_1', 'loc_canteen');
        pin('sus_rahul_2', 'loc_canteen');
        pin('sus_rahul_3', 'loc_canteen');
        // Rahul was asleep, so he can't be the thief
        domains['thief'] = domains['thief'].filter(id => id !== 'sus_rahul');
    }

    // Evidence: Witness Statement — Priya was at Canteen at 4:40 PM
    if (has('ev_statement'))    pin('sus_priya_2', 'loc_canteen');

    // Evidence: Student Message — Priya was at Playground at 4:45 PM
    if (has('ev_message'))      pin('sus_priya_3', 'loc_playground');

    // Evidence: Seminar Log — Arun at Seminar Hall at 4:40, Playground at 4:45
    if (has('ev_arun_seminar')) {
        pin('sus_arun_2', 'loc_seminar');
        pin('sus_arun_3', 'loc_playground');
    }

    // Evidence: Faculty Note — Priya at Department Block at 4:30
    if (has('ev_priya_dept'))   pin('sus_priya_0', 'loc_dept');

    // Evidence: Hostel Register — Meena at Hostel at 4:30, Canteen at 4:45
    if (has('ev_meena_hostel')) {
        pin('sus_meena_0', 'loc_hostel');
        pin('sus_meena_3', 'loc_canteen');
    }

    // Evidence: Lab PC History — Karthik at Lab at 4:30 and 4:40, Dept at 4:45
    if (has('ev_karthik_lab')) {
        pin('sus_karthik_0', 'loc_lab');
        pin('sus_karthik_2', 'loc_lab');
        pin('sus_karthik_3', 'loc_dept');
    }

    // Evidence: Karthik's Order Slip — Karthik at Canteen at 4:35
    if (has('ev_karthik_canteen')) pin('sus_karthik_1', 'loc_canteen');

    // Evidence: Meena's Selfie — Meena at Playground at 4:35, Canteen at 4:40
    if (has('ev_meena_playground')) {
        pin('sus_meena_1', 'loc_playground');
        pin('sus_meena_2', 'loc_canteen');
    }

    // Evidence: Security Footage — Arun at Main Block at 4:35
    if (has('ev_arun_main'))   pin('sus_arun_1', 'loc_main');

    // Evidence: Lab Sign-in Sheet — Priya at Lab at 4:35
    if (has('ev_priya_lab'))   pin('sus_priya_1', 'loc_lab');

    // --- Constraints ---
    const constraints = [];

    // Constraint 1: Route continuity — consecutive time slots must be adjacent or same location
    constraints.push((assignment) => {
        for (const s of suspects) {
            for (let t = 0; t < 3; t++) {
                const loc1 = assignment[`${s.id}_${t}`];
                const loc2 = assignment[`${s.id}_${t + 1}`];
                if (loc1 && loc2 && loc1 !== loc2) {
                    if (!(CampusGraph[loc1] || []).includes(loc2)) {
                        return false;
                    }
                }
            }
        }
        return true;
    });

    // Constraint 2: The thief must be at the Canteen at time index 1 (4:35 PM)
    //   because the receipt proves the samosa was bought/taken at 4:35 PM.
    constraints.push((assignment) => {
        const thief = assignment['thief'];
        if (thief) {
            const loc = assignment[`${thief}_1`];
            if (loc && loc !== 'loc_canteen') return false;
        }
        return true;
    });

    return { variables, domains, constraints };
}

/**
 * Test the player's current hypothesis.
 * Reads from state.hypothesis, state.timelineAssignments, and state.connections.
 * Returns a structured result without revealing the full solution.
 */
export function testHypothesis() {
    const partial = {};

    // 1. Read hypothesis form fields
    const h = state.hypothesis;
    if (h.person && h.time) {
        const tIdx = TIME_INDEX[h.time];
        if (tIdx !== undefined) {
            if (h.location) partial[`${h.person}_${tIdx}`] = h.location;
        }
    }
    if (h.person && h.object === 'samosa') {
        partial['thief'] = h.person;
    }

    // 2. Read timeline assignments
    for (const [time, evIds] of Object.entries(state.timelineAssignments)) {
        const tIdx = TIME_INDEX[time];
        if (tIdx === undefined) continue;
        for (const id of evIds) {
            const ev = state.caseData.evidence.find(e => e.id === id);
            if (ev?.meta?.person && ev?.meta?.location) {
                const varName = `${ev.meta.person}_${tIdx}`;
                if (partial[varName] && partial[varName] !== ev.meta.location) {
                    return {
                        success: false,
                        status: 'impossible',
                        message: "Your timeline places the same person in two different locations at the same time."
                    };
                }
                partial[varName] = ev.meta.location;
            }
        }
    }

    // 3. Read detective board connections (person→location pairs with time)
    state.connections.forEach(conn => {
        const susIds = state.caseData.suspects.map(s => s.id);
        const locIds = state.caseData.locations.map(l => l.id);

        let p = null, l = null;
        if (susIds.includes(conn.id1) && locIds.includes(conn.id2)) { p = conn.id1; l = conn.id2; }
        if (susIds.includes(conn.id2) && locIds.includes(conn.id1)) { p = conn.id2; l = conn.id1; }

        if (p && l) {
            // Check if this location is connected to a time via another connection
            for (const c2 of state.connections) {
                let timeStr = null;
                if (c2.id1 === l && TIME_INDEX[c2.id2] !== undefined) timeStr = c2.id2;
                if (c2.id2 === l && TIME_INDEX[c2.id1] !== undefined) timeStr = c2.id1;
                if (timeStr) {
                    const tIdx = TIME_INDEX[timeStr];
                    partial[`${p}_${tIdx}`] = l;
                }
            }
        }
    });

    // 4. Build CSP and search
    const csp = buildCSP(false);

    // Apply partial assignments: override domains to single value
    for (const [varName, value] of Object.entries(partial)) {
        if (csp.domains[varName]) {
            // Check for immediate conflict: partial value not in domain
            if (!csp.domains[varName].includes(value)) {
                return {
                    success: false,
                    status: 'impossible',
                    message: `This theory directly contradicts discovered evidence.`
                };
            }
            csp.domains[varName] = [value];
        }
    }

    const solutions = findAllSolutions(csp.variables, csp.domains, csp.constraints, {}, 2);

    if (solutions.length === 0) {
        return {
            success: false,
            status: 'impossible',
            message: "✗ This theory cannot be correct. It creates an impossible chain of events given the known evidence and physical routes."
        };
    }

    // Check if the player's hypothesis is fully specified
    const isComplete = h.person && h.location && h.time && h.object;
    if (isComplete && solutions.length === 1) {
        return {
            success: true,
            status: 'valid',
            message: "✓ This explanation satisfies all currently known constraints."
        };
    }

    return {
        success: true,
        status: 'possible',
        message: "✓ This theory is still possible. There are compatible explanations remaining."
    };
}

/**
 * For Case Validator: run the full CSP with all evidence assumed.
 */
export function findCaseSolutions(limit = 2) {
    const csp = buildCSP(true);
    return findAllSolutions(csp.variables, csp.domains, csp.constraints, {}, limit);
}
