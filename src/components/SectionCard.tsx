import { motion } from 'framer-motion';

interface SectionCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  delay?: number;
  imageUrl?: string;
}

const SectionCard = ({ title, description, icon, delay = 0, imageUrl }: SectionCardProps) => {
  return (
    <motion.div
      className="group relative overflow-hidden bg-hyria-gray rounded-sm h-[400px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-overlay opacity-70 group-hover:opacity-50 transition-opacity duration-700"></div>
        </div>
      )}
      
      <div className="relative z-10 p-8 h-full flex flex-col justify-end transform transition-transform duration-500 translate-y-20 group-hover:translate-y-0">
        <div className="transform transition-all duration-500 translate-y-8 group-hover:translate-y-0">
          {icon && (
            <motion.div 
              className="text-hyria-orange mb-6 text-4xl"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {icon}
            </motion.div>
          )}
          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-hyria-orange transition-colors duration-300">
            {title}
          </h3>
          <div className="h-0.5 w-12 bg-hyria-orange mb-4 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></div>
          <p className="text-gray-400 group-hover:text-white transition-colors duration-300 opacity-0 group-hover:opacity-100 transform translate-y-10 group-hover:translate-y-0 transition-all">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SectionCard; 