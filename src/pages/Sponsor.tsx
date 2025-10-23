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
    { name: "McDonald's", image: "data:image/png;base64,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", website: "https://www.mcdonalds.it/" },
    { name: "Hyria Consulting", image: "https://www.hyriaconsulting.it/wp-content/uploads/2023/08/logo-HC-2.png", website: "https://www.hyriaconsulting.it/" },
    { name: "DilamaBaby", image: "https://dilamababystore.com/cdn/shop/files/Logo_int_f3c10636-63a1-4461-88c0-076d651e5428_1024x1024.png?v=1637411319", website: "dilamababystore.com" },
    { name: "Enoteca De Sena", image: "/images/EnotecaDeSena.jpg", website: "" },
    { name: "Queen Bees Baiano", image: "", website: "" },
    { name: "Studio Napolitano Associati", image: "/images/StudioNapolitano.jpg", website: "" },
  ];
  
  const silverSponsors = [
    { name: "Softmaint S.R.L.", image: "https://lh3.googleusercontent.com/p/AF1QipO5ieOGPOtdTFzntDmjUY4D_1ZzJBU3YHnp39vo=s680-w680-h510-rw", website: "https://softmaint.it" },
  ];

  const bronzeSponsors = [
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
        {/* Bronze Sponsors Section */}
        <section className="section-padding">
          <div className="container">
            <SectionTitle 
              title="BRONZE SPONSOR" 
              subtitle="Partner che sostengono la nostra visione"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {bronzeSponsors.map((sponsor, index) => (
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
                    <p className="text-xs text-gray-500" style={{color:'#5e0303'}}>Bronze Sponsor</p>
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