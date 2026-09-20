/**
 * benchmark.js
 * 
 * Benchmarking module comparing Brute-force Search vs Backtracking with Pruning.
 * Measures search space explored (nodes visited) and execution time across variable sizes.
 */

function runBruteForce(variables, domains, constraints) {
  let nodesExplored = 0;
  let solutionsFound = 0;

  function generateAll(index, current) {
    nodesExplored++;
    if (index === variables.length) {
      let isValid = true;
      for (const constraint of constraints) {
        if (constraint(current) === false) {
          isValid = false;
          break;
        }
      }
      if (isValid) solutionsFound++;
      return;
    }

    const varName = variables[index];
    for (const val of domains[varName]) {
      current[varName] = val;
      generateAll(index + 1, current);
      delete current[varName];
    }
  }

  const start = performance.now();
  generateAll(0, {});
  const time = performance.now() - start;

  return { nodesExplored, solutionsFound, time };
}

function runBacktracking(variables, domains, constraints) {
  let nodesExplored = 0;
  let solutionsFound = 0;

  function backtrack(assignment) {
    nodesExplored++;

    // Early pruning: check constraints on partial assignment
    for (const constraint of constraints) {
      if (constraint(assignment) === false) {
        return; // PRUNE BRANCH
      }
    }

    const unassigned = variables.find(v => !(v in assignment));
    if (!unassigned) {
      solutionsFound++;
      return;
    }

    for (const val of domains[unassigned]) {
      assignment[unassigned] = val;
      backtrack(assignment);
      delete assignment[unassigned];
    }
  }

  const start = performance.now();
  backtrack({});
  const time = performance.now() - start;

  return { nodesExplored, solutionsFound, time };
}

export function runBenchmark() {
  console.log("\n============================================================");
  console.log("            THE LAST SUSPECT — DAA BENCHMARK               ");
  console.log("    Comparing Brute-Force Search vs Backtracking Pruning   ");
  console.log("============================================================\n");

  const results = [];
  const varSizes = [4, 5, 6, 7, 8];

  for (const size of varSizes) {
    const variables = Array.from({ length: size }, (_, i) => `v${i}`);
    const domainValues = [1, 2, 3, 4];
    const domains = {};
    variables.forEach(v => { domains[v] = [...domainValues]; });

    // Constraint: adjacent variables cannot be equal (v_i != v_{i+1})
    const constraints = [
      (a) => {
        for (let i = 0; i < size - 1; i++) {
          const v1 = `v${i}`;
          const v2 = `v${i + 1}`;
          if (a[v1] !== undefined && a[v2] !== undefined) {
            if (a[v1] === a[v2]) return false;
          }
        }
        return true;
      }
    ];

    const bf = runBruteForce(variables, domains, constraints);
    const bt = runBacktracking(variables, domains, constraints);
    const reduction = (((bf.nodesExplored - bt.nodesExplored) / bf.nodesExplored) * 100).toFixed(1);

    results.push({
      variables: size,
      bruteForceNodes: bf.nodesExplored,
      backtrackingNodes: bt.nodesExplored,
      reduction: `${reduction}%`,
      bfTimeMs: bf.time.toFixed(2),
      btTimeMs: bt.time.toFixed(2),
      solutions: bt.solutionsFound
    });
  }

  console.table(results);
  console.log("\nKey Takeaway: Backtracking prunes invalid branches early, dramatically reducing candidate nodes explored.\n");
  return results;
}

// Allow CLI execution via `node src/algorithms/benchmark.js`
if (import.meta.url.startsWith('file:') && process.argv[1] && process.argv[1].endsWith('benchmark.js')) {
  runBenchmark();
}
