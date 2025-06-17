import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionTitle from '../components/SectionTitle';
import PageHead from '../components/PageHead';

const Sponsor: React.FC = () => {
  const mainSponsors = [
    { name: "Expert Parent", image: "https://data.volantinofacile.it/retailers/logos/000/000/378/medium/pqvflg_expert.jpg?1635250493", website: "https://www.expert.it/it/it/exp/storelocator/store/parente-nola/8032847000839" },
    { name: "I mobili", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2o2WCJrl0vaU4ae7_3IpyPOjCErE1HqAGNQ&s", website: "https://www.imobiliarredamenti.it/" },
  ];
  
  const goldSponsors = [
    { name: "DilamaBaby", image: "https://dilamababystore.com/cdn/shop/files/Logo_int_f3c10636-63a1-4461-88c0-076d651e5428_1024x1024.png?v=1637411319", website: "dilamababystore.com" },
    { name: "Enoteca De Sena", image: "/images/EnotecaDeSena.jpg", website: "" },
    { name: "Queen Bees Baiano", image: "", website: "" },
    { name: "Studio Napolitano Associati", image: "/images/StudioNapolitano.jpg", website: "" },
  ];
  
  const silverSponsors = [
    { name: "Citroen", image: "https://upload.wikimedia.org/wikipedia/it/thumb/a/ab/Logo_della_Citro%C3%ABn.svg/2560px-Logo_della_Citro%C3%ABn.svg.png", website: "https://concessionari.citroen.it/officinaianniciello" },
  ];

  const sponsorshipPackages = [
    {
      name: "Main Sponsor",
      price: "",
      benefits: [
        "1 divisa da gioco ufficiale in omaggio",
        "Logo sulle divise da gioco",
        "Scelta del posizionamento logo (costo aggiuntivo)",
        "Banner pubblicitario principale nel palazzetto",
        "Visibilità prioritaria sul sito web e social media",
        "Logo su borsone e maglie di allenamento/riscaldamento della squadra",
        "Possibilità di organizzare eventi esclusivi con la squadra",
      ]
    },
    {
      name: "Gold Sponsor",
      price: "Da €2.000/anno (esclusa IVA)",
      benefits: [
        "Logo sulla parte frontale delle divise da gioco",
        "Banner pubblicitario principale nel palazzetto",
        "Visibilità prioritaria sul sito web e social media",
        "Logo su borsone e maglie di allenamento/riscaldamento della squadra",
      ]
    },
    {
      name: "Silver Sponsor",
      price: "Da €1.000/anno (esclusa IVA)",
      benefits: [
        "Logo sulle divise da allenamento e su borsone da gioco",
        "Banner pubblicitario piccolo nel palazzetto",
        "Menzione sul sito web e social media",
      ]
    },
    {
      name: "Bronze Sponsor",
      price: "Da €500/anno (Esclusa IVA)",
      benefits: [
        "Logo nella sezione sponsor del sito web e social media",
        "Banner pubblicitario piccolo nel palazzetto",
        "Logo su borsone da gioco"
      ]
    },
  ];

  const sponsorStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sponsor - Hyria Basket",
    "description": "Scopri i nostri sponsor e le opportunità di partnership con Hyria Basket",
    "url": "https://hyriabasket.it/sponsor"
  };

  return (
    <>
      <PageHead
        title="Sponsor | Hyria Basket - Partnership e Collaborazioni"
        description="Scopri i nostri sponsor e partner. Opportunità di sponsorizzazione e collaborazione con Hyria Basket Nola."
        keywords="sponsor, partnership, collaborazioni, Hyria Basket, Nola, basket"
        ogTitle="Sponsor Hyria Basket - Diventa Partner"
        ogDescription="Unisciti ai nostri sponsor e partner. Scopri le opportunità di collaborazione con Hyria Basket."
        ogUrl="https://hyriabasket.it/sponsor"
        canonicalUrl="https://hyriabasket.it/sponsor"
        structuredData={sponsorStructuredData}
      />
      
      <div className="sponsor-page">
        <PageHero 
          backgroundImage="/images/contact-hero.jpg"
          normalText="I NOSTRI"
          coloredText="SPONSOR"
          subtitle="Partner che credono nel nostro progetto"
        />

        {/* Intro Section */}
        <section className="cta-section section-padding">
          <div className="container">
            <SectionTitle 
              title="PARTNERSHIP DI VALORE" 
              subtitle="Collaborazioni che sostengono la nostra crescita"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ color: 'white' }}
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
                  style={{ textAlign: 'center' }}
                >
                  <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 text-center">
                    <img 
                      src={sponsor.image} 
                      alt={sponsor.name} 
                      style={{ width: '90vw' }}
                      className="w-[90vw] max-w-full h-32 mx-auto object-contain mb-6"
                    />
                    <h3 className="text-xl font-bold mb-2"  style={{color:'#d96c00'}}>{sponsor.name}</h3>
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
                  style={{ textAlign: 'center' }}
                >
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 text-center h-full">
                    <img 
                      src={sponsor.image} 
                      alt={sponsor.name} 
                      style={{ width: '90vw' }}
                      className="h-24 mx-auto object-contain mb-4"
                    />
                    <h3 className="text-lg font-bold mb-2" style={{color:'#d96c00'}}>{sponsor.name}</h3>
                    <p className="text-xs text-gray-500" style={{color:'#5e0303'}}>Gold Sponsor</p>
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
                  style={{ textAlign: 'center' }}
                >
                  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center h-full">
                    <img 
                      src={sponsor.image} 
                      alt={sponsor.name} 
                      className="h-16 mx-auto object-contain mb-3"
                    />
                    <h3 className="text-sm font-bold"  style={{color:'#d96c00'}}>{sponsor.name}</h3>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsorship Opportunities Section */}
        <section className="cta-section section-padding">
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
                  style={{ textAlign: 'center' }}
                >
                  <div className={`p-4 text-center text-white ${
                    index === 0 ? 'bg-hyria-primary' : 
                    index === 1 ? 'bg-hyria-secondary' : 
                    index === 2 ? 'bg-gray-400' : 
                    'bg-hyria-primary'
                  }`}>
                    <h3 className="text-xl font-bold"   style={{color:'#d96c00'}}>{pkg.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-2xl font-bold text-center mb-6"  style={{color:'#d96c00'}}>{pkg.price}</p>
                    <ul className="space-y-2">
                      {pkg.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start" 
                          style={{ textAlign: 'left' }}>
                          <span className="text-sm"  style={{color:'white'}}>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 text-center">
                      <motion.button
                        className="btn-primary w-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/contatti'}
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
        <section className="about-section section-padding bg-gray-100">
          <div className="container">
            <SectionTitle 
              title="VANTAGGI PER GLI SPONSOR" 
              subtitle="Perché investire nel nostro progetto sportivo"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12" 
                  style={{ textAlign: 'center' }}>
              {[
                {
                  title: "Visibilità Locale",
                  description: "Raggiungi un pubblico locale e regionale attraverso le partite, gli eventi e la nostra presenza sui media.",
                  icon: "👁️"
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
                  style={{ textAlign: 'left' }}
                >
                  <h3 className="text-xl font-bold mb-2" style={{color:'#5e0303'}}>{benefit.icon} {benefit.title}</h3>
                  <p className="text-gray-600"style={{color:'white'}}>{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section 
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
        */}

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
                  onClick={() => window.location.href = '/contatti'}
                >
                  RICHIEDI UNA PROPOSTA
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Sponsor;
