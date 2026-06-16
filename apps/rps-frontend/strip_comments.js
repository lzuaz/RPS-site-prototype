const fs = require('fs');
const path = require('path');

const srcDir = 'm:\\rps-platform\\apps\\rps-frontend\\src';

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalLength = content.length;

    // 1. Remove JSX comments: {/* ... */}
    content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

    // 2. Remove multi-line JS/TS comments: /* ... */
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');

    // 3. Remove single-line JS/TS comments: // ...
    // using negative lookbehind to avoid destroying http:// or https://
    content = content.replace(/(?<!https?:)\/\/.*$/gm, '');

    // 4. Remove empty lines left behind by the comment removal
    content = content.replace(/^\s*[\r\n]/gm, '');

    if (content.length !== originalLength) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned: ${filePath}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            cleanFile(fullPath);
        }
    }
}

traverseDir(srcDir);
console.log('Done!');
