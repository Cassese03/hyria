import { useEffect, useState, useMemo } from 'react';
import '../styles/LoadingPage.css';

interface LoadingPageProps {
  isLoading: boolean;
  onAnimationEnd?: () => void;
}

const LoadingPage = ({ isLoading, onAnimationEnd }: LoadingPageProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Generiamo 800 quadretti per essere sicuri di coprire anche gli schermi 4K
  const gridCells = useMemo(() => {
    return Array.from({ length: 800 }).map((_, index) => ({
      id: index,
      // Ritardo casuale tra 0 e 0.8 secondi per un effetto caotico e dinamico
      delay: (Math.random() * 0.8).toFixed(2),
    }));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setIsExiting(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        onAnimationEnd?.();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, onAnimationEnd]);

  if (!isVisible) return null;

  return (
    <div className="loading-container">
      <div className="grid-overlay">
        {gridCells.map((cell) => (
          <div
            key={cell.id}
            className={`grid-cell ${isExiting ? 'exit' : ''}`}
            style={{
              transitionDelay: isExiting ? `${cell.delay}s` : '0s',
            }}
          ></div>
        ))}
      </div>

      {/* Opzionale: Se vuoi MANTENERE anche il logo centrale grande che pulsa, lascialo. 
          Se invece vuoi che si vedano SOLO i quadretti con i loghi piccoli, puoi rimuovere questa <img> */}
      {/* <img
        src="/images/logo-hyria.png"
        alt="Logo Principale"
        className={`logo-centrale ${isExiting ? 'fade-out' : ''}`}
      /> */}
    </div>
  );
};

export default LoadingPage;