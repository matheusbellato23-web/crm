const fs = require('fs');

let db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

if (db.environments && db.environments.webco && db.environments.webco.proposals) {
    const prop = db.environments.webco.proposals.find(p => p.id === "prop_ariana_2026" || (p.productName || '').includes('Ariana'));
    if (prop) {
        prop.pixKey = "(11) 97570-2321";
        prop.paymentTerms = "50% de entrada no início (R$ 200,00) e 50% na entrega final (R$ 200,00). Chave Pix: (11) 97570-2321";
        prop.notes = "Proposta criada por Matheus Bellato da WEBCO Agency. Chave Pix: (11) 97570-2321. Prazo de entrega em até 5 dias corridos.";
        fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
        console.log('Updated db.json with new Pix key (11) 97570-2321!');
    }
}
