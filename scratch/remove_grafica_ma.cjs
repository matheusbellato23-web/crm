const fs = require('fs');

let appJs = fs.readFileSync('src/app.js', 'utf8');

// Remove the strat_site_2 block (Gráfica Ariana) using regex
appJs = appJs.replace(
    /,\s*\{\s*"id":\s*"strat_site_2"[\s\S]*?"cost":\s*"R\$\s*400,00\s*\(50\/50\)"\s*\}\s*\];/m,
    '\r\n];'
);

fs.writeFileSync('src/app.js', appJs, 'utf8');
console.log('Removed strat_site_2 (Gráfica Ariana) from defaultMarketingAssets');

// Verify it's gone
if (!appJs.includes('strat_site_2')) {
    console.log('✅ Confirmed: strat_site_2 is no longer in app.js');
} else {
    console.log('❌ strat_site_2 still present!');
}
