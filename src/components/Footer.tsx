import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';

const socialLinks = [
  {
    icon: '/images/social-instagram.svg',
    href: 'https://www.instagram.com/hyria_basket',
    ariaLabel: 'Instagram Hyria Basket',
    alt: 'Instagram',
  },
  {
    icon: '/images/social-facebook.svg',
    href: 'https://www.facebook.com/share/1EwASMhiUT/?mibextid=wwXIfr',
    ariaLabel: 'Facebook Hyria Basket',
    alt: 'Facebook',
  },
  {
    icon: '/images/social-youtube.svg',
    href: 'https://www.youtube.com/hyriabasket',
    ariaLabel: 'YouTube Hyria Basket',
    alt: 'YouTube',
  },
];

const Footer = () => {
  return (
    <motion.footer
      className="site-footer bg-hyria-black text-white"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="footer-top py-8">
          <motion.div className="footer-logo flex justify-center mb-6" variants={fadeInUp}>
            <img
              src="/images/logo-hyria-white.png"
              alt="Hyria Basket Logo"
              className="h-16"
            />
          </motion.div>

          <motion.div className="social-links flex justify-center gap-4" variants={fadeInUp}>
            {socialLinks.map((socialLink) => (
              <motion.a
                key={socialLink.href}
                href={socialLink.href}
                className="social-icon text-white inline-flex items-center justify-center font-semibold"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={socialLink.ariaLabel}
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={socialLink.icon}
                  alt={socialLink.alt}
                  className="w-5 h-5"
                  loading="lazy"
                  decoding="async"
                />
              </motion.a>
            ))}

          </motion.div>
        </div>

        <motion.div className="footer-bottom border-t border-gray-800 py-4" variants={fadeInUp}>
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
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
