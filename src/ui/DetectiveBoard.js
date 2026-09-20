import { state } from '../game/state.js';

export function renderDetectiveBoard() {
  if (!state.boardNodes || state.boardNodes.length === 0) {
    state.initBoardNodes();
  }

  const caseData = state.caseData;
  const discoveredEvCount = state.discoveredEvidence.size;
  const totalEvCount = caseData ? caseData.evidence.length : 14;
  const confidence = state.getTimelineConfidence();
  const contradictions = state.getBoardContradictions();

  // Color mapping for node types
  const typeColors = {
    'PERSON': '#cd7b46',
    'LOCATION': '#4a7c59',
    'TIME': '#a87b51',
    'OBJECT': '#d6a458',
    'STATEMENT': '#8a7b9c',
    'EVIDENCE': '#5c7c8a'
  };

  // 1. FILTERING ENTITIES FOR LEFT PALETTE
  const searchTerm = (state.boardSearchTerm || '').toLowerCase();
  const catFilter = state.boardCategoryFilter || 'ALL';

  const getAllAvailableEntities = () => {
    const list = [];
    if (!caseData) return list;

    // Suspects
    caseData.suspects.forEach(s => {
      list.push({ id: s.id, type: 'PERSON', label: s.name, sub: s.role, detail: s.personality });
    });
    // Locations
    caseData.locations.forEach(l => {
      list.push({ id: l.id, type: 'LOCATION', label: l.name, sub: 'Campus Area', detail: l.desc });
    });
    // Times
    caseData.times.forEach(t => {
      list.push({ id: t, type: 'TIME', label: t, sub: 'Timeslot', detail: `Time slot at ${t}` });
    });
    // Object
    list.push({ id: 'samosa', type: 'OBJECT', label: 'The Last Samosa', sub: 'Missing Object', detail: 'The stolen snack' });

    // Discovered Evidence
    caseData.evidence.forEach(e => {
      if (state.discoveredEvidence.has(e.id)) {
        list.push({ id: e.id, type: 'EVIDENCE', label: e.title, sub: e.type, detail: e.desc });
      }
    });

    // Discovered Statements
    caseData.statements.forEach(st => {
      // Show statement if speaker's dialogue touched or evidence discovered
      const sName = caseData.suspects.find(s => s.id === st.suspect)?.name || st.suspect;
      list.push({ id: st.id, type: 'STATEMENT', label: `${sName}'s Claim`, sub: `Statement`, detail: st.text });
    });

    return list;
  };

  const allEntities = getAllAvailableEntities();
  const filteredEntities = allEntities.filter(e => {
    const matchesCat = catFilter === 'ALL' || e.type === catFilter || (catFilter === 'PEOPLE' && e.type === 'PERSON');
    const matchesSearch = !searchTerm || e.label.toLowerCase().includes(searchTerm) || e.sub.toLowerCase().includes(searchTerm);
    return matchesCat && matchesSearch;
  });

  // Palette Items HTML
  const paletteItemsHtml = filteredEntities.map(e => {
    const isOnBoard = state.boardNodes.some(n => n.id === e.id);
    const color = typeColors[e.type] || '#cd7b46';
    return `
      <div class="palette-item" style="border-left: 3px solid ${color}; padding: 0.6rem; margin-bottom: 0.5rem; background: var(--bg-base); border-radius: var(--radius-sm); font-size: 0.85rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
          <span class="font-mono text-muted" style="font-size: 0.7rem; color: ${color};">${e.type}</span>
          ${isOnBoard 
            ? `<span style="font-size: 0.7rem; color: var(--success);">✓ On Board</span>`
            : `<button class="btn" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;" onclick="window.GameApp.addNodeToBoard('${e.id}', '${e.type}', '${e.label.replace(/'/g, "\\'")}', '${e.sub.replace(/'/g, "\\'")}')">➕ Add</button>`
          }
        </div>
        <div style="font-weight: 500; font-family: var(--font-serif);">${e.label}</div>
        <div class="text-muted" style="font-size: 0.75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${e.sub}</div>
      </div>
    `;
  }).join('');

  // 2. SVG CONNECTIONS OVERLAY
  // Map node positions for drawing lines
  const nodePosMap = {};
  state.boardNodes.forEach(n => {
    nodePosMap[n.id] = { x: (n.x || 50) + 75, y: (n.y || 50) + 35 };
  });

  const contradictionNodeIds = new Set();
  contradictions.forEach(c => c.nodeIds?.forEach(id => contradictionNodeIds.add(id)));

  const svgLinesHtml = state.connections.map((c, idx) => {
    const pos1 = nodePosMap[c.id1];
    const pos2 = nodePosMap[c.id2];
    if (!pos1 || !pos2) return '';

    const isSelected = state.boardSelectedConnIndex === idx;
    const isContradiction = contradictionNodeIds.has(c.id1) && contradictionNodeIds.has(c.id2);

    let strokeColor = isContradiction ? '#cc5c5c' : (c.playerCreated === false ? '#639c73' : '#cd7b46');
    if (isSelected) strokeColor = '#e09160';

    const strokeDash = c.playerCreated !== false ? '6,4' : 'none';
    const midX = (pos1.x + pos2.x) / 2;
    const midY = (pos1.y + pos2.y) / 2;
    const relText = c.relation || 'RELATED TO';

    return `
      <g style="cursor: pointer;" onclick="window.GameApp.selectBoardConnection(${idx})">
        <line x1="${pos1.x}" y1="${pos1.y}" x2="${pos2.x}" y2="${pos2.y}" 
              stroke="${strokeColor}" stroke-width="${isSelected ? 3 : 2}" 
              stroke-dasharray="${strokeDash}" opacity="${isSelected ? 1 : 0.85}"/>
        <rect x="${midX - 35}" y="${midY - 10}" width="70" height="20" rx="4" fill="#18191e" stroke="${strokeColor}" stroke-width="1"/>
        <text x="${midX}" y="${midY + 3}" text-anchor="middle" fill="${strokeColor}" font-size="9.5" font-family="monospace" font-weight="bold">${relText}</text>
      </g>
    `;
  }).join('');

  // 3. CANVAS NODES RENDERING
  const isConnecting = !!state.boardConnectingFromId;
  const connectingSourceNode = isConnecting ? state.boardNodes.find(n => n.id === state.boardConnectingFromId) : null;

  const canvasNodesHtml = state.boardNodes.map(n => {
    const isSelected = state.boardSelectedNodeId === n.id;
    const isConnectingSource = state.boardConnectingFromId === n.id;
    const isContradiction = contradictionNodeIds.has(n.id);
    const color = typeColors[n.type] || '#cd7b46';

    let borderStyle = `2px solid ${color}`;
    if (isSelected) borderStyle = `2px solid #ffffff`;
    if (isConnectingSource) borderStyle = `2px solid var(--accent)`;
    if (isContradiction) borderStyle = `2px solid var(--error)`;

    const shadowStyle = isContradiction 
      ? 'box-shadow: 0 0 12px rgba(204,92,92,0.6);' 
      : (isSelected ? 'box-shadow: 0 0 12px rgba(255,255,255,0.3);' : 'box-shadow: 0 2px 6px rgba(0,0,0,0.4);');

    return `
      <div id="board-node-${n.id}" class="board-node-card" style="
        position: absolute; 
        left: ${n.x || 40}px; 
        top: ${n.y || 40}px; 
        width: 150px; 
        background: var(--bg-surface); 
        border-radius: var(--radius-sm); 
        border: ${borderStyle}; 
        ${shadowStyle}
        user-select: none;
        z-index: ${isSelected ? 10 : 2};
        transition: border 0.15s, box-shadow 0.15s;
      ">
        <div style="background: rgba(0,0,0,0.25); padding: 0.35rem 0.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); cursor: move;" 
             onmousedown="window.GameApp.startBoardDrag(event, '${n.id}')">
          <span class="font-mono" style="font-size: 0.65rem; color: ${color}; font-weight: bold;">${n.type}</span>
          <button style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.85rem;" onclick="event.stopPropagation(); window.GameApp.removeNodeFromBoard('${n.id}')" title="Remove from board">✕</button>
        </div>
        
        <div style="padding: 0.5rem; cursor: pointer;" onclick="window.GameApp.clickBoardNode('${n.id}')">
          <div class="font-serif" style="font-size: 0.9rem; font-weight: bold; color: var(--text-primary); margin-bottom: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${n.label}</div>
          <div class="text-muted font-mono" style="font-size: 0.75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${n.sub || ''}</div>
        </div>

        <div style="padding: 0.35rem 0.5rem; background: rgba(0,0,0,0.15); border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          ${isConnecting
            ? (isConnectingSource 
                ? `<span class="font-mono" style="font-size: 0.65rem; color: var(--accent);">SOURCE</span>`
                : `<button class="btn btn-primary" style="padding: 0.1rem 0.35rem; font-size: 0.65rem;" onclick="window.GameApp.finishConnectingTo('${n.id}')">TARGET</button>`)
            : `<button class="btn" style="padding: 0.1rem 0.35rem; font-size: 0.65rem;" onclick="event.stopPropagation(); window.GameApp.startConnectingFrom('${n.id}')">🔗 Connect</button>`
          }
          ${isContradiction ? `<span style="color: var(--error); font-size: 0.75rem;" title="Contradiction detected!">⚠</span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // 4. RIGHT INSPECTOR PANEL CONTENT
  const selectedNode = state.boardSelectedNodeId ? state.boardNodes.find(n => n.id === state.boardSelectedNodeId) : null;
  const selectedConn = state.boardSelectedConnIndex !== null ? state.connections[state.boardSelectedConnIndex] : null;

  let inspectorHtml = '';

  if (selectedNode) {
    // Find node connections
    const nodeConns = state.connections.filter(c => c.id1 === selectedNode.id || c.id2 === selectedNode.id);
    const connListHtml = nodeConns.map(c => {
      const otherId = c.id1 === selectedNode.id ? c.id2 : c.id1;
      const otherNode = state.boardNodes.find(n => n.id === otherId);
      const otherName = otherNode ? otherNode.label : otherId;
      const idx = state.connections.indexOf(c);
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.4rem; background: var(--bg-base); margin-bottom: 0.3rem; border-radius: var(--radius-sm); font-size: 0.8rem;">
          <span><strong style="color:var(--accent);">${c.relation || 'RELATED'}</strong> &rarr; ${otherName}</span>
          <button class="btn" style="padding: 0.1rem 0.3rem; font-size: 0.65rem;" onclick="window.GameApp.removeBoardConnection(${idx})">✕</button>
        </div>
      `;
    }).join('') || `<p class="text-muted" style="font-size: 0.8rem;">No active connections for this node.</p>`;

    // Quick Connect dropdown options
    const targetOptions = state.boardNodes
      .filter(n => n.id !== selectedNode.id)
      .map(n => `<option value="${n.id}">[${n.type}] ${n.label}</option>`)
      .join('');

    inspectorHtml = `
      <div class="card" style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="badge" style="background: ${typeColors[selectedNode.type] || 'gray'}; color: var(--bg-base); font-size: 0.7rem;">${selectedNode.type}</span>
          <button class="btn" style="padding: 0.1rem 0.3rem; font-size: 0.7rem;" onclick="window.GameApp.selectBoardNode(null)">Close</button>
        </div>
        <h3 class="font-serif" style="font-size: 1.2rem; margin-bottom: 0.3rem;">${selectedNode.label}</h3>
        <p class="text-muted font-mono" style="font-size: 0.8rem; margin-bottom: 1rem;">${selectedNode.sub || ''}</p>

        <h4 class="font-mono text-muted" style="font-size: 0.75rem; margin-bottom: 0.5rem;">CONNECTIONS (${nodeConns.length})</h4>
        ${connListHtml}

        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
          <h4 class="font-mono text-muted" style="font-size: 0.75rem; margin-bottom: 0.5rem;">CONNECT TO NODE</h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <select id="inspect-target-id" style="padding: 0.4rem; background: var(--bg-base); color: var(--text-primary); border: 1px solid var(--border-light); font-size: 0.8rem;">
              <option value="">-- select target node --</option>
              ${targetOptions}
            </select>
            <select id="inspect-relation" style="padding: 0.4rem; background: var(--bg-base); color: var(--text-primary); border: 1px solid var(--border-light); font-size: 0.8rem;">
              <option value="WAS AT">WAS AT</option>
              <option value="SEEN AT">SEEN AT</option>
              <option value="OCCURRED AT">OCCURRED AT</option>
              <option value="MENTIONS">MENTIONS</option>
              <option value="SUPPORTS">SUPPORTS</option>
              <option value="CONTRADICTS">CONTRADICTS</option>
              <option value="RELATED TO" selected>RELATED TO</option>
            </select>
            <button class="btn btn-primary" style="padding: 0.4rem; font-size: 0.8rem;" onclick="
              const tId = document.getElementById('inspect-target-id').value;
              const rel = document.getElementById('inspect-relation').value;
              if (tId) window.GameApp.addBoardConnection('${selectedNode.id}', tId, rel);
            ">CONNECT</button>
          </div>
        </div>
      </div>
    `;
  } else if (selectedConn) {
    const n1 = state.boardNodes.find(n => n.id === selectedConn.id1)?.label || selectedConn.id1;
    const n2 = state.boardNodes.find(n => n.id === selectedConn.id2)?.label || selectedConn.id2;
    inspectorHtml = `
      <div class="card" style="margin-bottom: 1rem;">
        <h4 class="font-mono text-muted" style="font-size: 0.75rem; margin-bottom: 0.5rem;">CONNECTION INSPECTOR</h4>
        <div style="font-size: 0.9rem; margin-bottom: 1rem;">
          <strong>${n1}</strong> <span style="color:var(--accent);">&mdash; [${selectedConn.relation || 'RELATED'}] &mdash;</span> <strong>${n2}</strong>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem;">
          Type: ${selectedConn.playerCreated !== false ? 'Player Theory Connection' : 'Confirmed Evidence Fact'}
        </div>
        <button class="btn btn-primary" style="width: 100%;" onclick="window.GameApp.removeBoardConnection(${state.boardSelectedConnIndex})">REMOVE CONNECTION</button>
      </div>
    `;
  } else {
    inspectorHtml = `
      <div class="card" style="margin-bottom: 1rem; text-align: center; color: var(--text-secondary); font-size: 0.85rem;">
        <p>Click any node or connection line on the board to view inspector details & create links.</p>
      </div>
    `;
  }

  // Contradiction warnings box
  const contradictionHtml = contradictions.length > 0 ? `
    <div class="card" style="margin-bottom: 1rem; border-color: var(--error); background: rgba(204,92,92,0.08);">
      <h4 class="font-serif" style="color: var(--error); font-size: 0.9rem; margin-bottom: 0.5rem;">⚠ CONTRADICTION DETECTED</h4>
      ${contradictions.map(c => `<p class="font-mono" style="font-size: 0.75rem; color: var(--text-primary); margin-bottom: 0.4rem;">• ${c.message}</p>`).join('')}
    </div>
  ` : '';

  // Hypothesis solver result box
  const hypoResult = state.hypothesisResult;
  const hypoResultHtml = hypoResult ? `
    <div class="card" style="margin-bottom: 1rem; border-color: ${hypoResult.success ? 'var(--success)' : 'var(--error)'};">
      <h4 class="font-serif" style="color: ${hypoResult.success ? 'var(--success)' : 'var(--error)'}; font-size: 0.9rem; margin-bottom: 0.3rem;">
        THEORY STATUS: ${hypoResult.status.toUpperCase()}
      </h4>
      <p style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-primary);">${hypoResult.message}</p>
    </div>
  ` : '';

  return `
    <div>
      <!-- TOP HEADER & CONTROLS -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div>
          <h2 class="font-serif" style="font-size: 1.8rem; color: var(--accent);">DETECTIVE WORKSPACE</h2>
          <div style="display: flex; gap: 1rem; align-items: center; margin-top: 0.25rem; font-size: 0.8rem;">
            <span class="font-mono text-muted">Evidence: <strong>${discoveredEvCount}/${totalEvCount}</strong></span>
            <span class="font-mono text-muted">Confidence: <span class="badge badge-warning">${confidence}</span></span>
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <button class="btn" onclick="window.GameApp.autoArrangeBoard()">🔄 AUTO-ARRANGE</button>
          <button class="btn" onclick="window.GameApp.clearPlayerTheory()">🧹 CLEAR THEORY</button>
          <button class="btn btn-primary" onclick="window.GameApp.testBoardTheory()">🧪 TEST THEORY</button>
        </div>
      </div>

      <!-- FILTER & SEARCH BAR -->
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 1rem;">
        <div style="display: flex; gap: 0.25rem; overflow-x: auto; flex: 1;">
          ${['ALL', 'PEOPLE', 'LOCATIONS', 'TIMES', 'OBJECTS', 'STATEMENTS', 'EVIDENCE'].map(cat => `
            <button class="btn" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; ${catFilter === cat ? 'background: var(--accent); color: var(--text-inverse); border-color: var(--accent);' : ''}" 
                    onclick="window.GameApp.setBoardFilter('${cat}')">${cat}</button>
          `).join('')}
        </div>
        <input type="text" placeholder="🔍 Search entities..." value="${state.boardSearchTerm || ''}" 
               style="padding: 0.35rem 0.75rem; background: var(--bg-base); border: 1px solid var(--border-light); color: var(--text-primary); border-radius: var(--radius-sm); font-size: 0.8rem; width: 200px;" 
               oninput="window.GameApp.setBoardSearch(this.value)" />
      </div>

      <!-- 3-PANEL WORKSPACE GRID -->
      <div style="display: grid; grid-template-columns: 240px 1fr 280px; gap: 1rem; align-items: start;">
        
        <!-- LEFT: ENTITY PALETTE -->
        <div class="card" style="padding: 0.75rem; max-height: 620px; overflow-y: auto;">
          <h3 class="font-mono text-muted" style="font-size: 0.75rem; margin-bottom: 0.75rem; letter-spacing: 0.5px;">ENTITY PALETTE (${filteredEntities.length})</h3>
          ${paletteItemsHtml || '<p class="text-muted" style="font-size: 0.8rem;">No matching entities found.</p>'}
        </div>

        <!-- CENTER: INTERACTIVE CANVAS -->
        <div id="board-canvas-container" style="
          position: relative; 
          min-height: 620px; 
          height: 620px;
          background-color: #18191e; 
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 0); 
          background-size: 20px 20px; 
          border: 1px solid var(--border-color); 
          border-radius: var(--radius-md); 
          overflow: auto;
        ">
          <!-- BOARD INSTRUCTION BANNER -->
          <div style="position: absolute; bottom: 12px; left: 12px; z-index: 5; background: rgba(0,0,0,0.55); border: 1px dashed var(--border-light); padding: 0.4rem 0.8rem; border-radius: var(--radius-sm); font-size: 0.75rem; color: var(--text-secondary); pointer-events: none;">
            💡 <strong>Detective Wall:</strong> Drag nodes to position. Click <strong>🔗 Connect</strong> to link evidence, people, and locations.
          </div>
          ${isConnecting ? `
            <div style="position: absolute; top: 10px; left: 10px; z-index: 20; background: var(--accent); color: var(--text-inverse); padding: 0.4rem 0.8rem; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: bold; display: flex; gap: 0.5rem; align-items: center;">
              <span>Connecting from "${connectingSourceNode?.label}" &rarr; Click TARGET on another node</span>
              <button style="background: none; border: none; color: white; cursor: pointer;" onclick="window.GameApp.cancelConnecting()">✕</button>
            </div>
          ` : ''}

          <!-- SVG Lines Overlay -->
          <svg style="position: absolute; top: 0; left: 0; width: 1300px; height: 900px; pointer-events: stroke; z-index: 1;">
            ${svgLinesHtml}
          </svg>

          <!-- On-Board Node Cards -->
          <div style="position: absolute; top: 0; left: 0; width: 1300px; height: 900px; pointer-events: none;">
            <div style="pointer-events: auto;">
              ${canvasNodesHtml}
            </div>
          </div>
        </div>

        <!-- RIGHT: INSPECTOR & RESULTS -->
        <div>
          ${contradictionHtml}
          ${hypoResultHtml}
          ${inspectorHtml}
        </div>

      </div>
    </div>
  `;
}
