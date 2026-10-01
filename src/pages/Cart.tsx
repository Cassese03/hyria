import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrashIcon, PlusIcon, MinusIcon, ShieldCheckIcon, TruckIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';
import type { CartItem } from '../contexts/CartContext';
import PageHead from '../components/PageHead';
import '../styles/cart.css';

interface CartItemRowProps {
  item: CartItem;
  index: number;
  onUpdateQuantity: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = React.memo(
  ({ item, index, onUpdateQuantity, onRemove }) => {
    return (
      <motion.div
        className="cart-item-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.2) }}
      >
        <img
          src={item.image}
          alt={item.name}
          className="cart-item-image"
          loading="lazy"
          decoding="async"
        />

        <div className="cart-item-info">
          <h3 className="cart-item-name font-heading">{item.name}</h3>
          {item.size && (
            <p className="cart-item-size">
              Taglia: <span className="font-semibold text-white">{item.size}</span>
            </p>
          )}
          <p className="cart-item-unit-price">€{item.price.toFixed(2)}</p>
        </div>

        <div className="cart-item-quantity" role="group" aria-label={`Quantità per ${item.name}`}>
          <button
            type="button"
            className="qty-btn"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            aria-label={item.quantity === 1 ? `Rimuovi ${item.name} dal carrello` : `Diminuisci quantità per ${item.name}`}
            title={item.quantity === 1 ? 'Rimuovi' : 'Diminuisci'}
          >
            {item.quantity === 1 ? (
              <TrashIcon className="w-4 h-4 text-red-400" aria-hidden="true" />
            ) : (
              <MinusIcon className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>
          <span className="qty-value" aria-label={`Quantità: ${item.quantity}`}>
            {item.quantity}
          </span>
          <button
            type="button"
            className="qty-btn"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            aria-label={`Aumenta quantità per ${item.name}`}
            title="Aumenta"
          >
            <PlusIcon className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="cart-item-total">
          <p>€{(item.price * item.quantity).toFixed(2)}</p>
        </div>

        <button
          type="button"
          className="cart-item-remove"
          onClick={() => onRemove(item.id)}
          aria-label={`Rimuovi ${item.name} dal carrello`}
          title="Rimuovi dal carrello"
        >
          <TrashIcon className="w-5 h-5 text-red-400 hover:text-red-300 transition-colors" aria-hidden="true" />
        </button>
      </motion.div>
    );
  }
);

CartItemRow.displayName = 'CartItemRow';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  const { itemCount, totalUnits, totalPrice, shippingCost, finalTotal } = useMemo(() => {
    const items = cartItems || [];
    const count = items.length;
    const units = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    const price = typeof getTotalPrice === 'function' ? getTotalPrice() : 0;
    const shipping = price > 50 || price === 0 ? 0 : 9.99;
    return {
      itemCount: count,
      totalUnits: units,
      totalPrice: price,
      shippingCost: shipping,
      finalTotal: price + shipping,
    };
  }, [cartItems, getTotalPrice]);

  const handleUpdateQuantity = useCallback(
    (id: number, qty: number) => {
      updateQuantity(id, qty);
    },
    [updateQuantity]
  );

  const handleRemove = useCallback(
    (id: number) => {
      removeFromCart(id);
    },
    [removeFromCart]
  );

  return (
    <>
      <PageHead
        title="Carrello - Hyria Basket Store"
        description="Visualizza e gestisci i tuoi articoli nel carrello dell'Hyria Basket Store."
        canonicalUrl="https://hyriabasket.it/carrello"
      />

      <div className="cart-page">
        {/* Compact Hero Section */}
        <div className="cart-hero">
          <div className="container text-center">
            <h1 className="cart-hero-title font-heading text-white">
              Il Tuo <span className="text-hyria-orange">Carrello</span>
            </h1>
            <p className="cart-hero-subtitle">
              {itemCount === 0
                ? 'Nessun prodotto selezionato'
                : `${totalUnits} ${totalUnits === 1 ? 'capo' : 'capi'} per sostenere i colori di Hyria`}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <section className="section-padding py-10">
          <div className="container">
            {itemCount === 0 ? (
              <motion.div
                className="cart-empty-box"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-hyria-orange/10 border border-hyria-orange/30 flex items-center justify-center text-hyria-orange">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 font-heading">Carrello Vuoto</h2>
                <p className="text-gray-300 text-sm mb-6">
                  Scopri la nuova collezione ufficiale: divise da gara, abbigliamento tecnico e accessori.
                </p>
                <Link to="/store" className="buy-button inline-flex items-center gap-2 px-8 py-3">
                  <span>Esplora lo Store</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            ) : (
              <div className="cart-layout-grid">
                {/* Articoli List */}
                <div className="cart-items-section">
                  <div className="cart-items-header">
                    <h2 className="cart-items-title font-heading">
                      Prodotti ({totalUnits})
                    </h2>
                    <Link to="/store" className="cart-continue-link">
                      + Aggiungi altri articoli
                    </Link>
                  </div>

                  <div className="cart-items-list">
                    {cartItems.map((item, index) => (
                      <CartItemRow
                        key={`${item.id}-${item.size}`}
                        item={item}
                        index={index}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </div>

                {/* Riepilogo & Checkout */}
                <div className="cart-summary-wrapper sticky top-24">
                  <div className="cart-summary">
                    <h2 className="cart-summary-title font-heading">
                      Riepilogo Ordine
                    </h2>

                    <div className="cart-summary-rows">
                      <div className="cart-summary-row">
                        <span>Subtotale</span>
                        <span className="text-white font-semibold">€{totalPrice.toFixed(2)}</span>
                      </div>

                      <div className="cart-summary-row">
                        <span>Spedizione</span>
                        <span className={shippingCost === 0 ? "text-hyria-orange font-bold uppercase text-xs" : "text-white font-semibold"}>
                          {shippingCost === 0 ? "Gratuita" : `€${shippingCost.toFixed(2)}`}
                        </span>
                      </div>

                      {shippingCost > 0 && (
                        <p className="text-xs text-gray-400 bg-white/5 p-2 rounded-lg my-2">
                          💡 Spedizione gratuita per ordini sopra €50 (mancano €{(50 - totalPrice).toFixed(2)})
                        </p>
                      )}
                    </div>

                    <div className="cart-summary-divider" />

                    <div className="cart-summary-total-row">
                      <span className="text-base font-bold text-white">Totale</span>
                      <div className="text-right">
                        <div className="cart-summary-total-price">€{finalTotal.toFixed(2)}</div>
                        <span className="text-xs text-gray-400 block">IVA inclusa</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="cart-checkout-btn"
                      onClick={() => alert('Checkout in attivazione. Contatta la segreteria per completare l\'ordine.')}
                    >
                      Procedi al Checkout
                    </button>

                    {/* Compact Trust Signals */}
                    <div className="cart-trust-signals">
                      <div className="cart-trust-item">
                        <HeartIcon className="w-4 h-4 text-hyria-orange shrink-0" aria-hidden="true" />
                        <span>Sostiene direttamente i giovani atleti Hyria</span>
                      </div>
                      <div className="cart-trust-item">
                        <TruckIcon className="w-4 h-4 text-hyria-orange shrink-0" aria-hidden="true" />
                        <span>Ritiro al palazzetto o spedizione espressa</span>
                      </div>
                      <div className="cart-trust-item">
                        <ShieldCheckIcon className="w-4 h-4 text-hyria-orange shrink-0" aria-hidden="true" />
                        <span>Reso o cambio taglia garantito entro 14 giorni</span>
                      </div>
                    </div>
                  </div>
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
