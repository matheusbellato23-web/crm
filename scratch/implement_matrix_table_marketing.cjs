const fs = require('fs');

let appJs = fs.readFileSync('src/app.js', 'utf8');

// Replace renderMarketingAssets in app.js with Matrix Table + Toggle View implementation
const oldRenderFn = `function renderMarketingAssets() {
    const env = getEnv();
    const grid = document.getElementById("marketingAssetsGrid");
    const emptyState = document.getElementById("marketingEmptyState");
    if (!grid) return;
    grid.innerHTML = "";

    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    let filtered = [...env.marketingAssets];

    // Category Filter
    if (activeMarketingFilter !== "all") {
        filtered = filtered.filter(asset => asset.category === activeMarketingFilter);
    }

    // Search query Filter
    if (searchVal) {
        filtered = filtered.filter(asset => 
            asset.title.toLowerCase().includes(searchVal) ||
            (asset.metrics && asset.metrics.toLowerCase().includes(searchVal)) ||
            (asset.notes && asset.notes.toLowerCase().includes(searchVal))
        );
    }

    // Setup categories tab class
    document.querySelectorAll("#marketingFilters li").forEach(li => {
        if (li.getAttribute("data-marketing-filter") === activeMarketingFilter) {
            li.classList.add("active");
        } else {
            li.classList.remove("active");
        }
    });

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");

        filtered.forEach(asset => {
            const card = document.createElement("div");
            card.className = "marketing-card";

            // Category Details
            let iconName = "globe";
            let categoryName = "Sites & LPs";
            let categoryClass = "sites";

            if (asset.category === "ads") {
                iconName = "megaphone";
                categoryName = "Anúncios";
                categoryClass = "ads";
            } else if (asset.category === "organic") {
                iconName = "search";
                categoryName = "SEO / Orgânico";
                categoryClass = "organic";
            } else if (asset.category === "social") {
                iconName = "instagram";
                categoryName = "Social & Blog";
                categoryClass = "social";
            }

            // Status Details
            let statusText = "Ativo";
            let statusClass = "active";
            if (asset.status === "planning") {
                statusText = "Em Planejamento";
                statusClass = "warning";
            } else if (asset.status === "paused") {
                statusText = "Pausado";
                statusClass = "inactive";
            }

            let iconHtml = \`<i data-lucide="\${iconName}" style="width: 14px; height: 14px;"></i>\`;
            if (iconName === "instagram") {
                iconHtml = \`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram" style="width: 14px; height: 14px; stroke-width: 2.2px;"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>\`;
            }

            card.innerHTML = \`
                <div class="marketing-card-header" style="border-bottom:1px solid var(--border-color); padding-bottom:8px; margin-bottom:8px;">
                    <div class="marketing-card-icon-title" style="flex:1;">
                        <div class="marketing-card-icon-wrapper \${categoryClass}">
                            \${iconHtml}
                        </div>
                        <div style="display:flex; flex-direction:column; min-width:0; flex:1;">
                            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:2px;">
                                <span style="font-size:10px; font-weight:700; background:rgba(79,70,229,0.1); color:#4F46E5; padding:1px 6px; border-radius:4px;">\${asset.platform || 'WEBCO Agency'}</span>
                                \${asset.responsible ? \`<span style="font-size:10px; font-weight:700; background:rgba(6,182,212,0.1); color:#06B6D4; padding:1px 6px; border-radius:4px;">👤 \${asset.responsible}</span>\` : ''}
                            </div>
                            <span class="marketing-card-title" style="font-size:13px; font-weight:700; color:var(--text-primary);">\${asset.title || asset.channel}</span>
                            <span style="font-size:11px; color:var(--color-primary); font-weight:600;">\${asset.channel || categoryName}</span>
                        </div>
                    </div>
                    <span class="badge-status \${statusClass}" style="padding: 2px 6px; font-size: 9px; height:fit-content;">\${statusText}</span>
                </div>
                <div class="marketing-card-body" style="display:flex; flex-direction:column; gap:8px;">
                    \${asset.approach ? \`<div style="font-size:11px;"><strong style="color:var(--text-muted);">Abordagem:</strong> <span style="color:var(--text-primary); font-weight:600;">\${asset.approach}</span></div>\` : ''}

                    \${asset.format ? \`<div style="background:var(--bg-app); border:1px solid var(--border-color); padding:8px; border-radius:6px; font-size:11px; line-height:1.4;">
                        <strong style="color:var(--text-primary); display:block; margin-bottom:2px;">🎬 Formato de Conteúdo & Tarefa:</strong>
                        <span style="color:var(--text-secondary); white-space:pre-line;">\${asset.format}</span>
                    </div>\` : ''}

                    \${asset.strategy ? \`<div style="background:rgba(5,150,105,0.06); border:1px solid rgba(5,150,105,0.2); padding:8px; border-radius:6px; font-size:11px; line-height:1.4;">
                        <strong style="color:#059669; display:block; margin-bottom:2px;">🎯 Estratégia de Captação:</strong>
                        <span style="color:var(--text-primary); white-space:pre-line;">\${asset.strategy}</span>
                    </div>\` : ''}

                    \${asset.url ? \`<a href="\${asset.url}" target="_blank" class="marketing-card-link" style="font-size:11px;"><i data-lucide="external-link" style="width:11px; height:11px;"></i> \${asset.url.replace(/^https?:\\\/\\\//, '')}</a>\` : ''}
                    

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                        <span class="marketing-card-cost">Custo: <strong>\${asset.cost || "Grátis"}</strong></span>
                    </div>

                    \${asset.notes ? \`<p class="marketing-card-notes">\${asset.notes}</p>\` : ""}
                </div>
                <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid var(--border-color); padding-top:10px; margin-top:4px;">
                    <button class="btn btn-secondary btn-xs btn-edit-asset" style="padding: 2px 6px; font-size: 9px;"><i data-lucide="edit-2" style="width:10px; height:10px; margin-right:2px;"></i> Editar</button>
                    <button class="btn btn-secondary btn-xs btn-delete-asset" style="padding: 2px 6px; font-size: 9px; color:var(--color-danger); border-color:var(--color-danger-glow);"><i data-lucide="trash-2" style="width:10px; height:10px; margin-right:2px;"></i> Excluir</button>
                </div>
            \`;

            card.querySelector(".btn-edit-asset").onclick = () => openEditMarketingAsset(asset.id);
            card.querySelector(".btn-delete-asset").onclick = () => deleteMarketingAsset(asset.id);

            grid.appendChild(card);
        });
    }
    safeCreateIcons();
}`;

