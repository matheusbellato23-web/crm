const fs = require('fs');

// 1. Update server.js: Add Value Sanitizer + Automatic 2-Hour Auto-Sync Scheduler
let serverJs = fs.readFileSync('server.js', 'utf8');

const autoSyncRoutine = `
// ============================================================
// AUTOMATIC AGENT / WHATSAPP SYNC SCHEDULER (12x per day)
// ============================================================
function sanitizeLeadValue(val) {
    let num = Number(val);
    if (isNaN(num) || !isFinite(num) || num > 1000000 || num < 0) {
        return 0; // Cap absurd values > R$ 1 Million to R$ 0
    }
    return num;
}

function runAutoSyncWhatsAppLeads() {
    console.log('[AUTO-SYNC] Running scheduled 2-hour WhatsApp/Agent lead sync (12x/day)...');
    try {
        const atendentePaths = [
            'C:/Users/Kamino/Documents/atendente comercial/data/db.json',
            'C:/Users/Kamino/Documents/atendente comercial/data/db_seed.json',
            path.join(DATA_DIR, 'atendente_db.json')
        ];

        let db = { environments: { webco: { contacts: [] } } };
        if (fs.existsSync(DB_PATH)) {
            try { db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) || db; } catch (e) {}
        }
        if (!db.environments) db.environments = {};
        if (!db.environments.webco) db.environments.webco = {};
        if (!db.environments.webco.contacts) db.environments.webco.contacts = [];

        // Always sanitize all existing contact values
        db.environments.webco.contacts.forEach(c => {
            c.value = sanitizeLeadValue(c.value);
        });

        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        console.log('[AUTO-SYNC] Contact values sanitized and state saved.');
    } catch (err) {
        console.error('[AUTO-SYNC] Error during scheduled sync:', err);
    }
}

// Run auto sync on server start + schedule every 2 hours (12x a day)
setTimeout(runAutoSyncWhatsAppLeads, 5000);
setInterval(runAutoSyncWhatsAppLeads, 2 * 60 * 60 * 1000);
`;

if (!serverJs.includes('runAutoSyncWhatsAppLeads')) {
    serverJs += autoSyncRoutine;
    fs.writeFileSync('server.js', serverJs, 'utf8');
    console.log('Appended autoSyncRoutine to server.js');
}

// 2. Update src/app.js: Add Value Sanitizer to loadState / getEnv / renderPipeline + 10-minute client polling
let appJs = fs.readFileSync('src/app.js', 'utf8');

const sanitizerHelper = `\n// Lead Value Sanitizer (Prevents absurd numbers > R$ 1M or phone numbers in value field)
const sanitizeLeadValue = (val) => {
    let num = Number(val);
    if (isNaN(num) || !isFinite(num) || num > 1000000 || num < 0) {
        return 0;
    }
    return num;
};\n`;

if (!appJs.includes('sanitizeLeadValue')) {
    const formatCurrencyIdx = appJs.indexOf('const formatCurrency =');
    if (formatCurrencyIdx !== -1) {
        appJs = appJs.substring(0, formatCurrencyIdx) + sanitizerHelper + appJs.substring(formatCurrencyIdx);
        console.log('Added sanitizeLeadValue helper to app.js');
    }
}

// Update getEnv or loadState to sanitize all contact values
const oldGetEnv = `function getEnv() {`;
const newGetEnv = `function getEnv() {
    const env = state.environments[state.currentEnv] || state.environments.webco;
    if (env && env.contacts) {
        env.contacts.forEach(c => {
            if (c.value > 1000000 || isNaN(c.value)) {
                c.value = 0;
            }
        });
    }
    return env;
};
function _getEnvOriginal() {`;

if (appJs.includes(oldGetEnv) && !appJs.includes('_getEnvOriginal')) {
    appJs = appJs.replace(oldGetEnv, newGetEnv);
    console.log('Updated getEnv in app.js with automatic contact value sanitization!');
}

// Append 10-minute auto refresh polling to app.js
const autoClientPolling = `\n\n// Automatic Background Polling for WhatsApp & Lead Sync Updates (Every 10 Minutes)
setInterval(() => {
    if (typeof loadState === 'function') {
        console.log('[CLIENT AUTO-POLL] Syncing state from server...');
        loadState().then(() => {
            if (typeof renderAll === 'function') renderAll();
        });
    }
}, 10 * 60 * 1000);\n`;

if (!appJs.includes('[CLIENT AUTO-POLL]')) {
    appJs += autoClientPolling;
    fs.writeFileSync('src/app.js', appJs, 'utf8');
    console.log('Appended autoClientPolling to app.js');
}

console.log('Sanitizer & Auto-Sync setup complete!');
