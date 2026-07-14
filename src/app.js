// Centralized State Management with Multi-Tenancy for Nexus CRM
let state = {
    currentEnv: "", // Central login env
    privacyMode: false,
    calendarDate: new Date("2026-07-12"),
    pipelineViewMode: "kanban", // "kanban" or "funnel"
    activeFunnelSegment: "top", // "top", "mid", "bottom"
    environments: {}
};

// Default Catalogs
const defaultProducts = [
    { id: "p1", name: "Criação de Site Profissional", description: "Landing page ou site institucional de alto desempenho, responsivo e otimizado para SEO.", price: 3500.00, type: "single", suggestedAddons: ["p5", "p6"] },
    { id: "p2", name: "Desenvolvimento E-commerce", description: "Loja virtual completa com meios de pagamento integrados e gerenciador de estoque.", price: 7500.00, type: "single", suggestedAddons: ["p3", "p5", "p6"] },
    { id: "p3", name: "Gestão de Google Ads", description: "Campanhas otimizadas de tráfego pago no Google para captação diária de leads qualificados.", price: 1200.00, type: "monthly", suggestedAddons: [] },
    { id: "p4", name: "Otimização de Velocidade & SEO", description: "Otimização técnica para carregar em <1s e subir no ranking de buscas do Google.", price: 1800.00, type: "single", suggestedAddons: [] },
    { id: "p5", name: "Suporte & Manutenção Mensal", description: "Backups semanais, atualizações de segurança e suporte para alterações no site.", price: 350.00, type: "monthly", suggestedAddons: [] },
    { id: "p6", name: "Hospedagem Cloud Pro", description: "Servidor cloud VPS dedicado de alto desempenho com CDN Cloudflare ativa.", price: 90.00, type: "monthly", suggestedAddons: [] },
    { id: "p7", name: "Hospedagem Cloud Basic", description: "Servidor compartilhado padrão para sites de baixo tráfego.", price: 49.00, type: "monthly", suggestedAddons: [] }
];

const defaultContacts = [
    { id: "c1", name: "João Silva", company: "Inova Tech", email: "joao@inovatech.com.br", phone: "(11) 98765-4321", value: 3500.00, status: "negotiating", niche: "SaaS / Startup", notes: "Interessado em Criação de Site e SEO.", createdAt: "2026-07-05T14:30:00.000Z", timeline: [{ id: "act1", type: "note", description: "Contato cadastrado no sistema.", timestamp: "2026-07-05T14:30:00.000Z" }] },
    { id: "c2", name: "Maria Oliveira", company: "Giga Corp", email: "maria.oliveira@gigacorp.com", phone: "(21) 99888-7766", value: 8700.00, status: "won", niche: "E-commerce", notes: "Compra fechada de Site + Google Ads.", createdAt: "2026-07-01T09:15:00.000Z", timeline: [{ id: "act2", type: "note", description: "Lead convertido em cliente.", timestamp: "2026-07-09T18:12:00.000Z" }] },
    { id: "c3", name: "Carlos Souza", company: "Acme Ltda", email: "carlos@acmelimitada.com", phone: "(31) 97777-6655", value: 1200.00, status: "proposal", niche: "Negócio Local", notes: "Aguardando resposta da proposta de Google Ads.", createdAt: "2026-07-08T11:00:00.000Z", timeline: [] },
    { id: "c4", name: "Ana Costa", company: "Tech Soluções", email: "ana@techsolucoes.tech", phone: "(11) 96543-2109", value: 3200.00, status: "lead", niche: "Serviços B2B", notes: "Lead do Google Ads. Quer fazer site novo.", createdAt: "2026-07-12T10:00:00.000Z", timeline: [] },
    { id: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", email: "marcio@paranaecoturismo.com.br", phone: "41 96252186", value: 1540.00, status: "won", niche: "Turismo", notes: "Localizado em Morretes. Representante: Marcio", createdAt: "2026-04-13T12:00:00.000Z", timeline: [
        { id: "act_parana_1", type: "note", description: "Cadastrado no sistema. Ramo: Turismo. Representante: Marcio.", timestamp: "2026-04-13T12:00:00.000Z" },
        { id: "act_parana_2", type: "note", description: "Compra fechada de Criação de Site por R$ 400.", timestamp: "2026-04-13T12:30:00.000Z" },
        { id: "act_parana_3", type: "note", description: "Pagamento efetuado: R$ 500 por atualização do site após 3 meses.", timestamp: "2026-07-13T10:00:00.000Z" }
    ] }
];

