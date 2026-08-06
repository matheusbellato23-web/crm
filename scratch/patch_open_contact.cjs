const fs = require('fs');
let code = fs.readFileSync('src/app.js', 'utf8');

const oldAdd = `function openAddContact() {
    document.getElementById("contactForm").reset();`;

const newAdd = `function openAddContact() {
    if (typeof populateAffiliateDropdowns === "function") populateAffiliateDropdowns();
    document.getElementById("contactForm").reset();`;

const oldEdit = `function openEditContact(id) {
    const env = getEnv();`;

const newEdit = `function openEditContact(id) {
    if (typeof populateAffiliateDropdowns === "function") populateAffiliateDropdowns();
    const env = getEnv();`;

const oldSetNiche = `document.getElementById("contactNiche").value = c.niche || "Negócio Local";`;
const newSetNiche = `document.getElementById("contactNiche").value = c.niche || "Negócio Local";
    if (document.getElementById("contactAffiliate")) document.getElementById("contactAffiliate").value = c.affiliateId || "";`;

code = code.replace(oldAdd, newAdd);
code = code.replace(oldEdit, newEdit);
code = code.replace(oldSetNiche, newSetNiche);

fs.writeFileSync('src/app.js', code, 'utf8');
console.log('App.js openAddContact/openEditContact safely updated!');
