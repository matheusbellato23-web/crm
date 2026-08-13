const fs = require('fs');

let appJs = fs.readFileSync('src/app.js', 'utf8');

const targetStr = `    const selectSubTab = (activeId, activePanelId) => {
        const tabs   = ['tabInvoices','tabExpenses','tabServices','tabByClient','tabOverdue','tabFiscalNotes'];
        const panels = ['panelInvoices','panelExpenses','panelServices','panelByClient','panelOverdue','panelFiscalNotes'];
        tabs.forEach(id => { const el = document.getElementById(id); if (el) el.classList.toggle('active', id === activeId); });
        panels.forEach(id => { const el = document.getElementById(id); if (el) el.classList.toggle('hidden', id !== activePanelId); });
    };

    const tabInvoices = document.getElementById('tabInvoices');
    const tabExpenses = document.getElementById('tabExpenses');
    const tabServices = document.getElementById('tabServices');
    const tabByClient = document.getElementById('tabByClient');
    const tabOverdue  = document.getElementById('tabOverdue');
    const tabFN       = document.getElementById('tabFiscalNotes');
    if (tabInvoices) tabInvoices.onclick = () => selectSubTab('tabInvoices', 'panelInvoices');
    if (tabExpenses) tabExpenses.onclick = () => selectSubTab('tabExpenses', 'panelExpenses');
    if (tabServices) tabServices.onclick = () => { selectSubTab('tabServices', 'panelServices'); renderServices(); };
    if (tabByClient) tabByClient.onclick = () => { selectSubTab('tabByClient', 'panelByClient'); renderByClient(env); };
    if (tabOverdue)  tabOverdue.onclick  = () => { selectSubTab('tabOverdue',  'panelOverdue');  renderOverdue(env); };
    if (tabFN)       tabFN.onclick       = () => selectSubTab('tabFiscalNotes', 'panelFiscalNotes');`;

const replaceStr = `    const selectSubTab = (activeId, activePanelId) => {
        const tabs   = ['tabInvoices','tabExpenses','tabServices','tabByClient','tabOverdue','tabUpsells','tabFiscalNotes'];
        const panels = ['panelInvoices','panelExpenses','panelServices','panelByClient','panelOverdue','panelUpsells','panelFiscalNotes'];
        tabs.forEach(id => { const el = document.getElementById(id); if (el) el.classList.toggle('active', id === activeId); });
        panels.forEach(id => { const el = document.getElementById(id); if (el) el.classList.toggle('hidden', id !== activePanelId); });
    };

    const tabInvoices = document.getElementById('tabInvoices');
    const tabExpenses = document.getElementById('tabExpenses');
    const tabServices = document.getElementById('tabServices');
    const tabByClient = document.getElementById('tabByClient');
    const tabOverdue  = document.getElementById('tabOverdue');
    const tabUpsells  = document.getElementById('tabUpsells');
    const tabFN       = document.getElementById('tabFiscalNotes');
    if (tabInvoices) tabInvoices.onclick = () => selectSubTab('tabInvoices', 'panelInvoices');
    if (tabExpenses) tabExpenses.onclick = () => selectSubTab('tabExpenses', 'panelExpenses');
    if (tabServices) tabServices.onclick = () => { selectSubTab('tabServices', 'panelServices'); renderServices(); };
    if (tabByClient) tabByClient.onclick = () => { selectSubTab('tabByClient', 'panelByClient'); renderByClient(env); };
    if (tabOverdue)  tabOverdue.onclick  = () => { selectSubTab('tabOverdue',  'panelOverdue');  renderOverdue(env); };
    if (tabUpsells)  tabUpsells.onclick  = () => { selectSubTab('tabUpsells',  'panelUpsells');  renderUpsells(env); };
    if (tabFN)       tabFN.onclick       = () => selectSubTab('tabFiscalNotes', 'panelFiscalNotes');`;

if (appJs.includes(targetStr)) {
    appJs = appJs.replace(targetStr, replaceStr);
    fs.writeFileSync('src/app.js', appJs, 'utf8');
    console.log('Successfully updated selectSubTab in app.js!');
} else {
    console.log('Target string not found in app.js!');
}
