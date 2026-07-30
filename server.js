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

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// API: Get CRM state
app.get('/api/state', (req, res) => {
    if (fs.existsSync(DB_PATH)) {
        try {
            const data = fs.readFileSync(DB_PATH, 'utf8');
            return res.json(JSON.parse(data));
        } catch (err) {
            console.error("Error reading db.json:", err);
            return res.status(500).json({ error: "Erro ao ler o banco de dados." });
        }
    }
    // If no db.json exists, return null so client uses default data
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
            subject: subject || '(Sem Assunto)',
            text,
            html: html || (text ? text.replace(/\n/g, '<br>') : '')
        };

        if (attachments && Array.isArray(attachments) && attachments.length > 0) {
            mailOptions.attachments = attachments.map(att => {
                if (att.data && att.data.includes(';base64,')) {
                    const base64Data = att.data.split(';base64,').pop();
                    return {
                        filename: att.name,
                        content: Buffer.from(base64Data, 'base64')
                    };
                }
                return {
                    filename: att.name,
                    path: att.data
                };
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

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
