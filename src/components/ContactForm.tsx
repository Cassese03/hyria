import React, { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
}

const ContactForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    reason: "",
    message: "",
  });

  // Form status
  const [status, setStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reimposta il form
  const resetForm = () => {
    setStatus({
      submitted: false,
      success: false,
      message: "",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      reason: "",
      message: "",
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validazione base
    if (
      !formData.name ||
      !formData.email ||
      !formData.reason ||
      !formData.message
    ) {
      setStatus({
        submitted: true,
        success: false,
        message: "Per favore, compila tutti i campi obbligatori.",
      });
      setIsLoading(false);
      return;
    }

    try {
      
    // Prepara i dati per l'API
    const response = await fetch('https://send-email-nine-pi.vercel.app/api/send-email', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      to: 'casseselorenzo03@gmail.com', // Replace with recipient email
      from: 'info@hyriabasket.it', // Replace with sender email
      subject: `Nuovo contatto da SITO : ${formData.name} - ${formData.reason}`,
      html: `
        <h2>Nuovo messaggio dal form di contatto</h2>
        <p><strong>Nome:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Telefono:</strong> ${formData.phone || 'Non specificato'}</p>
        <p><strong>Motivo:</strong> ${formData.reason}</p>
        <p><strong>Messaggio:</strong></p>
        <p>${formData.message}</p>
      `,
      }),
    });

    // Controlla la risposta
    const success = response.ok;

    setStatus({
        submitted: true,
        success: success,
        message: success
          ? "Grazie per averci contattato! Ti risponderemo al più presto."
          : "Si è verificato un errore. Riprova più tardi.",
      });

      // Non resettiamo il form qui per permettere all'animazione di mostrare l'icona
    } catch (error) {
      console.error("Errore:", error);
      setStatus({
        submitted: true,
        success: false,
        message: "Si è verificato un errore. Riprova più tardi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-form-container w-full mx-auto">
      <AnimatePresence mode="wait">
        {!status.submitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="contact-form bg-[#600000] p-4 md:p-6 rounded-lg flex flex-col gap-4 w-full mx-auto"
            style={{
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              color: "#fff",
            }}
            onSubmit={handleSubmit}
          >
            <h2
              className="text-xl md:text-2xl font-bold text-center mb-4"
              style={{ color: "#ff9900" }}
            >
              Modulo di Contatto
            </h2>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#ff9900] font-semibold text-center text-base">
                Nome e Cognome *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Inserisci il tuo nome e cognome"
                className="w-full p-3 text-center rounded-lg border-2 border-[#ff9900] bg-transparent text-white placeholder-[#ffd699] focus:border-[#ffb84d] focus:outline-none transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#ff9900] font-semibold text-center text-base">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
                className="w-full p-3 text-center rounded-lg border-2 border-[#ff9900] bg-transparent text-white placeholder-[#ffd699] focus:border-[#ffb84d] focus:outline-none transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#ff9900] font-semibold text-center text-base">
                Numero di Telefono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+39 333 123 4567"
                className="w-full p-3 text-center rounded-lg border-2 border-[#ff9900] bg-transparent text-white placeholder-[#ffd699] focus:border-[#ffb84d] focus:outline-none transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#ff9900] font-semibold text-center text-base">
                Motivo Contatto *
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full p-3 text-center rounded-lg border-2 border-[#ff9900] bg-[#600000] text-white focus:border-[#ffb84d] focus:outline-none transition-all duration-300"
              >
                <option value="" disabled>
                  Seleziona il motivo del contatto
                </option>
                <option value="info" className="bg-[#600000]">
                  Richiesta Informazioni
                </option>
                <option value="iscrizione" className="bg-[#600000]">
                  Iscrizione Minibasket
                </option>
                <option value="partnership" className="bg-[#600000]">
                  Partnership/Sponsorizzazione
                </option>
                <option value="altro" className="bg-[#600000]">
                  Altro
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#ff9900] font-semibold text-center text-base">
                Messaggio *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Scrivi qui il tuo messaggio dettagliato..."
                rows={4}
                className="w-full p-3 rounded-lg border-2 border-[#ff9900] bg-transparent text-white placeholder-[#ffd699] focus:border-[#ffb84d] focus:outline-none transition-all duration-300 resize-none"
              />
            </div>

            <div className="flex justify-center w-full mt-2">
              <motion.button
                type="submit"
                className="relative px-6 py-1.5 font-bold text-sm rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 overflow-hidden w-full max-w-[240px] mx-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                style={{
                  color: "#d96c00",
                  backgroundColor: "#352424",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "wait" : "pointer",
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      INVIO...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{
                          width: "16px",
                          height: "16px",
                          strokeWidth: 2.5,
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      CONFERMA
                    </>
                  )}
                </span>
              </motion.button>
            </div>

            <p className="text-center text-xs text-[#ffd699] mt-2">
              * Campi obbligatori - Ti risponderemo entro 24 ore
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="contact-result bg-[#600000] p-8 md:p-10 rounded-lg flex flex-col items-center justify-center gap-6 w-full mx-auto min-h-[400px]"
            style={{
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              color: "#fff",
              width: "100%",
            }}
          >
            {/* Icona di successo o errore */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: status.success ? 0 : 180 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              className={`w-32 h-32 rounded-full flex items-center justify-center ${
                status.success ? "bg-green-700/30" : "bg-red-700/30"
              }`}
              style={{ width: "100%" }}
            >
              {status.success ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )}
            </motion.div>

            {/* Messaggio di stato */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#ff9900" }}
              >
                {status.success
                  ? "Messaggio Inviato!"
                  : "Si è verificato un errore"}
              </h3>
              <p className="text-lg mb-8 text-white">{status.message}</p>
            </motion.div>

            {/* Pulsante per tornare al form */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={resetForm}
              className="px-6 py-3 rounded-lg font-bold text-[#d96c00] bg-[#352424] hover:bg-[#403030] transition-colors duration-300"
            >
              {status.success ? "Invia un altro messaggio" : "Riprova"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