const defaultCustomers = [
    { id: "cust1", contactId: "c2", name: "Maria Oliveira", company: "Giga Corp", niche: "E-commerce", productName: "Desenvolvimento E-commerce", value: 7500.00, type: "single", status: "active", createdAt: "2026-07-09T18:12:00.000Z" },
    { id: "cust2", contactId: "c2", name: "Maria Oliveira", company: "Giga Corp", niche: "E-commerce", productName: "Gestão de Google Ads", value: 1200.00, type: "monthly", status: "active", createdAt: "2026-07-09T18:12:00.000Z" },
    { id: "cust_parana_site", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, type: "single", status: "active", createdAt: "2026-04-13T12:00:00.000Z" },
    { id: "cust_parana_update", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Atualização de Site", value: 500.00, type: "single", status: "active", createdAt: "2026-07-13T10:00:00.000Z" },
    { id: "cust_parana_maint", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual)", value: 240.00, type: "yearly", status: "active", createdAt: "2026-07-13T12:00:00.000Z" },
    { id: "cust_parana_ads", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Gestão de Google Ads", value: 400.00, type: "monthly", status: "active", createdAt: "2026-07-13T12:00:00.000Z" }
];

const defaultTasks = [
    { id: "t1", title: "Enviar escopo do site para João Silva", contactId: "c1", dueDate: "2026-07-13", priority: "high", completed: false },
    { id: "t2", title: "Ligar para Carlos Souza sobre proposta", contactId: "c3", dueDate: "2026-07-15", priority: "medium", completed: false }
];

const defaultExpenses = [
    { id: "exp1", description: "Hospedagem AWS & CDN Cloudflare", category: "Infraestrutura", value: 250.00, date: "2026-07-01" },
    { id: "exp2", description: "Campanha Tráfego Pago Web Co.", category: "Marketing", value: 1200.00, date: "2026-07-05" },
    { id: "exp3", description: "Assinatura Figma & Canva Pro", category: "Ferramentas", value: 180.00, date: "2026-07-08" }
];

const defaultInvoices = [
    { id: "FAT-1001", customerName: "Maria Oliveira", company: "Giga Corp", niche: "E-commerce", productName: "Desenvolvimento E-commerce", value: 7500.00, dueDate: "2026-07-10", status: "paid" },
    { id: "FAT-1002", customerName: "Maria Oliveira", company: "Giga Corp", niche: "E-commerce", productName: "Gestão de Google Ads", value: 1200.00, dueDate: "2026-07-12", status: "paid" },
    { id: "FAT-1003", customerName: "João Silva", company: "Inova Tech", niche: "SaaS / Startup", productName: "Criação de Site Profissional", value: 3500.00, dueDate: "2026-07-14", status: "pending" },
    { id: "FAT-PARANA-1", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, dueDate: "2026-04-15", status: "paid" },
    { id: "FAT-PARANA-2", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Atualização de Site", value: 500.00, dueDate: "2026-07-13", status: "paid" },
    { id: "FAT-PARANA-3", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual)", value: 240.00, dueDate: "2026-07-20", status: "pending" },
    { id: "FAT-PARANA-4", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Gestão de Google Ads", value: 400.00, dueDate: "2026-07-31", status: "pending" }
];

const defaultContractsList = [
    { id: "CONTR-1001", contactId: "c2", proposalId: "PROP-mock1", clientName: "Maria Oliveira", company: "Giga Corp", productName: "Desenvolvimento E-commerce", value: 7500.00, recurrence: "single", startDate: "2026-07-09", endDate: "2026-08-09", status: "active" },
    { id: "CONTR-PARANA-1", contactId: "c_parana_ecoturismo", proposalId: "DIRECT-PARANA-1", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Criação de Site", value: 400.00, recurrence: "single", startDate: "2026-04-13", endDate: "2026-05-13", status: "active" },
    { id: "CONTR-PARANA-2", contactId: "c_parana_ecoturismo", proposalId: "DIRECT-PARANA-2", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Atualização de Site", value: 500.00, recurrence: "single", startDate: "2026-07-13", endDate: "2026-08-13", status: "active" },
    { id: "CONTR-PARANA-3", contactId: "c_parana_ecoturismo", proposalId: "DIRECT-PARANA-3", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Manutenção do Site (Anual)", value: 240.00, recurrence: "yearly", startDate: "2026-07-13", endDate: "2027-07-13", status: "active" },
    { id: "CONTR-PARANA-4", contactId: "c_parana_ecoturismo", proposalId: "DIRECT-PARANA-4", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Gestão de Google Ads", value: 400.00, recurrence: "monthly", startDate: "2026-07-13", endDate: "2026-08-13", status: "active" }
];

const defaultEvents = [
    { id: "evt1", title: "Reunião de Escopo - João Silva", contactId: "c1", date: "2026-07-13", time: "14:00", description: "Alinhamento do briefing de criação do site profissional." },
    { id: "evt2", title: "Apresentação da Proposta - Carlos Souza", contactId: "c3", date: "2026-07-15", time: "16:30", description: "Demonstração e negociação de Google Ads." }
];

// Dynamic Proposal Scope Templates
const defaultScopes = {
    p1: [
        "Design de interface personalizado no Figma focado em experiência do usuário",
        "Desenvolvimento responsivo completo (compatível com smartphones, tablets e desktop)",
        "Otimização extrema de carregamento e velocidade (Core Web Vitals)",
        "Implementação de tags de rastreamento (Google Analytics, Meta Pixel)",
        "Configurações iniciais de SEO técnico on-page",
        "Prazo de entrega estimado: 15 dias úteis"
    ],
    p2: [
        "Plataforma e-commerce completa com painel administrativo intuitivo",
        "Integração com gateways de pagamento credenciados (Cartão, PIX, Boleto)",
        "Configuração de frete automático (Correios e transportadoras com cotação online)",
        "Catálogo inteligente com cadastro ilimitado de produtos e controle de estoque",
        "Layout exclusivo responsivo focado em taxas de conversão de checkout",
        "Certificado de segurança SSL integrado"
    ],
    p3: [
        "Planejamento estratégico de tráfego pago focado em captação de leads qualificados",
        "Estudo aprofundado de público-alvo e pesquisa de palavras-chave no Google",
        "Criação e testes de anúncios patrocinados (criativos, textos persuasivos)",
        "Otimização diária de lances, orçamentos e índice de qualidade dos anúncios",
        "Instalação e configuração de tags de conversão do Google Ads",
        "Relatório mensal detalhado de performance com métricas chave (CPL, ROI)"
    ],
    p4: [
        "Auditoria técnica completa do site/landing page atual da empresa",
        "Otimização de arquivos e código-fonte (HTML, CSS e JS minimizados)",
        "Compressão inteligente de imagens sem perda de qualidade visual",
        "Configuração de cache avançado de servidor e CDN global (Cloudflare)",
        "Correções de estrutura SEO (hierarquia de títulos, tags alt, robots, sitemaps)",
        "Relatório comparativo de velocidade (Antes vs Depois) via PageSpeed Insights"
    ],
    p5: [
        "Backup semanal completo do site e banco de dados em nuvem segura",
        "Atualizações recorrentes de plugins, temas e núcleo da plataforma WordPress",
        "Monitoramento de estabilidade e uptime 24/7 (garantia de site no ar)",
        "Suporte técnico prioritário de até 5 horas mensais para alterações de conteúdo",
        "Correções rápida de bugs e problemas de layout pós-atualizações",
        "Canal exclusivo de atendimento via WhatsApp comercial"
    ]
};

function getScopeList(productId) {
    if (defaultScopes[productId]) {
        return defaultScopes[productId];
    }
    return [
        "Prestação de serviço especializado conforme especificações do cliente",
        "Cronograma de execução estruturado em fases alinhadas",
        "Garantia de suporte técnico para ajustes finos e revisões",
        "Entregáveis detalhados e homologação de escopo conjunta"
    ];
}

const defaultMarketingAssets = [
    { id: "ma1", title: "Site Principal - Web Co. Labs", category: "sites", status: "active", url: "https://webcolabs.com.br", metrics: "2.4k visitas/mês", cost: "R$ 45,00/mês", notes: "Site institucional oficial." },
    { id: "ma2", title: "Campanha Google Ads - Criação de Sites", category: "ads", status: "active", url: "https://ads.google.com", metrics: "120 leads/mês | CTR 4.8%", cost: "R$ 1.500,00/mês", notes: "Focado em pequenas empresas locais." },
    { id: "ma3", title: "Instagram Oficial @webcolabs", category: "social", status: "active", url: "https://instagram.com/webcolabs", metrics: "3.2k seguidores | 5.2% engajamento", cost: "R$ 0,00", notes: "Postagens semanais de portfólio." },
    { id: "ma4", title: "SEO Orgânico - Blog de Tecnologia", category: "organic", status: "active", url: "https://webcolabs.com.br/blog", metrics: "850 acessos orgânicos/mês", cost: "R$ 300,00/mês", notes: "Artigos otimizados para busca local." }
];

// Helper to get active environment data
function getEnv() {
    const env = state.currentEnv || "webco";
    if (!state.environments[env]) {
        state.environments[env] = {
            contacts: [...defaultContacts],
            tasks: [...defaultTasks],
            products: [...defaultProducts],
            customers: [...defaultCustomers],
            proposals: [],
            invoices: [...defaultInvoices],
            expenses: [...defaultExpenses],
            contracts: [...defaultContractsList],
            events: [...defaultEvents],
            marketingAssets: [...defaultMarketingAssets]
        };
    }
    // Dynamic schema checks for users upgrading state
    if (!state.environments[env].proposals) state.environments[env].proposals = [];
    if (!state.environments[env].invoices) state.environments[env].invoices = [...defaultInvoices];
    if (!state.environments[env].expenses) state.environments[env].expenses = [...defaultExpenses];
    if (!state.environments[env].contracts) state.environments[env].contracts = [...defaultContractsList];
    if (!state.environments[env].events) state.environments[env].events = [...defaultEvents];
    if (!state.environments[env].marketingAssets) state.environments[env].marketingAssets = [...defaultMarketingAssets];
    return state.environments[env];
}

function ensureParanaEcoturismo() {
    const envName = state.currentEnv || "webco";
    if (!state.environments) state.environments = {};
    if (!state.environments[envName]) {
        state.environments[envName] = {
            contacts: [...defaultContacts],
            tasks: [...defaultTasks],
            products: [...defaultProducts],
            customers: [...defaultCustomers],
            proposals: [],
            invoices: [...defaultInvoices],
            expenses: [...defaultExpenses],
            contracts: [...defaultContractsList],
            events: [...defaultEvents],
            marketingAssets: [...defaultMarketingAssets]
        };
    }
    const env = state.environments[envName];
    if (!env.contacts) env.contacts = [...defaultContacts];
    if (!env.customers) env.customers = [...defaultCustomers];
    if (!env.invoices) env.invoices = [...defaultInvoices];
    if (!env.contracts) env.contracts = [...defaultContractsList];
    if (!env.fiscalNotes) env.fiscalNotes = [];
    if (!env.importHistory) env.importHistory = [];

    const exists = env.customers.some(c => c.company === "Paraná Ecoturismo");
    if (!exists) {
        const contactId = "c_parana_ecoturismo";
        
        // Add Contact
        const newContact = {
            id: contactId,
            name: "Marcio",
            company: "Paraná Ecoturismo",
            email: "marcio@paranaecoturismo.com.br",
            phone: "41 96252186",
            value: 1540.00,
            status: "won",
            niche: "Turismo",
            notes: "Localizado em Morretes. Representante: Marcio",
            createdAt: "2026-04-13T12:00:00.000Z",
            timeline: [
                { id: "act_parana_1", type: "note", description: "Cadastrado no sistema. Ramo: Turismo. Representante: Marcio.", timestamp: "2026-04-13T12:00:00.000Z" },
                { id: "act_parana_2", type: "note", description: "Compra fechada de Criação de Site por R$ 400.", timestamp: "2026-04-13T12:30:00.000Z" },
                { id: "act_parana_3", type: "note", description: "Pagamento efetuado: R$ 500 por atualização do site após 3 meses.", timestamp: "2026-07-13T10:00:00.000Z" }
            ]
        };
        env.contacts.push(newContact);

        // Add Customers
        env.customers.push(
            { id: "cust_parana_site", contactId: contactId, name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, type: "single", status: "active", createdAt: "2026-04-13T12:00:00.000Z" },
            { id: "cust_parana_update", contactId: contactId, name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Atualização de Site", value: 500.00, type: "single", status: "active", createdAt: "2026-07-13T10:00:00.000Z" },
            { id: "cust_parana_maint", contactId: contactId, name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual)", value: 240.00, type: "yearly", status: "active", createdAt: "2026-07-13T12:00:00.000Z" },
            { id: "cust_parana_ads", contactId: contactId, name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Gestão de Google Ads", value: 400.00, type: "monthly", status: "active", createdAt: "2026-07-13T12:00:00.000Z" }
        );

        // Add Invoices
        env.invoices.push(
            { id: "FAT-PARANA-1", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, dueDate: "2026-04-15", status: "paid" },
            { id: "FAT-PARANA-2", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Atualização de Site", value: 500.00, dueDate: "2026-07-13", status: "paid" },
            { id: "FAT-PARANA-3", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual)", value: 240.00, dueDate: "2026-07-20", status: "pending" },
            { id: "FAT-PARANA-4", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Gestão de Google Ads", value: 400.00, dueDate: "2026-07-31", status: "pending" }
        );

        // Add Contracts
        env.contracts.push(
            { id: "CONTR-PARANA-1", contactId: contactId, proposalId: "DIRECT-PARANA-1", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Criação de Site", value: 400.00, recurrence: "single", startDate: "2026-04-13", endDate: "2026-05-13", status: "active" },
            { id: "CONTR-PARANA-2", contactId: contactId, proposalId: "DIRECT-PARANA-2", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Atualização de Site", value: 500.00, recurrence: "single", startDate: "2026-07-13", endDate: "2026-08-13", status: "active" },
            { id: "CONTR-PARANA-3", contactId: contactId, proposalId: "DIRECT-PARANA-3", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Manutenção do Site (Anual)", value: 240.00, recurrence: "yearly", startDate: "2026-07-13", endDate: "2027-07-13", status: "active" },
            { id: "CONTR-PARANA-4", contactId: contactId, proposalId: "DIRECT-PARANA-4", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Gestão de Google Ads", value: 400.00, recurrence: "monthly", startDate: "2026-07-13", endDate: "2026-08-13", status: "active" }
        );

        saveState();
    }
}

function updateSyncIndicator(isSync) {
    const dot = document.getElementById("syncDot");
    const text = document.getElementById("syncText");
    if (dot && text) {
        if (isSync) {
            dot.style.background = "#10b981"; // Emerald green
            text.innerText = "Nuvem Sincronizada";
        } else {
            dot.style.background = "#f59e0b"; // Amber orange
            text.innerText = "Armazenamento Local";
        }
    }
}

function safeCreateIcons() {
    try {
        if (typeof lucide !== 'undefined' && lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }
    } catch (e) {
        console.error("Error creating Lucide icons:", e);
    }
}

function showToast(message, type = 'success') {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let iconName = "check-circle";
    if (type === "warning") iconName = "alert-triangle";
    if (type === "error") iconName = "alert-circle";
    if (type === "info") iconName = "info";

    toast.innerHTML = `
        <i data-lucide="${iconName}" class="toast-icon"></i>
        <div class="toast-message" style="line-height: 1.4;">${message}</div>
    `;

    container.appendChild(toast);
    
    try {
        if (typeof lucide !== 'undefined' && lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }
    } catch (e) {
        console.error("Lucide icons error in toast:", e);
    }

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");
        toast.addEventListener("transitionend", () => {
            toast.remove();
        });
    }, 3500);
}

function formatDateBr(dateStr) {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

const getApiUrl = (path) => {
    const basePath = window.location.pathname.startsWith('/crm') ? '/crm' : '';
    return `${basePath}${path}`;
};

async function saveStateToServer() {
    try {
        const response = await fetch(getApiUrl('/api/state'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state)
        });
        if (response.ok) {
            updateSyncIndicator(true);
        } else {
            updateSyncIndicator(false);
        }
    } catch (e) {
        console.warn("Offline: Salvo apenas localmente.", e);
        updateSyncIndicator(false);
    }
}

// Initialize & Load
async function init() {
    let loadedFromServer = false;
    let serverOnline = false;
    try {
        const response = await fetch(getApiUrl('/api/state'));
        if (response.ok) {
            serverOnline = true;
            const data = await response.json();
            if (data) {
                state = data;
                loadedFromServer = true;
            }
        }
    } catch (e) {
        console.warn("Servidor offline ao iniciar. Usando dados locais.", e);
    }

    if (!loadedFromServer) {
        const savedState = localStorage.getItem("nexus_crm_multitenant_state");
        if (savedState) {
            try {
                state = JSON.parse(savedState);
            } catch (err) {
                console.error("Error parsing localStorage state:", err);
            }
        }
    }
    
    updateSyncIndicator(serverOnline);
    
    // Privacy Mode setup
    if (state.privacyMode === undefined) {
        state.privacyMode = false;
    }
    if (!state.calendarDate) {
        state.calendarDate = new Date("2026-07-12");
    } else {
        state.calendarDate = new Date(state.calendarDate);
    }
    updatePrivacyIcon();
    
    // Check session login
    const loggedIn = sessionStorage.getItem("nexus_crm_logged_in");
    const loggedEnv = sessionStorage.getItem("nexus_crm_env");
    
    if (loggedIn === "true" && loggedEnv) {
        state.currentEnv = loggedEnv;
        ensureParanaEcoturismo();
        document.getElementById("loginOverlay").classList.add("hidden");
        document.getElementById("appContainer").classList.remove("hidden");
        document.getElementById("appContainer").classList.add("logged-in");
        document.getElementById("sidebarUsername").innerText = "Admin";
        
        // Setup initial view
        renderAll();
    } else {
        document.getElementById("loginOverlay").classList.remove("hidden");
        document.getElementById("appContainer").classList.add("hidden");
        document.getElementById("appContainer").classList.remove("logged-in");
    }
}

function saveState() {
    localStorage.setItem("nexus_crm_multitenant_state", JSON.stringify(state));
    saveStateToServer();
}

// Chart Instances
let salesChart = null;
let pipelineChart = null;
let cashFlowChart = null;
let revenueByNicheChart = null;

// Helpers & Formatting
const formatCurrency = (value) => {
    if (state.privacyMode) return "R$ ••••••";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDate = (dateStr) => {
    if (!dateStr) return "Nenhum";
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "?";
    return name.trim().split(/\s+/).filter(n => n).map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const getDaysSince = (dateStr) => {
    const start = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? "Hoje/Ontem" : `Há ${diffDays} dias`;
};

// UI Rendering Functions
function renderAll() {
    if (!state.currentEnv) return;
    
    const safeRun = (name, fn) => {
        try {
            fn();
        } catch (err) {
            console.error(`Error rendering ${name}:`, err);
        }
    };

    safeRun("ensureParanaEcoturismo", ensureParanaEcoturismo);
    safeRun("renderDashboard", renderDashboard);
    safeRun("renderContacts", renderContacts);
    safeRun("renderKanban", renderKanban);
    safeRun("renderCustomers", renderCustomers);
    safeRun("renderProducts", renderProducts);
    safeRun("renderTasks", renderTasks);
    safeRun("renderProposals", renderProposals);
    safeRun("renderContracts", renderContracts);
    safeRun("renderCalendar", renderCalendar);
    safeRun("renderFinance", renderFinance);
    safeRun("renderMarketingAssets", renderMarketingAssets);
    safeRun("populateContactDropdowns", populateContactDropdowns);
    safeRun("populateConversionProductsDropdown", populateConversionProductsDropdown);
    safeRun("populateEventContactsDropdown", populateEventContactsDropdown);
    safeRun("populateCustomerProductsDropdown", populateCustomerProductsDropdown);
    safeRun("updateCalendarNotifications", updateCalendarNotifications);
    
    safeCreateIcons();
}

// 1. Dashboard Render
function renderDashboard() {
    const env = getEnv();
    
    // KPIs: calculate LTV from customers
    const totalSalesLTV = env.customers.reduce((sum, cust) => {
        if (cust.status === "active") {
            return sum + (cust.type === "monthly" ? cust.value * 6 : cust.type === "yearly" ? cust.value : cust.value);
        }
        return sum + (cust.type === "single" ? cust.value : 0);
    }, 0);

    const activePipelineValue = env.contacts.filter(c => ['contacted', 'proposal', 'negotiating'].includes(c.status)).reduce((sum, c) => sum + c.value, 0);
    const totalDeals = env.contacts.length;
    const wonDeals = env.contacts.filter(c => c.status === 'won').length;
    const conversionRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;
    const pendingTasksCount = env.tasks.filter(t => !t.completed).length;

    document.getElementById("kpiTotalSales").innerText = formatCurrency(totalSalesLTV);
    document.getElementById("kpiActivePipeline").innerText = formatCurrency(activePipelineValue);
    document.getElementById("kpiConversionRate").innerText = `${conversionRate}%`;
    document.getElementById("kpiPendingTasks").innerText = pendingTasksCount;

    // Update Conversion Badge Description
    const conversionBadge = document.getElementById("kpiConversionBadge");
    if (conversionRate >= 25) {
        conversionBadge.innerText = "Alta Conversão";
        conversionBadge.className = "kpi-badge positive";
    } else {
        conversionBadge.innerText = "Trabalhar Leads";
        conversionBadge.className = "kpi-badge warning";
    }

    // Update Pending Task Badge text
    const badge = document.getElementById("kpiTaskStatusBadge");
    if (pendingTasksCount === 0) {
        badge.innerText = "Tudo em dia";
        badge.className = "kpi-badge positive";
    } else {
        badge.innerText = "Ações pendentes";
        badge.className = "kpi-badge warning";
    }

    // Render Recent Leads Table
    const recentLeads = [...env.contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const tbody = document.getElementById("recentLeadsTableBody");
    tbody.innerHTML = "";
    recentLeads.forEach(lead => {
        const tr = document.createElement("tr");
        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => openContactDetails(lead.id));
        tr.innerHTML = `
            <td>
                <div class="col-contact-info">
                    <div class="contact-avatar">${getInitials(lead.name)}</div>
                    <span>${lead.name}</span>
                </div>
            </td>
            <td>${lead.company || "-"}</td>
            <td><strong>${formatCurrency(lead.value)}</strong></td>
            <td><span class="status-badge ${lead.status}">${translateStatus(lead.status)}</span></td>
        `;
        tbody.appendChild(tr);
    });

    // Render Urgent Tasks List (top 4 uncompleted tasks)
    const urgentTasks = env.tasks.filter(t => !t.completed).sort((a, b) => {
        const priorities = { high: 3, medium: 2, low: 1 };
        return priorities[b.priority] - priorities[a.priority];
    }).slice(0, 4);

    const urgentTasksContainer = document.getElementById("urgentTasksList");
    urgentTasksContainer.innerHTML = "";
    if (urgentTasks.length === 0) {
        urgentTasksContainer.innerHTML = `<div class="table-empty-state"><p>Nenhuma tarefa pendente!</p></div>`;
    } else {
        urgentTasks.forEach(task => {
            const contactName = task.contactId ? (env.contacts.find(c => c.id === task.contactId)?.name || "") : "";
            const div = document.createElement("div");
            div.className = `task-item ${task.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <label class="task-checkbox-wrapper">
                    <input type="checkbox" class="task-toggle-btn" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <div class="task-checkbox"></div>
                </label>
                <div class="task-content">
                    <span class="task-title-text">${task.title}</span>
                    <div class="task-meta">
                        ${contactName ? `<span>👤 ${contactName}</span>` : ""}
                        <span>📅 ${formatDate(task.dueDate)}</span>
                        <span class="task-priority-badge ${task.priority}">${task.priority}</span>
                    </div>
                </div>
            `;
            div.querySelector("input").addEventListener("change", (e) => {
                toggleTaskComplete(task.id, e.target.checked);
            });
            urgentTasksContainer.appendChild(div);
        });
    }

    renderCharts();
}

function translateStatus(status) {
    const trans = {
        lead: "Novo Lead",
        contacted: "Contatado",
        proposal: "Proposta Enviada",
        negotiating: "Em Negociação",
        won: "Ganho",
        lost: "Perdido"
    };
    return trans[status] || status;
}

// Charts rendering
function renderCharts() {
    const env = getEnv();
    if (salesChart) salesChart.destroy();
    if (pipelineChart) pipelineChart.destroy();

    const wonTotal = env.contacts.filter(c => c.status === 'won').reduce((sum, c) => sum + c.value, 0);
    const negTotal = env.contacts.filter(c => c.status === 'negotiating').reduce((sum, c) => sum + c.value, 0);
    const propTotal = env.contacts.filter(c => c.status === 'proposal').reduce((sum, c) => sum + c.value, 0);
    const contTotal = env.contacts.filter(c => c.status === 'contacted').reduce((sum, c) => sum + c.value, 0);

    const ctxSales = document.getElementById('salesTrendChart').getContext('2d');
    const isDark = document.body.classList.contains('dark-theme');
    const chartLabelColor = isDark ? '#9ca3af' : '#4b5563';
    const gridColor = isDark ? '#2a2a40' : '#e5e7eb';

    salesChart = new Chart(ctxSales, {
        type: 'bar',
        data: {
            labels: ['Contatado', 'Proposta', 'Em Negociação', 'Ganho (Won)'],
            datasets: [{
                label: 'Receita (R$)',
                data: [contTotal, propTotal, negTotal, wonTotal],
                backgroundColor: [
                    'rgba(0, 140, 255, 0.75)',
                    'rgba(13, 148, 136, 0.75)',
                    'rgba(154, 52, 18, 0.75)',
                    'rgba(22, 101, 52, 0.75)'
                ],
                borderColor: [
                    '#008cff',
                    '#0d9488',
                    '#9a3412',
                    '#166534'
                ],
                borderWidth: 1.5,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: chartLabelColor } },
                y: { grid: { color: gridColor }, ticks: { color: chartLabelColor, callback: (v) => formatCurrency(v) } }
            }
        }
    });

    const stages = ['lead', 'contacted', 'proposal', 'negotiating', 'won', 'lost'];
    const stageCounts = stages.map(s => env.contacts.filter(c => c.status === s).length);

    const ctxPipeline = document.getElementById('pipelineDistributionChart').getContext('2d');
    pipelineChart = new Chart(ctxPipeline, {
        type: 'doughnut',
        data: {
            labels: ['Novo Lead', 'Contatado', 'Proposta', 'Negociação', 'Ganho', 'Perdido'],
            datasets: [{
                data: stageCounts,
                backgroundColor: [
                    'rgba(71, 85, 105, 0.7)',
                    'rgba(0, 140, 255, 0.7)',
                    'rgba(13, 148, 136, 0.7)',
                    'rgba(154, 52, 18, 0.7)',
                    'rgba(22, 101, 52, 0.7)',
                    'rgba(153, 27, 27, 0.7)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: chartLabelColor, font: { size: 10 } }
                }
            }
        }
    });
}

// 2. Contacts Management Render
function renderContacts() {
    const env = getEnv();
    const filterStatus = document.getElementById("filterStatus").value;
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();

    let filtered = [...env.contacts];

    if (filterStatus !== "all") {
        filtered = filtered.filter(c => c.status === filterStatus);
    }

    if (searchVal) {
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(searchVal) ||
            (c.company && c.company.toLowerCase().includes(searchVal)) ||
            (c.niche && c.niche.toLowerCase().includes(searchVal)) ||
            c.email.toLowerCase().includes(searchVal)
        );
    }

    const tbody = document.getElementById("contactsTableBody");
    const emptyState = document.getElementById("contactsEmptyState");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("contactsTable").classList.add("hidden");
    } else {
        emptyState.classList.add("hidden");
        document.getElementById("contactsTable").classList.remove("hidden");

        filtered.forEach(c => {
            const lastTimelineItem = c.timeline && c.timeline.length > 0 
                ? c.timeline[c.timeline.length - 1] 
                : null;
            
            const lastInteractionText = lastTimelineItem 
                ? `${lastTimelineItem.type === 'call' ? '📞' : lastTimelineItem.type === 'email' ? '✉️' : lastTimelineItem.type === 'meeting' ? '🤝' : '📝'} ${lastTimelineItem.description.substring(0, 20)}...`
                : "Sem interações";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div class="col-contact-info">
                        <div class="contact-avatar">${getInitials(c.name)}</div>
                        <div class="contact-name-company">
                            <span class="contact-name-val">${c.name}</span>
                            <span class="contact-company-sub">${c.company || "-"} <span style="font-size:10px;color:var(--text-muted)">(${c.niche || "Outro"})</span></span>
                        </div>
                    </div>
                </td>
                <td>${c.company || "-"}</td>
                <td>
                    <div class="contact-comm-info">
                        <span>${c.email}</span>
                        <span>${c.phone || "-"}</span>
                    </div>
                </td>
                <td><strong>${formatCurrency(c.value)}</strong></td>
                <td>
                    <select class="select-inline-status status-${c.status}" data-id="${c.id}" style="
                        font-size: 11px;
                        font-weight: 600;
                        padding: 4px 8px;
                        border-radius: 4px;
                        border: 1px solid var(--border-color);
                        background: var(--bg-card);
                        color: var(--text-primary);
                        cursor: pointer;
                        outline: none;
                    ">
                        <option value="lead" ${c.status === 'lead' ? 'selected' : ''}>Novo Lead</option>
                        <option value="contacted" ${c.status === 'contacted' ? 'selected' : ''}>Contatado</option>
                        <option value="proposal" ${c.status === 'proposal' ? 'selected' : ''}>Proposta Enviada</option>
                        <option value="negotiating" ${c.status === 'negotiating' ? 'selected' : ''}>Em Negociação</option>
                        <option value="won" ${c.status === 'won' ? 'selected' : ''}>Ganho (Won)</option>
                        <option value="lost" ${c.status === 'lost' ? 'selected' : ''}>Perdido (Lost)</option>
                    </select>
                </td>
                <td>
                    <div class="contact-comm-info">
                        <span>${lastInteractionText}</span>
                        <span>${lastTimelineItem ? formatDate(lastTimelineItem.timestamp) : ""}</span>
                    </div>
                </td>
                <td>
                    <div class="kanban-card-actions">
                        <button class="btn-icon-only btn-view" title="Ver Detalhes"><i data-lucide="eye" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-edit" title="Editar"><i data-lucide="edit-2" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-delete" title="Excluir"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </td>
            `;

            tr.querySelector(".select-inline-status").onchange = (e) => {
                const newStatus = e.target.value;
                const prevStatus = c.status;
                c.status = newStatus;
                
                c.timeline.push({
                    id: "act_" + Date.now(),
                    type: "note",
                    description: `Estágio atualizado na listagem para: ${translateStatus(newStatus)}`,
                    timestamp: new Date().toISOString()
                });
                
                if (newStatus === "won" && prevStatus !== "won") {
                    openConversionModal(c.id);
                } else {
                    saveState();
                    renderAll();
                }
            };

            tr.querySelector(".btn-view").addEventListener("click", () => openContactDetails(c.id));
            tr.querySelector(".btn-edit").addEventListener("click", () => openEditContact(c.id));
            tr.querySelector(".btn-delete").addEventListener("click", () => deleteContact(c.id));

            tbody.appendChild(tr);
        });
    }
}

// 3. Kanban Pipeline Render
function renderKanban() {
    const env = getEnv();
    const stages = ['lead', 'contacted', 'proposal', 'negotiating', 'won', 'lost'];
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    // Read pipeline filters
    const filterNiche = document.getElementById("kanbanFilterNiche") ? document.getElementById("kanbanFilterNiche").value : "all";
    const filterPeriod = document.getElementById("kanbanFilterPeriod") ? document.getElementById("kanbanFilterPeriod").value : "all";

    // Helper for period filtering
    const filterByPeriod = (dateStr, periodKey) => {
        if (periodKey === "all") return true;
        const d = new Date(dateStr);
        const now = new Date();
        if (periodKey === "this_month") {
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        }
        if (periodKey === "last_30") {
            return (now - d) <= (30 * 24 * 60 * 60 * 1000);
        }
        if (periodKey === "last_90") {
            return (now - d) <= (90 * 24 * 60 * 60 * 1000);
        }
        return true;
    };

    // Filter contacts based on niche, period and search
    let filteredContacts = env.contacts.filter(c => {
        // Search filter
        if (searchVal) {
            const matchSearch = c.name.toLowerCase().includes(searchVal) || 
                               (c.company && c.company.toLowerCase().includes(searchVal)) ||
                               (c.niche && c.niche.toLowerCase().includes(searchVal));
            if (!matchSearch) return false;
        }
        // Niche filter
        if (filterNiche !== "all" && c.niche !== filterNiche) {
            return false;
        }
        // Period filter
        if (!filterByPeriod(c.createdAt || new Date().toISOString(), filterPeriod)) {
            return false;
        }
        return true;
    });

    // Calculate Sales Funnel Metrics
    const topLeads = filteredContacts.filter(c => c.status === 'lead' || c.status === 'contacted');
    const midLeads = filteredContacts.filter(c => c.status === 'proposal' || c.status === 'negotiating');
    const bottomLeads = filteredContacts.filter(c => c.status === 'won');

    const topCount = topLeads.length;
    const topValue = topLeads.reduce((sum, c) => sum + (c.value || 0), 0);

    const midCount = midLeads.length;
    const midValue = midLeads.reduce((sum, c) => sum + (c.value || 0), 0);

    const bottomCount = bottomLeads.length;
    const bottomValue = bottomLeads.reduce((sum, c) => sum + (c.value || 0), 0);

    // Calculate marketing costs (Active Marketing Assets monthly cost + logged marketing expenses in period)
    const activeAssetsCost = env.marketingAssets
        .filter(a => a.status === 'active')
        .reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0);

    let periodExpenses = env.expenses.filter(e => e.category === 'marketing');
    periodExpenses = periodExpenses.filter(e => filterByPeriod(e.date, filterPeriod));
    const loggedExpensesCost = periodExpenses.reduce((sum, e) => sum + e.value, 0);

    let totalMarketingCost = loggedExpensesCost;
    if (filterPeriod === "this_month" || filterPeriod === "last_30" || filterPeriod === "all") {
        totalMarketingCost += activeAssetsCost;
    } else if (filterPeriod === "last_90") {
        totalMarketingCost += (activeAssetsCost * 3);
    }

    // Conversion rate
    const totalFunnelCount = topCount + midCount + bottomCount;
    const conversionRate = totalFunnelCount > 0 ? (bottomCount / totalFunnelCount) * 100 : 0;

    // Update Dashboard Metrics UI
    if (document.getElementById("funnelTopCount")) {
        document.getElementById("funnelTopCount").innerText = topCount;
        document.getElementById("funnelTopValue").innerText = `${formatCurrency(topValue)} est.`;
    }
    if (document.getElementById("funnelMidCount")) {
        document.getElementById("funnelMidCount").innerText = midCount;
        document.getElementById("funnelMidValue").innerText = `${formatCurrency(midValue)} est.`;
    }
    if (document.getElementById("funnelBottomCount")) {
        document.getElementById("funnelBottomCount").innerText = bottomCount;
        document.getElementById("funnelBottomValue").innerText = `${formatCurrency(bottomValue)} fat.`;
    }
    if (document.getElementById("funnelCostValue")) {
        document.getElementById("funnelCostValue").innerText = formatCurrency(totalMarketingCost);
    }
    if (document.getElementById("funnelConversionRate")) {
        document.getElementById("funnelConversionRate").innerText = `${conversionRate.toFixed(1)}%`;
    }

    // Toggle containers based on active mode
    const kanbanBoard = document.querySelector(".kanban-board");
    const funnelContainer = document.getElementById("pipelineFunnelViewContainer");
    
    // Toggle active classes on buttons
    const btnKanban = document.getElementById("btnPipelineModeKanban");
    const btnFunnel = document.getElementById("btnPipelineModeFunnel");
    if (btnKanban && btnFunnel) {
        if (state.pipelineViewMode === "funnel") {
            btnKanban.classList.remove("active");
            btnFunnel.classList.add("active");
            if (kanbanBoard) kanbanBoard.classList.add("hidden");
            if (funnelContainer) funnelContainer.classList.remove("hidden");
        } else {
            btnKanban.classList.add("active");
            btnFunnel.classList.remove("active");
            if (kanbanBoard) kanbanBoard.classList.remove("hidden");
            if (funnelContainer) funnelContainer.classList.add("hidden");
        }
    }

    const funnelSelect = document.getElementById("funnelLayersSelect");
    if (funnelSelect) {
        funnelSelect.value = env.funnelLayers || 3;
        funnelSelect.onchange = (e) => {
            env.funnelLayers = parseInt(e.target.value);
            saveState();
            renderAll();
        };
    }

    if (state.pipelineViewMode === "funnel") {
        const funnelConfig = {
            3: [
                { key: "top", name: "1. TOPO (Novos Leads)", stages: ["lead", "contacted"], color: "var(--color-primary)", bg: "rgba(0, 140, 255, 0.08)", text: "Leads" },
                { key: "mid", name: "2. MEIO (Orçamentos)", stages: ["proposal", "negotiating"], color: "var(--color-warning)", bg: "rgba(250, 180, 0, 0.04)", text: "Leads" },
                { key: "bottom", name: "3. FUNDO (Fechados)", stages: ["won"], color: "var(--color-teal)", bg: "rgba(13, 242, 201, 0.04)", text: "Clientes" }
            ],
            4: [
                { key: "layer1", name: "1. Novos Leads", stages: ["lead"], color: "var(--color-primary)", bg: "rgba(0, 140, 255, 0.08)", text: "Leads" },
                { key: "layer2", name: "2. Contatados", stages: ["contacted"], color: "var(--color-purple)", bg: "rgba(168, 85, 247, 0.08)", text: "Leads" },
                { key: "layer3", name: "3. Em Negociação", stages: ["proposal", "negotiating"], color: "var(--color-warning)", bg: "rgba(250, 180, 0, 0.04)", text: "Leads" },
                { key: "layer4", name: "4. Fechados (Won)", stages: ["won"], color: "var(--color-teal)", bg: "rgba(13, 242, 201, 0.04)", text: "Clientes" }
            ],
            5: [
                { key: "layer1", name: "1. Novos Leads", stages: ["lead"], color: "var(--color-primary)", bg: "rgba(0, 140, 255, 0.08)", text: "Leads" },
                { key: "layer2", name: "2. Contatados", stages: ["contacted"], color: "var(--color-purple)", bg: "rgba(168, 85, 247, 0.08)", text: "Leads" },
                { key: "layer3", name: "3. Proposta Enviada", stages: ["proposal"], color: "var(--color-warning)", bg: "rgba(250, 180, 0, 0.04)", text: "Leads" },
                { key: "layer4", name: "4. Em Negociação", stages: ["negotiating"], color: "var(--color-orange)", bg: "rgba(249, 115, 22, 0.08)", text: "Leads" },
                { key: "layer5", name: "5. Fechados (Won)", stages: ["won"], color: "var(--color-teal)", bg: "rgba(13, 242, 201, 0.04)", text: "Clientes" }
            ],
            6: [
                { key: "layer1", name: "1. Novos Leads", stages: ["lead"], color: "var(--color-primary)", bg: "rgba(0, 140, 255, 0.08)", text: "Leads" },
                { key: "layer2", name: "2. Contatados", stages: ["contacted"], color: "var(--color-purple)", bg: "rgba(168, 85, 247, 0.08)", text: "Leads" },
                { key: "layer3", name: "3. Proposta Enviada", stages: ["proposal"], color: "var(--color-warning)", bg: "rgba(250, 180, 0, 0.04)", text: "Leads" },
                { key: "layer4", name: "4. Em Negociação", stages: ["negotiating"], color: "var(--color-orange)", bg: "rgba(249, 115, 22, 0.08)", text: "Leads" },
                { key: "layer5", name: "5. Fechados (Won)", stages: ["won"], color: "var(--color-teal)", bg: "rgba(13, 242, 201, 0.04)", text: "Clientes" },
                { key: "layer6", name: "6. Perdidos (Lost)", stages: ["lost"], color: "var(--color-danger)", bg: "rgba(239, 68, 68, 0.08)", text: "Contatos" }
            ]
        };

        const layersCount = env.funnelLayers || 3;
        const layers = funnelConfig[layersCount] || funnelConfig[3];
        
        const layerKeys = layers.map(l => l.key);
        if (!state.activeFunnelSegment || !layerKeys.includes(state.activeFunnelSegment)) {
            state.activeFunnelSegment = layerKeys[0];
        }

        const svg = document.getElementById("funnelSvg");
        if (svg) {
            svg.innerHTML = `
                <defs>
                    <filter id="shadow-glow-layer" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15"/>
                    </filter>
                </defs>
            `;
            
            const W_top = 280;
            const W_bottom = 50;
            const H = 290;
            const margin = 8;
            const N = layers.length;
            const h_slice = (H - (N - 1) * margin) / N;

            layers.forEach((layer, i) => {
                const y1 = i * (h_slice + margin) + 10;
                const y2 = y1 + h_slice;
                
                const w1 = W_top - (y1 / H) * (W_top - W_bottom);
                const w2 = W_top - (y2 / H) * (W_top - W_bottom);
                
                const x_tl = 150 - w1/2;
                const x_tr = 150 + w1/2;
                const x_br = 150 + w2/2;
                const x_bl = 150 - w2/2;
                
                const layerContacts = filteredContacts.filter(c => layer.stages.includes(c.status));
                const count = layerContacts.length;
                const valueSum = layerContacts.reduce((sum, c) => sum + (c.value || 0), 0);
                
                const isSelected = state.activeFunnelSegment === layer.key;
                
                const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                polygon.setAttribute("points", `${x_tl},${y1} ${x_tr},${y1} ${x_br},${y2} ${x_bl},${y2}`);
                
                if (isSelected) {
                    polygon.setAttribute("fill", layer.bg);
                    polygon.setAttribute("stroke", layer.color);
                    polygon.setAttribute("stroke-width", "2");
                    polygon.setAttribute("filter", "url(#shadow-glow-layer)");
                } else {
                    polygon.setAttribute("fill", "var(--bg-card)");
                    polygon.setAttribute("stroke", "var(--border-color)");
                    polygon.setAttribute("stroke-width", "1");
                }
                
                polygon.setAttribute("style", "cursor: pointer; transition: all 0.2s;");
                
                polygon.onmouseover = () => {
                    if (!isSelected) {
                        polygon.setAttribute("fill", layer.bg);
                        polygon.setAttribute("stroke", layer.color);
                    }
                };
                polygon.onmouseout = () => {
                    if (!isSelected) {
                        polygon.setAttribute("fill", "var(--bg-card)");
                        polygon.setAttribute("stroke", "var(--border-color)");
                    }
                };
                
                polygon.onclick = () => {
                    state.activeFunnelSegment = layer.key;
                    renderAll();
                };
                
                svg.appendChild(polygon);
                
                const foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
                foreign.setAttribute("x", (150 - w1/2).toString());
                foreign.setAttribute("y", y1.toString());
                foreign.setAttribute("width", w1.toString());
                foreign.setAttribute("height", h_slice.toString());
                foreign.setAttribute("style", "pointer-events: none;");
                
                foreign.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; text-align:center; font-family:inherit; pointer-events:none; line-height: 1.15; padding: 2px;">
                        <strong style="font-size: 8px; color: ${isSelected ? layer.color : 'var(--text-muted)'}; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">${layer.name}</strong>
                        <span style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin: 1px 0;">${count} ${layer.text}</span>
                        <span style="font-size: 8px; color: var(--text-secondary);">${formatCurrency(valueSum)}</span>
                    </div>
                `;
                
                svg.appendChild(foreign);
            });
        }

        const activeLayer = layers.find(l => l.key === state.activeFunnelSegment) || layers[0];
        const activeLeads = filteredContacts.filter(c => activeLayer.stages.includes(c.status));

        const segmentTitleEl = document.getElementById("funnelSegmentTitle");
        if (segmentTitleEl) {
            segmentTitleEl.innerText = `Contatos em ${activeLayer.name}`;
            segmentTitleEl.style.color = activeLayer.color;
        }

        const segmentBadge = document.getElementById("funnelSegmentBadgeCount");
        if (segmentBadge) {
            segmentBadge.innerText = `${activeLeads.length} contatos`;
        }

        const container = document.getElementById("funnelSegmentLeadsContainer");
        if (container) {
            container.innerHTML = "";
            if (activeLeads.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:40px 20px; color:var(--text-muted); font-size:11px;">Nenhum lead nesta etapa com as configurações filtradas.</div>`;
            } else {
                activeLeads.forEach(c => {
                    const card = document.createElement("div");
                    card.style = "background:var(--bg-app); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:12px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition: all 0.2s;";
                    card.innerHTML = `
                        <div>
                            <strong style="color:var(--text-primary); font-size:12px;">${c.name}</strong>
                            <div style="font-size:10px; color:var(--text-muted);">${c.company || "Sem Empresa"} • ${c.niche || "Outro"}</div>
                        </div>
                        <div style="text-align:right;">
                            <strong style="color:var(--color-primary); font-size:11px;">${formatCurrency(c.value)}</strong>
                            <div style="font-size:9px; color:var(--text-secondary);">${translateStatus(c.status)}</div>
                        </div>
                    `;
                    card.onmouseenter = () => { card.style.borderColor = "var(--color-primary)"; card.style.background = "var(--bg-card-hover)"; };
                    card.onmouseleave = () => { card.style.borderColor = "var(--border-color)"; card.style.background = "var(--bg-app)"; };
                    card.onclick = () => openContactDetails(c.id);
                    container.appendChild(card);
                });
            }
        }
    }

    // Render columns
    stages.forEach(stage => {
        const columnContainer = document.getElementById(`kanban-${stage}`);
        const countBadge = document.getElementById(`count-${stage}`);
        columnContainer.innerHTML = "";

        // Get contacts in stage after filters
        let contactsInStage = filteredContacts.filter(c => c.status === stage);
        countBadge.innerText = contactsInStage.length;

        contactsInStage.forEach(c => {
            const card = document.createElement("div");
            card.className = "kanban-card";
            card.setAttribute("draggable", "true");
            card.setAttribute("data-id", c.id);
            card.setAttribute("data-status", c.status);
            
            card.innerHTML = `
                <div class="kanban-card-drag-handle">
                    <i data-lucide="grip-vertical" style="width:14px; height:14px;"></i>
                </div>
                <div class="kanban-card-content">
                    <h4 class="kanban-card-title">${c.name}</h4>
                    <div class="kanban-card-company">${c.company || "Sem Empresa"} <small style="color:var(--text-muted);font-size:9px;">(${c.niche || "Outro"})</small></div>
                    <div class="kanban-card-footer">
                        <span class="kanban-card-value">${formatCurrency(c.value)}</span>
                        <span class="kanban-card-days">${getDaysSince(c.createdAt)}</span>
                    </div>
                </div>
            `;

            card.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", c.id);
                card.classList.add("dragging");
                document.body.classList.add("dragging-active");
                
                // Highlight other columns
                document.querySelectorAll(".kanban-column").forEach(col => {
                    if (col.getAttribute("data-status") !== c.status) {
                        col.classList.add("eligible-kanban-drop");
                    }
                });
            });

            card.addEventListener("dragend", () => {
                card.classList.remove("dragging");
                document.body.classList.remove("dragging-active");
                document.querySelectorAll(".kanban-column").forEach(col => {
                    col.classList.remove("eligible-kanban-drop", "drag-hover");
                });
            });

            card.addEventListener("dblclick", () => openContactDetails(c.id));

            columnContainer.appendChild(card);
        });
    });

    // Make columns drop targets
    document.querySelectorAll(".kanban-column").forEach(column => {
        column.addEventListener("dragenter", (e) => {
            e.preventDefault();
            if (column.classList.contains("eligible-kanban-drop")) {
                column.classList.add("drag-hover");
            }
        });

        column.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        column.addEventListener("dragleave", () => {
            column.classList.remove("drag-hover");
        });

        column.addEventListener("drop", (e) => {
            e.preventDefault();
            column.classList.remove("drag-hover");
            const id = e.dataTransfer.getData("text/plain");
            const newStatus = column.getAttribute("data-status");
            
            updateContactStatus(id, newStatus);
        });
    });
}

function updateContactStatus(id, newStatus) {
    const env = getEnv();
    const contact = env.contacts.find(c => c.id === id);
    if (contact && contact.status !== newStatus) {
        if (newStatus === "won") {
            openConversionModal(contact.id);
        } else {
            const oldStatusText = translateStatus(contact.status);
            const newStatusText = translateStatus(newStatus);
            contact.status = newStatus;
            
            contact.timeline.push({
                id: "act_" + Date.now(),
                type: "note",
                description: `Funil atualizado de [${oldStatusText}] para [${newStatusText}]`,
                timestamp: new Date().toISOString()
            });

            saveState();
            renderAll();
            showToast(`O lead "${contact.name}" foi movido para "${newStatusText}".`, 'success');
        }
    }
}

// 4. Customers Management Render
function renderCustomers() {
    const env = getEnv();
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    let filtered = [...env.customers];
    
    if (searchVal) {
        filtered = filtered.filter(cust => 
            cust.name.toLowerCase().includes(searchVal) ||
            (cust.company && cust.company.toLowerCase().includes(searchVal)) ||
            (cust.niche && cust.niche.toLowerCase().includes(searchVal)) ||
            cust.productName.toLowerCase().includes(searchVal)
        );
    }
    
    // Financials calculations
    const activeCustomers = filtered.filter(c => c.status === "active");
    const mrrTotal = activeCustomers
        .filter(c => c.type === "monthly")
        .reduce((sum, c) => sum + c.value, 0);

    const ltvTotal = filtered.reduce((sum, cust) => {
        if (cust.status === "active") {
            return sum + (cust.type === "monthly" ? cust.value * 6 : cust.type === "yearly" ? cust.value : cust.value);
        }
        return sum + (cust.type === "single" ? cust.value : 0);
    }, 0);

    // Calculate unique active clients (by company name, or contact name if no company)
    const uniqueActiveClients = new Set();
    activeCustomers.forEach(c => {
        const nameKey = String(c.company || c.name || "").trim().toLowerCase();
        if (nameKey) uniqueActiveClients.add(nameKey);
    });

    // Update DOM
    document.getElementById("kpiMRR").innerText = formatCurrency(mrrTotal);
    document.getElementById("kpiCustomerLTV").innerText = formatCurrency(ltvTotal);
    document.getElementById("kpiActiveCustomers").innerText = uniqueActiveClients.size;

    const tbody = document.getElementById("customersTableBody");
    const emptyState = document.getElementById("customersEmptyState");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("customersTable").classList.add("hidden");
    } else {
        emptyState.classList.add("hidden");
        document.getElementById("customersTable").classList.remove("hidden");

        // Group services by client company (or name if no company)
        const grouped = [];
        filtered.forEach(cust => {
            const key = String(cust.company || cust.name || "").trim();
            let existing = grouped.find(g => String(g.company || g.clientName || "").trim() === key);
            if (!existing) {
                existing = {
                    clientName: cust.name,
                    company: cust.company,
                    niche: cust.niche,
                    services: [],
                    status: "inactive"
                };
                grouped.push(existing);
            }
            existing.services.push(cust);
            if (cust.status === "active") {
                existing.status = "active";
            }
        });

        grouped.forEach(group => {
            const tr = document.createElement("tr");
            
            const totalActiveValue = group.services
                .filter(s => s.status === "active")
                .reduce((sum, s) => sum + s.value, 0);

            const mrrValue = group.services
                .filter(s => s.status === "active" && s.type === "monthly")
                .reduce((sum, s) => sum + s.value, 0);

            const key = String(group.company || group.clientName || "").trim();
            const serviceCountText = `${group.services.length} ${group.services.length === 1 ? 'Serviço' : 'Serviços'}`;

            const allContactIds = [];
            group.services.forEach(s => {
                const ids = s.contactIds || (s.contactId ? [s.contactId] : []);
                ids.forEach(id => {
                    if (id && !allContactIds.includes(id)) {
                        allContactIds.push(id);
                    }
                });
            });

            const contactNames = allContactIds
                .map(id => {
                    const c = env.contacts.find(x => x.id === id);
                    return c ? c.name : null;
                })
                .filter(Boolean);

            tr.innerHTML = `
                <td>
                    <div class="col-contact-info">
                        <div class="contact-avatar">${getInitials(group.clientName)}</div>
                        <div>
                            <span style="font-weight: 600; display: block;">${group.clientName}</span>
                            ${contactNames.length > 0 ? `<span style="font-size: 10px; color: var(--text-secondary); display: block; margin-top: 2px;">Contatos: ${contactNames.join(", ")}</span>` : ''}
                        </div>
                    </div>
                </td>
                <td>${group.company || "-"}</td>
                <td><span style="font-size: 11px; color: var(--text-secondary); background: var(--bg-app); padding: 2px 6px; border-radius: 4px;">${group.niche || "Outro"}</span></td>
                <td>
                    <button class="btn btn-secondary btn-xs btn-view-client-services" style="font-size: 11px; padding: 4px 10px; display: inline-flex; align-items: center; gap: 6px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-app); color: var(--text-primary); cursor: pointer; font-weight: 500;">
                        <i data-lucide="list" style="width:12px;height:12px;"></i>
                        <span>${serviceCountText}</span>
                    </button>
                </td>
                <td><strong>${formatCurrency(mrrValue)} / mês</strong></td>
                <td><strong>${formatCurrency(totalActiveValue)}</strong></td>
                <td>
                    <span class="badge-status ${group.status}">
                        ${group.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <div class="kanban-card-actions" style="display: flex; gap: 6px;">
                        <button class="btn btn-secondary btn-xs btn-add-service-to-client" style="font-size: 10px; padding: 4px 8px; display: flex; align-items: center; gap: 4px; border-radius: 4px; border: 1px solid var(--border-color); background: transparent; color: var(--text-primary); font-weight: 500; cursor: pointer;">
                            <i data-lucide="plus" style="width:10px;height:10px;"></i> Contratar
                        </button>
                    </div>
                </td>
            `;

            // Bind click to open details modal
            tr.querySelector(".btn-view-client-services").onclick = () => {
                openClientServicesModal(key);
            };

            // Bind quick add service button
            tr.querySelector(".btn-add-service-to-client").onclick = () => {
                openAddCustomer({
                    contactId: group.services[0].contactId,
                    contactIds: allContactIds,
                    name: group.clientName,
                    company: group.company,
                    niche: group.niche
                });
            };

            tbody.appendChild(tr);
        });
        
        safeCreateIcons();
    }
}

function toggleCustomerStatus(id) {
    const env = getEnv();
    const cust = env.customers.find(c => c.id === id);
    if (cust) {
        cust.status = cust.status === "active" ? "inactive" : "active";
        saveState();
        renderAll();
    }
}

function deleteCustomer(id) {
    if (confirm("Deseja realmente remover este registro de faturamento/cliente?")) {
        const env = getEnv();
        env.customers = env.customers.filter(c => c.id !== id);
        saveState();
        renderAll();
    }
}

// 5. Products Management Render
// 5. Products Management Render
function renderProducts() {
    const env = getEnv();
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    // Default any product with undefined isCore to true
    env.products.forEach(p => {
        if (p.isCore === undefined) {
            p.isCore = true;
        }
    });

    let filtered = [...env.products];
    if (searchVal) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchVal) ||
            p.description.toLowerCase().includes(searchVal)
        );
    }

    const coreList = filtered.filter(p => p.isCore === true);
    const subList = filtered.filter(p => p.isCore === false);

    const coreTbody = document.getElementById("coreProductsTableBody");
    const subTbody = document.getElementById("subProductsTableBody");
    const coreEmpty = document.getElementById("coreProductsEmptyState");
    const subEmpty = document.getElementById("subProductsEmptyState");

    if (!coreTbody || !subTbody) return;

    coreTbody.innerHTML = "";
    subTbody.innerHTML = "";

    // 1. Render Core Products
    if (coreList.length === 0) {
        coreEmpty.classList.remove("hidden");
        document.getElementById("coreProductsTable").classList.add("hidden");
    } else {
        coreEmpty.classList.add("hidden");
        document.getElementById("coreProductsTable").classList.remove("hidden");

        coreList.forEach(p => {
            const tr = document.createElement("tr");
            tr.dataset.id = p.id;
            
            const hasAddons = p.suggestedAddons && p.suggestedAddons.length > 0;
            const expandBtn = hasAddons
                ? `<button class="btn-icon-only btn-expand-subproducts" style="margin-right:8px; cursor:pointer;" data-id="${p.id}"><i data-lucide="chevron-right" style="width:14px; height:14px; vertical-align:middle;"></i></button>`
                : `<span style="display:inline-block; width:22px; margin-right:8px;"></span>`;

            tr.innerHTML = `
                <td>
                    <div style="display:flex; align-items:center;">
                        ${expandBtn}
                        <div>
                            <strong style="font-size:12px; color:var(--text-primary);">${p.name}</strong>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="font-size:11px;">
                        ${formatProductPriceHtml(p)}
                    </div>
                </td>
                <td style="text-align: right;">
                    <div style="display: flex; gap: 4px; justify-content: flex-end;">
                        <button class="btn-icon-only btn-edit-product" title="Editar" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;"><i data-lucide="edit-2" style="width:12px;height:12px;"></i></button>
                        <button class="btn-icon-only btn-delete-product" title="Excluir" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button>
                    </div>
                </td>
            `;

            tr.querySelector(".btn-edit-product").addEventListener("click", () => openEditProduct(p.id));
            tr.querySelector(".btn-delete-product").addEventListener("click", () => deleteProduct(p.id));

            // Drag and drop dropzone handlers
            tr.addEventListener("dragover", (e) => {
                e.preventDefault();
                tr.classList.add("dropzone-target-over");
            });
            tr.addEventListener("dragleave", () => {
                tr.classList.remove("dropzone-target-over");
            });
            tr.addEventListener("drop", (e) => {
                e.preventDefault();
                tr.classList.remove("dropzone-target-over");
                const subId = e.dataTransfer.getData("text/plain");
                if (subId && subId !== p.id) {
                    p.suggestedAddons = p.suggestedAddons || [];
                    if (!p.suggestedAddons.includes(subId)) {
                        p.suggestedAddons.push(subId);
                        saveState();
                        renderAll();
                        
                        const subProd = env.products.find(x => x.id === subId);
                        const subProdName = subProd ? subProd.name : "Subproduto";
                        showToast(`"${subProdName}" vinculado a "${p.name}" com sucesso!`, 'success');
                    } else {
                        showToast(`"${p.name}" já possui este subproduto vinculado.`, 'warning');
                    }
                }
            });

            coreTbody.appendChild(tr);

            // Nested subproducts row
            if (hasAddons) {
                const subTr = document.createElement("tr");
                subTr.id = `subproducts-row-${p.id}`;
                subTr.className = "hidden";
                subTr.style.background = "var(--bg-app)";

                const addonItems = p.suggestedAddons
                    .map(aid => env.products.find(x => x.id === aid))
                    .filter(Boolean);

                const addonsListHtml = addonItems.map(item => `
                    <div class="linked-subproduct-item" draggable="true" data-main-id="${p.id}" data-sub-id="${item.id}">
                        <span style="color:var(--text-primary); font-weight:500;">🔗 ${item.name} <span style="font-size:9px;color:var(--text-muted);font-weight:400;margin-left:4px;">(arraste p/ fora p/ desvincular)</span></span>
                        <div style="display:flex; gap:12px; align-items:center;">
                            <span class="badge-recurrence ${item.type}" style="font-size:8px; padding:1px 4px;">${item.type === 'monthly' ? 'Mensal' : 'Único'}</span>
                            <strong style="color:var(--text-secondary);">${formatCurrency(item.price)}</strong>
                            <button class="btn-unlink-subproduct" data-main-id="${p.id}" data-sub-id="${item.id}" title="Remover Vínculo" style="background:transparent; border:none; color:var(--color-danger); cursor:pointer; padding:2px; display:inline-flex; align-items:center; justify-content:center;"><i data-lucide="x" style="width:10px;height:10px;"></i></button>
                        </div>
                    </div>
                `).join('');

                subTr.innerHTML = `
                    <td colspan="4" style="padding: 0 0 12px 24px; border-top:none;">
                        <div style="border-left:3px solid var(--color-primary); background:var(--bg-card); border-radius: var(--radius-sm); border-top:1px solid var(--border-color); border-right:1px solid var(--border-color); border-bottom:1px solid var(--border-color); padding: 8px 0; margin-top: 4px; box-shadow: var(--shadow-sm);">
                            <div style="padding: 4px 12px 8px 12px; font-weight:600; font-size:10px; text-transform:uppercase; color:var(--text-muted); border-bottom:1px solid var(--border-color);">Subprodutos recomendados vinculados:</div>
                            ${addonsListHtml}
                        </div>
                    </td>
                `;
                
                // Bind unlink buttons click
                subTr.querySelectorAll(".btn-unlink-subproduct").forEach(btn => {
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        unlinkSubproduct(btn.dataset.mainId, btn.dataset.subId);
                        const subProd = env.products.find(x => x.id === btn.dataset.subId);
                        const subProdName = subProd ? subProd.name : "Subproduto";
                        showToast(`Vínculo de "${subProdName}" removido com sucesso!`, 'info');
                    };
                });

                // Bind drag unlink triggers on the linked subproduct item
                subTr.querySelectorAll(".linked-subproduct-item").forEach(itemEl => {
                    itemEl.addEventListener("dragstart", (e) => {
                        const mainId = itemEl.dataset.mainId;
                        const subId = itemEl.dataset.subId;
                        e.dataTransfer.setData("application/json", JSON.stringify({ action: "unlink", mainId, subId }));
                        e.dataTransfer.setData("text/plain", subId);
                        itemEl.style.opacity = "0.4";
                        
                        const subCard = document.getElementById("subProductsCard");
                        if (subCard) {
                            subCard.classList.add("subproducts-table-unlink-active");
                        }
                    });
                    itemEl.addEventListener("dragend", () => {
                        itemEl.style.opacity = "";
                        const subCard = document.getElementById("subProductsCard");
                        if (subCard) {
                            subCard.classList.remove("subproducts-table-unlink-active");
                            subCard.classList.remove("subproducts-table-unlink-over");
                        }
                    });
                });

                coreTbody.appendChild(subTr);

                const toggleBtn = tr.querySelector(".btn-expand-subproducts");
                if (toggleBtn) {
                    toggleBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        const row = document.getElementById(`subproducts-row-${p.id}`);
                        if (row) {
                            if (row.classList.contains("hidden")) {
                                row.classList.remove("hidden");
                                toggleBtn.classList.add("expanded");
                            } else {
                                row.classList.add("hidden");
                                toggleBtn.classList.remove("expanded");
                            }
                        }
                    });
                }
            }
        });
    }

    // 2. Render Subproducts
    if (subList.length === 0) {
        subEmpty.classList.remove("hidden");
        document.getElementById("subProductsTable").classList.add("hidden");
    } else {
        subEmpty.classList.add("hidden");
        document.getElementById("subProductsTable").classList.remove("hidden");

        subList.forEach(p => {
            const tr = document.createElement("tr");
            tr.setAttribute("draggable", "true");
            tr.style.cursor = "grab";
            
            // Drag start
            tr.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", p.id);
                e.dataTransfer.setData("action", "link");
                tr.classList.add("subproduct-drag-active");
                
                // Highlight eligible core rows
                document.querySelectorAll("#coreProductsTableBody tr:not([id^='subproducts-row-'])").forEach(row => {
                    row.classList.add("dropzone-target-active");
                });
            });
            tr.addEventListener("dragend", () => {
                tr.classList.remove("subproduct-drag-active");
                
                document.querySelectorAll("#coreProductsTableBody tr").forEach(row => {
                    row.classList.remove("dropzone-target-active", "dropzone-target-over");
                });
            });

            tr.innerHTML = `
                <td style="vertical-align: middle; padding-left: 8px;">
                    <div class="product-drag-handle">
                        <i data-lucide="grip-vertical" style="width: 14px; height: 14px;"></i>
                    </div>
                </td>
                <td>
                    <div>
                        <strong style="font-size:12px; color:var(--text-primary);">${p.name}</strong>
                        ${p.description ? `<div style="font-size:10px; color:var(--text-muted); font-style:italic;">${p.description}</div>` : ''}
                    </div>
                </td>
                <td>
                    <div style="font-size:11px;">
                        ${formatProductPriceHtml(p)}
                    </div>
                </td>
                <td style="text-align: right;">
                    <div style="display: flex; gap: 4px; justify-content: flex-end;">
                        <button class="btn-icon-only btn-edit-product" title="Editar" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer;"><i data-lucide="edit-2" style="width:12px;height:12px;"></i></button>
                        <button class="btn-icon-only btn-delete-product" title="Excluir" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer;"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button>
                    </div>
                </td>
            `;

            tr.querySelector(".btn-edit-product").addEventListener("click", () => openEditProduct(p.id));
            tr.querySelector(".btn-delete-product").addEventListener("click", () => deleteProduct(p.id));

            subTbody.appendChild(tr);
        });
    }

    const subCard = document.getElementById("subProductsCard");
    if (subCard) {
        subCard.addEventListener("dragover", (e) => {
            e.preventDefault();
            subCard.classList.add("subproducts-table-unlink-over");
        });
        subCard.addEventListener("dragleave", () => {
            subCard.classList.remove("subproducts-table-unlink-over");
        });
        subCard.addEventListener("drop", (e) => {
            e.preventDefault();
            subCard.classList.remove("subproducts-table-unlink-over");
            subCard.classList.remove("subproducts-table-unlink-active");
            
            try {
                const dataStr = e.dataTransfer.getData("application/json");
                if (dataStr) {
                    const data = JSON.parse(dataStr);
                    if (data && data.action === "unlink") {
                        unlinkSubproduct(data.mainId, data.subId);
                    }
                }
            } catch (err) {
                console.error("Error drop unlink:", err);
            }
        });
    }

    safeCreateIcons();
}

function unlinkSubproduct(mainId, subId) {
    const env = getEnv();
    const p = env.products.find(x => x.id === mainId);
    if (p) {
        p.suggestedAddons = (p.suggestedAddons || []).filter(id => id !== subId);
        saveState();
        renderAll();
        
        const subProd = env.products.find(x => x.id === subId);
        const subProdName = subProd ? subProd.name : "Subproduto";
        showToast(`"${subProdName}" desvinculado de "${p.name}" com sucesso!`, 'info');
    }
}

function formatProductPriceHtml(p) {
    let html = `<strong>${formatCurrency(p.price)}</strong>`;
    if (p.type === 'monthly') {
        html += ` <span style="font-size: 10px; color: var(--text-muted);">/mês</span>`;
        if (p.yearlyPrice && p.yearlyPrice > 0) {
            const monthlyTotal = p.price * 12;
            const diff = monthlyTotal - p.yearlyPrice;
            if (diff > 0) {
                const pct = Math.round((diff / monthlyTotal) * 100);
                html += `<div style="font-size: 9px; color: var(--color-success); font-weight: 600; margin-top: 2px;" title="Economia de R$ ${formatCurrency(diff)} ao ano">💡 Economize ${pct}% (Anual: R$ ${formatCurrency(p.yearlyPrice)})</div>`;
            }
        }
    } else if (p.type === 'yearly') {
        html += ` <span style="font-size: 10px; color: var(--text-muted);">/ano</span>`;
    } else {
        html += ` <span style="font-size: 10px; color: var(--text-muted);">(Taxa Única)</span>`;
    }
    return html;
}

function openEditProduct(id) {
    const env = getEnv();
    const p = env.products.find(x => x.id === id);
    if (!p) return;

    document.getElementById("productId").value = p.id;
    document.getElementById("productName").value = p.name;
    document.getElementById("productDescription").value = p.description || "";
    document.getElementById("productPrice").value = p.price;
    document.getElementById("productType").value = p.type;
    
    const isCoreInput = document.getElementById("productIsCore");
    if (isCoreInput) {
        isCoreInput.checked = (p.isCore !== false); // default to true if undefined
    }
    
    const yearlyPriceInput = document.getElementById("productYearlyPrice");
    if (yearlyPriceInput) {
        yearlyPriceInput.value = p.yearlyPrice || "";
    }

    // Load suggested addons checkboxes
    populateProductAddons(p.id);
    updateProductEconomyDisplay();

    // Make sure addons container is visible
    const addonsGroup = document.getElementById("productAddonsFormGroup");
    if (addonsGroup) {
        addonsGroup.classList.remove("hidden");
    }

    document.getElementById("productModalTitle").innerText = "Editar Produto";
    document.getElementById("productModal").classList.add("active");
}

function populateProductAddons(selectedProductId = "") {
    const env = getEnv();
    const container = document.getElementById("productAddonsContainer");
    if (!container) return;
    container.innerHTML = "";

    // Show all OTHER subproducts (non-core)
    const addonCandidates = env.products.filter(p => p.id !== selectedProductId && p.isCore === false);
    if (addonCandidates.length === 0) {
        container.innerHTML = `<span style="font-size:11px;color:var(--text-muted);">Nenhum outro serviço disponível no catálogo para vincular</span>`;
        return;
    }

    // Get current product's suggested addons
    const currentProduct = env.products.find(p => p.id === selectedProductId);
    const linkedAddons = currentProduct ? (currentProduct.suggestedAddons || []) : [];

    addonCandidates.forEach(p => {
        const div = document.createElement("div");
        div.style = "display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom: 2px;";
        div.innerHTML = `
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; width:100%;">
                <input type="checkbox" class="product-addon-checkbox" value="${p.id}">
                <span style="flex:1;">${p.name}</span>
                <strong style="color:var(--text-secondary);">${formatCurrency(p.price)}${p.type === 'monthly' ? '/mês' : ''}</strong>
            </label>
        `;
        const cb = div.querySelector("input");
        cb.checked = linkedAddons.includes(p.id);
        container.appendChild(div);
    });
}

function deleteProduct(id) {
    if (confirm("Deseja realmente remover este produto do catálogo?")) {
        const env = getEnv();
        env.products = env.products.filter(p => p.id !== id);
        saveState();
        renderAll();
    }
}

// 6. Tasks Management Render
function renderTasks() {
    const env = getEnv();
    const activeFilter = document.querySelector(".tasks-filters li.active").getAttribute("data-task-filter");
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    let filtered = [...env.tasks];

    if (activeFilter === "pending") {
        filtered = filtered.filter(t => !t.completed);
    } else if (activeFilter === "completed") {
        filtered = filtered.filter(t => t.completed);
    }

    if (searchVal) {
        filtered = filtered.filter(t => t.title.toLowerCase().includes(searchVal));
    }

    const container = document.getElementById("tasksListContainer");
    const emptyState = document.getElementById("tasksEmptyState");
    container.innerHTML = "";

    document.getElementById("tasksBadgeAll").innerText = env.tasks.length;
    document.getElementById("tasksBadgePending").innerText = env.tasks.filter(t => !t.completed).length;
    document.getElementById("tasksBadgeCompleted").innerText = env.tasks.filter(t => t.completed).length;

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
        
        filtered.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            const p = { high: 3, medium: 2, low: 1 };
            if (p[b.priority] !== p[a.priority]) return p[b.priority] - p[a.priority];
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        filtered.forEach(task => {
            const contactName = task.contactId ? (env.contacts.find(c => c.id === task.contactId)?.name || "") : "";
            const div = document.createElement("div");
            div.className = `task-item ${task.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <label class="task-checkbox-wrapper">
                    <input type="checkbox" class="task-toggle" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <div class="task-checkbox"></div>
                </label>
                <div class="task-content">
                    <span class="task-title-text">${task.title}</span>
                    <div class="task-meta">
                        ${contactName ? `<span>👤 ${contactName}</span>` : ""}
                        <span>📅 ${formatDate(task.dueDate)}</span>
                        <span class="task-priority-badge ${task.priority}">${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}</span>
                    </div>
                </div>
                <button class="btn-icon-only btn-delete-task" title="Excluir"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
            `;

            div.querySelector(".task-toggle").addEventListener("change", (e) => {
                toggleTaskComplete(task.id, e.target.checked);
            });
            div.querySelector(".btn-delete-task").addEventListener("click", () => {
                deleteTask(task.id);
            });

            container.appendChild(div);
        });
    }
}

function toggleTaskComplete(id, completed) {
    const env = getEnv();
    const task = env.tasks.find(t => t.id === id);
    if (task) {
        task.completed = completed;
        saveState();
        renderAll();
    }
}

function deleteTask(id) {
    if (confirm("Deseja realmente remover esta tarefa?")) {
        const env = getEnv();
        env.tasks = env.tasks.filter(t => t.id !== id);
        saveState();
        renderAll();
    }
}

// Populate UI selector dropdowns
function populateContactDropdowns() {
    const env = getEnv();
    const select = document.getElementById("taskContact");
    if (select) {
        select.innerHTML = `<option value="">Nenhum Contato</option>`;
        const sorted = [...env.contacts].sort((a,b) => a.name.localeCompare(b.name));
        sorted.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id;
            option.innerText = `${c.name} (${c.company || "Sem Empresa"})`;
            select.appendChild(option);
        });
    }

    populateCustomerContactsMultiselect();
}

