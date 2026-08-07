const fs = require('fs');

let db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

if (!db.environments) db.environments = {};
if (!db.environments.webco) db.environments.webco = {};
const env = db.environments.webco;

if (!env.contacts) env.contacts = [];
if (!env.customers) env.customers = [];
if (!env.contracts) env.contracts = [];
if (!env.invoices) env.invoices = [];
if (!env.proposals) env.proposals = [];

// 1. Ensure Gráfica Ariana is a Contact in 'proposal' stage or 'won' stage
let cAriana = env.contacts.find(c => (c.company || '').toLowerCase().includes('ariana') || (c.name || '').toLowerCase().includes('ariana'));

if (!cAriana) {
    cAriana = {
        id: "c_ariana_" + Date.now(),
        name: "Gráfica Ariana",
        company: "Gráfica Ariana",
        email: "contato@graficaariana.com.br",
        phone: "(11) 97570-2321",
        niche: "Gráfica",
        status: "won",
        value: 400.00,
        notes: "Criação de Site Institucional Exclusivo (R$ 400,00 - 50% entrada R$ 200,00 + 50% entrega R$ 200,00).",
        source: "Comercial WEBCO",
        createdAt: new Date().toISOString()
    };
    env.contacts.push(cAriana);
} else {
    cAriana.status = "won";
    cAriana.value = 400.00;
}

// 2. Ensure Gráfica Ariana is in Customers (Clientes) with Product value R$ 400,00
let custAriana = env.customers.find(c => c.contactId === cAriana.id || (c.company || '').toLowerCase().includes('ariana'));

if (!custAriana) {
    custAriana = {
        id: "cust_ariana_site",
        contactId: cAriana.id,
        name: cAriana.name,
        company: "Gráfica Ariana",
        niche: "Gráfica",
        productName: "Criação de Site Institucional",
        value: 400.00,
        type: "single",
        status: "active",
        createdAt: new Date().toISOString()
    };
    env.customers.push(custAriana);
    console.log('Added Gráfica Ariana to Customers (Clientes)!');
} else {
    custAriana.value = 400.00;
    custAriana.productName = "Criação de Site Institucional";
    custAriana.status = "active";
    console.log('Updated Gráfica Ariana in Customers (Clientes)!');
}

// 3. Ensure Invoice (Fatura) for R$ 400,00
let invAriana = env.invoices.find(i => (i.company || '').toLowerCase().includes('ariana'));
if (!invAriana) {
    env.invoices.push({
        id: "FAT-ARIANA-1",
        customerName: cAriana.name,
        company: "Gráfica Ariana",
        niche: "Gráfica",
        productName: "Criação de Site Institucional",
        value: 400.00,
        dueDate: "2026-08-11",
        status: "pending"
    });
}

// 4. Ensure Contract for R$ 400,00
let contrAriana = env.contracts.find(c => (c.company || '').toLowerCase().includes('ariana'));
if (!contrAriana) {
    env.contracts.push({
        id: "CONTR-ARIANA-1",
        contactId: cAriana.id,
        proposalId: "prop_ariana_2026",
        clientName: cAriana.name,
        company: "Gráfica Ariana",
        productName: "Criação de Site Institucional",
        value: 400.00,
        recurrence: "single",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "2026-08-11",
        status: "active"
    });
}

fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated db.json with Gráfica Ariana customer product of R$ 400!');

// Also sync defaultCustomers in src/app.js so initial state includes Gráfica Ariana
let appJs = fs.readFileSync('src/app.js', 'utf8');

if (!appJs.includes('cust_ariana_site')) {
    const oldDefaultCust = `const defaultCustomers = [`;
    const newDefaultCust = `const defaultCustomers = [\n    { id: "cust_ariana_site", contactId: "c_ariana_2026", name: "Gráfica Ariana", company: "Gráfica Ariana", niche: "Gráfica", productName: "Criação de Site Institucional", value: 400.00, type: "single", status: "active", createdAt: "2026-08-06T12:00:00.000Z" },`;
    appJs = appJs.replace(oldDefaultCust, newDefaultCust);
    fs.writeFileSync('src/app.js', appJs, 'utf8');
    console.log('Updated defaultCustomers in src/app.js!');
}
