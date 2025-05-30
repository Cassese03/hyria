import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    setFormStatus({ 
      submitted: true, 
      success: true, 
      message: 'Grazie per averci contattato. Ti risponderemo al più presto!' 
    });
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ height: '60vh' }}>
        <div className="hero-background">
          <img src="/images/contact-hero.jpg" alt="Contatti Hyria Basket" className="hero-bg-image" />
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
              <span className="gradient-text">CONTATTI</span>
            </h1>
            <div className="section-divider"></div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-6">Contattaci</h2>
                <p className="text-lg mb-8">
                  Hai domande sul nostro progetto, sui corsi di basket o vuoi semplicemente saperne di più? 
                  Non esitare a contattarci, saremo felici di risponderti.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <MapPinIcon className="h-6 w-6 text-hyria-tertiary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Indirizzo</h3>
                    <p>Via Roma, 123 - 80035 Nola (NA)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <PhoneIcon className="h-6 w-6 text-hyria-tertiary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Telefono</h3>
                    <p>+39 334 989 4343</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <EnvelopeIcon className="h-6 w-6 text-hyria-tertiary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p>info@hyriabasket.it</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <ClockIcon className="h-6 w-6 text-hyria-tertiary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Orari Segreteria</h3>
                    <p>Lun-Ven: 16:00-20:00</p>
                    <p>Sabato: 10:00-13:00</p>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Seguici sui Social</h3>
                <div className="flex space-x-4">
                  <a href="#" className="social-icon">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </motion.div>
            
            {/* Form Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6">Inviaci un messaggio</h3>
              
              {formStatus.submitted && (
                <div className={`mb-6 p-4 rounded-md ${formStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-2">Nome e Cognome*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hyria-tertiary"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hyria-tertiary"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 mb-2">Telefono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hyria-tertiary"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700 mb-2">Oggetto*</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hyria-tertiary"
                  >
                    <option value="">Seleziona un'opzione</option>
                    <option value="info">Informazioni generali</option>
                    <option value="iscrizioni">Iscrizioni</option>
                    <option value="partnership">Partnership/Sponsorizzazioni</option>
                    <option value="media">Media e Stampa</option>
                    <option value="altro">Altro</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Messaggio*</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hyria-tertiary"
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  className="btn-primary w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  INVIA MESSAGGIO
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-gray-100">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            DOVE SIAMO
          </motion.h2>
          <div className="section-divider"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 h-[400px] rounded-lg overflow-hidden shadow-lg"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12107.204063086212!2d14.53100954587657!3d40.89693895137151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133ba0862d4b587d%3A0xaed662faec0f6f34!2s80035%20Nola%20NA%2C%20Italia!5e0!3m2!1sit!2sit!4v1649018916544!5m2!1sit!2sit" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            DOMANDE FREQUENTI
          </motion.h2>
          <div className="section-divider"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {[
              {
                question: "Come posso iscrivermi alle attività di Hyria Basket?",
                answer: "Per iscriverti puoi venire direttamente presso la nostra segreteria negli orari indicati, oppure contattarci via email o telefono per fissare un appuntamento. Sarà necessario compilare il modulo di iscrizione e presentare un certificato medico valido."
              },
              {
                question: "Quali sono i costi di iscrizione?",
                answer: "I costi variano in base alla categoria e al tipo di attività. Contattaci per ricevere informazioni dettagliate sui costi e sulle eventuali promozioni in corso."
              },
              {
                question: "Da che età si può iniziare a praticare basket?",
                answer: "I nostri corsi di minibasket accolgono bambini a partire dai 5 anni. Per i più piccoli abbiamo attività ludico-motorie propedeutiche al basket."
              },
              {
                question: "Dove si svolgono gli allenamenti?",
                answer: "Gli allenamenti si svolgono presso il nostro impianto principale a Nola e in altre strutture convenzionate nella zona. Gli indirizzi esatti vengono comunicati al momento dell'iscrizione."
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;