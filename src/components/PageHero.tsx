import { motion } from 'framer-motion';

interface PageHeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage: string;
  height?: string;
  coloredText?: string;
  normalText?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  height = 'clamp(40vh, 50vh, 60vh)', // Altezza responsiva
  coloredText,
  normalText
}) => {
  return (
    <section className="hero-section" style={{ height }}>
      <div className="hero-background">
        <img src={backgroundImage} alt={title || coloredText || ''} className="hero-bg-image" />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text-container px-4"
        >
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            {coloredText ? (
              <>
                <span className="block sm:inline">{normalText}</span>{' '}
                <span className="gradient-text" style={{color:'#d96c00'}}>{coloredText}</span>
              </>
            ) : (
              <span className="gradient-text">{title}</span>
            )}
          </h1>
          {subtitle && <p className="hero-subtitle text-lg mt-2 md:mt-4" style={{color:'white'}}>{subtitle}</p>}
          <div className="section-divider mx-auto"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
