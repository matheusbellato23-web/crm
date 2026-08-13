const fs = require('fs');

// Read current db.json
let db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

if (!db.environments) db.environments = {};
if (!db.environments.webco) db.environments.webco = {};
const env = db.environments.webco;

// Define exact clean datasets for Web Co.
// 1. Contacts
env.contacts = [
    {
        id: "c_storylens",
        name: "Story Lens",
        company: "Story Lens",
        email: "contato@storylens.com.br",
        phone: "(11) 98888-1111",
        niche: "Serviços B2B",
        status: "won",
        value: 0,
        notes: "Cliente parceira comercial. Fechou site próprio (R$ 400), indicou o site do César (R$ 400 - 50/50), indicou a Estrevo (R$ 400 - 50/50 + R$ 50 adicional).",
        source: "Comercial WEBCO",
        createdAt: "2026-05-10T10:00:00.000Z"
    },
    {
        id: "c_cesar",
        name: "César",
        company: "Site do César (Indicação Story Lens)",
        email: "cesar@storylens.com.br",
        phone: "(11) 98888-2222",
        niche: "Serviços B2B",
        status: "won",
        value: 0,
        notes: "Site do César indicado pela Story Lens. R$ 400 (R$ 200 pago + R$ 200 pendente este mês).",
        source: "Indicação Story Lens",
        createdAt: "2026-07-01T10:00:00.000Z"
    },
    {
        id: "c_estrevo",
        name: "Estrevo",
        company: "Estrevo (Indicação Story Lens)",
        email: "contato@estrevo.com.br",
        phone: "(11) 98888-3333",
        niche: "Serviços B2B",
        status: "won",
        value: 0,
        notes: "Site da Estrevo indicado pela Story Lens. R$ 400 (R$ 200 pago + R$ 200 pendente) + R$ 50 serviço adicional pago.",
        source: "Indicação Story Lens",
        createdAt: "2026-07-15T10:00:00.000Z"
    },
    {
        id: "c_parana_ecoturismo",
        name: "Marcio",
        company: "Paraná Ecoturismo",
        email: "marcio@paranaecoturismo.com.br",
        phone: "(41) 9625-2186",
        niche: "Turismo",
        status: "won",
        value: 0,
        notes: "Localizado em Morretes. R$ 400 site inicial + R$ 500 manutenção + R$ 240 manutenção anual (R$ 20/mês).",
        source: "Comercial WEBCO",
        createdAt: "2026-04-13T12:00:00.000Z"
    },
    {
        id: "c_cromagraph",
        name: "Cromagraph",
        company: "Cromagraph",
        email: "contato@cromagraph.com.br",
        phone: "(11) 97777-4444",
        niche: "Gráfica",
        status: "won",
        value: 0,
        notes: "Site de R$ 400 100% pago e concluído. Interesse futuro em Google Ads.",
        source: "Comercial WEBCO",
        createdAt: "2026-06-01T10:00:00.000Z"
    },
    {
        id: "c_ariana",
        name: "Gráfica Ariana",
        company: "Gráfica Ariana",
        email: "contato@graficaariana.com.br",
        phone: "(11) 97570-2321",
        niche: "Gráfica",
        status: "won",
        value: 0,
        notes: "Site Institucional R$ 400 (R$ 200 entrada paga + R$ 200 na entrega pendente). Interesse futuro em Google Ads.",
        source: "Comercial WEBCO",
        createdAt: "2026-08-06T12:00:00.000Z"
    }
];

// Add clean list of leads for testing/demonstration without dummy values
const leadExamples = [
    { id: "c_lead_1", name: "Gráfica São José", company: "Gráfica São José", email: "contato@graficasaojose.com.br", phone: "(11) 97111-2222", niche: "Gráfica", status: "proposal", value: 0, notes: "Pediu para entrar em contato após o dia 15 sobre proposta de site.", source: "Agente Comercial", createdAt: "2026-08-01T10:00:00.000Z" },
    { id: "c_lead_2", name: "Impressão & Arte", company: "Impressão & Arte", email: "atendimento@impressaoarte.com.br", phone: "(11) 97222-3333", niche: "Gráfica", status: "negotiating", value: 0, notes: "Proposta repassada para diretoria interna analisar.", source: "Agente Comercial", createdAt: "2026-08-03T10:00:00.000Z" },
    { id: "c_lead_3", name: "Editora Alvorada", company: "Editora Alvorada", email: "contato@alvorada.com.br", phone: "(11) 97333-4444", niche: "Gráfica", status: "lost", value: 0, notes: "Optou por manter sistema antigo no momento.", source: "Agente Comercial", createdAt: "2026-07-20T10:00:00.000Z" }
];
env.contacts.push(...leadExamples);

