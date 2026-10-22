import { useEffect } from 'react';
import { OG_IMAGE, clubGraph } from '../seo/site';

interface PageHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  structuredData?: object;
  ogType?: 'website' | 'article';
}

const PageHead: React.FC<PageHeadProps> = ({
  title = "ASD Hyria Basket | Scuola Basket e Minibasket a Nola",
  description = "Hyria Basket è la società di pallacanestro di Nola: minibasket dai 5 agli 11 anni, prima squadra nel campionato regionale e prova gratuita per i più piccoli.",
  keywords = "basket Nola, minibasket Nola, pallacanestro, Agro Nolano, Hyria Basket",
  ogTitle,
  ogDescription,
  ogImage = OG_IMAGE.url,
  ogUrl = "https://hyriabasket.it",
  canonicalUrl,
  structuredData,
  ogType = 'website',
}) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      // contenuto vuoto = il tag non serve a questa pagina
      if (!content) {
        meta?.remove();
        return;
      }
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Helper function to update or create link tags
    const updateLinkTag = (rel: string, href: string, type?: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
      if (type) {
        link.setAttribute('type', type);
      }
    };

    // Add favicon
    updateLinkTag('icon', '/images/logo.ico', 'image/x-icon');

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph tags
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', ogUrl, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:site_name', 'Hyria Basket', true);
    updateMetaTag('og:locale', 'it_IT', true);
    // le dimensioni valgono solo per l'immagine di default; per le altre si tolgono
    const isDefault = ogImage === OG_IMAGE.url;
    updateMetaTag('og:image:width', isDefault ? String(OG_IMAGE.width) : '', true);
    updateMetaTag('og:image:height', isDefault ? String(OG_IMAGE.height) : '', true);
    updateMetaTag('og:image:alt', isDefault ? OG_IMAGE.alt : ogTitle || title, true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', ogTitle || title);
    updateMetaTag('twitter:description', ogDescription || description);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:image:alt', isDefault ? OG_IMAGE.alt : ogTitle || title);
    
    // Canonical URL
    if (canonicalUrl) {
      updateLinkTag('canonical', canonicalUrl);
    }
    
    // Structured Data: un solo script, sempre presente (di default il club)
    {
      let script = document.querySelector('script[type="application/ld+json"]');
      
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData ?? clubGraph());
    }

    // Add Firebase Analytics Script
    let firebaseScript = document.querySelector('script[data-firebase="true"]');
    
    if (!firebaseScript) {
      firebaseScript = document.createElement('script');
      firebaseScript.setAttribute('type', 'module');
      firebaseScript.setAttribute('data-firebase', 'true');
      firebaseScript.textContent = `
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
        
        // Your web app's Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyALIuj5nsWXBJN7QIyl66Pc1lKQsfPkKao",
          authDomain: "hyriabasket.firebaseapp.com",
          projectId: "hyriabasket",
          storageBucket: "hyriabasket.firebasestorage.app",
          messagingSenderId: "780923068432",
          appId: "1:780923068432:web:4d495dd798bdf6eee3ea95",
          measurementId: "G-2E8JK29033"
        };
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
      `;
      document.head.appendChild(firebaseScript);
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = "ASD Hyria Basket | Scuola Basket e Minibasket a Nola";
    };
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, canonicalUrl, structuredData, ogType]);

  return null; // This component doesn't render anything
};

export default PageHead;
