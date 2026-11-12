// Screenshot di verifica visiva. Uso: npm run dev (in un altro terminale) e poi npm run shots
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const OUT = process.env.SHOTS_DIR ?? '.shots';
const only = process.argv.slice(2);
await mkdir(OUT, { recursive: true });

const cached = `${homedir()}/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`;
const browser = await chromium.launch(
  process.env.CHROME_PATH || existsSync(cached) ? { executablePath: process.env.CHROME_PATH ?? cached } : {},
);

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 800, height: 1100 },
  mobile: { width: 390, height: 844 },
};

const PAGES = [
  ['home', '/'],
  ['product', '/prodotto/felpa-set-you-free'],
  ['shop', '/shop'],
  ['drops', '/drops'],
  ['collection', '/drops/set-you-free'],
  ['about', '/about'],
];

const errors = [];

for (const [device, viewport] of Object.entries(VIEWPORTS)) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: device === 'mobile' ? 2 : 1,
    isMobile: device === 'mobile',
    hasTouch: device === 'mobile',
  });
  const page = await context.newPage();
  page.on('console', (m) => m.type() === 'error' && errors.push(`[${device}] ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`[${device}] ${e.message}`));

  for (const [name, path] of PAGES) {
    if (only.length && !only.includes(name) && !only.includes(device)) continue;
    if (device === 'tablet' && !['product', 'home'].includes(name)) continue;
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2600);
    await page.screenshot({ path: `${OUT}/${name}-${device}-fold.png` });
    // scorre tutta la pagina per attivare i reveal, poi torna su
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    await page.screenshot({ path: `${OUT}/${name}-${device}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) errors.push(`[${device}] ${name}: scroll orizzontale di ${overflow}px`);
  }
  await context.close();
}

await browser.close();
console.log(errors.length ? `PROBLEMI:\n${errors.join('\n')}` : 'Nessun errore console né overflow orizzontale.');
