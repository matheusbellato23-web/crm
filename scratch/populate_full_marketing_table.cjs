const fs = require('fs');

let appJs = fs.readFileSync('src/app.js', 'utf8');

// Complete marketing strategy list from the 5-page PDF document for WEBCO Agency
const webcoStrategies = [
    // 📸 INSTAGRAM / FACEBOOK
    {
        id: "strat_meta_1",
        platform: "Instagram / Facebook",
        channel: "Meta Ads (Anúncios Pagos)",
        approach: "Direct / Tráfego Pago",
        format: "Anúncios em Vídeo ou Carrossel ofertando diagnóstico ou orçamento.\n🟢 Criar publicações e carrosséis com apoio da IA - LUCAS",
        strategy: "Direcionar para formulário nativo do Facebook/Instagram ou diretamente para o WhatsApp.\n🟢 Usar uma isca para vender produto gratuito para receber dados de leads via formulário.\n• PRODUTO: Lucas\n• ISCA E FORMULÁRIO: Matheus",
        category: "meta",
        responsible: "Lucas & Matheus",
        status: "active",
        url: "https://facebook.com/adsmanager",
        metrics: "Formulário Nativo + WhatsApp Direct",
        cost: "Orçamento Flexível"
    },
    {
        id: "strat_meta_2",
        platform: "Instagram / Facebook",
        channel: "Feed & Stories (Orgânico)",
        approach: "Atração Visual & Prova Social",
        format: "Bastidores, cases de sucesso, demonstrações e antes/depois.\n🟢 Criar links de demonstração - MATHEUS\n🟢 Criar CTAs e cases de sucesso do antes e depois - LUCAS",
        strategy: "CTAs claras nas legendas e Stories ('Comente X para receber o link' ou 'Clique na bio').\n🟢 Utilizar os Ads no sistema - Matheus",
        category: "meta",
        responsible: "Lucas & Matheus",
        status: "active",
        url: "https://instagram.com/webcoagency.site",
        metrics: "Prova Social & Engagement",
        cost: "Orgânico"
    },
    {
        id: "strat_meta_3",
        platform: "Instagram / Facebook",
        channel: "Direct & Automação",
        approach: "Resposta Rápida e Qualificação",
        format: "Mensagens automáticas (ex: via ManyChat) ao receber comentários.\n🟢 Criar agente de WhatsApp para responder e exibir menus para realizar pedidos ou conversar com atendente (nós)",
        strategy: "Resposta imediata 24/7 com envio do link de atendimento ou formulário de qualificação.",
        category: "social",
        responsible: "Matheus & Lucas",
        status: "active",
        url: "https://manychat.com",
        metrics: "Automação 24/7",
        cost: "Ferramenta SaaS"
    },

    // 🏪 FACEBOOK MARKETPLACE & GRUPOS
    {
        id: "strat_fb_1",
        platform: "Facebook",
        channel: "Marketplace",
        approach: "Venda Direta / Oferta Local",
        format: "Anúncios dos sites.\n🟢 Criar diferentes tipos de anúncios e testar cada um deles - LUCAS E MATHEUS",
        strategy: "Responder rapidamente mensagens no Messenger e conduzir a negociação para o WhatsApp.",
        category: "meta",
        responsible: "Lucas & Matheus",
        status: "active",
        url: "https://facebook.com/marketplace",
        metrics: "Venda Direta Local",
        cost: "Grátis"
    },
    {
        id: "strat_fb_2",
        platform: "Facebook",
        channel: "Grupos Temáticos & Página Pessoal",
        approach: "Autoridade & Conteúdo de Valor",
        format: "Publicações com cases de estudo, dicas técnicas e solução de problemas.\n🟢 CRIAR PUBLICAÇÕES COM LINK DO SITE E OUTRAS COISAS - LUCAS",
        strategy: "Gerar curiosidade com posts informativos e convidar para conversar via Direct ('Me chame no privado').",
        category: "meta",
        responsible: "Lucas",
        status: "active",
        url: "https://facebook.com/groups",
        metrics: "Geração de Autoridade",
        cost: "Grátis"
    },

    // 💼 LINKEDIN
    {
        id: "strat_li_1",
        platform: "LinkedIn",
        channel: "Social Selling (Prospecção Ativa)",
        approach: "B2B / Conexão Direta",
        format: "Mensagens personalizadas para tomadores de decisão (Diretores, Gerentes).\n🟢 PROCURAR PEQUENAS EMPRESAS - LUCAS E MATHEUS",
        strategy: "Mapear o perfil ideal e iniciar diálogo focado nas dores do setor.\n🟢 PREPARAR AMBIENTES DE TESTES DAS FERRAMENTAS - MATHEUS",
        category: "linkedin",
        responsible: "Lucas & Matheus",
        status: "active",
        url: "https://linkedin.com",
        metrics: "Prospecção Ativa B2B",
        cost: "Grátis / Sales Navigator"
    },
    {
        id: "strat_li_2",
        platform: "LinkedIn",
        channel: "LinkedIn Ads & InMail",
        approach: "B2B / Tráfego Segmentado",
        format: "Anúncios patrocinados e mensagens diretas via caixa de entrada.\n🟡 PARA O FUTURO",
        strategy: "Formulários nativos do LinkedIn para download de e-books, whitepapers ou pedido de demonstração.\n🟢 PRESENTES: PENSAR EM CRIAÇÃO DE EBOOKS ASSOCIADOS A SITES E OUTRAS FUNÇÕES - LUCAS",
        category: "linkedin",
        responsible: "Lucas",
        status: "planning",
        url: "https://linkedin.com/campaignmanager",
        metrics: "E-books & InMail",
        cost: "Em Planejamento"
    },
    {
        id: "strat_li_3",
        platform: "LinkedIn",
        channel: "Publicações / Artigos",
        approach: "Autoridade Corporativa",
        format: "Artigos técnicos, posicionamento de mercado e atualizações da empresa.\n🟢 CRIAÇÃO DE ARTIGOS TÉCNICOS PARA POPULAÇÃO DE PÁGINA DO LINKEDIN - LUCAS",
        strategy: "Incluir links ao final dos artigos para agendamento de reuniões ou formulários de contato.",
        category: "linkedin",
        responsible: "Lucas",
        status: "active",
        url: "https://linkedin.com",
        metrics: "Autoridade B2B",
        cost: "Grátis"
    },

    // 🎥 YOUTUBE / TIKTOK
    {
        id: "strat_yt_1",
        platform: "YouTube",
        channel: "Vídeos Longos (Tutoriais/Aulas)",
        approach: "Educacional / Topo de Funil",
        format: "Vídeos explicativos tirando dúvidas frequentes do setor ou demonstrando processos.\n🟡 PARA O FUTURO",
        strategy: "Inserir link do WhatsApp ou da landing page no topo da descrição e no comentário fixado.",
        category: "video",
        responsible: "Matheus & Lucas",
        status: "planning",
        url: "https://youtube.com",
        metrics: "Vídeos Educacionais",
        cost: "Em Planejamento"
    },
    {
        id: "strat_yt_2",
        platform: "YouTube / TikTok",
        channel: "Vídeos Curtos (Shorts/Reels/TikTok)",
        approach: "Viralização / Conscientização",
        format: "Vídeos rápidos (até 60s) focados em dicas pontuais e curiosidades.\n🟡 PARA O FUTURO",
        strategy: "Fazer chamadas no áudio/vídeo apontando para o link do perfil (bio) ou comentário fixado.",
        category: "video",
        responsible: "Matheus & Lucas",
        status: "planning",
        url: "https://tiktok.com",
        metrics: "Shorts & Reels",
        cost: "Em Planejamento"
    },

    // 🖥️ SITES & LANDING PAGES OFICIAIS (WEBCO AGENCY)
    {
        id: "strat_site_1",
        platform: "WEBCO Agency",
        channel: "Site Oficial WEBCO Agency",
        approach: "Conversão Comercial & Vendas B2B",
        format: "Site Institucional e Landing Pages de alta conversão para Clientes B2B.\n🟢 Matheus Bellato - Hostinger VPS",
        strategy: "Apresentação dos serviços de Criação de Sites, Tráfego Pago e automações com integração de formulário e WhatsApp.",
        category: "sites",
        responsible: "Matheus Bellato",
        status: "active",
        url: "https://webcoagency.site",
        metrics: "Frente Comercial Principal",
        cost: "Hostinger VPS"
    },
    {
        id: "strat_site_2",
        platform: "Gráfica Ariana",
        channel: "Site Institucional Exclusivo",
        approach: "Venda Direta / Atendimento Rápido",
        format: "Site responsivo com botão de WhatsApp direto para orçamentos rápidos da gráfica.",
        strategy: "Desenvolvimento completo de site profissional com direcionamento para WhatsApp.",
        category: "sites",
        responsible: "Matheus Bellato",
        status: "active",
        url: "https://graficaariana.com.br",
        metrics: "Subindo na Hostinger (IP 2.24.117.26)",
        cost: "R$ 400,00 (50/50)"
    }
];

