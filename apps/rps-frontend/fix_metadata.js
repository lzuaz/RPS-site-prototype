const fs = require('fs');
const path = require('path');

const pages = [
  { dir: 'm:\\rps-platform\\apps\\rps-frontend\\src\\app', title: 'Core OS' },
  { dir: 'm:\\rps-platform\\apps\\rps-frontend\\src\\app\\dashboard', title: 'Dashboard' },
  { dir: 'm:\\rps-platform\\apps\\rps-frontend\\src\\app\\dev', title: 'Developer Hub' },
  { dir: 'm:\\rps-platform\\apps\\rps-frontend\\src\\app\\dev\\moderator', title: 'Moderator Hub' },
];

for (const p of pages) {
    const pagePath = path.join(p.dir, 'page.tsx');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');
        // Remove the invalid metadata export
        content = content.replace(/export const metadata = \{ title: "[^"]+" \};\r?\n?/, '');
        fs.writeFileSync(pagePath, content, 'utf8');
        console.log(`Fixed ${pagePath}`);
    }

    // For subdirectories, create a layout.tsx to hold the metadata
    if (p.dir !== 'm:\\rps-platform\\apps\\rps-frontend\\src\\app') {
        const layoutPath = path.join(p.dir, 'layout.tsx');
        const layoutContent = `import type { Metadata } from "next";\n\nexport const metadata: Metadata = {\n  title: "${p.title}",\n};\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return <>{children}</>;\n}\n`;
        fs.writeFileSync(layoutPath, layoutContent, 'utf8');
        console.log(`Created ${layoutPath}`);
    }
}
