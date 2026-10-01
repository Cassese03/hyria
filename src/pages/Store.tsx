import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import type { CartItem } from "../contexts/CartContext";
import "../styles/store.css";
// Lazy-load del visualizzatore 3D per ridurre il bundle iniziale
const Product3DViewer = React.lazy(() => import("../components/Product3DViewer"));

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
  model3d?: string;
}

// Dati statici hoistati fuori dal componente per evitare re-allocazioni
const CATEGORIES = [
  { id: "all", name: "Tutti i Prodotti" },
  { id: "jersey", name: "Divise da Gioco" },
  { id: "training", name: "Abbigliamento Allenamento" },
  { id: "leisure", name: "Tempo Libero" },
  { id: "accessories", name: "Accessori" },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Maglia Gara Home 2023/24",
    price: 59.9,
    image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500&h=350&fit=crop&q=80",
    category: "jersey",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Maglia ufficiale Hyria Basket per le partite in casa della stagione 2023/24. Design esclusivo con tessuto traspirante.",
    isFeatured: true,
    isNew: true,
  },
  {
    id: 2,
    name: "Maglia Gara Away 2023/24",
    price: 59.9,
    image: "https://images.unsplash.com/photo-1776179342972-875cbbcdd32f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "jersey",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Maglia ufficiale da trasferta dell'Hyria Basket per la stagione 2023/24. Colori audaci e tessuto ultraleggero.",
    isFeatured: true,
  },
  {
    id: 3,
    name: "Pantaloncini Gara Pro",
    price: 34.9,
    image: "https://images.unsplash.com/photo-1656645123173-f98a07459f49?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "jersey",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Pantaloncini ufficiali da gara con tecnologia Dry-Fit per mantenere il corpo asciutto durante l'attività sportiva.",
    isFeatured: true,
  },
  {
    id: 4,
    name: "T-Shirt Allenamento Tech",
    price: 29.9,
    image: "https://images.unsplash.com/photo-1581952976147-5a2d15560349?w=500&h=350&fit=crop&q=80",
    category: "training",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "T-shirt tecnica per gli allenamenti quotidiani. Tessuto anti-sudore e tecnologia anti-odore.",
    isFeatured: false,
  },
  {
    id: 5,
    name: "Felpa con Cappuccio Hyria",
    price: 49.9,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=350&fit=crop&q=80",
    category: "leisure",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Felpa con cappuccio e logo Hyria Basket ricamato. Perfetta per il pre e post allenamento.",
    isFeatured: true,
    isOnSale: true,
    discount: 15,
  },
  {
    id: 6,
    name: "Zaino Ufficiale Pro Team",
    price: 39.9,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=350&fit=crop&q=80",
    category: "accessories",
    sizes: ["One Size"],
    description: "Zaino ufficiale con scomparto dedicato per la palla e spazio per le scarpe. Design ergonomico e materiali premium.",
    isFeatured: false,
  },
  {
    id: 7,
    name: "Pallone da Basket Competizione",
    price: 24.9,
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=500&h=350&fit=crop&q=80",
    category: "accessories",
    sizes: ["One Size"],
    description: "Pallone da basket ufficiale utilizzato durante le partite casalinghe. Grip ottimizzato per prestazioni superiori.",
    isNew: true,
  },
  {
    id: 8,
    name: "Cappellino New Era Hyria",
    price: 29.9,
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&h=350&fit=crop&q=80",
    category: "accessories",
    sizes: ["One Size"],
    description: "Cappellino ufficiale New Era con logo Hyria Basket ricamato. Design esclusivo e vestibilità perfetta. Visualizzabile anche in 3D interattivo.",
    isFeatured: true,
    model3d: "/3d/hat/Cap.glb",
  },
];

