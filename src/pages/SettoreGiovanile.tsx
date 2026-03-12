import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import { heroContainer, heroItem, staggerContainer, fadeInUp, scaleReveal, revealTransition } from '../utils/animations';

const MotionLink = motion(Link);

const SETTORE_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Settore Giovanile - Hyria Basket',
  description: 'Scopri il settore giovanile di Hyria Basket. Corsi, allenamenti e sviluppo per giovani talenti del basket a Nola.',
  url: 'https://hyriabasket.it/settore-giovanile',
};

const CATEGORIES = [
  {
    name: 'Minibasket',
    ageRange: '5–11 anni',
    description: 'Il percorso di Minibasket è pensato per avvicinare i bambini al mondo della pallacanestro attraverso il gioco e il divertimento. Le attività sono strutturate per sviluppare coordinazione, capacità motorie e spirito di squadra.',
    schedule: '2 sessioni a settimana',
    groups: ['Pulcini (5-6 anni)', 'Scoiattoli (7-8 anni)', 'Aquilotti (9-10 anni)', 'Esordienti (11 anni)'],
  },
    // {
    //   name: "Under 13",
    //   ageRange: "12-13 anni",
    //   description: "Categoria fondamentale per il passaggio dal minibasket alla pallacanestro vera e propria. Si iniziano ad apprendere i fondamentali tecnici e tattici, mantenendo sempre un approccio ludico.",
    //   schedule: "Martedì, Giovedì e Venerdì",
    //   image: "/images/under13.jpg"
    // },
    // {
    //   name: "Under 15",
    //   ageRange: "14-15 anni",
    //   description: "In questa fase i ragazzi apprendono aspetti più avanzati del gioco, con un equilibrio tra sviluppo tecnico individuale e comprensione tattica del gioco di squadra.",
    //   schedule: "Lunedì, Mercoledì e Venerdì",
    //   image: "/images/under15.jpg"
    // },
    // {
    //   name: "Under 17",
    //   ageRange: "16-17 anni",
    //   description: "Categoria importante per la crescita agonistica dei giovani atleti. L'obiettivo è formare giocatori completi, con una solida preparazione tecnica, fisica e mentale.",
    //   schedule: "Martedì, Giovedì e Sabato mattina",
    //   image: "/images/under17.jpg"
    // },
    // {
    //   name: "Under 19",
    //   ageRange: "18-19 anni",
    //   description: "Ultima tappa del percorso giovanile, rappresenta il ponte verso il basket senior. I ragazzi più promettenti hanno l'opportunità di allenarsi anche con la prima squadra.",
    //   schedule: "Lunedì, Mercoledì e Venerdì",
    //   image: "/images/under19.jpg"
    // }
];

const COACHES = [
  { name: 'Attilio De Sena',   role: 'Responsabile · Allenatore Minibasket', image: '/images/contact-hero.jpg' },
  { name: 'Agostino Esposito', role: 'Allenatore Minibasket',                 image: '/images/contact-hero.jpg' },
  { name: 'Paolino Franzese',  role: 'Allenatore Minibasket',                 image: '/images/contact-hero.jpg' },
  { name: 'Davide Esposito',   role: 'Allenatore Minibasket',                 image: '/images/contact-hero.jpg' },
  { name: 'Giacomo Mascolo',   role: 'Allenatore Minibasket',                 image: '/images/contact-hero.jpg' },
];

const METHODOLOGIES = [
  {
    num: '01',
    title: 'Approccio Progressivo',
    description: "Programmi di allenamento adattati all'età e al livello di sviluppo psicofisico di ogni bambino.",
  },
  {
    num: '02',
    title: 'Sviluppo Completo',
    description: 'Attenzione agli aspetti tecnici, fisici e mentali del giocatore per una crescita armoniosa.',
  },
  {
    num: '03',
    title: 'Valori Educativi',
    description: 'Rispetto, disciplina e spirito di squadra come pilastri fondamentali del percorso sportivo.',
  },
];

const FAQS = [
  {
    question: 'Come posso iscrivere mio figlio/a?',
    answer: 'Per iscrivere tuo figlio/a al minibasket di Hyria Basket, puoi contattarci tramite i nostri profili social o telefonicamente. Sarà necessario compilare il modulo di iscrizione e presentare un certificato medico sportivo valido.',
  },
  {
    question: 'Quali sono i costi di iscrizione?',
    answer: 'I costi variano in base alla categoria e comprendono il kit di abbigliamento e la tessera FIP. Contattaci per informazioni dettagliate e sulle eventuali facilitazioni per famiglie con più figli iscritti.',
  },
  {
    question: 'È possibile effettuare allenamenti di prova?',
    answer: "Certamente! Offriamo la possibilità di effettuare fino a 3 allenamenti di prova gratuiti per consentire ai ragazzi di conoscere l'ambiente prima di procedere all'iscrizione.",
  },
  {
    question: 'Dove si svolgono gli allenamenti?',
    answer: 'Gli allenamenti si svolgono presso il nostro impianto principale di Nola e in altre strutture convenzionate nella zona. Gli indirizzi vengono comunicati al momento dell\'iscrizione.',
  },
];

