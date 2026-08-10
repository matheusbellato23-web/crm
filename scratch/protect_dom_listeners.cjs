const fs = require('fs');

let appJs = fs.readFileSync('src/app.js', 'utf8');

// Function helper to wrap event listener or click handler safely
// We can introduce a safe listener helper function in app.js:
// function on(id, event, handler) { const el = document.getElementById(id); if (el) { if (event === 'click' && handler.name !== 'submit') el.onclick = handler; else el.addEventListener(event, handler); } }

// Let's audit all .addEventListener and .onclick statements that might crash if an element is missing in certain views or dynamic states
let modificationsCount = 0;

// Replace fragile direct document.getElementById("XYZ").addEventListener(...) with safe optional chaining or if check
const lines = appJs.split('\n');
const newLines = lines.map((line, idx) => {
    // Pattern 1: document.getElementById("FOO").addEventListener("EVENT", HANDLER);
    if (line.match(/^(\s*)document\.getElementById\(["']([^"']+)["']\)\.addEventListener\((.*)\);?\s*$/)) {
        const match = line.match(/^(\s*)document\.getElementById\(["']([^"']+)["']\)\.addEventListener\((.*)\);?\s*$/);
        const indent = match[1];
        const id = match[2];
        const rest = match[3];
        modificationsCount++;
        return `${indent}const _el_${id.replace(/[^a-zA-Z0-9_]/g, '_')} = document.getElementById("${id}"); if (_el_${id.replace(/[^a-zA-Z0-9_]/g, '_')}) _el_${id.replace(/[^a-zA-Z0-9_]/g, '_')}.addEventListener(${rest});`;
    }
    // Pattern 2: document.getElementById("FOO").onclick = HANDLER;
    if (line.match(/^(\s*)document\.getElementById\(["']([^"']+)["']\)\.onclick\s*=\s*(.*);?\s*$/)) {
        const match = line.match(/^(\s*)document\.getElementById\(["']([^"']+)["']\)\.onclick\s*=\s*(.*);?\s*$/);
        const indent = match[1];
        const id = match[2];
        const rest = match[3];
        modificationsCount++;
        return `${indent}const _el_${id.replace(/[^a-zA-Z0-9_]/g, '_')} = document.getElementById("${id}"); if (_el_${id.replace(/[^a-zA-Z0-9_]/g, '_')}) _el_${id.replace(/[^a-zA-Z0-9_]/g, '_')}.onclick = ${rest};`;
    }
    return line;
});

console.log(`Protected ${modificationsCount} direct DOM listener calls against null pointer crashes.`);

fs.writeFileSync('src/app.js', newLines.join('\n'), 'utf8');
console.log('Saved protected app.js!');
