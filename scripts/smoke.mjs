// Test di fumo delle interazioni principali. Richiede il dev server attivo.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import assert from 'node:assert/strict';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const OUT = process.env.SHOTS_DIR ?? '.shots';
await mkdir(OUT, { recursive: true });
const cached = `${homedir()}/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`;
const browser = await chromium.launch(
  process.env.CHROME_PATH || existsSync(cached) ? { executablePath: process.env.CHROME_PATH ?? cached } : {},
);
const errors = [];
const results = [];
const step = async (name, fn) => {
  try {
    await fn();
    results.push(`ok   ${name}`);
  } catch (e) {
    results.push(`FAIL ${name}: ${e.message.split('\n').slice(0, 3).join(' ')}`);
  }
};

// ---------- DESKTOP ----------
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

await page.goto(BASE + '/prodotto/felpa-set-you-free', { waitUntil: 'networkidle' });

await step('nessun overflow orizzontale su tablet', async () => {
  await page.setViewportSize({ width: 800, height: 1100 });
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await page.setViewportSize({ width: 1440, height: 900 });
  assert.ok(overflow <= 1, `overflow ${overflow}px`);
});

await step('selezione taglia', async () => {
  await page.getByRole('radio', { name: 'L', exact: true }).click();
  assert.equal(await page.getByRole('radio', { name: 'L', exact: true }).getAttribute('aria-checked'), 'true');
});
await step('quantità', async () => {
  await page.getByRole('button', { name: 'Aumenta quantità' }).first().click();
  assert.equal((await page.locator('[aria-label="Quantità"] [aria-live]').first().textContent()).trim(), '2');
});
await step('galleria: miniatura e frecce', async () => {
  const before = await page.locator('[aria-roledescription="carosello"] img').first().getAttribute('src');
  await page.getByRole('button', { name: 'Mostra immagine 2 di 3' }).click();
  await page.waitForTimeout(700);
  const after = await page.locator('[aria-roledescription="carosello"] img').last().getAttribute('src');
  assert.notEqual(before, after);
  await page.getByRole('button', { name: 'Immagine successiva' }).click();
  await page.waitForTimeout(700);
});
await step('accordion', async () => {
  const trigger = page.getByRole('button', { name: 'Dettagli' });
  await trigger.click();
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/x-accordion.png` });
  await trigger.click();
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
});
await step('guida taglie', async () => {
  await page.getByRole('button', { name: 'Guida alle taglie' }).first().click();
  await page.getByRole('dialog', { name: 'Guida alle taglie' }).waitFor();
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${OUT}/x-size-guide.png` });
  await page.keyboard.press('Escape');
  await page.getByRole('dialog', { name: 'Guida alle taglie' }).waitFor({ state: 'detached' });
});
await step('preferiti', async () => {
  const wish = page.getByRole('button', { name: 'Aggiungi ai preferiti' }).first();
  await wish.click();
  await page.getByRole('button', { name: 'Rimuovi dai preferiti' }).first().waitFor();
});
await step('aggiungi al carrello → drawer', async () => {
  await page.getByRole('button', { name: 'Aggiungi al carrello' }).click();
  const drawer = page.getByRole('dialog', { name: 'Carrello' });
  await drawer.waitFor();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/x-cart.png` });
  assert.match(await drawer.textContent(), /Taglia L/);
  assert.match(await drawer.textContent(), /€139,80/);
});
await step('carrello: quantità, subtotale, rimozione, vuoto', async () => {
  const drawer = page.getByRole('dialog', { name: 'Carrello' });
  await drawer.getByRole('button', { name: 'Diminuisci quantità' }).click();
  await page.waitForTimeout(200);
  assert.match(await drawer.textContent(), /Ti mancano €9,10/);
  await drawer.getByRole('button', { name: 'Procedi al checkout' }).click();
  assert.match(await drawer.textContent(), /Checkout dimostrativo/);
  await drawer.getByRole('button', { name: 'Torna al carrello' }).click();
  await drawer.getByRole('button', { name: /^Rimuovi/ }).click();
  await page.waitForTimeout(400);
  assert.match(await drawer.textContent(), /Il carrello è vuoto/);
  await page.keyboard.press('Escape');
  await drawer.waitFor({ state: 'detached' });
});
await step('ricerca', async () => {
  await page.getByRole('button', { name: 'Cerca', exact: true }).click();
  await page.getByRole('dialog', { name: 'Ricerca' }).waitFor();
  await page.getByRole('searchbox').fill('cage');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/x-search.png` });
  assert.match(await page.getByRole('dialog', { name: 'Ricerca' }).textContent(), /2 risultati/);
  await page.getByRole('dialog', { name: 'Ricerca' }).getByRole('link').first().click();
  await page.waitForURL(/prodotto\/felpa-broke-the-cage/);
  await page.getByRole('button', { name: 'Cerca', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog', { name: 'Ricerca' }).waitFor({ state: 'detached' });
});
await step('account mock', async () => {
  await page.getByRole('button', { name: 'Accedi' }).click();
  const modal = page.getByRole('dialog');
  await modal.getByRole('button', { name: 'Accedi' }).last().click();
  assert.match(await modal.textContent(), /email valido/);
  await modal.getByPlaceholder('Email').fill('demo@concept.test');
  await modal.getByPlaceholder('Password').fill('segreta1');
  await page.screenshot({ path: `${OUT}/x-account.png` });
  await modal.getByRole('button', { name: 'Accedi' }).last().click();
  await page.waitForTimeout(300);
  assert.match(await modal.textContent(), /demo@concept.test/);
  await page.keyboard.press('Escape');
});
await step('newsletter', async () => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const input = page.getByPlaceholder('La tua email');
  await input.scrollIntoViewIfNeeded();
  await input.fill('non-valida');
  await page.getByRole('button', { name: 'Iscriviti alla newsletter' }).click();
  await page.getByText('Inserisci un indirizzo email valido.').waitFor();
  await input.fill('demo@concept.test');
  await page.getByRole('button', { name: 'Iscriviti alla newsletter' }).click();
  await page.getByText(/Iscrizione simulata/).waitFor();
});
await step('carosello collezioni + navigazione', async () => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const next = page.getByRole('button', { name: 'Collezioni successive' });
  await next.scrollIntoViewIfNeeded();
  await next.click();
  await page.waitForTimeout(900);
  const x = await page.evaluate(() => document.querySelector('section ul.snap-x').scrollLeft);
  assert.ok(x > 100, `scrollLeft ${x}`);
  await page.screenshot({ path: `${OUT}/x-carousel.png` });
  await page.getByRole('link', { name: /Concept Three/ }).click();
  await page.waitForURL(/drops\/set-you-free/);
});
await step('promo ticker', async () => {
  const region = page.getByRole('region', { name: 'Promozioni' });
  await region.getByRole('button', { name: 'Messaggio successivo' }).click();
  await page.waitForTimeout(700);
  assert.match(await region.textContent(), /Drop 00/);
});
await step('tempesta: fotogrammi con fulmine', async () => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.locator('#drop-00-title').scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 200);
  let best = 0;
  for (let i = 0; i < 140; i++) {
    const o = await page.evaluate(() => parseFloat(document.querySelector('section[aria-labelledby="drop-00-title"] img.mix-blend-screen')?.style.opacity || '0'));
    if (o > best) {
      best = o;
      if (o > 0.12) await page.screenshot({ path: `${OUT}/x-lightning.png` });
    }
    await page.waitForTimeout(90);
  }
  assert.ok(best > 0.05, `flash max ${best}`);
});
await desktop.close();

