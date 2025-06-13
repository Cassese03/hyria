import { useEffect, useState } from 'react';
import '/src/styles/LoadingPage.css';

interface LoadingPageProps {
  isLoading: boolean;
  onAnimationEnd?: () => void;
}

const LoadingPage = ({ isLoading, onAnimationEnd }: LoadingPageProps) => {
  const [animationClass, setAnimationClass] = useState('slide-down');
  const [isVisible, setIsVisible] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setAnimationClass('slide-down');
    } else {
      // Quando il loading finisce, attiva l'animazione di uscita
      setAnimationClass('slide-up');
      
      // Nascondi il componente dopo l'animazione
      const timer = setTimeout(() => {
        setIsVisible(false);
        onAnimationEnd?.();
      }, 1000); // Durata dell'animazione

      return () => clearTimeout(timer);
    }
  }, [isLoading, onAnimationEnd]);

  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className={`white-mask ${animationClass}`}></div>
      <img
        src="/images/logo-hyria.png"
        alt="Logo"
        className="logo"
      />
    </div>
  );
};

export default LoadingPage;
