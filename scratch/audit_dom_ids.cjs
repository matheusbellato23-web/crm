const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('src/app.js', 'utf8');

// Extract all getElementById calls from app.js
const idMatches = appJs.match(/document\.getElementById\(["']([^"']+)["']\)/g) || [];
const idsInJs = new Set();
idMatches.forEach(m => {
    const match = m.match(/document\.getElementById\(["']([^"']+)["']\)/);
    if (match) idsInJs.add(match[1]);
});

// Check which IDs are missing in index.html
const missingInHtml = [];
idsInJs.forEach(id => {
    if (!indexHtml.includes(`id="${id}"`) && !indexHtml.includes(`id='${id}'`)) {
        missingInHtml.push(id);
    }
});

console.log(`Total IDs checked from JS: ${idsInJs.size}`);
console.log(`IDs in JS missing in index.html:`, missingInHtml);
