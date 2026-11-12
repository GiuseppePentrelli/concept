// Ricava gli asset placeholder dai ritagli del mockup di riferimento.
// Sono segnaposto a bassa risoluzione (upscaling dal collage): vedi ASSETS_NEEDED.md.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const SRC = 'references/concept-references.jpeg';
const OUT = 'src/assets/images';
await mkdir(OUT, { recursive: true });

const crop = (r) => sharp(SRC).extract(r).png().toBuffer();

async function feather(buf, f) {
  const { width: w, height: h } = await sharp(buf).metadata();
  const mask = await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="${f}" y="${f}" width="${w - 2 * f}" height="${h - 2 * f}" fill="#fff"/></svg>`,
    ),
  )
    .blur(Math.max(0.5, f / 2))
    .extractChannel(0)
    .toBuffer();
  return sharp(buf).removeAlpha().joinChannel(mask).png().toBuffer();
}

// Rimuove scritte e icone sottili sovrapposte alla fotografia con un filtro mediano locale.
async function inpaint(buf, rects, size = 9) {
  const layers = [];
  for (const r of rects) {
    const patch = await sharp(buf).extract(r).median(size).blur(1.2).png().toBuffer();
    layers.push({ input: await feather(patch, 3), left: r.left, top: r.top });
  }
  return sharp(buf).composite(layers).png().toBuffer();
}

const up = (buf, width, opts = {}) =>
  sharp(buf)
    .resize({ width, kernel: 'lanczos3' })
    .sharpen({ sigma: opts.sigma ?? 1.1, m1: 0.6, m2: 1.6 });

// ---------- HERO ----------
{
  const O = { left: 290, top: 72, width: 478, height: 440 };
  let b = await crop(O);
  b = await inpaint(b, [{ left: 0, top: 146, width: 118, height: 78 }], 11);
  await up(b, 1912).webp({ quality: 88 }).toFile(`${OUT}/hero-statue.webp`);
}

// ---------- COLLEZIONI ----------
const ART = {
  one: { left: 53, top: 558, width: 212, height: 197 },
  two: { left: 286, top: 558, width: 210, height: 197 },
  three: { left: 517, top: 558, width: 211, height: 197 },
};
const artBuf = {};
for (const [k, r] of Object.entries(ART)) {
  artBuf[k] = await crop(r);
  await up(artBuf[k], 848).webp({ quality: 90 }).toFile(`${OUT}/collection-${k}.webp`);
}

// ---------- BANNER DROP 00 ----------
{
  const O = { left: 12, top: 865, width: 756, height: 200 };
  let b = await crop(O);
  b = await inpaint(
    b,
    [
      { left: 219, top: 40, width: 346, height: 34 },
      { left: 271, top: 78, width: 236, height: 38 },
      { left: 275, top: 127, width: 216, height: 42 },
    ],
    11,
  );
  await up(b, 2268, { sigma: 1.4 }).webp({ quality: 86 }).toFile(`${OUT}/storm.webp`);
}

// ---------- PRODOTTI ----------
const HO = { left: 872, top: 92, width: 308, height: 326 };
const S = 4;
const W = HO.width * S;
const H = HO.height * S;

let hoodie = await crop(HO);
hoodie = await inpaint(
  hoodie,
  [
    { left: 4, top: 160, width: 16, height: 22 },
    { left: 291, top: 160, width: 16, height: 22 },
  ],
  9,
);
const hoodieBig = await up(hoodie, W).png().toBuffer();

const edge = async (buf) => {
  const mask = await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect x="70" y="70" width="${W - 140}" height="${H - 140}" rx="120" fill="#fff"/></svg>`,
    ),
  )
    .blur(40)
    .extractChannel(0)
    .toBuffer();
  return sharp(buf).removeAlpha().joinChannel(mask).webp({ quality: 90 });
};

await (await edge(hoodieBig)).toFile(`${OUT}/hoodie-three-back.webp`);

// Felpa "pulita": la stampa viene coperta con il colore del tessuto.
const cover = await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#080808"/><stop offset=".5" stop-color="#060606"/><stop offset="1" stop-color="#040404"/></linearGradient></defs>
    <rect x="${84 * S}" y="${84 * S}" width="${140 * S}" height="${206 * S}" rx="90" fill="url(#g)"/>
  </svg>`,
  ),
)
  .blur(34)
  .png()
  .toBuffer();
const clean = await sharp(hoodieBig).composite([{ input: cover }]).png().toBuffer();

const star = (cx, cy, r, fill = '#e9e7e2') =>
  `<path transform="translate(${cx - r} ${cy - r}) scale(${(2 * r) / 100})" fill="${fill}" d="M50 0C52 36 60 44 100 48C60 53 53 60 50 100C47 60 40 53 0 48C40 44 48 36 50 0Z"/>`;

const chest = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    ${star(W / 2, 128 * S, 26)}
    <text x="${W / 2 + 4}" y="${141 * S}" text-anchor="middle" font-family="serif" font-size="22" letter-spacing="9" fill="#d9d7d2">CONCEPT</text>
  </svg>`,
);
await (await edge(await sharp(clean).composite([{ input: chest }]).png().toBuffer())).toFile(
  `${OUT}/hoodie-front.webp`,
);

