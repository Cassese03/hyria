import { motion } from 'framer-motion';
import { fadeInUp, scaleReveal, revealTransition } from '../utils/animations';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, light = false }) => {
  return (
    <>
      <motion.h2
        className={`section-title ${light ? 'text-white' : ''}`}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{color:'#5e0303'}}
      >
        {title}
      </motion.h2>
      <motion.div
        className="section-divider"
        variants={scaleReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ transformOrigin: 'left center' }}
      />
      {subtitle && (
        <motion.p
          className={`section-subtitle ${light ? 'text-gray-300' : ''}`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...revealTransition, delay: 0.12 }}
          style={{color:'white'}}
        >
          {subtitle}
        </motion.p>
      )}
    </>
  );
};

export default SectionTitle;
