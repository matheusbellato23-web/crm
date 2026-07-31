const fs = require('fs');

// 1. Update index.html toolbar and table th widths
let html = fs.readFileSync('index.html', 'utf8');

const oldTableTh = `<table class="data-table" id="contactsTable">
                            <thead>
                                <tr>
                                    <th style="width: 36px; text-align: center;"><input type="checkbox" id="selectAllContacts" title="Selecionar Todos"></th>
                                    <th style="cursor: pointer;" onclick="sortContactsTable('name')">Contato <i data-lucide="arrow-up-down" style="width: 11px; height: 11px; opacity: 0.5;"></i></th>
                                    <th style="cursor: pointer;" onclick="sortContactsTable('company')">Empresa <i data-lucide="arrow-up-down" style="width: 11px; height: 11px; opacity: 0.5;"></i></th>
                                    <th style="cursor: pointer;" onclick="sortContactsTable('niche')">Nicho <i data-lucide="arrow-up-down" style="width: 11px; height: 11px; opacity: 0.5;"></i></th>
                                    <th>Contato / WhatsApp</th>
                                    <th style="cursor: pointer;" onclick="sortContactsTable('value')">Valor Estimado <i data-lucide="arrow-up-down" style="width: 11px; height: 11px; opacity: 0.5;"></i></th>
                                    <th style="cursor: pointer;" onclick="sortContactsTable('status')">Estágio <i data-lucide="arrow-up-down" style="width: 11px; height: 11px; opacity: 0.5;"></i></th>
                                    <th>Última Interação</th>
                                    <th style="text-align: right;">Ações</th>
                                </tr>
                            </thead>`;

const newTableTh = `<table class="data-table" id="contactsTable" style="width: 100%; min-width: 900px; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="width: 36px; text-align: center;"><input type="checkbox" id="selectAllContacts" title="Selecionar Todos"></th>
                                    <th style="width: 22%; cursor: pointer;" onclick="sortContactsTable('name')">Contato <i data-lucide="arrow-up-down" style="width: 11px; height: 11px; opacity: 0.5;"></i></th>
                                    <th style="width: 18%; cursor: pointer;" onclick="sortContactsTable('company')">Empresa <i data-lucide="arrow-up-down" style="width: 11px; height: 11px; opacity: 0.5;"></i></th>
                                    <th style="width: 110px; cursor: pointer;" onclick="sortContactsTable('niche')">Nicho <i data-lucide="arrow-up-down" style="width: 11px; height: 11px; opacity: 0.5;"></i></th>
                                    <th style="width: 160px;">Contato / WhatsApp</th>
                                    <th style="width: 110px; cursor: pointer;" onclick="sortContactsTable('value')">Valor Estimado <i data-lucide="arrow-up-down" style="width: 11px; height: 11px; opacity: 0.5;"></i></th>
                                    <th style="width: 140px; cursor: pointer;" onclick="sortContactsTable('status')">Estágio <i data-lucide="arrow-up-down" style="width: 11px; height: 11px; opacity: 0.5;"></i></th>
                                    <th style="width: 160px;">Última Interação</th>
                                    <th style="width: 110px; text-align: right;">Ações</th>
                                </tr>
                            </thead>`;

if (html.includes(oldTableTh)) {
    html = html.replace(oldTableTh, newTableTh);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Updated table header widths in index.html');
} else {
    console.log('table header snippet in index.html not found, searching alternative...');
}

// 2. Update renderContacts and bindContactsEngineEvents in src/app.js
let appJs = fs.readFileSync('src/app.js', 'utf8');

// Replace normalized search in renderContacts()
const searchBlockOld = `    // Apply Search Input
    if (searchVal) {
        filtered = filtered.filter(c => 
            (c.name && c.name.toLowerCase().includes(searchVal)) ||
            (c.company && c.company.toLowerCase().includes(searchVal)) ||
            (c.niche && c.niche.toLowerCase().includes(searchVal)) ||
            (c.email && c.email.toLowerCase().includes(searchVal)) ||
            (c.phone && c.phone.toLowerCase().includes(searchVal)) ||
            (c.notes && c.notes.toLowerCase().includes(searchVal))
        );
    }`;

const searchBlockNew = `    // Apply Search Input (Normalized accent-insensitive)
    if (searchVal) {
        const norm = (s) => (s || '').toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const query = norm(searchVal);

        filtered = filtered.filter(c => 
            norm(c.name).includes(query) ||
            norm(c.company).includes(query) ||
            norm(c.niche).includes(query) ||
            norm(c.email).includes(query) ||
            norm(c.phone).includes(query) ||
            norm(c.notes).includes(query)
        );
    }`;

if (appJs.includes(searchBlockOld)) {
    appJs = appJs.replace(searchBlockOld, searchBlockNew);
    console.log('Updated accent-insensitive search in app.js');
}

// Replace table row innerHTML in renderContacts() to fix layout and remove name/company redundancy
const rowOld = `        const tr = document.createElement("tr");
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
        \`;`;

const rowNew = `        const tr = document.createElement("tr");
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
        \`;`;

if (appJs.includes(rowOld)) {
    appJs = appJs.replace(rowOld, rowNew);
    console.log('Updated row HTML layout in app.js');
}

// Append bindContactsEngineEvents to end of app.js if missing
if (!appJs.includes('bindContactsEngineEvents')) {
    const bindSnippet = `\n\n// Wire Search & Filter Input Listeners for Contacts Table Engine
const bindContactsEngineEvents = () => {
    const searchInput = document.getElementById('contactsSearchInput');
    const globalSearchInput = document.getElementById('globalSearch');
    const nicheSelect = document.getElementById('contactsNicheFilter');
    const statusSelect = document.getElementById('filterStatus');
    const perPageSelect = document.getElementById('contactsPerPageSelect');

    const handleSearch = () => {
        contactsTableState.currentPage = 1;
        renderContacts();
    };

    if (searchInput) {
        searchInput.oninput = handleSearch;
        searchInput.onkeyup = handleSearch;
    }
    if (globalSearchInput) {
        globalSearchInput.oninput = handleSearch;
        globalSearchInput.onkeyup = handleSearch;
    }
    if (nicheSelect) {
        nicheSelect.onchange = handleSearch;
    }
    if (statusSelect) {
        statusSelect.onchange = handleSearch;
    }
    if (perPageSelect) {
        perPageSelect.onchange = handleSearch;
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindContactsEngineEvents);
} else {
    bindContactsEngineEvents();
}
`;
    appJs += bindSnippet;
    console.log('Appended bindContactsEngineEvents to end of app.js');
}

fs.writeFileSync('src/app.js', appJs, 'utf8');
console.log('App.js updated successfully!');