async function printOn(base, art, { width, left, top }) {
  const a = await sharp(art)
    .resize({ width, kernel: 'lanczos3' })
    .linear(1.25, -30)
    .png()
    .toBuffer();
  const meta = await sharp(a).metadata();
  const f = Math.round(width * 0.09);
  const vign = await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}"><rect width="100%" height="100%" fill="#000"/><rect x="${f}" y="${f}" width="${meta.width - 2 * f}" height="${meta.height - 2 * f}" rx="${f}" fill="#fff"/></svg>`,
    ),
  )
    .blur(f / 2)
    .png()
    .toBuffer();
  const masked = await sharp(a).composite([{ input: vign, blend: 'multiply' }]).png().toBuffer();
  return sharp(base).composite([{ input: masked, left, top, blend: 'screen' }]).png().toBuffer();
}

const caption = (line1, line2) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <text x="${W / 2}" y="${262 * S}" text-anchor="middle" font-family="serif" font-size="24" letter-spacing="9" fill="#bdbbb6">${line1}</text>
      <text x="${W / 2}" y="${271 * S}" text-anchor="middle" font-family="serif" font-size="34" letter-spacing="10" fill="#e4e2dd">${line2}</text>
      ${star(W / 2, 281 * S, 18)}
    </svg>`,
  );

const PRINT = { width: 150 * S, left: 79 * S, top: 100 * S };
for (const [k, l1, l2] of [
  ['one', 'CONCEPT ONE:', 'BEHIND THE VEIL'],
  ['two', 'CONCEPT TWO:', 'BROKE THE CAGE'],
]) {
  let b = await printOn(clean, artBuf[k], PRINT);
  b = await sharp(b).composite([{ input: caption(l1, l2) }]).png().toBuffer();
  await (await edge(b)).toFile(`${OUT}/hoodie-${k}-back.webp`);
}

// Dettaglio tessuto (miniatura 3 del riferimento)
{
  const b = await crop({ left: 806, top: 288, width: 48, height: 70 });
  const d = await sharp(b).resize({ width: W, height: H, fit: 'cover', kernel: 'cubic' }).blur(3).png().toBuffer();
  await (await edge(d)).toFile(`${OUT}/fabric-detail.webp`);
}

// T-shirt: sagoma vettoriale segnaposto con stampa applicata.
const tee = await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 308 326">
      <defs>
        <radialGradient id="bg" cx="50%" cy="46%" r="62%"><stop offset="0" stop-color="#343434"/><stop offset=".6" stop-color="#1f1f1f"/><stop offset="1" stop-color="#151515"/></radialGradient>
        <linearGradient id="f" x1="0" x2="1"><stop offset="0" stop-color="#080808"/><stop offset=".22" stop-color="#111"/><stop offset=".5" stop-color="#0e0e0e"/><stop offset=".8" stop-color="#111"/><stop offset="1" stop-color="#070707"/></linearGradient>
        <filter id="s"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="s2"><feGaussianBlur stdDeviation="1.2"/></filter>
      </defs>
      <rect width="308" height="326" fill="url(#bg)"/>
      <ellipse cx="154" cy="304" rx="96" ry="6" fill="#000" opacity=".7" filter="url(#s)"/>
      <path fill="url(#f)" d="M112 40C126 47 140 50 154 50C168 50 182 47 196 40L252 62C262 66 268 73 271 83L290 142L250 158L238 124L238 290C238 296 234 300 228 300L80 300C74 300 70 296 70 290L70 124L58 158L18 142L37 83C40 73 46 66 56 62Z"/>
      <path d="M112 40C126 47 140 50 154 50C168 50 182 47 196 40" fill="none" stroke="#1f1f1f" stroke-width="5"/>
      <path d="M70 124L74 96M238 124L234 96" stroke="#000" stroke-width="2" opacity=".8" filter="url(#s2)"/>
      <path d="M96 150C100 200 92 250 100 298M214 150C210 205 218 250 208 298" stroke="#1a1a1a" stroke-width="6" fill="none" opacity=".5" filter="url(#s)"/>
    </svg>`,
  ),
)
  .png()
  .toBuffer();

const TPRINT = { width: 136 * S, left: 86 * S, top: 84 * S };
for (const k of ['one', 'two', 'three']) {
  const b = await printOn(tee, artBuf[k], TPRINT);
  await (await edge(b)).toFile(`${OUT}/tee-${k}.webp`);
}

// ---------- IMMAGINI GENERATE (assets-generated/) ----------
// Se presenti, le immagini ad alta qualità generate con Codex sostituiscono i ritagli del mockup.
const GEN = 'assets-generated';
const used = [];
const plain = { 'statue.png': ['hero-statue.webp', 2000], 'storm.png': ['storm.webp', 2400] };
for (const k of ['one', 'two', 'three']) plain[`art-${k}.png`] = [`collection-${k}.webp`, 1400];
for (const [file, [target, width]] of Object.entries(plain)) {
  if (!existsSync(`${GEN}/${file}`)) continue;
  await sharp(`${GEN}/${file}`).resize({ width, withoutEnlargement: true }).webp({ quality: 90 }).toFile(`${OUT}/${target}`);
  used.push(file);
}
const shots = ['hoodie-three-back', 'hoodie-one-back', 'hoodie-two-back', 'hoodie-front', 'tee-one', 'tee-two', 'tee-three', 'fabric-detail'];
for (const name of shots) {
  if (!existsSync(`${GEN}/${name}.png`)) continue;
  const b = await sharp(`${GEN}/${name}.png`).resize({ width: W, height: H, fit: 'cover' }).png().toBuffer();
  await (await edge(b)).toFile(`${OUT}/${name}.webp`);
  used.push(`${name}.png`);
}

console.log('asset estratti in', OUT, used.length ? `— sostituiti da immagini generate: ${used.join(', ')}` : '');
