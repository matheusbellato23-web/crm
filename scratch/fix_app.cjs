const fs = require('fs');
let code = fs.readFileSync('src/app.js', 'utf8');

const startIdx = code.indexOf('function renderContacts() {');
const endIdx = code.indexOf('// 3. Kanban Pipeline Render');

if (startIdx !== -1 && endIdx !== -1) {
    const newRenderContacts = `function renderContacts() {
    const env = getEnv();
    const filterStatus = document.getElementById("filterStatus") ? document.getElementById("filterStatus").value : "all";
    const filterNiche = document.getElementById("contactsNicheFilter") ? document.getElementById("contactsNicheFilter").value : "all";
    
    const searchValGlobal = document.getElementById("globalSearch") ? document.getElementById("globalSearch").value.toLowerCase().trim() : "";
    const searchValLocal = document.getElementById("contactsSearchInput") ? document.getElementById("contactsSearchInput").value.toLowerCase().trim() : "";
    const searchVal = searchValLocal || searchValGlobal;

    const perPageVal = document.getElementById("contactsPerPageSelect") ? document.getElementById("contactsPerPageSelect").value : "50";
    contactsTableState.itemsPerPage = perPageVal === "all" ? 999999 : (parseInt(perPageVal, 10) || 50);

    let allContacts = [...env.contacts];

    // Update KPI Metric Ribbon
    const totalCount = allContacts.length;
    const graficaCount = allContacts.filter(c => (c.niche && c.niche.toLowerCase().includes('graf')) || (c.company && c.company.toLowerCase().includes('graf'))).length;
    const agentCount = allContacts.filter(c => c.source === 'Agente Comercial' || (c.id && c.id.includes('agente'))).length;
    const pipelineValue = allContacts.reduce((acc, c) => acc + (Number(c.value) || 0), 0);

    const elTotal = document.getElementById("kpiTotalContactsCount");
    const elGrafica = document.getElementById("kpiGraficaContactsCount");
    const elAgent = document.getElementById("kpiAgentContactsCount");
    const elPipe = document.getElementById("kpiTotalPipelineValue");

    if (elTotal) elTotal.innerText = totalCount;
    if (elGrafica) elGrafica.innerText = graficaCount;
    if (elAgent) elAgent.innerText = agentCount;
    if (elPipe) elPipe.innerText = formatCurrency(pipelineValue);

    // Apply Status Filter
    let filtered = allContacts;
    if (filterStatus === "agente") {
        filtered = filtered.filter(c => c.source === 'Agente Comercial' || (c.id && c.id.includes('agente')) || (c.notes && c.notes.toLowerCase().includes('agente')));
    } else if (filterStatus !== "all") {
        filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Apply Nicho Filter
    if (filterNiche !== "all") {
        filtered = filtered.filter(c => c.niche === filterNiche);
    }

    // Apply Search Input
    if (searchVal) {
        filtered = filtered.filter(c => 
            (c.name && c.name.toLowerCase().includes(searchVal)) ||
            (c.company && c.company.toLowerCase().includes(searchVal)) ||
            (c.niche && c.niche.toLowerCase().includes(searchVal)) ||
            (c.email && c.email.toLowerCase().includes(searchVal)) ||
            (c.phone && c.phone.toLowerCase().includes(searchVal)) ||
            (c.notes && c.notes.toLowerCase().includes(searchVal))
        );
    }

    // Sorting
    const sortCol = contactsTableState.sortColumn;
    const sortAsc = contactsTableState.sortOrder === 'asc';
    filtered.sort((a, b) => {
        let valA = a[sortCol] || '';
        let valB = b[sortCol] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
    });

    const tbody = document.getElementById("contactsTableBody");
    const emptyState = document.getElementById("contactsEmptyState");
    const tableEl = document.getElementById("contactsTable");
    const paginationContainer = document.getElementById("contactsPaginationContainer");
    if (tbody) tbody.innerHTML = "";

    if (filtered.length === 0) {
        if (emptyState) emptyState.classList.remove("hidden");
        if (tableEl) tableEl.classList.add("hidden");
        if (paginationContainer) paginationContainer.style.display = "none";
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (tableEl) tableEl.classList.remove("hidden");
    if (paginationContainer) paginationContainer.style.display = "flex";

    // Pagination calculations
    const totalItems = filtered.length;
    const itemsPerPage = contactsTableState.itemsPerPage;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (contactsTableState.currentPage > totalPages) {
        contactsTableState.currentPage = totalPages;
    }
    if (contactsTableState.currentPage < 1) {
        contactsTableState.currentPage = 1;
    }

    const startIndex = (contactsTableState.currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedItems = filtered.slice(startIndex, endIndex);

    // Update Pagination Info Bar
    const pagInfo = document.getElementById("contactsPaginationInfo");
    if (pagInfo) {
        pagInfo.innerText = \`Exibindo \${totalItems === 0 ? 0 : startIndex + 1} a \${endIndex} de \${totalItems} contatos\`;
    }

    // Build Pagination Buttons
    const pagButtons = document.getElementById("contactsPaginationButtons");
    if (pagButtons) {
        pagButtons.innerHTML = "";
        
        // Prev button
        const btnPrev = document.createElement("button");
        btnPrev.className = "btn btn-secondary btn-sm";
        btnPrev.style.cssText = "height: 30px; padding: 0 10px; font-size: 12px;";
        btnPrev.innerHTML = "◀️ Anterior";
        btnPrev.disabled = contactsTableState.currentPage === 1;
        btnPrev.onclick = () => {
            if (contactsTableState.currentPage > 1) {
                contactsTableState.currentPage--;
                renderContacts();
            }
        };
        pagButtons.appendChild(btnPrev);

        // Page Indicator / Page Numbers
        let maxVisiblePages = 5;
        let startPage = Math.max(1, contactsTableState.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let p = startPage; p <= endPage; p++) {
            const pageBtn = document.createElement("button");
            pageBtn.className = p === contactsTableState.currentPage ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm";
            pageBtn.style.cssText = \`height: 30px; min-width: 30px; padding: 0 8px; font-size: 12px; \${p === contactsTableState.currentPage ? 'font-weight: 700;' : ''}\`;
            pageBtn.innerText = p;
            pageBtn.onclick = () => {
                contactsTableState.currentPage = p;
                renderContacts();
            };
            pagButtons.appendChild(pageBtn);
        }

        // Next button
        const btnNext = document.createElement("button");
        btnNext.className = "btn btn-secondary btn-sm";
        btnNext.style.cssText = "height: 30px; padding: 0 10px; font-size: 12px;";
        btnNext.innerHTML = "Próxima ▶️";
        btnNext.disabled = contactsTableState.currentPage === totalPages;
        btnNext.onclick = () => {
            if (contactsTableState.currentPage < totalPages) {
                contactsTableState.currentPage++;
                renderContacts();
            }
        };
        pagButtons.appendChild(btnNext);
    }

    // Render Table Rows
    paginatedItems.forEach(c => {
        const isAgente = c.source === 'Agente Comercial' || (c.id && c.id.includes('agente')) || (c.notes && c.notes.toLowerCase().includes('agente'));
        const isAgenteBadge = isAgente ? \`<span style="font-size:10px;background:rgba(79,70,229,0.1);color:#4F46E5;border:1px solid rgba(79,70,229,0.3);padding:2px 8px;border-radius:99px;font-weight:600;margin-left:6px;display:inline-flex;align-items:center;gap:3px;">🤖 Agente AI</span>\` : '';
        
        const rawPhoneDigits = (c.phone || '').replace(/\\D/g, '');
        const waLink = rawPhoneDigits ? \`https://wa.me/55\${rawPhoneDigits.length >= 10 && rawPhoneDigits.startsWith('55') ? rawPhoneDigits.substring(2) : rawPhoneDigits}\` : null;
        
        const phoneDisplay = c.phone 
            ? \`<div style="display:flex; align-items:center; gap:6px;">
                 <span style="font-family:monospace; font-size:12px; font-weight:600; color:var(--text-primary);">\${c.phone}</span>
                 \${waLink ? \`<a href="\${waLink}" target="_blank" title="Abrir conversa no WhatsApp" style="display:inline-flex; align-items:center; gap:3px; font-size:10.5px; font-weight:700; background:#25D366; color:#fff; padding:2px 7px; border-radius:4px; text-decoration:none;">💬 WA</a>\` : ''}
               </div>\`
            : \`<span style="color:var(--text-muted); font-size:11px;">Sem telefone</span>\`;

        const lastTimelineItem = c.timeline && c.timeline.length > 0 ? c.timeline[c.timeline.length - 1] : null;
        const lastInteractionText = lastTimelineItem 
            ? \`\${lastTimelineItem.type === 'call' ? '📞' : lastTimelineItem.type === 'email' ? '✉️' : lastTimelineItem.type === 'meeting' ? '🤝' : '📝'} \${lastTimelineItem.description.substring(0, 24)}...\`
            : "Sem interações";

        const tr = document.createElement("tr");
        tr.style.height = "52px";
        tr.innerHTML = \`
            <td style="text-align:center;"><input type="checkbox" class="contact-checkbox" data-id="\${c.id}"></td>
            <td>
                <div class="col-contact-info" style="display:flex; align-items:center; gap:10px;">
                    <div class="contact-avatar" style="\${isAgente ? 'background:linear-gradient(135deg,#4F46E5,#06B6D4);color:#fff;font-weight:700;' : ''}">\${getInitials(c.name)}</div>
                    <div class="contact-name-company">
                        <span class="contact-name-val" style="font-weight:600; font-size:13px; color:var(--text-primary); display:flex; align-items:center; flex-wrap:wrap;">\${c.name} \${isAgenteBadge}</span>
                        <span class="contact-company-sub" style="font-size:11px; color:var(--text-muted);">\${c.company || "-"}</span>
                    </div>
                </div>
            </td>
            <td><strong style="font-size:12.5px; color:var(--text-primary);">\${c.company || "-"}</strong></td>
            <td><span class="niche-tag" style="font-size:11px; padding:3px 10px; border-radius:4px; font-weight:600; background:rgba(79,70,229,0.08); color:var(--color-primary);">\${c.niche || "Outro"}</span></td>
            <td>
                <div style="display:flex; flex-direction:column; gap:2px;">
                    \${phoneDisplay}
                    \${c.email ? \`<span style="font-size:11px; color:var(--text-secondary);">\${c.email}</span>\` : ''}
                </div>
            </td>
            <td><strong style="font-size:13px; color:#059669;">\${formatCurrency(c.value)}</strong></td>
            <td>
                <select class="select-inline-status status-\${c.status}" data-id="\${c.id}" style="
                    font-size: 11.5px;
                    font-weight: 600;
                    padding: 5px 10px;
                    border-radius: 6px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-card);
                    color: var(--text-primary);
                    cursor: pointer;
                    outline: none;
                ">
                    <option value="lead" \${c.status === 'lead' ? 'selected' : ''}>Novo Lead</option>
                    <option value="contacted" \${c.status === 'contacted' ? 'selected' : ''}>Contatado</option>
                    <option value="proposal" \${c.status === 'proposal' ? 'selected' : ''}>Proposta Enviada</option>
                    <option value="negotiating" \${c.status === 'negotiating' ? 'selected' : ''}>Em Negociação</option>
                    <option value="won" \${c.status === 'won' ? 'selected' : ''}>Ganho (Won)</option>
                    <option value="lost" \${c.status === 'lost' ? 'selected' : ''}>Perdido (Lost)</option>
                </select>
            </td>
            <td>
                <div class="contact-comm-info" style="display:flex; flex-direction:column;">
                    <span style="font-size:11.5px; font-weight:500;">\${lastInteractionText}</span>
                    <span style="font-size:10px; color:var(--text-muted);">\${lastTimelineItem ? formatDate(lastTimelineItem.timestamp) : ""}</span>
                </div>
            </td>
            <td style="text-align:right;">
                <div class="kanban-card-actions" style="display:inline-flex; gap:4px;">
                    <button class="btn-icon-only btn-send-template" title="Enviar E-mail com Modelo" style="color:var(--color-primary);"><i data-lucide="mail-plus" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-view" title="Ver Detalhes"><i data-lucide="eye" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-edit" title="Editar"><i data-lucide="edit-2" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-delete" title="Excluir"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                </div>
            </td>
        \`;

        tr.querySelector(".select-inline-status").onchange = (e) => {
            const newStatus = e.target.value;
            const prevStatus = c.status;
            c.status = newStatus;
            
            if (!c.timeline) c.timeline = [];
            c.timeline.push({
                id: "act_" + Date.now(),
                type: "note",
                description: \`Estágio atualizado na listagem para: \${translateStatus(newStatus)}\`,
                timestamp: new Date().toISOString()
            });
            
            if (newStatus === "won" && prevStatus !== "won") {
                openConversionModal(c.id);
            } else {
                saveState();
                renderAll();
            }
        };

        tr.querySelector(".btn-send-template").addEventListener("click", (e) => { e.stopPropagation(); openSendTemplateModal(null, c.id); });
        tr.querySelector(".btn-view").addEventListener("click", () => openContactDetails(c.id));
        tr.querySelector(".btn-edit").addEventListener("click", () => openEditContact(c.id));
        tr.querySelector(".btn-delete").addEventListener("click", () => deleteContact(c.id));

        if (tbody) tbody.appendChild(tr);
    });

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
}\n\n`;

    code = code.substring(0, startIdx) + newRenderContacts + code.substring(endIdx);
    fs.writeFileSync('src/app.js', code, 'utf8');
    console.log('Successfully updated renderContacts block in app.js via scratch script!');
} else {
    console.error('Indices error:', startIdx, endIdx);
}
