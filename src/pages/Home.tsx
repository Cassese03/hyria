import { motion } from 'framer-motion';
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img src="/images/basketball-hero.jpg" alt="Basketball court" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text-container"
          >
            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl">
              HYRIA <span className="gradient-text">BASKET</span>
            </h1>
            <p className="hero-description text-base md:text-lg">
              Una squadra di basket giovane, nata dal progetto di imprenditori millennials 
              convinti che un'atmosfera familiare e attenta al lato umano e allo spirito di squadra 
              possa conciliarsi perfettamente con la tecnologia più avanzata e i giovani talenti del territorio.
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="btn-primary w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/chi-siamo'}
              >
                SCOPRI DI PIÙ
              </motion.button>
              <motion.button 
                className="btn-secondary w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/contatti'}
              >
                UNISCITI A NOI
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            className="scroll-indicator"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container section-container">
          <div className="about-content">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              IL FUTURO DEL BASKET
            </motion.h2>
            <div className="section-divider"></div>
            <motion.h3 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              PASSA DA NOI
            </motion.h3>
            <motion.p 
              className="section-description"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Il "Hyria" è una squadra di basket moderna militante attualmente nel campionato regionale.
              Il progetto, costituito da oltre 150 atleti tesserati e circa 20 dirigenti, si pone l'obiettivo 
              di arrivare al basket professionistico sfruttando le nuove tecnologie e il know how in ambito 
              imprenditoriale dei soci fondatori.
            </motion.p>
          </div>
          <div className="about-media">
            <div className="about-video">
              {/* <iframe 
                src="https://player.vimeo.com/video/101917190?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;loop=1&amp;autoplay=1&amp;background=1" 
                frameBorder="0"
                style={{ border: 0 }}
                title="Hyria Basket Promo"
              ></iframe> */}
              <img src="/images/basketball-motto.jpg" alt="Hyria Basket Team" className="about-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            SPORT E TECNOLOGIA
          </motion.h2>
          <div className="section-divider"></div>
          <motion.h3 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            I NOSTRI 3 PILASTRI
          </motion.h3>

          <div className="features-grid">
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="feature-icon">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="feature-title">Innovazione</h3>
              <p className="feature-description">Utilizziamo tecnologie all'avanguardia per l'analisi delle prestazioni e lo sviluppo dei talenti.</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="feature-icon">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Community</h3>
              <p className="feature-description">Una community attiva e partecipe che supporta il nostro progetto di crescita.</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="feature-icon">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="feature-title">Sostenibilità</h3>
              <p className="feature-description">Gestione trasparente e sostenibile per garantire un futuro solido al nostro club.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      {/* <section className="teams-section">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            LE NOSTRE SQUADRE
          </motion.h2>
          <div className="section-divider"></div>
          <motion.h3 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Passione e Talento: Scopri le Squadre di Hyria Basket
          </motion.h3>

          <div className="teams-grid">
            {[
              { name: "Prima Squadra", image: "/images/prima-squadra.jpg" },
              { name: "Under 19", image: "/images/under19.jpg" },
              { name: "Under 17", image: "/images/under17.jpg" },
              { name: "Under 15", image: "/images/under15.jpg" },
              { name: "Under 13", image: "/images/under13.jpg" },
              { name: "Minibasket", image: "/images/minibasket.jpg" }
            ].map((team, index) => (
              <motion.div
                key={team.name}
                className="team-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="team-image-container">
                  <img src={team.image} alt={team.name} className="team-image" />
                  <div className="team-card-overlay">
                    <div className="team-card-content">
                      <h3 className="team-title">{team.name}</h3>
                      <button className="btn-small">Scopri di più</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { value: "50+", label: "ATLETI" },
              { value: "15+", label: "STAFF" },
              // { value: "1+", label: "ANNI" },
              { value: "1000+", label: "TIFOSI" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            LA NOSTRA GALLERIA
          </motion.h2>
          <div className="section-divider"></div>

          <div className="gallery-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
              <motion.div 
                key={item} 
                className="gallery-item"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (item % 4) * 0.1 }}
              >
                <img src={`/images/gallery-${item}.jpg`} alt={`Gallery image ${item}`} />
              </motion.div>
            ))}
          </div>
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
            <h2 className="cta-title">
              Entra a Far Parte della <span className="gradient-text">Famiglia Hyria</span>
            </h2>
            <p className="cta-description">
              Unisciti a noi e diventa protagonista di una nuova era del basket
            </p>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/contatti'}
            >
              CONTATTACI ORA
            </motion.button>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;