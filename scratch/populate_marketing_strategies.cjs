const fs = require('fs');

let db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

if (!db.environments) db.environments = {};
if (!db.environments.webco) db.environments.webco = {};

const strategyAssets = [
    {
        id: "ma_strat_1",
        title: "Site Institucional Exclusivo - Gráfica Ariana",
        category: "sites",
        status: "active",
        url: "https://graficaariana.com.br",
        metrics: "Subindo na Hostinger (IP 2.24.117.26) • 5 dias de entrega",
        cost: "R$ 400,00 (50/50)",
        notes: "Site responsivo com botão de WhatsApp direto para orçamentos rápidos da gráfica."
    },
    {
        id: "ma_strat_2",
        title: "Campanha Google Ads - Prospecção Gráfica Ariana",
        category: "ads",
        status: "active",
        url: "https://ads.google.com",
        metrics: "Palavras-chave: gráfica rápida, impressão gráfica, panfletos SP",
        cost: "R$ 600,00/mês",
        notes: "Anúncios focados em captar clientes locais que buscam serviços de gráfica rápida."
    },
    {
        id: "ma_strat_3",
        title: "WhatsApp Direct Lead Converter (Gráfica Ariana)",
        category: "social",
        status: "active",
        url: "https://wa.me/5511975702321",
        metrics: "Redirecionamento 1-clique | Chave Pix 11975702321",
        cost: "R$ 0,00",
        notes: "Integração do botão de atendimento instantâneo diretamente para o WhatsApp comercial."
    },
    {
        id: "ma_strat_4",
        title: "SEO Local & Google Meu Negócio - Gráfica Ariana",
        category: "organic",
        status: "active",
        url: "https://maps.google.com",
        metrics: "Otimização para mapa local e buscas regionais",
        cost: "R$ 0,00",
        notes: "Cadastro e otimização das palavras-chave locais para gráfica nas primeiras posições."
    },
    {
        id: "ma_strat_5",
        title: "Site Principal & Landing Pages - WEBCO Agency",
        category: "sites",
        status: "active",
        url: "https://webcoagency.site",
        metrics: "2.4k visitas/mês | Hostinger VPS",
        cost: "R$ 45,00/mês",
        notes: "Site institucional e landing pages de conversão de clientes."
    },
    {
        id: "ma_strat_6",
        title: "Campanha Google Ads - WEBCO Agency (Criação de Sites)",
        category: "ads",
        status: "active",
        url: "https://ads.google.com",
        metrics: "120 leads/mês | CTR 4.8%",
        cost: "R$ 1.500,00/mês",
        notes: "Campanha nacional de atração de PMEs para criação de sites e tráfego pago."
    }
];

db.environments.webco.marketingAssets = strategyAssets;

fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated marketingAssets in db.json!');

// Also sync defaultMarketingAssets in src/app.js so initial state includes strategies
let appJs = fs.readFileSync('src/app.js', 'utf8');
const oldDefaultAssetsStr = `const defaultMarketingAssets = [
    { id: "ma1", title: "Site Principal - Web Co. Labs", category: "sites", status: "active", url: "https://webcolabs.com.br", metrics: "2.4k visitas/mês", cost: "R$ 45,00/mês", notes: "Site institucional oficial." },
    { id: "ma2", title: "Campanha Google Ads - Criação de Sites", category: "ads", status: "active", url: "https://ads.google.com", metrics: "120 leads/mês | CTR 4.8%", cost: "R$ 1.500,00/mês", notes: "Focado em pequenas empresas locais." },
    { id: "ma3", title: "Instagram Oficial @webcolabs", category: "social", status: "active", url: "https://instagram.com/webcolabs", metrics: "3.2k seguidores | 5.2% engajamento", cost: "R$ 0,00", notes: "Postagens semanais de portfólio." },
    { id: "ma4", title: "SEO Orgânico - Blog de Tecnologia", category: "organic", status: "active", url: "https://webcolabs.com.br/blog", metrics: "850 acessos orgânicos/mês", cost: "R$ 300,00/mês", notes: "Artigos otimizados para busca local." }
];`;

const newDefaultAssetsStr = `const defaultMarketingAssets = ${JSON.stringify(strategyAssets, null, 4)};`;

if (appJs.includes(oldDefaultAssetsStr)) {
    appJs = appJs.replace(oldDefaultAssetsStr, newDefaultAssetsStr);
    fs.writeFileSync('src/app.js', appJs, 'utf8');
    console.log('Successfully updated defaultMarketingAssets in src/app.js!');
}
