const fs = require('fs');
const path = require('path');
const https = require('https');

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const API_KEY = process.env.GOOGLE_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '../public/drivers');

const DRIVERS = [
  { id: 1,  name: "Lando Norris",      team: "McLaren",         color: "#FF8000" },
  { id: 2,  name: "Oscar Piastri",     team: "McLaren",         color: "#FF8000" },
  { id: 3,  name: "Kimi Antonelli",    team: "Mercedes",        color: "#27F4D2" },
  { id: 4,  name: "Charles Leclerc",   team: "Ferrari",         color: "#E8002D" },
  { id: 5,  name: "Lewis Hamilton",    team: "Ferrari",         color: "#E8002D" },
  { id: 6,  name: "Max Verstappen",    team: "Red Bull Racing", color: "#3671C6" },
  { id: 7,  name: "George Russell",    team: "Mercedes",        color: "#27F4D2" },
  { id: 8,  name: "Isack Hadjar",      team: "Red Bull Racing", color: "#3671C6" },
  { id: 9,  name: "Pierre Gasly",      team: "Alpine",          color: "#FF87BC" },
  { id: 10, name: "Carlos Sainz",      team: "Williams",        color: "#64C4FF" },
  { id: 11, name: "Alexander Albon",   team: "Williams",        color: "#64C4FF" },
  { id: 12, name: "Fernando Alonso",   team: "Aston Martin",    color: "#229971" },
  { id: 13, name: "Lance Stroll",      team: "Aston Martin",    color: "#229971" },
  { id: 14, name: "Oliver Bearman",    team: "Haas",            color: "#B6BABD" },
  { id: 15, name: "Esteban Ocon",      team: "Haas",            color: "#B6BABD" },
  { id: 16, name: "Nico Hulkenberg",   team: "Audi",            color: "#C60000" },
  { id: 17, name: "Liam Lawson",       team: "Racing Bulls",    color: "#6692FF" },
  { id: 18, name: "Gabriel Bortoleto", team: "Audi",            color: "#C60000" },
  { id: 19, name: "Arvid Lindblad",    team: "Racing Bulls",    color: "#6692FF" },
  { id: 20, name: "Franco Colapinto",  team: "Alpine",          color: "#FF87BC" },
  { id: 21, name: "Sergio Perez",      team: "Cadillac",        color: "#CC1020" },
  { id: 22, name: "Valtteri Bottas",   team: "Cadillac",        color: "#CC1020" },
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateImage(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1, aspectRatio: "1:1" }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.predictions && json.predictions[0]?.bytesBase64Encoded) {
            resolve(json.predictions[0].bytesBase64Encoded);
          } else {
            reject(new Error(JSON.stringify(json)));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  if (!API_KEY) {
    console.error('Missing GOOGLE_API_KEY in .env.local');
    process.exit(1);
  }

  console.log(`Generating portraits for ${DRIVERS.length} drivers...\n`);

  for (const driver of DRIVERS) {
    const filename = `driver-${driver.id}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);

    const prompt = `Formula 1 racing driver portrait illustration, ${driver.name}, ${driver.team} F1 team colors (${driver.color}), no helmet, face visible, wearing fireproof racing suit collar, confident expression, dramatic studio lighting, plain white background, highly stylized graphic art style, bold colors, clean modern design, no text, square composition, headshot`;

    try {
      console.log(`🎨 Generating ${driver.name} (${driver.team})...`);
      const base64 = await generateImage(prompt);
      fs.writeFileSync(filepath, Buffer.from(base64, 'base64'));
      console.log(`✅ Saved ${filename}`);
    } catch (err) {
      console.error(`❌ Failed ${driver.name}:`, err.message);
    }

    // Rate limit: 1 request per second
    await sleep(1200);
  }

  console.log('\n✅ Done! Images saved to public/drivers/');
}

main();
