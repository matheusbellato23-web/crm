const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find start and end of affiliatesView block
const startBlock = html.indexOf('<!-- VIEW: GESTÃO DE AFILIADOS -->');
const endBlock = html.indexOf('<!-- MODAL: PREVIEW DOCUMENT -->');

if (startBlock !== -1 && endBlock !== -1) {
    let affiliatesHtml = html.substring(startBlock, endBlock);
    
    // Convert div to section tag for consistency
    affiliatesHtml = affiliatesHtml.replace('<div class="view-section" id="affiliatesView">', '<section id="affiliatesView" class="view-section">');
    affiliatesHtml = affiliatesHtml.replace(/<\/div>\s*<!-- MODAL: NOVO \/ EDITAR AFILIADO -->/, '</section>\n\n        <!-- MODAL: NOVO / EDITAR AFILIADO -->');

    // Remove affiliatesView block from current location
    html = html.substring(0, startBlock) + html.substring(endBlock);

    // Insert affiliatesView section right before </main>
    const mainEndIdx = html.indexOf('</main>');
    if (mainEndIdx !== -1) {
        html = html.substring(0, mainEndIdx) + affiliatesHtml + '\n        ' + html.substring(mainEndIdx);
        fs.writeFileSync('index.html', html, 'utf8');
        console.log('Successfully moved affiliatesView inside <main class="main-content">!');
    } else {
        console.error('</main> tag not found in index.html');
    }
} else {
    console.error('Affiliates view block not found in index.html', startBlock, endBlock);
}
