const fs = require('fs');

let appJs = fs.readFileSync('src/app.js', 'utf8');

// Replace defaultCustomers
const oldDefaultCust = `const defaultCustomers = [
    { id: "cust_ariana_site", contactId: "c_ariana_2026", name: "Gráfica Ariana", company: "Gráfica Ariana", niche: "Gráfica", productName: "Criação de Site Institucional", value: 400.00, type: "single", status: "active", createdAt: "2026-08-06T12:00:00.000Z" },
    { id: "cust1", contactId: "c2", name: "Maria Oliveira", company: "Giga Corp", niche: "E-commerce", productName: "Desenvolvimento E-commerce", value: 7500.00, type: "single", status: "active", createdAt: "2026-07-09T18:12:00.000Z" },
    { id: "cust2", contactId: "c2", name: "Maria Oliveira", company: "Giga Corp", niche: "E-commerce", productName: "Gestão de Google Ads", value: 1200.00, type: "monthly", status: "active", createdAt: "2026-07-09T18:12:00.000Z" },
    { id: "cust_parana_site", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, type: "single", status: "active", createdAt: "2026-04-13T12:00:00.000Z" },
    { id: "cust_parana_update", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Atualização de Site", value: 500.00, type: "single", status: "active", createdAt: "2026-07-13T10:00:00.000Z" },
    { id: "cust_parana_maint", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual)", value: 240.00, type: "yearly", status: "active", createdAt: "2026-07-13T12:00:00.000Z" },
    { id: "cust_parana_ads", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Gestão de Google Ads", value: 400.00, type: "monthly", status: "active", createdAt: "2026-07-13T12:00:00.000Z" }
];`;

const newDefaultCust = `const defaultCustomers = [
    { id: "cust_storylens_site", contactId: "c_storylens", name: "Story Lens", company: "Story Lens", niche: "Serviços B2B", productName: "Criação de Site Institucional (Story Lens)", value: 400.00, type: "single", status: "active", createdAt: "2026-05-10T10:00:00.000Z" },
    { id: "cust_cesar_site", contactId: "c_cesar", name: "César", company: "Site do César (Story Lens)", niche: "Serviços B2B", productName: "Criação de Site (César)", value: 400.00, type: "single", status: "active", createdAt: "2026-07-01T10:00:00.000Z" },
    { id: "cust_estrevo_site", contactId: "c_estrevo", name: "Estrevo", company: "Estrevo (Story Lens)", niche: "Serviços B2B", productName: "Criação de Site (Estrevo)", value: 400.00, type: "single", status: "active", createdAt: "2026-07-15T10:00:00.000Z" },
    { id: "cust_estrevo_extra", contactId: "c_estrevo", name: "Estrevo", company: "Estrevo (Story Lens)", niche: "Serviços B2B", productName: "Serviço Adicional (Estrevo)", value: 50.00, type: "single", status: "active", createdAt: "2026-07-18T10:00:00.000Z" },
    { id: "cust_parana_site", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, type: "single", status: "active", createdAt: "2026-04-13T12:00:00.000Z" },
    { id: "cust_parana_update", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção e Atualização de Site", value: 500.00, type: "single", status: "active", createdAt: "2026-07-13T10:00:00.000Z" },
    { id: "cust_parana_maint", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual - R$ 20/mês)", value: 240.00, type: "yearly", status: "active", createdAt: "2026-07-13T12:00:00.000Z" },
    { id: "cust_cromagraph_site", contactId: "c_cromagraph", name: "Cromagraph", company: "Cromagraph", niche: "Gráfica", productName: "Criação de Site Institucional", value: 400.00, type: "single", status: "active", createdAt: "2026-06-01T10:00:00.000Z" },
    { id: "cust_ariana_site", contactId: "c_ariana", name: "Gráfica Ariana", company: "Gráfica Ariana", niche: "Gráfica", productName: "Criação de Site Institucional", value: 400.00, type: "single", status: "active", createdAt: "2026-08-06T12:00:00.000Z" }
];`;

if (appJs.includes(oldDefaultCust)) {
    appJs = appJs.replace(oldDefaultCust, newDefaultCust);
    console.log('Replaced defaultCustomers in app.js!');
}

