import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve DB path (use DATA_DIR environment variable for persistent volume support in Coolify)
const DATA_DIR = process.env.DATA_DIR || __dirname;
const DB_PATH = path.join(DATA_DIR, 'db.json');
const CONFIG_PATH = path.join(DATA_DIR, 'smtp_config.json');

app.use(express.json({ limit: '50mb' }));

// Middleware to normalize /crm routes to root routes
app.use((req, res, next) => {
    if (req.url.startsWith('/crm')) {
        req.url = req.url.replace(/^\/crm/, '') || '/';
    }
    next();
});

// API: Get CRM state
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
});

// API: Save CRM state
app.post('/api/state', (req, res) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(req.body, null, 2), 'utf8');
        res.json({ success: true });
    } catch (err) {
        console.error("Error writing db.json:", err);
        res.status(500).json({ error: "Erro ao salvar os dados no servidor." });
    }
});

// API: Pull all 100+ leads directly from Atendente Comercial local database
// Helper to normalize Brazilian phone numbers (removes +55 / 55 prefix if present)
function normalizePhone(p) {
    if (!p) return '';
    let digits = String(p).replace(/\D/g, '');
    if (digits.startsWith('55') && digits.length >= 12) {
        digits = digits.substring(2);
    }
    return digits;
}

function formatPhoneBR(p) {
    const digits = normalizePhone(p);
    if (!digits) return p || '';
    if (digits.length === 11) {
        return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
    }
    if (digits.length === 10) {
        return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
    }
    return p;
}

