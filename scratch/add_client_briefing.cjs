const fs = require('fs');

// 1. Read db.json and seed client briefing document
let db = { environments: { webco: { documents: [] } } };
if (fs.existsSync('db.json')) {
    try { db = JSON.parse(fs.readFileSync('db.json', 'utf8')); } catch (e) {}
}

if (!db.environments) db.environments = {};
if (!db.environments.webco) db.environments.webco = {};
if (!db.environments.webco.documents) db.environments.webco.documents = [];

const clientBriefingDoc = {
    id: "doc_briefing_cliente_site_2026",
    title: "Formulário de Briefing para Criação de Site (Preenchimento do Cliente)",
    category: "contrato",
    description: "Formulário oficial de coleta de dados para envio ao cliente. Contém todos os campos para o cliente preencher sobre a empresa dele: Nome, Slogan, Logo, Paleta de Cores, WhatsApp, E-mail, Redes Sociais, Serviços e Fotos.",
    fileName: "Briefing_Criacao_de_Site_Cliente.pdf",
    fileType: "application/pdf",
    tags: "briefing, formulario cliente, criacao de site, dados cliente, contrato, logo, whatsapp, cores",
    createdAt: "2026-07-31T10:45:00.000Z"
};

const existingIdx = db.environments.webco.documents.findIndex(d => d.id === clientBriefingDoc.id);
if (existingIdx !== -1) {
    db.environments.webco.documents[existingIdx] = clientBriefingDoc;
} else {
    db.environments.webco.documents.unshift(clientBriefingDoc);
}

fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Client Briefing Document seeded into db.json successfully. Total docs:', db.environments.webco.documents.length);

// 2. Update defaultDocuments in src/app.js
let appJs = fs.readFileSync('src/app.js', 'utf8');

if (!appJs.includes('doc_briefing_cliente_site_2026')) {
    const targetStr = 'const defaultDocuments = [';
    const docSnippet = `const defaultDocuments = [
    {
        id: "doc_briefing_cliente_site_2026",
        title: "Formulário de Briefing para Criação de Site (Preenchimento do Cliente)",
        category: "contrato",
        description: "Formulário oficial de coleta de dados para envio ao cliente. Contém todos os campos para o cliente preencher sobre a empresa dele: Nome, Slogan, Logo, Paleta de Cores, WhatsApp, E-mail, Redes Sociais, Serviços e Fotos.",
        fileName: "Briefing_Criacao_de_Site_Cliente.pdf",
        fileType: "application/pdf",
        tags: "briefing, formulario cliente, criacao de site, dados cliente, contrato, logo, whatsapp, cores",
        createdAt: "2026-07-31T10:45:00.000Z"
    },`;
    appJs = appJs.replace(targetStr, docSnippet);
}

// Update getDocuments() function to auto-sync defaultDocuments
const oldGetDocs = `function getDocuments() {
    const env = getEnv();
    if (!env.documents) env.documents = [...defaultDocuments];
    return env.documents;
}`;

const newGetDocs = `function getDocuments() {
    const env = getEnv();
    if (!env.documents) env.documents = [...defaultDocuments];
    defaultDocuments.forEach(defDoc => {
        if (!env.documents.some(d => d.id === defDoc.id)) {
            env.documents.push(defDoc);
        }
    });
    return env.documents;
}`;

if (appJs.includes(oldGetDocs)) {
    appJs = appJs.replace(oldGetDocs, newGetDocs);
}

fs.writeFileSync('src/app.js', appJs, 'utf8');
console.log('Updated defaultDocuments and getDocuments() in src/app.js');
