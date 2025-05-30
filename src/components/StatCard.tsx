import { motion } from 'framer-motion';

interface StatCardProps {
  value: string;
  label: string;
  delay?: number;
}

const StatCard = ({ value, label, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="text-center relative z-10 p-8 rounded-sm glass-effect">
        <motion.div 
          className="text-6xl font-extrabold mb-4 gradient-text"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {value}
        </motion.div>
        <div className="relative">
          <div className="text-sm uppercase tracking-wider text-white group-hover:text-hyria-orange transition-colors duration-300">
            {label}
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-hyria-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-radial from-hyria-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
    </motion.div>
  );
};

export default StatCard; 