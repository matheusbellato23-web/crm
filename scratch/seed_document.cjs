const fs = require('fs');
const path = require('path');

// 1. Update db.json
let db = { environments: { webco: { documents: [] } } };
if (fs.existsSync('db.json')) {
    try { db = JSON.parse(fs.readFileSync('db.json', 'utf8')); } catch (e) {}
}

if (!db.environments) db.environments = {};
if (!db.environments.webco) db.environments.webco = {};
if (!db.environments.webco.documents) db.environments.webco.documents = [];

const newDoc = {
    id: "doc_webco_checklist_site_2026",
    title: "Checklist & Briefing Completo para Criação de Sites - WEBCO Agency",
    category: "outros",
    description: "Guia definitivo e checklist oficial com todos os itens necessários para desenvolvimento de sites profissionais (Identidade Visual, Paleta de Cores, Logo, Banner, WhatsApp, E-mail, Redes Sociais, Domínio e Estrutura de Páginas).",
    fileName: "Checklist_Briefing_Criacao_de_Site_WEBCO.pdf",
    fileType: "application/pdf",
    tags: "checklist, briefing, site, webco, logo, paleta, whatsapp, email, dominio",
    createdAt: new Date().toISOString()
};

const existingIdx = db.environments.webco.documents.findIndex(d => d.id === newDoc.id || d.title.includes('Checklist'));
if (existingIdx !== -1) {
    db.environments.webco.documents[existingIdx] = newDoc;
} else {
    db.environments.webco.documents.unshift(newDoc);
}

fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Document seeded into db.json successfully. Total docs:', db.environments.webco.documents.length);

// 2. Update defaultDocuments in src/app.js if not present
let appJs = fs.readFileSync('src/app.js', 'utf8');
if (!appJs.includes('doc_webco_checklist_site_2026')) {
    const targetStr = 'const defaultDocuments = [';
    const docSnippet = `const defaultDocuments = [
    {
        id: "doc_webco_checklist_site_2026",
        title: "Checklist & Briefing Completo para Criação de Sites - WEBCO Agency",
        category: "outros",
        description: "Guia definitivo e checklist oficial com todos os itens necessários para desenvolvimento de sites profissionais (Identidade Visual, Paleta de Cores, Logo, Banner, WhatsApp, E-mail, Redes Sociais, Domínio e Estrutura de Páginas).",
        fileName: "Checklist_Briefing_Criacao_de_Site_WEBCO.pdf",
        fileType: "application/pdf",
        tags: "checklist, briefing, site, webco, logo, paleta, whatsapp, email, dominio",
        createdAt: "2026-07-31T10:00:00.000Z"
    },`;
    appJs = appJs.replace(targetStr, docSnippet);
    fs.writeFileSync('src/app.js', appJs, 'utf8');
    console.log('Document added to defaultDocuments in src/app.js!');
}
