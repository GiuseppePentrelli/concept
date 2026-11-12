export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type CategoryId = 'felpe' | 't-shirt' | 'accessori';

export interface Category {
  id: CategoryId;
  label: string;
  singular: string;
}

export interface Collection {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  spectrum?: boolean;
  status: 'live' | 'upcoming';
}

export interface ProductDetail {
  id: 'dettagli' | 'taglie' | 'spedizione';
  title: string;
  body: string[];
}

export interface Product {
  id: string;
  slug: string;
  collection: string;
  category: CategoryId;
  name: string;
  kind: string;
  price: number;
  description: string[];
  images: { src: string; alt: string }[];
  sizes: Size[];
  soldOut?: Size[];
  details: ProductDetail[];
}

export interface CartLine {
  productId: string;
  size: Size;
  quantity: number;
}