// Replace defaultMarketingAssets definition in app.js
const defaultAssetsCode = `const defaultMarketingAssets = ${JSON.stringify(webcoStrategies, null, 4)};`;

// Find where defaultMarketingAssets is defined and replace it cleanly
const startMarker = 'const defaultMarketingAssets = [';
const endMarker = '];';
const startIdx = appJs.indexOf(startMarker);

if (startIdx !== -1) {
    const endIdx = appJs.indexOf(endMarker, startIdx);
    if (endIdx !== -1) {
        appJs = appJs.substring(0, startIdx) + defaultAssetsCode + appJs.substring(endIdx + 2);
        console.log('Successfully replaced defaultMarketingAssets in app.js!');
    }
}

// Update card rendering in app.js to show Platform, Channel, Format, Strategy & Responsible badges
const oldCardRender = `card.innerHTML = \`
                <div class="marketing-card-header">
                    <div class="marketing-card-icon-title">
                        <div class="marketing-card-icon-wrapper \${categoryClass}">
                            \${iconHtml}
                        </div>
                        <div style="display:flex; flex-direction:column;">
                            <span class="marketing-card-title">\${asset.title}</span>
                            <span style="font-size:9px; color:var(--text-muted);">\${categoryName}</span>
                        </div>
                    </div>
                    <span class="badge-status \${statusClass}" style="padding: 2px 6px; font-size: 8px;">\${statusText}</span>
                </div>
                <div class="marketing-card-body">
                    \${asset.url ? \`<a href="\${asset.url}" target="_blank" class="marketing-card-link"><i data-lucide="external-link" style="width:10px; height:10px;"></i> \${asset.url.replace(/^https?:\\\/\\\//, '')}</a>\` : '<span style="color:var(--text-muted); font-style:italic;">Sem link cadastrado</span>'}
                    
                    <div class="marketing-card-metrics" style="margin-top:4px;">
                        <span style="font-size:9px; color:var(--text-muted); display:block; margin-bottom:2px;">Métricas de Desempenho</span>
                        <span style="font-size:11px;">\${asset.metrics || "Sem métricas registradas"}</span>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                        <span class="marketing-card-cost">Custo: <strong>\${asset.cost || "Grátis"}</strong></span>
                    </div>

                    \${asset.notes ? \`<p class="marketing-card-notes">\${asset.notes}</p>\` : ""}
                </div>`;