// 2. Customers (Serviços Ativos e Concluídos por Cliente)
env.customers = [
    // Story Lens
    { id: "cust_storylens_site", contactId: "c_storylens", name: "Story Lens", company: "Story Lens", niche: "Serviços B2B", productName: "Criação de Site Institucional (Story Lens)", value: 400.00, type: "single", status: "active", createdAt: "2026-05-10T10:00:00.000Z" },
    // Site do César (Indicação Story Lens)
    { id: "cust_cesar_site", contactId: "c_cesar", name: "César", company: "Site do César (Story Lens)", niche: "Serviços B2B", productName: "Criação de Site (César)", value: 400.00, type: "single", status: "active", createdAt: "2026-07-01T10:00:00.000Z" },
    // Estrevo (Indicação Story Lens)
    { id: "cust_estrevo_site", contactId: "c_estrevo", name: "Estrevo", company: "Estrevo (Story Lens)", niche: "Serviços B2B", productName: "Criação de Site (Estrevo)", value: 400.00, type: "single", status: "active", createdAt: "2026-07-15T10:00:00.000Z" },
    { id: "cust_estrevo_extra", contactId: "c_estrevo", name: "Estrevo", company: "Estrevo (Story Lens)", niche: "Serviços B2B", productName: "Serviço Adicional (Estrevo)", value: 50.00, type: "single", status: "active", createdAt: "2026-07-18T10:00:00.000Z" },
    // Paraná Ecoturismo (Marcio)
    { id: "cust_parana_site", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, type: "single", status: "active", createdAt: "2026-04-13T12:00:00.000Z" },
    { id: "cust_parana_update", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção e Atualização de Site", value: 500.00, type: "single", status: "active", createdAt: "2026-07-13T10:00:00.000Z" },
    { id: "cust_parana_maint", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual - R$ 20/mês)", value: 240.00, type: "yearly", status: "active", createdAt: "2026-07-13T12:00:00.000Z" },
    // Cromagraph
    { id: "cust_cromagraph_site", contactId: "c_cromagraph", name: "Cromagraph", company: "Cromagraph", niche: "Gráfica", productName: "Criação de Site Institucional", value: 400.00, type: "single", status: "active", createdAt: "2026-06-01T10:00:00.000Z" },
    // Gráfica Ariana
    { id: "cust_ariana_site", contactId: "c_ariana", name: "Gráfica Ariana", company: "Gráfica Ariana", niche: "Gráfica", productName: "Criação de Site Institucional", value: 400.00, type: "single", status: "active", createdAt: "2026-08-06T12:00:00.000Z" }
];

// 3. Invoices (Faturas com status Pago vs Pendente fiéis aos dados reais)
// Total Recebido Real = 400 (Story Lens) + 200 (César) + 200 (Estrevo) + 50 (Estrevo Extra) + 400 (Paraná Site) + 500 (Paraná Manut) + 400 (Cromagraph) + 200 (Ariana) = R$ 2.350,00
// Total Pendente Real = 200 (César) + 200 (Estrevo) + 240 (Paraná Anual) + 200 (Ariana) = R$ 840,00
env.invoices = [
    // Story Lens: 400 Pago
    { id: "FAT-STORYLENS-1", customerName: "Story Lens", company: "Story Lens", niche: "Serviços B2B", productName: "Criação de Site Institucional", value: 400.00, dueDate: "2026-05-15", status: "paid", notes: "100% Pago" },
    // César: 200 Pago + 200 Pendente
    { id: "FAT-CESAR-1", customerName: "César", company: "Site do César (Story Lens)", niche: "Serviços B2B", productName: "Criação de Site (Entrada 50%)", value: 200.00, dueDate: "2026-07-05", status: "paid", notes: "50% Entrada Pago" },
    { id: "FAT-CESAR-2", customerName: "César", company: "Site do César (Story Lens)", niche: "Serviços B2B", productName: "Criação de Site (Entrega 50%)", value: 200.00, dueDate: "2026-08-30", status: "pending", notes: "A receber este mês" },
    // Estrevo: 200 Pago + 200 Pendente + 50 Pago
    { id: "FAT-ESTREVO-1", customerName: "Estrevo", company: "Estrevo (Story Lens)", niche: "Serviços B2B", productName: "Criação de Site (Entrada 50%)", value: 200.00, dueDate: "2026-07-20", status: "paid", notes: "50% Entrada Pago" },
    { id: "FAT-ESTREVO-2", customerName: "Estrevo", company: "Estrevo (Story Lens)", niche: "Serviços B2B", productName: "Criação de Site (Entrega 50%)", value: 200.00, dueDate: "2026-08-25", status: "pending", notes: "A receber este mês" },
    { id: "FAT-ESTREVO-3", customerName: "Estrevo", company: "Estrevo (Story Lens)", niche: "Serviços B2B", productName: "Serviço Adicional", value: 50.00, dueDate: "2026-07-22", status: "paid", notes: "100% Pago" },
    // Paraná Ecoturismo: 400 Pago + 500 Pago + 240 Pendente
    { id: "FAT-PARANA-1", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, dueDate: "2026-04-15", status: "paid", notes: "100% Pago" },
    { id: "FAT-PARANA-2", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção e Atualização de Site", value: 500.00, dueDate: "2026-07-13", status: "paid", notes: "100% Pago" },
    { id: "FAT-PARANA-3", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual)", value: 240.00, dueDate: "2026-12-31", status: "pending", notes: "R$ 20/mês distribuído em 12 meses" },
    // Cromagraph: 400 Pago
    { id: "FAT-CROMAGRAPH-1", customerName: "Cromagraph", company: "Cromagraph", niche: "Gráfica", productName: "Criação de Site Institucional", value: 400.00, dueDate: "2026-06-10", status: "paid", notes: "100% Pago" },
    // Gráfica Ariana: 200 Pago + 200 Pendente
    { id: "FAT-ARIANA-1", customerName: "Gráfica Ariana", company: "Gráfica Ariana", niche: "Gráfica", productName: "Criação de Site Institucional (Entrada 50%)", value: 200.00, dueDate: "2026-08-07", status: "paid", notes: "50% Entrada Pago" },
    { id: "FAT-ARIANA-2", customerName: "Gráfica Ariana", company: "Gráfica Ariana", niche: "Gráfica", productName: "Criação de Site Institucional (Entrega 50%)", value: 200.00, dueDate: "2026-08-15", status: "pending", notes: "A receber na entrega" }
];

// 4. Contracts (Contratos reais)
env.contracts = [
    { id: "CONTR-STORYLENS-1", contactId: "c_storylens", proposalId: "PROP-SL1", clientName: "Story Lens", company: "Story Lens", productName: "Criação de Site Institucional", value: 400.00, recurrence: "single", startDate: "2026-05-10", endDate: "2026-06-10", status: "active" },
    { id: "CONTR-CESAR-1", contactId: "c_cesar", proposalId: "PROP-CS1", clientName: "César", company: "Site do César (Story Lens)", productName: "Criação de Site", value: 400.00, recurrence: "single", startDate: "2026-07-01", endDate: "2026-08-30", status: "active" },
    { id: "CONTR-ESTREVO-1", contactId: "c_estrevo", proposalId: "PROP-ES1", clientName: "Estrevo", company: "Estrevo (Story Lens)", productName: "Criação de Site + Adicional", value: 450.00, recurrence: "single", startDate: "2026-07-15", endDate: "2026-08-25", status: "active" },
    { id: "CONTR-PARANA-1", contactId: "c_parana_ecoturismo", proposalId: "PROP-PR1", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Criação & Manutenção de Site", value: 1140.00, recurrence: "yearly", startDate: "2026-04-13", endDate: "2027-04-13", status: "active" },
    { id: "CONTR-CROMAGRAPH-1", contactId: "c_cromagraph", proposalId: "PROP-CR1", clientName: "Cromagraph", company: "Cromagraph", productName: "Criação de Site Institucional", value: 400.00, recurrence: "single", startDate: "2026-06-01", endDate: "2026-07-01", status: "active" },
    { id: "CONTR-ARIANA-1", contactId: "c_ariana", proposalId: "PROP-AR1", clientName: "Gráfica Ariana", company: "Gráfica Ariana", productName: "Criação de Site Institucional", value: 400.00, recurrence: "single", startDate: "2026-08-06", endDate: "2026-08-15", status: "active" }
];

// 5. Upsells / Futuras Oportunidades (Necessidades Abertas dos Clientes)
env.upsellOpportunities = [
    {
        id: "upsell_ariana_ads",
        company: "Gráfica Ariana",
        contactName: "Gráfica Ariana",
        serviceName: "Gestão de Google Ads & Tráfego Pago",
        estimatedValue: 400.00,
        status: "open",
        notes: "Cliente com forte interesse para iniciar campanha no Google após a entrega do site."
    },
    {
        id: "upsell_cromagraph_ads",
        company: "Cromagraph",
        contactName: "Cromagraph",
        serviceName: "Gestão de Google Ads & SEO Local",
        estimatedValue: 500.00,
        status: "open",
        notes: "Site 100% concluído. Possibilidade de expansão para anúncios locais."
    }
];

// Save updated clean db.json
fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated db.json with exact real client financial numbers!');
