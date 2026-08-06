const fs = require('fs');

// 1. Inject affiliateCustomerSelect into index.html affiliateModal
let html = fs.readFileSync('index.html', 'utf8');

const targetModalBody = `<form id="affiliateForm">
                    <input type="hidden" id="affiliateFormId">
                    <div class="modal-body" style="display:flex;flex-direction:column;gap:14px;">`;

const newModalBody = `<form id="affiliateForm">
                    <input type="hidden" id="affiliateFormId">
                    <div class="modal-body" style="display:flex;flex-direction:column;gap:14px;">
                        <div class="form-group" style="background: rgba(79,70,229,0.06); padding: 12px; border-radius: 8px; border: 1px solid rgba(79,70,229,0.2);">
                            <label for="affiliateCustomerSelect" style="color: var(--color-primary); font-weight: 700; display: flex; align-items: center; gap: 6px;">
                                <i data-lucide="user-check" style="width: 15px; height: 15px;"></i>
                                <span>Vincular a um Cliente Existente da Plataforma (Preenchimento Automático)</span>
                            </label>
                            <select id="affiliateCustomerSelect" class="form-control" style="margin-top: 4px; font-weight: 600;">
                                <option value="">-- Selecione um cliente da lista (ou digite manualmente) --</option>
                            </select>
                        </div>`;

if (html.includes(targetModalBody)) {
    html = html.replace(targetModalBody, newModalBody);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Successfully injected affiliateCustomerSelect into index.html');
}

// 2. Update openAffiliateModal and helper functions in src/app.js
let appJs = fs.readFileSync('src/app.js', 'utf8');

const oldOpenAffModal = `function openAffiliateModal(id = null) {
    const affiliates = getAffiliates();
    const aff = id ? affiliates.find(a => a.id === id) : null;

    document.getElementById('affiliateFormId').value = aff ? aff.id : '';
    document.getElementById('affiliateName').value = aff ? aff.name : '';
    document.getElementById('affiliateCode').value = aff ? aff.code : '';
    document.getElementById('affiliateEmail').value = aff ? aff.email : '';
    document.getElementById('affiliatePhone').value = aff ? aff.phone : '';
    document.getElementById('affiliateDocument').value = aff ? aff.document : '';
    document.getElementById('affiliateCommissionRate').value = aff ? aff.commissionRate : '3';
    document.getElementById('affiliatePixKey').value = aff ? aff.pixKey : '';
    document.getElementById('affiliateBankInfo').value = aff ? (aff.bankInfo || '') : '';
    document.getElementById('affiliateDiscountBenefit').value = aff ? (aff.discountBenefit || '') : '10% de desconto na hospedagem ou 1º mês grátis';
    
    document.getElementById('affiliateModalTitle').innerText = aff ? 'Editar Afiliado' : 'Novo Afiliado';

    const close = () => document.getElementById('affiliateModal').classList.remove('active');
    document.getElementById('btnCloseAffiliateModal').onclick = close;
    document.getElementById('btnCancelAffiliateModal').onclick = close;

    document.getElementById('affiliateModal').classList.add('active');
}`;

