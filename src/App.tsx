import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './styles/overflow-fix.css'; // Importiamo per ultimo per sovrascrivere altri stili
import './styles/store.css'; // Importiamo i nuovi stili dello store

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
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
    </Router>
  );
};

export default App;