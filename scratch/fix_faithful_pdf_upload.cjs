const fs = require('fs');

let appJs = fs.readFileSync('src/app.js', 'utf8');

// Replace previewDocument and downloadDocumentFile to guarantee 100% original file rendering and download
const startIdx = appJs.indexOf('function previewDocument(doc) {');
const endIdx = appJs.indexOf('// Setup Drag & Drop Zone');

if (startIdx !== -1 && endIdx !== -1) {
    const updatedCode = `function previewDocument(doc) {
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
                        ℹ️ Clique no botão <strong>Editar Documento</strong> e faça upload do seu PDF real do seu computador para ter a pré-visualização e download fieis ao arquivo original.
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
}

function downloadDocumentFile(doc) {
    if (!doc.fileData || !doc.fileData.startsWith('data:')) {
        showToast('⚠️ Este documento ainda não possui um arquivo PDF real anexado. Clique em "Editar Documento" para subir o seu PDF original.', 'warning');
        return;
    }

    const a = document.createElement('a');
    a.href = doc.fileData;
    a.download = doc.fileName || \`\${(doc.title || 'Documento').replace(/\\s+/g, '_')}.pdf\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(\`⬇️ Download do PDF original "\${doc.fileName || doc.title}" concluído!\`, 'success');
}\n\n`;

    appJs = appJs.substring(0, startIdx) + updatedCode + appJs.substring(endIdx);
    fs.writeFileSync('src/app.js', appJs, 'utf8');
    console.log('Successfully updated previewDocument & downloadDocumentFile in app.js!');
} else {
    console.error('Could not find start/end indices in app.js', startIdx, endIdx);
}
