# Gameplay & Player Flow Guide

> **Game**: The Last Suspect — A College Mystery Powered by DAA

---

## 1. Complete Player Investigation Loop

```
+------------------+
|   SELECT CASE    |  (Case 01, Case 02, or Case 03)
+--------+---------+
         |
         v
+------------------+
|  CASE BRIEFING   |  (Premise, Initial Facts, Objective)
+--------+---------+
         |
         v
+------------------+
| TIMELINE BOARD   |  (Hero Workspace: ? / ✓ / ✗ Grid)
+--------+---------+
         |
  +------+------+------------------+
  |             |                  |
  v             v                  v
[READ CLUES] [CHECK MAP] [INSPECT SUSPECT PROFILES]
  |             |                  |
  +------+------+------------------+
         |
         v
+------------------+
| APPLY DEDUCTIONS |  (🔎 Magnifying Glass Buttons -> Auto Journal & Grid)
+--------+---------+
         |
         v
+------------------+
| ROUTE & MOVEMENT |  (Check 5-min/15-min campus graph movement)
+--------+---------+
         |
         v
+------------------+
|  ELIMINATION     |  (Rule out suspects until ONE candidate remains)
+--------+---------+
         |
         v
+------------------+
| FINAL ACCUSATION |  (Commit to Who, When, Where, Evidence)
+--------+---------+
         |
         v
+------------------+
| CASE RESOLUTION  |  (Sleuth Score, How You Solved It, DAA Engine)
+------------------+
```

---

## 2. Step-by-Step Step Walkthrough

### Step 1: Select Case
From the **Home / Case Selection** screen, choose from three mysteries:
- **Case 01 — The Last Samosa** (★☆☆ Easy)
- **Case 02 — The Missing Attendance Register** (★★☆ Medium)
- **Case 03 — The Projector Incident** (★★★ Hard)

### Step 2: Read Case Briefing & Initial Facts
Review the background story and confirmed initial facts (e.g. *The samosa was present at 4:30 PM, missing at 4:45 PM*).

### Step 3: Hero Timeline Board
The central reasoning matrix rows display suspects (Arun, Priya, Karthik, Meena, Rahul) and columns display timeslots.
- Click any cell to cycle through states: `?` (Unknown) $\rightarrow$ `✓` (Definitely Present) $\rightarrow$ `x` (Definitely Absent) $\rightarrow$ `?`.

### Step 4: Inspect Suspect Profiles & Features
Click **Suspect Profiles** to review distinctive student items:
- **Arun**: 🎒 Blue Backpack
- **Priya**: 📕 Red Notebook
- **Karthik**: 🧢 Black Cap
- **Meena**: 🧴 Green Water Bottle
- **Rahul**: 🎧 Headphones

### Step 5: Read Clues & Apply Deductions
Browse through structured clues. Click any 🔎 deduction option (e.g. *🔎 Karthik (Black Cap) was in Canteen at 4:35 PM ordering tea*).
- Applying a deduction updates the timeline matrix, generates implied exclusions, and logs the reasoning into the **Detective Journal**.

### Step 6: Check Movement & Route Continuity
Click **`[ CHECK MOVEMENT ]`** beside any suspect. The engine evaluates shortest graph distance over the timeslot intervals:
- **Valid 1-step or multi-step route**: Displays `✓ MOVEMENT POSSIBLE`.
- **Backtracking Route Derivation**: If a suspect is confirmed at $4:30$ and $4:40$ skipping $4:35$, the engine derives the intermediate node (e.g. *Main Block at 4:35 PM*).
- **Impossible teleport**: Displays `✗ IMPOSSIBLE ROUTE`.

### Step 7: Contradiction Alerting
If a suspect is placed in two locations at the same time or moves faster than physical campus paths allow, the engine displays `⚠ CONTRADICTION` with a one-click `↺ UNDO LAST DEDUCTION` button.

### Step 8: Process of Elimination
As non-culprit suspects are ruled out for the crime timeframe, a notification banner displays: `ONE POSSIBILITY REMAINS: [SUSPECT NAME]`.

### Step 9: Make Final Accusation
Navigate to **`TIME TO ACCUSE`** and select:
1. **WHO**: Accused suspect
2. **WHEN**: Incident time
3. **WHERE**: Incident location
4. **EVIDENCE**: Key proof clue

### Step 10: Victory & Academic Breakdown
- **Correct Accusation**: Triggers `🎉 CASE SOLVED` with your Sleuth Score, Rank, *How You Solved It* narrative, and the **ALGORITHMIC REASONING & DAA ENGINE** breakdown.
- **Wrong Accusation**: Deducts 10 points, provides category feedback (Suspect ✓/✗, Time ✓/✗, Location ✓/✗, Evidence ✓/✗), and lets you return to investigation.