function populateCustomerContactsMultiselect() {
    const env = getEnv();
    const dropdown = document.getElementById("customerContactsDropdown");
    if (!dropdown) return;
    
    dropdown.innerHTML = "";
    
    const sorted = [...env.contacts].sort((a,b) => a.name.localeCompare(b.name));
    sorted.forEach(c => {
        const item = document.createElement("div");
        item.className = "multiselect-item";
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = c.id;
        checkbox.id = `chk-contact-${c.id}`;
        
        const label = document.createElement("label");
        label.htmlFor = `chk-contact-${c.id}`;
        label.innerText = `${c.name} (${c.company || "Sem Empresa"})`;
        
        item.appendChild(checkbox);
        item.appendChild(label);
        dropdown.appendChild(item);
        
        item.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                const nameInput = document.getElementById("customerName");
                const companyInput = document.getElementById("customerCompany");
                const nicheInput = document.getElementById("customerNiche");
                
                if (nameInput && !nameInput.value) nameInput.value = c.name || "";
                if (companyInput && !companyInput.value) companyInput.value = c.company || "";
                if (nicheInput && (!nicheInput.value || nicheInput.value === "Outro")) nicheInput.value = c.niche || "Negócio Local";
            }
            updateContactsTriggerText();
        });
    });
    
    updateContactsTriggerText();
}

