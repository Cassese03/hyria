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
import LoadingPage from './components/LoadingPage';

const Teams = lazy(() => import('./pages/Teams'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const SettoreGiovanile = lazy(() => import('./pages/SettoreGiovanile'));
const Sponsor = lazy(() => import('./pages/Sponsor'));
const Store = lazy(() => import('./pages/Store'));
const Cart = lazy(() => import('./pages/Cart'));
const Calendario = lazy(() => import('./pages/Calendario'));

const AppContent = () => {
  const location = useLocation();
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // FASE 1 → Mostra loading + animazione entrata
    setShowLoadingPage(true);
    setIsAnimating(true);

    // Simula il tempo in cui il nuovo contenuto è pronto (puoi collegarlo a un reale evento onLoad volendo)
    const contentReadyTimer = setTimeout(() => {
      // FASE 2 → avvia animazione di uscita
      setIsAnimating(false);

      // Dopo l'animazione di uscita, nascondi il loading
      const hideLoaderTimer = setTimeout(() => {
        setShowLoadingPage(false);
      }, 1500); // deve combaciare con durata animazione slideUp

      return () => clearTimeout(hideLoaderTimer);
    }, 1000); // questo è il tempo fittizio in cui "la pagina si carica" → qui puoi regolarlo o agganciarlo a un evento reale

    return () => clearTimeout(contentReadyTimer);
  }, [location.pathname]);

  return (
    <>
      {showLoadingPage && <LoadingPage isLoading={isAnimating} />}
      <div className={`flex flex-col min-h-screen w-full overflow-x-hidden ${showLoadingPage ? 'overflow-hidden' : ''}`}>
        <Header />
        <main className="flex-grow pt-[60px] md:pt-[70px] w-full overflow-x-hidden">
          <Suspense fallback={<div className="min-h-screen bg-hyria-primary flex items-center justify-center"><p className="text-white">Caricamento...</p></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/team" element={<Teams />} />
              <Route path="/chi-siamo" element={<About />} />
              <Route path="/settore-giovanile" element={<SettoreGiovanile />} />
              <Route path="/sponsor" element={<Sponsor />} />
              <Route path="/store" element={<Store />} />
              <Route path="/carrello" element={<Cart />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/contatti" element={<Contact />} />
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
