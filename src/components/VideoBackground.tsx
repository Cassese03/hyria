import { motion } from 'framer-motion';

interface VideoBackgroundProps {
  videoUrl?: string;
  imageUrl?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoUrl,
  imageUrl,
  overlayOpacity = 0.5,
  children
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        {videoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute min-w-full min-h-full object-cover"
            style={{ opacity: overlayOpacity }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Background"
            className="absolute min-w-full min-h-full object-cover"
            style={{ opacity: overlayOpacity }}
          />
        ) : null}
      </div>

      {/* Gradient Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-overlay"
      />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-pattern opacity-5" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground; 