const newCardRender = `card.innerHTML = \`
                <div class="marketing-card-header" style="border-bottom:1px solid var(--border-color); padding-bottom:8px; margin-bottom:8px;">
                    <div class="marketing-card-icon-title" style="flex:1;">
                        <div class="marketing-card-icon-wrapper \${categoryClass}">
                            \${iconHtml}
                        </div>
                        <div style="display:flex; flex-direction:column; min-width:0; flex:1;">
                            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                                <span style="font-size:10px; font-weight:700; background:rgba(79,70,229,0.1); color:#4F46E5; padding:1px 6px; border-radius:4px;">\${asset.platform || 'WEBCO Agency'}</span>
                                \${asset.responsible ? \`<span style="font-size:10px; font-weight:700; background:rgba(6,182,212,0.1); color:#06B6D4; padding:1px 6px; border-radius:4px;">👤 \${asset.responsible}</span>\` : ''}
                            </div>
                            <span class="marketing-card-title" style="font-size:13px; font-weight:700; margin-top:2px; color:var(--text-primary);">\${asset.title || asset.channel}</span>
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
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; border-top:1px dashed var(--border-color); padding-top:6px;">
                        <span style="color:var(--text-muted);">Métricas: <strong style="color:var(--text-primary);">\${asset.metrics || "Em andamento"}</strong></span>
                        <span class="marketing-card-cost">Custo: <strong>\${asset.cost || "Grátis"}</strong></span>
                    </div>
                </div>`;

if (appJs.includes(oldCardRender)) {
    appJs = appJs.replace(oldCardRender, newCardRender);
    console.log('Successfully updated marketing card innerHTML rendering in app.js!');
} else {
    console.log('oldCardRender exact match not found, looking for alternative replacement...');
}

fs.writeFileSync('src/app.js', appJs, 'utf8');
console.log('Successfully saved src/app.js!');
