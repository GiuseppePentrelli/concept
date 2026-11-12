import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/overlays/CartDrawer';
import { SearchOverlay } from './components/overlays/SearchOverlay';
import { AccountModal } from './components/overlays/AccountModal';
import { Toast } from './components/overlays/Toast';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { DropsPage } from './pages/DropsPage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductPage } from './pages/ProductPage';
import { AboutPage } from './pages/AboutPage';
import { LookbookPage } from './pages/LookbookPage';
import { InfoPage } from './pages/InfoPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useUI } from './store/ui';

export function App() {
  const location = useLocation();
  const { close } = useUI();
  const isHome = location.pathname === '/';

  useEffect(() => {
    close();
  }, [location.pathname, close]);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80] focus:bg-bone focus:px-4 focus:py-3 focus:text-[12px] focus:uppercase focus:tracking-[0.2em] focus:text-ink"
      >
        Vai al contenuto
      </a>
      <AnnouncementBar />
      <Header overlayHero={isHome} />

      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          id="contenuto"
          key={location.pathname}
          className={`min-h-[70svh] ${isHome ? '' : 'pt-[var(--header-h)]'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/drops" element={<DropsPage />} />
            <Route path="/drops/:slug" element={<CollectionPage />} />
            <Route path="/prodotto/:slug" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/lookbook" element={<LookbookPage />} />
            <Route path="/info/:slug" element={<InfoPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <Footer />
      <MobileNavigation />
      <SearchOverlay />
      <AccountModal />
      <CartDrawer />
      <Toast />
    </MotionConfig>
  );
}