function updateContactsTriggerText() {
    const dropdown = document.getElementById("customerContactsDropdown");
    const triggerText = document.getElementById("customerContactsTriggerText");
    if (!dropdown || !triggerText) return;
    
    const checked = Array.from(dropdown.querySelectorAll("input[type='checkbox']:checked"));
    if (checked.length === 0) {
        triggerText.innerText = "Selecione os contatos...";
    } else if (checked.length <= 2) {
        const names = checked.map(chk => {
            const label = dropdown.querySelector(`label[for='${chk.id}']`);
            return label ? label.innerText.split(" (")[0] : "";
        });
        triggerText.innerText = names.join(", ");
    } else {
        triggerText.innerText = `${checked.length} contatos selecionados`;
    }
}

function populateCustomerProductsDropdown() {
    const env = getEnv();
    const select = document.getElementById("customerProduct");
    if (!select) return;
    
    select.innerHTML = `<option value="custom">-- Serviço Customizado --</option>`;
    
    const sortedProducts = [...env.products].sort((a, b) => a.name.localeCompare(b.name));
    sortedProducts.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.innerText = `${p.name} (${formatCurrency(p.price)})`;
        select.appendChild(option);
    });
}

function populateConversionProductsDropdown() {
    const env = getEnv();
    const select = document.getElementById("conversionProduct");
    if (!select) return;
    select.innerHTML = "";
    
    env.products.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.innerText = `${p.name} (Ref: ${formatCurrency(p.price)})`;
        select.appendChild(option);
    });

    const updateAddons = () => {
        const selectedId = select.value;
        const container = document.getElementById("conversionAddonsContainer");
        if (!container) return;
        container.innerHTML = "";

        // Show all other products as potential addons
        const addonCandidates = env.products.filter(p => p.id !== selectedId);
        if (addonCandidates.length === 0) {
            container.innerHTML = `<span style="font-size:11px;color:var(--text-muted);">Nenhum serviço adicional disponível</span>`;
            return;
        }

        const coreProd = env.products.find(p => p.id === selectedId);
        const suggested = coreProd ? (coreProd.suggestedAddons || []) : [];

        addonCandidates.forEach(p => {
            const div = document.createElement("div");
            div.style = "display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom: 2px;";
            div.innerHTML = `
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; width:100%;">
                    <input type="checkbox" class="conversion-addon-checkbox" value="${p.id}">
                    <span style="flex:1;">${p.name}</span>
                    <strong style="color:var(--text-secondary);">${formatCurrency(p.price)}${p.type === 'monthly' ? '/mês' : ''}</strong>
                </label>
            `;
            const cb = div.querySelector("input");
            cb.checked = suggested.includes(p.id);
            container.appendChild(div);
        });
    };

    select.addEventListener("change", (e) => {
        const prod = env.products.find(p => p.id === e.target.value);
        if (prod) {
            document.getElementById("conversionPrice").value = prod.price;
            document.getElementById("conversionType").value = prod.type;
        }
        updateAddons();
    });

    // Run initially
    if (env.products.length > 0) {
        const firstProd = env.products[0];
        document.getElementById("conversionPrice").value = firstProd.price;
        document.getElementById("conversionType").value = firstProd.type;
    }
    updateAddons();
}

function populateEventContactsDropdown() {
    const env = getEnv();
    const select = document.getElementById("eventContact");
    if (!select) return;
    select.innerHTML = `<option value="">Nenhum</option>`;
    
    const sorted = [...env.contacts].sort((a,b) => a.name.localeCompare(b.name));
    sorted.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.innerText = `${c.name} (${c.company || "Sem Empresa"})`;
        select.appendChild(option);
    });
}

// 7. Modals Toggles and Actions
// Contact forms
function openAddContact() {
    document.getElementById("contactForm").reset();
    document.getElementById("contactId").value = "";
    document.getElementById("contactNiche").value = "Negócio Local";
    document.getElementById("contactModalTitle").innerText = "Adicionar Contato";
    document.getElementById("contactModal").classList.add("active");
}

function openEditContact(id) {
    const env = getEnv();
    const c = env.contacts.find(x => x.id === id);
    if (!c) return;

    document.getElementById("contactId").value = c.id;
    document.getElementById("contactName").value = c.name;
    document.getElementById("contactCompany").value = c.company || "";
    document.getElementById("contactEmail").value = c.email;
    document.getElementById("contactPhone").value = c.phone || "";
    document.getElementById("contactValue").value = c.value || 0;
    document.getElementById("contactStatus").value = c.status;
    document.getElementById("contactNiche").value = c.niche || "Negócio Local";
    document.getElementById("contactNotes").value = c.notes || "";

    document.getElementById("contactModalTitle").innerText = "Editar Contato";
    document.getElementById("contactModal").classList.add("active");
}

function deleteContact(id) {
    if (confirm("Tem certeza que deseja excluir este contato? Esta ação apagará também o histórico de atividades.")) {
        const env = getEnv();
        env.contacts = env.contacts.filter(c => c.id !== id);
        env.tasks = env.tasks.filter(t => t.contactId !== id);
        saveState();
        renderAll();
    }
}

// Contact details and activities logs
function openContactDetails(id) {
    const env = getEnv();
    const c = env.contacts.find(x => x.id === id);
    if (!c) return;

    document.getElementById("activityContactId").value = c.id;
    document.getElementById("detailInitials").innerText = getInitials(c.name);
    document.getElementById("detailName").innerText = c.name;
    document.getElementById("detailCompany").innerText = c.company || "Sem Empresa";
    document.getElementById("detailEmail").innerText = c.email;
    document.getElementById("detailPhone").innerText = c.phone || "Não cadastrado";
    document.getElementById("detailValue").innerText = formatCurrency(c.value);
    document.getElementById("detailNiche").innerText = c.niche || "Outro";
    
    const badge = document.getElementById("detailBadgeStatus");
    badge.className = `status-badge ${c.status}`;
    badge.innerText = translateStatus(c.status);

    renderTimeline(c);
    
    document.getElementById("contactDetailsModal").classList.add("active");
    safeCreateIcons();
}

function renderTimeline(contact) {
    const container = document.getElementById("contactTimeline");
    container.innerHTML = "";
    
    if (!contact.timeline || contact.timeline.length === 0) {
        container.innerHTML = `<p style="font-size:13px;color:var(--text-muted);text-align:center;padding:20px;">Nenhuma interação registrada.</p>`;
        return;
    }

    const sortedTimeline = [...contact.timeline].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedTimeline.forEach(act => {
        const item = document.createElement("div");
        item.className = `timeline-item ${act.type}`;
        
        let typeEmoji = "📝";
        let typeTitle = "Nota";
        if (act.type === 'call') { typeEmoji = "📞"; typeTitle = "Ligação"; }
        else if (act.type === 'email') { typeEmoji = "✉️"; typeTitle = "E-mail"; }
        else if (act.type === 'meeting') { typeEmoji = "🤝"; typeTitle = "Reunião"; }

        item.innerHTML = `
            <div class="timeline-header">
                <span class="timeline-title">${typeEmoji} ${typeTitle}</span>
                <span class="timeline-time">${formatDate(act.timestamp)}</span>
            </div>
            <p class="timeline-desc">${act.description}</p>
        `;
        container.appendChild(item);
    });
}

// Customers form modal controls
function openAddCustomer(preFill = null) {
    document.getElementById("customerForm").reset();
    document.getElementById("customerId").value = "";
    
    // Reset date fields and document
    const startDateInput = document.getElementById("customerStartDate");
    if (startDateInput) startDateInput.value = new Date().toISOString().split("T")[0];
    const endDateInput = document.getElementById("customerEndDate");
    if (endDateInput) endDateInput.value = "";
    const lastServiceDateInput = document.getElementById("customerLastServiceDate");
    if (lastServiceDateInput) lastServiceDateInput.value = "";
    const documentUrlInput = document.getElementById("customerDocumentUrl");
    if (documentUrlInput) documentUrlInput.value = "";
    
    const dropdown = document.getElementById("customerContactsDropdown");
    if (dropdown) {
        const checkboxes = dropdown.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(chk => chk.checked = false);
    }
    
    if (preFill) {
        document.getElementById("customerName").value = preFill.name || "";
        document.getElementById("customerCompany").value = preFill.company || "";
        document.getElementById("customerNiche").value = preFill.niche || "Negócio Local";
        
        if (dropdown) {
            const targetIds = preFill.contactIds || (preFill.contactId ? [preFill.contactId] : []);
            targetIds.forEach(id => {
                const chk = dropdown.querySelector(`input[value='${id}']`);
                if (chk) chk.checked = true;
            });
        }
        
        if (preFill.startDate && startDateInput) startDateInput.value = preFill.startDate;
        if (preFill.endDate && endDateInput) endDateInput.value = preFill.endDate;
        if (preFill.lastServiceDate && lastServiceDateInput) lastServiceDateInput.value = preFill.lastServiceDate;
        if (preFill.documentUrl && documentUrlInput) documentUrlInput.value = preFill.documentUrl;
    } else {
        document.getElementById("customerName").value = "";
        document.getElementById("customerCompany").value = "";
        document.getElementById("customerNiche").value = "Negócio Local";
    }
    
    updateContactsTriggerText();
    
    const env = getEnv();
    const select = document.getElementById("customerProduct");
    if (select) {
        const firstProduct = env.products && env.products.length > 0 ? env.products.find(p => p && p.id) : null;
        if (firstProduct) {
            select.value = firstProduct.id;
            const priceInput = document.getElementById("customerPrice");
            if (priceInput) priceInput.value = firstProduct.price !== undefined && firstProduct.price !== null ? firstProduct.price : "";
            const billingInput = document.getElementById("customerBillingType");
            if (billingInput) billingInput.value = firstProduct.type || "single";
        } else {
            select.value = "custom";
            const priceInput = document.getElementById("customerPrice");
            if (priceInput) priceInput.value = "";
            const billingInput = document.getElementById("customerBillingType");
            if (billingInput) billingInput.value = "single";
        }
    }
    
    const statusInput = document.getElementById("customerStatus");
    if (statusInput) statusInput.value = "active";
    const titleInput = document.getElementById("customerModalTitle");
    if (titleInput) titleInput.innerText = "Adicionar Serviço ao Cliente";
    const modalInput = document.getElementById("customerModal");
    if (modalInput) modalInput.classList.add("active");
}

let currentDetailsClientKey = "";

function openClientServicesModal(clientKey) {
    currentDetailsClientKey = clientKey;
    const env = getEnv();
    
    const services = env.customers.filter(c => {
        const key = String(c.company || c.name || "").trim();
        return key === clientKey;
    });

    if (services.length === 0) {
        document.getElementById("clientServicesModal").classList.remove("active");
        return;
    }

    const first = services[0];
    document.getElementById("clientServicesModalSubtitle").innerText = first.company ? `${first.company} (Representante: ${first.name})` : first.name;
    
    const tbody = document.getElementById("clientServicesTableBody");
    tbody.innerHTML = "";
    
    let totalVal = 0;

    services.forEach(s => {
        const tr = document.createElement("tr");
        const badgeText = s.type === 'monthly' ? 'Mensal' : s.type === 'yearly' ? 'Anual' : 'Único';
        
        const dateText = (s.startDate ? formatDateBr(s.startDate) : '-') + ' / ' + (s.endDate ? formatDateBr(s.endDate) : '-');
        const lastServiceText = s.lastServiceDate ? formatDateBr(s.lastServiceDate) : '-';
        
        let docHtml = '-';
        if (s.documentUrl) {
            const url = s.documentUrl.startsWith('http') ? s.documentUrl : 'https://' + s.documentUrl;
            docHtml = `<a href="${url}" target="_blank" class="btn-doc-link" title="Abrir Anexo"><i data-lucide="paperclip" style="width:12px;height:12px;"></i></a>`;
        }

        tr.innerHTML = `
            <td><strong>${s.productName}</strong></td>
            <td>
                <span class="badge-recurrence ${s.type}">
                    ${badgeText}
                </span>
            </td>
            <td><strong>${formatCurrency(s.value)}</strong></td>
            <td><span style="font-size: 11px;">${dateText}</span></td>
            <td><span style="font-size: 11px;">${lastServiceText}</span></td>
            <td style="text-align: center;">${docHtml}</td>
            <td>
                <span class="badge-status ${s.status}">
                    ${s.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td style="text-align: right;">
                <div style="display: flex; gap: 4px; justify-content: flex-end;">
                    <button class="btn-icon-only btn-sm btn-edit-service" data-id="${s.id}" title="Editar" style="width: 24px; height: 24px; padding: 0; display: inline-flex; align-items: center; justify-content: center;"><i data-lucide="edit-2" style="width:12px;height:12px;"></i></button>
                    <button class="btn-icon-only btn-sm btn-toggle-service" data-id="${s.id}" title="Alternar Status" style="width: 24px; height: 24px; padding: 0; display: inline-flex; align-items: center; justify-content: center;"><i data-lucide="refresh-cw" style="width:12px;height:12px;"></i></button>
                    <button class="btn-icon-only btn-sm btn-delete-service" data-id="${s.id}" title="Excluir" style="width: 24px; height: 24px; padding: 0; display: inline-flex; align-items: center; justify-content: center;"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button>
                </div>
            </td>
        `;

        if (s.status === "active") {
            totalVal += s.value;
        }

        // Bind inner actions
        tr.querySelector(".btn-edit-service").onclick = () => {
            document.getElementById("clientServicesModal").classList.remove("active");
            openEditCustomer(s.id);
        };
        tr.querySelector(".btn-toggle-service").onclick = () => {
            toggleCustomerStatus(s.id);
            setTimeout(() => openClientServicesModal(clientKey), 100);
        };
        tr.querySelector(".btn-delete-service").onclick = () => {
            deleteCustomer(s.id);
            setTimeout(() => openClientServicesModal(clientKey), 100);
        };

        tbody.appendChild(tr);
    });

    document.getElementById("clientServicesTotalLabel").innerText = `Total Ativo: ${formatCurrency(totalVal)}`;
    document.getElementById("clientServicesModal").classList.add("active");
    safeCreateIcons();
}