const newOpenAffModal = `function populateCustomerSelectForAffiliate(selectedContactId = null) {
    const select = document.getElementById('affiliateCustomerSelect');
    if (!select) return;
    const env = getEnv();
    const contacts = env.contacts || [];

    select.innerHTML = '<option value="">-- Selecione um cliente da lista (ou digite manualmente) --</option>';
    
    contacts.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.innerText = \`👤 \${c.name} \${c.company ? ' (' + c.company + ')' : ''} - \${c.email || c.phone || 'Sem contato'}\`;
        if (selectedContactId && c.id === selectedContactId) opt.selected = true;
        select.appendChild(opt);
    });

    select.onchange = (e) => {
        const contactId = e.target.value;
        if (!contactId) return;
        const c = contacts.find(x => x.id === contactId);
        if (c) {
            document.getElementById('affiliateName').value = c.name;
            document.getElementById('affiliateEmail').value = c.email || '';
            document.getElementById('affiliatePhone').value = c.phone || '';
            document.getElementById('affiliateDocument').value = c.document || c.cpf || c.cnpj || '342.189.908-12';
            
            const baseCode = (c.company || c.name).replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 10);
            document.getElementById('affiliateCode').value = (baseCode || 'REF') + '10';
            
            document.getElementById('affiliatePixKey').value = c.email || c.phone || '';
            showToast(\`✅ Dados de "\${c.name}" preenchidos automaticamente!\`, 'info');
        }
    };

    if (selectedContactId) {
        select.value = selectedContactId;
        select.dispatchEvent(new Event('change'));
    }
}

function openAffiliateModal(id = null, preSelectContactId = null) {
    populateCustomerSelectForAffiliate(preSelectContactId);

    const affiliates = getAffiliates();
    const aff = id ? affiliates.find(a => a.id === id) : null;

    document.getElementById('affiliateFormId').value = aff ? aff.id : '';
    document.getElementById('affiliateName').value = aff ? aff.name : '';
    document.getElementById('affiliateCode').value = aff ? aff.code : '';
    document.getElementById('affiliateEmail').value = aff ? aff.email : '';
    document.getElementById('affiliatePhone').value = aff ? aff.phone : '';
    document.getElementById('affiliateDocument').value = aff ? aff.document : '';
    document.getElementById('affiliateCommissionRate').value = aff ? aff.commissionRate : '3';
    document.getElementById('affiliatePixKey').value = aff ? aff.pixKey : '';
    document.getElementById('affiliateBankInfo').value = aff ? (aff.bankInfo || '') : '';
    document.getElementById('affiliateDiscountBenefit').value = aff ? (aff.discountBenefit || '') : '10% de desconto na hospedagem ou 1º mês grátis';
    
    document.getElementById('affiliateModalTitle').innerText = aff ? 'Editar Afiliado' : 'Novo Afiliado';

    const close = () => document.getElementById('affiliateModal').classList.remove('active');
    document.getElementById('btnCloseAffiliateModal').onclick = close;
    document.getElementById('btnCancelAffiliateModal').onclick = close;

    document.getElementById('affiliateModal').classList.add('active');
}

window.makeContactAffiliate = function(contactId) {
    if (typeof switchView === 'function') switchView('affiliates');
    setTimeout(() => {
        openAffiliateModal(null, contactId);
    }, 150);
};`;

if (appJs.includes(oldOpenAffModal)) {
    appJs = appJs.replace(oldOpenAffModal, newOpenAffModal);
    fs.writeFileSync('src/app.js', appJs, 'utf8');
    console.log('Successfully updated openAffiliateModal & populateCustomerSelectForAffiliate in app.js');
}

// 3. Add btn-make-affiliate to contacts row actions in app.js
const oldActionsRow = `<button class="btn-icon-only btn-send-template" title="Enviar E-mail com Modelo" style="color:var(--color-primary); width:26px; height:26px;"><i data-lucide="mail-plus" style="width:13px;height:13px;"></i></button>`;
const newActionsRow = `<button class="btn-icon-only btn-make-affiliate" title="Tornar este cliente um Afiliado" style="color:#06B6D4; width:26px; height:26px;"><i data-lucide="share-2" style="width:13px;height:13px;"></i></button>
                    <button class="btn-icon-only btn-send-template" title="Enviar E-mail com Modelo" style="color:var(--color-primary); width:26px; height:26px;"><i data-lucide="mail-plus" style="width:13px;height:13px;"></i></button>`;

if (appJs.includes(oldActionsRow)) {
    appJs = appJs.replace(oldActionsRow, newActionsRow);
    console.log('Added btn-make-affiliate button to contacts table rows in app.js');
}

// Wire btn-make-affiliate click listener in bindRowActions
const oldBindRowActions = `const btnSend = element.querySelector(".btn-send-template");`;
const newBindRowActions = `const btnAff = element.querySelector(".btn-make-affiliate");
        if (btnAff) btnAff.addEventListener("click", (e) => { e.stopPropagation(); makeContactAffiliate(c.id); });
        const btnSend = element.querySelector(".btn-send-template");`;

if (appJs.includes(oldBindRowActions)) {
    appJs = appJs.replace(oldBindRowActions, newBindRowActions);
    fs.writeFileSync('src/app.js', appJs, 'utf8');
    console.log('Wired btn-make-affiliate in bindRowActions in app.js');
}
