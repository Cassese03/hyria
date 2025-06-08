import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionTitle from '../components/SectionTitle';

const SettoreGiovanile: React.FC = () => {
  const categories = [
    {
      name: "Minibasket",
      ageRange: "5-11 anni",
      description: "Il percorso di Minibasket è pensato per avvicinare i bambini al mondo della pallacanestro attraverso il gioco e il divertimento. Le attività sono strutturate per sviluppare coordinazione, capacità motorie e spirito di squadra.",
      schedule: "Lunedì, Mercoledì e Venerdì",
      image: "/images/minibasket.jpg",
      groups: ["Pulcini (5-6 anni)", "Scoiattoli (7-8 anni)", "Aquilotti (9-10 anni)", "Esordienti (11 anni)"]
    },
    {
      name: "Under 13",
      ageRange: "12-13 anni",
      description: "Categoria fondamentale per il passaggio dal minibasket alla pallacanestro vera e propria. Si iniziano ad apprendere i fondamentali tecnici e tattici, mantenendo sempre un approccio ludico.",
      schedule: "Martedì, Giovedì e Venerdì",
      image: "/images/under13.jpg"
    },
    {
      name: "Under 15",
      ageRange: "14-15 anni",
      description: "In questa fase i ragazzi apprendono aspetti più avanzati del gioco, con un equilibrio tra sviluppo tecnico individuale e comprensione tattica del gioco di squadra.",
      schedule: "Lunedì, Mercoledì e Venerdì",
      image: "/images/under15.jpg"
    },
    {
      name: "Under 17",
      ageRange: "16-17 anni",
      description: "Categoria importante per la crescita agonistica dei giovani atleti. L'obiettivo è formare giocatori completi, con una solida preparazione tecnica, fisica e mentale.",
      schedule: "Martedì, Giovedì e Sabato mattina",
      image: "/images/under17.jpg"
    },
    {
      name: "Under 19",
      ageRange: "18-19 anni",
      description: "Ultima tappa del percorso giovanile, rappresenta il ponte verso il basket senior. I ragazzi più promettenti hanno l'opportunità di allenarsi anche con la prima squadra.",
      schedule: "Lunedì, Mercoledì e Venerdì",
      image: "/images/under19.jpg"
    }
  ];

  const coaches = [
    { name: "Marco Rossi", role: "Responsabile minibasket", image: "/images/coach1.jpg" },
    { name: "Laura Bianchi", role: "Allenatrice Minibasket", image: "/images/coach2.jpg" },
    { name: "Luca Verdi", role: "Allenatore Under 13/15", image: "/images/coach3.jpg" },
    { name: "Giulia Neri", role: "Allenatrice Under 17/19", image: "/images/coach4.jpg" }
  ];

  const methodologies = [
    {
      title: "Approccio Progressivo",
      description: "Programmi di allenamento adattati all'età e al livello di sviluppo psicofisico",
      icon: "📈"
    },
    {
      title: "Tecnologia",
      description: "Utilizzo di strumenti digitali per l'analisi tecnica e la valutazione dei progressi",
      icon: "🔍"
    },
    {
      title: "Sviluppo Completo",
      description: "Attenzione agli aspetti tecnici, tattici, fisici e mentali del giocatore",
      icon: "🧠"
    },
    {
      title: "Valori Educativi",
      description: "Rispetto, disciplina e spirito di squadra come pilastri fondamentali",
      icon: "🤝"
    }
  ];

  return (
    <div className="settore-giovanile-page">
      <PageHero 
        backgroundImage="/images/contact-hero.jpg"
        normalText="SETTORE"
        coloredText="GIOVANILE"
        subtitle="Il futuro del basket parte da qui"
      />

      {/* Intro Section */}
      <section className="section-padding">
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
            >
              <p className="text-lg mb-6">
                Il minibasket rappresenta il cuore del progetto Hyria Basket. Crediamo fermamente che la crescita di una società sportiva passi attraverso lo sviluppo dei giovani atleti del territorio.
              </p>
              <p className="text-lg mb-6">
                Il nostro programma è strutturato per accompagnare bambini e ragazzi in un percorso di crescita sportiva e personale, dal Minibasket fino alle soglie della prima squadra.
              </p>
              <p className="text-lg">
                Ogni categoria ha obiettivi specifici e programmi di allenamento adeguati all'età e al livello tecnico, ma tutti condividono la stessa filosofia: insegnare il basket come scuola di vita, trasmettendo valori come rispetto, impegno e spirito di squadra.
              </p>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">I nostri numeri:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-gray-100">
                    <p className="text-3xl font-bold text-hyria-tertiary">120+</p>
                    <p className="text-sm font-medium">GIOVANI ATLETI</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-100">
                    <p className="text-3xl font-bold text-hyria-tertiary">5</p>
                    <p className="text-sm font-medium">CATEGORIE</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-100">
                    <p className="text-3xl font-bold text-hyria-tertiary">8</p>
                    <p className="text-sm font-medium">ALLENATORI</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-100">
                    <p className="text-3xl font-bold text-hyria-tertiary">3</p>
                    <p className="text-sm font-medium">IMPIANTI</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-lg overflow-hidden shadow-xl"
            >
              <img 
                src="/images/settore-giovanile-intro.jpg" 
                alt="minibasket Hyria Basket" 
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="section-padding bg-gray-100">
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
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                <p className="text-gray-600">{method.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
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
                <div className="rounded-lg overflow-hidden shadow-xl" style={{ direction: 'ltr' }}>
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-auto object-cover aspect-video"
                  />
                </div>
                
                <div className="space-y-4" style={{ direction: 'ltr' }}>
                  <h3 className="text-2xl font-bold">{category.name}</h3>
                  <div className="inline-block px-3 py-1 bg-hyria-tertiary text-white rounded-full text-sm">
                    {category.ageRange}
                  </div>
                  <p className="text-lg">{category.description}</p>
                  
                  <div className="flex items-center mt-4">
                    <div className="mr-2">
                      <svg className="h-5 w-5 text-hyria-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p><strong>Allenamenti:</strong> {category.schedule}</p>
                  </div>
                  
                  {category.groups && (
                    <div className="mt-4">
                      <h4 className="font-bold mb-2">Gruppi:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.groups.map((group) => (
                          <span 
                            key={group} 
                            className="px-2 py-1 bg-gray-200 rounded-md text-sm"
                          >
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <motion.button
                    className="btn-primary mt-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
      <section className="section-padding bg-gray-100">
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
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={coach.image} 
                    alt={coach.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg">{coach.name}</h3>
                  <p className="text-sm text-gray-600">{coach.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="container">
          <SectionTitle 
            title="TESTIMONIANZE" 
            subtitle="Le opinioni di chi ha scelto Hyria Basket per i propri figli"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                quote: "Mio figlio è entrato in Hyria come un bambino timido e insicuro. Oggi, dopo 3 anni, è diventato un ragazzo più sicuro di sé, con tanti amici e una passione incredibile per il basket.",
                author: "Francesca, mamma di Luca (11 anni)"
              },
              {
                quote: "Gli allenatori non si limitano ad insegnare basket, ma trasmettono valori importanti come il rispetto e l'impegno. È un ambiente sano dove i ragazzi crescono non solo come atleti ma come persone.",
                author: "Paolo, papà di Marco (15 anni)"
              },
              {
                quote: "La tecnologia utilizzata negli allenamenti permette ai ragazzi di vedere e capire i propri errori. Mia figlia è migliorata tantissimo da quando frequenta Hyria Basket.",
                author: "Elena, mamma di Sofia (17 anni)"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-100 p-6 rounded-lg border-l-4 border-hyria-tertiary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <svg className="h-8 w-8 text-hyria-tertiary opacity-50 mb-4" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H7c0-1.7 1.3-3 3-3V8zm12 0c-3.3 0-6 2.7-6 6v10h10V14h-7c0-1.7 1.3-3 3-3V8z"/>
                </svg>
                <p className="italic mb-4">{testimonial.quote}</p>
                <p className="font-medium text-right">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-100">
        <div className="container">
          <SectionTitle 
            title="DOMANDE FREQUENTI" 
            subtitle="Tutto quello che devi sapere sul nostro minibasket"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {[
              {
                question: "Come posso iscrivere mio figlio/a?",
                answer: "Per iscrivere tuo figlio/a al minibasket di Hyria Basket, puoi contattarci tramite i nostri profili social  o contattarci telefonicamente per fissare un appuntamento. Sarà necessario compilare il modulo di iscrizione e presentare un certificato medico sportivo valido."
              },
              {
                question: "Quali sono i costi di iscrizione?",
                answer: "I costi variano in base alla categoria e comprendono il kit di abbigliamento, l'assicurazione e la tessera FIP. Contattaci per ricevere informazioni dettagliate sui costi per la stagione in corso e sulle eventuali facilitazioni per famiglie con più figli iscritti."
              },
              {
                question: "È possibile effettuare allenamenti di prova?",
                answer: "Certamente! Offriamo la possibilità di effettuare fino a 2 allenamenti di prova gratuiti per consentire ai ragazzi di conoscere l'ambiente e la metodologia di allenamento prima di procedere all'iscrizione."
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
                <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
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
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                RICHIEDI INFORMAZIONI
              </motion.button>
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                PRENOTA UNA PROVA GRATUITA
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SettoreGiovanile;