function openEditCustomer(id) {
    const env = getEnv();
    const cust = env.customers.find(c => c.id === id);
    if (!cust) return;

    const form = document.getElementById("customerForm");
    if (form) form.reset();
    const idInput = document.getElementById("customerId");
    if (idInput) idInput.value = cust.id;
    
    // Set checkboxes for multiselect
    const dropdown = document.getElementById("customerContactsDropdown");
    if (dropdown) {
        const checkboxes = dropdown.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(chk => chk.checked = false);
        
        const targetIds = cust.contactIds || (cust.contactId ? [cust.contactId] : []);
        targetIds.forEach(cid => {
            const chk = dropdown.querySelector(`input[value='${cid}']`);
            if (chk) chk.checked = true;
        });
    }
    updateContactsTriggerText();

    const nameInput = document.getElementById("customerName");
    if (nameInput) nameInput.value = cust.name || "";
    const companyInput = document.getElementById("customerCompany");
    if (companyInput) companyInput.value = cust.company || "";
    const nicheInput = document.getElementById("customerNiche");
    if (nicheInput) nicheInput.value = cust.niche || "Outro";
    
    const matchingProd = env.products ? env.products.find(p => p && p.name === cust.productName) : null;
    const productSelect = document.getElementById("customerProduct");
    if (productSelect) {
        if (matchingProd) {
            productSelect.value = matchingProd.id;
        } else {
            productSelect.value = "custom";
        }
    }

    const priceInput = document.getElementById("customerPrice");
    if (priceInput) priceInput.value = cust.value !== undefined && cust.value !== null ? cust.value : "";
    const billingInput = document.getElementById("customerBillingType");
    if (billingInput) billingInput.value = cust.type || "single";
    
    // Set date and document fields
    const startDateInput = document.getElementById("customerStartDate");
    if (startDateInput) startDateInput.value = cust.startDate || "";
    const endDateInput = document.getElementById("customerEndDate");
    if (endDateInput) endDateInput.value = cust.endDate || "";
    const lastServiceDateInput = document.getElementById("customerLastServiceDate");
    if (lastServiceDateInput) lastServiceDateInput.value = cust.lastServiceDate || "";
    const documentUrlInput = document.getElementById("customerDocumentUrl");
    if (documentUrlInput) documentUrlInput.value = cust.documentUrl || "";

    const statusInput = document.getElementById("customerStatus");
    if (statusInput) statusInput.value = cust.status || "active";

    const titleInput = document.getElementById("customerModalTitle");
    if (titleInput) titleInput.innerText = "Editar Serviço do Cliente";
    const modalInput = document.getElementById("customerModal");
    if (modalInput) modalInput.classList.add("active");
}


// Products form
document.getElementById("btnCreateProduct").addEventListener("click", () => {
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    document.getElementById("productIsCore").checked = true; // default core to true
    
    const group = document.getElementById("productAddonsFormGroup");
    if (group) group.classList.remove("hidden");

    populateProductAddons(""); // Populate empty addons list
    updateProductEconomyDisplay();
    
    document.getElementById("productModalTitle").innerText = "Adicionar Produto";
    document.getElementById("productModal").classList.add("active");
});
document.getElementById("btnCloseProductModal").addEventListener("click", () => {
    document.getElementById("productModal").classList.remove("active");
});
document.getElementById("btnCancelProductModal").addEventListener("click", () => {
    document.getElementById("productModal").classList.remove("active");
});

const pType = document.getElementById("productType");
const pPrice = document.getElementById("productPrice");
const pYearly = document.getElementById("productYearlyPrice");
if (pType && pPrice && pYearly) {
    const handler = () => updateProductEconomyDisplay();
    pType.addEventListener("change", handler);
    pPrice.addEventListener("input", handler);
    pYearly.addEventListener("input", handler);
}

function updateProductEconomyDisplay() {
    const type = document.getElementById("productType").value;
    const price = parseFloat(document.getElementById("productPrice").value) || 0;
    const yearlyPriceInput = document.getElementById("productYearlyPrice");
    const yearlyPriceRow = document.getElementById("yearlyPriceRow");
    const economyInfo = document.getElementById("productEconomyInfo");
    
    if (type === 'monthly') {
        if (yearlyPriceRow) yearlyPriceRow.style.display = "block";
        const yearlyPrice = parseFloat(yearlyPriceInput?.value) || 0;
        if (price > 0 && yearlyPrice > 0) {
            const monthlyTotal = price * 12;
            const diff = monthlyTotal - yearlyPrice;
            if (diff > 0) {
                const pct = Math.round((diff / monthlyTotal) * 100);
                if (economyInfo) {
                    economyInfo.style.display = "block";
                    economyInfo.innerHTML = `💡 Economia de <strong>${formatCurrency(diff)}</strong> ao ano (<strong>${pct}%</strong> de desconto no plano anual)`;
                }
            } else {
                if (economyInfo) economyInfo.style.display = "none";
            }
        } else {
            if (economyInfo) economyInfo.style.display = "none";
        }
    } else {
        if (yearlyPriceRow) yearlyPriceRow.style.display = "none";
        if (economyInfo) economyInfo.style.display = "none";
    }
}

document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const id = document.getElementById("productId").value;
    const name = document.getElementById("productName").value;
    const description = document.getElementById("productDescription").value;
    const price = parseFloat(document.getElementById("productPrice").value) || 0;
    const type = document.getElementById("productType").value;
    const isCore = document.getElementById("productIsCore")?.checked;
    const yearlyPrice = parseFloat(document.getElementById("productYearlyPrice")?.value) || 0;

    const suggestedAddons = Array.from(document.querySelectorAll(".product-addon-checkbox:checked")).map(cb => cb.value);

    if (id) {
        const p = env.products.find(x => x.id === id);
        if (p) {
            p.name = name;
            p.description = description;
            p.price = price;
            p.type = type;
            p.isCore = isCore;
            p.yearlyPrice = yearlyPrice;
            p.suggestedAddons = suggestedAddons;
        }
    } else {
        const newProd = {
            id: "p_" + Date.now(),
            name,
            description,
            price,
            type,
            isCore,
            yearlyPrice,
            suggestedAddons
        };
        env.products.push(newProd);
    }
    
    saveState();
    document.getElementById("productModal").classList.remove("active");
    renderAll();
});

// Conversion Modal triggers
function openConversionModal(contactId) {
    const env = getEnv();
    const c = env.contacts.find(x => x.id === contactId);
    if (!c) return;

    document.getElementById("conversionContactId").value = c.id;
    
    const select = document.getElementById("conversionProduct");
    if (env.products.length > 0) {
        select.value = env.products[0].id;
        document.getElementById("conversionPrice").value = env.products[0].price;
        document.getElementById("conversionType").value = env.products[0].type;
    } else {
        document.getElementById("conversionPrice").value = c.value;
        document.getElementById("conversionType").value = "single";
    }

    document.getElementById("conversionModal").classList.add("active");
}

document.getElementById("btnCloseConversionModal").addEventListener("click", () => {
    document.getElementById("conversionModal").classList.remove("active");
});
document.getElementById("btnCancelConversionModal").addEventListener("click", () => {
    const env = getEnv();
    const id = document.getElementById("conversionContactId").value;
    const contact = env.contacts.find(c => c.id === id);
    if (contact) {
        const oldStatus = contact.status;
        contact.status = "won";
        contact.timeline.push({
            id: "act_" + Date.now(),
            type: "note",
            description: `Funil atualizado de [${translateStatus(oldStatus)}] para [Ganho] (faturamento não registrado)`,
            timestamp: new Date().toISOString()
        });
        saveState();
    }
    document.getElementById("conversionModal").classList.remove("active");
    renderAll();
});

document.getElementById("conversionForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const contactId = document.getElementById("conversionContactId").value;
    const productId = document.getElementById("conversionProduct").value;
    const finalPrice = parseFloat(document.getElementById("conversionPrice").value) || 0;
    const billingType = document.getElementById("conversionType").value;

    const contact = env.contacts.find(c => c.id === contactId);
    const product = env.products.find(p => p.id === productId);

    if (contact && product) {
        contact.status = "won";
        contact.value = finalPrice;
        
        // Build descriptions for addons too
        const checkedAddonNames = [];
        document.querySelectorAll(".conversion-addon-checkbox:checked").forEach(cb => {
            const addProd = env.products.find(p => p.id === cb.value);
            if (addProd) checkedAddonNames.push(`${addProd.name} (${formatCurrency(addProd.price)})`);
        });

        const noteText = `Venda concluída! Produto Principal: ${product.name} (${formatCurrency(finalPrice)}).` + 
            (checkedAddonNames.length > 0 ? ` Adicionais: ${checkedAddonNames.join(", ")}.` : "");

        contact.timeline.push({
            id: "act_" + Date.now(),
            type: "note",
            description: noteText,
            timestamp: new Date().toISOString()
        });

        // Helper to register billing, invoice and contract
        const registerItem = (prodName, val, rec, suffix = "") => {
            // Add to Customers list
            const newCust = {
                id: "cust_" + Date.now() + suffix,
                contactId: contact.id,
                name: contact.name,
                company: contact.company,
                niche: contact.niche || "Outro",
                productName: prodName,
                value: val,
                type: rec,
                status: "active",
                createdAt: new Date().toISOString()
            };
            env.customers.push(newCust);

            // Auto-generate invoice
            const newInvoice = {
                id: "FAT-" + Date.now().toString().substring(8) + suffix,
                customerName: contact.name,
                company: contact.company || "-",
                niche: contact.niche || "Outro",
                productName: prodName,
                value: val,
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                status: "pending"
            };
            env.invoices.push(newInvoice);

            // Auto-generate contract draft
            const newCon = {
                id: "CONTR-" + Date.now().toString().substring(8) + suffix,
                contactId: contact.id,
                proposalId: "DIRECT-CONV-" + Date.now().toString().substring(8),
                clientName: contact.name,
                company: contact.company || "Pessoa Física",
                productName: prodName,
                value: val,
                recurrence: rec,
                startDate: new Date().toISOString().split("T")[0],
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                status: "draft"
            };
            env.contracts.push(newCon);
        };

        // Core
        registerItem(product.name, finalPrice, billingType, "-core");

        // Addons
        document.querySelectorAll(".conversion-addon-checkbox:checked").forEach((cb, idx) => {
            const addProd = env.products.find(p => p.id === cb.value);
            if (addProd) {
                registerItem(addProd.name, addProd.price, addProd.type, `-add${idx}`);
            }
        });

        saveState();
    }

    document.getElementById("conversionModal").classList.remove("active");
    renderAll();
});

// Import Modal Triggers
function setupOpenImportButton() {
    document.getElementById("btnOpenImport").addEventListener("click", () => {
        document.getElementById("importText").value = "";
        document.getElementById("importLogsPanel").classList.add("hidden");
        document.getElementById("importLogsTableBody").innerHTML = "";
        document.getElementById("importFileName").innerText = "Nenhum arquivo selecionado";
        document.getElementById("importModal").classList.add("active");
    });
}

document.getElementById("btnCloseImportModal").addEventListener("click", () => {
    document.getElementById("importModal").classList.remove("active");
});
document.getElementById("btnCancelImportModal").addEventListener("click", () => {
    document.getElementById("importModal").classList.remove("active");
});

// Execute Lead Import (CSV parsing and duplicate check)
document.getElementById("btnExecuteImport").addEventListener("click", () => {
    const env = getEnv();
    const textData = document.getElementById("importText").value.trim();
    const logTableBody = document.getElementById("importLogsTableBody");
    logTableBody.innerHTML = "";
    
    if (!textData) {
        showToast("Por favor, cole os dados CSV na caixa de texto.", "warning");
        return;
    }

    const lines = textData.split("\n");
    if (lines.length <= 1) {
        showToast("O CSV inserido não possui registros suficientes.", "error");
        return;
    }

    const records = lines.slice(1);
    
    let successCount = 0;
    let ignoredCount = 0;
    const importLogs = [];
    
    document.getElementById("importLogsPanel").classList.remove("hidden");

    records.forEach((record, index) => {
        const lineNum = index + 2;
        if (!record.trim()) return;

        const cells = record.split(",").map(c => c.trim());
        
        // Map fields (Nome, Empresa, Email, Telefone, Valor, Nicho, Notas)
        const name = cells[0] || "";
        const company = cells[1] || "";
        const email = cells[2] || "";
        const phone = cells[3] || "";
        const value = parseFloat(cells[4]) || 0;
        const niche = cells[5] || "Outro";
        const notes = cells[6] || "";

        if (!name || (!email && !phone)) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>Linha ${lineNum}</td>
                <td><span class="badge-status inactive">Ignorado</span></td>
                <td>Nome ou Canal de contato (E-mail/Telefone) ausentes no registro.</td>
            `;
            logTableBody.appendChild(tr);
            importLogs.push(`Linha ${lineNum}: Ignorado - Nome ou Contato ausentes`);
            ignoredCount++;
            return;
        }

        const duplicateEmail = email && env.contacts.some(c => c.email && c.email.toLowerCase() === email.toLowerCase());
        const duplicatePhone = phone && env.contacts.some(c => c.phone && c.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));

        if (duplicateEmail) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>Linha ${lineNum} (${name})</td>
                <td><span class="badge-status inactive">Duplicado</span></td>
                <td>O e-mail '${email}' já existe no ambiente.</td>
            `;
            logTableBody.appendChild(tr);
            importLogs.push(`Linha ${lineNum} (${name}): Ignorado - E-mail '${email}' já existe`);
            ignoredCount++;
            return;
        }

        if (duplicatePhone) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>Linha ${lineNum} (${name})</td>
                <td><span class="badge-status inactive">Duplicado</span></td>
                <td>O telefone '${phone}' já está cadastrado.</td>
            `;
            logTableBody.appendChild(tr);
            importLogs.push(`Linha ${lineNum} (${name}): Ignorado - Telefone '${phone}' já cadastrado`);
            ignoredCount++;
            return;
        }

        // Auto map status from notes (e.g. 🏆, ✉️, 🔥, 💬)
        let status = "lead";
        const notesLower = notes.toLowerCase();
        if (notesLower.includes("fechamento") || notesLower.includes("🏆") || notesLower.includes("ganho")) {
            status = "won";
        } else if (notesLower.includes("proposta") || notesLower.includes("✉️")) {
            status = "proposal";
        } else if (notesLower.includes("interessado") || notesLower.includes("🔥") || notesLower.includes("negociação")) {
            status = "negotiating";
        } else if (notesLower.includes("conversa") || notesLower.includes("💬") || notesLower.includes("contatado")) {
            status = "contacted";
        }

        const newContact = {
            id: "c_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            name,
            company,
            email,
            phone,
            value,
            niche,
            status,
            notes,
            createdAt: new Date().toISOString(),
            timeline: [
                { id: "act_" + Date.now(), type: "note", description: `Contato importado via planilha CSV. Estágio detectado: ${translateStatus(status)}`, timestamp: new Date().toISOString() }
            ]
        };

        env.contacts.push(newContact);
        successCount++;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>Linha ${lineNum} (${name})</td>
            <td><span class="badge-status active">Sucesso</span></td>
            <td>Lead importado com sucesso.</td>
        `;
        logTableBody.appendChild(tr);
        importLogs.push(`Linha ${lineNum} (${name}): Sucesso - Lead importado`);
    });

    // Save to history
    env.importHistory = env.importHistory || [];
    env.importHistory.push({
        id: "imp_" + Date.now(),
        date: new Date().toISOString(),
        fileName: document.getElementById("importFileName")?.innerText || "Importação Direta",
        successCount: successCount,
        failCount: ignoredCount,
        details: importLogs
    });

    saveState();
    renderAll();
    showToast(`Importação concluída. ${successCount} importados, ${ignoredCount} ignorados.`, "success");
});

// File reader parser
document.getElementById("importFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById("importFileName").innerText = file.name;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const content = evt.target.result;
        if (file.name.endsWith(".json")) {
            try {
                const arr = JSON.parse(content);
                if (Array.isArray(arr)) {
                    let csvText = "Nome,Empresa,Email,Telefone,Valor,Nicho,Notas\n";
                    arr.forEach(item => {
                        csvText += `${item.name || ""},${item.company || ""},${item.email || ""},${item.phone || ""},${item.value || 0},${item.niche || "Outro"},${item.notes || ""}\n`;
                    });
                    document.getElementById("importText").value = csvText;
                } else {
                    showToast("JSON inválido: deve ser uma lista de objetos.", "error");
                }
            } catch (err) {
                showToast("Erro ao ler JSON: " + err.message, "error");
            }
        } else {
            document.getElementById("importText").value = content;
        }
    };
    reader.readAsText(file);
});

// Login overlay Form submission
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();
    const errorMsg = document.getElementById("loginErrorMsg");

    if (user === "Admin" && pass === "080125") {
        sessionStorage.setItem("nexus_crm_logged_in", "true");
        sessionStorage.setItem("nexus_crm_env", "webco");
        state.currentEnv = "webco";
        
        errorMsg.classList.add("hidden");
        document.getElementById("loginOverlay").classList.add("hidden");
        document.getElementById("appContainer").classList.remove("hidden");
        document.getElementById("appContainer").classList.add("logged-in");
        document.getElementById("sidebarUsername").innerText = "Admin";
        
        ensureParanaEcoturismo();
        renderAll();
        // Setup late bind buttons after login loads DOM
        setupOpenImportButton();
    } else {
        errorMsg.classList.remove("hidden");
        const card = document.querySelector(".login-card");
        card.style.animation = "shake 0.3s ease-in-out";
        setTimeout(() => card.style.animation = "", 300);
    }
});

// Logout handler
document.getElementById("btnLogout").addEventListener("click", () => {
    sessionStorage.removeItem("nexus_crm_logged_in");
    sessionStorage.removeItem("nexus_crm_env");
    state.currentEnv = "";
    document.getElementById("loginOverlay").classList.remove("hidden");
    document.getElementById("appContainer").classList.add("hidden");
    document.getElementById("appContainer").classList.remove("logged-in");
    document.getElementById("loginForm").reset();
});

// Navigation & Tab Switching
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view-section");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const targetView = item.getAttribute("data-view");
        
        navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");

        views.forEach(view => {
            if (view.id === `${targetView}View`) {
                view.classList.add("active");
            } else {
                view.classList.remove("active");
            }
        });
        
        renderAll();
    });
});

// Link quick buttons
document.getElementById("btnViewAllContacts").addEventListener("click", () => {
    document.querySelector('[data-view="contacts"]').click();
});
document.getElementById("btnViewAllTasks").addEventListener("click", () => {
    document.querySelector('[data-view="tasks"]').click();
});

// Search input handler
const searchInput = document.getElementById("globalSearch");
searchInput.addEventListener("input", () => {
    const activeTab = document.querySelector(".nav-item.active").getAttribute("data-view");
    if (activeTab === "contacts") renderContacts();
    else if (activeTab === "kanban") renderKanban();
    else if (activeTab === "tasks") renderTasks();
    else if (activeTab === "dashboard") renderDashboard();
    else if (activeTab === "customers") renderCustomers();
    else if (activeTab === "products") renderProducts();
    else if (activeTab === "proposals") renderProposals();
    else if (activeTab === "contracts") renderContracts();
    else if (activeTab === "finance") renderFinance();
    else if (activeTab === "marketing") renderMarketingAssets();
});

// Modals Trigger Handlers
const btnQuickAdd = document.getElementById("btnQuickAddContact");
if (btnQuickAdd) btnQuickAdd.addEventListener("click", openAddContact);
const btnAddContact = document.getElementById("btnAddContact");
if (btnAddContact) btnAddContact.addEventListener("click", openAddContact);
document.getElementById("btnCloseContactModal").addEventListener("click", () => {
    document.getElementById("contactModal").classList.remove("active");
});
document.getElementById("btnCancelContactModal").addEventListener("click", () => {
    document.getElementById("contactModal").classList.remove("active");
});
document.getElementById("btnCloseDetailsModal").addEventListener("click", () => {
    document.getElementById("contactDetailsModal").classList.remove("active");
});

// Add Task Modal Toggle
document.getElementById("btnAddTask").addEventListener("click", () => {
    document.getElementById("taskForm").reset();
    document.getElementById("taskModal").classList.add("active");
});
document.getElementById("btnCloseTaskModal").addEventListener("click", () => {
    document.getElementById("taskModal").classList.remove("active");
});
document.getElementById("btnCancelTaskModal").addEventListener("click", () => {
    document.getElementById("taskModal").classList.remove("active");
});

// Contacts filter dropdown listener
const filterStatus = document.getElementById("filterStatus");
if (filterStatus) {
    filterStatus.addEventListener("change", () => {
        renderContacts();
    });
}

// Task Filter Tabs Navigation
document.querySelectorAll(".tasks-filters li").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tasks-filters li").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        renderTasks();
    });
});

// Form Submission Handlers
// Contact Form
document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const id = document.getElementById("contactId").value;
    const name = document.getElementById("contactName").value;
    const company = document.getElementById("contactCompany").value;
    const email = document.getElementById("contactEmail").value;
    const phone = document.getElementById("contactPhone").value;
    const value = parseFloat(document.getElementById("contactValue").value) || 0;
    const status = document.getElementById("contactStatus").value;
    const niche = document.getElementById("contactNiche").value;
    const notes = document.getElementById("contactNotes").value;

    if (id) {
        const contact = env.contacts.find(c => c.id === id);
        if (contact) {
            const oldStatusText = translateStatus(contact.status);
            const newStatusText = translateStatus(status);
            
            contact.name = name;
            contact.company = company;
            contact.email = email;
            contact.phone = phone;
            contact.value = value;
            contact.niche = niche;
            
            if (contact.status !== status) {
                if (status === "won") {
                    document.getElementById("contactModal").classList.remove("active");
                    openConversionModal(contact.id);
                    return;
                } else {
                    contact.status = status;
                    contact.timeline.push({
                        id: "act_" + Date.now(),
                        type: "note",
                        description: `Funil atualizado de [${oldStatusText}] para [${newStatusText}]`,
                        timestamp: new Date().toISOString()
                    });
                }
            }
            contact.notes = notes;
        }
    } else {
        const newContact = {
            id: "c_" + Date.now(),
            name,
            company,
            email,
            phone,
            value,
            status,
            niche,
            notes,
            createdAt: new Date().toISOString(),
            timeline: [
                { id: "act_" + Date.now(), type: "note", description: "Contato cadastrado no sistema.", timestamp: new Date().toISOString() }
            ]
        };
        env.contacts.push(newContact);
        
        if (status === "won") {
            saveState();
            document.getElementById("contactModal").classList.remove("active");
            openConversionModal(newContact.id);
            return;
        }
    }

    saveState();
    document.getElementById("contactModal").classList.remove("active");
    renderAll();
});

// Activity Form
document.getElementById("activityForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const contactId = document.getElementById("activityContactId").value;
    const type = document.getElementById("activityType").value;
    const description = document.getElementById("activityDescription").value;

    const contact = env.contacts.find(c => c.id === contactId);
    if (contact) {
        contact.timeline.push({
            id: "act_" + Date.now(),
            type,
            description,
            timestamp: new Date().toISOString()
        });
        saveState();
        renderTimeline(contact);
        document.getElementById("activityForm").reset();
        renderAll();
    }
});

// Task Form
document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const title = document.getElementById("taskTitle").value;
    const contactId = document.getElementById("taskContact").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const priority = document.getElementById("taskPriority").value;

    const newTask = {
        id: "t_" + Date.now(),
        title,
        contactId,
        dueDate,
        priority,
        completed: false
    };

    env.tasks.push(newTask);
    saveState();
    document.getElementById("taskModal").classList.remove("active");
    renderAll();
});

// Theme Toggle
const themeToggleBtn = document.getElementById("themeToggleBtn");
themeToggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    if (isDark) {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        themeToggleBtn.querySelector("span").innerText = "Modo Escuro";
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        themeToggleBtn.querySelector("span").innerText = "Modo Claro";
    }
    renderCharts();
});

// Toggle Privacy Mode Event Listener
const privacyBtn = document.getElementById("btnTogglePrivacy");
privacyBtn.addEventListener("click", () => {
    state.privacyMode = !state.privacyMode;
    updatePrivacyIcon();
    saveState();
    renderAll();
});

