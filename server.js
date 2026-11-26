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

const AGENTE_STATUS_MAP = {
    'lead': 'lead',
    'novo': 'lead',
    'nao contatado': 'lead',
    'não contatado': 'lead',
    'mensagem enviada': 'contacted',
    'msg enviada': 'contacted',
    'contacted': 'contacted',
    'contatado': 'contacted',
    'aguardando': 'contacted',
    'aguardando resposta': 'contacted',
    'conversando': 'negotiating',
    'negociando': 'negotiating',
    'em negociacao': 'negotiating',
    'em negociação': 'negotiating',
    'negotiating': 'negotiating',
    'quer_fechar': 'negotiating',
    'interessado': 'interested',
    'interesse': 'interested',
    'interessado_previa': 'interested',
    'qualificado': 'proposal',
    'proposta': 'proposal',
    'proposta enviada': 'proposal',
    'proposal': 'proposal',
    'aceite_previa': 'proposal',
    'pergunta_preco': 'proposal',
    'fechado': 'won',
    'won': 'won',
    'ganho': 'won',
    'perdido': 'lost',
    'rejeicao': 'lost',
    'rejeição': 'lost',
    'lost': 'lost',
    'falhou': 'lost',
    'sem interesse': 'lost'
};

function resolveOriginSource(lead, existingSource = '') {
    const rawOrigin = (lead.origin || '').trim();
    const rawLower = rawOrigin.toLowerCase();
    if (rawLower.includes('indicac') || rawLower.includes('indicaç') || (lead.referredBy && String(lead.referredBy).trim())) {
        return lead.referredBy ? `Indicação (${String(lead.referredBy).trim()})` : 'Indicação';
    }
    if (existingSource && !['Agente Comercial', 'Prospecção Ativa (Maps)', ''].includes(existingSource)) {
        return existingSource;
    }
    if (rawOrigin) return rawOrigin;
    return 'Agente Comercial';
}

