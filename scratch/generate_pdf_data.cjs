const fs = require('fs');

// Simple helper to create a valid minimal PDF base64 string with custom title and text
function createMinimalPdfBase64(title, description) {
    const textContent = `WEBCO Agency 2026\n\n${title}\n\n${description}\n\nSite: https://webcoagency.site\nWhatsApp: (11) 91814-7277`;
    
    // Create valid minimal PDF format
    const pdfRaw = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kinds [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${textContent.length + 100} >>
stream
BT
/F1 18 Tf
50 720 Td
(${title.replace(/[()]/g, '')}) Tj
/F1 12 Tf
0 -30 Td
(WEBCO Agency - Solucoes Digitais & Criacao de Sites) Tj
0 -40 Td
(${description.substring(0, 80).replace(/[()]/g, '')}) Tj
0 -20 Td
(${description.substring(80, 160).replace(/[()]/g, '')}) Tj
0 -40 Td
(Contato: matheusbellato23@webcoagency.site | WhatsApp: 11 91814-7277) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000550 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
625
%%EOF`;

    return 'data:application/pdf;base64,' + Buffer.from(pdfRaw).toString('base64');
}

// Update db.json
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
        fileSize: 45000,
        fileData: createMinimalPdfBase64("Formulário de Briefing para Criação de Site (Cliente)", "Formulário oficial de coleta de dados para envio ao cliente. Nome, Slogan, Logo, Paleta de Cores, WhatsApp e Serviços."),
        createdAt: "2026-07-31T10:45:00.000Z"
    },
    {
        id: "doc_webco_checklist_site_2026",
        title: "Checklist & Briefing Completo para Criação de Sites - WEBCO Agency",
        category: "contrato",
        description: "Guia definitivo e checklist oficial com todos os itens necessários para desenvolvimento de sites profissionais (Identidade Visual, Paleta de Cores, Logo, Banner, WhatsApp, E-mail, Redes Sociais, Domínio e Estrutura de Páginas).",
        fileName: "Checklist_Briefing_Criacao_de_Site_WEBCO.pdf",
        fileType: "application/pdf",
        tags: "checklist, briefing, site, webco, logo, paleta, whatsapp, email, dominio, contrato",
        fileSize: 48000,
        fileData: createMinimalPdfBase64("Checklist & Briefing Completo para Criação de Sites", "Guia definitivo e checklist oficial com todos os itens necessários para desenvolvimento de sites profissionais."),
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
        fileSize: 52000,
        fileData: createMinimalPdfBase64("Proposta Comercial Padrão - WEBCO 2026", "Modelo oficial de proposta comercial para desenvolvimento de sites profissionais, landing pages e soluções digitais."),
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
        fileSize: 55000,
        fileData: createMinimalPdfBase64("Portfólio de Cases & Projetos WEBCO", "Apresentação visual com principais cases de sucesso, métricas de resultados e telas de sites desenvolvidos."),
        createdAt: "2026-07-30T10:30:00.000Z"
    }
];

db.environments.webco.documents = defaultDocs;
fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('db.json seeded with real PDF base64 data! Total docs:', db.environments.webco.documents.length);

// Update defaultDocuments in src/app.js
let appJs = fs.readFileSync('src/app.js', 'utf8');
const startDocIdx = appJs.indexOf('const defaultDocuments = [');
const endDocIdx = appJs.indexOf('const defaultContacts = [');

if (startDocIdx !== -1 && endDocIdx !== -1) {
    const newDefaultDocsCode = `const defaultDocuments = ${JSON.stringify(defaultDocs, null, 4)};\n\n`;
    appJs = appJs.substring(0, startDocIdx) + newDefaultDocsCode + appJs.substring(endDocIdx);
    fs.writeFileSync('src/app.js', appJs, 'utf8');
    console.log('Updated defaultDocuments in src/app.js with real PDF base64 data!');
} else {
    console.error('Could not find start/end of defaultDocuments in src/app.js', startDocIdx, endDocIdx);
}
