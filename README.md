# The Last Suspect

A College Mystery Powered by DAA

> *"The Last Suspect is a browser-based DAA game that turns graph traversal, constraint checking and backtracking into the mechanics of a college mystery."*

---

## Live Demo

https://maghathi6.github.io/the-last-suspect/

## GitHub Repository

https://github.com/Maghathi6/the-last-suspect

---

## Overview

**The Last Suspect** is a browser-based deduction mystery game where players investigate three college incidents by combining clues, timeline matrix grids, campus movement graphs, and logical elimination.

Rather than presenting algorithms as abstract visualizers, the game integrates **Design and Analysis of Algorithms (DAA)** concepts—including **Graph Traversal (BFS)**, **Path Validation (Hamiltonian route checking)**, **Graph Coloring (vertex non-conflict scheduling)**, and **Backtracking CSP (Constraint Satisfaction Problems)**—directly into the deduction mechanics.

---

## Gameplay Flow

```
Case Selection ──> Case Briefing ──> Timeline Board Grid (Hero Tool)
                                             │
      ┌──────────────────────────────────────┴──────────────────────────────────────┐
      ▼                                      ▼                                      ▼
Read Clues & Deduce                  Inspect Campus Map                  Check Suspect Profiles
      │                                      │                                      │
      └──────────────────────────────────────┬──────────────────────────────────────┘
                                             ▼
                                 Apply Deduction Options
                                             │
                                             ▼
                                  Route & Movement Validation
                                             │
                                             ▼
                                  Process of Elimination
                                             │
                                             ▼
                                     Final Accusation
                                             │
                                             ▼
                             Case Resolution & DAA Breakdown
```

---

## Playable Mysteries

### Case 01 — The Last Samosa
- **Difficulty**: ★☆☆ Easy
- **Premise**: At 4:30 PM, exactly one samosa remained in the canteen. At 4:45 PM, it was gone. Five students were somewhere around campus.
- **Goal**: Deduce who took the samosa while Rahul slept in the canteen corner.

### Case 02 — The Missing Attendance Register
- **Difficulty**: ★★☆ Medium
- **Premise**: The department's physical attendance register disappeared from the Department Block between 10:00 AM and 10:45 AM and was returned with altered pages.
- **Goal**: Track movements across 15-minute intervals to identify who took the register to the Staff Room.

### Case 03 — The Projector Incident
- **Difficulty**: ★★★ Hard
- **Premise**: Five minutes before a major presentation at 3:00 PM, the classroom projector power was cut and its remote disappeared.
- **Goal**: Deduce who unplugged the projector at 2:30 PM and stashed the remote in Seminar Hall.

---

## DAA Concepts Used

### 1. Graph Traversal (Breadth-First Search / Shortest Path)
Represents the campus network as an unweighted graph $G = (V, E)$ where vertices are locations and edges are connecting pathways. Calculates minimum travel hops to enforce speed and time limits.

### 2. Path Validation & Route Continuity (Hamiltonian Reasoning)
Verifies whether a suspect's claimed movement sequence forms a continuous physical path across adjacent campus graph nodes. Automatically derives intermediate locations via backtracking route search.

### 3. Graph Coloring & Constraint Checking (Vertex Non-Conflict Scheduling)
Models suspect timeline assignments as vertex coloring on a conflict graph, enforcing non-conflict rules so no suspect occupies two locations simultaneously.

### 4. Backtracking CSP Search Engine
Executes a Constraint Satisfaction Problem (CSP) solver using recursive depth-first search with active domain pruning. Programmatically verifies that every mystery has **EXACTLY ONE** valid ground-truth solution ($VALID SOLUTIONS = 1$).

---

## Architecture & System Design

```
Player ──> UI Components ──> Reactive State Manager ──> Case Data
                                     │
                                     ▼
                           Deduction & Movement Engines
                                     │
                                     ▼
                           DAA Algorithm Modules
                                     │
                                     ▼
                              Validated Solution
```

### Folder Structure
```
f:\daa game\
├── docs/                   # Academic & System Documentation
│   ├── DAA.md              # Detailed algorithm proofs and complexity analysis
│   ├── GAMEPLAY.md         # Complete player flow walkthrough
│   └── ARCHITECTURE.md     # Decoupled architecture & system design
├── src/
│   ├── algorithms/         # Pure DAA algorithms (graphColoring, hamiltonian, backtracking)
│   ├── cases/              # Mystery definitions (case01.js, challenges.js)
│   ├── game/               # Core engine (state.js, Campus.js, CaseValidator.js, HypothesisEngine.js)
│   ├── ui/                 # Vanilla JS components (App.js, screens.js, screens2.js, CaseJournal.js)
│   ├── styles/             # Modular CSS stylesheet system
│   └── main.js             # Application entry point
├── tests/                  # Automated Vitest test suites (44 tests)
├── index.html              # HTML entry shell
├── package.json            # Node configuration & scripts
├── vite.config.js          # Vite build configuration
└── README.md               # Project documentation
```

---

## Technologies Used

- **HTML5 & CSS3**: Custom CSS variables, flexbox/grid layout, and responsive styling.
- **JavaScript (ES6+)**: Pure Vanilla JS application logic without framework overhead.
- **Vite 5**: Fast build tool and development server.
- **Vitest**: Unit & integration testing framework.

---

## How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Run Automated Tests
```bash
npm run test
```

### 4. Run DAA Algorithm Benchmark
```bash
npm run benchmark
```

---

## Build & Deployment

### Production Build
```bash
npm run build
```
Generates an optimized static build in the `dist/` directory ready for deployment.

### Static / GitHub Pages Deployment
The `dist/` folder is completely static and can be deployed directly to GitHub Pages, Netlify, or Vercel:
```bash
npx vite build
```

---

## Features

- **Three Playable Mysteries**: Easy, Medium, and Hard challenges.
- **Hero Timeline Board**: Interactive `?` / `✓` / `x` matrix grid with deduction highlights.
- **Campus Movement Graph**: Visual map overlay with route checking.
- **Process of Elimination**: Automatic breakthrough notification when 1 candidate remains.
- **Contradiction Alerting**: Single-click `↺ UNDO LAST DEDUCTION` error recovery.
- **DAA / Technical View**: Academic demonstration screen (`MAIN_MENU → DAA / TECHNICAL VIEW ⚙`).
- **Isolated LocalStorage**: Independent progress and best score tracking per case.

---

## Final Project Status

**Status**: Feature Complete.

### Playable Cases:
- [x] **Case 01**: The Last Samosa
- [x] **Case 02**: The Missing Attendance Register
- [x] **Case 03**: The Projector Incident

### DAA Algorithms Verified:
- [x] **Graph Traversal (BFS Shortest Path)**
- [x] **Path Validation (Hamiltonian Route Check)**
- [x] **Constraint Checking / Graph Coloring**
- [x] **Backtracking CSP Search Engine**
