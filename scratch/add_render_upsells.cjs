const fs = require('fs');

let appJs = fs.readFileSync('src/app.js', 'utf8');

const renderUpsellsCode = `
// Render Oportunidades Futuras (Upsell) panel
function renderUpsells(env) {
    const upsellsBody = document.getElementById('upsellsTableBody');
    const upsellsEmpty = document.getElementById('upsellsEmptyState');
    if (!upsellsBody) return;
    upsellsBody.innerHTML = '';

    if (!env.upsellOpportunities) env.upsellOpportunities = [];
    const list = env.upsellOpportunities;

    if (list.length === 0) {
        if (upsellsEmpty) upsellsEmpty.classList.remove('hidden');
        return;
    }
    if (upsellsEmpty) upsellsEmpty.classList.add('hidden');

    list.forEach(up => {
        const tr = document.createElement('tr');
        const statusBadge = up.status === 'converted' 
            ? '<span class="badge-status won">Convertido em Venda</span>'
            : up.status === 'closed'
            ? '<span class="badge-status lost">Cancelado</span>'
            : '<span class="badge-status proposal" style="background:rgba(245,158,11,0.15);color:#d97706;border:1px solid rgba(245,158,11,0.3);">💡 Interesse Aberto</span>';

        tr.innerHTML = \`
            <td><strong>\${up.company || up.contactName || '-'}</strong><br><small style="color:var(--text-muted);">\${up.contactName || ''}</small></td>
            <td><strong>\${up.serviceName || '-'}</strong></td>
            <td><strong style="color:var(--color-primary);">\${formatCurrency(up.estimatedValue || 0)}</strong></td>
            <td><span style="font-size:12px; color:var(--text-secondary);">\${up.notes || 'Sem observações'}</span></td>
            <td>\${statusBadge}</td>
            <td style="text-align: right;">
                <div class="kanban-card-actions" style="display:flex; justify-content:flex-end; gap:4px;">
                    \${up.status === 'open' ? \`<button class="btn-icon-only btn-convert-upsell" title="Converter em Serviço Ativo" style="color:var(--color-success);"><i data-lucide="check-circle" style="width:14px;height:14px;"></i></button>\` : ''}
                    <button class="btn-icon-only btn-delete-upsell" title="Excluir" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                </div>
            </td>
        \`;

        const btnConv = tr.querySelector('.btn-convert-upsell');
        if (btnConv) {
            btnConv.onclick = () => {
                up.status = 'converted';
                // Add as active customer service
                if (!env.customers) env.customers = [];
                env.customers.push({
                    id: 'cust_upsell_' + Date.now(),
                    contactId: '',
                    name: up.contactName || up.company,
                    company: up.company,
                    niche: 'Serviços B2B',
                    productName: up.serviceName,
                    value: up.estimatedValue || 0,
                    type: 'monthly',
                    status: 'active',
                    createdAt: new Date().toISOString()
                });
                saveState();
                renderAll();
                renderUpsells(env);
                showToast(\`🎉 Oportunidade "\${up.serviceName}" convertida com sucesso!\`, 'success');
            };
        }

        const btnDel = tr.querySelector('.btn-delete-upsell');
        if (btnDel) {
            btnDel.onclick = () => {
                if (confirm('Deseja remover esta oportunidade futura?')) {
                    env.upsellOpportunities = env.upsellOpportunities.filter(x => x.id !== up.id);
                    saveState();
                    renderUpsells(env);
                    showToast('Oportunidade removida.', 'info');
                }
            };
        }

        upsellsBody.appendChild(tr);
    });

    safeCreateIcons();
}

// Global button to add new Upsell opportunity
const _el_btnCreateUpsell = document.getElementById("btnCreateUpsell");
if (_el_btnCreateUpsell) {
    _el_btnCreateUpsell.onclick = () => {
        const env = getEnv();
        const company = prompt('Nome da empresa / cliente:');
        if (!company) return;
        const serviceName = prompt('Serviço / Produto de interesse (ex: Gestão de Google Ads):');
        if (!serviceName) return;
        const rawVal = prompt('Valor estimado (R$):', '400');
        const val = parseFloat(rawVal) || 0;
        const notes = prompt('Observações / Necessidade do cliente:', 'Cliente demonstrou interesse');

        if (!env.upsellOpportunities) env.upsellOpportunities = [];
        env.upsellOpportunities.push({
            id: 'upsell_' + Date.now(),
            company: company.trim(),
            contactName: company.trim(),
            serviceName: serviceName.trim(),
            estimatedValue: val,
            status: 'open',
            notes: (notes || '').trim()
        });

        saveState();
        renderUpsells(env);
        showToast('Nova oportunidade futura cadastrada!', 'success');
    };
}
`;

appJs += '\n' + renderUpsellsCode;
fs.writeFileSync('src/app.js', appJs, 'utf8');
console.log('Appended renderUpsells and btnCreateUpsell handler to app.js!');