// Core lead synchronization engine between Atendente Comercial and Nexus CRM
function syncAtendenteLeadsCore(db, extraLeads = []) {
    const atendentePaths = [
        'C:/Users/Kamino/Documents/atendente comercial/data/db.json',
        'C:/Users/Kamino/Documents/atendente comercial/data/db_seed.json',
        path.join(DATA_DIR, 'atendente_db.json')
    ];

    let rawLeads = [];
    atendentePaths.forEach(p => {
        if (fs.existsSync(p)) {
            try {
                const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
                if (parsed.leads && Array.isArray(parsed.leads)) {
                    rawLeads.push(...parsed.leads);
                }
            } catch (e) {}
        }
    });

    if (Array.isArray(extraLeads) && extraLeads.length > 0) {
        rawLeads.push(...extraLeads);
    }

    if (!db.environments) db.environments = {};
    if (!db.environments.webco) db.environments.webco = {};
    if (!db.environments.webco.contacts) db.environments.webco.contacts = [];

    const contacts = db.environments.webco.contacts;
    let importedCount = 0;
    let updatedCount = 0;

    const statusMap = {
        'conversando': 'negotiating',
        'interessado': 'proposal',
        'qualificado': 'proposal',
        'proposta': 'proposal',
        'ganho': 'won',
        'fechado': 'won',
        'perdido': 'lost',
        'falhou': 'lost',
        'novo': 'lead',
        'aguardando': 'contacted'
    };

    rawLeads.forEach(lead => {
        const rawPhone = (lead.phone || lead.telefone || lead.whatsapp || '').trim();
        const normPhoneLead = normalizePhone(rawPhone);
        const rawEmail = (lead.email || lead.e_mail || '').trim().toLowerCase();

        // Extract Name & Company cleanly
        let name = (lead.name || lead.company || lead.fullName || '').trim();
        if (!name || name === 'Seu Nome' || name === 'Lead Agente') {
            name = (lead.fullName || lead.company || 'Empresa Agente').split('|')[0].trim();
        }
        if (name.includes('|')) name = name.split('|')[0].trim();

        let company = (lead.company || name).trim();
        if (company === 'Seu Nome' || company === 'Lead Agente') company = name;
        if (company.includes('|')) company = company.split('|')[0].trim();

        // Extract Nicho
        let nicho = (lead.nicho || lead.ramo || lead.categoria || '').trim();
        if (!nicho || nicho === 'Todos' || nicho.toLowerCase().includes('graf') || nicho.toLowerCase().includes('gráf')) {
            nicho = 'Gráfica';
        }

        const rawStatus = (lead.status || '').toLowerCase();
        let targetStatus = statusMap[rawStatus] || 'contacted';
        if (lead.humanTakeover) {
            targetStatus = 'negotiating';
        }

        // Projection: leads in negotiation / interested / proposal have R$ 400 projection
        const isHotOrInteresse = ['proposal', 'negotiating', 'won'].includes(targetStatus) ||
                                rawStatus.includes('interessad') ||
                                lead.humanTakeover;
        const leadValue = isHotOrInteresse ? 400.00 : 0.00;

        // Find existing contact by normalized phone, email or exact company name
        let existing = null;
        if (rawEmail) {
            existing = contacts.find(c => (c.email || '').toLowerCase() === rawEmail);
        }
        if (!existing && normPhoneLead.length >= 8) {
            existing = contacts.find(c => normalizePhone(c.phone) === normPhoneLead);
        }
        if (!existing && company && company !== 'Empresa Agente' && company !== 'Seu Nome') {
            existing = contacts.find(c => (c.company || '').toLowerCase() === company.toLowerCase());
        }

        if (existing) {
            let changed = false;
            if (company && (!existing.company || existing.company === 'Lead Agente')) {
                existing.company = company;
                changed = true;
            }
            if (name && (!existing.name || existing.name === 'Lead Agente')) {
                existing.name = name;
                changed = true;
            }
            if (rawEmail && !existing.email) {
                existing.email = rawEmail;
                changed = true;
            }
            if (normPhoneLead && !existing.phone) {
                existing.phone = formatPhoneBR(normPhoneLead);
                changed = true;
            }
            // If lead advanced on WhatsApp (e.g. became Interested, Negotiating or Human Takeover), upgrade status
            if (isHotOrInteresse && existing.status !== 'won') {
                existing.status = targetStatus;
                existing.value = 400.00;
                changed = true;
            }
            if (existing.value === undefined || isNaN(existing.value) || existing.value > 1000000) {
                existing.value = leadValue;
                changed = true;
            }

            if (changed) {
                if (!existing.timeline) existing.timeline = [];
                existing.timeline.push({
                    id: 'act_' + Date.now() + Math.random().toString(36).substring(2, 5),
                    type: 'note',
                    description: `🤖 Sincronização Agente Comercial: Lead atualizado via WhatsApp (${lead.status || 'Ativo'}). Projeção R$ 400.`,
                    timestamp: new Date().toISOString()
                });
                updatedCount++;
            }
        } else {
            // Do not import dummy placeholder 'Seu Nome' with test phone 5511999999999
            if (name === 'Seu Nome' && normPhoneLead === '11999999999') {
                return;
            }

            const newContact = {
                id: 'c_agente_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
                name: name,
                company: company,
                email: rawEmail,
                phone: formatPhoneBR(normPhoneLead),
                niche: nicho,
                status: targetStatus,
                value: leadValue,
                notes: lead.gatilho || lead.lossReason || (lead.logs && lead.logs[0]) || 'Lead importado do Agente Comercial AI',
                source: 'Agente Comercial',
                createdAt: lead.createdAt || new Date().toISOString(),
                timeline: [
                    {
                        id: 'act_init_' + Date.now(),
                        type: 'note',
                        description: `🤖 Lead importado do Agente Comercial AI (${lead.status || 'Contatado'}). Projeção R$ 400.`,
                        timestamp: new Date().toISOString()
                    }
                ]
            };
            contacts.push(newContact);
            importedCount++;
        }
    });

    // Sanitize any invalid lead values
    contacts.forEach(c => {
        c.value = sanitizeLeadValue(c.value);
    });

    return { importedCount, updatedCount, totalContacts: contacts.length };
}

