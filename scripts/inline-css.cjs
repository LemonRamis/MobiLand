const fs = require('node:fs');
const path = require('node:path');
const css = fs.readFileSync('assets/site.css', 'utf8');
const style = `<style id="site-styles">${css}</style>`;
for (const file of fs.readdirSync('.').filter(f => f === 'index.html' || /^remont-.*\.html$/.test(f))) {
  const html = fs.readFileSync(file, 'utf8');
  const next = html.replace(/<style id="site-styles">[\s\S]*?<\/style>|<link rel="stylesheet" href="assets\/site\.css(?:\?[^\"]*)?">/, () => style);
  if (next === html && !html.includes(style)) throw new Error(`Stylesheet placeholder missing: ${file}`);
  fs.writeFileSync(file, next);
}
console.log('Updated inline stylesheet for all public content pages.');
