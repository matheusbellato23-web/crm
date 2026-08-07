const fs = require('fs');

// 1. Update table headers in index.html to simplify primary view
let html = fs.readFileSync('index.html', 'utf8');

const oldTableHead = `<table class="data-table" id="affiliatesTable" style="width: 100%; min-width: 950px; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="width: 22%;">Afiliado / Contato</th>
                                <th style="width: 14%;">CPF / CNPJ & Pix</th>
                                <th style="width: 14%;">Código / Cupom</th>
                                <th style="width: 10%; text-align: center;">Taxa (%)</th>
                                <th style="width: 10%; text-align: center;">Leads / Vendas</th>
                                <th style="width: 12%;">Faturamento</th>
                                <th style="width: 12%;">Comissão</th>
                                <th style="width: 120px; text-align: right;">Ações</th>
                            </tr>
                        </thead>`;

const newTableHead = `<table class="data-table" id="affiliatesTable" style="width: 100%; min-width: 900px; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="width: 30%;">Afiliado (Clique para Expandir 🔽)</th>
                                <th style="width: 14%; text-align: center;">Taxa (%)</th>
                                <th style="width: 14%; text-align: center;">Leads / Vendas</th>
                                <th style="width: 14%;">Faturamento</th>
                                <th style="width: 14%;">Comissão</th>
                                <th style="width: 140px; text-align: right;">Ações</th>
                            </tr>
                        </thead>`;

if (html.includes(oldTableHead)) {
    html = html.replace(oldTableHead, newTableHead);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Successfully updated affiliatesTable headers in index.html');
}

// 2. Update renderAffiliates in src/app.js to create expandable detail row
let appJs = fs.readFileSync('src/app.js', 'utf8');

const oldRowRendering = `    filtered.forEach(aff => {
        const tr = document.createElement('tr');
        tr.style.cssText = "height: 52px; border-bottom: 1px solid var(--border-color);";
        tr.innerHTML = \`
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <div class="contact-avatar" style="width:34px; height:34px; font-size:11px; flex-shrink:0; background:linear-gradient(135deg, #4F46E5, #06B6D4); color:#fff; font-weight:700;">\${getInitials(aff.name)}</div>
                    <div style="min-width:0; flex:1;">
                        <span style="font-weight:700; font-size:13px; color:var(--text-primary); display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="\${aff.name}">\${aff.name}</span>
                        <span style="font-size:11px; color:var(--text-muted);">\${aff.email} • \${aff.phone}</span>
                    </div>
                </div>
            </td>
            <td>
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <span style="font-size:12px; font-weight:600; color:var(--text-primary);">\${aff.document}</span>
                    <span style="font-size:10.5px; color:var(--color-primary); font-family:monospace;" title="Chave Pix">🔑 \${aff.pixKey}</span>
                </div>
            </td>
            <td>
                <span style="display:inline-flex; align-items:center; gap:4px; font-family:monospace; font-size:12px; font-weight:700; background:rgba(79,70,229,0.1); color:#4F46E5; padding:3px 8px; border-radius:5px; border:1px solid rgba(79,70,229,0.2);">
                    🏷️ \${aff.code}
                </span>
            </td>
            <td style="text-align:center;">
                <span style="font-size:12.5px; font-weight:700; color:#06B6D4;">\${aff.commissionRate}%</span>
            </td>
            <td style="text-align:center;">
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <span style="font-size:12.5px; font-weight:700; color:var(--text-primary);">\${aff._leadCount} leads</span>
                    <span style="font-size:10px; color:#059669; font-weight:600;">\${aff._wonCount} fechados</span>
                </div>
            </td>
            <td>
                <strong style="font-size:13px; color:#059669;">\${formatCurrency(aff._revenue)}</strong>
            </td>
            <td>
                <div style="display:flex; flex-direction:column;">
                    <span style="font-size:13px; font-weight:700; color:var(--text-primary);">\${formatCurrency(aff._earned)}</span>
                    <span style="font-size:10.5px; color:\${aff._pending > 0 ? '#d97706' : '#059669'}; font-weight:600;">
                        \${aff._pending > 0 ? \`⏳ \${formatCurrency(aff._pending)} pendente\` : \`✅ Pago (\${formatCurrency(aff._paid)})\`}
                    </span>
                </div>
            </td>
            <td style="text-align:right;">
                <div style="display:inline-flex; gap:4px;">
                    <button class="btn-icon-only btn-payout-aff" data-id="\${aff.id}" title="Lançar Pagamento Pix" style="color:#059669; background:rgba(5,150,105,0.1); border-radius:4px;"><i data-lucide="dollar-sign" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-edit-aff" data-id="\${aff.id}" title="Editar Afiliado"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-delete-aff" data-id="\${aff.id}" title="Excluir Afiliado" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                </div>
            </td>
        \`;

        tr.querySelector('.btn-payout-aff').onclick = () => openAffiliatePayoutModal(aff.id);
        tr.querySelector('.btn-edit-aff').onclick = () => openAffiliateModal(aff.id);
        tr.querySelector('.btn-delete-aff').onclick = () => deleteAffiliate(aff.id);

        tbody.appendChild(tr);
    });`;