// ---------- MOBILE ----------
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const m = await mobile.newPage();
m.on('pageerror', (e) => errors.push(e.message));
await m.goto(BASE + '/', { waitUntil: 'networkidle' });
await step('menu mobile', async () => {
  await m.getByRole('button', { name: 'Apri il menu' }).tap();
  await m.getByRole('dialog', { name: 'Menu' }).waitFor();
  await m.waitForTimeout(1300);
  await m.screenshot({ path: `${OUT}/x-menu-mobile.png` });
  await m.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: /Shop/ }).tap();
  await m.waitForURL(/\/shop/);
  await m.getByRole('dialog', { name: 'Menu' }).waitFor({ state: 'detached' });
});
await step('filtro shop mobile + stato vuoto', async () => {
  await m.getByRole('button', { name: 'Accessori' }).tap();
  await m.getByText('Accessori in arrivo').waitFor();
  await m.getByRole('button', { name: 'Felpe' }).tap();
  await m.waitForTimeout(500);
  assert.equal(await m.locator('article').count(), 3);
});
await step('carrello mobile', async () => {
  await m.goto(BASE + '/prodotto/felpa-set-you-free', { waitUntil: 'networkidle' });
  await m.getByRole('button', { name: 'Aggiungi al carrello' }).tap();
  await m.getByRole('dialog', { name: 'Carrello' }).waitFor();
  await m.waitForTimeout(800);
  await m.screenshot({ path: `${OUT}/x-cart-mobile.png` });
});
await mobile.close();

// ---------- REDUCED MOTION ----------
const reduced = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const r = await reduced.newPage();
r.on('pageerror', (e) => errors.push(e.message));
await step('prefers-reduced-motion: nessun lampo', async () => {
  await r.goto(BASE + '/', { waitUntil: 'networkidle' });
  await r.locator('#drop-00-title').scrollIntoViewIfNeeded();
  let best = 0;
  for (let i = 0; i < 60; i++) {
    best = Math.max(best, await r.evaluate(() => parseFloat(document.querySelector('section[aria-labelledby="drop-00-title"] img.mix-blend-screen')?.style.opacity || '0')));
    await r.waitForTimeout(100);
  }
  assert.equal(best, 0);
});
await reduced.close();
await browser.close();

console.log(results.join('\n'));
console.log(errors.length ? `\nERRORI CONSOLE:\n${[...new Set(errors)].join('\n')}` : '\nNessun errore in console.');
process.exit(results.some((r) => r.startsWith('FAIL')) || errors.length ? 1 : 0);
