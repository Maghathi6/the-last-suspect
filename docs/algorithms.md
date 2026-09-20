# DAA Algorithm Engine Documentation

This document provides academic documentation for the Design and Analysis of Algorithms (DAA) engine powering *"The Last Suspect"*.

---

## 1. DAA → Gameplay Mapping Pipeline

```
Player Evidence Discovery
          ↓
  Partial Hypothesis
          ↓
  Backtracking CSP Search Engine (backtracking.js)
        /          \
       ↓            ↓
Timeline Validation   Route Validation
 (graphColoring.js)   (hamiltonian.js)
       \            /
        ↓          ↓
     Valid / Invalid Case Theory
```

### How DAA Concepts Map to Game Mechanics

| DAA Algorithm | Game Mechanic | Practical Function |
|---|---|---|
| **Graph Coloring ($m$-coloring)** | Timeline Constraint Validation | Ensures events assigned to time slots do not conflict (same person in 2 places at once). |
| **Hamiltonian Path** | Investigation Route Challenge | Validates if a claimed or required campus route visits a set of locations continuously without repeats. |
| **Backtracking (CSP Search)** | Hypothesis & Reasoning Engine | Searches all possible suspect assignments and prunes dead ends as soon as constraints are violated. |

---

## 2. Algorithm 1: Graph Coloring (Backtracking $m$-Coloring)

### Problem Definition
Given an undirected graph $G = (V, E)$ and an integer $m$, determine if the vertices can be colored using at most $m$ colors such that no two adjacent vertices share the same color.

### Game Mapping & Input Representation
- **Vertices ($V$)**: Discrete evidence items or suspect location claims.
- **Edges ($E$)**: Mutually exclusive constraints (e.g., same suspect in different locations).
- **Colors ($m$)**: Available time slots ($m = 4$: 4:30 PM, 4:35 PM, 4:40 PM, 4:45 PM).
- **Pre-colors**: Fixed evidence timestamps pinned by the player.

### Pseudocode
```text
ALGORITHM GraphColoring(vertices, edges, m, preColors)
    adj ← BuildAdjacencyList(vertices, edges)
    colors ← Copy(preColors)

    FUNCTION Backtrack(index)
        IF index = length(vertices) THEN
            RETURN true   // Complete valid assignment found

        v ← vertices[index]
        IF v in preColors THEN
            RETURN Backtrack(index + 1)

        FOR c ← 0 TO m - 1 DO
            IF IsSafe(v, c, adj, colors) THEN
                colors[v] ← c
                IF Backtrack(index + 1) THEN
                    RETURN true
                REMOVE colors[v]   // Backtrack
            END IF
        END FOR

        RETURN false
    END FUNCTION

    RETURN Backtrack(0)
END ALGORITHM
```

### Complexity Analysis
- **Time Complexity**: $\mathcal{O}(m^{|V|})$ in the worst case. The search tree has depth $|V|$ and branching factor $m$.
- **Space Complexity**: $\mathcal{O}(|V|)$ for the recursion call stack and color map.
- **NP-Completeness Note**: General $m$-coloring for $m \ge 3$ is NP-complete. The game keeps $|V| \le 14$ and $m = 4$, making execution instantaneous ($< 2\text{ms}$).

### Case 01 Example
- **Vertices**: `ev_arun_main` (Arun at Main Block), `ev_arun_seminar` (Arun at Seminar Hall).
- **Edge**: `(ev_arun_main, ev_arun_seminar)` because both represent Arun at different places.
- **Coloring**: `ev_arun_main` = 4:35 PM (Color 1), `ev_arun_seminar` = 4:40 PM (Color 2). Valid because colors differ.

---

## 3. Algorithm 2: Hamiltonian Path Search

### Problem Definition
Given a graph $G = (V, E)$, find a simple path that visits every vertex in a given target set $V_{req} \subseteq V$ exactly once.

### Game Mapping & Input Representation
- **Vertices ($V$)**: Campus locations (e.g., Canteen, Library, Computer Lab).
- **Edges ($E$)**: Physical walkways connecting campus locations.
- **Target Subsets**: Investigation route challenges requiring visits to specific locations.

