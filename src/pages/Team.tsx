import React from 'react';
import PageHead from '../components/PageHead';

const Team: React.FC = () => {
  const teamStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Prima Squadra - Hyria Basket",
    "description": "Scopri la prima squadra di Hyria Basket per la stagione 2025. Roster, staff tecnico e obiettivi della squadra di basket di Nola.",
    "url": "https://hyriabasket.it/team"
  };

  return (
    <>
      <PageHead
        title="Prima Squadra Hyriabasket – Squadra Basket Nola 2025"
        description="Scopri la prima squadra di Hyria Basket per la stagione 2025. Roster completo, staff tecnico, obiettivi e ambizioni della squadra di pallacanestro più promettente di Nola."
        keywords="prima squadra Hyria Basket, roster 2025, giocatori basket Nola, staff tecnico, pallacanestro Nola"
        ogTitle="Prima Squadra Hyria Basket 2025 - Il Futuro del Basket Nolano"
        ogDescription="La prima squadra di Hyria Basket per la stagione 2025: giovani talenti, esperienza e determinazione per raggiungere nuovi traguardi nel basket campano."
        ogUrl="https://hyriabasket.it/team"
        canonicalUrl="https://hyriabasket.it/team"
        structuredData={teamStructuredData}
      />
    </>
  );
};

export default Team;
