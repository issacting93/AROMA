// ── TAB SWITCHING ──────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(name + '-page').classList.add('active');
  event.target.classList.add('active');
  if (name === 'graph' && !graphInited) initGraph();
}

// ── GRAPH DATA ────────────────────────────────────
let DIMS = [];
let TAXONOMIES = [];

// Initialize from global data object
DIMS = window.AROMA_DATA.DIMS;
TAXONOMIES = window.AROMA_DATA.TAXONOMIES;

let EDGES = [];

// Build edges
TAXONOMIES.forEach(tx => {
  DIMS.forEach(d => {
    const c = tx.cover[d.id];
    if (c !== 'na') {
      EDGES.push({ source: tx.id, target: d.id, _sid: tx.id, _tid: d.id, coverage: c });
    }
  });
});

document.addEventListener('DOMContentLoaded', renderTable);

function renderTable() {
  const tbody = document.getElementById('taxonomy-table-body');
  if (!tbody) return;

  const sections = [
    { type: 'theory', title: 'Foundational Support Theory' },
    { type: 'peer', title: 'Peer / Human-Human Support' },
    { type: 'ai', title: 'Human-AI Support' }
  ];

  let html = '';

  sections.forEach(sec => {
    const items = TAXONOMIES.filter(t => t.type === sec.type);
    if (items.length === 0) return;

    html += `
      <tr class="section-head">
        <td colspan="7">${sec.title}</td>
      </tr>
    `;

    items.forEach(tx => {
      if (!tx.table) return;

      const badgeClass = `badge-${tx.type}`;
      const badgeText = tx.type === 'theory' ? 'Theory' : (tx.type === 'peer' ? 'Peer H-H' : 'Human-AI');

      html += `
        <tr class="type-${tx.type}">
          <td class="sticky">
            <span class="tx-name">${tx.table.name}</span>
            <span class="tx-cite">${tx.table.cite}</span>
            <span class="tx-badge ${badgeClass}">${badgeText}</span>
          </td>
      `;

      DIMS.forEach(d => {
        const cov = tx.cover[d.id];
        const note = tx.table.notes[d.id];
        
        let pillClass = '';
        let pillText = '';
        if (cov === 'full') { pillClass = 'full'; pillText = '✓ Full'; }
        else if (cov === 'partial') { pillClass = 'partial'; pillText = '~ Partial'; }
        else if (cov === 'absent') { pillClass = 'absent'; pillText = '✗ Absent'; }
        else { pillClass = 'na'; pillText = '— N/A'; }

        html += `
          <td class="cov">
            <span class="cov-pill ${pillClass}">${pillText}</span>
            ${note ? `<span class="cov-note">${note}</span>` : ''}
          </td>
        `;
      });

      html += `
          <td class="gap-cell">${tx.table.gap}</td>
        </tr>
      `;
    });
  });

  tbody.innerHTML = html;
}

const coverColor = { full: '#2D5016', partial: '#B8860B', absent: '#CEC9BF', na: '#E8E4DE' };
const coverWidth = { full: 2.5, partial: 1.5, absent: 0.7, na: 0 };
const coverDash  = { full: '0', partial: '4,3', absent: '3,4', na: '2,4' };


// ── GRAPH INIT ────────────────────────────────────
let graphInited = false;
let simulation, gSvg, nodeGroups;
let currentFilter = 'all';

