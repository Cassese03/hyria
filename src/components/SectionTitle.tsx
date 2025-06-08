import { motion } from 'framer-motion';

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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{color:'#5e0303'}}
      >
        {title}
      </motion.h2>
      <div className="section-divider"></div>
      
      {subtitle && (
        <motion.p 
          className={`section-subtitle ${light ? 'text-gray-300' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{color:'white'}}
        >
          {subtitle}
        </motion.p>
      )}
    </>
  );
};

export default SectionTitle;
