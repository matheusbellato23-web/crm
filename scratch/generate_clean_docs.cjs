const fs = require('fs');
const path = require('path');

const downloadsDir = path.join(process.env.USERPROFILE || 'C:/Users/Kamino', 'Downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
}

// Read logo image as Base64 if available
let logoBase64 = '';
const logoPath = path.join(__dirname, 'dist', 'logo-webco.png');
if (fs.existsSync(logoPath)) {
    logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
}

const htmlDocument = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Proposta Comercial - Gráfica Ariana - WEBCO Agency</title>
    <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; background: #ffffff; padding: 40px; margin: 0 auto; max-width: 800px; line-height: 1.6; }
        .header-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #4F46E5; padding-bottom: 20px; margin-bottom: 30px; }
        .logo-img { max-width: 160px; height: auto; }
        .doc-type { font-size: 12px; font-weight: 700; color: #4F46E5; text-transform: uppercase; letter-spacing: 0.1em; background: rgba(79,70,229,0.08); padding: 6px 14px; border-radius: 99px; }
        .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; }
        .subtitle { font-size: 14px; color: #64748b; margin: 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 30px; }
        .info-item { font-size: 13.5px; }
        .info-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px; }
        .info-val { font-weight: 600; color: #0f172a; }
        .section-title { font-size: 16px; font-weight: 700; color: #0f172a; border-left: 4px solid #4F46E5; padding-left: 10px; margin: 30px 0 14px; }
        ul.scope-list { padding-left: 20px; margin: 0 0 30px 0; }
        ul.scope-list li { margin-bottom: 8px; font-size: 14px; color: #334155; }
        table.price-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        table.price-table th { background: #4F46E5; color: #ffffff; text-align: left; padding: 12px 16px; font-size: 13px; font-weight: 700; text-transform: uppercase; }
        table.price-table td { padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .payment-box { background: #f0fdf4; border: 1.5px solid #22c55e; border-radius: 10px; padding: 20px; margin-bottom: 30px; }
        .payment-title { font-size: 15px; font-weight: 700; color: #15803d; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px; }
        .pix-key { font-family: monospace; font-size: 16px; font-weight: 700; color: #166534; background: #ffffff; padding: 6px 12px; border-radius: 6px; border: 1px solid #bbf7d0; display: inline-block; margin-top: 6px; }
        .footer { text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="header-bar">
        <div>
            ${logoBase64 ? `<img src="${logoBase64}" class="logo-img" alt="WEBCO Agency">` : `<h2 style="color:#4F46E5;margin:0;">WEBCO Agency</h2>`}
        </div>
        <span class="doc-type">Proposta Comercial</span>
    </div>

    <h1 class="title">Criação de Site Institucional Profissional</h1>
    <p class="subtitle">Proposta preparada especialmente para a Gráfica Ariana</p>

    <div class="info-grid">
        <div class="info-item">
            <span class="info-label">Cliente / Razão Social</span>
            <span class="info-val">Gráfica Ariana</span>
        </div>
        <div class="info-item">
            <span class="info-label">Responsável Comercial</span>
            <span class="info-val">Matheus Bellato (WEBCO Agency)</span>
        </div>
        <div class="info-item">
            <span class="info-label">Prazo de Entrega</span>
            <span class="info-val" style="color:#4F46E5; font-weight:700;">Até 5 (cinco) dias corridos</span>
        </div>
        <div class="info-item">
            <span class="info-label">Data & Validade</span>
            <span class="info-val">06/08/2026 • Validade: 15 dias</span>
        </div>
    </div>

    <div class="section-title">Escopo do Projeto & Entregáveis</div>
    <ul class="scope-list">
        <li><strong>Desenvolvimento do Site Profissional:</strong> Estrutura moderna e personalizada para a Gráfica Ariana.</li>
        <li><strong>Design 100% Responsivo:</strong> Funcionamento perfeito em Celulares, Tablets e Computadores.</li>
        <li><strong>Botão de WhatsApp Direto:</strong> Atendimento rápido com direcionamento direto de novos clientes.</li>
        <li><strong>Página de Serviços & Orçamentos:</strong> Apresentação clara de impressões, produtos e serviços da gráfica.</li>
        <li><strong>Otimização Básica SEO & Google:</strong> Preparado para indexação nas buscas do Google.</li>
    </ul>

    <div class="section-title">Investimento & Condições de Pagamento</div>
    <table class="price-table">
        <thead>
            <tr>
                <th>Descrição do Serviço</th>
                <th>Recorrência</th>
                <th style="text-align:right;">Valor Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Criação de Site Profissional Exclusivo — Gráfica Ariana</strong></td>
                <td>Pagamento Único</td>
                <td style="text-align:right; font-weight:800; color:#059669; font-size:16px;">R$ 400,00</td>
            </tr>
        </tbody>
    </table>

    <div class="payment-box">
        <div class="payment-title">💳 Condições de Pagamento (50% no Início / 50% na Entrega)</div>
        <p style="margin:4px 0 10px; font-size:13.5px; color:#166534;">
            • <strong>1ª Parcela (Entrada / Início):</strong> R$ 200,00 (50% no fechamento)<br>
            • <strong>2ª Parcela (Entrega Final):</strong> R$ 200,00 (50% na aprovação e entrega do site no ar)
        </p>
        <span class="info-label" style="color:#166534;">🔑 Chave Pix para Pagamento (Telefone):</span>
        <div class="pix-key">(11) 97570-2321</div>
        <span style="font-size:12px; color:#15803d; display:block; margin-top:4px;">Favorecido: Matheus Bellato • WEBCO Agency</span>
    </div>

    <div class="footer">
        WEBCO Agency &copy; 2026 • https://webcoagency.site • WhatsApp: (11) 91814-7277 • Todos os direitos reservados
    </div>
</body>
</html>`;

// Save as HTML file in Downloads
const htmlPath = path.join(downloadsDir, 'Proposta_Comercial_Grafica_Ariana_WEBCO.html');
fs.writeFileSync(htmlPath, htmlDocument, 'utf8');
console.log('Saved HTML document:', htmlPath);

// Save copy to Artifacts
const artifactHtmlPath = path.join('C:/Users/Kamino/.gemini/antigravity/brain/097161f5-f2e8-4998-906c-74ffb65b7130', 'Proposta_Comercial_Grafica_Ariana_WEBCO.html');
fs.writeFileSync(artifactHtmlPath, htmlDocument, 'utf8');

// Generate valid standard PDF using simple clean syntax
const cleanPdfHeader = `%PDF-1.3
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 700 >>
stream
BT
/F1 18 Tf
40 790 Td
(WEBCO Agency - PROPOSTA COMERCIAL) Tj
/F1 14 Tf
0 -30 Td
(Cliente: Grafica Ariana) Tj
0 -20 Td
(Responsavel Comercial: Matheus Bellato) Tj
0 -20 Td
(Data: 06/08/2026 - Validade: 15 dias) Tj
0 -35 Td
(SERVICO CONTRATADO:) Tj
0 -20 Td
(- Desenvolvimento de Site Institucional Profissional) Tj
0 -20 Td
(- Design 100% Responsivo para Celulares e PC) Tj
0 -20 Td
(- Botao de WhatsApp Direto para Receber Orcamentos) Tj
0 -20 Td
(- Pagina de Servicos Graficos e Contato) Tj
0 -35 Td
(PRAZO DE ENTREGA:) Tj
0 -20 Td
(- Em ate 5 dias corridos) Tj
0 -35 Td
(VALOR E CONDICOES DE PAGAMENTO:) Tj
0 -20 Td
(- Valor Total: R$ 400,00) Tj
0 -20 Td
(- Entrada (50%): R$ 200,00 no inicio dos trabalhos) Tj
0 -20 Td
(- Entrega (50%): R$ 200,00 no site final no ar) Tj
0 -30 Td
(CHAVE PIX PARA PAGAMENTO (TELEFONE):) Tj
0 -20 Td
((11) 97570-2321 - Matheus Bellato) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000059 00000 n 
0000000116 00000 n 
0000000237 00000 n 
0000000308 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1060
%%EOF`;

const pdfValidPath = path.join(downloadsDir, 'Proposta_Comercial_Grafica_Ariana.pdf');
fs.writeFileSync(pdfValidPath, cleanPdfHeader, 'utf8');

const artifactPdfPath = path.join('C:/Users/Kamino/.gemini/antigravity/brain/097161f5-f2e8-4998-906c-74ffb65b7130', 'Proposta_Comercial_Grafica_Ariana.pdf');
fs.writeFileSync(artifactPdfPath, cleanPdfHeader, 'utf8');
console.log('Saved PDF document:', pdfValidPath);
