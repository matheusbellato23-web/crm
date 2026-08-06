const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Extract Affiliates View Content
const startMarker = '<!-- VIEW: GESTÃO DE AFILIADOS -->';
const endMarker = '<!-- MODAL: NOVO / EDITAR AFILIADO -->';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find start or end markers for Affiliates View!');
    process.exit(1);
}

let affiliatesViewContent = html.substring(startIdx, endIdx).trim();

// Clean up wrapper tags to make it a proper <section id="affiliatesView" class="view-section">
affiliatesViewContent = affiliatesViewContent.replace(
    '<div class="view-section" id="affiliatesView">',
    '<section id="affiliatesView" class="view-section">'
);
// Replace closing div with closing section
if (affiliatesViewContent.endsWith('</div>')) {
    affiliatesViewContent = affiliatesViewContent.substring(0, affiliatesViewContent.length - 6) + '</section>';
}

// Remove affiliatesView from current position
html = html.substring(0, startIdx) + html.substring(endIdx);

// Insert affiliatesViewContent right before </main>
const mainEndIdx = html.indexOf('</main>');
if (mainEndIdx === -1) {
    console.error('Could not find </main> tag!');
    process.exit(1);
}

html = html.substring(0, mainEndIdx) + '\n\n            ' + affiliatesViewContent + '\n        ' + html.substring(mainEndIdx);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully moved affiliatesView inside <main class="main-content"> in index.html!');

// 2. Update src/app.js to dynamically query .view-section on nav click
let appJs = fs.readFileSync('src/app.js', 'utf8');

const oldNavHandler = `navItems.forEach(item => {
    item.addEventListener("click", () => {
        const targetView = item.getAttribute("data-view");
        localStorage.setItem("nexus_crm_active_view", targetView);
        
        navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");

        views.forEach(view => {
            if (view.id === \`\${targetView}View\`) {
                view.classList.add("active");
            } else {
                view.classList.remove("active");
            }
        });
        
        renderAll();
    });
});`;

const newNavHandler = `navItems.forEach(item => {
    item.addEventListener("click", () => {
        const targetView = item.getAttribute("data-view");
        localStorage.setItem("nexus_crm_active_view", targetView);
        
        document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");

        document.querySelectorAll(".view-section").forEach(view => {
            if (view.id === \`\${targetView}View\`) {
                view.classList.add("active");
            } else {
                view.classList.remove("active");
            }
        });
        
        renderAll();
    });
});`;

if (appJs.includes(oldNavHandler)) {
    appJs = appJs.replace(oldNavHandler, newNavHandler);
    fs.writeFileSync('src/app.js', appJs, 'utf8');
    console.log('Successfully updated navItems click handler in app.js!');
} else {
    console.log('oldNavHandler target not exact, searching alternative replacement...');
}