const SettoreGiovanile: React.FC = () => {
  return (
    <>
      <PageHead
        title="Settore Giovanile | Basket a Nola – Hyriabasket"
        description="Scopri il settore giovanile di Hyria Basket a Nola. Corsi di basket per bambini e ragazzi, allenamenti qualificati e sviluppo dei giovani talenti."
        keywords="settore giovanile, basket bambini, minibasket, Nola, Hyria, allenamenti giovani, scuola basket"
        ogTitle="Settore Giovanile Hyria Basket - Basket per Bambini e Ragazzi"
        ogDescription="Il settore giovanile di Hyria Basket offre corsi di basket per tutte le età. Allenamenti qualificati e sviluppo dei giovani talenti a Nola."
        ogUrl="https://hyriabasket.it/settore-giovanile"
        canonicalUrl="https://hyriabasket.it/settore-giovanile"
        structuredData={SETTORE_STRUCTURED_DATA}
      />

      <div className="settore-giovanile-page settore-bolder">

        {/* Hero */}
        <section className="hero-section settore-hero">
          <div className="hero-background">
            <img
              src="/images/contact-hero.jpg"
              alt="Giovani atleti Hyria Basket"
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
                NOLA · MINIBASKET
              </motion.p>
              <motion.h1 variants={heroItem} className="hero-title">
                SETTORE <span className="hero-accent">GIOVANILE</span>
              </motion.h1>
              <motion.p variants={heroItem} className="settore-hero-lead">
                Il futuro del basket parte da qui.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Intro — editorial 2-col */}
        <section className="about-section section-padding">
          <div className="container">
            <div className="settore-intro-grid">
              <div className="settore-intro-main">
                <motion.h2
                  className="section-title"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={revealTransition}
                >
                  IL NOSTRO PROGETTO
                </motion.h2>
                <motion.div
                  className="section-divider"
                  variants={scaleReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  style={{ transformOrigin: 'left center' }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...revealTransition, delay: 0.1 }}
                >
                  <p className="text-lg mb-6 text-white/85">
                    Il minibasket rappresenta il cuore del progetto futuro Hyria Basket. Crediamo fermamente che la crescita di una società sportiva passi attraverso lo sviluppo dei giovani atleti del territorio.
                  </p>
                  <p className="text-lg mb-6 text-white/85">
                    Il nostro programma è strutturato per accompagnare bambini e ragazzi in un percorso di crescita sportiva e personale, dal Minibasket fino alle soglie della prima squadra.
                  </p>
                  <p className="text-lg text-white/85">
                    Ogni categoria ha obiettivi specifici e programmi adeguati all'età e al livello tecnico, ma tutti condividono la stessa filosofia: insegnare il basket come scuola di vita.
                  </p>
                </motion.div>
              </div>
              <motion.aside
                className="settore-intro-aside"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={revealTransition}
              >
                <blockquote className="settore-pull-quote">
                  <span>Formiamo campioni</span>
                  sul campo e nella vita.
                </blockquote>
                <div className="settore-age-badge">5–11 ANNI</div>
              </motion.aside>
            </div>
          </div>
        </section>

        {/* Methodology — numbered editorial rows */}
        <section className="features-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              IL NOSTRO METODO
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.div
              className="settore-method-list"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {METHODOLOGIES.map((m) => (
                <motion.div key={m.num} className="settore-method-row" variants={fadeInUp}>
                  <span className="settore-method-num">{m.num}</span>
                  <div className="settore-method-body">
                    <h3 className="settore-method-title">{m.title}</h3>
                    <p className="settore-method-desc">{m.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Categories — featured card */}
        <section className="about-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              LE NOSTRE CATEGORIE
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat.name}
                className="settore-category-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={revealTransition}
              >
                <div className="settore-category-header">
                  <div className="settore-category-name-wrap">
                    <h3 className="settore-category-name">{cat.name}</h3>
                    <span className="settore-category-age">{cat.ageRange}</span>
                  </div>
                  <div className="settore-category-schedule">
                    <span className="settore-schedule-label">FREQUENZA</span>
                    <span className="settore-schedule-value">{cat.schedule}</span>
                  </div>
                </div>
                <p className="settore-category-desc">{cat.description}</p>
                {cat.groups && (
                  <div className="settore-groups">
                    {cat.groups.map((g) => (
                      <span key={g} className="settore-group-pill">{g}</span>
                    ))}
                  </div>
                )}
                <MotionLink
                  to="/contatti"
                  className="btn-primary settore-category-cta"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  INFORMAZIONI E ISCRIZIONI
                </MotionLink>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Coaches */}
        <section className="teams-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              STAFF TECNICO
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {COACHES.map((coach, index) => (
                <motion.div
                  key={coach.name}
                  className={`card p-6 text-center${index === 0 ? ' settore-coach-featured' : ''}`}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  style={{ willChange: 'transform' }}
                >
                  <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="w-full h-full object-cover"
                      width={160}
                      height={160}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-hyria-secondary text-center">{coach.name}</h3>
                  <p className="text-sm font-medium text-center text-white/60">{coach.role}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ — numbered rows */}
        <section className="features-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              DOMANDE FREQUENTI
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.div
              className="settore-faq-list"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {FAQS.map((faq, index) => (
                <motion.div key={index} className="settore-faq-row" variants={fadeInUp}>
                  <span className="settore-faq-num">0{index + 1}</span>
                  <div className="settore-faq-body">
                    <h3 className="settore-faq-question">{faq.question}</h3>
                    <p className="settore-faq-answer">{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="cta-content"
            >
              <h2 className="cta-title">
                Porta il tuo bambino a <span className="settore-cta-accent">giocare con noi</span>
              </h2>
              <p className="cta-description">
                3 allenamenti di prova gratuiti — nessun impegno, solo divertimento
              </p>
              <MotionLink
                to="/contatti"
                className="btn-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                PRENOTA UNA PROVA GRATUITA
              </MotionLink>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
};

export default SettoreGiovanile;
