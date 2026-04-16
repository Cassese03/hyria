import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import { useCart } from '../contexts/CartContext';
import PageHead from '../components/PageHead';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  const itemCount = cartItems.length;
  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 50 ? 0 : 9.99;
  const finalTotal = totalPrice + shippingCost;

  return (
    <>
      <PageHead
        title="Carrello - Hyria Basket Store"
        description="Visualizza e gestisci i tuoi articoli nel carrello dell'Hyria Basket Store."
        canonicalUrl="https://hyriabasket.it/carrello"
      />

      <div className="cart-page">
        {/* Hero Section */}
        <div className="store-hero">
          <div className="store-hero-content">
            <motion.h1
              className="store-hero-title text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              IL TUO <span className="gradient-text">CARRELLO</span>
            </motion.h1>
            <motion.p
              className="store-hero-subtitle text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {itemCount === 0
                ? 'Il tuo carrello è vuoto'
                : `${itemCount} ${itemCount === 1 ? 'articolo' : 'articoli'} nel carrello`}
            </motion.p>
          </div>
        </div>

        {/* Carrello Content */}
        <section className="section-padding">
          <div className="container">
            {cartItems.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="mt-4 text-2xl font-bold text-white mb-2">Carrello Vuoto</h3>
                <p className="text-gray-400 mb-8">Non hai ancora aggiunto articoli al carrello. Scopri i nostri prodotti!</p>
                <Link to="/store" className="buy-button inline-block">
                  TORNA AL NEGOZIO
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Articoli */}
                <div className="lg:col-span-2">
                  <SectionTitle title="ARTICOLI DEL CARRELLO" subtitle={`${itemCount} ${itemCount === 1 ? 'articolo' : 'articoli'}`} />

                  <div className="space-y-4 mt-8">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={`${item.id}-${item.size}`}
                        className="cart-item-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <img src={item.image} alt={item.name} className="cart-item-image" />

                        <div className="cart-item-info">
                          <h3 className="text-lg font-bold text-white">{item.name}</h3>
                          {item.size && <p className="text-sm text-gray-400">Taglia: {item.size}</p>}
                          <p className="text-hyria-secondary font-bold mt-2">€{item.price.toFixed(2)}</p>
                        </div>

                        <div className="cart-item-quantity">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            title={item.quantity === 1 ? "Rimuovi dal carrello" : "Diminuisci quantità"}
                          >
                            {item.quantity === 1 ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            ) : (
                              '−'
                            )}
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="qty-input"
                          />
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-total">
                          <p className="text-white font-bold">€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>

                        <button
                          className="cart-item-remove"
                          onClick={() => removeFromCart(item.id)}
                          title="Rimuovi dal carrello"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* <motion.div
                    className="mt-8 text-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <button
                      className="text-gray-400 hover:text-hyria-secondary transition-colors"
                      onClick={clearCart}
                    >
                      Svuota carrello
                    </button>
                  </motion.div> */}
                </div>

                {/* Riepilogo Ordine */}
                <div>
                  <SectionTitle title="RIEPILOGO" subtitle="Dettagli del tuo ordine" />

                  <motion.div
                    className="cart-summary glass-card mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="summary-row">
                      <span className="text-gray-300">Subtotale:</span>
                      <span className="text-white font-bold">€{totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row">
                      <span className="text-gray-300">
                        Spedizione:
                      </span>
                      <span className={shippingCost === 0 ? "text-hyria-secondary font-bold" : "text-white font-bold"}>
                         Da concordare con lo staff! {/*€{shippingCost.toFixed(2)} */}
                      </span>
                    </div>

                    {shippingCost > 0 && (
                      <p className="text-xs text-gray-400 mt-2">Spedizione gratuita sopra €50</p>
                    )}

                    <div className="summary-divider"></div>

                    <div className="summary-row total">
                      <span className="text-lg font-bold text-white">Totale:</span>
                      <span className="text-2xl font-black text-hyria-secondary">€{finalTotal.toFixed(2)}</span>
                    </div>

                    <div style={{display:'flex','justifyContent':'space-between'}}>
                     <motion.button
                        className="buy-button w-full mt-6 py-3 text-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link to="/store" className="block text-center text-gray-400 hover:text-hyria-secondary transition-colors mt-4 text-sm">
                          Continua lo shopping
                        </Link>
                      </motion.button>
  
                      <motion.button
                        className="buy-button w-full mt-6 py-3 text-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => alert('Checkout non ancora disponibile. Presto!')}
                      >
                        PROCEDI AL CHECKOUT
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Info Spedizione */}
                  <motion.div
                    className="mt-8 bg-hyria-primary/30 rounded-lg p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{margin: '1rem'}}
                  >
                    <h4 className="font-bold text-white mb-3">Informazioni Importanti</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-hyria-secondary mt-1">✓</span>
                        <span>Spedizione gratuita per ordini superiori a €50</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-hyria-secondary mt-1">✓</span>
                        <span>Consegna in 3-5 giorni lavorativi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-hyria-secondary mt-1">✓</span>
                        <span>Reso gratuito entro 14 giorni</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Cart;
