const fs = require('fs');

// 1. Update index.html to add View Toggle Buttons and contactsCardsGrid container
let html = fs.readFileSync('index.html', 'utf8');

const oldPerPageContainer = `<div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 12px; color: var(--text-muted); font-weight: 500;">Exibir:</span>
                            <select id="contactsPerPageSelect" class="form-control" style="width: 80px; height: 38px; font-size: 12.5px;">
                                <option value="15">15</option>
                                <option value="25">25</option>
                                <option value="50" selected>50</option>
                                <option value="100">100</option>
                                <option value="all">Todos</option>
                            </select>
                        </div>`;

const newPerPageContainer = `<div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <span style="font-size: 11.5px; color: var(--text-muted); font-weight: 500;">Exibir:</span>
                                <select id="contactsPerPageSelect" class="form-control" style="width: 70px; height: 38px; font-size: 12px; padding: 4px 6px;">
                                    <option value="15">15</option>
                                    <option value="25">25</option>
                                    <option value="50" selected>50</option>
                                    <option value="100">100</option>
                                    <option value="all">Todos</option>
                                </select>
                            </div>

                            <!-- View Mode Toggle Buttons (Cards vs Table) -->
                            <div style="display: flex; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 2px; background: var(--bg-app); height: 38px; align-items: center;">
                                <button type="button" id="btnContactsViewCards" title="Visualização em Cards (Mobile)" style="padding: 4px 10px; font-size: 11.5px; font-weight: 600; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 4px;">
                                    <i data-lucide="layout-grid" style="width: 13px; height: 13px;"></i>
                                    <span>Cards</span>
                                </button>
                                <button type="button" id="btnContactsViewTable" class="active" title="Visualização em Tabela (Desktop)" style="padding: 4px 10px; font-size: 11.5px; font-weight: 600; border: none; background: var(--bg-card); color: var(--color-primary); cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 4px; box-shadow: var(--shadow-sm);">
                                    <i data-lucide="list" style="width: 13px; height: 13px;"></i>
                                    <span>Tabela</span>
                                </button>
                            </div>
                        </div>`;

if (html.includes(oldPerPageContainer)) {
    html = html.replace(oldPerPageContainer, newPerPageContainer);
    console.log('Added View Toggle Buttons to index.html');
}

const oldTableCard = `<div class="table-card" style="box-shadow: var(--shadow-sm); border-radius: var(--radius-md); overflow: hidden;">`;
const newTableCard = `<!-- Mobile Cards Grid Container -->
                <div id="contactsCardsGrid" class="hidden" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-bottom: 16px;"></div>

                <div class="table-card" id="contactsTableCard" style="box-shadow: var(--shadow-sm); border-radius: var(--radius-md); overflow: hidden;">`;

if (html.includes(oldTableCard)) {
    html = html.replace(oldTableCard, newTableCard);
    console.log('Added contactsCardsGrid container to index.html');
}

fs.writeFileSync('index.html', html, 'utf8');

// 2. Update renderContacts and bindContactsEngineEvents in src/app.js
let appJs = fs.readFileSync('src/app.js', 'utf8');

// Update contactsTableState definition
const oldStateDef = `let contactsTableState = {
    currentPage: 1,
    itemsPerPage: 50,
    sortColumn: 'createdAt',
    sortOrder: 'desc'
};`;

const newStateDef = `let contactsTableState = {
    currentPage: 1,
    itemsPerPage: 50,
    sortColumn: 'createdAt',
    sortOrder: 'desc',
    viewMode: 'auto' // 'auto', 'cards', 'table'
};`;

if (appJs.includes(oldStateDef)) {
    appJs = appJs.replace(oldStateDef, newStateDef);
    console.log('Updated contactsTableState definition in app.js');
}

// Find renderContacts in app.js and update rendering to support both cards grid and table
const startRenderIdx = appJs.indexOf('function renderContacts() {');
const endRenderIdx = appJs.indexOf('// 3. Kanban Pipeline Render');

