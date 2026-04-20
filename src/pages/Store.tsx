import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { useCart } from "../contexts/CartContext";
import type { CartItem } from "../contexts/CartContext";
import "../styles/store.css"; // Importiamo il nuovo file CSS

// Tipi per i prodotti
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  description?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
}

const Store: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();

  // Categorie di prodotti
  const categories = [
    { id: "all", name: "Tutti i Prodotti" },
    { id: "jersey", name: "Divise da Gioco" },
    { id: "training", name: "Abbigliamento Allenamento" },
    { id: "leisure", name: "Abbigliamento Tempo Libero" },
    { id: "accessories", name: "Accessori" },
  ];

  // Dati dei prodotti con immagini casuali, descrizioni e più dettagli
  const products: Product[] = [
    {
      id: 1,
      name: "Maglia Gara Home 2023/24",
      price: 59.9,
      image:
        "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500&h=350&fit=crop&q=80",
      category: "jersey",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      description:
        "Maglia ufficiale Hyria Basket per le partite in casa della stagione 2023/24. Design esclusivo con tessuto traspirante.",
      isFeatured: true,
      isNew: true,
    },
    {
      id: 2,
      name: "Maglia Gara Away 2023/24",
      price: 59.9,
      image:
        "https://images.unsplash.com/photo-1776179342972-875cbbcdd32f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "jersey",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      description:
        "Maglia ufficiale da trasferta dell'Hyria Basket per la stagione 2023/24. Colori audaci e tessuto ultraleggero.",
      isFeatured: true,
    },
    {
      id: 3,
      name: "Pantaloncini Gara Pro",
      price: 34.9,
      image:
        "https://images.unsplash.com/photo-1656645123173-f98a07459f49?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "jersey",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      description:
        "Pantaloncini ufficiali da gara con tecnologia Dry-Fit per mantenere il corpo asciutto durante l'attività sportiva.",
      isFeatured: true,
    },
    {
      id: 4,
      name: "T-Shirt Allenamento Tech",
      price: 29.9,
      image:
        "https://images.unsplash.com/photo-1581952976147-5a2d15560349?w=500&h=350&fit=crop&q=80",
      category: "training",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      description:
        "T-shirt tecnica per gli allenamenti quotidiani. Tessuto anti-sudore e tecnologia anti-odore.",
      isFeatured: false,
    },
    {
      id: 5,
      name: "Felpa con Cappuccio Hyria",
      price: 49.9,
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=350&fit=crop&q=80",
      category: "leisure",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      description:
        "Felpa con cappuccio e logo Hyria Basket ricamato. Perfetta per il pre e post allenamento.",
      isFeatured: true,
      isOnSale: true,
      discount: 15,
    },
    {
      id: 6,
      name: "Zaino Ufficiale Pro Team",
      price: 39.9,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=350&fit=crop&q=80",
      category: "accessories",
      sizes: ["One Size"],
      description:
        "Zaino ufficiale con scomparto dedicato per la palla e spazio per le scarpe. Design ergonomico e materiali premium.",
      isFeatured: false,
    },
    {
      id: 7,
      name: "Pallone da Basket Competizione",
      price: 24.9,
      image:
        "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=500&h=350&fit=crop&q=80",
      category: "accessories",
      sizes: ["One Size"],
      description:
        "Pallone da basket ufficiale utilizzato durante le partite casalinghe. Grip ottimizzato per prestazioni superiori.",
      isNew: true,
    },
    {
      id: 8,
      name: "Cappellino New Era Hyria",
      price: 29.9,
      image:
        "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&h=350&fit=crop&q=80",
      category: "accessories",
      sizes: ["One Size"],
      description:
        "Cappellino ufficiale New Era con logo Hyria Basket ricamato. Design esclusivo e vestibilità perfetta.",
      isFeatured: true,
    },
  ];

  // Icone di categorie
  const categoryIcons = {
    jersey: "https://cdn-icons-png.flaticon.com/512/1809/1809371.png",
    training: "https://cdn-icons-png.flaticon.com/512/2548/2548537.png",
    leisure: "https://cdn-icons-png.flaticon.com/512/3331/3331886.png",
    accessories: "https://cdn-icons-png.flaticon.com/512/863/863684.png",
  };

  // Stati
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("M");

  // Filtraggio dei prodotti in base alla categoria selezionata e termine di ricerca
  const filteredProducts = products
    .filter(
      (product) =>
        activeCategory === "all" || product.category === activeCategory,
    )
    .filter(
      (product) =>
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase())),
    );

  // Prodotti in evidenza
  const featuredProducts = products.filter((product) => product.isFeatured);

  // Funzione per aggiungere al carrello
  const handleAddToCart = (product: Product, size?: string) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.isOnSale
        ? product.price * (1 - (product.discount || 0) / 100)
        : product.price,
      image: product.image,
      quantity: 1,
      size: size || selectedSize,
    };
    addToCartContext(cartItem);
  };

  // Funzione per l'apertura del modal con dettagli prodotto
  const openProductModal = (product: Product) => {
    console.log("Opening modal for product:", product.name);
    setSelectedProduct(product);
    setIsModalOpen(true);
    // Blocca lo scroll del body
    document.body.style.overflow = "hidden";
  };

  // Chiusura del modal
  const closeProductModal = () => {
    setIsModalOpen(false);
    // Riattiva lo scroll
    document.body.style.overflow = "auto";
  };

  // Assicurati che lo scroll venga riattivato quando la componente viene smontata
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Forzare dark mode sulla pagina dello store
  useEffect(() => {
    document.documentElement.classList.add("dark-mode-forced");
    document.body.style.backgroundColor = "#5e0303";
    document.body.style.color = "#ffffff";

    return () => {
      document.documentElement.classList.remove("dark-mode-forced");
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  return (
    <div className="store-page">
      {/* Hero Section con sfondo animato */}
      <div className="store-hero">
        <div className="store-hero-content">
          <motion.h1
            className="store-hero-title text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            IL NOSTRO <span className="gradient-text">STORE</span>
          </motion.h1>
          <motion.p
            className="store-hero-subtitle text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Abbigliamento ufficiale e merchandising Hyria Basket - Vesti i
            colori della tua passione
          </motion.p>

          {/* Barra di ricerca */}
          <motion.div
            className="search-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <input
              type="text"
              className="search-input"
              placeholder="Cerca prodotti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Sezione Prodotti in Evidenza */}
      <section className="section-padding">
        <div className="container">
          <SectionTitle
            title="PRODOTTI IN EVIDENZA"
            subtitle="I prodotti più popolari del nostro store"
          />

          <div className="products-grid" style={{ marginTop: "3rem" }}>
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => openProductModal(product)}
                onAddToCart={handleAddToCart}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sezione Categorie con design migliorato */}
      <section className="section-padding bg-hyria-dark">
        <div className="container">
          <SectionTitle
            title="CATEGORIE"
            subtitle="Esplora la nostra collezione per categoria"
          />

          <div className="categories-grid" style={{ marginTop: "3rem" }}>
            {Object.entries(categoryIcons).map(([key, icon], index) => (
              <motion.div
                key={key}
                className="category-box"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => {
                  setActiveCategory(key);
                  document
                    .getElementById("all-products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <img src={icon} alt={key} className="category-icon" />
                <h3 className="category-title">
                  {key === "jersey" && "Divise da Gioco"}
                  {key === "training" && "Abbigliamento Allenamento"}
                  {key === "leisure" && "Tempo Libero"}
                  {key === "accessories" && "Accessori"}
                </h3>
                <p className="category-description">
                  {key === "jersey" && "Le divise ufficiali di Hyria Basket"}
                  {key === "training" &&
                    "L'abbigliamento tecnico per i tuoi allenamenti"}
                  {key === "leisure" && "Capi casual con i nostri colori"}
                  {key === "accessories" &&
                    "Completa il tuo outfit con i nostri accessori"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutti i Prodotti */}
      <section id="all-products" className="section-padding">
        <div className="container">
          <SectionTitle
            title="CATALOGO COMPLETO"
            subtitle="Esplora tutti i nostri prodotti"
          />

          {/* Filtri Categoria */}
          <div className="category-filter mb-12">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`category-button ${
                  activeCategory === category.id ? "active" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>

          {/* Lista Prodotti con layout migliorato */}
          <div className="products-grid" style={{ marginTop: "2rem" }}>
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => openProductModal(product)}
                onAddToCart={handleAddToCart}
                delay={index * 0.05}
              />
            ))}
          </div>

          {/* Messaggio se non ci sono prodotti */}
          {filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-100">
                Nessun prodotto trovato
              </h3>
              <p className="mt-1 text-gray-400">
                Prova a modificare i filtri o il termine di ricerca.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-hyria-secondary hover:bg-hyria-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hyria-secondary"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchTerm("");
                  }}
                >
                  Cancella filtri
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Come Funziona - con design migliorato */}
      <section className="section-padding bg-hyria-dark">
        <div className="container">
          <SectionTitle
            title="COME FUNZIONA"
            subtitle="Tutto ciò che devi sapere per acquistare"
          />

          <div className="how-it-works-grid" style={{ marginTop: "3rem" }}>
            <motion.div
              className="how-it-works-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="how-it-works-number">1</div>
              <h3 className="text-xl font-bold mb-3 text-center text-white">
                Scegli i Prodotti
              </h3>
              <p className="text-gray-300 text-center">
                Naviga nel nostro catalogo e aggiungi al carrello i prodotti che
                desideri acquistare.
              </p>
            </motion.div>

            <motion.div
              className="how-it-works-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="how-it-works-number">2</div>
              <h3 className="text-xl font-bold mb-3 text-center text-white">
                Effettua il Pagamento
              </h3>
              <p className="text-gray-300 text-center">
                Procedi al checkout e scegli il metodo di pagamento che
                preferisci tra le opzioni disponibili.
              </p>
            </motion.div>

            <motion.div
              className="how-it-works-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="how-it-works-number">3</div>
              <h3 className="text-xl font-bold mb-3 text-center text-white">
                Ricevi a Casa o in Palestra
              </h3>
              <p className="text-gray-300 text-center">
                Scegli se ricevere i prodotti a casa tua o ritirarli
                direttamente al palazzetto durante gli allenamenti.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <br></br>
            <h3 className="text-xl font-bold mb-4 text-white">
              Informazioni Importanti
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-2 text-hyria-secondary">
                  Spedizione
                </h4>
                <p className="text-gray-300 mb-4">
                  Spedizione gratuita per ordini superiori a 50€. Gli ordini
                  vengono processati in 1-2 giorni lavorativi e consegnati in
                  3-5 giorni.
                </p>

                <h4 className="font-bold text-lg mb-2 text-hyria-secondary">
                  Pagamenti Accettati
                </h4>
                <p className="text-gray-300">
                  Accettiamo carte di credito/debito, PayPal e bonifico
                  bancario.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2 text-hyria-secondary">
                  Resi e Cambi
                </h4>
                <p className="text-gray-300 mb-4">
                  Hai 14 giorni per restituire un articolo. Gli articoli devono
                  essere nelle condizioni originali, con etichette e packaging
                  intatti.
                </p>

                <h4 className="font-bold text-lg mb-2 text-hyria-secondary">
                  Personalizzazione
                </h4>
                <p className="text-gray-300">
                  Offriamo servizio di personalizzazione per le maglie con
                  numero e nome. Contattaci per maggiori informazioni.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section migliorata */}
      <section className="cta-section py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-content bg-gradient-to-r from-hyria-primary/30 to-hyria-secondary/30 backdrop-blur-md p-10 rounded-2xl"
          >
            <h2 className="cta-title text-4xl font-black mb-4">
              Diventa Parte del <span className="gradient-text">Team</span>
            </h2>
            <p className="cta-description text-lg mb-8">
              Indossa con orgoglio i colori di Hyria Basket e supporta la tua
              squadra del cuore
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.a
                href="/contatti"
                className="buy-button min-w-[180px] py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                RICHIEDI INFORMAZIONI
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal Prodotto */}
      {isModalOpen && selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: window.innerWidth < 768 ? "flex-end" : "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: window.innerWidth < 768 ? "0" : "1rem",
          }}
        >
          <motion.div
            initial={
              window.innerWidth < 768
                ? { opacity: 0, y: window.innerHeight }
                : { opacity: 0, scale: 0.9 }
            }
            animate={
              window.innerWidth < 768
                ? { opacity: 1, y: 0 }
                : { opacity: 1, scale: 1 }
            }
            exit={
              window.innerWidth < 768
                ? { opacity: 0, y: window.innerHeight }
                : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              backgroundColor: "#5e0303",
              borderRadius: window.innerWidth < 768 ? "16px 16px 0 0" : "16px",
              maxWidth: window.innerWidth < 768 ? "100%" : "900px",
              width:
                window.innerWidth < 768 ? "100vw" : "100%",
              maxHeight: window.innerWidth < 768 ? "85vh" : "90vh",
              overflowY: "auto",
              zIndex: 10000,
              position: "relative",
              display: "flex",
              flexDirection: window.innerWidth < 768 ? "column" : "row",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Bottone per chiudere - FISSO */}


            {/* Immagine - SINISTRA (desktop) / TOP (mobile) */}
            <div
              style={{
                flex: window.innerWidth < 768 ? "0 0 auto" : "0 0 40%",
                backgroundColor: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                minHeight: window.innerWidth < 768 ? "200px" : "400px",
                width: window.innerWidth < 768 ? "100%" : "auto",
              }}
            >
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
              />
            </div>

            {/* Dettagli - DESTRA (desktop) / BOTTOM (mobile) */}
            <div
              style={{
                flex: "1",
                padding: window.innerWidth < 768 ? "2rem 1.5rem" : "3rem 2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                color: "white",
                overflowY: "auto",
              }}
            >
              {selectedProduct.isNew && (
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: "#d96c00",
                    color: "white",
                    fontSize: "0.75rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    marginBottom: "1rem",
                    width: "fit-content",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Nuovo
                </span>
              )}

              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "900",
                  marginBottom: "1rem",
                  fontFamily: "Arvo, serif",
                  lineHeight: "1.2",
                }}
              >
                {selectedProduct.name}
              </h2>

              <p
                style={{
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.8)",
                  marginBottom: "2rem",
                  lineHeight: "1.6",
                }}
              >
                {selectedProduct.description}
              </p>

              {/* Prezzo */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "2rem",
                  paddingBottom: "2rem",
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                {selectedProduct.isOnSale ? (
                  <>
                    <span
                      style={{
                        fontSize: "2rem",
                        fontWeight: "900",
                        color: "#d96c00",
                      }}
                    >
                      €
                      {(
                        selectedProduct.price *
                        (1 - (selectedProduct.discount || 0) / 100)
                      ).toFixed(2)}
                    </span>
                    <span
                      style={{
                        fontSize: "1rem",
                        textDecoration: "line-through",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      €{selectedProduct.price.toFixed(2)}
                    </span>
                    <span
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                      }}
                    >
                      -{selectedProduct.discount}%
                    </span>
                  </>
                ) : (
                  <span
                    style={{
                      fontSize: "2rem",
                      fontWeight: "900",
                      color: "#d96c00",
                    }}
                  >
                    €{selectedProduct.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Taglie */}
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "#d96c00",
                  }}
                >
                  Scegli Taglia
                </h3>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: "0.75rem 1.25rem",
                        border:
                          selectedSize === size
                            ? "none"
                            : "2px solid rgba(255,255,255,0.3)",
                        backgroundColor:
                          selectedSize === size ? "#d96c00" : "transparent",
                        color: "white",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSize !== size) {
                          e.currentTarget.style.borderColor = "#d96c00";
                          e.currentTarget.style.backgroundColor =
                            "rgba(217, 108, 0, 0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSize !== size) {
                          e.currentTarget.style.borderColor =
                            "rgba(255,255,255,0.3)";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pulsante acquista */}
              <button
                onClick={() => {
                  handleAddToCart(selectedProduct, selectedSize);
                  closeProductModal();
                  navigate("/carrello");
                }}
                style={{
                  backgroundColor: "#d96c00",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "1rem",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(217, 108, 0, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#c9620a";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(217, 108, 0, 0.5)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#d96c00";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(217, 108, 0, 0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Aggiungi al Carrello
              </button>

              {/* Info spedizione */}
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderLeft: "4px solid #d96c00",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginTop: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "#d96c00" }}>✓</span>
                  <span>Disponibile</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "#d96c00" }}>✓</span>
                  <span>Consegna 3-5 giorni</span>
                </div>
              </div>
            </div>
            <button
              onClick={closeProductModal}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backdropFilter: "blur(10px)",
                zIndex: 10001,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
              }}
              title="Chiudi"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Componente ProductCard con design migliorato
const ProductCard: React.FC<{
  product: Product;
  onClick: () => void;
  onAddToCart: (product: Product, size?: string) => void;
  delay?: number;
}> = ({ product, onClick, delay = 0 }) => {

  return (
    <motion.div
      id={`product-${product.id}`}
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="product-image-container" onClick={onClick}>
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="overlay"></div>

        {/* Badge per prodotti nuovi o in saldo */}
        {product.isNew && <div className="product-badge new">Nuovo</div>}
        {product.isOnSale && (
          <div className="product-badge sale">-{product.discount}%</div>
        )}
      </div>

      <div className="product-details">
        <h3 className="product-title" onClick={onClick}>
          {product.name}
        </h3>
        <div className="flex justify-between items-center mt-2">
          <div className="price-container">
            {product.isOnSale ? (
              <>
                <span className="current-price">
                  €
                  {(
                    product.price *
                    (1 - (product.discount || 0) / 100)
                  ).toFixed(2)}
                </span>
                <span className="original-price">
                  €{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="current-price">€{product.price.toFixed(2)}</span>
            )}
          </div>
          <div style={{display:'flex',justifyContent:'end'}}>
            <button
              type="button"
              className="buy-button"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Aggiungi al Carrello
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Store;
