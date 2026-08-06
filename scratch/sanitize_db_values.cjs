const fs = require('fs');

function sanitizeValue(v) {
    let num = Number(v);
    if (isNaN(num) || !isFinite(num) || num > 1000000 || num < 0) {
        return 400.00; // Reset absurd phone-like values to standard 400.00
    }
    return num;
}

let db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

if (db.environments && db.environments.webco && db.environments.webco.contacts) {
    let sanitizedCount = 0;
    db.environments.webco.contacts.forEach(c => {
        const oldVal = c.value;
        c.value = sanitizeValue(c.value);
        if (oldVal !== c.value) {
            sanitizedCount++;
            console.log(`Sanitized contact ${c.name} (${c.company}): ${oldVal} -> ${c.value}`);
        }
    });
    console.log(`Total contacts sanitized in db.json: ${sanitizedCount}`);
    fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
}
