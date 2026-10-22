import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { canUseWebGL, saveData } from './arena/shots';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import { CartProvider } from './contexts/CartContext';
import './styles/home.css';
import './styles/global.css';
import './styles/responsive.css';
import './styles/overflow-fix.css';
import './styles/store.css';
import './styles/cart.css';
import './styles/streaming.css';
import './styles/ui.css';
// subito, non con la scena: il fondo del loader deve coprire la pagina mentre Swish si scarica
import './styles/loaders.css';
import { openLoaderGate } from './loaders/gate';

// const Teams = lazy(() => import('./pages/Teams'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const SettoreGiovanile = lazy(() => import('./pages/SettoreGiovanile'));
const Sponsor = lazy(() => import('./pages/Sponsor'));
const Store = lazy(() => import('./pages/Store'));
const Cart = lazy(() => import('./pages/Cart'));
const Calendario = lazy(() => import('./pages/Calendario'));
const Streaming = lazy(() => import('./pages/Streaming'));
const Spogliatoio = lazy(() => import('./pages/Spogliatoio'));
const HyriaBettingPage = lazy(() => import('./pages/HyriaBettingPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Storia = lazy(() => import('./pages/Storia'));
const MinibasketNola = lazy(() => import('./pages/MinibasketNola'));
const StoriaPost = lazy(() => import('./pages/StoriaPost'));
const LoaderPreview = lazy(() => import('./pages/LoaderPreview'));
const SwishLoader = lazy(() => import('./loaders/SwishLoader'));

const NO_LOADER = ['/anteprima-loading'];
const INTRO_KEY = 'hyria-intro-seen';

/** Swish solo al primo ingresso nel sito: tra una pagina e l'altra fanno da transizione le intestazioni 3D */
const FirstVisitLoader = () => {
  const location = useLocation();
  const [show] = useState(() => {
    if (NO_LOADER.includes(location.pathname)) return false;
    // intro già vista in questa sessione, riduci movimento, risparmio dati o niente WebGL: nessun loader a schermo intero
    try {
      if (sessionStorage.getItem(INTRO_KEY)) return false;
    } catch {
      /* storage non disponibile: si mostra l'intro */
    }
    return canUseWebGL() && !saveData() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [loading, setLoading] = useState(() => document.readyState !== 'complete');

  // il caricamento "vero" finisce con l'evento load della pagina
  useEffect(() => {
    if (!loading) return;
    const done = () => setLoading(false);
    window.addEventListener('load', done, { once: true });
    return () => window.removeEventListener('load', done);
  }, [loading]);

  useEffect(() => {
    if (!show) openLoaderGate();
  }, [show]);

  const finish = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* ignorato */
    }
    openLoaderGate();
  };

  if (!show) return null;
  return (
    <Suspense fallback={<div className="hl-loader" />}>
      <SwishLoader isLoading={loading} onAnimationEnd={finish} />
    </Suspense>
  );
};

/** con la navigazione interna il browser non riporta più in cima da solo */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const AppContent = () => {
  const location = useLocation();
  return (
    <>
      <FirstVisitLoader />
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <Header />
        <main className="flex-grow pt-[60px] md:pt-[70px] w-full overflow-x-hidden">
          <Suspense fallback={<div className="route-progress" role="progressbar" aria-label="Caricamento" />}>
            <ScrollToTop />
            <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chi-siamo" element={<About />} />
              <Route path="/storia" element={<Storia />} />
              <Route path="/storia/:slug" element={<StoriaPost />} />
              <Route path="/settore-giovanile" element={<SettoreGiovanile />} />
              <Route path="/minibasket-nola" element={<MinibasketNola />} />
              <Route path="/sponsor" element={<Sponsor />} />
              <Route path="/store" element={<Store />} />
              <Route path="/carrello" element={<Cart />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/contatti" element={<Contact />} />
              <Route path="/streaming" element={<Streaming />} />
              <Route path="/spogliatoio" element={<Spogliatoio />} />
              <Route path="/schedina" element={<HyriaBettingPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/anteprima-loading" element={<LoaderPreview />} />
            </Routes>
            </motion.div>
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
};

const App = () => {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
};

export default App;
