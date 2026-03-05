const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
const configJsPath = path.join(__dirname, 'config.js');
const buildDir = path.join(__dirname, 'build');
const outputPath = path.join(buildDir, 'index.html');

if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

// Helper to base64 encode a file
function base64Encode(file) {
    const bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString('base64');
}

// Helper to get mime type
function getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.png': return 'image/png';
        case '.gif': return 'image/gif';
        case '.jpg': case '.jpeg': return 'image/jpeg';
        case '.mp3': return 'audio/mp3';
        default: return 'application/octet-stream';
    }
}

console.log("Reading HTML and Config...");
let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
const configContent = fs.readFileSync(configJsPath, 'utf8');

console.log("Inlining Config JS...");
htmlContent = htmlContent.replace('<script src="config.js"></script>', `<script>\n${configContent}\n</script>`);

console.log("Inlining Assets... (Note: This may create a very large file depending on the GIFs)");

// Find all asset paths in the HTML
const assetRegex = /url\(['"]?(assets\/[^'"\)]+)['"]?\)|src=["'](assets\/[^"']+)["']/g;

let finalHtml = htmlContent;
let match;
const processedAssets = new Set();

while ((match = assetRegex.exec(htmlContent)) !== null) {
    const assetPathMatch = match[1] || match[2];

    if (processedAssets.has(assetPathMatch)) continue;
    processedAssets.add(assetPathMatch);

    const fullAssetPath = path.join(__dirname, assetPathMatch);
    if (fs.existsSync(fullAssetPath)) {
        console.log(`Encoding ${assetPathMatch}...`);
        const mimeType = getMimeType(assetPathMatch);
        const base64Str = base64Encode(fullAssetPath);
        const dataUri = `data:${mimeType};base64,${base64Str}`;

        // Replace globally
        finalHtml = finalHtml.split(assetPathMatch).join(dataUri);
    } else {
        console.warn(`Asset not found: ${fullAssetPath}`);
    }
}

// Fix relative pathing where url('assets...') might have been exactly matching or not
finalHtml = finalHtml.replace(/background-image: url\('data:/g, "background-image: url('data:");
// Ensure script tags or other things are intact

console.log("Writing final output...");
fs.writeFileSync(outputPath, finalHtml, 'utf8');
console.log(`Build complete! Output saved to ${outputPath}`);
console.log(`File size: ${(fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2)} MB`);
