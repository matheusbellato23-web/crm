const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const startIdx = code.indexOf("// API: Get CRM state");
const endIdx = code.indexOf("// API: Save CRM state");

if (startIdx !== -1 && endIdx !== -1) {
    const newGetState = `// API: Get CRM state
app.get('/api/state', (req, res) => {
    if (fs.existsSync(DB_PATH)) {
        try {
            const data = fs.readFileSync(DB_PATH, 'utf8');
            const parsed = JSON.parse(data);
            if (parsed && parsed.environments && parsed.environments.webco && parsed.environments.webco.contacts && parsed.environments.webco.contacts.length > 0) {
                return res.json(parsed);
            }
        } catch (err) {
            console.error("Error reading DB_PATH db.json:", err);
        }
    }
    const localDbPath = path.join(__dirname, 'db.json');
    if (fs.existsSync(localDbPath)) {
        try {
            const data = fs.readFileSync(localDbPath, 'utf8');
            return res.json(JSON.parse(data));
        } catch (e) {}
    }
    res.json(null);
});\n\n`;

    code = code.substring(0, startIdx) + newGetState + code.substring(endIdx);
    fs.writeFileSync('server.js', code, 'utf8');
    console.log('Successfully updated GET /api/state in server.js');
} else {
    console.error('Indices error:', startIdx, endIdx);
}
