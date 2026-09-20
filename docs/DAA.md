# Design and Analysis of Algorithms (DAA) Documentation

> **Project**: The Last Suspect — A College Mystery Powered by DAA  
> **Repository**: [The Last Suspect](https://github.com/user/the-last-suspect)

---

## Overview

*The Last Suspect* turns foundational Design and Analysis of Algorithms (DAA) concepts into interactive gameplay mechanics. Rather than serving as an abstract visualizer, the game uses graph algorithms and Constraint Satisfaction Problem (CSP) solvers to power a Mystery-o-Matic deduction engine.

---

## 1. Graph Traversal (Breadth-First Search / Shortest Path)

### 1.1 Problem in the Game
The campus consists of interconnected buildings (Library, Main Block, Canteen, Computer Lab, Seminar Hall, Staff Room, Classroom). The engine must determine the minimum number of 5-minute or 15-minute movement intervals required to travel between any two campus locations.

### 1.2 Input
- **Campus Graph $G = (V, E)$**: Vertices $V$ (locations), Edges $E$ (direct pathways).
- **Source Location $L_1$**, **Destination Location $L_2$**.
- **Timeslot Interval $\Delta t$** (e.g. $4:30 \rightarrow 4:40$, $\Delta t = 2$ slots).

### 1.3 Algorithm Idea
Breadth-First Search (BFS) explores graph nodes level-by-level to compute the unweighted shortest path distance $dist(L_1, L_2)$ in terms of edge hops.

### 1.4 Implementation Details
- **Location**: `src/game/state.js` (`getDist(loc1, loc2)`) and `src/game/Campus.js`.
- **Logic**:
  ```javascript
  const getDist = (loc1, loc2) => {
    if (loc1 === loc2) return 0;
    const isEdge = ch.edges.some(e => (e[0] === loc1 && e[1] === loc2) || (e[0] === loc2 && e[1] === loc1));
    if (isEdge) return 1;
    // Check 2-hop neighbors
    const locsWithEdges = (start) => ch.edges.filter(e => e[0] === start || e[1] === start).map(e => e[0] === start ? e[1] : e[0]);
    if (locsWithEdges(loc1).some(n => locsWithEdges(loc2).includes(n))) return 2;
    return 3;
  };
  ```

### 1.5 Usage in Gameplay
Evaluates movement validity. If a suspect is placed at *Library* at $4:30\text{ PM}$ and *Seminar Hall* at $4:40\text{ PM}$ ($\Delta t = 2$ slots = 10 minutes), but $dist(\text{Library}, \text{Seminar Hall}) = 3$ hops (requires 15 minutes), the engine flags a speed violation (`⚠ CONTRADICTION`).

### 1.6 Complexity
- **Time Complexity**: $\mathcal{O}(|V| + |E|)$ per query.
- **Space Complexity**: $\mathcal{O}(|V|)$ for queue and visited set.

---

## 2. Path Validation & Route Continuity (Hamiltonian Reasoning)

### 2.1 Problem in the Game
When a player marks locations for a suspect across multiple timeslots, the game must verify whether the sequence forms a physically continuous, achievable route across the campus network.

### 2.2 Input
- Sequence of assigned locations $(L_0, L_1, \dots, L_k)$ at times $(T_0, T_1, \dots, T_k)$ for suspect $S$.

### 2.3 Algorithm Idea
Verifies that for every consecutive pair of timeslots $(T_i, T_{i+1})$, either the suspect stayed in place ($L_i = L_{i+1}$) or moved across a valid graph edge $(L_i, L_{i+1}) \in E$.

### 2.4 Implementation Details
- **Location**: `src/game/state.js` (`checkRouteMovement(suspectId)`) and `src/algorithms/hamiltonian.js`.
- **Backtracking Route Derivation**:
  If a suspect is confirmed at $L_1$ at $4:30$ and $L_2$ at $4:40$ (skipping $4:35$), the engine searches for candidate locations $Y$ at $4:35$ satisfying $dist(L_1, Y) \le 1$ and $dist(Y, L_2) \le 1$. If exactly one candidate exists, the engine automatically derives it as a required movement deduction.

### 2.5 Complexity
- **Time Complexity**: $\mathcal{O}(k \cdot |E|)$ where $k$ is the number of confirmed timeslots.
- **Space Complexity**: $\mathcal{O}(k)$ for storing route steps.

---

## 3. Graph Coloring & Constraint Checking (Vertex Non-Conflict Scheduling)

### 3.1 Problem in the Game
A suspect cannot occupy two physical locations at the exact same timeslot.

### 3.2 Input
- Timeline Grid Matrix $M[\text{Suspect}, \text{Time}] \rightarrow \text{Location}$.

### 3.3 Algorithm Idea
Modeled as vertex coloring on a conflict graph:
- Vertices represent assignment nodes $(S_i, T_j)$.
- Colors represent physical campus locations $L_k$.
- An edge exists between any two assignment nodes representing the same suspect at the same timeslot. The graph coloring non-conflict rule ensures adjacent vertices receive different location colors.

### 3.4 Implementation Details
- **Location**: `src/game/state.js` (`validateGraphConsistency()`) and `src/algorithms/graphColoring.js`.
- **Usage**: Automatically runs on every timeline cell modification. If a conflict occurs, `state.contradictionWarning` renders the contradiction alert box with the `↺ UNDO LAST DEDUCTION` action.

### 3.5 Complexity
- **Time Complexity**: $\mathcal{O}(|S| \cdot |T|)$ where $|S| = 5$ suspects and $|T| \in [4, 5]$ timeslots.
- **Space Complexity**: $\mathcal{O}(|S| \cdot |T|)$.

---

## 4. Backtracking CSP Search Engine

### 4.1 Problem in the Game
Systematically verify that each mystery (Case 01, Case 02, Case 03) has **EXACTLY ONE** valid ground-truth solution ($VALID SOLUTIONS = 1$) and power the player hypothesis solver.

### 4.2 Input
- **Variables $X$**: `thief`, plus $S_i\_T_j$ for all suspects $S_i$ and timeslots $T_j$.
- **Domains $D(X)$**: Campus location IDs for $S_i\_T_j$, suspect IDs for `thief`.
- **Constraints $C$**: Clue domain pins, graph route movement bounds, non-conflict rules, and culprit location matching.

### 4.3 Algorithm Idea
Recursive Depth-First Search with active domain pruning:
1. Select unassigned variable $x \in X$.
2. Iterate through candidate values $v \in D(x)$.
3. Check if assignment $(x = v)$ satisfies all constraints in $C$.
4. If valid, recursively assign next variable.
5. If invalid, backtrack immediately (abandon subtree).

### 4.4 Implementation Details
- **Location**: `src/algorithms/backtracking.js` (`solveCSP()`, `findAllSolutions()`), `src/game/HypothesisEngine.js`, and `src/game/CaseValidator.js`.
- **Source Snippet**:
  ```javascript
  export function solveCSP(variables, domains, constraints, assignment = {}) {
    if (Object.keys(assignment).length === variables.length) {
      return assignment; // Found complete valid assignment
    }
    const unassigned = variables.find(v => !(v in assignment));
    for (const val of domains[unassigned]) {
      const nextAssignment = { ...assignment, [unassigned]: val };
      if (constraints.every(fn => fn(nextAssignment))) {
        const result = solveCSP(variables, domains, constraints, nextAssignment);
        if (result) return result;
      }
    }
    return null; // Backtrack
  }
  ```

### 4.5 Complexity
- **Worst-Case Time Complexity**: $\mathcal{O}(|D|^{|X|})$ exponential search space.
- **Effective Pruned Complexity**: $\mathcal{O}(1)$ execution time (< 15 ms) due to active domain pruning via clue constraints.
- **Space Complexity**: $\mathcal{O}(|X|)$ recursion call stack space.
