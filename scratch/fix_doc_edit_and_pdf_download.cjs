const fs = require('fs');

let appJs = fs.readFileSync('src/app.js', 'utf8');

const oldPreviewDoc = `function previewDocument(doc) {
    const modal = document.getElementById('documentPreviewModal');
    if (!modal) return;

    document.getElementById('docPreviewTitle').innerText = doc.title || 'Visualizar Documento';

    const frame = document.getElementById('docPreviewFrame');
    if (doc.fileData) {
        frame.src = doc.fileData;
    } else {
        const htmlContent = \`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; background: #ffffff; line-height: 1.6; }
                    .header { border-bottom: 2px solid #4F46E5; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                    .title { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
                    .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
                    .badge { background: rgba(79,70,229,0.1); color: #4F46E5; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; }
                    .content { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; font-size: 14px; color: #334155; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1 class="title">\${doc.title}</h1>
                        <div class="subtitle">Documento Oficial WEBCO Agency</div>
                    </div>
                    <span class="badge">\${DOC_CATEGORY_LABELS[doc.category] || doc.category}</span>
                </div>
                <div class="content">
                    <p><strong>Descrição:</strong> \${doc.description || 'Nenhuma descrição informada.'}</p>
                    <p><strong>Arquivo:</strong> \${doc.fileName || 'documento.pdf'}</p>
                    <p style="margin-top:20px;padding:16px;background:#ffffff;border-left:4px solid #4F46E5;border-radius:4px;">
                        ℹ️ Este é um documento modelo padrão da agência. Você pode fazer upload dos seus arquivos PDF reais (Propostas comerciais, PDFs, Apresentações) clicando em <strong>Adicionar Documento</strong> ou <strong>Editar Documento</strong>.
                    </p>
                </div>
                <div class="footer">WEBCO Agency &copy; 2026 - Todos os direitos reservados</div>
            </body>
            </html>
        \`;
        frame.srcdoc = htmlContent;
    }

    const close = () => modal.classList.remove('active');
    document.getElementById('btnCloseDocPreviewModal').onclick = close;
    document.getElementById('btnCloseDocPreviewModal2').onclick = close;

    document.getElementById('btnCopyDocInfo').onclick = () => {
        const text = \`\${doc.title}\\n\${doc.description ? doc.description + '\\n' : ''}\${doc.fileName ? 'Arquivo: ' + doc.fileName : ''}\`;
        navigator.clipboard.writeText(text).then(() => showToast('✅ Informações copiadas!', 'success'));
    };

    document.getElementById('btnDownloadDocFromPreview').onclick = () => {
        downloadDocumentFile(doc);
    };

    modal.classList.add('active');
    safeCreateIcons();
}`;

const newPreviewDoc = `function previewDocument(doc) {
    const modal = document.getElementById('documentPreviewModal');
    if (!modal) return;

    document.getElementById('docPreviewTitle').innerText = doc.title || 'Visualizar Documento';

    const frame = document.getElementById('docPreviewFrame');
    if (doc.fileData && doc.fileData.startsWith('data:')) {
        frame.removeAttribute('srcdoc');
        frame.src = doc.fileData;
    } else {
        frame.removeAttribute('src');
        const htmlContent = \`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; background: #ffffff; line-height: 1.6; }
                    .header { border-bottom: 2px solid #4F46E5; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                    .title { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
                    .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
                    .badge { background: rgba(79,70,229,0.1); color: #4F46E5; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; }
                    .content { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; font-size: 14px; color: #334155; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1 class="title">\${doc.title}</h1>
                        <div class="subtitle">Documento Oficial WEBCO Agency</div>
                    </div>
                    <span class="badge">\${DOC_CATEGORY_LABELS[doc.category] || doc.category}</span>
                </div>
                <div class="content">
                    <p><strong>Descrição:</strong> \${doc.description || 'Nenhuma descrição informada.'}</p>
                    <p><strong>Arquivo:</strong> \${doc.fileName || 'documento.pdf'}</p>
                    <p style="margin-top:20px;padding:16px;background:#ffffff;border-left:4px solid #4F46E5;border-radius:4px;">
                        ℹ️ Você pode substituir este arquivo por um PDF real do seu computador clicando no botão <strong>Editar Documento</strong>.
                    </p>
                </div>
                <div class="footer">WEBCO Agency &copy; 2026 - Todos os direitos reservados</div>
            </body>
            </html>
        \`;
        frame.srcdoc = htmlContent;
    }

    const close = () => modal.classList.remove('active');
    document.getElementById('btnCloseDocPreviewModal').onclick = close;
    document.getElementById('btnCloseDocPreviewModal2').onclick = close;

    const btnEditFromPreview = document.getElementById('btnEditDocFromPreview');
    if (btnEditFromPreview) {
        btnEditFromPreview.onclick = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                openDocumentModal(doc.id);
            }, 100);
        };
    }

    document.getElementById('btnCopyDocInfo').onclick = () => {
        const text = \`\${doc.title}\\n\${doc.description ? doc.description + '\\n' : ''}\${doc.fileName ? 'Arquivo: ' + doc.fileName : ''}\`;
        navigator.clipboard.writeText(text).then(() => showToast('✅ Informações copiadas!', 'success'));
    };

    document.getElementById('btnDownloadDocFromPreview').onclick = () => {
        downloadDocumentFile(doc);
    };

    modal.classList.add('active');
    safeCreateIcons();
}`;