const Store: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>("M");

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchCategory = activeCategory === "all" || product.category === activeCategory;
      if (!matchCategory) return false;
      if (!term) return true;
      return (
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      );
    });
  }, [activeCategory, searchTerm]);

  const handleAddToCart = useCallback(
    (product: Product, size?: string) => {
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
    },
    [addToCartContext, selectedSize]
  );

  const openProductModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || "M");
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }, []);
  const closeProductModal = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  // Escape key listener for accessible modal closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeProductModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, closeProductModal]);

  return (
    <div className="store-page">
      {/* Hero Section */}
      <div className="store-hero">
        <div className="store-hero-content">
          <motion.h1
            className="store-hero-title text-white font-heading"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            STORE <span className="text-hyria-orange">UFFICIALE</span>
          </motion.h1>
          <motion.p
            className="store-hero-subtitle text-white"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Abbigliamento tecnico, divise da gara e merchandising Hyria Basket
          </motion.p>

          <motion.div
            className="search-bar"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input
              type="text"
              className="search-input"
              placeholder="Cerca per nome o descrizione..."
              aria-label="Cerca prodotti nello store"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Catalog & Filter Section */}
      <section className="section-padding py-12">
        <div className="container max-w-7xl">
          {/* Category Filter Chips */}
          <div className="category-filter" role="tablist" aria-label="Categorie prodotti">
            {CATEGORIES.map((category) => (
              <button
                type="button"
                key={category.id}
                role="tab"
                aria-selected={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`category-button ${activeCategory === category.id ? "active" : ""}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Results Bar */}
          <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-8">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              {filteredProducts.length} {filteredProducts.length === 1 ? "prodotto trovato" : "prodotti trovati"}
            </span>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-xs text-hyria-orange hover:underline font-semibold"
              >
                Cancella ricerca
              </button>
            )}
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => openProductModal(product)}
                  onAddToCart={handleAddToCart}
                  delay={index * 0.03}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 font-heading">Nessun prodotto trovato</h3>
                <p className="text-sm text-gray-400 mb-4">Prova a cercare un termine diverso o seleziona un'altra categoria.</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchTerm("");
                  }}
                  className="buy-button px-5 py-2 text-xs"
                >
                  Mostra Tutti i Prodotti
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal Prodotto con 3D Viewer interattivo */}
      {isModalOpen && selectedProduct && (
        <div
          className="product-modal-backdrop"
          onClick={closeProductModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-product-title"
        >
          <motion.div
            className="product-modal-container"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Immagine o Visualizzatore 3D (INTERATTIVO nel modal) */}
            <div className="product-modal-media">
              {selectedProduct.model3d ? (
                <Suspense fallback={<ThreeLoader />}>
                  <Product3DViewer url={selectedProduct.model3d} interactive={true} />
                </Suspense>
              ) : (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="product-modal-img"
                  loading="eager"
                  decoding="async"
                />
              )}
            </div>

            {/* Dettagli */}
            <div className="product-modal-details">
              {selectedProduct.isNew && (
                <span className="product-badge-pill">Nuovo</span>
              )}
              <h2 id="modal-product-title" className="product-modal-title font-heading">
                {selectedProduct.name}
              </h2>
              <p className="product-modal-desc">
                {selectedProduct.description}
              </p>

              <div className="product-modal-pricing">
                {selectedProduct.isOnSale ? (
                  <>
                    <span className="product-modal-current-price">
                      €{(selectedProduct.price * (1 - (selectedProduct.discount || 0) / 100)).toFixed(2)}
                    </span>
                    <span className="product-modal-orig-price">
                      €{selectedProduct.price.toFixed(2)}
                    </span>
                    <span className="product-modal-discount-tag">
                      -{selectedProduct.discount}%
                    </span>
                  </>
                ) : (
                  <span className="product-modal-current-price">
                    €{selectedProduct.price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <h3 className="product-modal-sizes-label">Scegli Taglia</h3>
                <div className="flex gap-3 flex-wrap">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`size-select-btn ${selectedSize === size ? "selected" : ""}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleAddToCart(selectedProduct, selectedSize);
                  closeProductModal();
                  navigate("/carrello");
                }}
                className="add-to-cart-cta font-sans"
              >
                Aggiungi al Carrello
              </button>
            </div>

            {/* Close Button con accessible name */}
            <button
              type="button"
              onClick={closeProductModal}
              className="product-modal-close"
              aria-label="Chiudi dettaglio prodotto (Esc)"
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

// ==========================================
// COMPONENTI GRAFICI E MEMOIZZATI
// ==========================================

const ProductCard: React.FC<{
  product: Product;
  onClick: () => void;
  onAddToCart: (product: Product, size?: string) => void;
  delay?: number;
}> = React.memo(({ product, onClick, delay = 0 }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      className="product-card"
      tabIndex={0}
      role="button"
      aria-label={`Visualizza dettagli per ${product.name}, prezzo €${product.price.toFixed(2)}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          decoding="async"
        />

        <div className="overlay"></div>
        {product.isNew && <div className="product-badge new">Nuovo</div>}
        {product.isOnSale && <div className="product-badge sale">-{product.discount}%</div>}
        {product.model3d && (
          <div className="product-badge model-3d-badge">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Modello 3D
          </div>
        )}
      </div>

      <div className="product-details">
        <h3 className="product-title">
          {product.name}
        </h3>
        <div className="flex justify-between items-center mt-3">
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
          <div className="flex justify-end">
            <span className="buy-button">
              Dettagli
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

// Loader Fallback per il 3D
const ThreeLoader = () => (
  <div className="flex flex-col items-center justify-center h-full w-full py-12 text-white/80">
    <div className="w-10 h-10 border-4 border-hyria-orange border-t-transparent rounded-full animate-spin mb-3"></div>
    <span className="text-xs uppercase tracking-wider font-semibold">Caricamento 3D...</span>
  </div>
);

export default Store;

