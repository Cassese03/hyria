import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Teams from './pages/Teams';
import About from './pages/About';
import Contact from './pages/Contact';
import SettoreGiovanile from './pages/SettoreGiovanile';
import Sponsor from './pages/Sponsor';
import Store from './pages/Store';
import './styles/home.css';
import './styles/global.css';
import './styles/responsive.css';
import './styles/overflow-fix.css';
import './styles/store.css';
import LoadingPage from './components/LoadingPage';

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Teams />} />
            <Route path="/chi-siamo" element={<About />} />
            <Route path="/settore-giovanile" element={<SettoreGiovanile />} />
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="/store" element={<Store />} />
            <Route path="/contatti" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