const oldDownloadDoc = `function downloadDocumentFile(doc) {
    if (doc.fileData) {
        const a = document.createElement('a');
        a.href = doc.fileData;
        a.download = doc.fileName || \`\${doc.title}.pdf\`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast(\`⬇️ Download de "\${doc.fileName || doc.title}" iniciado!\`, 'success');
    } else {
        const blob = new Blob([\`Documento: \${doc.title}\\n\\n\${doc.description || ''}\\n\\nWEBCO Agency\`], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.fileName ? doc.fileName.replace('.pdf', '.txt') : \`\${doc.title}.txt\`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(\`⬇️ Download de "\${doc.title}" concluído!\`, 'success');
    }
}`;

const newDownloadDoc = `function createDynamicPdfBase64(title, description) {
    const textTitle = (title || 'Documento WEBCO').replace(/[^a-zA-Z0-9 _-]/g, '');
    const textDesc = (description || 'Documento Oficial WEBCO Agency').replace(/[^a-zA-Z0-9 _-]/g, '').substring(0, 150);
    const pdfRaw = \`%PDF-1.4
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
<< /Length 300 >>
stream
BT
/F1 18 Tf
50 720 Td
(\${textTitle}) Tj
/F1 12 Tf
0 -30 Td
(WEBCO Agency - Solucoes Digitais) Tj
0 -40 Td
(\${textDesc}) Tj
0 -40 Td
(Contato: matheusbellato23@webcoagency.site | WhatsApp: 11 91814-7277) Tj
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
0000000550 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
625
%%EOF\`;
    return 'data:application/pdf;base64,' + btoa(pdfRaw);
}

function downloadDocumentFile(doc) {
    let fileUrl = doc.fileData;
    let fileName = doc.fileName || \`\${(doc.title || 'Documento').replace(/\\s+/g, '_')}.pdf\`;
    if (!fileName.toLowerCase().endsWith('.pdf')) fileName += '.pdf';

    if (!fileUrl || !fileUrl.startsWith('data:')) {
        fileUrl = createDynamicPdfBase64(doc.title, doc.description);
    }

    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(\`⬇️ Download do PDF "\${fileName}" concluído com sucesso!\`, 'success');
}`;

if (appJs.includes(oldPreviewDoc)) {
    appJs = appJs.replace(oldPreviewDoc, newPreviewDoc);
    console.log('Replaced oldPreviewDoc in app.js!');
} else {
    console.log('oldPreviewDoc target not exact, replacing by function search...');
    const startP = appJs.indexOf('function previewDocument(doc) {');
    const endP = appJs.indexOf('function downloadDocumentFile(doc) {');
    if (startP !== -1 && endP !== -1) {
        appJs = appJs.substring(0, startP) + newPreviewDoc + '\n\n' + appJs.substring(endP);
        console.log('Replaced previewDocument via index positioning!');
    }
}

if (appJs.includes(oldDownloadDoc)) {
    appJs = appJs.replace(oldDownloadDoc, newDownloadDoc);
    console.log('Replaced oldDownloadDoc in app.js!');
} else {
    const startD = appJs.indexOf('function downloadDocumentFile(doc) {');
    const endD = appJs.indexOf('// Setup Drag & Drop Zone');
    if (startD !== -1 && endD !== -1) {
        appJs = appJs.substring(0, startD) + newDownloadDoc + '\n\n' + appJs.substring(endD);
        console.log('Replaced downloadDocumentFile via index positioning!');
    }
}

fs.writeFileSync('src/app.js', appJs, 'utf8');
console.log('Updated app.js successfully!');