const newRowRendering = `    filtered.forEach(aff => {
        const tr = document.createElement('tr');
        tr.style.cssText = "height: 54px; border-bottom: 1px solid var(--border-color); cursor: pointer;";
        tr.className = "affiliate-main-row";
        tr.innerHTML = \`
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button class="btn-toggle-detail" style="background:none; border:none; color:var(--color-primary); cursor:pointer; font-size:12px; padding:2px 4px;">▶</button>
                    <div class="contact-avatar" style="width:34px; height:34px; font-size:11px; flex-shrink:0; background:linear-gradient(135deg, #4F46E5, #06B6D4); color:#fff; font-weight:700;">\${getInitials(aff.name)}</div>
                    <div style="min-width:0; flex:1;">
                        <span style="font-weight:700; font-size:13.5px; color:var(--text-primary); display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="\${aff.name}">\${aff.name}</span>
                        <span style="font-size:11px; color:var(--text-muted);">Clique para ver dados bancários e link de afiliado</span>
                    </div>
                </div>
            </td>
            <td style="text-align:center;">
                <span style="font-size:13px; font-weight:700; color:#06B6D4; background:rgba(6,182,212,0.08); padding:4px 8px; border-radius:6px;">\${aff.commissionRate}%</span>
            </td>
            <td style="text-align:center;">
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <span style="font-size:12.5px; font-weight:700; color:var(--text-primary);">\${aff._leadCount} leads</span>
                    <span style="font-size:10px; color:#059669; font-weight:600;">\${aff._wonCount} fechados</span>
                </div>
            </td>
            <td>
                <strong style="font-size:13px; color:#059669;">\${formatCurrency(aff._revenue)}</strong>
            </td>
            <td>
                <div style="display:flex; flex-direction:column;">
                    <span style="font-size:13px; font-weight:700; color:var(--text-primary);">\${formatCurrency(aff._earned)}</span>
                    <span style="font-size:10.5px; color:\${aff._pending > 0 ? '#d97706' : '#059669'}; font-weight:600;">
                        \${aff._pending > 0 ? \`⏳ \${formatCurrency(aff._pending)} pendente\` : \`✅ Pago (\${formatCurrency(aff._paid)})\`}
                    </span>
                </div>
            </td>
            <td style="text-align:right;">
                <div style="display:inline-flex; gap:4px;" onclick="event.stopPropagation();">
                    <button class="btn-icon-only btn-payout-aff" data-id="\${aff.id}" title="Lançar Pagamento Pix" style="color:#059669; background:rgba(5,150,105,0.1); border-radius:4px;"><i data-lucide="dollar-sign" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-edit-aff" data-id="\${aff.id}" title="Editar Afiliado"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-delete-aff" data-id="\${aff.id}" title="Excluir Afiliado" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                </div>
            </td>
        \`;

        // Create Expandable Detail Row
        const detailTr = document.createElement('tr');
        detailTr.className = "affiliate-detail-row hidden";
        detailTr.style.cssText = "background: rgba(79,70,229,0.03); border-bottom: 1px solid var(--border-color);";
        detailTr.innerHTML = \`
            <td colspan="6" style="padding: 16px 20px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; background: var(--bg-card); border: 1px solid var(--border-color); padding: 14px; border-radius: 8px;">
                    <div>
                        <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">👤 Perfil & Contato</span>
                        <strong style="display: block; font-size: 13px; color: var(--text-primary); margin-top: 2px;">\${aff.name}</strong>
                        <span style="font-size: 11.5px; color: var(--text-secondary); display: block;">E-mail: \${aff.email}</span>
                        <span style="font-size: 11.5px; color: var(--text-secondary); display: block;">WhatsApp: \${aff.phone}</span>
                    </div>

                    <div>
                        <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">💳 Dados Bancários & Pix</span>
                        <strong style="display: block; font-size: 12.5px; color: var(--color-primary); font-family: monospace; margin-top: 2px;">🔑 Pix: \${aff.pixKey}</strong>
                        <span style="font-size: 11.5px; color: var(--text-secondary); display: block;">Documento: \${aff.document}</span>
                        <span style="font-size: 11.5px; color: var(--text-muted); display: block;">\${aff.bankInfo || 'Sem obs bancária'}</span>
                    </div>

                    <div>
                        <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">🏷️ Código & Link Exclusivo</span>
                        <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
                            <span style="font-family: monospace; font-size: 12px; font-weight: 700; background: rgba(79,70,229,0.1); color: #4F46E5; padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(79,70,229,0.2);">
                                \${aff.code}
                            </span>
                            <button class="btn btn-secondary btn-copy-aff-link" data-code="\${aff.code}" style="padding: 3px 8px; font-size: 11px; height: 26px;">📋 Copiar Link</button>
                        </div>
                        <small style="font-size:10.5px; color:var(--text-muted); display:block; margin-top:4px;">https://webcolabs.com.br/?ref=\${aff.code}</small>
                    </div>

                    <div>
                        <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">🎁 Benefício do Cliente Indicado</span>
                        <span style="display: block; font-size: 12px; font-weight: 600; color: #059669; margin-top: 4px;">\${aff.discountBenefit || '10% de desconto'}</span>
                    </div>
                </div>
            </td>
        \`;

        // Toggle Expand Event
        const toggleBtn = tr.querySelector('.btn-toggle-detail');
        const toggleRow = () => {
            const isHidden = detailTr.classList.contains('hidden');
            detailTr.classList.toggle('hidden', !isHidden);
            toggleBtn.innerText = isHidden ? '▼' : '▶';
        };

        tr.onclick = toggleRow;

        // Button Click Event Handlers
        tr.querySelector('.btn-payout-aff').onclick = () => openAffiliatePayoutModal(aff.id);
        tr.querySelector('.btn-edit-aff').onclick = () => openAffiliateModal(aff.id);
        tr.querySelector('.btn-delete-aff').onclick = () => deleteAffiliate(aff.id);

        detailTr.querySelector('.btn-copy-aff-link').onclick = (e) => {
            e.stopPropagation();
            const link = \`https://webcolabs.com.br/?ref=\${aff.code}\`;
            navigator.clipboard.writeText(link);
            showToast(\`📋 Link do Afiliado \${aff.name} copiado!\`, 'success');
        };

        tbody.appendChild(tr);
        tbody.appendChild(detailTr);
    });`;

if (appJs.includes(oldRowRendering)) {
    appJs = appJs.replace(oldRowRendering, newRowRendering);
    fs.writeFileSync('src/app.js', appJs, 'utf8');
    console.log('Successfully updated renderAffiliates with expandable details row in app.js!');
} else {
    console.error('oldRowRendering string not found in app.js!');
}
