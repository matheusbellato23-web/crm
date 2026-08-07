const fs = require('fs');

let appJs = fs.readFileSync('src/app.js', 'utf8');

const oldMergeLogic = `// ⚠️ CRITICAL: Merge templates from localStorage into server state
                // to prevent data loss when server state is behind localStorage.
                if (localState && localState.environments) {
                    Object.keys(localState.environments).forEach(envKey => {
                        const localEnv = localState.environments[envKey];
                        if (localEnv && Array.isArray(localEnv.templates) && localEnv.templates.length > 0) {
                            if (!state.environments) state.environments = {};
                            if (!state.environments[envKey]) state.environments[envKey] = {};
                            const serverEnv = state.environments[envKey];
                            if (!serverEnv.templates || serverEnv.templates.length === 0) {
                                // Server has no templates for this env — restore from local
                                serverEnv.templates = localEnv.templates;
                                console.info(\`[init] Restored \${localEnv.templates.length} template(s) from localStorage for env "\${envKey}".\`);
                            } else {
                                // Merge: add any locally-existing templates that are missing from server
                                localEnv.templates.forEach(localTmpl => {
                                    const alreadyExists = serverEnv.templates.some(t => t.id === localTmpl.id);
                                    if (!alreadyExists) {
                                        serverEnv.templates.push(localTmpl);
                                        console.info(\`[init] Merged missing template "\${localTmpl.name}" from localStorage.\`);
                                    }
                                });
                            }
                        }
                    });
                    // After merge, persist the merged state back to server
                    saveStateToServer();
                }`;

const newMergeLogic = `// ⚠️ CRITICAL: Merge templates and marketingAssets from localStorage into server state
                if (localState && localState.environments) {
                    Object.keys(localState.environments).forEach(envKey => {
                        const localEnv = localState.environments[envKey];
                        if (localEnv) {
                            if (!state.environments) state.environments = {};
                            if (!state.environments[envKey]) state.environments[envKey] = {};
                            const serverEnv = state.environments[envKey];
                            
                            // Templates
                            if (Array.isArray(localEnv.templates) && localEnv.templates.length > 0) {
                                if (!serverEnv.templates || serverEnv.templates.length === 0) {
                                    serverEnv.templates = localEnv.templates;
                                } else {
                                    localEnv.templates.forEach(localTmpl => {
                                        if (!serverEnv.templates.some(t => t.id === localTmpl.id)) {
                                            serverEnv.templates.push(localTmpl);
                                        }
                                    });
                                }
                            }

                            // Marketing Assets: If server has outdated/few assets, sync with new default/local assets
                            if (Array.isArray(localEnv.marketingAssets)) {
                                if (!serverEnv.marketingAssets || serverEnv.marketingAssets.length < localEnv.marketingAssets.length) {
                                    localEnv.marketingAssets.forEach(lAsset => {
                                        if (!serverEnv.marketingAssets) serverEnv.marketingAssets = [];
                                        if (!serverEnv.marketingAssets.some(a => a.id === lAsset.id)) {
                                            serverEnv.marketingAssets.push(lAsset);
                                        }
                                    });
                                }
                            }
                        }
                    });
                    saveStateToServer();
                }`;

if (appJs.includes(oldMergeLogic)) {
    appJs = appJs.replace(oldMergeLogic, newMergeLogic);
    console.log('Updated app.js merge logic!');
}

// Ensure getEnv merges missing defaultMarketingAssets into state
const oldGetEnvMarketing = `if (!state.environments[env].marketingAssets) state.environments[env].marketingAssets = [...defaultMarketingAssets];`;
const newGetEnvMarketing = `if (!state.environments[env].marketingAssets) {
        state.environments[env].marketingAssets = [...defaultMarketingAssets];
    } else {
        // Merge missing default marketing assets (like Gráfica Ariana strategies)
        defaultMarketingAssets.forEach(defAsset => {
            if (!state.environments[env].marketingAssets.some(a => a.id === defAsset.id)) {
                state.environments[env].marketingAssets.push(defAsset);
            }
        });
    }`;

if (appJs.includes(oldGetEnvMarketing)) {
    appJs = appJs.replace(oldGetEnvMarketing, newGetEnvMarketing);
    console.log('Updated getEnv marketingAssets sync in app.js!');
}

fs.writeFileSync('src/app.js', appJs, 'utf8');
console.log('Successfully updated app.js!');
