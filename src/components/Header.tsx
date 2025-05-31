import { useState, useEffect } from 'react';

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
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''} w-full overflow-x-hidden`}>
      <div className="header-inner">
        <div className="header-logo">
          <a href="/">
            <img src="/images/logo-hyria.png" alt="Hyria Basket" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="main-navigation desktop-nav">
          <ul className="nav-menu">
            <li className="menu-item">
              <a href="/chi-siamo">CHI SIAMO</a>
            </li>
            <li className="menu-item">
              <a href="/team">TEAM</a>
            </li>
            <li className="menu-item">
              <a href="/settore-giovanile">SETTORE GIOVANILE</a>
            </li>
            <li className="menu-item">
              <a href="/sponsor">SPONSOR</a>
            </li>
            <li className="menu-item">
              <a href="/contatti">CONTATTI</a>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu principale"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
          <div className="mobile-nav-container">
            <ul className="mobile-nav-menu">
              <li className="mobile-menu-item">
                <a href="/chi-siamo" onClick={() => setIsOpen(false)}>CHI SIAMO</a>
              </li>
              <li className="mobile-menu-item">
                <a href="/team" onClick={() => setIsOpen(false)}>TEAM</a>
              </li>
              <li className="mobile-menu-item">
                <a href="/settore-giovanile" onClick={() => setIsOpen(false)}>SETTORE GIOVANILE</a>
              </li>
              <li className="mobile-menu-item">
                <a href="/sponsor" onClick={() => setIsOpen(false)}>SPONSOR</a>
              </li>
              <li className="mobile-menu-item">
                <a href="/contatti" onClick={() => setIsOpen(false)}>CONTATTI</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
