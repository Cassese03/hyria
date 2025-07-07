import { motion } from 'framer-motion';
import PageHead from '../components/PageHead';
import PageHero from '../components/PageHero';

const Teams = () => {
  // Dati della squadra
  const teamCategories = [
    {
      id: 1,
      name: 'Prima Squadra',
      description: 'La nostra prima squadra milita nel campionato regionale DR2 Campnia ed è la punta di diamante del progetto Hyria Basket.',
      image: '/images/prima-squadra.jpg',
      players: [
        { name: 'Davide Esposito', number: 19, position: 'Playmaker', image: '/images/logo-hyria.png' },
        { name: 'Attilio De Sena', number: 32, position: 'Playmaker', image: '/images/logo-hyria.png' },
        { name: 'Giovanni Sangermano', number: 34, position: 'Guardia', image: '/images/logo-hyria.png' },
        { name: 'Paolino Franzese', number: 14, position: 'Guardia', image: '/images/logo-hyria.png' },
        { name: 'Lorenzo Cassese', number: 33, position: 'Ala', image: '/images/logo-hyria.png' },
        { name: 'Giacomo Mascolo', number: 35, position: 'Ala', image: '/images/logo-hyria.png' },
        { name: 'Christian Guida', number: 21, position: 'Ala', image: '/images/logo-hyria.png' },
        { name: 'Agostino Pio Esposito', number: 41, position: 'Ala Grande', image: '/images/logo-hyria.png' },
        { name: 'Christian Barrella', number: 23, position: 'Ala Grande', image: '/images/logo-hyria.png' },
        { name: 'Alessandro Palumbo', number: 31, position: 'Ala Grande', image: '/images/logo-hyria.png' },
        { name: 'Giovanni Spiezia', number: 9, position: 'Ala Grande', image: '/images/logo-hyria.png' },
      ]
    },
  ];
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
        
        <div className="team-page">
          <PageHero 
            backgroundImage="/images/contact-hero.jpg"
            normalText="PRIMA"
            coloredText="SQUADRA"
            subtitle="Il cuore pulsante di Hyria Basket - Stagione 2025"
          />
  
    <div className="teams-page">
      {/* Hero Section */}
      {/* <section className="hero-section" style={{ height: '60vh' }}>
        <div className="hero-background">
          <img src="/images/contact-hero.jpg" alt="Hyria Basket Team" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text-container"
          >
            <h1 className="hero-title" style={{ color: '#d96c00' }}>
              LA NOSTRA PRIMA SQUADRA
            </h1>
            <div className="section-divider"></div>
          </motion.div>
        </div>
      </section> */}

      {/* Teams Overview */}
      <section className="section-padding">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            STAGIONE 2025/2026
          </motion.h2>
          <div className="section-divider"></div>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Scopri la prima squadra del progetto Hyria Basket per questa stagione
          </motion.p>

          {/* Team Categories */}
          <div className="space-y-24">
            {teamCategories.map((team) => (
              <div key={team.id} className="team-category">
                <motion.h3
                  className="text-3xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {team.name}
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="rounded-lg overflow-hidden shadow-xl"
                  >
                    <img src={team.image} alt={team.name} className="w-full h-auto" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-lg mb-6">{team.description}</p>

                    {team.id === 1 && (
                      <div>
                        <h4 className="text-xl font-bold mb-4">Roster</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {team.players.map((player) => (
                            <div key={player.name} className="text-center"
                              style={{ textAlign: 'center', color: '#5e0303' }} >
                              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2"
                                style={{ textAlign: 'center', color: '#5e0303' }}>
                                <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                              </div>
                              <p className="font-bold"
                                style={{ textAlign: 'center', color: '#5e0303' }}>{player.name}</p>
                              <p className="text-sm"
                                style={{ textAlign: 'center', color: '#d96c00' }}>{player.position} | #{player.number}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {team.id !== 1 && (
                      <motion.button
                        className="btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        SCOPRI DI PIÙ
                      </motion.button>
                    )}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* League Table Section */}
      <section className="section-padding bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container">
          <motion.h2
            className="section-title text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            CLASSIFICA
          </motion.h2>
          <div className="section-divider"></div>

          <div className="overflow-x-auto" style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.table
              className="w-full text-sm text-left text-gray-300 mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center' }}
            >
              <thead className="text-xs uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">Posizione</th>
                  <th scope="col" className="px-6 py-3">Squadra</th>
                  <th scope="col" className="px-6 py-3">PG</th>
                  <th scope="col" className="px-6 py-3">V</th>
                  <th scope="col" className="px-6 py-3">P</th>
                  <th scope="col" className="px-6 py-3">PF</th>
                  <th scope="col" className="px-6 py-3">PS</th>
                  <th scope="col" className="px-6 py-3">Punti</th>
                </tr>
              </thead>
              <tbody>
                {/* {[
                  { pos: 1, team: "Basket Campione", played: 10, wins: 9, losses: 1, scored: 820, against: 720, points: 18 },
                  { pos: 2, team: "Hyria Basket", played: 10, wins: 8, losses: 2, scored: 802, against: 740, points: 16 },
                  { pos: 3, team: "Basket Rivale", played: 10, wins: 7, losses: 3, scored: 790, against: 750, points: 14 },
                  { pos: 4, team: "Team Basket City", played: 10, wins: 6, losses: 4, scored: 770, against: 760, points: 12 },
                  { pos: 5, team: "Hoops Stars", played: 10, wins: 5, losses: 5, scored: 750, against: 770, points: 10 }
                ].map((team) => (
                  <tr key={team.pos} className={`border-b border-gray-700 ${team.team === 'Hyria Basket' ? 'bg-orange-900/30 font-bold' : ''}`}>
                    <td className="px-6 py-4">{team.pos}</td>
                    <td className="px-6 py-4">{team.team}</td>
                    <td className="px-6 py-4">{team.played}</td>
                    <td className="px-6 py-4">{team.wins}</td>
                    <td className="px-6 py-4">{team.losses}</td>
                    <td className="px-6 py-4">{team.scored}</td>
                    <td className="px-6 py-4">{team.against}</td>
                    <td className="px-6 py-4">{team.points}</td>
                  </tr>
                ))} */}

                <tr className={`border-b border-gray-700 'bg-orange-900/30 font-bold'`}>
                  <td className="px-6 py-4">1</td>

                  <td className="px-6 py-4">TBD</td>
                  <td className="px-6 py-4">TBD</td>
                  <td className="px-6 py-4">TBD</td>
                  <td className="px-6 py-4">TBD</td>
                  <td className="px-6 py-4">TBD</td>
                  <td className="px-6 py-4">TBD</td>
                  <td className="px-6 py-4">TBD</td>

                </tr>
              </tbody>
            </motion.table>
          </div>
          {/* 
          <div className="text-center mt-12">
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CALENDARIO COMPLETO
            </motion.button>
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <h2 className="cta-title" style={{ color: '#d96c00' }}>
              Sostieni i nostri campioni
            </h2>
            <p className="cta-description">
              Vieni a tifare per noi alle nostre partite !
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={alert.bind(null, 'Funzionalità ancora non attiva. Grazie per il tuo supporto!')}
              >
                SOSTIENI IL NOSTRO PROGETTO
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </div>
    </>
  );
};

export default Teams;