app.post(['/api/sync-atendente-comercial', '/crm/api/sync-atendente-comercial'], (req, res) => {
    try {
        let db = { environments: { webco: { contacts: [] } } };
        if (fs.existsSync(DB_PATH)) {
            try { db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) || db; } catch (e) {}
        }

        const extraLeads = (req.body && Array.isArray(req.body)) ? req.body : [];
        const result = syncAtendenteLeadsCore(db, extraLeads);

        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

        res.json({
            success: true,
            message: `Busca no Agente Comercial concluída! ${result.importedCount} novos leads importados, ${result.updatedCount} atualizados. Total no CRM: ${result.totalContacts}`,
            importedCount: result.importedCount,
            updatedCount: result.updatedCount,
            totalContacts: result.totalContacts
        });
    } catch (err) {
        console.error("Error in sync-atendente-comercial:", err);
        res.status(500).json({ error: err.message || "Erro ao puxar leads do Agente Comercial." });
    }
});

// API Webhook: Receive leads directly from Agente Comercial AI
app.post(['/api/webhook/agente-comercial', '/api/agente-webhook', '/api/webhook-agente'], (req, res) => {
    try {
        // Support both single lead object (or webhook format { lead: { ... } }) and arrays
        let rawBody = req.body;
        let leads = [];
        if (Array.isArray(rawBody)) {
            leads = rawBody;
        } else if (rawBody && rawBody.lead) {
            leads = [rawBody.lead];
        } else if (rawBody && typeof rawBody === 'object') {
            leads = [rawBody];
        }

        if (!leads || leads.length === 0) {
            return res.status(400).json({ error: "Nenhum lead fornecido no payload." });
        }

        let db = { environments: { webco: { contacts: [] } } };
        if (fs.existsSync(DB_PATH)) {
            try { db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) || db; } catch (e) {}
        }

        if (!db.environments) db.environments = {};
        if (!db.environments.webco) db.environments.webco = {};
        if (!db.environments.webco.contacts) db.environments.webco.contacts = [];

        const contacts = db.environments.webco.contacts;
        let importedCount = 0;
        let updatedCount = 0;

        leads.forEach(lead => {
            const email = (lead.email || lead.e_mail || '').trim().toLowerCase();
            const phone = (lead.phone || lead.telefone || lead.whatsapp || '').trim();
            const phoneDigits = phone.replace(/\D/g, '');
            const company = (lead.company || lead.empresa || lead.fullName || '').trim();
            const name = (lead.name || lead.nome || lead.contato || company || 'Lead Agente').trim();

            let existing = null;
            if (email) existing = contacts.find(c => (c.email || '').toLowerCase() === email);
            if (!existing && phoneDigits.length >= 8) existing = contacts.find(c => (c.phone || '').replace(/\D/g, '') === phoneDigits);
            if (!existing && company && company !== 'Lead Agente') existing = contacts.find(c => (c.company || '').toLowerCase() === company.toLowerCase());

            const statusMap = {
                'lead': 'lead',
                'novo': 'lead',
                'contacted': 'contacted',
                'contatado': 'contacted',
                'aguardando': 'contacted',
                'aguardando resposta': 'contacted',
                'conversando': 'negotiating',
                'interessado': 'proposal',
                'interessado_previa': 'proposal',
                'aceite_previa': 'proposal',
                'pergunta_preco': 'proposal',
                'proposta enviada': 'proposal',
                'proposal': 'proposal',
                'proposta': 'proposal',
                'qualificado': 'proposal',
                'negotiating': 'negotiating',
                'em negociacao': 'negotiating',
                'quer_fechar': 'negotiating',
                'fechado': 'won',
                'won': 'won',
                'ganho': 'won',
                'perdido': 'lost',
                'rejeicao': 'lost',
                'lost': 'lost',
                'falhou': 'lost'
            };

            const rawStatus = (lead.status || '').toLowerCase().trim();
            const targetStatus = statusMap[rawStatus] || 'proposal';
            const leadValue = Number(lead.value || lead.valor) || 400.00;

            if (existing) {
                if (email && !existing.email) existing.email = email;
                if (phone && !existing.phone) existing.phone = phone;
                if (company && (!existing.company || existing.company === 'Lead Agente')) existing.company = company;
                if (name && (!existing.name || existing.name === 'Lead Agente')) existing.name = name;
                existing.status = targetStatus;
                if (!existing.value || existing.value === 0) existing.value = leadValue;
                existing.source = 'Agente Comercial';
                if (!existing.timeline) existing.timeline = [];
                existing.timeline.push({
                    id: 'act_' + Date.now() + Math.random().toString(36).substring(2, 5),
                    type: 'note',
                    description: `🤖 Atualização Agente Comercial: Status alterado para [${targetStatus}] (${lead.notes || lead.observacoes || 'Interação no WhatsApp'})`,
                    timestamp: new Date().toISOString()
                });
                updatedCount++;
            } else {
                const newContact = {
                    id: 'c_agente_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
                    name: name,
                    company: company || name,
                    email: email,
                    phone: phone ? (phone.startsWith('55') ? phone.replace(/^55/, '') : phone) : '',
                    niche: lead.niche || lead.ramo || lead.nicho || 'Gráfica',
                    status: targetStatus,
                    value: leadValue,
                    notes: lead.notes || lead.observacoes || lead.gatilho || 'Interessado no WhatsApp (Agente Comercial AI)',
                    source: 'Agente Comercial',
                    createdAt: new Date().toISOString(),
                    timeline: [
                        {
                            id: 'act_init_' + Date.now(),
                            type: 'note',
                            description: `🤖 Lead importado do Agente Comercial AI (${targetStatus}) - Projeção de ${leadValue}.`,
                            timestamp: new Date().toISOString()
                        }
                    ]
                };
                contacts.push(newContact);
                importedCount++;
            }
        });

        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

        res.json({
            success: true,
            message: `Sincronização com o Agente Comercial concluída! ${importedCount} novos leads criados, ${updatedCount} atualizados.`,
            importedCount,
            updatedCount
        });
    } catch (err) {
        console.error("Error in webhook agente-comercial:", err);
        res.status(500).json({ error: err.message || "Erro ao sincronizar com Agente Comercial." });
    }
});

