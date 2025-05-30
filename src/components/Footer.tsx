import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer bg-hyria-black text-white">
      <div className="container">
        <div className="footer-top py-8">
          <div className="footer-logo flex justify-center mb-6">
            <img 
              src="/images/logo-hyria-white.png" 
              alt="Hyria Basket Logo" 
              className="h-16"
            />
          </div>
          <div className="social-links flex justify-center gap-6">
            <a 
              href="https://www.instagram.com/hyria_basket" 
              className="social-icon text-gray-400 hover:text-hyria-orange transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram text-2xl"></i>
            </a>
            <a 
              href="https://www.facebook.com/hyriabasket" 
              className="social-icon text-gray-400 hover:text-hyria-orange transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook text-2xl"></i>
            </a>
            <a 
              href="https://www.youtube.com/hyriabasket" 
              className="social-icon text-gray-400 hover:text-hyria-orange transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-youtube text-2xl"></i>
            </a>
            <a 
              href="https://twitter.com/hyria_basket" 
              className="social-icon text-gray-400 hover:text-hyria-orange transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter text-2xl"></i>
            </a>
          </div>
        </div>
        <div className="footer-bottom border-t border-gray-800 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="footer-info">
              <p className="text-gray-400">© {new Date().getFullYear()} Hyria Basket - Tutti i diritti riservati</p>
            </div>
            <div className="footer-nav flex gap-6">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-hyria-orange">
                Privacy Policy
              </Link>
              <Link to="/cookie-policy" className="text-gray-400 hover:text-hyria-orange">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
