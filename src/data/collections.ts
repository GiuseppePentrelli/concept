import type { Collection } from './types';
import one from '../assets/images/collection-one.webp';
import two from '../assets/images/collection-two.webp';
import three from '../assets/images/collection-three.webp';
import storm from '../assets/images/storm.webp';

export const DROP = {
  code: 'CONCEPT DROP 00',
  title: 'La prima collezione.',
  subtitle: "L'origine del concetto.",
  description:
    'Tre concetti, un solo inizio. Drop 00 raccoglie i primi capitoli di CONCEPT: capi oversize in cotone pesante, grafiche scultoree, tirature limitate.',
};

export const collections: Collection[] = [
  {
    slug: 'behind-the-veil',
    number: 'Concept One',
    title: 'Behind the Veil',
    tagline: 'Ciò che nascondi ti incorona.',
    description:
      'Una figura velata, una corona di spine. Il primo concetto parla di ciò che resta nascosto: identità, silenzio, attesa prima della rivelazione.',
    image: one,
    status: 'live',
  },
  {
    slug: 'broke-the-cage',
    number: 'Concept Two',
    title: 'Broke the Cage',
    tagline: 'Il cuore non accetta serrature.',
    description:
      'Un cuore anatomico chiuso tra costole di metallo. Il secondo concetto è la rottura: la gabbia cede, il lucchetto resta appeso.',
    image: two,
    status: 'live',
  },
  {
    slug: 'set-you-free',
    number: 'Concept Three',
    title: 'Set You Free',
    tagline: 'Dalla pietra, il colore.',
    description:
      "Due statue classiche si baciano dentro un'esplosione di gigli. Il terzo concetto è la liberazione: l'unico capitolo in cui il colore prende il sopravvento.",
    image: three,
    spectrum: true,
    status: 'live',
  },
  {
    slug: 'concept-four',
    number: 'Concept Four',
    title: 'In arrivo',
    tagline: 'Il prossimo capitolo è ancora pietra grezza.',
    description: 'Il quarto concetto non è ancora stato rivelato.',
    image: storm,
    status: 'upcoming',
  },
];

export const liveCollections = collections.filter((c) => c.status === 'live');

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
