import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionTitle from '../components/SectionTitle';
import PageHead from '../components/PageHead';

const SettoreGiovanile: React.FC = () => {
  const categories = [
    {
      name: "Minibasket",
      ageRange: "5-11 anni",
      description: "Il percorso di Minibasket è pensato per avvicinare i bambini al mondo della pallacanestro attraverso il gioco e il divertimento. Le attività sono strutturate per sviluppare coordinazione, capacità motorie e spirito di squadra.",
      schedule: "2 a settimana",
      image: "/images/minibasket.jpg",
      groups: ["Pulcini (5-6 anni)", "Scoiattoli (7-8 anni)", "Aquilotti (9-10 anni)", "Esordienti (11 anni)"]
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

  const coaches = [
    { name: "Attilio De Sena", role: "Responsabile/ Allenatore minibasket", image: "/images/contact-hero.jpg" },
    { name: "Lorenzo Cassese", role: "Allenatore Minibasket", image: "/images/contact-hero.jpg" },
    { name: "Davide Esposito", role: "Allenatore Minibasket", image: "/images/contact-hero.jpg" },
  ];

  const methodologies = [
    {
      title: "Approccio Progressivo",
      description: "Programmi di allenamento adattati all'età e al livello di sviluppo psicofisico",
      icon: "📈"
    },
    {
      title: "Sviluppo Completo",
      description: "Attenzione agli aspetti tecnici, fisici e mentali del giocatore",
      icon: "🧠"
    },
    {
      title: "Valori Educativi",
      description: "Rispetto, disciplina e spirito di squadra come pilastri fondamentali",
      icon: "🤝"
    }
  ];

  const settoreStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Settore Giovanile - Hyria Basket",
    "description": "Scopri il settore giovanile di Hyria Basket. Corsi, allenamenti e sviluppo per giovani talenti del basket a Nola.",
    "url": "https://hyriabasket.it/settore-giovanile"
  };

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
        structuredData={settoreStructuredData}
      />
      
      <div className="settore-giovanile-page">
        <PageHero
          backgroundImage="/images/contact-hero.jpg"
          normalText="SETTORE"
          coloredText="GIOVANILE"
          subtitle="Il futuro del basket parte da qui"
        />

        {/* Intro Section */}
        <section className="cta-section section-padding">
          <div className="container">
            <SectionTitle
              title="IL NOSTRO PROGETTO"
              subtitle="Formiamo i campioni del domani sul campo e nella vita"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ textShadow: 'center' }}
              >
                <p className="text-lg mb-6" style={{ color: '#d96c00' }}>
                  Il minibasket rappresenta il cuore del progetto futuro Hyria Basket. Crediamo fermamente che la crescita di una società sportiva passi attraverso lo sviluppo dei giovani atleti del territorio.
                </p>
                <p className="text-lg mb-6" style={{ color: '#d96c00' }}>
                  Il nostro programma è strutturato per accompagnare bambini e ragazzi in un percorso di crescita sportiva e personale, dal Minibasket fino alle soglie della prima squadra.
                </p>
                <p className="text-lg" style={{ color: '#d96c00' }}>
                  Ogni categoria ha obiettivi specifici e programmi di allenamento adeguati all'età e al livello tecnico, ma tutti condividono la stessa filosofia: insegnare il basket come scuola di vita, trasmettendo valori come rispetto, impegno e spirito di squadra.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="about-section section-padding bg-gray-100">
          <div className="container">
            <SectionTitle
              title="IL NOSTRO METODO"
              subtitle="Un approccio innovativo alla formazione dei giovani atleti"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {methodologies.map((method, index) => (
                <motion.div
                  key={method.title}
                  className="bg-white p-6 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#d96c00' }}>{method.icon} {method.title}</h3>
                  <p className="text-gray-600" style={{ color: 'white' }}>{method.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="cta-section section-padding">
          <div className="container">
            <SectionTitle
              title="LE NOSTRE CATEGORIE"
              subtitle="Un percorso completo dalla scuola minibasket alle soglie della prima squadra"
            />

            <div className="space-y-20 mt-12">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  style={{ direction: index % 2 === 0 ? 'ltr' : 'rtl' }}
                >
                  <div className="space-y-4" style={{ direction: 'ltr' }}>
                    <h3 className="text-2xl font-bold " style={{ color: '#5e0303' }}>{category.name}</h3>
                    <div className="inline-block px-3 py-1 bg-hyria-tertiary text-white rounded-full text-sm" style={{ color: 'white' }}>
                      {category.ageRange}
                    </div>
                    <p className="text-lg" style={{ color: 'white' }}>{category.description}</p>

                    <div className="flex items-center mt-4">
                      <strong style={{ color: '#5e0303' }}>Allenamenti:</strong>
                      <p style={{ color: '#d96c00' }}>{category.schedule}</p>
                    </div>

                    {category.groups && (
                      <div className="mt-4"  style={{textAlign:'center'}}>
                        <h4 className="font-bold mb-2" style={{ color: '#5e0303' }}>Gruppi:</h4>
                        <div className="flex flex-wrap gap-2"  style={{textAlign:'center'}}>
                          <ul style={{ textAlign: 'center' }}>
                            {category.groups.map((group) => (
                              <li style={{textAlign:'left'}}>
                                <span
                                key={group} style={{ color: 'white' }}
                                className="px-2 py-1 bg-gray-200 rounded-md text-sm"
                              >
                                {group}
                              </span></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <motion.button
                      className="btn-primary mt-6"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.href = '/contatti'}
                    >
                      INFORMAZIONI E ISCRIZIONI
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Coaches Section */}
        <section className="about-section section-padding bg-gray-100" style={{height:'230vh!important;'}}>
          <div className="container">
            <SectionTitle
              title="IL NOSTRO STAFF TECNICO"
              subtitle="Professionisti qualificati e appassionati"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {coaches.map((coach, index) => (
                <motion.div
                  key={coach.name}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{ textAlign: 'center',color:'white' }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={coach.image}
                      alt={''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                  <p className="text-sm text-gray-600" style={ {color:'#5e0303'}}>{coach.role}</p>
                    <h3 className="font-bold text-lg" style={ {color:'#d96c00'}}>{coach.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="cta-section section-padding bg-gray-100">
          <div className="container">
            <SectionTitle
              title="DOMANDE FREQUENTI"
              subtitle="Tutto quello che devi sapere sul nostro minibasket"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {[
                {
                  question: "Come posso iscrivere mio figlio/a?",
                  answer: "Per iscrivere tuo figlio/a al minibasket di Hyria Basket, puoi contattarci tramite i nostri profili social  o contattarci telefonicamente. Sarà necessario compilare il modulo di iscrizione e presentare un certificato medico sportivo valido."
                },
                {
                  question: "Quali sono i costi di iscrizione?",
                  answer: "I costi variano in base alla categoria e comprendono il kit di abbigliamento e la tessera FIP. Contattaci per ricevere informazioni dettagliate sui costi per la stagione in corso e sulle eventuali facilitazioni per famiglie con più figli iscritti."
                },
                {
                  question: "È possibile effettuare allenamenti di prova?",
                  answer: "Certamente! Offriamo la possibilità di effettuare fino a 3 allenamenti di prova gratuiti per consentire ai ragazzi di conoscere l'ambiente e la metodologia di allenamento prima di procedere all'iscrizione."
                },
                {
                  question: "Dove si svolgono gli allenamenti?",
                  answer: "Gli allenamenti si svolgono presso il nostro impianto principale di Nola e in altre strutture convenzionate nella zona. Gli indirizzi esatti vengono comunicati al momento dell'iscrizione in base alla categoria di appartenenza."
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-bold mb-3" style={{color:'#5e0303'}}>{faq.question}</h3>
                  <p className="text-gray-600" style={{color:'white'}}>{faq.answer}</p>
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
                Unisciti al nostro <span className="gradient-text">minibasket</span>
              </h2>
              <p className="cta-description">
                Scopri il divertimento e i benefici di giocare a basket con Hyria
              </p>
              <div className="flex flex-wrap gap-4 justify-center mt-6">
                <motion.button
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/contatti'}
                >
                  PRENOTA UNA PROVA GRATUITA
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SettoreGiovanile;
