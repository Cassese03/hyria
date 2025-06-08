import { motion } from 'framer-motion';

const Contact = () => {

  const faqs = [
    {
      question: "Come posso iscrivermi alle attività di Hyria Basket?",
      answer: "Per iscriverti puoi contattarci tramite i nostri profili social , oppure contattarci via email o telefono per fissare un appuntamento. Sarà necessario compilare il modulo di iscrizione e presentare un certificato medico valido."
    },
    {
      question: "Quali sono i costi di iscrizione?",
      answer: "I costi variano in base al tipo di attività e promozioni varie. Contattaci per ricevere informazioni dettagliate sui costi e sulle eventuali promozioni in corso."
    },
    {
      question: "Da che età si può iniziare a praticare baske<t?",
      answer: "I nostri corsi di minibasket accolgono bambini a partire dai 5 anni. Per i più piccoli abbiamo attività ludico-motorie propedeutiche e all'inclusione al basket."
    },
    {
      question: "Dove si svolgono gli allenamenti?",
      answer: "Gli allenamenti si svolgono presso il nostro palazzetto principale a Nola e in altre strutture convenzionate nella zona. Gli indirizzi esatti vengono comunicati al momento dell'iscrizione."
    }
  ];


  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ height: '60vh' }}>
        <div className="hero-background">
          <img src="/images/contact-hero.jpg" alt="Contatti Hyria Basket" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text-container"
          >
            <h1 className="hero-title">
              <span style={{color:'#d96c00'}}>CONTATTI</span>
            </h1>
            <div className="section-divider"></div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="cta-section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 bg-white/5 p-8 rounded-lg backdrop-blur-sm border border-white/10"
            >
              <div>
                <h2 className="text-3xl font-bold mb-6 text-hyria-tertiary" style={{ color: '#d96c00' }}> Contattaci</h2>
                <p className="text-lg mb-8 text-gray-300" style={{ color: 'white' }}>
                  Hai domande sul nostro progetto, sui corsi di basket o vuoi semplicemente saperne di più?
                  Non esitare a contattarci, saremo felici di risponderti.
                </p>
              </div>

              <div className="space-y-6">
                <motion.div
                  className="flex items-start hover:transform hover:translate-x-2 transition-transform duration-300"
                  whileHover={{ scale: 1.02 }}
                >

                  <div>
                    <h3 className="font-semibold text-lg text-hyria-tertiary" style={{ color: '#d96c00' }}> Indirizzo</h3>
                    <p className="text-gray-300" style={{ color: 'white' }}>Via Madonna delle Grazie, 61 - 80035 Nola (NA)</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start hover:transform hover:translate-x-2 transition-transform duration-300"
                  whileHover={{ scale: 1.02 }}
                >

                  <div>
                    <h3 className="font-semibold text-lg text-hyria-tertiary" style={{ color: '#d96c00' }}> Telefono</h3>
                    <p className="text-gray-300" style={{ color: 'white' }}>Attilio +39 333 746 1777</p>
                    <p className="text-gray-300" style={{ color: 'white' }}>Paolino +39 331 402 3282</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start hover:transform hover:translate-x-2 transition-transform duration-300"
                  whileHover={{ scale: 1.02 }}
                >

                  <div>
                    <h3 className="font-semibold text-lg text-hyria-tertiary" style={{ color: '#d96c00' }}> Email</h3>
                    <p className="text-gray-300" style={{ color: 'white' }}>info@hyriabasket.it</p>
                  </div>
                </motion.div>

              </div>

            </motion.div>
            {/* FAQ Section */}
            <section className="cta-section">
              <div className="container">
                <motion.h2
                  className="section-title text-hyria-tertiary"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{ color: '#d96c00' }}
                >
                  DOMANDE FREQUENTI
                </motion.h2>
                <div className="section-divider"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  {faqs.map((faq, index) => (
                    <motion.div
                      style={{ color: '#d96c00' }}
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card hover:bg-white/20 transition-all duration-300"
                    >
                      <motion.div
                        className="p-6"
                        whileHover={{ x: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <h3 className="text-lg font-bold mb-3 text-hyria-tertiary">{faq.question}</h3>
                        <p className="text-gray-300" style={{ color: 'white' }}>{faq.answer}</p>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
            {/* Form Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 p-8 rounded-lg backdrop-blur-sm border border-white/10"
            >
              <h2 className="text-3xl font-bold mb-6 text-hyria-tertiary" style={{ color: '#d96c00' }}>Modulo di Contatto</h2>

              <div className="jotform-container">
                <iframe
                  id="JotFormIFrame-251582849354063"
                  title="Modulo di contatto Hyria Basket"
                  onLoad={() => {
                    window.parent.scrollTo(0, 0);

                    // Add JotForm script for automatic height adjustment
                    const iframe = document.getElementById('JotFormIFrame-251582849354063');
                    if (iframe) {
                      window.addEventListener('message', function (event) {
                        if (event.data.action === 'scrollIntoView' || event.data.action === 'setHeight') {
                          const height = event.data.height;
                          if (height) {
                            iframe.style.height = parseInt(height) + 50 + 'px'; // Add extra padding
                          }
                        }
                      });
                    }
                  }}
                  allowTransparency={true}
                  allowFullScreen={true}
                  allow="geolocation; microphone; camera"
                  src="https://form.jotform.com/251582849354063"
                  frameBorder="0"
                  style={{
                    minWidth: '100%',
                    height: '1300px', // Increase initial height to ensure visibility
                    border: 'none',
                    overflow: 'hidden'
                  }}
                  scrolling="no"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="about-section">
        <div className="container">
          <motion.h2
            className="section-title text-hyria-tertiary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ color: '#d96c00' }}
          >
            DOVE SIAMO
          </motion.h2>
          <div className="section-divider"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 h-[400px] rounded-lg overflow-hidden shadow-lg"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3014.617422555087!2d14.533819076267536!3d40.92413362460155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133bb3db602399a5%3A0x638012fb6713a298!2sVia%20Madonna%20delle%20Grazie%2C%2061%2C%2080035%20Nola%20NA!5e0!3m2!1sit!2sit!4v1749403025023!5m2!1sit!2sit"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default Contact;