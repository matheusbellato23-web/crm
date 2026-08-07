const fs = require('fs');

// 1. Update index.html header and tabs to display WEBCO Agency branding and platform filters
let html = fs.readFileSync('index.html', 'utf8');

const oldHeaderHtml = `<h1 class="view-title">Ativos & Canais de Marketing</h1>
                        <p class="view-subtitle">Gerencie e monitore sites, landing pages, campanhas de anúncios (Google/FB) e redes sociais ativas da empresa.</p>`;

const newHeaderHtml = `<h1 class="view-title">Estratégias de Marketing & Canais — WEBCO Agency</h1>
                        <p class="view-subtitle">Planejamento tático de captação de leads, tráfego pago (Meta/Google), automações, LinkedIn B2B e YouTube/TikTok para WEBCO Agency e Web Co. Labs.</p>`;

if (html.includes(oldHeaderHtml)) {
    html = html.replace(oldHeaderHtml, newHeaderHtml);
    console.log('Updated view title and subtitle in index.html');
}

const oldFiltersHtml = `<ul class="tasks-filters" id="marketingFilters" style="list-style:none; padding:0; display:flex; gap:8px; margin:0;">
                        <li class="active" data-marketing-filter="all">
                            <span>Todos os Ativos</span>
                        </li>
                        <li data-marketing-filter="sites">
                            <span>Sites & Landing Pages</span>
                        </li>
                        <li data-marketing-filter="ads">
                            <span>Anúncios (Google/FB)</span>
                        </li>
                        <li data-marketing-filter="organic">
                            <span>Orgânico / SEO</span>
                        </li>
                        <li data-marketing-filter="social">
                            <span>Redes Sociais & Conteúdo</span>
                        </li>
                    </ul>`;

const newFiltersHtml = `<div style="display:flex; flex-direction:column; gap:10px; width:100%;">
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
                    </div>`;

if (html.includes(oldFiltersHtml)) {
    html = html.replace(oldFiltersHtml, newFiltersHtml);
    console.log('Updated marketing filters tabs in index.html');
}

// Add Platform & Responsible fields to marketingAssetModal form in index.html
const oldModalFormRow = `<div class="form-group">
                            <label for="marketingAssetCategory">Categoria do Canal *</label>
                            <select id="marketingAssetCategory" class="form-control" required>
                                <option value="sites">🖥️ Sites & Landing Pages</option>
                                <option value="ads">📣 Anúncios Patrocinados (Google/Facebook Ads)</option>
                                <option value="organic">🔍 Tráfego Orgânico / SEO</option>
                                <option value="social">✍️ Redes Sociais & Conteúdo (Blog)</option>
                            </select>
                        </div>`;

const newModalFormRow = `<div class="form-group">
                            <label for="marketingAssetCategory">Plataforma / Canal *</label>
                            <select id="marketingAssetCategory" class="form-control" required>
                                <option value="meta">📸 Instagram / Facebook (Meta Ads, Feed, Direct)</option>
                                <option value="linkedin">💼 LinkedIn B2B (Social Selling, Ads, Artigos)</option>
                                <option value="video">🎥 YouTube / TikTok (Vídeos Longos & Curtos)</option>
                                <option value="sites">🖥️ Sites & Landing Pages (WEBCO Agency)</option>
                                <option value="ads">📣 Google Ads / Tráfego Pago</option>
                                <option value="organic">🔍 SEO / Orgânico / Google Meu Negócio</option>
                                <option value="social">💬 Direct & Automações (ManyChat / WhatsApp)</option>
                            </select>
                        </div>`;

if (html.includes(oldModalFormRow)) {
    html = html.replace(oldModalFormRow, newModalFormRow);
    console.log('Updated marketingAssetCategory dropdown in index.html');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully saved index.html!');
