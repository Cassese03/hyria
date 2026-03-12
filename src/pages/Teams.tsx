import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import { heroContainer, heroItem, staggerContainer, fadeInUp, revealTransition, scaleReveal } from '../utils/animations';

const MotionLink = motion(Link);

const TEAM_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Prima Squadra - Hyria Basket",
  "description": "Scopri la prima squadra di Hyria Basket per la stagione 2025. Roster, staff tecnico e obiettivi della squadra di basket di Nola.",
  "url": "https://hyriabasket.it/team"
};

const PLAYERS = [
  { name: 'Davide Esposito',       number: 19, position: 'Playmaker',  image: '/maglie/9.png'  },
  { name: 'Attilio De Sena',       number: 32, position: 'Playmaker',  image: '/maglie/4.png'  },
  { name: 'Giovanni Sangermano',   number: 34, position: 'Guardia',    image: '/maglie/2.png'  },
  { name: 'Paolino Franzese',      number: 30, position: 'Guardia',    image: '/maglie/15.png' },
  { name: 'Lorenzo Cassese',       number: 33, position: 'Ala Piccola',image: '/maglie/1.png'  },
  { name: 'Giacomo Mascolo',       number: 35, position: 'Ala Piccola',image: '/maglie/3.png'  },
  { name: 'Christian Guida',       number: 21, position: 'Ala Piccola',image: '/maglie/7.png'  },
  { name: 'Agostino Pio Esposito', number: 5,  position: 'Ala Grande', image: '/maglie/8.png'  },
  { name: 'Christian Barrella',    number: 7,  position: 'Ala Piccola',image: '/maglie/10.png' },
  { name: 'Davide Guadagni',       number: 42, position: 'Ala Grande', image: '/maglie/6.png'  },
  { name: 'Giovanni Spiezia',      number: 9,  position: 'Ala Grande', image: '/maglie/11.png' },
  { name: 'Giovanni Attanasio',    number: 93, position: 'Guardia',    image: '/maglie/14.png' },
  { name: 'Luigi Manfellotto',     number: 0,  position: 'Centro',     image: '/maglie/12.png' },
  { name: 'Alessandro Ascione',    number: 3,  position: 'Guardia',    image: '/maglie/5.png'  },
  { name: 'Ciro Francesco Piscopo',number: 17, position: 'Ala Grande', image: '/maglie/17.png' },
];

const Teams = () => {
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
        structuredData={TEAM_STRUCTURED_DATA}
      />

      <div className="team-page teams-page teams-bolder">
        {/* Hero Section */}
        <section className="hero-section" style={{ minHeight: 'min(65vh, 650px)' }}>
          <div className="hero-background">
            <img
              src="/images/contact-hero.jpg"
              alt="Prima squadra Hyria Basket"
              className="hero-bg-image"
              width={1920}
              height={1080}
              decoding="async"
              fetchPriority="high"
            />
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="visible"
              className="hero-text-container"
            >
              <motion.p variants={heroItem} className="hero-kicker">
                NOLA · 2025/2026
              </motion.p>
              <motion.h1 variants={heroItem} className="hero-title">
                PRIMA <span className="hero-accent">SQUADRA</span>
              </motion.h1>
              <motion.div
                variants={scaleReveal}
                className="section-divider"
                style={{ transformOrigin: 'left center' }}
              />
            </motion.div>
          </div>
        </section>

        {/* Roster Section */}
        <section className="section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              STAGIONE 2025/2026
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.1 }}
            >
              La nostra prima squadra milita nel campionato regionale DR2 Campania ed è la punta di diamante del progetto Hyria Basket.
            </motion.p>

            <motion.div
              className="teams-roster-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
            >
              {PLAYERS.map((player) => (
                <motion.div
                  key={player.name}
                  className="player-card"
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className="player-card-visual">
                    <span className="player-number-bg" aria-hidden="true">{player.number}</span>
                    <img
                      src={player.image}
                      alt={`Maglia di ${player.name}`}
                      className="player-jersey"
                      width={200}
                      height={240}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="player-card-info">
                    <p className="player-name">{player.name}</p>
                    <p className="player-position">{player.position}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
                Sostieni i nostri <span className="teams-cta-accent">campioni</span>
              </h2>
              <p className="cta-description">
                Vieni a tifare per noi alle nostre partite!
              </p>
              <MotionLink
                to="/contatti"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                SOSTIENI IL PROGETTO
              </MotionLink>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Teams;