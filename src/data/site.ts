export const PROMO_MESSAGES = [
  'Spedizione gratuita per ordini superiori a 79€',
  'Concept Drop 00 — La prima collezione è online',
  'Reso facile entro 14 giorni',
];

export const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Drops', to: '/drops' },
  { label: 'About', to: '/about' },
];

export const FOOTER_SHOP = [
  { label: 'Tutte le collezioni', to: '/drops' },
  { label: 'Felpe', to: '/shop?cat=felpe' },
  { label: 'T-shirt', to: '/shop?cat=t-shirt' },
  { label: 'Accessori', to: '/shop?cat=accessori' },
];

export const FOOTER_CONCEPT = [
  { label: 'About', to: '/about' },
  { label: 'Drop', to: '/drops' },
  { label: 'Lookbook', to: '/lookbook' },
  { label: 'Contatti', to: '/info/contatti' },
];

export const LEGAL_LINKS = [
  { label: 'Privacy', to: '/info/privacy' },
  { label: 'Termini e condizioni', to: '/info/termini' },
  { label: 'Cookie', to: '/info/cookie' },
];

export const SOCIAL_LINKS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
] as const;

export const INFO_PAGES: Record<string, { title: string; paragraphs: string[] }> = {
  privacy: {
    title: 'Privacy',
    paragraphs: [
      'Questa pagina ospiterà l’informativa sul trattamento dei dati personali di CONCEPT.',
      'Il prototipo non raccoglie, non invia e non conserva dati personali: i moduli (newsletter, accesso, contatti) sono simulati nel browser.',
    ],
  },
  termini: {
    title: 'Termini e condizioni',
    paragraphs: [
      'Questa pagina ospiterà le condizioni generali di vendita di CONCEPT.',
      'Prezzi, tempi di spedizione e politiche di reso mostrati nel sito sono esempi dimostrativi e non costituiscono un’offerta commerciale.',
    ],
  },
  cookie: {
    title: 'Cookie',
    paragraphs: [
      'Questa pagina ospiterà la cookie policy di CONCEPT.',
      'Il prototipo non utilizza cookie di profilazione né servizi di terze parti. Carrello e preferiti vengono salvati solo nella memoria locale del browser.',
    ],
  },
  contatti: {
    title: 'Contatti',
    paragraphs: [
      'Per collaborazioni, stampa e assistenza: i recapiti ufficiali verranno pubblicati al lancio.',
      'Nel frattempo iscriviti alla newsletter in fondo alla pagina per non perdere i prossimi drop.',
    ],
  },
};
