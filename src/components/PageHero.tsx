import { motion } from 'framer-motion';
import { heroContainer, heroItem, scaleReveal } from '../utils/animations';

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
  height = 'clamp(40vh, 50vh, 60vh)',
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
          variants={heroContainer}
          initial="hidden"
          animate="visible"
          className="hero-text-container px-4"
        >
          <motion.h1
            variants={heroItem}
            className="hero-title text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          >
            {coloredText ? (
              <>
                <span className="block sm:inline">{normalText}</span>{' '}
                <span className="gradient-text" style={{color:'#d96c00'}}>{coloredText}</span>
              </>
            ) : (
              <span className="gradient-text">{title}</span>
            )}
          </motion.h1>
          {subtitle && (
            <motion.p
              variants={heroItem}
              className="hero-subtitle text-lg mt-2 md:mt-4"
              style={{color:'white'}}
            >
              {subtitle}
            </motion.p>
          )}
          <motion.div
            variants={scaleReveal}
            className="section-divider mx-auto"
            style={{ transformOrigin: 'center' }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
