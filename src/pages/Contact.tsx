import PageHead from '../components/PageHead';
import ArenaPageHero from '../components/ArenaPageHero';
import ContactForm from '../components/ContactForm';
import FaqList from '../components/FaqList';
import '../styles/contatti.css';

const CONTACT_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contatti - Hyria Basket',
  description: 'Contatta Hyria Basket per informazioni su corsi, iscrizioni e attività. Trova i nostri recapiti e modulo di contatto.',
  url: 'https://hyriabasket.it/contatti',
};

const PHONES = [
  { name: 'Attilio', number: '+39 333 746 1777' },
  { name: 'Paolino', number: '+39 331 402 3282' },
];
const EMAIL = 'info@hyriabasket.it';
const ADDRESS = ['Via Madonna delle Grazie, 61', '80035 Nola (NA)'];
const MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=Via+Madonna+delle+Grazie+61+Nola';

const FAQS = [
  {
    question: 'Come posso iscrivermi alle attività di Hyria Basket?',
    answer:
      'Contattaci dai nostri profili social, per email o per telefono per fissare un appuntamento. Per iscriversi servono il modulo di iscrizione compilato e un certificato medico valido.',
  },
  {
    question: 'Quanto costa l’iscrizione?',
    answer:
      'Il costo varia in base all’attività e alle promozioni in corso. Contattaci per ricevere tutti i dettagli.',
  },
  {
    question: 'Da che età si può iniziare a giocare a basket?',
    answer:
      'Il minibasket accoglie bambini a partire dai 5 anni. Per i più piccoli proponiamo attività ludico-motorie che preparano al basket.',
  },
  {
    question: 'Dove si svolgono gli allenamenti?',
    answer:
      'Nel nostro palazzetto a Nola e in altre strutture convenzionate della zona. Gli indirizzi esatti vengono comunicati al momento dell’iscrizione.',
  },
];

const tel = (n: string) => `tel:${n.replace(/\s/g, '')}`;

const Contact = () => (
  <>
    <PageHead
      title="Contatti Hyriabasket – Squadra Basket Nola"
      description="Contatta Hyria Basket per informazioni su corsi, allenamenti e iscrizioni. Trova tutti i nostri recapiti telefonici, email e sede a Nola."
      keywords="contatti Hyria Basket, telefono basket Nola, email pallacanestro, iscrizioni minibasket, sede Nola"
      ogTitle="Contatti Hyria Basket - Informazioni e Iscrizioni"
      ogDescription="Contattaci per informazioni su corsi di basket, iscrizioni e attività. Tutti i recapiti di Hyria Basket a Nola."
      ogUrl="https://hyriabasket.it/contatti"
      canonicalUrl="https://hyriabasket.it/contatti"
      structuredData={CONTACT_STRUCTURED_DATA}
    />

    <div className="pg">
      <ArenaPageHero
        shot="contatti"
        floorTitle="Parliamo"
        ledText={EMAIL}
        kicker="Contatti"
        title="Parliamo"
        lead="Iscrizioni, informazioni, sponsorizzazioni: scrivici o chiamaci, ti rispondiamo entro 24 ore."
        image="/images/contact-hero.jpg"
        actions={
          <>
            <a href="#modulo" className="hy-btn hy-btn--primary">
              Scrivici
            </a>
            <a href={tel(PHONES[0].number)} className="hy-btn hy-btn--ghost">
              Chiama
            </a>
          </>
        }
      />

      <section id="modulo" className="pg-sec">
        <div className="pg-wrap ct-grid">
          <div>
            <h2 className="hy-h2">Recapiti</h2>
            <dl className="ct-info">
              <div>
                <dt>Telefono</dt>
                {PHONES.map((p) => (
                  <dd key={p.number}>
                    {p.name} <a href={tel(p.number)}>{p.number}</a>
                  </dd>
                ))}
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </dd>
              </div>
              <div>
                <dt>Indirizzo</dt>
                <dd>
                  <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
                    {ADDRESS[0]}
                    <br />
                    {ADDRESS[1]}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="pg-sec pg-sec--deep">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Domande frequenti</h2>
          </header>
          <FaqList faqs={FAQS} />
        </div>
      </section>

      <section className="pg-sec">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Dove siamo</h2>
            <p>
              {ADDRESS[0]}, {ADDRESS[1]}.
            </p>
          </header>
          <div className="ct-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3014.617422555087!2d14.533819076267536!3d40.92413362460155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133bb3db602399a5%3A0x638012fb6713a298!2sVia%20Madonna%20delle%20Grazie%2C%2061%2C%2080035%20Nola%20NA!5e0!3m2!1sit!2sit!4v1749403025023!5m2!1sit!2sit"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sede Hyria Basket - Via Madonna delle Grazie 61, Nola"
            />
          </div>
        </div>
      </section>
    </div>
  </>
);

export default Contact;
