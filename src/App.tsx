import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
// archivio storico disattivato (route commentate più sotto)
// const Storia = lazy(() => import('./pages/Storia'));
const MinibasketNola = lazy(() => import('./pages/MinibasketNola'));
// const StoriaPost = lazy(() => import('./pages/StoriaPost'));
const LoaderPreview = lazy(() => import('./pages/LoaderPreview'));
const SwishLoader = lazy(() => import('./loaders/SwishLoader'));

// la pagina di anteprima gestisce da sola i suoi loading screen
const NO_LOADER = ['/anteprima-loading'];

/** Swish solo al primo ingresso nel sito: tra una pagina e l'altra fanno da transizione le intestazioni 3D */
const FirstVisitLoader = () => {
  const location = useLocation();
  const [show] = useState(() => !NO_LOADER.includes(location.pathname));
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

  if (!show) return null;
  return (
    <Suspense fallback={<div className="hl-loader" />}>
      <SwishLoader isLoading={loading} onAnimationEnd={openLoaderGate} />
    </Suspense>
  );
};

const AppContent = () => {
  return (
    <>
      <FirstVisitLoader />
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <Header />
        <main className="flex-grow pt-[60px] md:pt-[70px] w-full overflow-x-hidden">
          <Suspense fallback={<div className="min-h-screen bg-hyria-primary flex items-center justify-center"><p className="text-white">Caricamento...</p></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chi-siamo" element={<About />} />
              {/*<Route path="/storia" element={<Storia />} /> */}
              {/*<Route path="/storia/:slug" element={<StoriaPost />} /> */}
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
