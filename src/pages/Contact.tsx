import { motion } from 'framer-motion';
import PageHead from '../components/PageHead';
import ContactForm from '../components/ContactForm';
import { heroContainer, heroItem, staggerContainer, fadeInUp, scaleReveal, revealTransition } from '../utils/animations';

const CONTACT_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contatti - Hyria Basket',
  description: 'Contatta Hyria Basket per informazioni su corsi, iscrizioni e attività. Trova i nostri recapiti e modulo di contatto.',
  url: 'https://hyriabasket.it/contatti',
};

const CONTACT_INFO = [
  {
    num: '01',
    label: 'Telefono',
    lines: ['Attilio +39 333 746 1777', 'Paolino +39 331 402 3282'],
  },
  {
    num: '02',
    label: 'Email',
    lines: ['info@hyriabasket.it'],
  },
  {
    num: '03',
    label: 'Indirizzo',
    lines: ['Via Madonna delle Grazie, 61', 'Nola (NA) 80035'],
  },
];

const FAQS = [
  {
    question: 'Come posso iscrivermi alle attività di Hyria Basket?',
    answer: 'Per iscriverti puoi contattarci tramite i nostri profili social, oppure via email o telefono per fissare un appuntamento. Sarà necessario compilare il modulo di iscrizione e presentare un certificato medico valido.',
  },
  {
    question: 'Quali sono i costi di iscrizione?',
    answer: 'I costi variano in base al tipo di attività e promozioni varie. Contattaci per ricevere informazioni dettagliate sui costi e sulle eventuali promozioni in corso.',
  },
  {
    question: 'Da che età si può iniziare a praticare basket?',
    answer: 'I nostri corsi di minibasket accolgono bambini a partire dai 5 anni. Per i più piccoli abbiamo attività ludico-motorie propedeutiche e all\'inclusione al basket.',
  },
  {
    question: 'Dove si svolgono gli allenamenti?',
    answer: 'Gli allenamenti si svolgono presso il nostro palazzetto a Nola e in altre strutture convenzionate nella zona. Gli indirizzi esatti vengono comunicati al momento dell\'iscrizione.',
  },
];

const Contact = () => {

  return (
    <>
      <PageHead
        title="Contatti Hyriabasket – Squadra Basket Nola"
        description="Contatta Hyria Basket per informazioni su corsi, allenamenti e iscrizioni. Trova tutti i nostri recapiti telefonici, email e sede a Nola."
        keywords="contatti Hyria Basket, telefono basket Nola, email pallacanestro, iscrizioni minibasket, sede Nola"
        ogTitle="Contatti Hyria Basket - Informazioni e Iscrizioni"
        ogDescription="Contattaci per informazioni su corsi di basket, iscrizioni e attività. Tutti i recapiti di Hyria Basket a Nola."
        ogUrl="https://hyriabasket.it/contatti"
        canonicalUrl="https://hyriabasket.it/contatti"
        structuredData={CONTACT_STRUCTURED_DATA}
      />

      <div className="contact-page contact-bolder">
        {/* Hero Section */}
        <section className="hero-section contact-hero">
          <div className="hero-background">
            <img
              src="/images/contact-hero.jpg"
              alt="Contatti Hyria Basket"
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
                NOLA · CONTATTACI
              </motion.p>
              <motion.h1 variants={heroItem} className="hero-title">
                PAR<span className="hero-accent">LIAMO</span>
              </motion.h1>
            </motion.div>
          </div>
        </section>

        {/* Contact Body: Info + Form */}
        <section className="about-section section-padding contact-body">
          <div className="container">
            <div className="contact-body-grid">

              {/* Info Column */}
              <motion.div
                className="contact-info-col"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                <motion.h2 variants={fadeInUp} className="contact-info-heading">
                  RECAPITI
                </motion.h2>
                <motion.div
                  className="section-divider"
                  variants={scaleReveal}
                  style={{ transformOrigin: 'left center' }}
                />
                {CONTACT_INFO.map((item) => (
                  <motion.div key={item.num} className="contact-info-row" variants={fadeInUp}>
                    <span className="contact-info-num">{item.num}</span>
                    <div className="contact-info-body">
                      <h3 className="contact-info-label">{item.label}</h3>
                      {item.lines.map((line) => (
                        <p className="contact-info-line" key={line}>{line}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Form Column */}
              <motion.div
                className="contact-form-col"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={revealTransition}
              >
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
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
              className="contact-faq-list"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {FAQS.map((faq, index) => (
                <motion.div key={index} className="contact-faq-row" variants={fadeInUp}>
                  <span className="contact-faq-num">0{index + 1}</span>
                  <div className="contact-faq-body">
                    <h3 className="contact-faq-question">{faq.question}</h3>
                    <p className="contact-faq-answer">{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Map Section */}
        <section className="about-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              DOVE SIAMO
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
              className="contact-map-frame"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3014.617422555087!2d14.533819076267536!3d40.92413362460155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133bb3db602399a5%3A0x638012fb6713a298!2sVia%20Madonna%20delle%20Grazie%2C%2061%2C%2080035%20Nola%20NA!5e0!3m2!1sit!2sit!4v1749403025023!5m2!1sit!2sit"
                width="100%"
                height="100%"
                style={{ border: 0 , height: '100%' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sede Hyria Basket - Via Madonna delle Grazie 61, Nola"
              />
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