async function fetchLeadsFromAtendenteAPI() {
    const baseUrl = (process.env.ATENDENTE_API_URL || 'https://webcolabs.com.br/app/atendente').replace(/\/$/, '');
    const username = (process.env.ATENDENTE_USER || '').trim();
    const password = (process.env.ATENDENTE_PASS || '').trim();
    if (!username || !password) return [];

    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12000);
        const loginRes = await fetch(`${baseUrl}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            signal: controller.signal
        });
        if (!loginRes.ok) {
            clearTimeout(timer);
            return [];
        }
        const loginData = await loginRes.json();
        if (!loginData?.token) {
            clearTimeout(timer);
            return [];
        }
        const leadsRes = await fetch(`${baseUrl}/api/leads`, {
            headers: { Authorization: `Bearer ${loginData.token}` },
            signal: controller.signal
        });
        clearTimeout(timer);
        if (!leadsRes.ok) return [];
        const data = await leadsRes.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.warn('[CRM Sync] Falha ao buscar leads via HTTP do Agente Comercial:', e.message);
        return [];
    }
}

// Core lead synchronization engine between Atendente Comercial and Nexus CRM
function syncAtendenteLeadsCore(db, extraLeads = []) {
    const atendentePaths = [
        'C:/Users/Gandhi/Documents/atendentecomercial/data/db.json',
        'C:/Users/Gandhi/Documents/atendentecomercial/data/db_seed.json',
        path.join(DATA_DIR, 'atendente_db.json')
    ];

    let rawLeads = [];
    if (Array.isArray(extraLeads) && extraLeads.length > 0) {
        rawLeads.push(...extraLeads);
    } else {
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
    }

    if (!db.environments) db.environments = {};
    if (!db.environments.webco) db.environments.webco = {};
    if (!db.environments.webco.contacts) db.environments.webco.contacts = [];

    const contacts = db.environments.webco.contacts;
    let importedCount = 0;
    let updatedCount = 0;

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

        let nicho = (lead.nicho || lead.ramo || lead.categoria || '').trim();
        if (!nicho || nicho === 'Todos' || nicho.toLowerCase().includes('graf') || nicho.toLowerCase().includes('gráf')) {
            nicho = 'Gráfica';
        }

        const rawStatus = (lead.status || '').toLowerCase().trim();
        let targetStatus = AGENTE_STATUS_MAP[rawStatus] || 'contacted';
        if (lead.humanTakeover && !['won', 'lost'].includes(targetStatus)) {
            targetStatus = 'negotiating';
        } else if (rawStatus.includes('interessad') || rawStatus.includes('interesse')) {
            targetStatus = 'interested';
        }

        const isHotOrInteresse = ['interested', 'proposal', 'negotiating', 'won', 'lost'].includes(targetStatus) || lead.humanTakeover;

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
            const nextSource = resolveOriginSource(lead, existing.source);
            if (nextSource !== existing.source) {
                existing.source = nextSource;
                changed = true;
            }
            if (lead.referredBy && !existing.referredBy) existing.referredBy = lead.referredBy;
            if (lead.closeReason && !existing.winReason) existing.winReason = lead.closeReason;
            if (lead.lossReason && !existing.lossReason) existing.lossReason = lead.lossReason;
            if (lead.bairro && !existing.bairro) existing.bairro = lead.bairro;

            if (isHotOrInteresse && existing.status !== 'won') {
                if (existing.status !== targetStatus) {
                    existing.status = targetStatus;
                    changed = true;
                }
            }
            if (existing.value === undefined || isNaN(existing.value) || existing.value > 1000000) {
                existing.value = 0.00;
                changed = true;
            }

            if (changed) {
                if (!existing.timeline) existing.timeline = [];
                existing.timeline.push({
                    id: 'act_' + Date.now() + Math.random().toString(36).substring(2, 5),
                    type: 'note',
                    description: `🤖 Sincronização Agente Comercial: Status [${lead.status || targetStatus}]${existing.source ? ` • Origem: ${existing.source}` : ''}.`,
                    timestamp: new Date().toISOString()
                });
                updatedCount++;
            }
        } else {
            if (name === 'Seu Nome' && normPhoneLead === '11999999999') {
                return;
            }
            const resolvedSource = resolveOriginSource(lead, '');
            const newContact = {
                id: 'c_agente_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
                name: name,
                company: company,
                email: rawEmail,
                phone: formatPhoneBR(normPhoneLead),
                niche: nicho,
                status: targetStatus,
                value: Number(lead.closeValue) || 0.00,
                notes: lead.closeReason || lead.lossReason || lead.gatilho || (lead.logs && lead.logs[0]) || 'Lead importado do Agente Comercial AI',
                source: resolvedSource,
                referredBy: lead.referredBy || '',
                winReason: lead.closeReason || '',
                lossReason: lead.lossReason || '',
                bairro: lead.bairro || '',
                createdAt: lead.createdAt || new Date().toISOString(),
                timeline: [
                    {
                        id: 'act_init_' + Date.now(),
                        type: 'note',
                        description: `🤖 Lead importado do Agente Comercial (${lead.status || 'Novo'}) • Origem: ${resolvedSource}.`,
                        timestamp: new Date().toISOString()
                    }
                ]
            };
            contacts.push(newContact);
            importedCount++;
        }
    });

    contacts.forEach(c => {
        c.value = sanitizeLeadValue(c.value);
    });

    return { importedCount, updatedCount, totalContacts: contacts.length };
}

app.post(['/api/sync-atendente-comercial', '/crm/api/sync-atendente-comercial'], async (req, res) => {
    try {
        let db = { environments: { webco: { contacts: [] } } };
        if (fs.existsSync(DB_PATH)) {
            try { db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) || db; } catch (e) {}
        }

        let extraLeads = (req.body && Array.isArray(req.body)) ? req.body : [];
        if (extraLeads.length === 0) {
            const remoteLeads = await fetchLeadsFromAtendenteAPI();
            if (remoteLeads.length > 0) {
                extraLeads = remoteLeads;
            }
        }
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

// API: Reset pipeline/contacts estimated values
app.post(['/api/contacts/reset-values', '/crm/api/contacts/reset-values'], (req, res) => {
    try {
        let db = { environments: { webco: { contacts: [] } } };
        if (fs.existsSync(DB_PATH)) {
            try { db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) || db; } catch (e) {}
        }
        const { scope = 'negotiating' } = req.body || {};
        const contacts = db.environments?.webco?.contacts || [];
        let count = 0;

        contacts.forEach(c => {
            if (scope === 'negotiating' && (c.status === 'negotiating' || c.status === 'proposal' || c.status === 'interested')) {
                c.value = 0.00;
                count++;
            } else if (scope === 'all_open' && c.status !== 'won') {
                c.value = 0.00;
                count++;
            } else if (scope === 'reset_stages' && (c.status === 'negotiating' || c.status === 'proposal' || c.status === 'interested')) {
                c.value = 0.00;
                c.status = 'lead';
                count++;
            } else if (scope === 'all') {
                c.value = 0.00;
                count++;
            }
        });

        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        res.json({ success: true, count, message: `${count} leads foram zerados com sucesso!` });
    } catch (err) {
        console.error("Error resetting contact values:", err);
        res.status(500).json({ error: err.message });
    }
});

// API Webhook: Receive leads directly from Agente Comercial AI
app.post(['/api/webhook/agente-comercial', '/api/agente-webhook', '/api/webhook-agente'], (req, res) => {
    try {
        let rawBody = req.body;
        const webhookEvent = rawBody?.event || 'lead_sync';
        const webhookMeta = rawBody?.meta || {};
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

        if (webhookEvent === 'test' || (leads.length === 1 && leads[0]?.id === 'test_lead_999')) {
            return res.json({ success: true, testOk: true, message: 'Webhook CRM validado com sucesso (sem poluir a base).' });
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
            const phoneDigits = normalizePhone(phone);
            const company = (lead.company || lead.empresa || lead.fullName || '').trim();
            const name = (lead.name || lead.nome || lead.contato || company || 'Lead Agente').trim();

            let existing = null;
            if (email) existing = contacts.find(c => (c.email || '').toLowerCase() === email);
            if (!existing && phoneDigits.length >= 8) existing = contacts.find(c => normalizePhone(c.phone) === phoneDigits);
            if (!existing && company && company !== 'Lead Agente') existing = contacts.find(c => (c.company || '').toLowerCase() === company.toLowerCase());

            const rawStatus = (lead.status || webhookMeta.status || '').toLowerCase().trim();
            const targetStatus = AGENTE_STATUS_MAP[rawStatus] || 'contacted';
            const leadValue = Number(lead.closeValue || lead.value || lead.valor || webhookMeta.value) || 0;
            const resolvedSource = resolveOriginSource(lead, existing?.source || '');

            const incomingMsgText = webhookMeta.message ? String(webhookMeta.message).trim() : '';
            const timelineEntryText = webhookEvent === 'lead_message_received' && incomingMsgText
                ? `💬 Cliente: "${incomingMsgText}"`
                : (webhookEvent === 'lead_message_sent' && incomingMsgText
                    ? `🤖 Atendente: "${incomingMsgText}"`
                    : `🤖 Agente Comercial (${targetStatus}): ${lead.closeReason || lead.lossReason || lead.notes || webhookMeta.notes || 'Atualização de etapa'}`);

            if (existing) {
                if (email && !existing.email) existing.email = email;
                if (phone && !existing.phone) existing.phone = formatPhoneBR(phoneDigits);
                if (company && (!existing.company || existing.company === 'Lead Agente')) existing.company = company;
                if (name && (!existing.name || existing.name === 'Lead Agente')) existing.name = name;

                // Nunca sobrescreve estágio 'won' ou status se for apenas evento de ausência automática
                if (existing.status !== 'won' && webhookMeta.interesse !== 'AUTO_REPLY_AUSENCIA') {
                    existing.status = targetStatus;
                }
                if (leadValue > 0 && (!existing.value || existing.value === 0)) existing.value = leadValue;
                existing.source = resolvedSource;
                if (lead.referredBy) existing.referredBy = lead.referredBy;
                if (lead.closeReason) existing.winReason = lead.closeReason;
                if (lead.lossReason) existing.lossReason = lead.lossReason;
                if (lead.bairro && !existing.bairro) existing.bairro = lead.bairro;

                if (!existing.timeline) existing.timeline = [];
                const lastDesc = existing.timeline[existing.timeline.length - 1]?.description;
                if (lastDesc !== timelineEntryText) {
                    existing.timeline.push({
                        id: 'act_' + Date.now() + Math.random().toString(36).substring(2, 5),
                        type: webhookEvent.includes('message') ? 'note' : 'note',
                        description: timelineEntryText,
                        timestamp: new Date().toISOString()
                    });
                }
                updatedCount++;
            } else {
                const newContact = {
                    id: 'c_agente_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
                    name: name,
                    company: company || name,
                    email: email,
                    phone: formatPhoneBR(phoneDigits),
                    niche: lead.niche || lead.ramo || lead.nicho || 'Gráfica',
                    status: targetStatus,
                    value: leadValue || 400.00,
                    notes: lead.closeReason || lead.lossReason || lead.notes || lead.observacoes || lead.gatilho || 'Lead recebido pelo Agente Comercial AI',
                    source: resolvedSource,
                    referredBy: lead.referredBy || '',
                    winReason: lead.closeReason || '',
                    lossReason: lead.lossReason || '',
                    bairro: lead.bairro || '',
                    createdAt: lead.createdAt || new Date().toISOString(),
                    timeline: [
                        {
                            id: 'act_init_' + Date.now(),
                            type: 'note',
                            description: `${timelineEntryText} • Origem: ${resolvedSource}.`,
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

async function runAutoSyncWhatsAppLeads() {
    console.log('[AUTO-SYNC] Running scheduled 2-hour WhatsApp/Agent lead sync (12x/day)...');
    try {
        let db = { environments: { webco: { contacts: [] } } };
        if (fs.existsSync(DB_PATH)) {
            try { db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) || db; } catch (e) {}
        }

        const remoteLeads = await fetchLeadsFromAtendenteAPI();
        const result = syncAtendenteLeadsCore(db, remoteLeads);
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        console.log(`[AUTO-SYNC] Sync completed: ${result.importedCount} new imported, ${result.updatedCount} updated. Total: ${result.totalContacts} contacts.`);
    } catch (err) {
        console.error('[AUTO-SYNC] Error during scheduled sync:', err);
    }
}

// Run auto sync on server start + schedule every 2 hours (12x a day)
setTimeout(runAutoSyncWhatsAppLeads, 5000);
setInterval(runAutoSyncWhatsAppLeads, 2 * 60 * 60 * 1000);
