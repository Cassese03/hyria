import { motion } from 'framer-motion';

interface TeamCardProps {
  name: string;
  image: string;
  description?: string;
  onLearnMore?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
  name,
  image,
  description,
  onLearnMore
}) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7 }}
        />
        
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          initial={{ opacity: 0.4 }}
          whileHover={{ opacity: 0.7 }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h3
            className="text-2xl font-bold mb-2 text-shadow"
            initial={{ y: 20 }}
            whileHover={{ y: 0 }}
          >
            {name}
          </motion.h3>
          
          {description && (
            <motion.p
              className="text-sm text-gray-200 mb-4"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {description}
            </motion.p>
          )}

          <motion.button
            className="btn-primary text-sm w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLearnMore}
          >
            Scopri di più
          </motion.button>
        </motion.div>
      </div>

      {/* Hover Effect Border */}
      <motion.div
        className="absolute inset-0 border-2 border-hyria-orange rounded-lg pointer-events-none"
        initial={{ opacity: 0, scale: 1.1 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default TeamCard; 