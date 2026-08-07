const fs = require('fs');
const path = require('path');

// Ensure Downloads directory path
const downloadsDir = path.join(process.env.USERPROFILE || 'C:/Users/Kamino', 'Downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
}

const pdfPath = path.join(downloadsDir, 'Proposta_Comercial_Grafica_Ariana_WEBCO.pdf');

// Create valid PDF structure
const title = "PROPOSTA COMERCIAL - GRAFICA ARIANA";
const subtitle = "WEBCO Agency • Solucoes Digitais & Performance";
const responsible = "Responsavel Comercial: Matheus Bellato";
const price = "Valor Total: R$ 400,00 (50% entrada R$ 200,00 + 50% entrega R$ 200,00)";
const pix = "Chave Pix (Telefone): (11) 97570-2321 (Matheus Bellato)";
const deadline = "Prazo de Entrega: Em ate 5 dias corridos";

const pdfRaw = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kinds [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 550 >>
stream
BT
/F1 18 Tf
50 720 Td
(${title}) Tj
/F1 12 Tf
0 -25 Td
(${subtitle}) Tj
0 -35 Td
(${responsible}) Tj
0 -25 Td
(Data: 06/08/2026 | Validade: 15 dias) Tj
0 -40 Td
(ESCOPO DO PROJETO:) Tj
0 -20 Td
(- Desenvolvimento de Site Institucional Profissional para Grafica Ariana) Tj
0 -20 Td
(- Layout 100% Responsivo para Celulares e Computadores) Tj
0 -20 Td
(- Botao de WhatsApp Direto para Recebimento de Orcamentos) Tj
0 -20 Td
(- Pagina de Apresentacao de Servicos Graficos e Contato) Tj
0 -40 Td
(${deadline}) Tj
0 -30 Td
(${price}) Tj
0 -25 Td
(${pix}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000850 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
925
%%EOF`;

fs.writeFileSync(pdfPath, pdfRaw, 'binary');
console.log('PDF saved to Downloads folder:', pdfPath);
