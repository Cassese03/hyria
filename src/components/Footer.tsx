import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer bg-hyria-black text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="footer-top py-8">
          <div className="footer-logo flex justify-center mb-6">
            <img
              src="/images/logo-hyria-white.png"
              alt="Hyria Basket Logo"
              className="h-16"
            />
          </div>
          <div className="social-links flex justify-center gap-4">
            <a
              href="https://www.instagram.com/hyria_basket"
              className="social-icon text-white hover:text-hyria-orange transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="data:image/png;base64,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"
                alt="Instagram Icon"
                className="w-5 h-5 max-w-full max-h-full"
              />
            </a>
            <a
              href="https://www.facebook.com/share/1EwASMhiUT/?mibextid=wwXIfr"
              className="social-icon text-white hover:text-hyria-orange transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="data:image/png;base64,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"
                alt="Facebook Icon"
                className="w-5 h-5 max-w-full max-h-full"
              />
            </a>
            <a
              href="https://www.youtube.com/hyriabasket"
              className="social-icon text-white hover:text-hyria-orange transition-colors"
              target="_blank"
              rel="noopener noreferrer">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEUAAAD///+ioqJ9fX3u7u50dHT6+vovLy9hYWHq6ury8vLY2Njj4+OTk5PKysqpqam3t7dra2vR0dFTU1Pk5OTAwMCDg4M/Pz+vr6+cnJxYWFgeHh5LS0tycnIODg6IiIgiIiIXFxc5OTlGRkY0NDSWlpY+Pj5mZmYxt1G5AAAEQklEQVR4nO3d6XKiQBQFYEUDAq4QNndNjO//hoM4xiwwU8M9bV8y5/uZVFEcF/r2aq9HRERERERERERERERERERERERERERERESkxMorZXE8eqoMapR/HsVxnHnewfbdNtln8WizK5xZns+TaRiOn/3Add1+W0EQDP1xGEbTZD5zil35AmRW0nvpLIl8QZJ/47p+lMxS71HxBtNHJfsqSAYPyFfYinflngznG9jNV2V8MhlwajteJTEXcGw722+hoXzboe1k74ZbIwm1vIMXzyYCzm2n+mSODxjbzvRFDE+o6TN6MUYHXNpO9M0SnFBHS/jRFBtwbztPjRU04cR2nBoTaMLQdpwa2MrGdppayIBPtsPUQnYydNUzN8i6xrcdphawOD3YztIAl1BbTXrzAkuo80HT7+PGpU62ozQoYAlz21Ea5LCE+sruK1zxrbFmu8DVbTqbw37fhyW0naSRioRG339UwIPkJopVgklTBzVsupbchNPrHY09izNQwoXkJpzqNYpQmT47gxKKijbneo3YSIuzASXcSW7CuV3l/IzKdYcqTAvJTTj362zgz1XUYJSoLHU+XmkQoLLVXFxANIbx5SZ20Elk1DiGqEH79jKfgBlRCUXNWc0HyUEFhM13ixqz2q8KqsOJ6j6JmrL6h8EKMz4ZgRKKpg6bHnd7RLmK6iCKmrHmB/qbvFxFJRStwfhTk/UiLVdRE8HGEorLVVQn32DCXm8k+ZYPu5BQVK52JKGgXO1MwrJcbZexQwlbrhToVMKe16Ii71LCdmVcdxIeWpbinUk4a3vxjiQUdBc7kXAi6fJ3IKFw2EZ9QvHQm/KEgOFT1QnPiOFhxQmXmEXVqISiCYe6hGvUNA2qBwweicpwU22oUQzoaOIrcroUNRIFHBH2sFPeqPFS2Kj+Fr1OFTXmDZqZ2bYusBuh5i0ws2u4+Zg71NwTYobUzPJG1NI9+Sw3dl70DrX8UrpSIQXPbd/tQAlFq02KhcF1X6j9CKIVQ0Y3fy9ACbUuZO/316CEGjeuXcG2r9kO0ggV8D9IaOxpL4RbBa1tl/MNbiW7odWhYrjdCDo35yF3lJjoFiDgdgWltqM0wG0iFS1lNwhV0pS9c9tRGsACCkdMjcE1h1ofpsidzjo3kUKPxLIdphYyoModiNhTI37+yR8aO8F7aEKFxTf4BB6FpyjBj8LS1kfEn7un7U3E1aTvDG52bQHXNfxA0551+GltFUUnQwZmTobU87Qx8w5WdPQx0C3hJ7GCnqLp05I3dj+qLm70qdnxZK2Ei9IH5LtabU751H/UaL8bDKMkTw008n+19Y7rUTo5FbM8T6ZRFIVjPwhEk6Ju4I/DKErm+ayYpIvly9HDHgEJdDh4b1mWxaPS4qL6sYDd5Cqtfkqg/Ou5/Pcyy14Pan88gIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIgI6xdDxVhSmFQ+CwAAAABJRU5ErkJggg=="
                alt="Youtube Icon"
                className="w-5 h-5 max-w-full max-h-full"
              /></a>
            <a
              
              onAuxClickCapture={() => alert('In arrivo!')}
              className="social-icon text-white hover:text-hyria-orange transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            ><img
                src="data:image/png;base64,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"
                alt="X Icon"
                className="w-5 h-5 max-w-full max-h-full"
              />
            </a>
          </div>
        </div>
        <div className="footer-bottom border-t border-gray-800 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="footer-info">
              <p className="text-gray-400">© 2025 Hyria Basket - Tutti i diritti riservati</p>
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
