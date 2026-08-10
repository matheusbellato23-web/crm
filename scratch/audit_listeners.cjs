const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('src/app.js', 'utf8');

// Find all event listeners and onclick assignments in app.js
const missingSafeChecks = [];
const lines = appJs.split('\n');

lines.forEach((line, idx) => {
    // Check patterns like document.getElementById('foo').addEventListener or .onclick
    if (line.includes('document.getElementById(') && (line.includes('.addEventListener') || line.includes('.onclick'))) {
        // If line doesn't start with an if statement or optional chaining
        if (!line.trim().startsWith('if') && !line.includes('?.') && !line.includes('const ') && !line.includes('let ')) {
            const match = line.match(/document\.getElementById\(["']([^"']+)["']\)/);
            if (match) {
                missingSafeChecks.push({ lineNum: idx + 1, id: match[1], code: line.trim() });
            }
        }
    }
});

console.log(`Found ${missingSafeChecks.length} direct getElementById listener calls without explicit if check:`);
missingSafeChecks.forEach(item => {
    console.log(`L${item.lineNum}: [${item.id}] -> ${item.code}`);
});
