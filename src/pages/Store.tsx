import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import '../styles/store.css'; // Importiamo il nuovo file CSS

// Tipi per i prodotti
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
}

const Store: React.FC = () => {
  // Categorie di prodotti
  const categories = [
    { id: 'all', name: 'Tutti i Prodotti' },
    { id: 'jersey', name: 'Divise da Gioco' },
    { id: 'training', name: 'Abbigliamento Allenamento' },
    { id: 'leisure', name: 'Abbigliamento Tempo Libero' },
    { id: 'accessories', name: 'Accessori' }
  ];

  // Dati dei prodotti con immagini casuali, descrizioni e più dettagli
  const products: Product[] = [
    {
      id: 1,
      name: "Maglia Gara Home 2023/24",
      price: 59.90,
      image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500&h=350&fit=crop&q=80",
      category: "jersey",
      description: "Maglia ufficiale Hyria Basket per le partite in casa della stagione 2023/24. Design esclusivo con tessuto traspirante.",
      isFeatured: true,
      isNew: true
    },
    {
      id: 2,
      name: "Maglia Gara Away 2023/24",
      price: 59.90,
      image: "https://images.unsplash.com/photo-1518065896235-a4c693a405e6?w=500&h=350&fit=crop&q=80",
      category: "jersey",
      description: "Maglia ufficiale da trasferta dell'Hyria Basket per la stagione 2023/24. Colori audaci e tessuto ultraleggero.",
      isFeatured: true
    },
    {
      id: 3,
      name: "Pantaloncini Gara Pro",
      price: 34.90,
      image: "https://images.unsplash.com/photo-1562451855-631fd2718c1a?w=500&h=350&fit=crop&q=80",
      category: "jersey",
      description: "Pantaloncini ufficiali da gara con tecnologia Dry-Fit per mantenere il corpo asciutto durante l'attività sportiva.",
      isFeatured: true
    },
    {
      id: 4,
      name: "T-Shirt Allenamento Tech",
      price: 29.90,
      image: "https://images.unsplash.com/photo-1581952976147-5a2d15560349?w=500&h=350&fit=crop&q=80",
      category: "training",
      description: "T-shirt tecnica per gli allenamenti quotidiani. Tessuto anti-sudore e tecnologia anti-odore.",
      isFeatured: false
    },
    {
      id: 5,
      name: "Felpa con Cappuccio Hyria",
      price: 49.90,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=350&fit=crop&q=80",
      category: "leisure",
      description: "Felpa con cappuccio e logo Hyria Basket ricamato. Perfetta per il pre e post allenamento.",
      isFeatured: true,
      isOnSale: true,
      discount: 15
    },
    {
      id: 6,
      name: "Zaino Ufficiale Pro Team",
      price: 39.90,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=350&fit=crop&q=80",
      category: "accessories",
      description: "Zaino ufficiale con scomparto dedicato per la palla e spazio per le scarpe. Design ergonomico e materiali premium.",
      isFeatured: false
    },
    {
      id: 7,
      name: "Pallone da Basket Competizione",
      price: 24.90,
      image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=500&h=350&fit=crop&q=80",
      category: "accessories",
      description: "Pallone da basket ufficiale utilizzato durante le partite casalinghe. Grip ottimizzato per prestazioni superiori.",
      isNew: true
    },
    {
      id: 8,
      name: "Cappellino New Era Hyria",
      price: 29.90,
      image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&h=350&fit=crop&q=80",
      category: "accessories",
      description: "Cappellino ufficiale New Era con logo Hyria Basket ricamato. Design esclusivo e vestibilità perfetta.",
      isFeatured: true
    }
  ];

  // Icone di categorie
  const categoryIcons = {
    jersey: "https://cdn-icons-png.flaticon.com/512/1809/1809371.png",
    training: "https://cdn-icons-png.flaticon.com/512/2548/2548537.png",
    leisure: "https://cdn-icons-png.flaticon.com/512/3331/3331886.png",
    accessories: "https://cdn-icons-png.flaticon.com/512/863/863684.png"
  };

  // Stati
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{id: number, quantity: number}[]>([]);
  const [] = useState(false);
  
  // Filtraggio dei prodotti in base alla categoria selezionata e termine di ricerca
  const filteredProducts = products
    .filter(product => activeCategory === 'all' || product.category === activeCategory)
    .filter(product => 
      searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  
  // Prodotti in evidenza
  const featuredProducts = products.filter(product => product.isFeatured);
  
  // Aggiungi al carrello
  const addToCart = (productId: number) => {
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
      setCartItems(
        cartItems.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { id: productId, quantity: 1 }]);
    }
    
    // Effetto visivo di conferma
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
      productElement.classList.add('added-to-cart');
      setTimeout(() => {
        productElement.classList.remove('added-to-cart');
      }, 1000);
    }
  };

  // Funzione per l'apertura del modal con dettagli prodotto
  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    // Blocca lo scroll del body
    document.body.style.overflow = 'hidden';
  };

  // Chiusura del modal
  const closeProductModal = () => {
    setIsModalOpen(false);
    // Riattiva lo scroll
    document.body.style.overflow = 'auto';
  };

  // Assicurati che lo scroll venga riattivato quando la componente viene smontata
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="store-page">
      {/* Hero Section con sfondo animato */}
      <div className="contact-hero">
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
            Abbigliamento ufficiale e merchandising Hyria Basket - Vesti i colori della tua passione
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onClick={() => openProductModal(product)}
                onAddToCart={addToCart}
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
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
                  document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <img src={icon} alt={key} className="category-icon" />
                <h3 className="category-title">
                  {key === 'jersey' && 'Divise da Gioco'}
                  {key === 'training' && 'Abbigliamento Allenamento'}
                  {key === 'leisure' && 'Tempo Libero'}
                  {key === 'accessories' && 'Accessori'}
                </h3>
                <p className="category-description">
                  {key === 'jersey' && 'Le divise ufficiali di Hyria Basket'}
                  {key === 'training' && "L'abbigliamento tecnico per i tuoi allenamenti"}
                  {key === 'leisure' && 'Capi casual con i nostri colori'}
                  {key === 'accessories' && 'Completa il tuo outfit con i nostri accessori'}
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
                  activeCategory === category.id ? 'active' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
          
          {/* Lista Prodotti con layout migliorato */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onClick={() => openProductModal(product)}
                onAddToCart={addToCart}
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
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-100">Nessun prodotto trovato</h3>
              <p className="mt-1 text-gray-400">
                Prova a modificare i filtri o il termine di ricerca.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-hyria-secondary hover:bg-hyria-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hyria-secondary"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchTerm('');
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              className="how-it-works-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="how-it-works-number">1</div>
              <h3 className="text-xl font-bold mb-3 text-center text-white">Scegli i Prodotti</h3>
              <p className="text-gray-300 text-center">Naviga nel nostro catalogo e aggiungi al carrello i prodotti che desideri acquistare.</p>
            </motion.div>
            
            <motion.div
              className="how-it-works-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="how-it-works-number">2</div>
              <h3 className="text-xl font-bold mb-3 text-center text-white">Effettua il Pagamento</h3>
              <p className="text-gray-300 text-center">Procedi al checkout e scegli il metodo di pagamento che preferisci tra le opzioni disponibili.</p>
            </motion.div>
            
            <motion.div
              className="how-it-works-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="how-it-works-number">3</div>
              <h3 className="text-xl font-bold mb-3 text-center text-white">Ricevi a Casa o in Palestra</h3>
              <p className="text-gray-300 text-center">Scegli se ricevere i prodotti a casa tua o ritirarli direttamente al palazzetto durante gli allenamenti.</p>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-12 glass-card p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 text-white">Informazioni Importanti</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-2 text-hyria-secondary">Spedizione</h4>
                <p className="text-gray-300 mb-4">Spedizione gratuita per ordini superiori a 50€. Gli ordini vengono processati in 1-2 giorni lavorativi e consegnati in 3-5 giorni.</p>
                
                <h4 className="font-bold text-lg mb-2 text-hyria-secondary">Pagamenti Accettati</h4>
                <p className="text-gray-300">Accettiamo carte di credito/debito, PayPal e bonifico bancario.</p>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-2 text-hyria-secondary">Resi e Cambi</h4>
                <p className="text-gray-300 mb-4">Hai 14 giorni per restituire un articolo. Gli articoli devono essere nelle condizioni originali, con etichette e packaging intatti.</p>
                
                <h4 className="font-bold text-lg mb-2 text-hyria-secondary">Personalizzazione</h4>
                <p className="text-gray-300">Offriamo servizio di personalizzazione per le maglie con numero e nome. Contattaci per maggiori informazioni.</p>
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
              Indossa con orgoglio i colori di Hyria Basket e supporta la tua squadra del cuore
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.a
                href="#all-products"
                className="buy-button min-w-[180px] py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ESPLORA IL CATALOGO
              </motion.a>
              <motion.a
                href="/contatti"
                className="bg-transparent border-2 border-hyria-secondary text-white rounded-md px-6 py-3 font-semibold min-w-[180px] inline-flex justify-center hover:bg-hyria-secondary/20 transition-all"
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 py-6">
          <motion.div 
            className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Bottone per chiudere */}
            <button 
              className="absolute top-4 right-4 bg-hyria-primary rounded-full p-2 text-white z-10"
              onClick={closeProductModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col md:flex-row">
              {/* Immagine prodotto */}
              <div className="md:w-1/2">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Dettagli prodotto */}
              <div className="md:w-1/2 p-6">
                {selectedProduct.isNew && (
                  <span className="inline-block bg-hyria-secondary text-white text-xs px-3 py-1 rounded-full mb-4">
                    Nuovo
                  </span>
                )}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>
                <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                
                <div className="flex items-center mb-6">
                  {selectedProduct.isOnSale ? (
                    <>
                      <span className="text-2xl font-bold text-gray-800">€{(selectedProduct.price * (1 - (selectedProduct.discount || 0) / 100)).toFixed(2)}</span>
                      <span className="text-sm line-through text-gray-500 ml-2">€{selectedProduct.price.toFixed(2)}</span>
                      <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">-{selectedProduct.discount}%</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-800">€{selectedProduct.price.toFixed(2)}</span>
                  )}
                </div>
                
                {/* Taglie */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Taglie disponibili</h3>
                  <div className="flex space-x-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button 
                        key={size}
                        className="w-10 h-10 border rounded-md flex items-center justify-center text-sm font-medium hover:border-hyria-secondary hover:text-hyria-secondary transition-colors"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Pulsante acquista */}
                <button 
                  className="buy-button w-full py-3 text-lg"
                  onClick={() => {
                    addToCart(selectedProduct.id);
                    closeProductModal();
                  }}
                >
                  AGGIUNGI AL CARRELLO
                </button>
                
                {/* Info aggiuntive */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-hyria-secondary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Disponibile
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-hyria-secondary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    Consegna in 3-5 giorni lavorativi
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Componente ProductCard con design migliorato
const ProductCard: React.FC<{ 
  product: Product,
  onClick: () => void,
  onAddToCart: (id: number) => void,
  delay?: number
}> = ({ product, onClick, onAddToCart, delay = 0 }) => {
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
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
        />
        <div className="overlay"></div>
        
        {/* Badge per prodotti nuovi o in saldo */}
        {product.isNew && (
          <div className="product-badge new">Nuovo</div>
        )}
        {product.isOnSale && (
          <div className="product-badge sale">-{product.discount}%</div>
        )}
      </div>
      
      <div className="product-details">
        <h3 className="product-title" onClick={onClick}>{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <div className="price-container">
            {product.isOnSale ? (
              <>
                <span className="current-price">€{(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}</span>
                <span className="original-price">€{product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="current-price">€{product.price.toFixed(2)}</span>
            )}
          </div>
          
          <button 
            className="buy-button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Acquista
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Store;
