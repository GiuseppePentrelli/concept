# CONCEPT — prototipo e-commerce

Prototipo frontend navigabile (React + TypeScript + Vite + Tailwind + Motion). Nessun backend: catalogo, carrello, ricerca, account e newsletter sono simulati nel browser.

## Avvio

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + build di produzione in dist/
npm run preview  # anteprima della build
```

## Script di supporto

- `npm run assets` — rigenera le immagini segnaposto dal mockup in `references/` (vedi `ASSETS_NEEDED.md`).
- `npm run shots` — screenshot desktop/tablet/mobile di tutte le pagine in `.shots/` (dev server attivo).
- `npm run smoke` — test delle interazioni principali con Playwright (dev server attivo).

Gli ultimi due richiedono Chromium di Playwright (`npx playwright install chromium`) e le sue librerie di sistema; in alternativa `CHROME_PATH=/percorso/chrome`.

## Struttura

```
src/
  assets/images/      immagini (segnaposto)
  data/               catalogo, collezioni e testi mock tipizzati
  store/              stato carrello (localStorage) e UI (overlay, toast, preferiti, utente mock)
  lib/                easing, loop canvas, sistema dei rivoli d'acqua, comportamento overlay
  components/
    layout/           AnnouncementBar, Header, MobileNavigation, Footer, Newsletter
    home/             HeroSection, WaterEffect, CollectionsSection, CollectionCard, StormBanner, LightningEffect
    product/          ProductGallery, ProductInfo, SizeSelector, Accordion, SizeGuideModal, ProductCard…
    overlays/         CartDrawer, SearchOverlay, AccountModal, Toast
    ui/               Logo, Reveal, SectionTitle, QuantityStepper…
  pages/              Home, Shop, Drops, Collection, Product, About, Lookbook, Info, 404
  styles/index.css    token del design system e stili custom
```

Prezzi, condizioni di spedizione/reso e testi legali sono dimostrativi.
