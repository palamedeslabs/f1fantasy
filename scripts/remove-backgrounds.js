const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const path = require('path');

const DRIVERS_DIR = path.join(__dirname, '../public/drivers');

async function main() {
  const files = fs.readdirSync(DRIVERS_DIR).filter(f => f.endsWith('.png') && !f.includes('-nobg'));
  console.log(`Removing backgrounds from ${files.length} images...\n`);

  for (const file of files) {
    const inputPath = path.join(DRIVERS_DIR, file);
    const outputPath = path.join(DRIVERS_DIR, file); // overwrite in place

    try {
      console.log(`🎨 Processing ${file}...`);
      const imageData = fs.readFileSync(inputPath);
      const blob = new Blob([imageData], { type: 'image/png' });

      const result = await removeBackground(blob, {
        model: 'medium',
        output: { format: 'image/png', quality: 1.0 }
      });

      const buffer = Buffer.from(await result.arrayBuffer());
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ Done ${file}`);
    } catch (err) {
      console.error(`❌ Failed ${file}:`, err.message);
    }
  }

  console.log('\n✅ All backgrounds removed!');
}

main();
