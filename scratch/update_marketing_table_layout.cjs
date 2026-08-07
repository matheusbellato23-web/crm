const fs = require('fs');

// 1. Update index.html to add View Switcher Buttons (Table View vs Grid Cards)
let html = fs.readFileSync('index.html', 'utf8');

const oldHeaderFilters = `<div class="header-filters" style="margin-bottom: 20px;">
                    <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                            <span style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Plataforma:</span>
                            <ul class="tasks-filters" id="marketingFilters" style="list-style:none; padding:0; display:flex; gap:6px; margin:0; flex-wrap:wrap;">
                                <li class="active" data-marketing-filter="all"><span>Todos</span></li>
                                <li data-marketing-filter="meta"><span>📸 Instagram / Facebook</span></li>
                                <li data-marketing-filter="linkedin"><span>💼 LinkedIn B2B</span></li>
                                <li data-marketing-filter="video"><span>🎥 YouTube / TikTok</span></li>
                                <li data-marketing-filter="sites"><span>🖥️ Sites & LPs</span></li>
                                <li data-marketing-filter="ads"><span>📣 Anúncios (Google/FB)</span></li>
                                <li data-marketing-filter="organic"><span>🔍 Orgânico / SEO</span></li>
                                <li data-marketing-filter="social"><span>💬 Direct & Automação</span></li>
                            </ul>
                        </div>
                    </div>
                </div>`;

const newHeaderFilters = `<div class="header-filters" style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; flex:1;">
                        <span style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Plataforma:</span>
                        <ul class="tasks-filters" id="marketingFilters" style="list-style:none; padding:0; display:flex; gap:6px; margin:0; flex-wrap:wrap;">
                            <li class="active" data-marketing-filter="all"><span>Todos</span></li>
                            <li data-marketing-filter="meta"><span>📸 Instagram / Facebook</span></li>
                            <li data-marketing-filter="linkedin"><span>💼 LinkedIn B2B</span></li>
                            <li data-marketing-filter="video"><span>🎥 YouTube / TikTok</span></li>
                            <li data-marketing-filter="sites"><span>🖥️ Sites & LPs</span></li>
                            <li data-marketing-filter="ads"><span>📣 Google Ads</span></li>
                        </ul>
                    </div>

                    <!-- View Switcher Toggle (Tabela Matriz vs Cards) -->
                    <div style="display:inline-flex; background:var(--bg-card); border:1px solid var(--border-color); padding:3px; border-radius:8px;">
                        <button id="btnMarketingViewTable" class="btn btn-xs active" style="padding:5px 12px; font-size:12px; font-weight:600; border-radius:6px; background:var(--color-primary); color:#fff; border:none; cursor:pointer;">
                            📊 Tabela Matriz PDF
                        </button>
                        <button id="btnMarketingViewCards" class="btn btn-xs" style="padding:5px 12px; font-size:12px; font-weight:600; border-radius:6px; background:transparent; color:var(--text-secondary); border:none; cursor:pointer;">
                            🎴 Cards em Grade
                        </button>
                    </div>
                </div>`;

if (html.includes(oldHeaderFilters)) {
    html = html.replace(oldHeaderFilters, newHeaderFilters);
    console.log('Updated header filters with View Switcher in index.html');
}

// Update container HTML structure to hold both Table Matrix and Cards Grid
const oldGridHtml = `<div class="marketing-assets-grid" id="marketingAssetsGrid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
                    <!-- Dynamic cards will render here -->
                </div>`;

const newGridHtml = `<!-- Table View Container (Executiva do PDF) -->
                <div id="marketingTableView" class="table-card" style="box-shadow: var(--shadow-sm); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 20px;">
                    <div class="table-container" style="overflow-x: auto;">
                        <table class="data-table" id="marketingStrategyTable" style="width: 100%; min-width: 1000px; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg-card); border-bottom: 2px solid var(--border-color);">
                                    <th style="width: 16%; padding: 12px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Plataforma & Canal</th>
                                    <th style="width: 13%; padding: 12px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Abordagem</th>
                                    <th style="width: 32%; padding: 12px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Formato de Conteúdo & Tarefas</th>
                                    <th style="width: 27%; padding: 12px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Estratégia de Captação & Papéis</th>
                                    <th style="width: 12%; padding: 12px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); text-align: right;">Ações</th>
                                </tr>
                            </thead>
                            <tbody id="marketingStrategyTableBody">
                                <!-- Dynamic rows rendered via JS -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Grid View Container -->
                <div class="marketing-assets-grid hidden" id="marketingAssetsGrid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:20px;">
                    <!-- Dynamic cards will render here -->
                </div>`;

if (html.includes(oldGridHtml)) {
    html = html.replace(oldGridHtml, newGridHtml);
    console.log('Updated marketing view layout containers in index.html');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully saved index.html!');
