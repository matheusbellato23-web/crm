const fs = require('fs');

// 1. READ INDEX.HTML & INJECT AFFILIATES SECTION + MODALS + SIDEBAR NAV
let html = fs.readFileSync('index.html', 'utf8');

// A) Add Sidebar Nav Item under CRM / Finanças
const oldSidebarNav = `<li class="nav-item" data-view="customers">
                        <i data-lucide="gem"></i>
                        <span>Clientes</span>
                    </li>`;

const newSidebarNav = `<li class="nav-item" data-view="customers">
                        <i data-lucide="gem"></i>
                        <span>Clientes</span>
                    </li>
                    <li class="nav-item" data-view="affiliates">
                        <i data-lucide="share-2"></i>
                        <span>Gestão de Afiliados</span>
                    </li>`;

if (html.includes(oldSidebarNav)) {
    html = html.replace(oldSidebarNav, newSidebarNav);
    console.log('Added Affiliates to Sidebar Navigation');
}

// B) Add Affiliate Select Dropdown to Contact Modal
const oldContactFormRow = `<div class="form-group">
                            <label for="contactNiche">Nicho do Cliente *</label>
                            <select id="contactNiche" class="form-control" required>
                                <option value="Negócio Local">Negócio Local</option>
                                <option value="E-commerce">E-commerce</option>
                                <option value="Gráfica">Gráfica</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Turismo">Turismo</option>
                                <option value="Infoproduto / Lançamentos">Infoproduto / Lançamentos</option>
                                <option value="SaaS / Startup">SaaS / Startup</option>
                                <option value="Serviços B2B">Serviços B2B</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <!-- Empty spacer -->
                        </div>`;

const newContactFormRow = `<div class="form-group">
                            <label for="contactNiche">Nicho do Cliente *</label>
                            <select id="contactNiche" class="form-control" required>
                                <option value="Negócio Local">Negócio Local</option>
                                <option value="E-commerce">E-commerce</option>
                                <option value="Gráfica">Gráfica</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Turismo">Turismo</option>
                                <option value="Infoproduto / Lançamentos">Infoproduto / Lançamentos</option>
                                <option value="SaaS / Startup">SaaS / Startup</option>
                                <option value="Serviços B2B">Serviços B2B</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="contactAffiliate">Afiliado Indicador (Opcional)</label>
                            <select id="contactAffiliate" class="form-control">
                                <option value="">Nenhum (Venda Direta)</option>
                            </select>
                        </div>`;

if (html.includes(oldContactFormRow)) {
    html = html.replace(oldContactFormRow, newContactFormRow);
    console.log('Added Affiliate selector to Contact Modal');
}

// C) Add Affiliates View HTML before documentPreviewModal
const targetViewAnchor = `<div class="modal" id="documentPreviewModal">`;