// API: Get SMTP Configuration
app.get('/api/smtp-config', (req, res) => {
    if (fs.existsSync(CONFIG_PATH)) {
        try {
            const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
            return res.json({
                host: data.host || 'smtp.hostinger.com',
                port: data.port || 465,
                secure: data.secure !== undefined ? data.secure : true,
                user: data.user || '',
                fromName: data.fromName || '',
                hasPassword: !!data.pass
            });
        } catch (e) {
            console.error("Error reading smtp_config.json:", e);
        }
    }
    res.json({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        user: '',
        fromName: '',
        hasPassword: false
    });
});

// API: Save SMTP Configuration
app.post('/api/smtp-config', (req, res) => {
    try {
        const { host, port, secure, user, pass, fromName } = req.body;
        let existing = {};
        if (fs.existsSync(CONFIG_PATH)) {
            try { existing = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); } catch (e) {}
        }
        const updated = {
            host: host ? host.trim() : 'smtp.hostinger.com',
            port: Number(port) || 465,
            secure: secure !== undefined ? Boolean(secure) : true,
            user: user ? user.trim() : '',
            pass: pass ? pass.trim() : (existing.pass || ''),
            fromName: fromName ? fromName.trim() : ''
        };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf8');
        res.json({ success: true, message: "Configuração SMTP salva com sucesso!" });
    } catch (err) {
        console.error("Error saving smtp_config.json:", err);
        res.status(500).json({ error: "Erro ao salvar configuração SMTP." });
    }
});

// API: Test SMTP Connection
app.post('/api/test-smtp', async (req, res) => {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            return res.status(400).json({ error: "Configuração SMTP não encontrada." });
        }
        const smtpConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        if (!smtpConfig.user || !smtpConfig.pass) {
            return res.status(400).json({ error: "E-mail ou senha do SMTP não configurados." });
        }
        const transporter = nodemailer.createTransport({
            host: smtpConfig.host || 'smtp.hostinger.com',
            port: Number(smtpConfig.port) || 465,
            secure: smtpConfig.secure !== undefined ? Boolean(smtpConfig.secure) : true,
            auth: {
                user: smtpConfig.user,
                pass: smtpConfig.pass
            },
            tls: { rejectUnauthorized: false }
        });

        await transporter.verify();
        res.json({ success: true, message: "Conexão com a Hostinger autenticada e validada com sucesso!" });
    } catch (err) {
        console.error("SMTP verify error:", err);
        res.status(500).json({ error: err.message || "Falha ao conectar com o servidor SMTP da Hostinger." });
    }
});