// Replace defaultInvoices
const oldDefaultInv = `const defaultInvoices = [
    { id: "FAT-1001", customerName: "Maria Oliveira", company: "Giga Corp", niche: "E-commerce", productName: "Desenvolvimento E-commerce", value: 7500.00, dueDate: "2026-07-10", status: "paid" },
    { id: "FAT-1002", customerName: "Maria Oliveira", company: "Giga Corp", niche: "E-commerce", productName: "Gestão de Google Ads", value: 1200.00, dueDate: "2026-07-12", status: "paid" },
    { id: "FAT-1003", customerName: "João Silva", company: "Inova Tech", niche: "SaaS / Startup", productName: "Criação de Site Profissional", value: 3500.00, dueDate: "2026-07-14", status: "pending" },
    { id: "FAT-PARANA-1", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, dueDate: "2026-04-15", status: "paid" },
    { id: "FAT-PARANA-2", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Atualização de Site", value: 500.00, dueDate: "2026-07-13", status: "paid" },
    { id: "FAT-PARANA-3", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual)", value: 240.00, dueDate: "2026-07-20", status: "pending" },
    { id: "FAT-PARANA-4", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Gestão de Google Ads", value: 400.00, dueDate: "2026-07-31", status: "pending" }
];`;

const newDefaultInv = `const defaultInvoices = [
    { id: "FAT-STORYLENS-1", customerName: "Story Lens", company: "Story Lens", niche: "Serviços B2B", productName: "Criação de Site Institucional", value: 400.00, dueDate: "2026-05-15", status: "paid", notes: "100% Pago" },
    { id: "FAT-CESAR-1", customerName: "César", company: "Site do César (Story Lens)", niche: "Serviços B2B", productName: "Criação de Site (Entrada 50%)", value: 200.00, dueDate: "2026-07-05", status: "paid", notes: "50% Entrada Pago" },
    { id: "FAT-CESAR-2", customerName: "César", company: "Site do César (Story Lens)", niche: "Serviços B2B", productName: "Criação de Site (Entrega 50%)", value: 200.00, dueDate: "2026-08-30", status: "pending", notes: "A receber este mês" },
    { id: "FAT-ESTREVO-1", customerName: "Estrevo", company: "Estrevo (Story Lens)", niche: "Serviços B2B", productName: "Criação de Site (Entrada 50%)", value: 200.00, dueDate: "2026-07-20", status: "paid", notes: "50% Entrada Pago" },
    { id: "FAT-ESTREVO-2", customerName: "Estrevo", company: "Estrevo (Story Lens)", niche: "Serviços B2B", productName: "Criação de Site (Entrega 50%)", value: 200.00, dueDate: "2026-08-25", status: "pending", notes: "A receber este mês" },
    { id: "FAT-ESTREVO-3", customerName: "Estrevo", company: "Estrevo (Story Lens)", niche: "Serviços B2B", productName: "Serviço Adicional", value: 50.00, dueDate: "2026-07-22", status: "paid", notes: "100% Pago" },
    { id: "FAT-PARANA-1", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, dueDate: "2026-04-15", status: "paid", notes: "100% Pago" },
    { id: "FAT-PARANA-2", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção e Atualização de Site", value: 500.00, dueDate: "2026-07-13", status: "paid", notes: "100% Pago" },
    { id: "FAT-PARANA-3", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual)", value: 240.00, dueDate: "2026-12-31", status: "pending", notes: "R$ 20/mês distribuído em 12 meses" },
    { id: "FAT-CROMAGRAPH-1", customerName: "Cromagraph", company: "Cromagraph", niche: "Gráfica", productName: "Criação de Site Institucional", value: 400.00, dueDate: "2026-06-10", status: "paid", notes: "100% Pago" },
    { id: "FAT-ARIANA-1", customerName: "Gráfica Ariana", company: "Gráfica Ariana", niche: "Gráfica", productName: "Criação de Site Institucional (Entrada 50%)", value: 200.00, dueDate: "2026-08-07", status: "paid", notes: "50% Entrada Pago" },
    { id: "FAT-ARIANA-2", customerName: "Gráfica Ariana", company: "Gráfica Ariana", niche: "Gráfica", productName: "Criação de Site Institucional (Entrega 50%)", value: 200.00, dueDate: "2026-08-15", status: "pending", notes: "A receber na entrega" }
];`;

if (appJs.includes(oldDefaultInv)) {
    appJs = appJs.replace(oldDefaultInv, newDefaultInv);
    console.log('Replaced defaultInvoices in app.js!');
}

fs.writeFileSync('src/app.js', appJs, 'utf8');
console.log('Saved app.js!');
