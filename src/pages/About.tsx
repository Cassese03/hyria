import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHead from "../components/PageHead";
import {
  heroContainer,
  heroItem,
  staggerContainer,
  fadeInUp,
  fadeInLeft,
  scaleReveal,
  revealTransition,
} from "../utils/animations";

const MotionLink = motion(Link);

const ABOUT_VALUES = [
  {
    title: "Passione",
    description:
      "L'amore per il basket è il motore di tutto ciò che facciamo, dalla prima squadra al minibasket",
  },
  {
    title: "Comunità",
    description:
      "Crediamo nel valore di creare una comunità unita attorno al nostro progetto sportivo dentro e fuori dal campo",
  },
  {
    title: "Crescita",
    description:
      "Investiamo nello sviluppo tecnico e umano di ogni atleta, a qualsiasi livello",
  },
];

const CHISIAMO_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Chi Siamo - Hyria Basket",
  description:
    "Scopri la storia e la missione di Hyria Basket, squadra di basket di Nola con passione giovanile.",
  url: "https://hyriabasket.it/chi-siamo",
};

const STAFF_MEMBERS = [
  {
    name: "Attilio De Sena",
    role: "Presidente",
    image: "/images/logo-hyria-white.png",
  },
  {
    name: "Paolino Franzese",
    role: "Vice Presidente",
    image: "/images/logo-hyria-white.png",
  },
  {
    name: "Lorenzo Cassese",
    role: "Socio Fondatore",
    image: "/images/logo-hyria-white.png",
  },
  {
    name: "Giovanni Sangermano",
    role: "Socio Fondatore",
    image: "/images/logo-hyria-white.png",
  },
  {
    name: "Davide Esposito",
    role: "Socio Fondatore",
    image: "/images/logo-hyria-white.png",
  },
  {
    name: "Agostino Esposito",
    role: "Socio Fondatore",
    image: "/images/logo-hyria-white.png",
  },
  {
    name: "Giacomo Mascolo",
    role: "Socio Fondatore",
    image: "/images/logo-hyria-white.png",
  },
  { name: "", role: "", image: "/images/logo-hyria-white.png" },
];

const About: React.FC = () => {
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
        structuredData={CHISIAMO_STRUCTURED_DATA}
      />

      <div className="about-page about-bolder">
        {/* Hero Section */}
        <section
          className="hero-section"
          style={{ minHeight: "min(70vh, 700px)" }}
        >
          <div className="hero-background">
            <img
              src="/images/contact-hero.jpg"
              alt="Team Hyria Basket sul campo"
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
                NOLA · 2025
              </motion.p>
              <motion.h1 variants={heroItem} className="hero-title">
                CHI <span className="hero-accent">SIAMO</span>
              </motion.h1>
            </motion.div>
          </div>
        </section>

        {/* La Nostra Storia Section */}
        <section className="about-section about-story section-padding">
          <div className="container">
            <div className="about-story-grid">
              <div className="about-story-main">
                <motion.h2
                  className="section-title text-hyria-secondary"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={revealTransition}
                >
                  LA NOSTRA STORIA
                </motion.h2>
                <motion.div
                  className="section-divider"
                  variants={scaleReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  style={{ transformOrigin: "left center" }}
                />
                <motion.div
                  variants={fadeInLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-white"
                >
                  <p className="text-lg mb-6">
                    Hyria Basket nasce nel 2025 dal progetto di un gruppo di
                    giovani imprenditori appassionati di basket e del proprio
                    territorio, con una visione chiara: creare una società
                    sportiva moderna che unisse la tradizione del basket alla
                    tecnologia e all'innovazione.
                  </p>
                  <p className="text-lg mb-6">
                    Il nome "Hyria" richiama l'antica città che sorgeva
                    nell'area nolana, simbolo di tradizione e radici
                    territoriali, mentre lo sguardo è proiettato verso il futuro
                    del basket moderno.
                  </p>
                  <p className="text-lg">
                    In poco tempo, siamo riusciti a costruire un progetto solido
                    che comprende prima squadra, minibasket e numerose
                    iniziative sul territorio, diventando un punto di
                    riferimento per la pallacanestro nella nostra realtà.
                  </p>
                </motion.div>
              </div>
              <motion.aside
                className="about-story-aside"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={revealTransition}
              >
                <blockquote className="about-pull-quote">
                  <span>Radici antiche.</span>
                  Visione moderna.
                </blockquote>
                <div className="about-year-badge">EST. 2025</div>
              </motion.aside>
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
              transition={revealTransition}
            >
              I NOSTRI VALORI
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: "left center" }}
            />
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.12 }}
            >
              Alla base del nostro progetto ci sono valori fondamentali che
              guidano ogni nostra azione
            </motion.p>

            <motion.div
              className="about-values-list"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {ABOUT_VALUES.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="about-value-row"
                  variants={fadeInUp}
                >
                  <span className="about-value-num">0{index + 1}</span>
                  <div className="about-value-body">
                    <h3 className="about-value-title">{item.title}</h3>
                    <p className="about-value-desc">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
              transition={revealTransition}
            >
              IL NOSTRO STAFF
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: "left center" }}
            />
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.12 }}
            >
              La forza di Hyria Basket sta nelle persone che ogni giorno
              contribuiscono al progetto
            </motion.p>

            <motion.div
              className="staff-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {STAFF_MEMBERS.map((member) => (
                <motion.div
                  key={member.name}
                  className={`staff-card`}
                  variants={fadeInUp}
                >
                  <div className="staff-card-avatar">
                    <span className="staff-card-initials">
                      {/* {member.name.split(' ').slice(0, 2).map(n => n[0]).join('')} */}
                      <img
                        src={member.image}
                        alt={member.name}
                        width={100}
                        height={100}
                        className="staff-avatar-image"
                      />
                    </span>
                  </div>
                  <div className="staff-card-body">
                    <h3 className="staff-card-name">{member.name}</h3>
                    <p className="staff-card-role">{member.role}</p>
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
                Entra a far parte della{" "}
                <span className="about-cta-accent">nostra famiglia</span>
              </h2>
              <p className="cta-description">
                Scopri come unirti alla comunità di Hyria Basket come giocatore,
                partner o tifoso
              </p>
              <MotionLink
                to="/contatti"
                className="btn-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                CONTATTACI ORA
              </MotionLink>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
