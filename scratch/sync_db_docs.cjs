const fs = require('fs');

let db = { environments: { webco: { documents: [] } } };
if (fs.existsSync('db.json')) {
    try { db = JSON.parse(fs.readFileSync('db.json', 'utf8')); } catch (e) {}
}

if (!db.environments) db.environments = {};
if (!db.environments.webco) db.environments.webco = {};

const defaultDocs = [
    {
        id: "doc_briefing_cliente_site_2026",
        title: "Formulário de Briefing para Criação de Site (Preenchimento do Cliente)",
        category: "contrato",
        description: "Formulário oficial de coleta de dados para envio ao cliente. Contém todos os campos para o cliente preencher sobre a empresa dele: Nome, Slogan, Logo, Paleta de Cores, WhatsApp, E-mail, Redes Sociais, Serviços e Fotos.",
        fileName: "Briefing_Criacao_de_Site_Cliente.pdf",
        fileType: "application/pdf",
        tags: "briefing, formulario cliente, criacao de site, dados cliente, contrato, logo, whatsapp, cores",
        createdAt: "2026-07-31T10:45:00.000Z"
    },
    {
        id: "doc_webco_checklist_site_2026",
        title: "Checklist & Briefing Completo para Criação de Sites - WEBCO Agency",
        category: "outros",
        description: "Guia definitivo e checklist oficial com todos os itens necessários para desenvolvimento de sites profissionais (Identidade Visual, Paleta de Cores, Logo, Banner, WhatsApp, E-mail, Redes Sociais, Domínio e Estrutura de Páginas).",
        fileName: "Checklist_Briefing_Criacao_de_Site_WEBCO.pdf",
        fileType: "application/pdf",
        tags: "checklist, briefing, site, webco, logo, paleta, whatsapp, email, dominio",
        createdAt: "2026-07-31T10:00:00.000Z"
    },
    {
        id: "doc_default_1",
        title: "Proposta Comercial Padrão - WEBCO 2026",
        category: "proposta",
        description: "Modelo oficial de proposta comercial para desenvolvimento de sites profissionais, landing pages e soluções digitais.",
        fileName: "Proposta_Comercial_WEBCO_2026.pdf",
        fileType: "application/pdf",
        tags: "proposta, comercial, pdf, sites",
        createdAt: "2026-07-30T10:00:00.000Z"
    },
    {
        id: "doc_default_2",
        title: "Portfólio de Cases & Projetos WEBCO",
        category: "portfolio",
        description: "Apresentação visual com principais cases de sucesso, métricas de resultados e telas de sites desenvolvidos.",
        fileName: "Portfolio_Cases_WEBCO.pdf",
        fileType: "application/pdf",
        tags: "portfolio, cases, apresentacao, webco",
        createdAt: "2026-07-30T10:30:00.000Z"
    }
];

db.environments.webco.documents = defaultDocs;
fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('db.json documents synced successfully! Count:', db.environments.webco.documents.length);
