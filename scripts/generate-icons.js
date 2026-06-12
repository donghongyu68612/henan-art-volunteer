const sharp = require('C:\\Users\\dongliang\\AppData\\Roaming\\npm\\node_modules\\sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'icons');

async function main() {
  for (const size of sizes) {
    const svgPath = path.join(iconsDir, `icon-${size}.svg`);
    const pngPath = path.join(iconsDir, `icon-${size}.png`);

    if (!fs.existsSync(svgPath)) {
      console.error(`  SKIP: ${svgPath} not found`);
      continue;
    }

    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(pngPath);

    const stat = fs.statSync(pngPath);
    console.log(`  ✓ icon-${size}.png  (${(stat.size / 1024).toFixed(1)} KB)`);
  }
  console.log('\nAll PNG icons generated!');
}

main().catch(err => { console.error(err); process.exit(1); });
