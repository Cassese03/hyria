import { useEffect, useState } from 'react';
import '/src/styles/LoadingPage.css';

interface LoadingPageProps {
  isLoading: boolean;
}

const LoadingPage = ({ isLoading }: LoadingPageProps) => {
  const [animationClass, setAnimationClass] = useState('slide-down');

  useEffect(() => {
    if (!isLoading) {
      // Quando il loading finisce, attiva l'animazione di uscita
      setAnimationClass('slide-up');
    }
  }, [isLoading]);

  return (
    <div className="loading-container">
      <div className={`white-mask ${animationClass}`}></div>
      <img
        src="/images/logo-hyria.png" // Cambia con il path del tuo logo
        alt="Logo"
        className="logo"
      />
    </div>
  );
};

export default LoadingPage;
