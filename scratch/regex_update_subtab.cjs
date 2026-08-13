const fs = require('fs');

let appJs = fs.readFileSync('src/app.js', 'utf8');

// Use regex replacement to ignore line ending differences
appJs = appJs.replace(
    /const tabs\s*=\s*\['tabInvoices','tabExpenses','tabServices','tabByClient','tabOverdue','tabFiscalNotes'\];/g,
    "const tabs   = ['tabInvoices','tabExpenses','tabServices','tabByClient','tabOverdue','tabUpsells','tabFiscalNotes'];"
);

appJs = appJs.replace(
    /const panels\s*=\s*\['panelInvoices','panelExpenses','panelServices','panelByClient','panelOverdue','panelFiscalNotes'\];/g,
    "const panels = ['panelInvoices','panelExpenses','panelServices','panelByClient','panelOverdue','panelUpsells','panelFiscalNotes'];"
);

appJs = appJs.replace(
    /const tabOverdue\s*=\s*document\.getElementById\('tabOverdue'\);\r?\n\s*const tabFN\s*=\s*document\.getElementById\('tabFiscalNotes'\);/g,
    "const tabOverdue  = document.getElementById('tabOverdue');\n    const tabUpsells  = document.getElementById('tabUpsells');\n    const tabFN       = document.getElementById('tabFiscalNotes');"
);

appJs = appJs.replace(
    /if \(tabOverdue\)\s*tabOverdue\.onclick\s*=\s*\(\)\s*=>\s*\{\s*selectSubTab\('tabOverdue',\s*'panelOverdue'\);\s*renderOverdue\(env\);\s*\};\r?\n\s*if \(tabFN\)/g,
    "if (tabOverdue)  tabOverdue.onclick  = () => { selectSubTab('tabOverdue',  'panelOverdue');  renderOverdue(env); };\n    if (tabUpsells)  tabUpsells.onclick  = () => { selectSubTab('tabUpsells',  'panelUpsells');  renderUpsells(env); };\n    if (tabFN)"
);

fs.writeFileSync('src/app.js', appJs, 'utf8');
console.log('Regex replacement completed for selectSubTab!');
