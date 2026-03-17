// ── TAB SWITCHING ──────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(name + '-page').classList.add('active');
  event.target.classList.add('active');
  if (name === 'graph' && !graphInited) initGraph();
}

// ── DATA ────────────────────────────────────────────
const DIMS    = window.AROMA_DATA.DIMS;
const ENTRIES = window.AROMA_DATA.ENTRIES;

// ── Resolve D2 nested object to a single coverage level ──
function resolveD2(d2) {
  if (typeof d2 === 'string') return d2;
  const vals = [d2.role_identity, d2.activation_conditions, d2.boundary_conditions];
  if (vals.includes('full'))    return 'full';
  if (vals.includes('partial')) return 'partial';
  if (vals.every(v => v === 'na')) return 'na';
  return 'absent';
}

// ── Build edges for knowledge graph ──
let EDGES = [];
ENTRIES.forEach(tx => {
  DIMS.forEach(d => {
    let c = tx.cover[d.id];
    if (d.id === 'D2') c = resolveD2(c);
    if (c !== 'na') {
      EDGES.push({ source: tx.id, target: d.id, _sid: tx.id, _tid: d.id, coverage: c });
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  renderTable();
});

// ── BADGE / BORDER STYLE MAPS ────────────────────────
const typeBorder = {
  theory: 'border-l-[#7B9ED9]', peer: 'border-l-[#6DBB8C]',
  ai:     'border-l-[#B882D4]', hci:  'border-l-[#64748B]'
};
const badgeColor = {
  theory: 'bg-[#EEF2FB] text-[#5A72B8]', peer: 'bg-[#E8F5EE] text-[#3D8A58]',
  ai:     'bg-[#F5EEFB] text-[#9A52C0]', hci:  'bg-[#F0F4F8] text-[#4B6584]'
};
const badgeText = {
  theory: 'Theory', peer: 'Peer H-H', ai: 'Human-AI', hci: 'HCI Context'
};

const pillColors = {
  full: 'bg-[#EAF6D8] text-[#4C8627]', partial: 'bg-[#FFF9DC] text-[#957200]',
  absent: 'bg-[#FEEEEE] text-[#B03030]', na: 'bg-[#F2F0EC] text-[#888380]'
};
const pillText = { full: '✓ Full', partial: '~ Partial', absent: '✗ Absent', na: '— N/A' };

// ── TABLE RENDERING ──────────────────────────────────
function renderTable() {
  const tbody = document.getElementById('taxonomy-table-body');
  if (!tbody) return;

  let html = '';

  // Group entries by section (preserve insertion order)
  const sectionOrder = [];
  const sectionMap = {};
  ENTRIES.forEach(e => {
    if (!sectionMap[e.section]) {
      sectionMap[e.section] = [];
      sectionOrder.push(e.section);
    }
    sectionMap[e.section].push(e);
  });

  sectionOrder.forEach(section => {
    const items = sectionMap[section];
    const firstType = items[0].type;

    // Section header
    html += `
      <tr class="bg-secondary text-[9px] uppercase tracking-[0.1em] text-muted-foreground border-t-2 border-border">
        <td colspan="7" class="py-[6px] px-[10px] font-bold">${section}</td>
      </tr>
    `;

    // Authority-Agency paradox callout for AI · MENTAL HEALTH section
    if (section === 'AI · MENTAL HEALTH') {
      html += `
        <tr class="border-b border-[#F5C54233]">
          <td colspan="7" class="px-6 py-3">
            <div class="flex items-start gap-3 bg-[#FFFBEB] border border-[#F5C542]/40 rounded-md px-4 py-3">
              <span class="text-[#b45309] mt-[1px] shrink-0">⚠</span>
              <div>
                <span class="text-[9px] font-bold uppercase tracking-[0.1em] text-[#b45309] block mb-1">Authority–Agency Paradox</span>
                <span class="text-[10.5px] text-[#78350f] leading-relaxed">
                  Users ascribe positions of authority to AI agents (e.g. expert, advisor) — yet unlike human social roles, AI agents lack the agency to change the user's situation <em>or</em> the user's role. Authority is claimed, but agency is absent.
                </span>
              </div>
            </div>
          </td>
        </tr>
      `;
    }

    // Render each entry
    items.forEach(tx => {
      const borderColor = typeBorder[tx.type] || typeBorder.hci;
      const badgeStyle  = badgeColor[tx.type] || badgeColor.hci;
      const badge       = badgeText[tx.type]  || tx.type.toUpperCase();
      const rowId       = `tx-${tx.id}`;
      const cite        = tx.yr ? `${tx.source} (${tx.yr})` : (tx.source || '');

      html += `
        <tr class="hover:bg-black/5 border-b border-border row-expander" onclick="toggleRow('${rowId}')">
          <td class="text-center align-middle border-r border-border border-l-[4px] ${borderColor}">
             <svg class="expand-icon w-3 h-3 text-muted-foreground mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </td>
          <td class="sticky left-[34px] bg-background border-r border-border py-[9px] pl-[10px] pr-[14px]">
            <span class="font-medium text-[11px] block mb-[2px] leading-tight">${tx.desc}</span>
            <span class="text-[9.5px] text-muted-foreground block line-clamp-1">${cite}</span>
            <span class="inline-block text-[8.5px] px-[6px] py-[1px] rounded-[2px] mt-[3px] font-medium tracking-[0.05em] uppercase ${badgeStyle}">${badge}</span>
          </td>
      `;

      // D1–D5 coverage pills
      DIMS.forEach(d => {
        let cov = tx.cover[d.id];
        if (d.id === 'D2') cov = resolveD2(cov);

        const pColor = pillColors[cov] || pillColors.na;
        const pText  = pillText[cov]   || '—';
        html += `
          <td class="text-center align-middle px-[10px] py-[9px] border-r border-border">
            <span class="inline-flex items-center gap-1 px-[7px] py-[3px] rounded-[3px] text-[9.5px] font-medium leading-[1.3] text-left ${pColor}">${pText}</span>
          </td>
        `;
      });

      html += `</tr>`;

      // ── Detail row ──
      const d2 = tx.cover.D2;
      const d2isObj = typeof d2 === 'object' && d2 !== null;

      html += `
        <tr id="${rowId}" class="detail-row bg-[#FAFAFA] border-b border-border shadow-inner">
          <td colspan="7" class="p-0">
            <div class="px-10 py-6 grid grid-cols-4 gap-8">

              <!-- Left column: summary + metadata -->
              <div class="col-span-1 border-r border-border pr-6">
                <h4 class="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Description</h4>
                <p class="text-[10.5px] leading-relaxed mb-3">${tx.desc}</p>

                <div class="text-[10px] mb-3 text-muted-foreground leading-relaxed space-y-[2px]">
                  ${tx.venue ? `<div><span class="font-bold text-foreground">Venue:</span> ${tx.venue}</div>` : ''}
                  ${tx.who_defines_role ? `<div><span class="font-bold text-foreground">Who defines role:</span> ${tx.who_defines_role}</div>` : ''}
                  ${tx.static_or_dynamic ? `<div><span class="font-bold text-foreground">Static/Dynamic:</span> ${tx.static_or_dynamic}</div>` : ''}
                  ${tx.power_asymmetry ? `<div><span class="font-bold text-foreground">Power:</span> ${tx.power_asymmetry}</div>` : ''}
                  ${tx.argument_chain_layer ? `<div><span class="font-bold text-foreground">Argument layer:</span> ${tx.argument_chain_layer.replace(/_/g,' ')}</div>` : ''}
                  ${tx.relationship_to_aroma ? `<div><span class="font-bold text-foreground">Rel. to AROMA:</span> ${tx.relationship_to_aroma}</div>` : ''}
                </div>

                ${tx.contribution ? `
                <div class="text-[10.5px] text-foreground bg-black/5 p-3 rounded-sm border-l-2 border-[#22c55e] mb-3">
                  <span class="font-bold block mb-1 not-italic text-[9.5px] uppercase tracking-wider text-[#16a34a]">Contribution</span>
                  ${tx.contribution}
                </div>` : ''}

                ${tx.gap ? `
                <div class="text-[10.5px] text-foreground italic bg-black/5 p-3 rounded-sm border-l-2 border-[#e85a3c]">
                  <span class="font-bold block mb-1 not-italic text-[9.5px] uppercase tracking-wider text-[#e85a3c]">Gap / Limitation</span>
                  ${tx.gap}
                </div>` : ''}
              </div>

              <!-- Right columns: dimension notes + D2 breakdown -->
              <div class="col-span-3">
                ${d2isObj ? `
                <h4 class="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-3">D2 Sub-Dimensions</h4>
                <div class="flex gap-4 mb-4">
                  <span class="inline-flex items-center gap-1 px-[7px] py-[3px] rounded-[3px] text-[9px] font-medium ${pillColors[d2.role_identity] || pillColors.absent}">Role identity: ${d2.role_identity}</span>
                  <span class="inline-flex items-center gap-1 px-[7px] py-[3px] rounded-[3px] text-[9px] font-medium ${pillColors[d2.activation_conditions] || pillColors.absent}">Activation: ${d2.activation_conditions}</span>
                  <span class="inline-flex items-center gap-1 px-[7px] py-[3px] rounded-[3px] text-[9px] font-medium ${pillColors[d2.boundary_conditions] || pillColors.absent}">Boundary: ${d2.boundary_conditions}</span>
                </div>
                ` : ''}

                ${tx.notes ? `
                <h4 class="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-4">AROMA Dimension Notes</h4>
                <div class="grid grid-cols-3 gap-x-6 gap-y-4">
                  ${DIMS.map(d => {
                    const note = tx.notes ? tx.notes[d.id] : '';
                    return note ? `
                      <div>
                        <span class="font-mono text-[9.5px] font-bold text-foreground block mb-1">${d.id} Coverage</span>
                        <p class="text-[10px] text-muted-foreground leading-relaxed">${note}</p>
                      </div>
                    ` : '';
                  }).join('')}
                </div>
                ` : ''}
              </div>

            </div>
          </td>
        </tr>
      `;
    });
  });

  tbody.innerHTML = html;
}

window.toggleRow = function(id) {
  const row = document.getElementById(id);
  const expanderRow = row.previousElementSibling;
  row.classList.toggle('expanded');
  expanderRow.classList.toggle('expanded');
};

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

  const typeColor = {
    theory: '#2D3A8C', peer: '#2D6B45', ai: '#7A2D8C', hci: '#4B6584'
  };

  // Build node list
  const dimNodes = DIMS.map(d => ({ ...d, nodeType: 'dim', radius: 22 }));
  const txNodes  = ENTRIES.map(t => ({
    ...t, nodeType: 'tx', radius: 14,
    color: typeColor[t.type] || typeColor.hci
  }));
  const allNodes = [...dimNodes, ...txNodes];

  // Seed positions
  dimNodes.forEach(n => { n.x = W * n.x0; n.y = H * n.y0; n.fx = W * n.x0; });
  txNodes.forEach((n, i) => {
    n.x = n.group === 'left' ? W * 0.12 : n.group === 'right' ? W * 0.88 : W * 0.5;
    n.y = H * (0.08 + (i / ENTRIES.length) * 0.86);
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

  // Force simulation
  simulation = d3.forceSimulation(allNodes)
    .force('link', d3.forceLink(EDGES)
      .id(d => d.id)
      .distance(e => e.coverage === 'full' ? 180 : e.coverage === 'partial' ? 220 : 260)
      .strength(e => e.coverage === 'full' ? 0.7 : e.coverage === 'partial' ? 0.35 : 0.1))
    .force('charge',  d3.forceManyBody().strength(-80))
    .force('collide', d3.forceCollide(d => d.radius + 30))
    .force('x', d3.forceX(d => d.nodeType === 'dim' ? W * d.x0 : d.group === 'left' ? W * 0.14 : d.group === 'right' ? W * 0.86 : W * 0.5)
      .strength(d => d.nodeType === 'dim' ? 1 : 0.6))
    .force('y', d3.forceY(d => d.nodeType === 'dim' ? H * d.y0 : H * 0.5)
      .strength(d => d.nodeType === 'dim' ? 1 : 0.04))
    .alphaDecay(0.025)
    .on('tick', ticked);

  // Draw links
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

  // Draw nodes
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

  // External labels
  nodeGroups.filter(d => d.nodeType === 'tx').each(function(d) {
    const g2 = d3.select(this);
    const lines  = d.label.split('\n');
    const isLeft = d.group === 'left';
    const isContext = d.group === 'context';
    const xOff   = isLeft ? -(d.radius + 7) : isContext ? 0 : (d.radius + 7);
    const anchor = isLeft ? 'end' : isContext ? 'middle' : 'start';
    lines.forEach((line, i) => {
      g2.append('text')
        .attr('text-anchor', anchor)
        .attr('x', xOff)
        .attr('y', isContext ? d.radius + 12 + i * 13 : (i - (lines.length - 1) / 2) * 13)
        .attr('fill', '#1A1612').attr('font-family', 'DM Mono, monospace')
        .attr('font-size', '9px').attr('font-weight', i === 0 ? '500' : '300')
        .attr('pointer-events', 'none')
        .text(line);
    });
  });

  // Tick
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

  // Filter
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
    ENTRIES.forEach(tx => {
      let c = tx.cover[d.id];
      if (d.id === 'D2') c = resolveD2(c);
      if (c === 'na') return;
      const sym = c === 'full' ? '✓' : c === 'partial' ? '~' : '✗';
      const col = coverColor[c];
      html += `<div style="color:${col}">${sym} ${tx.label.replace('\n', ' ')}</div>`;
    });
  } else {
    html = `<strong>${d.label.replace('\n', ' ')}</strong><div style="color:#AAA;font-size:9.5px;margin-bottom:4px">${d.type}</div>${d.desc}`;
    html += '<div style="margin-top:6px;font-size:9px;">';
    DIMS.forEach(dim => {
      let c = d.cover[dim.id];
      if (dim.id === 'D2') c = resolveD2(c);
      if (c === 'na') return;
      const sym = c === 'full' ? '✓' : c === 'partial' ? '~' : '✗';
      html += `<span style="color:${coverColor[c]};margin-right:8px">${sym} ${dim.id}</span>`;
    });
    html += '</div>';
  }
  tip.innerHTML = html;
  tip.style.opacity = '1';
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
  tip.style.opacity = '0';
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