function updatePrivacyIcon() {
    const privacyBtn = document.getElementById("btnTogglePrivacy");
    if (privacyBtn) {
        if (state.privacyMode) {
            privacyBtn.innerHTML = `<i data-lucide="eye-off"></i>`;
        } else {
            privacyBtn.innerHTML = `<i data-lucide="eye"></i>`;
        }
        safeCreateIcons();
    }
}

// 8. Proposals Management Render & Builder
function renderProposals() {
    const env = getEnv();
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    let filtered = [...env.proposals];

    if (searchVal) {
        filtered = filtered.filter(prop => {
            const contactName = prop.contactId ? (env.contacts.find(c => c.id === prop.contactId)?.name || "") : "";
            const productName = prop.productName || "";
            return contactName.toLowerCase().includes(searchVal) || productName.toLowerCase().includes(searchVal);
        });
    }

    const tbody = document.getElementById("proposalsTableBody");
    const emptyState = document.getElementById("proposalsEmptyState");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("proposalsTable").classList.add("hidden");
    } else {
        emptyState.classList.add("hidden");
        document.getElementById("proposalsTable").classList.remove("hidden");

        filtered.forEach(prop => {
            const contact = env.contacts.find(c => c.id === prop.contactId);
            const contactName = contact ? contact.name : "Nenhum";
            const companyName = contact && contact.company ? ` (${contact.company})` : "";
            const tr = document.createElement("tr");
            
            let statusText = "Pendente";
            let statusBadge = "warning";
            if (prop.status === "accepted") { statusText = "Aceita (Ganho)"; statusBadge = "positive"; }
            else if (prop.status === "declined") { statusText = "Recusada"; statusBadge = "inactive"; }

            tr.innerHTML = `
                <td><strong>${contactName}</strong><br><small style="color:var(--text-muted)">${companyName || "-"}</small></td>
                <td>${prop.productName}</td>
                <td><strong>${formatCurrency(prop.value)}</strong></td>
                <td>
                    <span class="badge-recurrence ${prop.recurrence}">
                        ${prop.recurrence === 'monthly' ? 'Mensal' : prop.recurrence === 'yearly' ? 'Anual' : 'Único'}
                    </span>
                </td>
                <td>${formatDate(prop.date)}</td>
                <td><span class="badge-status ${statusBadge}">${statusText}</span></td>
                <td>
                    <div class="kanban-card-actions">
                        <button class="btn-icon-only btn-view-proposal" title="Visualizar / Editar"><i data-lucide="eye" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-delete-proposal" title="Excluir"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </td>
            `;

            tr.querySelector(".btn-view-proposal").addEventListener("click", () => openViewProposal(prop.id));
            tr.querySelector(".btn-delete-proposal").addEventListener("click", () => deleteProposal(prop.id));

            tbody.appendChild(tr);
        });
    }
}

function openCreateProposal() {
    const env = getEnv();
    if (env.contacts.length === 0) {
        showToast("Cadastre pelo menos um lead para gerar propostas!", "warning");
        return;
    }

    document.getElementById("proposalConfigForm").reset();
    document.getElementById("proposalId").value = "";
    
    // Populate dropdowns
    populateProposalDropdowns();
    
    // Set default values
    if (env.products.length > 0) {
        document.getElementById("proposalProductSelect").value = env.products[0].id;
        document.getElementById("proposalFinalValue").value = env.products[0].price;
        document.getElementById("proposalRecurrence").value = env.products[0].type;
    } else {
        document.getElementById("proposalFinalValue").value = 1000;
        document.getElementById("proposalRecurrence").value = "single";
    }
    
    document.getElementById("proposalStatusSelect").value = "pending";
    
    // Show Builder, Hide List
    document.getElementById("proposalsListWrapper").classList.add("hidden");
    document.getElementById("proposalBuilderWrapper").classList.remove("hidden");
    
    // Trigger live preview update
    updateProposalPreview();
}

function openViewProposal(id) {
    const env = getEnv();
    const prop = env.proposals.find(p => p.id === id);
    if (!prop) return;

    // Populate dropdowns
    populateProposalDropdowns();

    // Load form values
    document.getElementById("proposalId").value = prop.id;
    document.getElementById("proposalContactSelect").value = prop.contactId;
    document.getElementById("proposalProductSelect").value = prop.productId || "";
    document.getElementById("proposalFinalValue").value = prop.value;
    document.getElementById("proposalRecurrence").value = prop.recurrence;
    document.getElementById("proposalStatusSelect").value = prop.status;

    // Restore checkbox addons state
    if (prop.addons && Array.isArray(prop.addons)) {
        document.querySelectorAll(".proposal-addon-checkbox").forEach(cb => {
            cb.checked = prop.addons.includes(cb.value);
        });
    }

    // Show Builder, Hide List
    document.getElementById("proposalsListWrapper").classList.add("hidden");
    document.getElementById("proposalBuilderWrapper").classList.remove("hidden");
    
    // Trigger live preview update
    updateProposalPreview();
}

function populateProposalDropdowns() {
    const env = getEnv();
    
    // Contacts select
    const cSelect = document.getElementById("proposalContactSelect");
    cSelect.innerHTML = "";
    env.contacts.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.innerText = `${c.name} (${c.company || "Sem Empresa"})`;
        cSelect.appendChild(opt);
    });

    // Products select - show all products
    const pSelect = document.getElementById("proposalProductSelect");
    pSelect.innerHTML = `<option value="custom">-- Serviço Customizado --</option>`;
    env.products.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.innerText = p.name;
        pSelect.appendChild(opt);
    });

    const updateProposalAddons = () => {
        const selectedId = pSelect.value;
        const container = document.getElementById("proposalAddonsContainer");
        container.innerHTML = "";

        // Show all other products as potential addons
        const addonCandidates = env.products.filter(p => p.id !== selectedId);
        if (addonCandidates.length === 0) {
            container.innerHTML = `<span style="font-size:11px;color:var(--text-muted);">Nenhum serviço adicional disponível</span>`;
            return;
        }

        const coreProd = env.products.find(p => p.id === selectedId);
        const suggested = coreProd ? (coreProd.suggestedAddons || []) : [];

        addonCandidates.forEach(p => {
            const div = document.createElement("div");
            div.style = "display:flex; align-items:center; gap:8px; font-size:12px;";
            div.innerHTML = `
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; width:100%;">
                    <input type="checkbox" class="proposal-addon-checkbox" value="${p.id}">
                    <span style="flex:1;">${p.name}</span>
                    <strong style="color:var(--text-secondary);">${formatCurrency(p.price)}${p.type === 'monthly' ? '/mês' : ''}</strong>
                </label>
            `;
            const cb = div.querySelector("input");
            cb.checked = suggested.includes(p.id);
            cb.addEventListener("change", updateProposalPreview);
            container.appendChild(div);
        });
        updateProposalPreview();
    };

    pSelect.addEventListener("change", updateProposalAddons);
    
    // Also trigger preview updates when main selectors change
    cSelect.addEventListener("change", updateProposalPreview);
    document.getElementById("proposalFinalValue").addEventListener("input", updateProposalPreview);
    document.getElementById("proposalRecurrence").addEventListener("change", updateProposalPreview);

    updateProposalAddons();
}

function updateProposalPreview() {
    const env = getEnv();
    
    const propId = document.getElementById("proposalId").value || "PROP-" + Date.now().toString().substring(8);
    const contactId = document.getElementById("proposalContactSelect").value;
    const productId = document.getElementById("proposalProductSelect").value;
    const finalVal = parseFloat(document.getElementById("proposalFinalValue").value) || 0;
    const recurrence = document.getElementById("proposalRecurrence").value;

    const contact = env.contacts.find(c => c.id === contactId);
    let productName = "Serviço Customizado";
    let scopeList = [];

    if (productId !== "custom") {
        const prod = env.products.find(p => p.id === productId);
        if (prod) {
            productName = prod.name;
            scopeList = getScopeList(prod.id);
        }
    } else {
        scopeList = getScopeList("custom");
    }

    // Write to DOM elements in proposalPrintArea
    document.getElementById("previewProposalId").innerText = propId;
    document.getElementById("previewProposalDate").innerText = formatDate(new Date().toISOString());

    if (contact) {
        document.getElementById("previewClientName").innerText = contact.name;
        document.getElementById("previewClientDetails").innerText = `${contact.company || "Pessoa Física"} - ${contact.email}`;
        document.getElementById("previewSignatureClient").innerText = contact.name;
    } else {
        document.getElementById("previewClientName").innerText = "Cliente não selecionado";
        document.getElementById("previewClientDetails").innerText = "";
        document.getElementById("previewSignatureClient").innerText = "Contratante";
    }

    document.getElementById("previewProductName").innerText = productName;

    // Fill scope list in preview
    const scopeContainer = document.getElementById("previewProductScope");
    scopeContainer.innerHTML = "";
    const ul = document.createElement("ul");
    scopeList.forEach(s => {
        const li = document.createElement("li");
        li.innerText = s;
        ul.appendChild(li);
    });
    scopeContainer.appendChild(ul);

    // Format financial table recurrence & value
    const tableBody = document.getElementById("previewFinancialTableBody");
    if (tableBody) {
        tableBody.innerHTML = "";

        // Core row
        const coreTr = document.createElement("tr");
        const recText = recurrence === 'monthly' ? 'Mensalidade Recorrente' : recurrence === 'yearly' ? 'Anualidade Recorrente' : 'Taxa Única';
        coreTr.innerHTML = `
            <td><strong>${productName}</strong> <span style="font-size: 9px; color: var(--text-muted);">(Produto Principal)</span></td>
            <td>${recText}</td>
            <td><strong>${formatCurrency(finalVal)}</strong></td>
        `;
        tableBody.appendChild(coreTr);

        // Addons rows
        document.querySelectorAll(".proposal-addon-checkbox:checked").forEach(cb => {
            const prod = env.products.find(p => p.id === cb.value);
            if (prod) {
                const addTr = document.createElement("tr");
                const addRecText = prod.type === 'monthly' ? 'Mensalidade Recorrente' : prod.type === 'yearly' ? 'Anualidade Recorrente' : 'Taxa Única';
                addTr.innerHTML = `
                    <td><strong>${prod.name}</strong> <span style="font-size: 9px; color: var(--text-muted);">(Adicional/Conectado)</span></td>
                    <td>${addRecText}</td>
                    <td><strong>${formatCurrency(prod.price)}</strong></td>
                `;
                tableBody.appendChild(addTr);
            }
        });
    }
}

function saveProposal() {
    const env = getEnv();
    
    const id = document.getElementById("proposalId").value;
    const contactId = document.getElementById("proposalContactSelect").value;
    const productId = document.getElementById("proposalProductSelect").value;
    const finalVal = parseFloat(document.getElementById("proposalFinalValue").value) || 0;
    const recurrence = document.getElementById("proposalRecurrence").value;
    const status = document.getElementById("proposalStatusSelect").value;

    let productName = "Serviço Customizado";
    if (productId !== "custom") {
        const prod = env.products.find(p => p.id === productId);
        if (prod) productName = prod.name;
    }

    let savedProp = null;
    const checkedAddons = Array.from(document.querySelectorAll(".proposal-addon-checkbox:checked")).map(cb => cb.value);

    if (id) {
        // Edit existing proposal
        const prop = env.proposals.find(p => p.id === id);
        if (prop) {
            prop.contactId = contactId;
            prop.productId = productId;
            prop.productName = productName;
            prop.value = finalVal;
            prop.recurrence = recurrence;
            prop.status = status;
            prop.addons = checkedAddons;
            savedProp = prop;
        }
    } else {
        // Create new proposal
        const newProp = {
            id: "PROP-" + Date.now().toString().substring(8),
            contactId,
            productId,
            productName,
            value: finalVal,
            recurrence,
            status,
            addons: checkedAddons,
            date: new Date().toISOString()
        };
        env.proposals.push(newProp);
        savedProp = newProp;
    }

    // Integrated Contracts & Invoices generation if proposal is WON
    if (savedProp && savedProp.status === "accepted") {
        triggerProposalWonFlow(savedProp);
    }

    saveState();
    
    // Hide Builder, Show List
    document.getElementById("proposalBuilderWrapper").classList.add("hidden");
    document.getElementById("proposalsListWrapper").classList.remove("hidden");
    
    renderAll();
}

function triggerProposalWonFlow(proposal) {
    const env = getEnv();
    const contact = env.contacts.find(c => c.id === proposal.contactId);
    
    // 1. Create contract if not already exists
    const contractExists = env.contracts.some(con => con.proposalId === proposal.id);
    if (!contractExists) {
        const newCon = {
            id: "CONTR-" + Date.now().toString().substring(8),
            contactId: proposal.contactId,
            proposalId: proposal.id,
            clientName: contact ? contact.name : "Nenhum",
            company: contact ? (contact.company || "Pessoa Física") : "Pessoa Física",
            productName: proposal.productName,
            value: proposal.value,
            recurrence: proposal.recurrence,
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "draft"
        };
        env.contracts.push(newCon);
    }

    // 2. Create invoice
    const invoiceExists = env.invoices.some(inv => inv.id === "FAT-" + proposal.id.substring(5));
    if (!invoiceExists) {
        const newInv = {
            id: "FAT-" + Date.now().toString().substring(8),
            customerName: contact ? contact.name : "Nenhum",
            company: contact ? (contact.company || "-") : "-",
            niche: contact ? (contact.niche || "Outro") : "Outro",
            productName: proposal.productName,
            value: proposal.value,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "pending"
        };
        env.invoices.push(newInv);
    }

    // 3. Create active customer
    const customerExists = env.customers.some(cust => cust.contactId === proposal.contactId && cust.productName === proposal.productName);
    if (!customerExists) {
        const newCust = {
            id: "cust_" + Date.now(),
            contactId: proposal.contactId,
            name: contact ? contact.name : "Nenhum",
            company: contact ? (contact.company || "-") : "-",
            niche: contact ? (contact.niche || "Outro") : "Outro",
            productName: proposal.productName,
            value: proposal.value,
            type: proposal.recurrence,
            status: "active",
            createdAt: new Date().toISOString()
        };
        env.customers.push(newCust);
    }
}

function deleteProposal(id) {
    if (confirm("Tem certeza que deseja excluir esta proposta comercial?")) {
        const env = getEnv();
        env.proposals = env.proposals.filter(p => p.id !== id);
        saveState();
        renderAll();
    }
}

// 9. Contracts Management
function renderContracts() {
    const env = getEnv();
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    let filtered = [...env.contracts];

    if (searchVal) {
        filtered = filtered.filter(con => 
            con.clientName.toLowerCase().includes(searchVal) || 
            con.productName.toLowerCase().includes(searchVal) ||
            con.company.toLowerCase().includes(searchVal)
        );
    }

    const tbody = document.getElementById("contractsTableBody");
    const emptyState = document.getElementById("contractsEmptyState");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("contractsTable").classList.add("hidden");
    } else {
        emptyState.classList.add("hidden");
        document.getElementById("contractsTable").classList.remove("hidden");

        filtered.forEach(con => {
            const tr = document.createElement("tr");
            
            let statusText = "Rascunho";
            let statusBadge = "warning";
            if (con.status === "active") { statusText = "Ativo"; statusBadge = "active"; }
            else if (con.status === "expired") { statusText = "Encerrado"; statusBadge = "inactive"; }

            tr.innerHTML = `
                <td><strong>${con.clientName}</strong><br><small style="color:var(--text-muted)">${con.company}</small></td>
                <td>${con.productName}</td>
                <td><strong>${formatCurrency(con.value)}</strong> <small style="color:var(--text-muted)">(${con.recurrence === 'monthly' ? 'Mensal' : con.recurrence === 'yearly' ? 'Anual' : 'Único'})</small></td>
                <td>${formatDate(con.startDate)}</td>
                <td>${formatDate(con.endDate)}</td>
                <td><span class="badge-status ${statusBadge}">${statusText}</span></td>
                <td>
                    <div class="kanban-card-actions">
                        <button class="btn-icon-only btn-view-contract" title="Visualizar Contrato"><i data-lucide="file-text" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-delete-contract" title="Excluir"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </td>
            `;

            tr.querySelector(".btn-view-contract").addEventListener("click", () => openViewContract(con.id));
            tr.querySelector(".btn-delete-contract").addEventListener("click", () => deleteContract(con.id));

            tbody.appendChild(tr);
        });
    }
}

function openViewContract(id) {
    const env = getEnv();
    const con = env.contracts.find(c => c.id === id);
    if (!con) return;

    const contact = env.contacts.find(c => c.id === con.contactId);

    // Populate A4 Contract Print Area
    document.getElementById("cPreviewId").innerText = con.id;
    document.getElementById("cPreviewClientName").innerText = con.clientName;
    document.getElementById("cPreviewClientEmail").innerText = contact ? contact.email : "Não cadastrado";
    document.getElementById("cPreviewClientCompany").innerText = con.company;
    document.getElementById("cPreviewProductName").innerText = con.productName;
    document.getElementById("cPreviewValue").innerText = formatCurrency(con.value);
    document.getElementById("cPreviewRecurrence").innerText = con.recurrence === 'monthly' ? 'Mensal recorrente' : con.recurrence === 'yearly' ? 'Anual recorrente' : 'Taxa Única';
    document.getElementById("cPreviewStartDate").innerText = formatDate(con.startDate);
    document.getElementById("cPreviewEndDate").innerText = formatDate(con.endDate);
    document.getElementById("cPreviewSignatureClient").innerText = con.clientName;

    // Show/hide activate button based on status
    const actBtn = document.getElementById("btnActivateContract");
    if (con.status === "draft") {
        actBtn.classList.remove("hidden");
        actBtn.onclick = () => {
            con.status = "active";
            saveState();
            renderAll();
            showToast("Contrato ativado comercialmente com sucesso!", "success");
            document.getElementById("contractViewerWrapper").classList.add("hidden");
            document.getElementById("contractsListWrapper").classList.remove("hidden");
        };
    } else {
        actBtn.classList.add("hidden");
    }

    // Toggle panels
    document.getElementById("contractsListWrapper").classList.add("hidden");
    document.getElementById("contractViewerWrapper").classList.remove("hidden");
}

function deleteContract(id) {
    if (confirm("Deseja realmente remover este contrato?")) {
        const env = getEnv();
        env.contracts = env.contracts.filter(c => c.id !== id);
        saveState();
        renderAll();
    }
}

// 10. Calendar/Agenda Management
function renderCalendar() {
    const env = getEnv();
    const grid = document.getElementById("calendarGridBody");
    if (!grid) return;
    grid.innerHTML = "";

    const currDate = state.calendarDate;
    const year = currDate.getFullYear();
    const month = currDate.getMonth();

    // Set month title
    const monthsLocale = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    document.getElementById("calendarCurrentMonthText").innerText = `${monthsLocale[month]} ${year}`;

    // Get first day of the month
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const totalDaysPrev = new Date(year, month, 0).getDate();

    // Render cells of previous month (offset offset)
    for (let x = firstDayIndex; x > 0; x--) {
        const prevDay = totalDaysPrev - x + 1;
        const cell = document.createElement("div");
        cell.className = "calendar-day-cell inactive-month";
        cell.innerHTML = `<span class="calendar-day-number">${prevDay}</span>`;
        grid.appendChild(cell);
    }

    // Render current month days
    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement("div");
        cell.className = "calendar-day-cell";
        
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Check if today
        if (year === 2026 && month === 6 && day === 12) { // Default mock environment anchor date
            cell.classList.add("today");
        }

        cell.innerHTML = `
            <span class="calendar-day-number">${day}</span>
            <div class="calendar-events-container" id="events-${dateString}"></div>
        `;

        grid.appendChild(cell);

        // Single click opens day preview modal
        cell.addEventListener("click", () => {
            openDayPreview(dateString);
        });
    }

    // Populate events, tasks, and contracts into calendar cells
    // Events
    env.events.forEach(evt => {
        const container = document.getElementById(`events-${evt.date}`);
        if (container) {
            const badge = document.createElement("span");
            badge.className = "calendar-event-badge meeting";
            badge.innerText = `🤝 ${evt.time} ${evt.title.substring(0, 10)}${evt.title.length > 10 ? '...' : ''}`;
            badge.title = evt.title;
            container.appendChild(badge);
        }
    });

    // Tasks
    env.tasks.forEach(task => {
        if (task.dueDate && !task.completed) {
            const container = document.getElementById(`events-${task.dueDate}`);
            if (container) {
                const badge = document.createElement("span");
                badge.className = "calendar-event-badge task";
                badge.innerText = `📝 ${task.title.substring(0, 12)}${task.title.length > 12 ? '...' : ''}`;
                badge.title = task.title;
                container.appendChild(badge);
            }
        }
    });

    // Contracts
    env.contracts.forEach(con => {
        if (con.startDate) {
            const container = document.getElementById(`events-${con.startDate}`);
            if (container) {
                const badge = document.createElement("span");
                badge.className = "calendar-event-badge contract";
                badge.innerText = `💼 ${con.clientName.substring(0, 12)}${con.clientName.length > 12 ? '...' : ''}`;
                badge.title = con.clientName;
                container.appendChild(badge);
            }
        }
    });
}

