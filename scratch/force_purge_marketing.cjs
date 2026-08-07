const fs = require('fs');

let appJs = fs.readFileSync('src/app.js', 'utf8');

// 1. Force clear stale localStorage in init() if old marketing assets found
const oldInitCacheCheck = `    // Load localStorage first as a base — we'll merge on top if server responds
    let localState = null;
    const savedState = localStorage.getItem("nexus_crm_multitenant_state");
    if (savedState) {
        try { localState = JSON.parse(savedState); } catch (err) { console.error("Error parsing localStorage state:", err); }
    }`;

const newInitCacheCheck = `    // ⚠️ HARD RESET STALE MARKETING CACHE IN BROWSER
    let localState = null;
    const savedState = localStorage.getItem("nexus_crm_multitenant_state");
    if (savedState) {
        try {
            localState = JSON.parse(savedState);
            if (localState && localState.environments && localState.environments.webco && localState.environments.webco.marketingAssets) {
                const hasStale = localState.environments.webco.marketingAssets.some(a => a.id === 'ma1' || a.id === 'ma2');
                if (hasStale) {
                    console.info("[init] Stale marketingAssets in localStorage detected. Purging cache.");
                    localStorage.removeItem("nexus_crm_multitenant_state");
                    localState = null;
                }
            }
        } catch (err) { console.error("Error parsing localStorage state:", err); }
    }`;

if (appJs.includes(oldInitCacheCheck)) {
    appJs = appJs.replace(oldInitCacheCheck, newInitCacheCheck);
    console.log('Updated cache check in app.js!');
}

// 2. Force overwrite state.environments.webco.marketingAssets upon load and save to server
const oldServerStateRead = `            const data = await response.json();
            if (data) {
                state = data;
                loadedFromServer = true;`;

const newServerStateRead = `            const data = await response.json();
            if (data) {
                state = data;
                loadedFromServer = true;
                // Force sync marketingAssets in state
                if (state.environments && state.environments.webco) {
                    state.environments.webco.marketingAssets = [...defaultMarketingAssets];
                }`;

if (appJs.includes(oldServerStateRead)) {
    appJs = appJs.replace(oldServerStateRead, newServerStateRead);
    console.log('Updated server state read in app.js!');
}

fs.writeFileSync('src/app.js', appJs, 'utf8');
console.log('Successfully saved app.js!');