const newRenderFn = `let marketingDisplayMode = "table"; // 'table' or 'grid'

function setupMarketingViewModeToggle() {
    const btnTable = document.getElementById("btnMarketingViewTable");
    const btnCards = document.getElementById("btnMarketingViewCards");
    const tableViewContainer = document.getElementById("marketingTableView");
    const gridViewContainer = document.getElementById("marketingAssetsGrid");

    if (!btnTable || !btnCards) return;

    btnTable.onclick = () => {
        marketingDisplayMode = "table";
        btnTable.style.background = "var(--color-primary)";
        btnTable.style.color = "#fff";
        btnCards.style.background = "transparent";
        btnCards.style.color = "var(--text-secondary)";
        tableViewContainer.classList.remove("hidden");
        gridViewContainer.classList.add("hidden");
        renderMarketingAssets();
    };

    btnCards.onclick = () => {
        marketingDisplayMode = "grid";
        btnCards.style.background = "var(--color-primary)";
        btnCards.style.color = "#fff";
        btnTable.style.background = "transparent";
        btnTable.style.color = "var(--text-secondary)";
        gridViewContainer.classList.remove("hidden");
        tableViewContainer.classList.add("hidden");
        renderMarketingAssets();
    };
}

function renderMarketingAssets() {
    setupMarketingViewModeToggle();
    const env = getEnv();
    const grid = document.getElementById("marketingAssetsGrid");
    const tbody = document.getElementById("marketingStrategyTableBody");
    const emptyState = document.getElementById("marketingEmptyState");

    if (!grid || !tbody) return;
    grid.innerHTML = "";
    tbody.innerHTML = "";

    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    let filtered = [...env.marketingAssets];

    // Filter Logic
    if (activeMarketingFilter !== "all") {
        filtered = filtered.filter(asset => asset.category === activeMarketingFilter);
    }
    if (searchVal) {
        filtered = filtered.filter(asset => 
            (asset.title && asset.title.toLowerCase().includes(searchVal)) ||
            (asset.channel && asset.channel.toLowerCase().includes(searchVal)) ||
            (asset.format && asset.format.toLowerCase().includes(searchVal)) ||
            (asset.strategy && asset.strategy.toLowerCase().includes(searchVal))
        );
    }

    // Active Tab Styling
    document.querySelectorAll("#marketingFilters li").forEach(li => {
        if (li.getAttribute("data-marketing-filter") === activeMarketingFilter) {
            li.classList.add("active");
        } else {
            li.classList.remove("active");
        }
    });

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }
    emptyState.classList.add("hidden");

    // 1. RENDER TABLE MATRIX VIEW (CONFORME O PDF EXECUTIVO)
    filtered.forEach(asset => {
        const tr = document.createElement("tr");
        tr.style.cssText = "border-bottom: 1px solid var(--border-color); font-size: 12.5px; transition: background 0.15s ease;";
        tr.onmouseenter = () => tr.style.background = "var(--color-primary-glow)";
        tr.onmouseleave = () => tr.style.background = "transparent";

        tr.innerHTML = \`
            <td style="padding: 14px; vertical-align: top;">
                <span style="font-size:10px; font-weight:700; background:rgba(79,70,229,0.1); color:#4F46E5; padding:2px 6px; border-radius:4px; display:inline-block; margin-bottom:4px;">
                    \${asset.platform || 'WEBCO Agency'}
                </span>
                <strong style="display:block; font-size:13px; color:var(--text-primary);">\${asset.channel || asset.title}</strong>
                \${asset.url ? \`<a href="\${asset.url}" target="_blank" style="font-size:11px; color:var(--color-primary); text-decoration:none; display:inline-flex; align-items:center; gap:2px; margin-top:3px;"><i data-lucide="external-link" style="width:10px; height:10px;"></i> \${asset.url.replace(/^https?:\\\/\\\//, '')}</a>\` : ''}
            </td>
            <td style="padding: 14px; vertical-align: top;">
                <span style="font-weight:600; color:var(--text-primary); display:block;">\${asset.approach || 'Tráfego & Prospecção'}</span>
                \${asset.responsible ? \`<span style="font-size:11px; color:#06B6D4; font-weight:700; display:block; margin-top:4px;">👤 \${asset.responsible}</span>\` : ''}
            </td>
            <td style="padding: 14px; vertical-align: top; line-height: 1.5;">
                <div style="background: var(--bg-app); border: 1px solid var(--border-color); padding: 10px; border-radius: 6px;">
                    <span style="white-space: pre-line; color: var(--text-primary);">\${asset.format || 'Definição de criativos e anúncios.'}</span>
                </div>
            </td>
            <td style="padding: 14px; vertical-align: top; line-height: 1.5;">
                <div style="background: rgba(5,150,105,0.06); border: 1px solid rgba(5,150,105,0.2); padding: 10px; border-radius: 6px;">
                    <span style="white-space: pre-line; color: var(--text-primary); font-weight: 500;">\${asset.strategy || 'Captura via WhatsApp/Formulário.'}</span>
                </div>
            </td>
            <td style="padding: 14px; vertical-align: top; text-align: right;">
                <div style="display: inline-flex; gap: 4px;">
                    <button class="btn-icon-only btn-edit-asset" data-id="\${asset.id}" title="Editar Item"><i data-lucide="edit-2" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-delete-asset" data-id="\${asset.id}" title="Excluir Item" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                </div>
            </td>
        \`;

        tr.querySelector(".btn-edit-asset").onclick = () => openEditMarketingAsset(asset.id);
        tr.querySelector(".btn-delete-asset").onclick = () => deleteMarketingAsset(asset.id);

        tbody.appendChild(tr);

        // 2. RENDER CARDS GRID VIEW (FORMATO COMPACTO)
        const card = document.createElement("div");
        card.className = "marketing-card";
        card.innerHTML = \`
            <div class="marketing-card-header" style="border-bottom:1px solid var(--border-color); padding-bottom:8px; margin-bottom:8px;">
                <div style="display:flex; flex-direction:column; flex:1;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                        <span style="font-size:10px; font-weight:700; background:rgba(79,70,229,0.1); color:#4F46E5; padding:1px 6px; border-radius:4px;">\${asset.platform}</span>
                        \${asset.responsible ? \`<span style="font-size:10px; font-weight:700; color:#06B6D4;">👤 \${asset.responsible}</span>\` : ''}
                    </div>
                    <strong style="font-size:13px; color:var(--text-primary);">\${asset.channel || asset.title}</strong>
                </div>
            </div>
            <div class="marketing-card-body" style="display:flex; flex-direction:column; gap:8px; font-size:11px;">
                <div><strong style="color:var(--text-muted);">Abordagem:</strong> <span>\${asset.approach || '-'}</span></div>
                <div style="background:var(--bg-app); padding:8px; border-radius:6px; white-space:pre-line;"><strong>🎬 Formato:</strong>\n\${asset.format}</div>
                <div style="background:rgba(5,150,105,0.06); padding:8px; border-radius:6px; white-space:pre-line; color:#059669;"><strong>🎯 Captação:</strong>\n\${asset.strategy}</div>
            </div>
        \`;
        grid.appendChild(card);
    });

    safeCreateIcons();
}`;

if (appJs.includes(oldRenderFn)) {
    appJs = appJs.replace(oldRenderFn, newRenderFn);
    fs.writeFileSync('src/app.js', appJs, 'utf8');
    console.log('Successfully updated renderMarketingAssets in app.js!');
} else {
    console.error('oldRenderFn exact string not found in app.js!');
}