function openDayPreview(dateString) {
    const env = getEnv();
    
    // Parse date for visual title
    const d = new Date(dateString + "T00:00:00");
    const formattedDateText = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    document.getElementById("dayPreviewDateText").innerText = formattedDateText;
    
    // Set target date for Quick Add Event from preview
    const quickAddBtn = document.getElementById("btnQuickAddEventFromPreview");
    quickAddBtn.onclick = () => {
        document.getElementById("dayPreviewModal").classList.remove("active");
        document.getElementById("eventForm").reset();
        document.getElementById("eventDate").value = dateString;
        document.getElementById("eventModal").classList.add("active");
    };

    const container = document.getElementById("dayPreviewContent");
    container.innerHTML = "";

    // Find all items on this date
    const dailyEvents = env.events.filter(e => e.date === dateString);
    const dailyTasks = env.tasks.filter(t => t.dueDate === dateString && !t.completed);
    const dailyContracts = env.contracts.filter(c => c.startDate === dateString);

    if (dailyEvents.length === 0 && dailyTasks.length === 0 && dailyContracts.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:30px 10px; color:var(--text-muted);">
                <i data-lucide="calendar" style="width:36px; height:36px; opacity:0.5; margin-bottom:8px; display:inline-block;"></i>
                <p style="font-size:12px; margin:0;">Nenhum compromisso agendado para este dia.</p>
            </div>
        `;
        safeCreateIcons();
        document.getElementById("dayPreviewModal").classList.add("active");
        return;
    }

    // Render Meetings Group
    if (dailyEvents.length > 0) {
        const group = document.createElement("div");
        group.innerHTML = `<h4 style="font-size:11px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px; border-bottom:1px solid var(--border-color); padding-bottom:4px;">🤝 Reuniões & Compromissos</h4>`;
        dailyEvents.forEach(evt => {
            const item = document.createElement("div");
            item.style = "background:var(--bg-app); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:10px; margin-bottom:6px;";
            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <strong style="font-size:12px; color:var(--text-primary);">${evt.title}</strong>
                    <span style="font-size:11px; font-weight:600; color:var(--color-teal);">${evt.time}</span>
                </div>
                <p style="font-size:11px; color:var(--text-secondary); margin:0 0 4px 0;">${evt.description || "Sem notas descritivas."}</p>
                <div style="display:flex; justify-content:flex-end; gap:6px;">
                    <button class="btn btn-secondary btn-xs btn-del-event" style="padding:2px 6px; font-size:8px; color:var(--color-danger); border-color:var(--color-danger-glow);">Excluir</button>
                </div>
            `;
            item.querySelector(".btn-del-event").onclick = () => {
                if (confirm("Remover este compromisso da agenda?")) {
                    env.events = env.events.filter(e => e.id !== evt.id);
                    saveState();
                    renderAll();
                    openDayPreview(dateString); // reload preview
                }
            };
            group.appendChild(item);
        });
        container.appendChild(group);
    }

    // Render Tasks Group
    if (dailyTasks.length > 0) {
        const group = document.createElement("div");
        group.innerHTML = `<h4 style="font-size:11px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px; border-bottom:1px solid var(--border-color); padding-bottom:4px;">📝 Tarefas Comerciais</h4>`;
        dailyTasks.forEach(task => {
            const item = document.createElement("div");
            item.style = "background:var(--bg-app); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:10px; margin-bottom:6px;";
            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <strong style="font-size:12px; color:var(--text-primary);">${task.title}</strong>
                    <span class="task-priority-badge ${task.priority}" style="font-size:8px; padding:1px 4px; border-radius:2px;">${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}</span>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:6px; margin-top:6px;">
                    <button class="btn btn-primary btn-xs btn-check-task" style="padding:2px 6px; font-size:8px;">Concluir</button>
                </div>
            `;
            item.querySelector(".btn-check-task").onclick = () => {
                task.completed = true;
                saveState();
                renderAll();
                openDayPreview(dateString); // reload preview
            };
            group.appendChild(item);
        });
        container.appendChild(group);
    }

    // Render Contracts Group
    if (dailyContracts.length > 0) {
        const group = document.createElement("div");
        group.innerHTML = `<h4 style="font-size:11px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px; border-bottom:1px solid var(--border-color); padding-bottom:4px;">💼 Início de Contratos</h4>`;
        dailyContracts.forEach(con => {
            const item = document.createElement("div");
            item.style = "background:var(--bg-app); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:10px; margin-bottom:6px;";
            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <strong style="font-size:12px; color:var(--text-primary);">${con.clientName} (${con.company})</strong>
                    <span style="font-size:10px; font-weight:600; color:var(--color-success);">${formatCurrency(con.value)}</span>
                </div>
                <p style="font-size:11px; color:var(--text-secondary); margin:0 0 4px 0;">Serviço: ${con.productName} (${con.recurrence === 'monthly' ? 'Mensal' : 'Único'})</p>
                <div style="display:flex; justify-content:flex-end; gap:6px;">
                    <button class="btn btn-secondary btn-xs btn-view-con" style="padding:2px 6px; font-size:8px;">Ver Contrato</button>
                </div>
            `;
            item.querySelector(".btn-view-con").onclick = () => {
                document.getElementById("dayPreviewModal").classList.remove("active");
                document.querySelector('[data-view="contracts"]').click();
                openViewContract(con.id);
            };
            group.appendChild(item);
        });
        container.appendChild(group);
    }

    document.getElementById("dayPreviewModal").classList.add("active");
    safeCreateIcons();
}

// 11. Finance View Control
function renderFinance() {
    const env = getEnv();
    
    // Sub-tab toggling
    const selectSubTab = (activeId, activePanelId) => {
        const tabs = ["tabInvoices", "tabExpenses", "tabFiscalNotes"];
        const panels = ["panelInvoices", "panelExpenses", "panelFiscalNotes"];
        
        tabs.forEach(tabId => {
            const el = document.getElementById(tabId);
            if (el) {
                if (tabId === activeId) el.classList.add("active");
                else el.classList.remove("active");
            }
        });
        
        panels.forEach(panelId => {
            const el = document.getElementById(panelId);
            if (el) {
                if (panelId === activePanelId) el.classList.remove("hidden");
                else el.classList.add("hidden");
            }
        });
    };

    document.getElementById("tabInvoices").onclick = () => selectSubTab("tabInvoices", "panelInvoices");
    document.getElementById("tabExpenses").onclick = () => selectSubTab("tabExpenses", "panelExpenses");
    
    const tabFN = document.getElementById("tabFiscalNotes");
    if (tabFN) {
        tabFN.onclick = () => selectSubTab("tabFiscalNotes", "panelFiscalNotes");
    }

    // Calculate Profitability Metrics
    const totalRevenue = env.invoices.reduce((sum, inv) => sum + inv.value, 0);
    const totalExpenses = env.expenses.reduce((sum, exp) => sum + exp.value, 0);
    const netProfit = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

    // Update DOM KPIs
    document.getElementById("finKpiTotalRevenue").innerText = formatCurrency(totalRevenue);
    document.getElementById("finKpiTotalExpenses").innerText = formatCurrency(totalExpenses);
    document.getElementById("finKpiNetProfit").innerText = formatCurrency(netProfit);
    document.getElementById("finKpiMargin").innerText = `${margin}%`;

    const marginBadge = document.getElementById("finKpiMarginBadge");
    if (margin >= 50) {
        marginBadge.innerText = "Excelente";
        marginBadge.className = "kpi-badge positive";
    } else if (margin >= 20) {
        marginBadge.innerText = "Saudável";
        marginBadge.className = "kpi-badge positive";
    } else {
        marginBadge.innerText = "Atenção Margem";
        marginBadge.className = "kpi-badge warning";
    }

    // Render Invoices Table
    const invoicesTbody = document.getElementById("invoicesTableBody");
    invoicesTbody.innerHTML = "";
    env.invoices.forEach(inv => {
        const tr = document.createElement("tr");
        
        let statusText = "Pendente";
        let statusBadge = "warning";
        if (inv.status === "paid") { statusText = "Recebido"; statusBadge = "active"; }
        else if (inv.status === "overdue") { statusText = "Atrasada"; statusBadge = "inactive"; }

        tr.innerHTML = `
            <td><strong>${inv.id}</strong></td>
            <td>${inv.customerName}<br><small style="color:var(--text-muted)">${inv.company}</small></td>
            <td><span style="font-size:11px; background:var(--bg-app); padding:2px 6px; border-radius:4px;">${inv.niche}</span></td>
            <td>${formatDate(inv.dueDate)}</td>
            <td><strong>${formatCurrency(inv.value)}</strong></td>
            <td><span class="badge-status ${statusBadge}">${statusText}</span></td>
            <td>
                <div class="kanban-card-actions">
                    ${inv.status !== 'paid' ? `<button class="btn-icon-only btn-pay-invoice" title="Confirmar Recebimento"><i data-lucide="check" style="width:14px;height:14px;"></i></button>` : ''}
                    <button class="btn-icon-only btn-delete-invoice" title="Remover"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                </div>
            </td>
        `;

        if (inv.status !== 'paid') {
            tr.querySelector(".btn-pay-invoice").onclick = () => {
                inv.status = "paid";
                saveState();
                renderAll();
                showToast("Fatura liquidada com sucesso!", "success");
            };
        }
        tr.querySelector(".btn-delete-invoice").onclick = () => {
            if (confirm("Remover esta fatura?")) {
                env.invoices = env.invoices.filter(i => i.id !== inv.id);
                saveState();
                renderAll();
            }
        };

        invoicesTbody.appendChild(tr);
    });

    // Render Expenses Table
    const expensesTbody = document.getElementById("expensesTableBody");
    expensesTbody.innerHTML = "";
    env.expenses.forEach(exp => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${exp.description}</strong></td>
            <td><span class="badge-recurrence single">${exp.category}</span></td>
            <td>${formatDate(exp.date)}</td>
            <td style="color:var(--color-danger);"><strong>- ${formatCurrency(exp.value)}</strong></td>
            <td>
                <button class="btn-icon-only btn-delete-expense" title="Remover"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
            </td>
        `;

        tr.querySelector(".btn-delete-expense").onclick = () => {
            if (confirm("Deseja realmente excluir este custo operacional?")) {
                env.expenses = env.expenses.filter(e => e.id !== exp.id);
                saveState();
                renderAll();
            }
        };

        expensesTbody.appendChild(tr);
    });

    renderFiscalNotes();
    renderFinanceCharts(env);
}

function renderFinanceCharts(env) {
    if (cashFlowChart) cashFlowChart.destroy();
    if (revenueByNicheChart) revenueByNicheChart.destroy();

    const isDark = document.body.classList.contains('dark-theme');
    const chartLabelColor = isDark ? '#9ca3af' : '#4b5563';
    const gridColor = isDark ? '#2a2a40' : '#e5e7eb';

    // 1. Recurrent vs Pontual calculations
    // Lookup product in catalog to check if monthly
    const recurrentRevenue = env.invoices
        .filter(inv => {
            const prod = defaultProducts.find(p => p.name === inv.productName);
            return prod ? prod.type === "monthly" : false;
        })
        .reduce((sum, inv) => sum + inv.value, 0);

    const singleRevenue = env.invoices
        .filter(inv => {
            const prod = defaultProducts.find(p => p.name === inv.productName);
            return prod ? prod.type !== "monthly" : true; // Fallback to single if not found
        })
        .reduce((sum, inv) => sum + inv.value, 0);

    const ctxCash = document.getElementById("cashFlowChart").getContext("2d");
    cashFlowChart = new Chart(ctxCash, {
        type: 'bar',
        data: {
            labels: ['Recorrente (SaaS/Avença)', 'Pontual (Taxas/Projetos)'],
            datasets: [{
                data: [recurrentRevenue, singleRevenue],
                backgroundColor: ['rgba(13, 148, 136, 0.75)', 'rgba(0, 140, 255, 0.75)'],
                borderColor: ['#0d9488', '#008cff'],
                borderWidth: 1.5,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: chartLabelColor } },
                y: { grid: { color: gridColor }, ticks: { color: chartLabelColor, callback: (v) => formatCurrency(v) } }
            }
        }
    });

    // 2. Revenue by Niche calculations
    const niches = ["Negócio Local", "E-commerce", "Infoproduto / Lançamentos", "SaaS / Startup", "Serviços B2B", "Turismo", "Outro"];
    const nicheSums = niches.map(n => {
        return env.invoices
            .filter(inv => inv.niche === n)
            .reduce((sum, inv) => sum + inv.value, 0);
    });

    const ctxNiche = document.getElementById("revenueByNicheChart").getContext("2d");
    revenueByNicheChart = new Chart(ctxNiche, {
        type: 'doughnut',
        data: {
            labels: niches,
            datasets: [{
                data: nicheSums,
                backgroundColor: [
                    'rgba(0, 140, 255, 0.75)',
                    'rgba(13, 148, 136, 0.75)',
                    'rgba(245, 158, 11, 0.75)',
                    'rgba(154, 52, 18, 0.75)',
                    'rgba(107, 114, 128, 0.75)',
                    'rgba(71, 85, 105, 0.75)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: chartLabelColor, font: { size: 9 } }
                }
            }
        }
    });
}

// 12. Marketing Assets & Channels Management
let activeMarketingFilter = "all";

function renderMarketingAssets() {
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

            let iconHtml = `<i data-lucide="${iconName}" style="width: 14px; height: 14px;"></i>`;
            if (iconName === "instagram") {
                iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram" style="width: 14px; height: 14px; stroke-width: 2.2px;"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`;
            }

            card.innerHTML = `
                <div class="marketing-card-header">
                    <div class="marketing-card-icon-title">
                        <div class="marketing-card-icon-wrapper ${categoryClass}">
                            ${iconHtml}
                        </div>
                        <div style="display:flex; flex-direction:column;">
                            <span class="marketing-card-title">${asset.title}</span>
                            <span style="font-size:9px; color:var(--text-muted);">${categoryName}</span>
                        </div>
                    </div>
                    <span class="badge-status ${statusClass}" style="padding: 2px 6px; font-size: 8px;">${statusText}</span>
                </div>
                <div class="marketing-card-body">
                    ${asset.url ? `<a href="${asset.url}" target="_blank" class="marketing-card-link"><i data-lucide="external-link" style="width:10px; height:10px;"></i> ${asset.url.replace(/^https?:\/\//, '')}</a>` : '<span style="color:var(--text-muted); font-style:italic;">Sem link cadastrado</span>'}
                    
                    <div class="marketing-card-metrics" style="margin-top:4px;">
                        <span style="font-size:9px; color:var(--text-muted); display:block; margin-bottom:2px;">Métricas de Desempenho</span>
                        <span style="font-size:11px;">${asset.metrics || "Sem métricas registradas"}</span>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                        <span class="marketing-card-cost">Custo: <strong>${asset.cost || "Grátis"}</strong></span>
                    </div>

                    ${asset.notes ? `<p class="marketing-card-notes">${asset.notes}</p>` : ""}
                </div>
                <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid var(--border-color); padding-top:10px; margin-top:4px;">
                    <button class="btn btn-secondary btn-xs btn-edit-asset" style="padding: 2px 6px; font-size: 9px;"><i data-lucide="edit-2" style="width:10px; height:10px; margin-right:2px;"></i> Editar</button>
                    <button class="btn btn-secondary btn-xs btn-delete-asset" style="padding: 2px 6px; font-size: 9px; color:var(--color-danger); border-color:var(--color-danger-glow);"><i data-lucide="trash-2" style="width:10px; height:10px; margin-right:2px;"></i> Excluir</button>
                </div>
            `;

            card.querySelector(".btn-edit-asset").onclick = () => openEditMarketingAsset(asset.id);
            card.querySelector(".btn-delete-asset").onclick = () => deleteMarketingAsset(asset.id);

            grid.appendChild(card);
        });
    }
    safeCreateIcons();
}

function openEditMarketingAsset(id) {
    const env = getEnv();
    const asset = env.marketingAssets.find(x => x.id === id);
    if (!asset) return;

    document.getElementById("marketingAssetId").value = asset.id;
    document.getElementById("marketingAssetTitle").value = asset.title;
    document.getElementById("marketingAssetCategory").value = asset.category;
    document.getElementById("marketingAssetStatus").value = asset.status;
    document.getElementById("marketingAssetUrl").value = asset.url || "";
    document.getElementById("marketingAssetMetrics").value = asset.metrics || "";
    document.getElementById("marketingAssetCost").value = asset.cost || "";
    document.getElementById("marketingAssetNotes").value = asset.notes || "";

    document.getElementById("marketingAssetModalTitle").innerText = "Editar Ativo de Marketing";
    document.getElementById("marketingAssetModal").classList.add("active");
}

function deleteMarketingAsset(id) {
    if (confirm("Deseja realmente remover este ativo de marketing?")) {
        const env = getEnv();
        env.marketingAssets = env.marketingAssets.filter(x => x.id !== id);
        saveState();
        renderAll();
    }
}

// Boot Setup
window.addEventListener("DOMContentLoaded", () => {
    init();
    
    // Bind buttons early in case of active session reload
    if (sessionStorage.getItem("nexus_crm_logged_in") === "true") {
        setupOpenImportButton();
    }
    
    // Bind proposals actions
    document.getElementById("btnCreateProposal").addEventListener("click", openCreateProposal);
    document.getElementById("btnBackToProposalsList").addEventListener("click", () => {
        document.getElementById("proposalBuilderWrapper").classList.add("hidden");
        document.getElementById("proposalsListWrapper").classList.remove("hidden");
    });
    document.getElementById("btnPrintProposal").addEventListener("click", () => {
        window.print();
    });
    document.getElementById("btnSaveProposal").addEventListener("click", saveProposal);
    
    // Form change listeners to feed live preview
    document.getElementById("proposalContactSelect").addEventListener("change", updateProposalPreview);
    document.getElementById("proposalProductSelect").addEventListener("change", (e) => {
        const env = getEnv();
        const prod = env.products.find(p => p.id === e.target.value);
        if (prod) {
            document.getElementById("proposalFinalValue").value = prod.price;
            document.getElementById("proposalRecurrence").value = prod.type;
        }
        updateProposalPreview();
    });
    document.getElementById("proposalFinalValue").addEventListener("input", updateProposalPreview);
    document.getElementById("proposalRecurrence").addEventListener("change", updateProposalPreview);

    // Bind Contracts Actions
    document.getElementById("btnBackToContractsList").onclick = () => {
        document.getElementById("contractViewerWrapper").classList.add("hidden");
        document.getElementById("contractsListWrapper").classList.remove("hidden");
    };
    document.getElementById("btnPrintContract").onclick = () => {
        window.print();
    };

    // Bind Calendar Navigation
    document.getElementById("btnPrevMonth").onclick = () => {
        const d = state.calendarDate;
        state.calendarDate = new Date(d.getFullYear(), d.getMonth() - 1, 1);
        renderCalendar();
    };
    document.getElementById("btnNextMonth").onclick = () => {
        const d = state.calendarDate;
        state.calendarDate = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        renderCalendar();
    };

    // Calendar Modal trigger & Save
    document.getElementById("btnCreateEvent").onclick = () => {
        document.getElementById("eventForm").reset();
        document.getElementById("eventDate").value = new Date().toISOString().split("T")[0];
        document.getElementById("eventModal").classList.add("active");
    };
    document.getElementById("btnCloseEventModal").onclick = () => {
        document.getElementById("eventModal").classList.remove("active");
    };
    document.getElementById("btnCancelEventModal").onclick = () => {
        document.getElementById("eventModal").classList.remove("active");
    };

    document.getElementById("eventForm").onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        const title = document.getElementById("eventTitle").value;
        const contactId = document.getElementById("eventContact").value;
        const date = document.getElementById("eventDate").value;
        const time = document.getElementById("eventTime").value;
        const description = document.getElementById("eventDescription").value;

        const newEvt = {
            id: "evt_" + Date.now(),
            title,
            contactId,
            date,
            time,
            description
        };
        env.events.push(newEvt);
        saveState();
        renderAll();
        document.getElementById("eventModal").classList.remove("active");
    };

    // Finance Modals Triggers
    document.getElementById("btnCreateInvoice").onclick = () => {
        document.getElementById("invoiceForm").reset();
        document.getElementById("invoiceDueDate").value = new Date().toISOString().split("T")[0];
        document.getElementById("invoiceModal").classList.add("active");
    };
    document.getElementById("btnCloseInvoiceModal").onclick = () => {
        document.getElementById("invoiceModal").classList.remove("active");
    };
    document.getElementById("btnCancelInvoiceModal").onclick = () => {
        document.getElementById("invoiceModal").classList.remove("active");
    };

    document.getElementById("invoiceForm").onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        const customerName = document.getElementById("invoiceCustomer").value;
        const company = document.getElementById("invoiceCompany").value || "-";
        const niche = document.getElementById("invoiceNiche").value;
        const productName = document.getElementById("invoiceProduct").value;
        const value = parseFloat(document.getElementById("invoiceValue").value) || 0;
        const dueDate = document.getElementById("invoiceDueDate").value;

        const newInv = {
            id: "FAT-" + Date.now().toString().substring(8),
            customerName,
            company,
            niche,
            productName,
            value,
            dueDate,
            status: "pending"
        };
        env.invoices.push(newInv);
        saveState();
        renderAll();
        document.getElementById("invoiceModal").classList.remove("active");
    };

    const btnCreateFiscalNote = document.getElementById("btnCreateFiscalNote");
    if (btnCreateFiscalNote) {
        btnCreateFiscalNote.onclick = () => {
            openAddFiscalNote();
        };
    }
    const btnCloseFiscalNoteModal = document.getElementById("btnCloseFiscalNoteModal");
    if (btnCloseFiscalNoteModal) {
        btnCloseFiscalNoteModal.onclick = () => {
            document.getElementById("fiscalNoteModal").classList.remove("active");
        };
    }
    const btnCancelFiscalNoteModal = document.getElementById("btnCancelFiscalNoteModal");
    if (btnCancelFiscalNoteModal) {
        btnCancelFiscalNoteModal.onclick = () => {
            document.getElementById("fiscalNoteModal").classList.remove("active");
        };
    }

    const fiscalNoteForm = document.getElementById("fiscalNoteForm");
    if (fiscalNoteForm) {
        fiscalNoteForm.onsubmit = (e) => {
            e.preventDefault();
            const env = getEnv();
            const id = document.getElementById("fiscalNoteId").value;
            const number = document.getElementById("fiscalNoteNumber").value;
            const issueDate = document.getElementById("fiscalNoteIssueDate").value;
            const clientName = document.getElementById("fiscalNoteClient").value;
            const productName = document.getElementById("fiscalNoteProduct").value;
            const value = parseFloat(document.getElementById("fiscalNoteValue").value) || 0;
            const generateReceipt = document.getElementById("fiscalNoteGenerateReceipt")?.checked;
            
            let receiptId = null;
            
            if (id) {
                const nf = env.fiscalNotes.find(x => x.id === id);
                if (nf) {
                    nf.number = number;
                    nf.issueDate = issueDate;
                    nf.clientName = clientName;
                    nf.productName = productName;
                    nf.value = value;
                }
            } else {
                if (generateReceipt) {
                    const newInvoice = {
                        id: "FAT-" + Date.now().toString().substring(8),
                        customerName: clientName,
                        company: "-",
                        niche: "Outro",
                        productName: productName + ` (Ref: NF ${number})`,
                        value: value,
                        dueDate: issueDate,
                        status: "paid"
                    };
                    env.invoices.push(newInvoice);
                    receiptId = newInvoice.id;
                }
                
                const newNf = {
                    id: "nf_" + Date.now(),
                    number,
                    clientName,
                    productName,
                    value,
                    issueDate,
                    receiptId
                };
                env.fiscalNotes.push(newNf);
            }
            
            saveState();
            renderAll();
            document.getElementById("fiscalNoteModal").classList.remove("active");
        };
    }

    document.getElementById("btnCreateExpense").onclick = () => {
        document.getElementById("expenseForm").reset();
        document.getElementById("expenseDate").value = new Date().toISOString().split("T")[0];
        document.getElementById("expenseModal").classList.add("active");
    };
    document.getElementById("btnCloseExpenseModal").onclick = () => {
        document.getElementById("expenseModal").classList.remove("active");
    };
    document.getElementById("btnCancelExpenseModal").onclick = () => {
        document.getElementById("expenseModal").classList.remove("active");
    };

    document.getElementById("expenseForm").onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        const description = document.getElementById("expenseDescription").value;
        const category = document.getElementById("expenseCategory").value;
        const value = parseFloat(document.getElementById("expenseValue").value) || 0;
        const date = document.getElementById("expenseDate").value;

        const newExp = {
            id: "exp_" + Date.now(),
            description,
            category,
            value,
            date
        };
        env.expenses.push(newExp);
        saveState();
        renderAll();
        document.getElementById("expenseModal").classList.remove("active");
    };

    // Marketing Assets Modals Binds
    document.getElementById("btnCreateMarketingAsset").onclick = () => {
        document.getElementById("marketingAssetForm").reset();
        document.getElementById("marketingAssetId").value = "";
        document.getElementById("marketingAssetModalTitle").innerText = "Adicionar Ativo de Marketing";
        document.getElementById("marketingAssetModal").classList.add("active");
    };
    document.getElementById("btnCloseMarketingAssetModal").onclick = () => {
        document.getElementById("marketingAssetModal").classList.remove("active");
    };
    document.getElementById("btnCancelMarketingAssetModal").onclick = () => {
        document.getElementById("marketingAssetModal").classList.remove("active");
    };

    document.getElementById("marketingAssetForm").onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        const id = document.getElementById("marketingAssetId").value;
        const title = document.getElementById("marketingAssetTitle").value;
        const category = document.getElementById("marketingAssetCategory").value;
        const status = document.getElementById("marketingAssetStatus").value;
        const url = document.getElementById("marketingAssetUrl").value;
        const metrics = document.getElementById("marketingAssetMetrics").value;
        const cost = document.getElementById("marketingAssetCost").value;
        const notes = document.getElementById("marketingAssetNotes").value;

        if (id) {
            const asset = env.marketingAssets.find(x => x.id === id);
            if (asset) {
                asset.title = title;
                asset.category = category;
                asset.status = status;
                asset.url = url;
                asset.metrics = metrics;
                asset.cost = cost;
                asset.notes = notes;
            }
        } else {
            const newAsset = {
                id: "ma_" + Date.now(),
                title,
                category,
                status,
                url,
                metrics,
                cost,
                notes
            };
            env.marketingAssets.push(newAsset);
        }

        saveState();
        renderAll();
        document.getElementById("marketingAssetModal").classList.remove("active");
    };

    // Category Filter Navigation Binds
    document.querySelectorAll("#marketingFilters li").forEach(tab => {
        tab.onclick = () => {
            activeMarketingFilter = tab.getAttribute("data-marketing-filter");
            renderMarketingAssets();
        };
    });

    // Calendar Day Preview Modal Binds
    document.getElementById("btnCloseDayPreviewModal").onclick = () => {
        document.getElementById("dayPreviewModal").classList.remove("active");
    };
    document.getElementById("btnCloseDayPreviewOk").onclick = () => {
        document.getElementById("dayPreviewModal").classList.remove("active");
    };

    // Pipeline Funnel Filter Binds
    const kfn = document.getElementById("kanbanFilterNiche");
    if (kfn) kfn.onchange = renderKanban;
    const kfp = document.getElementById("kanbanFilterPeriod");
    if (kfp) kfp.onchange = renderKanban;

    // View Mode Switchers
    const btnKanban = document.getElementById("btnPipelineModeKanban");
    if (btnKanban) {
        btnKanban.onclick = () => {
            state.pipelineViewMode = "kanban";
            renderKanban();
        };
    }
    const btnFunnel = document.getElementById("btnPipelineModeFunnel");
    if (btnFunnel) {
        btnFunnel.onclick = () => {
            state.pipelineViewMode = "funnel";
            renderKanban();
        };
    }

    // Funnel Stage Clicks
    const stgTop = document.getElementById("funnelStageTop");
    if (stgTop) {
        stgTop.onclick = () => {
            state.activeFunnelSegment = "top";
            renderKanban();
        };
    }
    const stgMid = document.getElementById("funnelStageMid");
    if (stgMid) {
        stgMid.onclick = () => {
            state.activeFunnelSegment = "mid";
            renderKanban();
        };
    }
    const stgBottom = document.getElementById("funnelStageBottom");
    if (stgBottom) {
        stgBottom.onclick = () => {
            state.activeFunnelSegment = "bottom";
            renderKanban();
        };
    }

    // Backup actions logic
    const btnExportBackup = document.getElementById("btnExportBackup");
    if (btnExportBackup) {
        btnExportBackup.onclick = () => {
            const dataStr = localStorage.getItem("nexus_crm_multitenant_state") || JSON.stringify(state);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = 'crm_backup_' + new Date().toISOString().split('T')[0] + '.json';
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        };
    }

    const btnImportBackup = document.getElementById("btnImportBackup");
    const backupFileInput = document.getElementById("backupFileInput");
    if (btnImportBackup && backupFileInput) {
        btnImportBackup.onclick = () => {
            backupFileInput.click();
        };
        backupFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const parsed = JSON.parse(evt.target.result);
                    if (parsed.environments || parsed.currentEnv) {
                        localStorage.setItem("nexus_crm_multitenant_state", evt.target.result);
                        showToast("Backup importado com sucesso! A página será recarregada.", "success");
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        showToast("Arquivo de backup inválido.", "error");
                    }
                } catch (err) {
                    showToast("Erro ao ler o arquivo de backup.", "error");
                }
            };
            reader.readAsText(file);
        };
    }
    
    // Import History triggers
    const btnOpenImportHistory = document.getElementById("btnOpenImportHistory");
    if (btnOpenImportHistory) {
        btnOpenImportHistory.addEventListener("click", () => {
            renderImportHistory();
            document.getElementById("importHistoryModal").classList.add("active");
        });
    }
    const btnCloseImportHistoryModal = document.getElementById("btnCloseImportHistoryModal");
    if (btnCloseImportHistoryModal) {
        btnCloseImportHistoryModal.addEventListener("click", () => {
            document.getElementById("importHistoryModal").classList.remove("active");
        });
    }
    const btnCancelImportHistoryModal = document.getElementById("btnCancelImportHistoryModal");
    if (btnCancelImportHistoryModal) {
        btnCancelImportHistoryModal.addEventListener("click", () => {
            document.getElementById("importHistoryModal").classList.remove("active");
        });
    }
    
    // Bind Customers actions (Manual Create, Edit, and Services Modal)
    const btnCreateCustomer = document.getElementById("btnCreateCustomer");
    if (btnCreateCustomer) {
        btnCreateCustomer.addEventListener("click", () => {
            openAddCustomer();
        });
    }
    const btnCloseCustomerModal = document.getElementById("btnCloseCustomerModal");
    if (btnCloseCustomerModal) {
        btnCloseCustomerModal.addEventListener("click", () => {
            document.getElementById("customerModal").classList.remove("active");
        });
    }
    const btnCancelCustomerModal = document.getElementById("btnCancelCustomerModal");
    if (btnCancelCustomerModal) {
        btnCancelCustomerModal.addEventListener("click", () => {
            document.getElementById("customerModal").classList.remove("active");
        });
    }

    const btnCloseServicesModal = document.getElementById("btnCloseServicesModal");
    if (btnCloseServicesModal) {
        btnCloseServicesModal.addEventListener("click", () => {
            document.getElementById("clientServicesModal").classList.remove("active");
        });
    }
    const btnCancelServicesModal = document.getElementById("btnCancelServicesModal");
    if (btnCancelServicesModal) {
        btnCancelServicesModal.addEventListener("click", () => {
            document.getElementById("clientServicesModal").classList.remove("active");
        });
    }
    const btnAddServiceFromDetails = document.getElementById("btnAddServiceFromDetails");
    if (btnAddServiceFromDetails) {
        btnAddServiceFromDetails.addEventListener("click", () => {
            document.getElementById("clientServicesModal").classList.remove("active");
            const env = getEnv();
            const services = env.customers.filter(c => String(c.company || c.name || "").trim() === currentDetailsClientKey);
            if (services.length > 0) {
                openAddCustomer({
                    contactId: services[0].contactId,
                    name: services[0].name,
                    company: services[0].company,
                    niche: services[0].niche
                });
            } else {
                openAddCustomer();
            }
        });
    }

    const customerProductSelect = document.getElementById("customerProduct");
    if (customerProductSelect) {
        customerProductSelect.addEventListener("change", (e) => {
            const productId = e.target.value;
            if (productId === "custom") {
                document.getElementById("customerPrice").value = "";
                document.getElementById("customerBillingType").value = "single";
            } else {
                const env = getEnv();
                const prod = env.products.find(p => p.id === productId);
                if (prod) {
                    document.getElementById("customerPrice").value = prod.price;
                    document.getElementById("customerBillingType").value = prod.type;
                }
            }
        });
    }

    const contactsTrigger = document.getElementById("customerContactsTrigger");
    const contactsDropdown = document.getElementById("customerContactsDropdown");
    if (contactsTrigger && contactsDropdown) {
        contactsTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            contactsDropdown.classList.toggle("hidden");
        });
        document.addEventListener("click", () => {
            contactsDropdown.classList.add("hidden");
        });
    }

    // Calendar Notifications triggers
    const btnNotifications = document.getElementById("btnNotifications");
    if (btnNotifications) {
        btnNotifications.addEventListener("click", () => {
            updateCalendarNotifications();
            document.getElementById("notificationsModal").classList.add("active");
        });
    }
    const btnCloseNotificationsModal = document.getElementById("btnCloseNotificationsModal");
    if (btnCloseNotificationsModal) {
        btnCloseNotificationsModal.addEventListener("click", () => {
            document.getElementById("notificationsModal").classList.remove("active");
        });
    }
    const btnCancelNotificationsModal = document.getElementById("btnCancelNotificationsModal");
    if (btnCancelNotificationsModal) {
        btnCancelNotificationsModal.addEventListener("click", () => {
            document.getElementById("notificationsModal").classList.remove("active");
        });
    }

    const customerFormElement = document.getElementById("customerForm");
    if (customerFormElement) {
        customerFormElement.addEventListener("submit", (e) => {
            e.preventDefault();
            const env = getEnv();
            const id = document.getElementById("customerId").value;
            
            // Get selected contact IDs from multiselect checkboxes
            const dropdown = document.getElementById("customerContactsDropdown");
            const contactIds = dropdown ? Array.from(dropdown.querySelectorAll("input[type='checkbox']:checked")).map(chk => chk.value) : [];
            const contactId = contactIds.length > 0 ? contactIds[0] : null;

            const name = document.getElementById("customerName").value;
            const company = document.getElementById("customerCompany").value;
            const niche = document.getElementById("customerNiche").value;
            const productId = document.getElementById("customerProduct").value;
            const price = parseFloat(document.getElementById("customerPrice").value) || 0;
            const billingType = document.getElementById("customerBillingType").value;
            
            const startDate = document.getElementById("customerStartDate")?.value || "";
            const endDate = document.getElementById("customerEndDate")?.value || "";
            const lastServiceDate = document.getElementById("customerLastServiceDate")?.value || "";
            const documentUrl = document.getElementById("customerDocumentUrl")?.value || "";

            const status = document.getElementById("customerStatus").value;

            let productName = "Serviço Customizado";
            if (productId !== "custom") {
                const prod = env.products.find(p => p.id === productId);
                if (prod) {
                    productName = prod.name;
                }
            }

            if (id) {
                const cust = env.customers.find(c => c.id === id);
                if (cust) {
                    cust.contactIds = contactIds;
                    cust.contactId = contactId || null;
                    cust.name = name;
                    cust.company = company;
                    cust.niche = niche;
                    cust.productName = productName;
                    cust.value = price;
                    cust.type = billingType;
                    cust.status = status;
                    cust.startDate = startDate;
                    cust.endDate = endDate;
                    cust.lastServiceDate = lastServiceDate;
                    cust.documentUrl = documentUrl;
                }
            } else {
                const newCust = {
                    id: "cust_" + Date.now(),
                    contactIds: contactIds,
                    contactId: contactId || null,
                    name: name,
                    company: company,
                    niche: niche,
                    productName: productName,
                    value: price,
                    type: billingType,
                    status: status,
                    startDate: startDate,
                    endDate: endDate,
                    lastServiceDate: lastServiceDate,
                    documentUrl: documentUrl,
                    createdAt: new Date().toISOString()
                };
                env.customers.push(newCust);

                // Auto-generate invoice
                const newInvoice = {
                    id: "FAT-" + Date.now().toString().substring(8),
                    customerName: name,
                    company: company || "-",
                    niche: niche,
                    productName: productName,
                    value: price,
                    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    status: "pending"
                };
                env.invoices.push(newInvoice);

                // Auto-generate contract draft
                const newCon = {
                    id: "CONTR-" + Date.now().toString().substring(8),
                    contactId: contactId || null,
                    proposalId: "DIRECT-CONV-" + Date.now().toString().substring(8),
                    clientName: name,
                    company: company || "Pessoa Física",
                    productName: productName,
                    value: price,
                    recurrence: billingType,
                    startDate: startDate || new Date().toISOString().split("T")[0],
                    endDate: endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    status: "draft"
                };
                env.contracts.push(newCon);

                // Mark all linked contacts as won
                contactIds.forEach(cid => {
                    const contact = env.contacts.find(c => c.id === cid);
                    if (contact) {
                        contact.status = "won";
                        contact.company = company;
                        contact.niche = niche;
                        contact.value = price;
                        contact.timeline.push({
                            id: "act_" + Date.now(),
                            type: "note",
                            description: `Cadastrado como cliente direto para o serviço: ${productName} (${formatCurrency(price)})`,
                            timestamp: new Date().toISOString()
                        });
                    }
                });
            }

            saveState();
            document.getElementById("customerModal").classList.remove("active");
            renderAll();
        });
    }
});

function updateCalendarNotifications() {
    const env = getEnv();
    const badge = document.getElementById("notificationBadge");
    const list = document.getElementById("notificationsList");
    if (!badge || !list) return;
    
    const todayStr = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    
    // Sort all events chronologically
    const allEvents = [...(env.events || [])].sort((a,b) => a.date.localeCompare(b.date));
    
    // Filter events starting from today
    const upcomingEvents = allEvents.filter(evt => evt.date >= todayStr);
    
    // Count of today's events
    const todayEventsCount = allEvents.filter(evt => evt.date === todayStr).length;
    
    if (todayEventsCount > 0) {
        badge.innerText = todayEventsCount;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
    
    list.innerHTML = "";
    if (upcomingEvents.length === 0) {
        list.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px 0; font-size: 13px;">Nenhum compromisso agendado a partir de hoje.</div>`;
        return;
    }
    
    upcomingEvents.forEach(evt => {
        const item = document.createElement("div");
        item.style.padding = "10px 12px";
        item.style.background = "var(--bg-app)";
        item.style.border = "1px solid var(--border-color)";
        item.style.borderRadius = "var(--radius-sm)";
        item.style.display = "flex";
        item.style.flexDirection = "column";
        item.style.gap = "4px";
        
        let dayLabel = formatDateBr(evt.date);
        let dayBadgeColor = "var(--color-primary)";
        let dayBadgeBg = "var(--color-primary-glow)";
        
        if (evt.date === todayStr) {
            dayLabel = "Hoje";
            dayBadgeColor = "var(--color-danger)";
            dayBadgeBg = "rgba(239, 68, 68, 0.1)";
        } else if (evt.date === tomorrowStr) {
            dayLabel = "Amanhã";
            dayBadgeColor = "var(--color-warning)";
            dayBadgeBg = "rgba(245, 158, 11, 0.1)";
        }
        
        const contactName = evt.contactId ? (env.contacts.find(c => c.id === evt.contactId)?.name || "") : "";
        
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; font-size: 13px; color: var(--text-primary);">${evt.title}</span>
                <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; color: ${dayBadgeColor}; background: ${dayBadgeBg};">${dayLabel} às ${evt.time || "00:00"}</span>
            </div>
            ${contactName ? `<div style="font-size: 11px; color: var(--text-secondary);">Contato: <strong>${contactName}</strong></div>` : ''}
            ${evt.description ? `<div style="font-size: 11px; color: var(--text-muted); font-style: italic; margin-top: 2px;">${evt.description}</div>` : ''}
        `;
        list.appendChild(item);
    });
}

function renderFiscalNotes() {
    const env = getEnv();
    const tbody = document.getElementById("fiscalNotesTableBody");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    if (!env.fiscalNotes || env.fiscalNotes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhuma nota fiscal lançada.</td></tr>`;
        return;
    }
    
    const sorted = [...env.fiscalNotes].sort((a,b) => b.issueDate.localeCompare(a.issueDate));
    
    sorted.forEach(nf => {
        const tr = document.createElement("tr");
        
        let receiptHtml = "";
        if (nf.receiptId) {
            receiptHtml = `<span class="badge-status active" style="background: rgba(16, 185, 129, 0.1); color: var(--color-success); font-size: 10px; padding: 2px 6px; border-radius: 4px;">🟢 Lançado (Pago)</span>`;
        } else {
            receiptHtml = `<button class="btn btn-secondary btn-xs btn-generate-receipt-from-note" data-id="${nf.id}" style="font-size: 10px; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;"><i data-lucide="plus-circle" style="width:10px;height:10px;"></i> Gerar Recebimento</button>`;
        }
        
        tr.innerHTML = `
            <td><strong>${nf.number}</strong></td>
            <td>${nf.clientName}</td>
            <td>${nf.productName}</td>
            <td>${formatDateBr(nf.issueDate)}</td>
            <td><strong>${formatCurrency(nf.value)}</strong></td>
            <td>${receiptHtml}</td>
            <td style="text-align: right;">
                <div style="display: flex; gap: 6px; justify-content: flex-end;">
                    <button class="btn-icon-only btn-sm btn-edit-fiscal-note" data-id="${nf.id}" title="Editar" style="width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;"><i data-lucide="edit-2" style="width:12px;height:12px;"></i></button>
                    <button class="btn-icon-only btn-sm btn-delete-fiscal-note" data-id="${nf.id}" title="Excluir" style="width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button>
                </div>
            </td>
        `;
        
        if (!nf.receiptId) {
            tr.querySelector(".btn-generate-receipt-from-note").onclick = () => {
                generateReceiptFromFiscalNote(nf.id);
            };
        }
        
        tr.querySelector(".btn-edit-fiscal-note").onclick = () => {
            openEditFiscalNote(nf.id);
        };
        
        tr.querySelector(".btn-delete-fiscal-note").onclick = () => {
            deleteFiscalNote(nf.id);
        };
        
        tbody.appendChild(tr);
    });
    
    safeCreateIcons();
}

function generateReceiptFromFiscalNote(id) {
    const env = getEnv();
    const nf = env.fiscalNotes.find(x => x.id === id);
    if (!nf) return;
    
    const newInvoice = {
        id: "FAT-" + Date.now().toString().substring(8),
        customerName: nf.clientName,
        company: "-",
        niche: "Outro",
        productName: nf.productName + ` (Ref: NF ${nf.number})`,
        value: nf.value,
        dueDate: nf.issueDate,
        status: "paid"
    };
    env.invoices.push(newInvoice);
    
    nf.receiptId = newInvoice.id;
    
    saveState();
    renderAll();
    
    const tabInvoices = document.getElementById("tabInvoices");
    if (tabInvoices) tabInvoices.click();
    
    showToast("Recebimento lançado com sucesso!", "success");
}

function openAddFiscalNote() {
    document.getElementById("fiscalNoteForm").reset();
    document.getElementById("fiscalNoteId").value = "";
    document.getElementById("fiscalNoteIssueDate").value = new Date().toISOString().split("T")[0];
    
    populateFiscalNoteDatalists();
    
    document.getElementById("fiscalNoteReceiptGroup").style.display = "flex";
    document.getElementById("fiscalNoteGenerateReceipt").checked = true;
    
    document.getElementById("fiscalNoteModalTitle").innerText = "Lançar Nota Fiscal";
    document.getElementById("fiscalNoteModal").classList.add("active");
}

function openEditFiscalNote(id) {
    const env = getEnv();
    const nf = env.fiscalNotes.find(x => x.id === id);
    if (!nf) return;
    
    document.getElementById("fiscalNoteForm").reset();
    document.getElementById("fiscalNoteId").value = nf.id;
    document.getElementById("fiscalNoteNumber").value = nf.number || "";
    document.getElementById("fiscalNoteIssueDate").value = nf.issueDate || "";
    
    populateFiscalNoteDatalists();
    
    document.getElementById("fiscalNoteClient").value = nf.clientName || "";
    document.getElementById("fiscalNoteProduct").value = nf.productName || "";
    document.getElementById("fiscalNoteValue").value = nf.value || "";
    
    document.getElementById("fiscalNoteReceiptGroup").style.display = "none";
    
    document.getElementById("fiscalNoteModalTitle").innerText = "Editar Nota Fiscal";
    document.getElementById("fiscalNoteModal").classList.add("active");
}

function deleteFiscalNote(id) {
    if (confirm("Tem certeza que deseja excluir esta nota fiscal?")) {
        const env = getEnv();
        env.fiscalNotes = env.fiscalNotes.filter(x => x.id !== id);
        saveState();
        renderAll();
    }
}

function populateFiscalNoteDatalists() {
    const env = getEnv();
    const clientsDatalist = document.getElementById("fiscalNoteClientsDatalist");
    const productsDatalist = document.getElementById("fiscalNoteProductsDatalist");
    if (!clientsDatalist || !productsDatalist) return;
    
    clientsDatalist.innerHTML = "";
    productsDatalist.innerHTML = "";
    
    const uniqueClients = [];
    env.customers.forEach(c => {
        const name = c.company || c.name;
        if (name && !uniqueClients.includes(name)) {
            uniqueClients.push(name);
        }
    });
    env.contacts.forEach(c => {
        const name = c.company || c.name;
        if (name && !uniqueClients.includes(name)) {
            uniqueClients.push(name);
        }
    });
    
    uniqueClients.sort().forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        clientsDatalist.appendChild(option);
    });
    
    const sortedProducts = [...env.products].sort((a,b) => a.name.localeCompare(b.name));
    sortedProducts.forEach(p => {
        const option = document.createElement("option");
        option.value = p.name;
        productsDatalist.appendChild(option);
    });
}

