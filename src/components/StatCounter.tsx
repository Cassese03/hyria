import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

interface StatCounterProps {
  value: string;
  label: string;
  duration?: number;
}

const StatCounter: React.FC<StatCounterProps> = ({
  value,
  label,
  duration = 2
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [count, setCount] = useState(0);
  const finalValue = parseInt(value.replace(/\D/g, ''));

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = finalValue / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= finalValue) {
          setCount(finalValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [inView, finalValue, duration]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative inline-block"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <span className="text-5xl font-black gradient-text">
          {count}
          <span className="text-hyria-orange">+</span>
        </span>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-hyria-orange/20 blur-xl -z-10" />
      </motion.div>

      <motion.div
        className="mt-4 text-sm uppercase tracking-wider text-gray-400"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
};

export default StatCounter; 