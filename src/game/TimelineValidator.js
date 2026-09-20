import { solveGraphColoring } from '../algorithms/graphColoring.js';
import { state } from './state.js';

export function validateTimeline() {
    const vertices = [];
    const edges = [];
    const preColors = {};
    
    // Map colors to UI strings and vice versa
    const timeToColor = { "4:30 PM": 0, "4:35 PM": 1, "4:40 PM": 2, "4:45 PM": 3 };
    const colorToTime = { 0: "4:30 PM", 1: "4:35 PM", 2: "4:40 PM", 3: "4:45 PM" };
    
    // 1. Build Events from Discovered Evidence
    const events = {}; 
    state.caseData.evidence.forEach(ev => {
        if (state.discoveredEvidence.has(ev.id)) {
            events[ev.id] = ev.meta;
            vertices.push(ev.id);
        }
    });

    // 2. Extract Timeline Pre-assignments (User Input)
    for (const [time, evIds] of Object.entries(state.timelineAssignments)) {
        const color = timeToColor[time];
        for (const id of evIds) {
            if (events[id]) {
                // Rule 3: Fixed Evidence Constraint
                if (events[id].fixedTime && events[id].fixedTime !== time) {
                     return { 
                         success: false, 
                         message: `Evidence explicitly confirms this event occurred at ${events[id].fixedTime}, not ${time}.` 
                     };
                }
                preColors[id] = color;
            }
        }
    }

    // Include Detective Board timeline connections
    state.connections.forEach(conn => {
        let evId = null;
        let timeStr = null;
        if (events[conn.id1] && timeToColor[conn.id2] !== undefined) { evId = conn.id1; timeStr = conn.id2; }
        if (events[conn.id2] && timeToColor[conn.id1] !== undefined) { evId = conn.id2; timeStr = conn.id1; }
        if (evId && timeStr) {
            preColors[evId] = timeToColor[timeStr];
        }
    });

    // 3. Build Conflict Edges (Rules 1 & 2)
    for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
            const e1 = events[vertices[i]];
            const e2 = events[vertices[j]];
            
            // Safety check in case metadata is missing
            if (!e1 || !e2) continue;
            
            // Rule 1: The same person cannot be in two different locations simultaneously.
            if (e1.person && e2.person && e1.person === e2.person) {
                if (e1.location && e2.location && e1.location !== e2.location) {
                    edges.push([vertices[i], vertices[j]]);
                }
            }

            // Rule 2: (Extensible) The same unique object cannot be in two different events simultaneously.
            if (e1.object && e2.object && e1.object === e2.object) {
                if (e1.location !== e2.location || e1.person !== e2.person) {
                    edges.push([vertices[i], vertices[j]]);
                }
            }
        }
    }

    // 4. Run the Algorithm
    const m = 4; // 4 available time slots
    const result = solveGraphColoring(vertices, edges, m, preColors);

    // 5. Interpret the Results for the Game UI
    if (result.success) {
        return { 
            success: true, 
            message: "All known events can coexist within the current timeline." 
        };
    } else {
        if (result.conflict && result.conflict.length === 2) {
            const id1 = result.conflict[0];
            const id2 = result.conflict[1];
            const e1 = events[id1];
            const e2 = events[id2];
            
            const personName = state.caseData.suspects.find(s => s.id === e1.person)?.name || e1.person || "Someone";
            const loc1 = state.caseData.locations.find(l => l.id === e1.location)?.name || e1.location || "Location A";
            const loc2 = state.caseData.locations.find(l => l.id === e2.location)?.name || e2.location || "Location B";
            
            // It's a direct user assignment conflict
            if (preColors[id1] !== undefined && preColors[id1] === preColors[id2]) {
                const timeStr = colorToTime[preColors[id1]];
                return {
                    success: false, 
                    message: `${personName} cannot be in ${loc1} and ${loc2} at the same time (${timeStr}).`
                };
            }
        }
        
        return { 
            success: false, 
            message: "The current assignments create an impossible chain of events requiring more time slots than available." 
        };
    }
}