if (startRenderIdx !== -1 && endRenderIdx !== -1) {
    const newRenderContactsFunc = `function renderContacts() {
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

    // Apply Search Input (Normalized accent-insensitive)
    if (searchVal) {
        const norm = (s) => (s || '').toString().toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
        const query = norm(searchVal);

        filtered = filtered.filter(c => 
            norm(c.name).includes(query) ||
            norm(c.company).includes(query) ||
            norm(c.niche).includes(query) ||
            norm(c.email).includes(query) ||
            norm(c.phone).includes(query) ||
            norm(c.notes).includes(query)
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
    const cardsGrid = document.getElementById("contactsCardsGrid");
    const tableCard = document.getElementById("contactsTableCard");
    const emptyState = document.getElementById("contactsEmptyState");
    const paginationContainer = document.getElementById("contactsPaginationContainer");

    if (tbody) tbody.innerHTML = "";
    if (cardsGrid) cardsGrid.innerHTML = "";

    if (filtered.length === 0) {
        if (emptyState) emptyState.classList.remove("hidden");
        if (tableCard) tableCard.classList.add("hidden");
        if (cardsGrid) cardsGrid.classList.add("hidden");
        if (paginationContainer) paginationContainer.style.display = "none";
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (paginationContainer) paginationContainer.style.display = "flex";

    // Determine layout mode (auto detects screen width <= 768px for cards)
    const isMobileScreen = window.innerWidth <= 768;
    const isCardsView = contactsTableState.viewMode === 'cards' || (contactsTableState.viewMode === 'auto' && isMobileScreen);

    if (isCardsView) {
        if (cardsGrid) cardsGrid.classList.remove("hidden");
        if (tableCard) tableCard.classList.add("hidden");
    } else {
        if (cardsGrid) cardsGrid.classList.add("hidden");
        if (tableCard) tableCard.classList.remove("hidden");
    }

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

    // Helper event binder for rows and cards
    const bindRowActions = (element, c) => {
        const statusSelect = element.querySelector(".select-inline-status");
        if (statusSelect) {
            statusSelect.onchange = (e) => {
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
        }

        const btnSend = element.querySelector(".btn-send-template");
        if (btnSend) btnSend.addEventListener("click", (e) => { e.stopPropagation(); openSendTemplateModal(null, c.id); });
        
        const btnView = element.querySelector(".btn-view");
        if (btnView) btnView.addEventListener("click", () => openContactDetails(c.id));
        
        const btnEdit = element.querySelector(".btn-edit");
        if (btnEdit) btnEdit.addEventListener("click", () => openEditContact(c.id));
        
        const btnDelete = element.querySelector(".btn-delete");
        if (btnDelete) btnDelete.addEventListener("click", () => deleteContact(c.id));
    };

    // Render Items
    paginatedItems.forEach(c => {
        const isAgente = c.source === 'Agente Comercial' || (c.id && c.id.includes('agente')) || (c.notes && c.notes.toLowerCase().includes('agente'));
        const isAgenteBadge = isAgente ? \`<span style="font-size:10px;background:rgba(79,70,229,0.1);color:#4F46E5;border:1px solid rgba(79,70,229,0.3);padding:2px 6px;border-radius:99px;font-weight:600;display:inline-flex;align-items:center;gap:2px;">🤖 AI</span>\` : '';
        
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

        if (isCardsView) {
            // Render Mobile Card Item
            const card = document.createElement("div");
            card.className = "contact-card-item";
            card.style.cssText = "background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; display: flex; flex-direction: column; gap: 10px; box-shadow: var(--shadow-sm);";
            card.innerHTML = \`
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                        <input type="checkbox" class="contact-checkbox" data-id="\${c.id}" style="cursor: pointer;">
                        <div class="contact-avatar" style="width: 36px; height: 36px; font-size: 11px; flex-shrink: 0; \${isAgente ? 'background:linear-gradient(135deg,#4F46E5,#06B6D4);color:#fff;font-weight:700;' : ''}">\${getInitials(c.name)}</div>
                        <div style="min-width: 0; flex: 1;">
                            <span style="font-weight: 700; font-size: 13px; color: var(--text-primary); display: flex; align-items: center; gap: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${c.name} \${isAgenteBadge}</span>
                            <span style="font-size: 11.5px; color: var(--text-muted); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${c.company || 'Empresa não informada'}</span>
                        </div>
                    </div>
                    <span class="niche-tag" style="font-size: 10.5px; padding: 2px 7px; border-radius: 4px; font-weight: 600; background: rgba(79,70,229,0.08); color: var(--color-primary); flex-shrink: 0;">\${c.niche || 'Outro'}</span>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; background: var(--bg-app); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color);">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        \${waLink ? \`<a href="\${waLink}" target="_blank" title="Abrir WhatsApp" style="display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; background: #25D366; color: #fff; padding: 3px 8px; border-radius: 4px; text-decoration: none;">💬 WA</a>\` : ''}
                        <span style="font-family: monospace; font-size: 12px; font-weight: 600; color: var(--text-primary);">\${c.phone || 'Sem telefone'}</span>
                    </div>
                    <strong style="font-size: 13px; color: #059669;">\${formatCurrency(c.value)}</strong>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 11.5px;">
                    <select class="select-inline-status status-\${c.status}" data-id="\${c.id}" style="
                        font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 5px;
                        border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); outline: none; flex: 1;
                    ">
                        <option value="lead" \${c.status === 'lead' ? 'selected' : ''}>Novo Lead</option>
                        <option value="contacted" \${c.status === 'contacted' ? 'selected' : ''}>Contatado</option>
                        <option value="proposal" \${c.status === 'proposal' ? 'selected' : ''}>Proposta Enviada</option>
                        <option value="negotiating" \${c.status === 'negotiating' ? 'selected' : ''}>Em Negociação</option>
                        <option value="won" \${c.status === 'won' ? 'selected' : ''}>Ganho (Won)</option>
                        <option value="lost" \${c.status === 'lost' ? 'selected' : ''}>Perdido (Lost)</option>
                    </select>

                    <div class="kanban-card-actions" style="display: inline-flex; gap: 3px; flex-shrink: 0;">
                        <button class="btn-icon-only btn-send-template" title="Enviar E-mail" style="color:var(--color-primary); width:28px; height:28px;"><i data-lucide="mail-plus" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-view" title="Ver Detalhes" style="width:28px; height:28px;"><i data-lucide="eye" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-edit" title="Editar" style="width:28px; height:28px;"><i data-lucide="edit-2" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-delete" title="Excluir" style="width:28px; height:28px;"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </div>
            \`;

            bindRowActions(card, c);
            if (cardsGrid) cardsGrid.appendChild(card);
        } else {
            // Render Table Row
            const tr = document.createElement("tr");
            tr.style.cssText = "height: 48px; border-bottom: 1px solid var(--border-color);";
            tr.innerHTML = \`
                <td style="text-align:center; width:36px;"><input type="checkbox" class="contact-checkbox" data-id="\${c.id}"></td>
                <td>
                    <div class="col-contact-info" style="display:flex; align-items:center; gap:8px;">
                        <div class="contact-avatar" style="width:32px; height:32px; font-size:11px; flex-shrink:0; \${isAgente ? 'background:linear-gradient(135deg,#4F46E5,#06B6D4);color:#fff;font-weight:700;' : ''}">\${getInitials(c.name)}</div>
                        <div style="min-width:0; flex:1;">
                            <span style="font-weight:600; font-size:12.5px; color:var(--text-primary); display:inline-flex; align-items:center; gap:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="\${c.name}">\${c.name} \${isAgenteBadge}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span style="font-size:12.5px; font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block;" title="\${c.company || '-'}">\${c.company || "-"}</span>
                </td>
                <td><span class="niche-tag" style="font-size:10.5px; padding:2px 8px; border-radius:4px; font-weight:600; background:rgba(79,70,229,0.08); color:var(--color-primary); white-space:nowrap;">\${c.niche || "Outro"}</span></td>
                <td>
                    <div style="display:flex; flex-direction:column; gap:1px;">
                        \${phoneDisplay}
                        \${c.email ? \`<span style="font-size:10.5px; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px;" title="\${c.email}">\${c.email}</span>\` : ''}
                    </div>
                </td>
                <td><strong style="font-size:12.5px; color:#059669; white-space:nowrap;">\${formatCurrency(c.value)}</strong></td>
                <td>
                    <select class="select-inline-status status-\${c.status}" data-id="\${c.id}" style="
                        font-size: 11px;
                        font-weight: 600;
                        padding: 3px 8px;
                        border-radius: 5px;
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
                    <div class="contact-comm-info" style="display:flex; flex-direction:column; max-width:160px;">
                        <span style="font-size:11px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="\${lastTimelineItem ? lastTimelineItem.description : 'Sem interações'}">\${lastInteractionText}</span>
                        <span style="font-size:9.5px; color:var(--text-muted);">\${lastTimelineItem ? formatDate(lastTimelineItem.timestamp) : ""}</span>
                    </div>
                </td>
                <td style="text-align:right;">
                    <div class="kanban-card-actions" style="display:inline-flex; gap:2px;">
                        <button class="btn-icon-only btn-send-template" title="Enviar E-mail com Modelo" style="color:var(--color-primary); width:26px; height:26px;"><i data-lucide="mail-plus" style="width:13px;height:13px;"></i></button>
                        <button class="btn-icon-only btn-view" title="Ver Detalhes" style="width:26px; height:26px;"><i data-lucide="eye" style="width:13px;height:13px;"></i></button>
                        <button class="btn-icon-only btn-edit" title="Editar" style="width:26px; height:26px;"><i data-lucide="edit-2" style="width:13px;height:13px;"></i></button>
                        <button class="btn-icon-only btn-delete" title="Excluir" style="width:26px; height:26px;"><i data-lucide="trash-2" style="width:13px;height:13px;"></i></button>
                    </div>
                </td>
            \`;

            bindRowActions(tr, c);
            if (tbody) tbody.appendChild(tr);
        }
    });

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
}\n\n`;

    appJs = appJs.substring(0, startRenderIdx) + newRenderContactsFunc + appJs.substring(endRenderIdx);
    console.log('Replaced renderContacts function in app.js with dual cards/table mode');
} else {
    console.error('Indices for renderContacts not found in app.js', startRenderIdx, endRenderIdx);
}

