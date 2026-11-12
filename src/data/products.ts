import type { Category, Product, ProductDetail, Size } from './types';
import { getCollection } from './collections';
import hoodieOne from '../assets/images/hoodie-one-back.webp';
import hoodieTwo from '../assets/images/hoodie-two-back.webp';
import hoodieThree from '../assets/images/hoodie-three-back.webp';
import hoodieFront from '../assets/images/hoodie-front.webp';
import fabric from '../assets/images/fabric-detail.webp';
import teeOne from '../assets/images/tee-one.webp';
import teeTwo from '../assets/images/tee-two.webp';
import teeThree from '../assets/images/tee-three.webp';

export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const FREE_SHIPPING_THRESHOLD = 79;

export const categories: Category[] = [
  { id: 'felpe', label: 'Felpe', singular: 'Felpa' },
  { id: 't-shirt', label: 'T-shirt', singular: 'T-shirt' },
  { id: 'accessori', label: 'Accessori', singular: 'Accessorio' },
];

const SHIPPING: ProductDetail = {
  id: 'spedizione',
  title: 'Spedizione e resi',
  body: [
    'Spedizione rapida in 24/48h, gratuita per ordini superiori a 79€.',
    'Reso facile entro 14 giorni dalla consegna.',
    'Condizioni dimostrative: questo è un prototipo, nessun ordine viene realmente evaso.',
  ],
};

const hoodieDetails = (print: string): ProductDetail[] => [
  {
    id: 'dettagli',
    title: 'Dettagli',
    body: [
      '100% cotone premium garzato, 400 g/m².',
      `Stampa artistica ad alta definizione sul retro: ${print}.`,
      'Logo CONCEPT sul petto, cappuccio doppio senza coulisse.',
      'Fit oversize, spalla scesa, polsini e fondo a costine.',
    ],
  },
  {
    id: 'taglie',
    title: 'Guida alle taglie',
    body: ['Vestibilità oversize: scegli la tua taglia abituale. Per un fit più asciutto scendi di una taglia.'],
  },
  SHIPPING,
];

const teeDetails = (print: string): ProductDetail[] => [
  {
    id: 'dettagli',
    title: 'Dettagli',
    body: [
      '100% cotone pettinato, 240 g/m².',
      `Stampa artistica ad alta definizione sul retro: ${print}.`,
      'Girocollo a costina, taglio boxy.',
    ],
  },
  {
    id: 'taglie',
    title: 'Guida alle taglie',
    body: ['Taglio boxy leggermente corto: scegli la tua taglia abituale.'],
  },
  SHIPPING,
];

const hoodie = (
  collection: string,
  title: string,
  image: string,
  print: string,
  soldOut: Size[] = [],
): Product => ({
  id: `felpa-${collection}`,
  slug: `felpa-${collection}`,
  collection,
  category: 'felpe',
  name: `Felpa ${title}`,
  kind: 'Felpa Oversize',
  price: 69.9,
  description: [
    'Felpa in cotone premium, fit oversize.',
    'Stampa artistica ad alta definizione.',
    `Parte della collezione ${getCollection(collection)?.number}: ${title}.`,
  ],
  images: [
    { src: image, alt: `Felpa nera ${title}, retro con grafica` },
    { src: hoodieFront, alt: `Felpa nera ${title}, vista con logo CONCEPT` },
    { src: fabric, alt: 'Dettaglio del tessuto in cotone nero' },
  ],
  sizes: SIZES,
  soldOut,
  details: hoodieDetails(print),
});

const tee = (collection: string, title: string, image: string, print: string, soldOut: Size[] = []): Product => ({
  id: `tee-${collection}`,
  slug: `t-shirt-${collection}`,
  collection,
  category: 't-shirt',
  name: `T-shirt ${title}`,
  kind: 'T-shirt Boxy',
  price: 39.9,
  description: [
    'T-shirt in cotone pesante, taglio boxy.',
    'Stampa artistica ad alta definizione.',
    `Parte della collezione ${getCollection(collection)?.number}: ${title}.`,
  ],
  images: [
    { src: image, alt: `T-shirt nera ${title} con grafica` },
    { src: fabric, alt: 'Dettaglio del tessuto in cotone nero' },
  ],
  sizes: SIZES,
  soldOut,
  details: teeDetails(print),
});

export const products: Product[] = [
  hoodie('set-you-free', 'Set You Free', hoodieThree, 'statue classiche e gigli a colori'),
  hoodie('behind-the-veil', 'Behind the Veil', hoodieOne, 'figura velata con corona', ['XS']),
  hoodie('broke-the-cage', 'Broke the Cage', hoodieTwo, 'cuore anatomico in gabbia', ['XXL']),
  tee('set-you-free', 'Set You Free', teeThree, 'statue classiche e gigli a colori'),
  tee('behind-the-veil', 'Behind the Veil', teeOne, 'figura velata con corona'),
  tee('broke-the-cage', 'Broke the Cage', teeTwo, 'cuore anatomico in gabbia', ['XS', 'S']),
];

export const FEATURED_PRODUCT_SLUG = 'felpa-set-you-free';

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const productsByCollection = (slug: string) => products.filter((p) => p.collection === slug);

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export function searchProducts(query: string): Product[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return products.filter((p) => {
    const c = getCollection(p.collection);
    const haystack = normalize([p.name, p.kind, p.category, c?.number, c?.title].join(' '));
    return terms.every((t) => haystack.includes(t));
  });
}

export const SIZE_CHART: { size: Size; chest: number; length: number; sleeve: number }[] = [
  { size: 'XS', chest: 58, length: 66, sleeve: 58 },
  { size: 'S', chest: 61, length: 68, sleeve: 59 },
  { size: 'M', chest: 64, length: 70, sleeve: 60 },
  { size: 'L', chest: 67, length: 72, sleeve: 61 },
  { size: 'XL', chest: 70, length: 74, sleeve: 62 },
  { size: 'XXL', chest: 73, length: 76, sleeve: 63 },
];