function initGraph() {
  graphInited = true;
  const container = document.getElementById('graph-page');
  const W = container.clientWidth;
  const H = container.clientHeight;

  // Build node list
  const dimNodes = DIMS.map(d => ({ ...d, nodeType: 'dim', radius: 22 }));
  const txNodes  = TAXONOMIES.map(t => ({
    ...t, nodeType: 'tx', radius: 14,
    color: t.type === 'theory' ? '#2D3A8C' : t.type === 'peer' ? '#2D6B45' : '#7A2D8C'
  }));
  const allNodes = [...dimNodes, ...txNodes];

  // Seed positions
  dimNodes.forEach(n => { n.x = W * n.x0; n.y = H * n.y0; n.fx = W * n.x0; });
  txNodes.forEach((n, i) => {
    n.x = n.group === 'left' ? W * 0.12 : W * 0.88;
    n.y = H * (0.08 + (i / TAXONOMIES.length) * 0.86);
  });

  const svgEl = d3.select('#kg-canvas').attr('width', W).attr('height', H);

  // Arrow markers
  const defs = svgEl.append('defs');
  ['full', 'partial', 'absent'].forEach(c => {
    defs.append('marker')
      .attr('id', `arr-${c}`)
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 8).attr('refY', 0)
      .attr('markerWidth', 5).attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', coverColor[c]);
  });

  // Zoom
  const zoom = d3.zoom().scaleExtent([0.3, 3]).on('zoom', e => gSvg.attr('transform', e.transform));
  svgEl.call(zoom);

  gSvg = svgEl.append('g');
  const linksG = gSvg.append('g').attr('class', 'links');
  const nodesG = gSvg.append('g').attr('class', 'nodes');

  // ── SIMULATION — forceLink receives EDGES; D3 mutates source/target to node refs
  simulation = d3.forceSimulation(allNodes)
    .force('link', d3.forceLink(EDGES)
      .id(d => d.id)
      .distance(e => e.coverage === 'full' ? 180 : e.coverage === 'partial' ? 220 : 260)
      .strength(e => e.coverage === 'full' ? 0.7 : e.coverage === 'partial' ? 0.35 : 0.1))
    .force('charge',  d3.forceManyBody().strength(-80))
    .force('collide', d3.forceCollide(d => d.radius + 30))
    .force('x', d3.forceX(d => d.nodeType === 'dim' ? W * d.x0 : d.group === 'left' ? W * 0.14 : W * 0.86)
      .strength(d => d.nodeType === 'dim' ? 1 : 0.6))
    .force('y', d3.forceY(d => d.nodeType === 'dim' ? H * d.y0 : H * 0.5)
      .strength(d => d.nodeType === 'dim' ? 1 : 0.04))
    .alphaDecay(0.025)
    .on('tick', ticked);

  // ── DRAW LINKS — use _sid/_tid as stable key; read positions from mutated source/target objects
  function redrawLinks() {
    const visible = currentFilter === 'full'    ? EDGES.filter(e => e.coverage === 'full')
                  : currentFilter === 'partial'  ? EDGES.filter(e => e.coverage !== 'absent')
                  : EDGES;

    const sel = linksG.selectAll('line').data(visible, e => `${e._sid}__${e._tid}`);
    sel.exit().remove();
    sel.enter().append('line').merge(sel)
      .attr('stroke',           e => coverColor[e.coverage])
      .attr('stroke-width',     e => coverWidth[e.coverage])
      .attr('stroke-dasharray', e => coverDash[e.coverage])
      .attr('opacity',          e => e.coverage === 'absent' ? 0.3 : 0.75)
      .attr('marker-end',       e => e.coverage === 'full' ? 'url(#arr-full)'
                                   : e.coverage === 'partial' ? 'url(#arr-partial)' : '');
  }

  redrawLinks();

  // ── DRAW NODES
  nodeGroups = nodesG.selectAll('g.node-g')
    .data(allNodes, d => d.id)
    .enter().append('g')
    .attr('class', 'node-g')
    .style('cursor', 'pointer')
    .call(d3.drag()
      .on('start', (ev, d) => { if (!ev.active) simulation.alphaTarget(0.2).restart(); })
      .on('drag',  (ev, d) => { d.x = ev.x; d.y = ev.y; if (d.nodeType === 'dim') d.fx = ev.x; simulation.alpha(0.1).restart(); })
      .on('end',   (ev, d) => { if (!ev.active) simulation.alphaTarget(0); if (d.nodeType === 'dim') d.fx = d.x; })
    )
    .on('mouseover', (ev, d) => showTooltip(ev, d))
    .on('mousemove', (ev)    => moveTooltip(ev))
    .on('mouseout',  ()      => hideTooltip())
    .on('click',     (ev, d) => highlightNode(d));

  nodeGroups.append('circle')
    .attr('r',            d => d.radius)
    .attr('fill',         d => d.color || '#1A1612')
    .attr('stroke',       d => d.nodeType === 'dim' ? '#E8C87A' : 'rgba(255,255,255,0.15)')
    .attr('stroke-width', d => d.nodeType === 'dim' ? 2 : 1);

  // Text inside dim nodes
  nodeGroups.filter(d => d.nodeType === 'dim').append('text')
    .attr('text-anchor', 'middle').attr('dy', '0.35em')
    .attr('fill', '#F7F4EF').attr('font-family', 'DM Mono, monospace')
    .attr('font-size', '9px').attr('font-weight', '500')
    .attr('pointer-events', 'none')
    .text(d => d.id);

  // Year text inside tx nodes
  nodeGroups.filter(d => d.nodeType === 'tx').append('text')
    .attr('text-anchor', 'middle').attr('dy', '0.35em')
    .attr('fill', 'rgba(255,255,255,0.55)').attr('font-family', 'DM Mono, monospace')
    .attr('font-size', '7.5px').attr('pointer-events', 'none')
    .text(d => d.yr ? String(d.yr).slice(2) : '');

  // External labels for tx nodes
  nodeGroups.filter(d => d.nodeType === 'tx').each(function(d) {
    const g2 = d3.select(this);
    const lines  = d.label.split('\n');
    const isLeft = d.group === 'left';
    const xOff   = isLeft ? -(d.radius + 7) : (d.radius + 7);
    lines.forEach((line, i) => {
      g2.append('text')
        .attr('text-anchor', isLeft ? 'end' : 'start')
        .attr('x', xOff)
        .attr('y', (i - (lines.length - 1) / 2) * 13)
        .attr('fill', '#1A1612').attr('font-family', 'DM Mono, monospace')
        .attr('font-size', '9px').attr('font-weight', i === 0 ? '500' : '300')
        .attr('pointer-events', 'none')
        .text(line);
    });
  });

  // ── TICK — after simulation runs, e.source/e.target ARE node objects; read .x/.y directly
  function ticked() {
    linksG.selectAll('line')
      .attr('x1', e => e.source.x)
      .attr('y1', e => e.source.y)
      .attr('x2', e => {
        const dx = e.target.x - e.source.x, dy = e.target.y - e.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        return e.target.x - (dx / dist) * (e.target.radius + 4);
      })
      .attr('y2', e => {
        const dx = e.target.x - e.source.x, dy = e.target.y - e.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        return e.target.y - (dy / dist) * (e.target.radius + 4);
      });

    nodeGroups.attr('transform', d => `translate(${d.x},${d.y})`);
  }

  // Expose filter function
  window.filterGraph = function(f) {
    currentFilter = f;
    document.querySelectorAll('.kg-ctrl-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + f).classList.add('active');
    redrawLinks();
    simulation.alpha(0.3).restart();
  };
}

