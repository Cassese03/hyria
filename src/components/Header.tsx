import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Effetto per rilevare lo scroll della pagina
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Impedisce lo scrolling quando il menu mobile è aperto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''} w-full overflow-x-hidden`}>
      <div className="header-inner">
        <div className="header-logo" >
          <Link to="/">
            <img src="/images/logo-hyria.png" alt="Hyria Basket" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="main-navigation desktop-nav">
          <ul className="nav-menu">
            {/* <li className="menu-item">
              <Link to="/streaming" style={{ display: 'flex', alignItems: 'center' }}>
                LIVE <span className="pulse-dot-red"></span>
              </Link>
            </li> */}
            <li className="menu-item">
              <Link to="/">HOME</Link>
            </li>
            <li className="menu-item">
              <Link to="/chi-siamo">CHI SIAMO</Link>
            </li>
             {/* <li className="menu-item">
              <Link to="/storia">STORIA</Link>
            </li> */}
            <li className="menu-item">
              <Link to="/spogliatoio">Roster</Link>
            </li>
            <li className="menu-item">
              <Link to="/settore-giovanile">minibasket</Link>
            </li>
            <li className="menu-item">
              <Link to="/calendario">Classifica</Link>
            </li>
            {/* <li className="menu-item">
              <Link to="/schedina">Schedina</Link>
            </li> */}
            {/* <li className="menu-item">
              <Link to="/store">STORE</Link>
            </li> */}
            <li className="menu-item">
              <Link to="/sponsor">SPONSOR</Link>
            </li>
            <li className="menu-item">
              <Link to="/contatti">CONTATTI</Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-menu-button ${isOpen ? 'is-open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu principale"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`mobile-nav ${isOpen ? 'open' : ''}`}
        >
          <div className="mobile-nav-container">
            <ul className="mobile-nav-menu">
              <li className="mobile-menu-item">
                <Link to="/chi-siamo" onClick={() => setIsOpen(false)}>CHI SIAMO</Link>
              </li>
              {/*<li className="mobile-menu-item">
                <Link to="/storia" onClick={() => setIsOpen(false)}>STORIA</Link>
              </li> */}
              <li className="mobile-menu-item">
                <Link to="/spogliatoio" onClick={() => setIsOpen(false)}>Roster</Link>
              </li>
              <li className="mobile-menu-item">
                <Link to="/settore-giovanile" onClick={() => setIsOpen(false)}>minibasket</Link>
              </li>
              <li className="mobile-menu-item">
                <Link to="/calendario" onClick={() => setIsOpen(false)}>Classifica</Link>
              </li>
              {/* <li className="mobile-menu-item">
                <Link to="/schedina" onClick={() => setIsOpen(false)}>Schedina</Link>
              </li> */}
              {/* Streaming nascosto per ora: la pagina resta raggiungibile da /streaming
              <li className="mobile-menu-item">
                <Link to="/streaming" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center' }}>
                  LIVE <span className="pulse-dot-red"></span>
                </Link>
              </li> */}
              {/* <li className="mobile-menu-item">
                <Link to="/store" onClick={() => setIsOpen(false)}>STORE</Link>
              </li> */}
              <li className="mobile-menu-item">
                <Link to="/sponsor" onClick={() => setIsOpen(false)}>SPONSOR</Link>
              </li>
              <li className="mobile-menu-item">
                <Link to="/contatti" onClick={() => setIsOpen(false)}>CONTATTI</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