// API: Send Email Direct via Hostinger SMTP
app.post('/api/send-email', async (req, res) => {
    try {
        const { to, subject, text, html, attachments } = req.body;

        if (!to) {
            return res.status(400).json({ error: "E-mail do destinatário é obrigatório." });
        }

        if (!fs.existsSync(CONFIG_PATH)) {
            return res.status(400).json({ error: "Configuração de e-mail SMTP não encontrada. Por favor, configure os dados da Hostinger no menu E-mail / SMTP." });
        }

        const smtpConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        if (!smtpConfig.user || !smtpConfig.pass) {
            return res.status(400).json({ error: "Usuário e senha do SMTP Hostinger não configurados." });
        }

        const transporter = nodemailer.createTransport({
            host: smtpConfig.host || 'smtp.hostinger.com',
            port: Number(smtpConfig.port) || 465,
            secure: smtpConfig.secure !== undefined ? Boolean(smtpConfig.secure) : true,
            auth: {
                user: smtpConfig.user,
                pass: smtpConfig.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const fromAddress = smtpConfig.fromName 
            ? `"${smtpConfig.fromName}" <${smtpConfig.user}>`
            : smtpConfig.user;

        const mailOptions = {
            from: fromAddress,
            to,
            bcc: smtpConfig.user, // Auto-copy to Hostinger mailbox so dispatches appear in Webmail
            subject: subject || '(Sem Assunto)',
            text,
            html: html || (text ? text.replace(/\n/g, '<br>') : '')
        };

        if (!mailOptions.attachments) mailOptions.attachments = [];
        
        if (attachments && Array.isArray(attachments) && attachments.length > 0) {
            attachments.forEach(att => {
                if (att.data && att.data.includes(';base64,')) {
                    const base64Data = att.data.split(';base64,').pop();
                    mailOptions.attachments.push({
                        filename: att.name,
                        content: Buffer.from(base64Data, 'base64')
                    });
                } else if (att.data) {
                    mailOptions.attachments.push({
                        filename: att.name,
                        path: att.data
                    });
                }
            });
        }

        // Attach WEBCO Agency inline logo if CID logo-webco is referenced
        const logoPath = path.join(__dirname, 'dist', 'logo-webco.png');
        if (fs.existsSync(logoPath) && mailOptions.html && mailOptions.html.includes('logo-webco')) {
            mailOptions.attachments.push({
                filename: 'logo-webco.png',
                path: logoPath,
                cid: 'logo-webco'
            });
        }

        const info = await transporter.sendMail(mailOptions);
        console.log("Email enviado com sucesso via Hostinger:", info.messageId);

        res.json({ success: true, messageId: info.messageId });
    } catch (err) {
        console.error("Error sending email via Nodemailer:", err);
        res.status(500).json({ error: err.message || "Erro ao disparar e-mail via servidor Hostinger." });
    }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

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
        let db = { environments: { webco: { contacts: [] } } };
        if (fs.existsSync(DB_PATH)) {
            try { db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) || db; } catch (e) {}
        }

        const result = syncAtendenteLeadsCore(db);
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        console.log(`[AUTO-SYNC] Sync completed: ${result.importedCount} new imported, ${result.updatedCount} updated. Total: ${result.totalContacts} contacts.`);
    } catch (err) {
        console.error('[AUTO-SYNC] Error during scheduled sync:', err);
    }
}

// Run auto sync on server start + schedule every 2 hours (12x a day)
setTimeout(runAutoSyncWhatsAppLeads, 5000);
setInterval(runAutoSyncWhatsAppLeads, 2 * 60 * 60 * 1000);
