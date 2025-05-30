import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Teams from './pages/Teams';
import About from './pages/About';
import Contact from './pages/Contact';
import SettoreGiovanile from './pages/SettoreGiovanile';
import Sponsor from './pages/Sponsor';
import './styles/home.css';
import './styles/global.css';
import './styles/responsive.css'; // Importiamo il nuovo file di stili responsive

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-[60px] md:pt-[70px]"> {/* Padding-top regolabile in base all'altezza dell'header */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Teams />} />
            <Route path="/chi-siamo" element={<About />} />
            <Route path="/settore-giovanile" element={<SettoreGiovanile />} />
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="/contatti" element={<Contact />} />
            {/* Aggiungi altre rotte qui */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