// Update bindContactsEngineEvents in app.js to bind view mode buttons
const bindOld = `const bindContactsEngineEvents = () => {`;
const bindNew = `const bindContactsEngineEvents = () => {
    const btnCards = document.getElementById('btnContactsViewCards');
    const btnTable = document.getElementById('btnContactsViewTable');

    if (btnCards && btnTable) {
        btnCards.onclick = () => {
            contactsTableState.viewMode = 'cards';
            btnCards.classList.add('active');
            btnCards.style.cssText = 'padding: 4px 10px; font-size: 11.5px; font-weight: 600; border: none; background: var(--bg-card); color: var(--color-primary); cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 4px; box-shadow: var(--shadow-sm);';
            btnTable.classList.remove('active');
            btnTable.style.cssText = 'padding: 4px 10px; font-size: 11.5px; font-weight: 600; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 4px;';
            renderContacts();
        };

        btnTable.onclick = () => {
            contactsTableState.viewMode = 'table';
            btnTable.classList.add('active');
            btnTable.style.cssText = 'padding: 4px 10px; font-size: 11.5px; font-weight: 600; border: none; background: var(--bg-card); color: var(--color-primary); cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 4px; box-shadow: var(--shadow-sm);';
            btnCards.classList.remove('active');
            btnCards.style.cssText = 'padding: 4px 10px; font-size: 11.5px; font-weight: 600; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 4px;';
            renderContacts();
        };
    }`;

if (appJs.includes(bindOld)) {
    appJs = appJs.replace(bindOld, bindNew);
    console.log('Updated bindContactsEngineEvents with view toggle listeners');
}

fs.writeFileSync('src/app.js', appJs, 'utf8');
console.log('App.js updated successfully!');
