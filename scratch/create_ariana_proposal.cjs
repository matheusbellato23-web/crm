const fs = require('fs');

let db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

if (!db.environments) db.environments = {};
if (!db.environments.webco) db.environments.webco = {};
if (!db.environments.webco.contacts) db.environments.webco.contacts = [];
if (!db.environments.webco.proposals) db.environments.webco.proposals = [];

// 1. Ensure Gráfica Ariana exists in contacts
let cAriana = db.environments.webco.contacts.find(c => (c.company || '').toLowerCase().includes('ariana') || (c.name || '').toLowerCase().includes('ariana'));

if (!cAriana) {
    cAriana = {
        id: "c_ariana_" + Date.now(),
        name: "Gráfica Ariana",
        company: "Gráfica Ariana",
        email: "contato@graficaariana.com.br",
        phone: "(11) 98765-4321",
        niche: "Gráfica",
        status: "proposal",
        value: 400.00,
        notes: "Proposta Comercial criada para criação de site único (R$ 400 - 50% entrada e 50% entrega).",
        source: "Comercial WEBCO",
        createdAt: new Date().toISOString(),
        timeline: [
            {
                id: "act_ariana_1",
                type: "note",
                description: "📄 Proposta Comercial enviada por Matheus Bellato (R$ 400,00 - 5 dias de entrega).",
                timestamp: new Date().toISOString()
            }
        ]
    };
    db.environments.webco.contacts.push(cAriana);
    console.log('Created Gráfica Ariana contact');
} else {
    cAriana.status = "proposal";
    cAriana.value = 400.00;
}

// 2. Create official proposal object for Gráfica Ariana
const proposalAriana = {
    id: "prop_ariana_2026",
    contactId: cAriana.id,
    productId: "prod_site_institucional",
    productName: "Desenvolvimento de Site Institucional - Gráfica Ariana",
    value: 400.00,
    recurrence: "single",
    status: "pending",
    date: new Date().toISOString().split('T')[0],
    validityDays: 15,
    deliveryDays: 5,
    responsible: "Matheus Bellato",
    paymentTerms: "50% de entrada no início (R$ 200,00) e 50% na entrega final (R$ 200,00)",
    scope: [
        "Desenvolvimento de Site Profissional para a Gráfica Ariana",
        "Layout Responsivo Otimizado para Celulares e Computadores",
        "Botão de WhatsApp Flutuante com Direcionamento Direto de Clientes",
        "Página de Apresentação de Serviços da Gráfica e Formulário de Contato",
        "Otimização SEO Básica e Integração com Redes Sociais"
    ],
    notes: "Proposta criada por Matheus Bellato da WEBCO Agency. Prazo de entrega em até 5 dias corridos."
};

// Check if already exists in proposals array
const existingPropIdx = db.environments.webco.proposals.findIndex(p => p.id === proposalAriana.id || p.contactId === cAriana.id);
if (existingPropIdx !== -1) {
    db.environments.webco.proposals[existingPropIdx] = proposalAriana;
} else {
    db.environments.webco.proposals.unshift(proposalAriana);
}

fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully saved Gráfica Ariana proposal to db.json!');

// 3. Sync into src/app.js defaultContacts & defaultProposals if present
let appJs = fs.readFileSync('src/app.js', 'utf8');
if (appJs.includes('const defaultProposals =')) {
    const startProp = appJs.indexOf('const defaultProposals = [');
    const endProp = appJs.indexOf('];', startProp);
    if (startProp !== -1 && endProp !== -1) {
        const propSnippet = `const defaultProposals = [\n    ${JSON.stringify(proposalAriana, null, 4)},\n`;
        appJs = appJs.replace('const defaultProposals = [', propSnippet);
        fs.writeFileSync('src/app.js', appJs, 'utf8');
        console.log('Updated defaultProposals in src/app.js!');
    }
}
