import React from "react";
import { motion } from "framer-motion";
import PageHead from "../components/PageHead";
import SponsorBanner from "../components/SponsorBanner";
import { heroContainer, heroItem, staggerContainer, fadeInUp, fadeInLeft, scaleReveal, revealTransition } from '../utils/animations';

const Sponsor: React.FC = () => {
  const mainSponsors = [
    {
      name: "InItaly",
      image: "https://www.initaly.it/statics/website/logo.png",
      website: "https://www.initaly.it/it",
      fit: "contain",
    },
    {
      name: "McDonald's",
      image: "/images/McDonalds.jpg",
      website: "https://www.mcdonalds.it/",
      fit: "contain",
    },
    {
      name: "Casa Amica",
      image:
        "https://casamicaservizi.it/wp-content/uploads/2024/05/logocasamica.png",
      website: "https://casamicaservizi.it/",
      fit: "scale-down",
    },
    {
      name: "I mobili",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2o2WCJrl0vaU4ae7_3IpyPOjCErE1HqAGNQ&s",
      website: "https://www.imobiliarredamenti.it/",
      fit: "scale-down",
    },
  ];
  const goldSponsors = [
    {
      name: "Hyria Consulting",
      image:
        "https://www.hyriaconsulting.it/wp-content/uploads/2023/08/logo-HC-2.png",
      website: "https://www.hyriaconsulting.it/",
      fit: "scale-down",
    },
  ];

  const silverSponsors = [

    {
      name: "DilamaBaby",
      image:
        "https://dilamababystore.com/cdn/shop/files/Logo_int_f3c10636-63a1-4461-88c0-076d651e5428_1024x1024.png?v=1637411319",
      website: "dilamababystore.com",
      fit: "contain",
    },

    {
      name: "Softmaint S.R.L.",
      image: "/images/SM_Logo.jpg",
      website: "https://softmaint.it",
      fit: "contain",
    },
    { name: "Queen Bees Baiano", image: "/images/StockShoes.jpg", website: "" },

    {
      name: "Enoteca De Sena",
      image: "/images/EnotecaDeSena.jpg",
      website: "",
      fit: "contain",
    },
    {
      name: "Studio Napolitano Associati",
      image: "/images/StudioNapolitano.jpg",
      website: "",
      fit: "contain",
    },
  ];

  const bronzeSponsors = [
    {
      name: "Citroen",
      image:
        "https://www.brandforum.it/wp-content/uploads/2019/03/40720191021024957.png",
      website: "https://concessionari.citroen.it/officinaianniciello",
      fit: "contain",
    },
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
      ],
    },
    {
      name: "Gold Sponsor",
      price: "Da €2.000/anno (esclusa IVA)",
      benefits: [
        "Logo sulla parte frontale delle divise da gioco",
        "Banner pubblicitario principale nel palazzetto",
        "Visibilità prioritaria sul sito web e social media",
        "Logo su borsone e maglie di allenamento/riscaldamento della squadra",
      ],
    },
    {
      name: "Silver Sponsor",
      price: "Da €1.000/anno (esclusa IVA)",
      benefits: [
        "Logo sulle divise da allenamento e su borsone da gioco",
        "Banner pubblicitario piccolo nel palazzetto",
        "Menzione sul sito web e social media",
      ],
    },
    {
      name: "Bronze Sponsor",
      price: "Da €500/anno (Esclusa IVA)",
      benefits: [
        "Logo nella sezione sponsor del sito web e social media",
        "Banner pubblicitario piccolo nel palazzetto",
        "Logo su borsone da gioco",
      ],
    },
  ];

  const sponsorStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sponsor - Hyria Basket",
    description:
      "Scopri i nostri sponsor e le opportunità di partnership con Hyria Basket",
    url: "https://hyriabasket.it/sponsor",
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

      <div className="sponsor-page sponsor-bolder">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="hero-section sponsor-hero">
          <div className="hero-background">
            <img
              src="/images/contact-hero.jpg"
              alt="Hyria Basket sponsor e partner"
              className="hero-bg-image"
              width={1920}
              height={1080}
              decoding="async"
              fetchPriority="high"
            />
            <div className="hero-overlay" />
          </div>
          <div className="hero-content">
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="visible"
              className="hero-text-container"
            >
              <motion.p variants={heroItem} className="hero-kicker">
                NOLA · PARTNERSHIP
              </motion.p>
              <motion.h1 variants={heroItem} className="hero-title">
                I NOSTRI <span className="hero-accent">SPONSOR</span>
              </motion.h1>
            </motion.div>
          </div>
        </section>

        {/* ── Partnership intro ────────────────────────────────── */}
        <section className="features-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              PARTNERSHIP DI VALORE
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.12 }}
            >
              Collaborazioni che sostengono la nostra crescita
            </motion.p>

            <div className="sponsor-intro-grid">
              <motion.div
                className="sponsor-intro-main"
                variants={fadeInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p>
                  Hyria Basket crede fortemente nel valore delle partnership
                  strategiche. I nostri sponsor sono molto più che semplici
                  finanziatori: sono parte integrante del nostro progetto di
                  crescita e sviluppo.
                </p>
                <p>
                  Ogni partnership è pensata per creare valore reciproco,
                  offrendo alle aziende visibilità, connessione con la comunità
                  e opportunità di networking, mentre noi possiamo contare su
                  risorse fondamentali per portare avanti la nostra missione
                  sportiva ed educativa.
                </p>
                <p>
                  Grazie al contributo dei nostri sponsor, possiamo investire
                  nei giovani talenti, migliorare le infrastrutture e offrire
                  un'esperienza di qualità a tutti i nostri atleti, dai più
                  piccoli alla prima squadra.
                </p>
              </motion.div>
              <motion.aside
                className="sponsor-intro-aside"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={revealTransition}
              >
                <blockquote className="sponsor-pull-quote">
                  <span>Più che finanziatori.</span>
                  Parte integrante del nostro progetto.
                </blockquote>
                <div className="sponsor-year-badge">EST. 2025</div>
              </motion.aside>
            </div>
          </div>
        </section>

        {/* ── Main Sponsors ────────────────────────────────────── */}
        <section className="about-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              MAIN SPONSOR
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.12 }}
            >
              I partner principali che rendono possibile il nostro progetto
            </motion.p>

            <motion.div
              className="sponsor-main-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {mainSponsors.map((sponsor) => (
                <motion.a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={sponsor.name}
                  variants={fadeInUp}
                  className="sponsor-card sponsor-card--main"
                >
                  <span className="sponsor-card-level">MAIN SPONSOR</span>
                  <div className="sponsor-card-inner">
                    <div className="sponsor-card-logo">
                      <SponsorBanner
                        src={sponsor.image}
                        alt={sponsor.name}
                        fit={sponsor.fit as "contain" | "cover" | undefined}
                      />
                    </div>
                    <span className="sponsor-card-name">{sponsor.name}</span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Gold Sponsors ────────────────────────────────────── */}
        <section className="features-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              GOLD SPONSOR
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.12 }}
            >
              Partner che contribuiscono in modo significativo al nostro successo
            </motion.p>

            <motion.div
              className="sponsor-tier-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {goldSponsors.map((sponsor) => (
                <motion.a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={sponsor.name}
                  variants={fadeInUp}
                  className="sponsor-card sponsor-card--gold"
                >
                  <span className="sponsor-card-level">GOLD</span>
                  <div className="sponsor-card-inner">
                    <div className="sponsor-card-logo">
                      <SponsorBanner
                        src={sponsor.image}
                        alt={sponsor.name}
                        fit={sponsor.fit as "contain" | "cover" | undefined}
                      />
                    </div>
                    <span className="sponsor-card-name">{sponsor.name}</span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Silver Sponsors ──────────────────────────────────── */}
        <section className="about-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              SILVER SPONSOR
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.12 }}
            >
              Aziende che supportano la nostra crescita
            </motion.p>

            <motion.div
              className="sponsor-tier-grid sponsor-tier-grid--silver"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {silverSponsors.map((sponsor) => (
                <motion.a
                  href={sponsor.website || undefined}
                  target={sponsor.website ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  key={sponsor.name}
                  variants={fadeInUp}
                  className="sponsor-card sponsor-card--silver"
                >
                  <span className="sponsor-card-level">SILVER</span>
                  <div className="sponsor-card-inner">
                    <div className="sponsor-card-logo">
                      <SponsorBanner
                        src={sponsor.image}
                        alt={sponsor.name}
                        fit={sponsor.fit as "contain" | "cover" | undefined}
                      />
                    </div>
                    <span className="sponsor-card-name">{sponsor.name}</span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Bronze Sponsors ──────────────────────────────────── */}
        <section className="features-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              BRONZE SPONSOR
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.12 }}
            >
              Partner che sostengono la nostra visione
            </motion.p>

            <motion.div
              className="sponsor-tier-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {bronzeSponsors.map((sponsor) => (
                <motion.a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={sponsor.name}
                  variants={fadeInUp}
                  className="sponsor-card sponsor-card--bronze"
                >
                  <span className="sponsor-card-level">BRONZE</span>
                  <div className="sponsor-card-inner">
                    <div className="sponsor-card-logo">
                      <SponsorBanner
                        src={sponsor.image}
                        alt={sponsor.name}
                        fit={sponsor.fit as "contain" | "cover" | undefined}
                      />
                    </div>
                    <span className="sponsor-card-name">{sponsor.name}</span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Sponsorship Packages ─────────────────────────────── */}
        <section className="about-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              OPPORTUNITÀ DI SPONSORIZZAZIONE
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.12 }}
            >
              Scopri come la tua azienda può diventare partner di Hyria Basket
            </motion.p>

            <motion.div
              className="sponsor-packages-list"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
            >
              {sponsorshipPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.name}
                  className="sponsor-package-row"
                  variants={fadeInUp}
                >
                  <span className="sponsor-package-num">0{index + 1}</span>
                  <div className="sponsor-package-body">
                    <h3 className="sponsor-package-name">{pkg.name}</h3>
                    {pkg.price && (
                      <p className="sponsor-package-price">{pkg.price}</p>
                    )}
                    <ul className="sponsor-package-benefits">
                      {pkg.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="sponsor-package-action">
                    <motion.button
                      className="btn-primary"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => (window.location.href = "/contatti")}
                    >
                      RICHIEDI INFORMAZIONI
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Benefits ─────────────────────────────────────────── */}
        <section className="features-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              VANTAGGI PER GLI SPONSOR
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.12 }}
            >
              Perché investire nel nostro progetto sportivo
            </motion.p>

            <motion.div
              className="sponsor-benefits-list"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {[
                {
                  title: "Visibilità Locale",
                  description:
                    "Raggiungi un pubblico locale e regionale attraverso le partite, gli eventi e la nostra presenza sui media.",
                },
                {
                  title: "Networking",
                  description:
                    "Entra in contatto con altri sponsor e partner commerciali, creando nuove opportunità di business.",
                },
                {
                  title: "Engagement",
                  description:
                    "Coinvolgi clienti e dipendenti in eventi sportivi emozionanti e iniziative comunitarie.",
                },
                {
                  title: "Brand Association",
                  description:
                    "Associa il tuo marchio ai valori di eccellenza, passione e innovazione che caratterizzano Hyria Basket.",
                },
                {
                  title: "Contenuti Digitali",
                  description:
                    "Beneficia della nostra presenza sui social media e ottieni contenuti esclusivi per il tuo marketing.",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className="sponsor-benefit-row"
                  variants={fadeInUp}
                >
                  <span className="sponsor-benefit-num">0{index + 1}</span>
                  <div className="sponsor-benefit-body">
                    <h3 className="sponsor-benefit-title">{benefit.title}</h3>
                    <p className="sponsor-benefit-desc">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="cta-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="cta-content"
            >
              <h2 className="cta-title">
                Diventa un{" "}
                <span className="sponsor-cta-accent">Partner</span>
              </h2>
              <p className="cta-description">
                Scopri come la tua azienda può contribuire al nostro progetto e
                ottenere visibilità
              </p>
              <div className="flex flex-wrap gap-4 justify-start mt-6">
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/contatti")}
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