function renderImportHistory() {
    const env = getEnv();
    const list = document.getElementById("importHistoryList");
    if (!list) return;
    
    list.innerHTML = "";
    
    if (!env.importHistory || env.importHistory.length === 0) {
        list.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px 0; font-size: 13px;">Nenhum histórico de importação encontrado.</div>`;
        return;
    }
    
    const sorted = [...env.importHistory].sort((a,b) => b.date.localeCompare(a.date));
    
    sorted.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.style.border = "1px solid var(--border-color)";
        itemDiv.style.borderRadius = "var(--radius-sm)";
        itemDiv.style.background = "var(--bg-app)";
        itemDiv.style.padding = "12px";
        itemDiv.style.display = "flex";
        itemDiv.style.flexDirection = "column";
        itemDiv.style.gap = "8px";
        
        const dateFormatted = new Date(item.date).toLocaleString("pt-BR");
        
        itemDiv.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong style="font-size:13px; color:var(--text-primary); display:block;">${item.fileName}</strong>
                    <span style="font-size:11px; color:var(--text-secondary);">${dateFormatted}</span>
                </div>
                <div style="display:flex; gap:6px;">
                    <span class="badge-status active" style="font-size:10px; padding:2px 6px; border-radius:4px;">${item.successCount} Sucessos</span>
                    ${item.failCount > 0 ? `<span class="badge-status inactive" style="font-size:10px; padding:2px 6px; border-radius:4px;">${item.failCount} Falhas</span>` : ''}
                </div>
            </div>
            <div>
                <button class="btn btn-secondary btn-xs btn-toggle-import-log-details" data-id="${item.id}" style="font-size:10px; padding:4px 8px; border-radius:4px; display:inline-flex; align-items:center; gap:4px; cursor:pointer;"><i data-lucide="eye" style="width:10px;height:10px;"></i> Ver Logs Detalhados</button>
            </div>
            <div class="import-log-details hidden" id="details-${item.id}" style="border-top: 1px dashed var(--border-color); padding-top: 8px; margin-top: 4px; font-family: monospace; font-size: 11px; color: var(--text-secondary); max-height: 150px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;">
                ${item.details.map(log => {
                    const isSuccess = log.includes("Sucesso");
                    const color = isSuccess ? "var(--color-success)" : "var(--color-danger)";
                    const bg = isSuccess ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)";
                    return `<div style="padding: 2px 4px; border-radius: 2px; background: ${bg}; color: ${color};">${log}</div>`;
                }).join("")}
            </div>
        `;
        
        itemDiv.querySelector(".btn-toggle-import-log-details").onclick = (e) => {
            const detailsDiv = itemDiv.querySelector(`#details-${item.id}`);
            const btn = e.currentTarget;
            if (detailsDiv.classList.contains("hidden")) {
                detailsDiv.classList.remove("hidden");
                btn.innerHTML = `<i data-lucide="eye-off" style="width:10px;height:10px;"></i> Ocultar Logs`;
            } else {
                detailsDiv.classList.add("hidden");
                btn.innerHTML = `<i data-lucide="eye" style="width:10px;height:10px;"></i> Ver Logs Detalhados`;
            }
            safeCreateIcons();
        };
        
        list.appendChild(itemDiv);
    });
    
    safeCreateIcons();
}