const affiliatesViewHtml = `<!-- VIEW: GESTÃO DE AFILIADOS -->
        <div class="view-section" id="affiliatesView">
            <div class="view-header flex-header">
                <div>
                    <h1 class="view-title">Programa de Afiliados</h1>
                    <p class="view-subtitle">Gestão de parceiros, controle de comissões (2% a 3%), tracking de links e faturamento gerado.</p>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <button class="btn btn-secondary" id="btnOpenAffiliateLinkGenerator" style="display:flex; align-items:center; gap:6px;">
                        <i data-lucide="link" style="width:14px;height:14px;"></i>
                        <span>Gerador de Links</span>
                    </button>
                    <button class="btn btn-primary" id="btnAddAffiliate" style="display:flex; align-items:center; gap:6px; background: linear-gradient(135deg, #4F46E5, #06B6D4);">
                        <i data-lucide="user-plus" style="width:14px;height:14px;"></i>
                        <span>Novo Afiliado</span>
                    </button>
                </div>
            </div>

            <!-- KPI Ribbon for Affiliates -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px;">
                <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-sm);">
                    <div>
                        <span style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Afiliados Ativos</span>
                        <h3 id="kpiTotalAffiliates" style="font-size: 24px; font-weight: 700; color: var(--text-primary); margin: 4px 0 0;">0</h3>
                    </div>
                    <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(79,70,229,0.1); color: #4F46E5; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="share-2" style="width: 22px; height: 22px;"></i>
                    </div>
                </div>

                <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-sm);">
                    <div>
                        <span style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Indicações no Mês</span>
                        <h3 id="kpiMonthReferrals" style="font-size: 24px; font-weight: 700; color: #06B6D4; margin: 4px 0 0;">0</h3>
                    </div>
                    <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(6,182,212,0.1); color: #06B6D4; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="users" style="width: 22px; height: 22px;"></i>
                    </div>
                </div>

                <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-sm);">
                    <div>
                        <span style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Faturamento Gerado</span>
                        <h3 id="kpiAffiliateRevenue" style="font-size: 24px; font-weight: 700; color: #059669; margin: 4px 0 0;">R$ 0</h3>
                    </div>
                    <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(5,150,105,0.1); color: #059669; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="trending-up" style="width: 22px; height: 22px;"></i>
                    </div>
                </div>

                <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-sm);">
                    <div>
                        <span style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Comissão Pendente</span>
                        <h3 id="kpiPendingCommissions" style="font-size: 24px; font-weight: 700; color: #d97706; margin: 4px 0 0;">R$ 0</h3>
                    </div>
                    <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(217,119,6,0.1); color: #d97706; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="dollar-sign" style="width: 22px; height: 22px;"></i>
                    </div>
                </div>
            </div>

            <!-- Charts Section for Affiliates -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; box-shadow: var(--shadow-sm);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                        <h4 style="margin:0; font-size:14px; font-weight:700; color:var(--text-primary);">Desempenho de Vendas por Afiliado (R$)</h4>
                        <span style="font-size:11px; color:var(--text-muted);">Ranking por Faturamento Gerado</span>
                    </div>
                    <div style="height: 230px; position: relative;">
                        <canvas id="affiliateSalesChart"></canvas>
                    </div>
                </div>

                <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; box-shadow: var(--shadow-sm);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                        <h4 style="margin:0; font-size:14px; font-weight:700; color:var(--text-primary);">Status de Pagamentos</h4>
                        <span style="font-size:11px; color:var(--text-muted);">Comissões</span>
                    </div>
                    <div style="height: 230px; position: relative;">
                        <canvas id="affiliateStatusChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Affiliates List & Filters Toolbar -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 14px; display: flex; gap: 12px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
                <div style="display: flex; gap: 10px; flex: 1; min-width: 260px; align-items: center;">
                    <div style="position: relative; flex: 1;">
                        <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: var(--text-muted);"></i>
                        <input type="text" id="affiliatesSearchInput" class="form-control" placeholder="Buscar por Afiliado, CPF/CNPJ, Código ou Chave Pix..." style="padding-left: 36px; height: 38px; font-size: 13px;">
                    </div>
                </div>

                <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                    <select id="filterAffiliateStatus" class="form-control" style="width: 160px; height: 38px; font-size: 12.5px;">
                        <option value="all">Todos os Status</option>
                        <option value="active">🟢 Ativos</option>
                        <option value="pending">🟡 Pendente Pgto</option>
                        <option value="paid">✅ Pagamentos Ok</option>
                    </select>
                </div>
            </div>

            <!-- Affiliates Table -->
            <div class="table-card" style="box-shadow: var(--shadow-sm); border-radius: var(--radius-md); overflow: hidden;">
                <div class="table-container" style="overflow-x: auto;">
                    <table class="data-table" id="affiliatesTable" style="width: 100%; min-width: 950px; border-collapse: collapse;">
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
                        </thead>
                        <tbody id="affiliatesTableBody">
                            <!-- Dynamic rows -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- MODAL: NOVO / EDITAR AFILIADO -->
        <div class="modal" id="affiliateModal">
            <div class="modal-content" style="max-width: 620px; width: 100%;">
                <div class="modal-header">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <i data-lucide="share-2" style="width:20px;height:20px;color:var(--color-primary);"></i>
                        <h3 id="affiliateModalTitle" style="margin:0;">Novo Afiliado</h3>
                    </div>
                    <button class="btn-close" id="btnCloseAffiliateModal">&times;</button>
                </div>
                <form id="affiliateForm">
                    <input type="hidden" id="affiliateFormId">
                    <div class="modal-body" style="display:flex;flex-direction:column;gap:14px;">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="affiliateName">Nome Completo / Razão Social *</label>
                                <input type="text" id="affiliateName" class="form-control" required placeholder="Ex: Carlos Oliveira Marketing">
                            </div>
                            <div class="form-group">
                                <label for="affiliateCode">Código Exclusivo (Ref) *</label>
                                <input type="text" id="affiliateCode" class="form-control" required placeholder="Ex: CARLOS10 ou ref=carlos">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="affiliateEmail">E-mail de Contato *</label>
                                <input type="email" id="affiliateEmail" class="form-control" required placeholder="afiliado@email.com">
                            </div>
                            <div class="form-group">
                                <label for="affiliatePhone">WhatsApp / Telefone *</label>
                                <input type="tel" id="affiliatePhone" class="form-control" required placeholder="(11) 98888-7777">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="affiliateDocument">CPF / CNPJ *</label>
                                <input type="text" id="affiliateDocument" class="form-control" required placeholder="000.000.000-00">
                            </div>
                            <div class="form-group">
                                <label for="affiliateCommissionRate">Taxa de Comissão (%) *</label>
                                <select id="affiliateCommissionRate" class="form-control" required>
                                    <option value="2">2.0% (Padrão)</option>
                                    <option value="2.5">2.5% (Intermediário)</option>
                                    <option value="3" selected>3.0% (Recomendado)</option>
                                    <option value="5">5.0% (Especial)</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="affiliatePixKey">Chave Pix para Pagamento *</label>
                                <input type="text" id="affiliatePixKey" class="form-control" required placeholder="E-mail, CPF, Celular ou Chave Aleatória">
                            </div>
                            <div class="form-group">
                                <label for="affiliateBankInfo">Dados Bancários / Obs (Opcional)</label>
                                <input type="text" id="affiliateBankInfo" class="form-control" placeholder="Banco Itaú, Ag 1234, C/C 56789-0">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="affiliateDiscountBenefit">Benefício para o Cliente Indicado</label>
                            <input type="text" id="affiliateDiscountBenefit" class="form-control" value="10% de desconto na hospedagem ou 1º mês grátis">
                        </div>
                    </div>
                    <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;">
                        <button type="button" class="btn btn-secondary" id="btnCancelAffiliateModal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">
                            <i data-lucide="check" style="width:14px;height:14px;"></i> Salvar Afiliado
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- MODAL: REGISTRAR PAGAMENTO DE COMISSÃO -->
        <div class="modal" id="affiliatePayoutModal">
            <div class="modal-content" style="max-width: 480px; width: 100%;">
                <div class="modal-header">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <i data-lucide="dollar-sign" style="width:20px;height:20px;color:#059669;"></i>
                        <h3 style="margin:0;">Lançar Pagamento de Comissão</h3>
                    </div>
                    <button class="btn-close" id="btnClosePayoutModal">&times;</button>
                </div>
                <form id="affiliatePayoutForm">
                    <input type="hidden" id="payoutAffiliateId">
                    <div class="modal-body" style="display:flex;flex-direction:column;gap:12px;">
                        <div style="background:var(--bg-app); border:1px solid var(--border-color); padding:12px; border-radius:8px;">
                            <span style="font-size:12px; color:var(--text-muted); display:block;">Afiliado Beneficiário:</span>
                            <strong id="payoutAffiliateName" style="font-size:14px; color:var(--text-primary); display:block;">--</strong>
                            <span id="payoutPixKey" style="font-size:12px; color:var(--color-primary); font-family:monospace; display:block; margin-top:2px;">Pix: --</span>
                        </div>

                        <div class="form-group">
                            <label for="payoutAmount">Valor Pago (R$) *</label>
                            <input type="number" step="0.01" id="payoutAmount" class="form-control" required placeholder="0.00">
                        </div>

                        <div class="form-group">
                            <label for="payoutReceipt">Comprovante / Código da Transação Pix</label>
                            <input type="text" id="payoutReceipt" class="form-control" placeholder="Ex: E12345678202608061230">
                        </div>
                    </div>
                    <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;">
                        <button type="button" class="btn btn-secondary" id="btnCancelPayoutModal">Cancelar</button>
                        <button type="submit" class="btn btn-primary" style="background:#059669; border-color:#059669;">
                            <i data-lucide="check-circle" style="width:14px;height:14px;"></i> Confirmar Pagamento Pix
                        </button>
                    </div>
                </form>
            </div>
        </div>

        ${targetViewAnchor}`;

if (html.includes(targetViewAnchor)) {
    html = html.replace(targetViewAnchor, affiliatesViewHtml);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Successfully injected Affiliates View and Modals into index.html');
} else {
    console.error('Target view anchor not found in index.html');
}
