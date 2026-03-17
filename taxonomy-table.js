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
document.addEventListener('DOMContentLoaded', renderTable);

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
