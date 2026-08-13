const fs = require('fs');

let db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Add currentEnv to root state so init() can find the environment
db.currentEnv = 'webco';
db.privacyMode = false;

// Ensure webco env has expenses and products arrays
if (!db.environments.webco.expenses) db.environments.webco.expenses = [];
if (!db.environments.webco.products) db.environments.webco.products = [];
if (!db.environments.webco.tasks) db.environments.webco.tasks = [];
if (!db.environments.webco.templates) db.environments.webco.templates = [];
if (!db.environments.webco.affiliates) db.environments.webco.affiliates = [];
if (!db.environments.webco.fiscalNotes) db.environments.webco.fiscalNotes = [];
if (!db.environments.webco.importHistory) db.environments.webco.importHistory = [];
if (!db.environments.webco.niches) db.environments.webco.niches = [
    "Negócio Local", "E-commerce", "Infoproduto / Lançamentos",
    "SaaS / Startup", "Serviços B2B", "Turismo", "Saúde / Estética", "Gráfica", "Outro"
];
if (db.environments.webco.balanceAdjustment === undefined) db.environments.webco.balanceAdjustment = 0;

// Add admin user
if (!db.environments.webco.users) {
    db.environments.webco.users = [
        { username: "Admin", password: "080125", name: "Admin", role: "Administrador" }
    ];
}

fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('db.json updated with currentEnv and full schema.');
console.log('Total contacts:', db.environments.webco.contacts.length);
console.log('Total invoices:', db.environments.webco.invoices.length);
console.log('Total customers:', db.environments.webco.customers.length);
