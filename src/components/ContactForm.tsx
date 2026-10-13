import React, { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { shakeVariant } from "../utils/animations";

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

  // Validation shake state
  const [isShaking, setIsShaking] = useState(false);
  const [validationError, setValidationError] = useState("");

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
      setValidationError("Per favore, compila tutti i campi obbligatori.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      setIsLoading(false);
      return;
    }
    setValidationError("");

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
    <div className="cf">
      <AnimatePresence mode="wait">
        {!status.submitted ? (
          <motion.form
            key="form"
            variants={shakeVariant}
            initial="idle"
            animate={isShaking ? "shake" : "idle"}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
            className="cf-form"
            onSubmit={handleSubmit}
          >
            <h2 className="cf-title">Scrivici</h2>

            <div className="cf-row">
              <div className="cf-field">
                <label htmlFor="cf-name">Nome e cognome *</label>
                <input
                  id="cf-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="cf-field">
                <label htmlFor="cf-phone">Telefono</label>
                <input
                  id="cf-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+39 333 123 4567"
                />
              </div>
            </div>

            <div className="cf-field">
              <label htmlFor="cf-email">Email *</label>
              <input
                id="cf-email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="nome@email.com"
              />
            </div>

            <div className="cf-field">
              <label htmlFor="cf-reason">Motivo del contatto *</label>
              <select id="cf-reason" name="reason" value={formData.reason} onChange={handleChange} required>
                <option value="" disabled>
                  Scegli un motivo
                </option>
                <option value="info">Richiesta informazioni</option>
                <option value="iscrizione">Iscrizione minibasket</option>
                <option value="partnership">Partnership e sponsorizzazione</option>
                <option value="altro">Altro</option>
              </select>
            </div>

            <div className="cf-field">
              <label htmlFor="cf-message">Messaggio *</label>
              <textarea
                id="cf-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>

            {validationError && (
              <p className="cf-error" role="alert">
                {validationError}
              </p>
            )}

            <div className="cf-foot">
              <button type="submit" className="hy-btn hy-btn--primary" disabled={isLoading}>
                {isLoading ? "Invio in corso…" : "Invia messaggio"}
              </button>
              <p className="cf-note">* Campi obbligatori. Ti rispondiamo entro 24 ore.</p>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`cf-result ${status.success ? "is-ok" : "is-error"}`}
            role="status"
          >
            <h3>{status.success ? "Messaggio inviato" : "Messaggio non inviato"}</h3>
            <p>{status.message}</p>
            <button type="button" className="hy-btn hy-btn--ghost" onClick={resetForm}>
              {status.success ? "Invia un altro messaggio" : "Riprova"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
