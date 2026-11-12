# Asset

## Stato attuale

Le immagini in `src/assets/images/` sono state **generate con Codex (image generation)** partendo dai ritagli del mockup `references/concept-references.jpeg` come riferimento. Gli originali PNG sono in `assets-generated/`; `npm run assets` li converte in WebP (se un PNG manca, usa il ritaglio a bassa risoluzione del mockup).

| File | Origine | Note |
| --- | --- | --- |
| `hero-statue.webp` | generata, 1308×1203 | fedele al mockup |
| `storm.webp` | generata, 2172×724 | fedele al mockup |
| `collection-one/two/three.webp` | generate, 1303×1207 | fedeli al mockup |
| `hoodie-three-back.webp` | generata, 1219×1290 | ricrea la foto del mockup |
| `hoodie-one-back`, `hoodie-two-back`, `hoodie-front`, `tee-*`, `fabric-detail` | generate | capi non presenti nel mockup: sono proposte, non foto di prodotti reali |
| Logo (`src/components/ui/Logo.tsx`) | ridisegnato a mano in SVG | da sostituire con il vettoriale ufficiale |
| Collezione "Concept Four" | riusa `storm.webp` scurito | serve un artwork teaser dedicato |

## Da produrre per il sito reale

- **Foto vere dei capi**: le immagini generate non rappresentano prodotti esistenti e le grafiche stampate non sono identiche pixel per pixel agli artwork.
- **Artwork e logo originali** in alta risoluzione / vettoriale dal brand.
- **Acqua della hero**: un video loop con canale alpha di colature reali, o una maschera delle zone bagnate, per sostituire i rivoli disegnati su Canvas lungo percorsi tracciati a mano.
- **Tempesta**: livelli separati (rocce, nuvole) per un parallax vero e una versione "illuminata" della scena; oggi il lampo schiarisce la stessa immagine.
- **Font** proprietari, se il brand ne ha (ora Cormorant Garamond e Jost).
