import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import ArenaPageHero from '../components/ArenaPageHero';
import FaqList from '../components/FaqList';
import { seoFor } from '../seo/routes';
import { AREA_SERVED, CLUB, HOME_VENUE, ISTRUTTORI_FIP, OTHER_VENUES, PARENT_FAQS, PROGRAMS } from '../seo/site';
import '../styles/settore.css';
import '../styles/minibasket.css';

// i gruppi del minibasket, dalla stessa fonte dei dati strutturati
const GROUPS = PROGRAMS.filter((p) => p.active && p.name.startsWith('Minibasket')).map((p) => ({
  ...p,
  short: p.name.replace('Minibasket ', ''),
}));

const NEAR = ['Cimitile', 'Casamarciano', 'Saviano'];
const ALSO = AREA_SERVED.filter((t) => t !== 'Nola' && !NEAR.includes(t));

const WHY = [
  {
    title: ISTRUTTORI_FIP ? 'Istruttori qualificati FIP' : 'Staff tecnico dedicato',
    text: ISTRUTTORI_FIP
      ? 'Ogni gruppo è seguito da istruttori con qualifica della Federazione Italiana Pallacanestro, formati per il minibasket.'
      : 'Ogni gruppo è seguito dai suoi allenatori, con programmi pensati per l’età e lo sviluppo di ogni bambino.',
  },
  {
    title: 'Crescita educativa',
    text: 'Rispetto, disciplina e spirito di squadra: il basket come scuola di vita, prima ancora che come sport.',
  },
  {
    title: 'Sicurezza',
    text: 'Gruppi divisi per età, attività adatte a ogni fascia e certificato medico sportivo per tutti gli iscritti.',
  },
  {
    title: 'Prova gratuita',
    text: 'Fino a 3 allenamenti di prova gratuiti, senza impegno: il bambino conosce la squadra prima di iscriversi.',
  },
];

const tel = (n: string) => `tel:${n.replace(/\s/g, '')}`;
const address = `${HOME_VENUE.streetAddress}, ${HOME_VENUE.postalCode} ${HOME_VENUE.locality} (${HOME_VENUE.region})`;

const MinibasketNola = () => (
  <>
    <PageHead {...seoFor('/minibasket-nola')} />

    <div className="pg">
      <ArenaPageHero
        shot="minibasket"
        floorTitle="Minibasket Nola"
        kicker="Minibasket · Nola e Agro Nolano"
        title="Scuola Minibasket a Nola"
        lead="Corsi di basket per bambine e bambini dai 5 agli 11 anni. Due allenamenti a settimana e le prime 3 lezioni gratis."
        image="/images/5.jpg"
        miniHoop={[-6.5, 0, -4.2]}
        actions={
          <>
            <Link to="/contatti" className="hy-btn hy-btn--primary">
              Prenota la prova gratuita
            </Link>
            <a href={tel(CLUB.phones[0])} className="hy-btn hy-btn--ghost">
              Chiama {CLUB.phones[0]}
            </a>
          </>
        }
      />

      <section className="pg-sec">
        <div className="pg-wrap pg-split">
          <div>
            <h2 className="hy-h2">Corsi di basket per bambini nell’Agro Nolano</h2>
            <p className="pg-quote">Si impara giocando, a canestro basso.</p>
          </div>
          <div className="pg-prose">
            <p>
              Hyria Basket è la società di pallacanestro di Nola. Il nostro <strong>minibasket</strong> accoglie bambine e
              bambini <strong>dai 5 agli 11 anni</strong>, divisi in quattro gruppi per età, con{' '}
              <strong>2 allenamenti a settimana</strong>.
            </p>
            <p>
              Coordinazione, capacità motorie, fondamentali del basket e spirito di squadra: ogni gruppo ha obiettivi
              adatti all’età, dal primo palleggio fino al passaggio al basket giovanile.
            </p>
            <p>
              Ci alleniamo a Nola, a pochi minuti da {NEAR.join(', ')}: per le famiglie dell’Agro Nolano è la scuola
              basket sotto casa.
            </p>
          </div>
        </div>
      </section>

      <section id="gruppi" className="pg-sec pg-sec--deep">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Un gruppo per ogni età</h2>
            <p>Il minibasket segue la crescita dei bambini: ogni anno un gradino in più.</p>
          </header>
          <ol className="sg-ladder">
            {GROUPS.map((g) => (
              <li key={g.id}>
                <span className="sg-ladder-age">{g.ages}</span>
                <h3 className="sg-ladder-name">{g.short}</h3>
                <p className="mb-ladder-text">{g.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pg-sec">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Perché scegliere Hyria Basket</h2>
            <p>Quello che i genitori ci chiedono prima di iscrivere i figli, in quattro punti.</p>
          </header>
          <ul className="pg-rules mb-why">
            {WHY.map((w) => (
              <li key={w.title}>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="dove" className="pg-sec pg-sec--deep">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Gruppi, allenamenti e palestra</h2>
            <p>Gli orari di ogni gruppo vengono comunicati alla prova gratuita, in base all’età e ai posti disponibili.</p>
          </header>

          <div className="mb-table-wrap">
            <table className="mb-table">
              <caption className="sr-only">Gruppi del minibasket Hyria Basket con età, allenamenti e sede</caption>
              <thead>
                <tr>
                  <th scope="col">Gruppo</th>
                  <th scope="col">Età</th>
                  <th scope="col">Allenamenti</th>
                  <th scope="col">Dove</th>
                </tr>
              </thead>
              <tbody>
                {GROUPS.map((g) => (
                  <tr key={g.id}>
                    <th scope="row">{g.short}</th>
                    <td>{g.ages}</td>
                    <td>2 a settimana</td>
                    <td>Nola</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-where">
            <div>
              <h3>La nostra palestra</h3>
              <address>
                {address}
                <br />
                <a href={HOME_VENUE.mapsUrl} target="_blank" rel="noopener noreferrer" className="hy-link">
                  Apri in Google Maps
                </a>
              </address>
              {OTHER_VENUES.length > 0 && (
                <ul className="mb-venues">
                  {OTHER_VENUES.map((v) => (
                    <li key={v.name}>
                      {v.name} – {v.streetAddress}, {v.locality}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>A pochi minuti da</h3>
              <ul className="mb-towns">
                {NEAR.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="mb-also">Ci raggiungono famiglie anche da {ALSO.join(', ')} e da tutto l’Agro Nolano.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pg-sec">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Domande dei genitori</h2>
          </header>
          <FaqList faqs={PARENT_FAQS} />
        </div>
      </section>

      <section className="pg-sec pg-sec--maroon">
        <div className="pg-wrap pg-cta">
          <h2 className="hy-h2">Prenota la lezione di prova gratuita</h2>
          <p>Scrivici o chiamaci: ti diciamo il gruppo giusto e l’orario della prima prova. Senza impegno.</p>
          <div className="hy-actions">
            <Link to="/contatti" className="hy-btn hy-btn--light">
              Prenota la prova
            </Link>
            <a href={tel(CLUB.phones[0])} className="hy-btn hy-btn--ghost">
              Chiama {CLUB.phones[0]}
            </a>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default MinibasketNola;
