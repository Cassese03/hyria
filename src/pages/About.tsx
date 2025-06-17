import React from 'react';
import { motion } from 'framer-motion';
import PageHead from '../components/PageHead';

const About: React.FC = () => {
  const chisianoStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Chi Siamo - Hyria Basket",
    "description": "Scopri la storia e la missione di Hyria Basket, squadra di basket di Nola con passione giovanile.",
    "url": "https://hyriabasket.it/chi-siamo"
  };

  return (
    <>
      <PageHead
        title="Chi siamo | Hyriabasket – Basket a Nola con Passione Giovanile"
        description="Scopri la storia di Hyria Basket, squadra di pallacanestro di Nola. La nostra missione, valori e passione per il basket giovanile."
        keywords="chi siamo, Hyria Basket, storia, missione, basket Nola, squadra, valori, passione giovanile"
        ogTitle="Chi Siamo - Hyria Basket Nola"
        ogDescription="Conosci la storia e i valori di Hyria Basket, la squadra di basket di Nola che crede nella passione giovanile e nell'innovazione."
        ogUrl="https://hyriabasket.it/chi-siamo"
        canonicalUrl="https://hyriabasket.it/chi-siamo"
        structuredData={chisianoStructuredData}
      />
      
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ height: '60vh' }}>
        <div className="hero-background">
          <img src="/images/contact-hero.jpg" alt="Hyria Basket Team" className="hero-bg-image" />
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
              CHI <span className="gradient-text">SIAMO</span>
            </h1>
            <div className="section-divider"></div>
          </motion.div>
        </div>
      </section>

      {/* La Nostra Storia Section */}
      <section className="about-section section-padding">
        <div className="container">
          <motion.h2 
            className="section-title text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              style={{ color: '#d96c00', }}
          >
            LA NOSTRA STORIA
          </motion.h2>
          <div className="section-divider"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white"
              style={{ color: 'white', }}
            >
              <p className="text-lg mb-6">
                Hyria Basket nasce nel 2025 dal progetto di un gruppo di giovani imprenditori appassionati di basket e del proprio territorio, con una visione chiara: creare una società sportiva moderna che unisse la tradizione del basket alla tecnologia e all'innovazione.
              </p>
              <p className="text-lg mb-6">
                Il nome "Hyria" richiama l'antica città che sorgeva nell'area nolana, simbolo di tradizione e radici territoriali, mentre lo sguardo è proiettato verso il futuro del basket moderno.
              </p>
              <p className="text-lg">
                In poco tempo, siamo riusciti a costruire un progetto solido che comprende prima squadra, minibasket e numerose iniziative sul territorio, diventando un punto di riferimento per la pallacanestro nella nostra realtà.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="rounded-lg overflow-hidden shadow-xl"
            >
              <img src="/images/logo-hyria.png" alt="Storia di Hyria Basket" className="w-full h-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valori Section */}
      <section className="features-section section-padding">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            I NOSTRI VALORI
          </motion.h2>
          <div className="section-divider"></div>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Alla base del nostro progetto ci sono valori fondamentali che guidano ogni nostra azione
          </motion.p>

          <div className="features-grid">
            {[
              {
                title: "Passione",
                description: "L'amore per il basket è il motore di tutto ciò che facciamo, dalla prima squadra al minibasket",
                icon: "❤️"
              },
              // {
              //   title: "Innovazione",
              //   description: "Utilizziamo tecnologie avanzate per l'analisi delle prestazioni e lo sviluppo dei talenti",
              //   icon: "💡"
              // },
              {
                title: "Comunità",
                description: "Crediamo nel valore di creare una comunità unita attorno al nostro progetto sportivo dentro e fuori dal campo",
                icon: "🤝"
              },
              {
                title: "Crescita",
                description: "Investiamo nello sviluppo tecnico e umano di ogni atleta, a qualsiasi livello",
                icon: "📈"
              }
            ].map((item, index) => (
              <motion.div 
                key={item.title}
                className="feature-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="feature-icon text-4xl mb-4">{item.icon}</div>
                <h3 className="feature-title">{item.title}</h3>
                <p className="feature-description">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section className="teams-section section-padding">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            IL NOSTRO STAFF
          </motion.h2>
          <div className="section-divider"></div>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            La forza di Hyria Basket sta nelle persone che ogni giorno contribuiscono al progetto
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Attilio De Sena", role: "Presidente", image: "/images/contact-hero.jpg" },
              { name: "Paolino Franzese", role: "Vice Presidente",image: "/images/contact-hero.jpg" },
              { name: "Lorenzo Cassese", role: "Socio Fondatore",image: "/images/contact-hero.jpg" },
              { name: "Giovanni Sangermano", role: "Socio Fondatore", image: "/images/contact-hero.jpg" },
              { name: "Davide Esposito", role: "Socio Fondatore",image: "/images/contact-hero.jpg" },
              { name: "Agostino Esposito", role: "Socio Fondatore", image: "/images/contact-hero.jpg" },
              { name: "Giacomo Mascolo", role: "Socio Fondatore", image: "/images/contact-hero.jpg" },

            ].map((member, index) => (
              <motion.div
                key={member.name}
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{color : '#d96c00',textAlign:'center'}}>{member.name}</h3>
                <h4 style={{color:'#0F0615',textAlign:'center'}}>{member.role}</h4>
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
              Entra a far parte della <span className="gradient-text">nostra famiglia</span>
            </h2>
            <p className="cta-description">
              Scopri come unirti alla comunità di Hyria Basket come giocatore, partner o tifoso
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
      </>
  );
};

export default About;