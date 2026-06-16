const fs = require('fs');

const pages = [
  { path: 'm:\\rps-platform\\apps\\rps-frontend\\src\\app\\page.tsx', title: 'Core OS' },
  { path: 'm:\\rps-platform\\apps\\rps-frontend\\src\\app\\dashboard\\page.tsx', title: 'Dashboard' },
  { path: 'm:\\rps-platform\\apps\\rps-frontend\\src\\app\\dev\\page.tsx', title: 'Developer Hub' },
  { path: 'm:\\rps-platform\\apps\\rps-frontend\\src\\app\\dev\\moderator\\page.tsx', title: 'Moderator Hub' },
];

for (const p of pages) {
    let content = fs.readFileSync(p.path, 'utf8');
    // Remove existing metadata if present
    content = content.replace(/export const metadata.*?};?/s, '');
    // Prepend the new metadata
    content = `export const metadata = { title: "${p.title}" };\n` + content;
    fs.writeFileSync(p.path, content, 'utf8');
    console.log(`Updated ${p.path}`);
}