### Pseudocode
```text
ALGORITHM FindHamiltonianPath(vertices, adjList, startVertex)
    path ← []
    visited ← Set()

    FUNCTION Backtrack(current)
        Push current to path
        Add current to visited

        IF length(path) = length(vertices) THEN
            RETURN true   // All required vertices visited once

        FOR EACH neighbor IN adjList[current] DO
            IF neighbor IN vertices AND neighbor NOT IN visited THEN
                IF Backtrack(neighbor) THEN
                    RETURN true
                END IF
            END IF
        END FOR

        Pop last from path   // Backtrack
        Remove current from visited
        RETURN false
    END FUNCTION

    IF startVertex IS PROVIDED THEN
        IF Backtrack(startVertex) THEN RETURN path
    ELSE
        FOR EACH v IN vertices DO
            IF Backtrack(v) THEN RETURN path
        END FOR
    END IF

    RETURN failure
END ALGORITHM
```

### Complexity Analysis
- **Time Complexity**: $\mathcal{O}(|V|!)$ in the worst case pure backtracking approach.
- **Space Complexity**: $\mathcal{O}(|V|)$ for path storage and recursion stack.
- **NP-Completeness Note**: Hamiltonian Path is NP-complete. The game bounds the campus graph to $|V| = 9$ and target challenges to 4 locations.

### Case 01 Example
- **Challenge Requirement**: Visit Library, Lab, Dept Block, Canteen.
- **Valid Hamiltonian Route**: Library $\to$ Dept Block $\to$ Lab $\to$ Canteen.

---

## 4. Algorithm 3: Generic Backtracking CSP Search Engine

### Problem Definition
Given a set of variables $X = \{x_1, x_2, \dots, x_n\}$, domain mappings $D(x_i)$, and boolean constraints $C = \{c_1, c_2, \dots, c_k\}$, find assignments that satisfy all constraints.

### Pseudocode
```text
ALGORITHM SolveCSP(variables, domains, constraints, partialAssignment, limit)
    solutions ← []

    FUNCTION Backtrack(assignment)
        IF length(solutions) ≥ limit THEN RETURN

        unassigned ← FindFirstUnassigned(variables, assignment)
        IF unassigned IS NULL THEN
            Add assignment to solutions
            RETURN
        END IF

        FOR EACH value IN domains[unassigned] DO
            assignment[unassigned] ← value

            // Prune branch immediately if any constraint fails
            IF SatisfiesAllConstraints(assignment, constraints) THEN
                Backtrack(assignment)
            END IF

            DELETE assignment[unassigned]   // Backtrack
        END FOR
    END FUNCTION

    Backtrack(partialAssignment)
    RETURN solutions
END ALGORITHM
```

### Complexity Analysis
- **Time Complexity**: $\mathcal{O}(d^n)$ worst case ($d = \max |D_i|$, $n = |X|$). Without domain pruning: $9^{21} \approx 1.09 \times 10^{20}$ candidates. With evidence-based domain pruning, effective search requires $< 500$ node evaluations.
- **Space Complexity**: $\mathcal{O}(n)$ stack depth.

---

## 5. API Reference

### `solveGraphColoring(vertices, edges, m, preColors)`
- **Inputs**: `vertices: Array<string>`, `edges: Array<[string, string]>`, `m: number`, `preColors: Record<string, number>`
- **Returns**: `{ success: boolean, colors?: Record<string, number>, colorCount?: number, conflict?: Array<string> }`

### `findHamiltonianPath(vertices, adjList, startVertex)`
- **Inputs**: `vertices: Array<string>`, `adjList: Record<string, Array<string>>`, `startVertex?: string`
- **Returns**: `{ success: boolean, path: Array<string> }`

### `findAllSolutions(variables, domains, constraints, partialAssignment, limit)`
- **Inputs**: `variables: Array<string>`, `domains: Record<string, Array<any>>`, `constraints: Array<Function>`, `partialAssignment?: Record<string, any>`, `limit?: number`
- **Returns**: `Array<Record<string, any>>`
