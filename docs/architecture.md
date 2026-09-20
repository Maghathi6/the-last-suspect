# System Architecture & Technical Design

> **Project**: The Last Suspect — A College Mystery Powered by DAA

---

## 1. High-Level Architecture Diagram

```
+-------------------------------------------------------------+
|                         PLAYER UI                           |
|  (App.js, screens.js, screens2.js, CaseJournal.js, Sidebar)  |
+------------------------------+------------------------------+
                               | Events / Triggers
                               v
+-------------------------------------------------------------+
|                     GAME STATE MANAGER                      |
|                  (src/game/state.js)                        |
|  - Tracks timeline grid, deductions, score, and progress    |
|  - Manages localStorage persistence per challenge           |
+------+-----------------------+-----------------------+------+
       |                       |                       |
       v                       v                       v
+--------------+       +---------------+       +---------------+
|  CASE DATA   |       | DEDUCTION &   |       |  MOVEMENT &   |
| (challenges) |       |  CLUE ENGINE  |       | ROUTE ENGINE  |
+--------------+       +---------------+       +---------------+
       |                       |                       |
       +-----------------------+-----------------------+
                               |
                               v
+-------------------------------------------------------------+
|                    DAA ALGORITHM MODULES                    |
|  - Graph Traversal (Campus.js, BFS shortest path)            |
|  - Path Validation (hamiltonian.js route checker)           |
|  - Graph Coloring (graphColoring.js non-conflict verifier)  |
|  - Backtracking CSP (backtracking.js, CaseValidator.js)    |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                     VALIDATED SOLUTION                      |
|   (Case Resolution, Sleuth Score, Algorithmic Breakdown)    |
+-------------------------------------------------------------+
```

---

## 2. Decoupled Case Data vs. Reusable Engine

A core architectural principle of *The Last Suspect* is the strict separation of **Case Data** from the **Reusable Gameplay & Deduction Engine**.

```
src/
├── algorithms/           # Pure, DOM-independent DAA algorithms
│   ├── backtracking.js   # Generic CSP solver (solveCSP, findAllSolutions)
│   ├── graphColoring.js  # Vertex coloring conflict verifier
│   ├── hamiltonian.js    # Graph route path validator
│   └── benchmark.js      # Performance benchmark runner
│
├── cases/                # Pure JSON/JS data definitions for mysteries
│   ├── case01.js         # Case 01 entity definitions
│   └── challenges.js     # Challenge 01, Challenge 02, Challenge 03 specs
│
├── game/                 # Core reusable game engine & logic
│   ├── Campus.js         # Graph representation and BFS shortest path
│   ├── CaseValidator.js  # Automated CSP uniqueness validator
│   ├── HypothesisEngine.js # Constraint solver model builder
│   └── state.js          # Central Reactive State Manager & localStorage
│
├── ui/                   # Vanilla JS UI rendering layer
│   ├── App.js            # Main application shell & top header bar
│   ├── screens.js        # Main menu, Case Select, Case Intro, Campus map
│   ├── screens2.js       # Timeline board, Accusation, Resolution, DAA View
│   ├── CaseJournal.js    # Notebook-style journal view
│   ├── Sidebar.js        # Left navigation sidebar
│   ├── InfoPanel.js      # Right Sleuth-o-Meter & log panel
│   └── DetectiveBoard.js # Interactive pinboard canvas
│
└── styles/               # CSS variables and component styling
```

---

## 3. Core Engine Components

### 3.1 State Manager (`src/game/state.js`)
Acts as a single source of truth. Features a subscription pattern (`subscribe(fn)` / `notify()`) that automatically saves game state to `localStorage` under isolated keys (`lastSuspect_case01`, `lastSuspect_case02`, `lastSuspect_case03`) and re-renders the UI seamlessly.

### 3.2 Movement Engine (`checkRouteMovement(suspectId)`)
Consumes the active challenge's graph edges and timeslots. Computes all-pairs shortest distances via unweighted BFS traversal (`getDist(loc1, loc2)`). Detects intermediate missing locations and derives backtracking route steps.

### 3.3 Graph Consistency Engine (`validateGraphConsistency()`)
Executes vertex coloring non-conflict checks over the timeline matrix. Ensures no suspect occupies two locations simultaneously and flags impossible movement speeds.

### 3.4 Automated CSP Case Validator (`src/game/CaseValidator.js`)
Executes the backtracking CSP algorithm over all challenge definitions to programmatically guarantee that every case possesses **EXACTLY ONE** valid ground-truth solution ($VALID SOLUTIONS = 1$).
