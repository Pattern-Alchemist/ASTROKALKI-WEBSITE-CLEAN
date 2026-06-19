import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = '/home/z/my-project/public/3d';

const images = [
  {
    name: 'hero-memory-chamber',
    prompt: 'Dark glass memory chamber floating in black void, layered reflective panels, golden emotional fault lines, cinematic atmospheric lighting, premium editorial aesthetic, hyper realistic 3D render, negative space for website text overlay, composition balanced for hero section, center-right focal point, ultra dark background, deep black void, luxury psychological archive',
    size: '1344x768',
  },
  {
    name: 'hero-behavioral-compass',
    prompt: 'An elegant black-metal compass with fractured gold geometry, symbolizing hidden life direction and subconscious patterns, floating in darkness, cinematic luxury lighting, negative space for website text overlay, composition balanced for hero section, center-right focal point, ultra dark background, deep black void, premium editorial aesthetic, hyper realistic 3D render, psychological symbolism',
    size: '1344x768',
  },
  {
    name: 'hero-karmic-architecture',
    prompt: 'Abstract black architectural structure made of obsidian and smoked glass, impossible geometry, subtle gold pathways illuminating hidden routes, psychological symbolism, premium 3D cinematic render, negative space for website text overlay, composition balanced for hero section, center-right focal point, ultra dark background, deep black void, luxury editorial',
    size: '1344x768',
  },
  {
    name: 'portrait-vault-relic',
    prompt: 'A mysterious psychological vault relic floating in dark void, cracked obsidian vessel emitting golden light from within, emotional artifacts suspended around it, cinematic atmospheric lighting, premium editorial aesthetic, hyper realistic 3D render, vertical composition, dark luxury, psychological archive theme',
    size: '864x1152',
  },
  {
    name: 'service-shadow-archive',
    prompt: 'Dark crystalline shadow archive, fractured glass panels revealing hidden psychological patterns, golden fault lines tracing emotional history, floating in black void, cinematic lighting, luxury editorial aesthetic, hyper realistic 3D render, square composition, center focal point, deep black background',
    size: '1024x1024',
  },
  {
    name: 'service-relationship-prism',
    prompt: 'A dark obsidian prism refracting golden relationship threads, two mirror faces reflecting distorted emotional patterns, floating in deep black void, cinematic atmospheric lighting, premium editorial aesthetic, hyper realistic 3D render, square composition, center focal point, psychological archive',
    size: '1024x1024',
  },
  {
    name: 'service-emotional-blueprint',
    prompt: 'Dark smoked glass emotional blueprint, golden circuit-like pathways mapping subconscious patterns, hidden architecture of feelings, floating in black void, cinematic atmospheric lighting, premium editorial aesthetic, hyper realistic 3D render, square composition, center focal point, psychological archive',
    size: '1024x1024',
  },
  {
    name: 'bg-dark-void-texture',
    prompt: 'Ultra dark void texture, subtle obsidian glass reflections, faint golden atmospheric particles, deep black gradient with barely visible architectural fragments, cinematic atmospheric mood, luxury editorial background, minimal and dark, hyper realistic 3D render, wide composition',
    size: '1440x720',
  },
];

async function main() {
  const zai = await ZAI.create();

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Generating ${images.length} Psychological Archive images...\n`);

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const outputPath = path.join(OUTPUT_DIR, `${img.name}.png`);
    
    console.log(`[${i + 1}/${images.length}] Generating: ${img.name} (${img.size})`);
    console.log(`  Prompt: ${img.prompt.substring(0, 80)}...`);

    try {
      const response = await zai.images.generations.create({
        prompt: img.prompt,
        size: img.size,
      });

      const imageBase64 = response.data[0].base64;
      const buffer = Buffer.from(imageBase64, 'base64');
      fs.writeFileSync(outputPath, buffer);

      const sizeKB = (buffer.length / 1024).toFixed(0);
      console.log(`  ✓ Saved: ${outputPath} (${sizeKB} KB)\n`);
    } catch (error: any) {
      console.error(`  ✗ Failed: ${img.name} - ${error.message}\n`);
    }
  }

  console.log('Generation complete!');
}

main().catch(console.error);