// ── TOOLTIP ──────────────────────────────────────
const tip = document.getElementById('kg-tooltip');

function showTooltip(event, d) {
  let html = '';
  if (d.nodeType === 'dim') {
    html = `<strong>${d.label}</strong>`;
    TAXONOMIES.forEach(tx => {
      const c = tx.cover[d.id];
      if (c === 'na') return;
      const sym = c === 'full' ? '✓' : c === 'partial' ? '~' : '✗';
      const col = coverColor[c];
      html += `<div style="color:${col}">${sym} ${tx.label.replace('\n', ' ')}</div>`;
    });
  } else {
    html = `<strong>${d.label.replace('\n', ' ')}</strong><div style="color:#AAA;font-size:9.5px;margin-bottom:4px">${d.type}</div>${d.desc}`;
    html += '<div style="margin-top:6px;font-size:9px;">';
    DIMS.forEach(dim => {
      const c = d.cover[dim.id];
      if (c === 'na') return;
      const sym = c === 'full' ? '✓' : c === 'partial' ? '~' : '✗';
      html += `<span style="color:${coverColor[c]};margin-right:8px">${sym} ${dim.id}</span>`;
    });
    html += '</div>';
  }
  tip.innerHTML = html;
  tip.classList.add('visible');
  moveTooltip(event);
}

function moveTooltip(event) {
  const x = event.clientX, y = event.clientY;
  const container = document.getElementById('graph-page').getBoundingClientRect();
  const tx = x - container.left + 16;
  const ty = y - container.top + 16;
  tip.style.left = Math.min(tx, container.width - 300) + 'px';
  tip.style.top  = Math.min(ty, container.height - 180) + 'px';
}

function hideTooltip() {
  tip.classList.remove('visible');
}

// ── HIGHLIGHT ────────────────────────────────────
let highlighted = null;
function highlightNode(d) {
  if (highlighted === d.id) {
    highlighted = null;
    d3.selectAll('.node-g circle').attr('opacity', 1);
    d3.selectAll('.links line').attr('opacity', e => e.coverage === 'absent' ? 0.3 : 0.75);
    return;
  }
  highlighted = d.id;
  const connected = new Set([d.id]);
  EDGES.forEach(e => {
    if (e._sid === d.id || e._tid === d.id) {
      connected.add(e._sid);
      connected.add(e._tid);
    }
  });
  d3.selectAll('.node-g circle').attr('opacity', n => connected.has(n.id) ? 1 : 0.12);
  d3.selectAll('.links line').attr('opacity', e => {
    if (e._sid === d.id || e._tid === d.id)
      return e.coverage === 'absent' ? 0.45 : 1;
    return 0.04;
  });
}
