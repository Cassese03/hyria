import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionTitle from '../components/SectionTitle';

const Sponsor: React.FC = () => {
  const mainSponsors = [
    { name: "TechCorp", image: "/images/sponsors/main-sponsor-1.jpg", website: "https://techcorp.example.com" },
    { name: "SportGear", image: "/images/sponsors/main-sponsor-2.jpg", website: "https://sportgear.example.com" },
  ];
  
  const goldSponsors = [
    { name: "Global Finance", image: "/images/sponsors/gold-sponsor-1.jpg", website: "https://globalfinance.example.com" },
    { name: "MediaGroup", image: "/images/sponsors/gold-sponsor-2.jpg", website: "https://mediagroup.example.com" },
    { name: "ItalMotors", image: "/images/sponsors/gold-sponsor-3.jpg", website: "https://italmotors.example.com" },
  ];
  
  const silverSponsors = [
    { name: "LocalBank", image: "/images/sponsors/silver-sponsor-1.jpg", website: "https://localbank.example.com" },
    { name: "CityHotels", image: "/images/sponsors/silver-sponsor-2.jpg", website: "https://cityhotels.example.com" },
    { name: "FoodService", image: "/images/sponsors/silver-sponsor-3.jpg", website: "https://foodservice.example.com" },
    { name: "TechSupport", image: "/images/sponsors/silver-sponsor-4.jpg", website: "https://techsupport.example.com" },
  ];

  const sponsorshipPackages = [
    {
      name: "Main Sponsor",
      price: "Contattaci",
      benefits: [
        "Logo sulla parte frontale delle divise da gioco",
        "Banner pubblicitario principale nel palazzetto",
        "Menzione in tutte le comunicazioni stampa",
        "Visibilità prioritaria sul sito web e social media",
        "Possibilità di organizzare eventi esclusivi con la squadra",
        "10 biglietti per ogni partita casalinga",
      ]
    },
    {
      name: "Gold Sponsor",
      price: "Da €5.000/anno",
      benefits: [
        "Logo sulla parte posteriore delle divise da gioco",
        "Banner pubblicitario nel palazzetto",
        "Visibilità sul sito web e social media",
        "Possibilità di distribuire materiale promozionale durante le partite",
        "5 biglietti per ogni partita casalinga",
      ]
    },
    {
      name: "Silver Sponsor",
      price: "Da €2.000/anno",
      benefits: [
        "Logo sui pantaloncini o sul retro della divisa da gioco",
        "Banner pubblicitario piccolo nel palazzetto",
        "Menzione sul sito web e social media",
        "2 biglietti per ogni partita casalinga",
      ]
    },
    {
      name: "Supporter",
      price: "Da €500/anno",
      benefits: [
        "Logo nella sezione sponsor del sito web",
        "Menzione durante le partite casalinghe",
        "1 biglietto per ogni partita casalinga",
      ]
    },
  ];

  const testimonials = [
    {
      quote: "La nostra collaborazione con Hyria Basket ci ha permesso di aumentare la visibilità del nostro brand in modo significativo nella comunità locale.",
      author: "Marco Bianchi, CEO di TechCorp"
    },
    {
      quote: "Siamo orgogliosi di sostenere un progetto sportivo innovativo che condivide i nostri valori di eccellenza e sviluppo del territorio.",
      author: "Laura Rossi, Marketing Director di SportGear"
    }
  ];

  return (
    <div className="sponsor-page">
      <PageHero 
        backgroundImage="/images/sponsor-hero.jpg"
        normalText="I NOSTRI"
        coloredText="SPONSOR"
        subtitle="Partner che credono nel nostro progetto"
      />

      {/* Intro Section */}
      <section className="section-padding">
        <div className="container">
          <SectionTitle 
            title="PARTNERSHIP DI VALORE" 
            subtitle="Collaborazioni strategiche che sostengono la nostra crescita"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-lg mb-6">
                Hyria Basket crede fortemente nel valore delle partnership strategiche. I nostri sponsor sono molto più che semplici finanziatori: sono parte integrante del nostro progetto di crescita e sviluppo.
              </p>
              <p className="text-lg mb-6">
                Ogni partnership è pensata per creare valore reciproco, offrendo alle aziende visibilità, connessione con la comunità e opportunità di networking, mentre noi possiamo contare su risorse fondamentali per portare avanti la nostra missione sportiva ed educativa.
              </p>
              <p className="text-lg">
                Grazie al contributo dei nostri sponsor, possiamo investire nei giovani talenti, migliorare le infrastrutture e offrire un'esperienza di qualità a tutti i nostri atleti, dai più piccoli alla prima squadra.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-lg overflow-hidden shadow-xl"
            >
              <img 
                src="/images/sponsor-intro.jpg" 
                alt="Partnership Hyria Basket" 
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Sponsors Section */}
      <section className="section-padding bg-gray-100">
        <div className="container">
          <SectionTitle 
            title="MAIN SPONSOR" 
            subtitle="I partner principali che rendono possibile il nostro progetto"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {mainSponsors.map((sponsor, index) => (
              <motion.a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                key={sponsor.name}
                className="block"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 text-center">
                  <img 
                    src={sponsor.image} 
                    alt={sponsor.name} 
                    className="h-32 mx-auto object-contain mb-6"
                  />
                  <h3 className="text-xl font-bold mb-2">{sponsor.name}</h3>
                  <p className="text-sm text-gray-500">Main Sponsor</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Gold Sponsors Section */}
      <section className="section-padding">
        <div className="container">
          <SectionTitle 
            title="GOLD SPONSOR" 
            subtitle="Partner che contribuiscono in modo significativo al nostro successo"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {goldSponsors.map((sponsor, index) => (
              <motion.a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                key={sponsor.name}
                className="block"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 text-center h-full">
                  <img 
                    src={sponsor.image} 
                    alt={sponsor.name} 
                    className="h-24 mx-auto object-contain mb-4"
                  />
                  <h3 className="text-lg font-bold mb-2">{sponsor.name}</h3>
                  <p className="text-xs text-gray-500">Gold Sponsor</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Silver Sponsors Section */}
      <section className="section-padding bg-gray-100">
        <div className="container">
          <SectionTitle 
            title="SILVER SPONSOR" 
            subtitle="Aziende che supportano la nostra crescita"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {silverSponsors.map((sponsor, index) => (
              <motion.a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                key={sponsor.name}
                className="block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center h-full">
                  <img 
                    src={sponsor.image} 
                    alt={sponsor.name} 
                    className="h-16 mx-auto object-contain mb-3"
                  />
                  <h3 className="text-sm font-bold">{sponsor.name}</h3>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Opportunities Section */}
      <section className="section-padding">
        <div className="container">
          <SectionTitle 
            title="OPPORTUNITÀ DI SPONSORIZZAZIONE" 
            subtitle="Scopri come la tua azienda può diventare partner di Hyria Basket"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {sponsorshipPackages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`p-4 text-center text-white ${
                  index === 0 ? 'bg-hyria-primary' : 
                  index === 1 ? 'bg-hyria-secondary' : 
                  index === 2 ? 'bg-gray-400' : 
                  'bg-hyria-primary'
                }`}>
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                </div>
                <div className="p-6">
                  <p className="text-2xl font-bold text-center mb-6">{pkg.price}</p>
                  <ul className="space-y-2">
                    {pkg.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 text-center">
                    <motion.button
                      className="btn-primary w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      RICHIEDI INFORMAZIONI
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-gray-100">
        <div className="container">
          <SectionTitle 
            title="VANTAGGI PER GLI SPONSOR" 
            subtitle="Perché investire nel nostro progetto sportivo"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "Visibilità Locale",
                description: "Raggiungi un pubblico locale e regionale attraverso le partite, gli eventi e la nostra presenza sui media.",
                icon: "👁️"
              },
              {
                title: "Responsabilità Sociale",
                description: "Dimostra il tuo impegno per la comunità sostenendo un progetto sportivo che promuove valori positivi tra i giovani.",
                icon: "🤝"
              },
              {
                title: "Networking",
                description: "Entra in contatto con altri sponsor e partner commerciali, creando nuove opportunità di business.",
                icon: "🔄"
              },
              {
                title: "Engagement",
                description: "Coinvolgi clienti e dipendenti in eventi sportivi emozionanti e iniziative comunitarie.",
                icon: "💫"
              },
              {
                title: "Brand Association",
                description: "Associa il tuo marchio ai valori di eccellenza, passione e innovazione che caratterizzano Hyria Basket.",
                icon: "🏆"
              },
              {
                title: "Contenuti Digitali",
                description: "Beneficia della nostra presenza sui social media e ottieni contenuti esclusivi per il tuo marketing.",
                icon: "📱"
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="container">
          <SectionTitle 
            title="DICONO DI NOI" 
            subtitle="Le opinioni dei nostri partner"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {testimonials.map((testimonial, index) => (
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
              Diventa un <span className="gradient-text">Partner</span>
            </h2>
            <p className="cta-description">
              Scopri come la tua azienda può contribuire al nostro progetto e ottenere visibilità
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                RICHIEDI UNA PROPOSTA
              </motion.button>
              <motion.a
                href="/contatti"
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CONTATTACI
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Sponsor;
