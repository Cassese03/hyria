import React from 'react';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import { seoFor } from '../seo/routes';
import { PARENT_FAQS } from '../seo/site';
import ArenaPageHero from '../components/ArenaPageHero';
import PeopleList from '../components/PeopleList';
import FaqList from '../components/FaqList';
import '../styles/settore.css';

// Gruppi del minibasket in ordine di età
const GROUPS = [
  { name: 'Pulcini', age: '5–6 anni' },
  { name: 'Scoiattoli', age: '7–8 anni' },
  { name: 'Aquilotti', age: '9–10 anni' },
  { name: 'Esordienti', age: '11 anni' },
];

const METHOD = [
  {
    title: 'Approccio progressivo',
    text: "Programmi di allenamento adattati all'età e allo sviluppo psicofisico di ogni bambino.",
  },
  {
    title: 'Sviluppo completo',
    text: 'Attenzione agli aspetti tecnici, fisici e mentali del giocatore, per una crescita armoniosa.',
  },
  {
    title: 'Valori educativi',
    text: 'Rispetto, disciplina e spirito di squadra come pilastri del percorso sportivo.',
  },
];

const COACHES = [
  { name: 'Attilio De Sena', role: 'Responsabile e allenatore' },
  { name: 'Agostino Esposito', role: 'Allenatore' },
  { name: 'Paolino Franzese', role: 'Allenatore' },
  { name: 'Davide Esposito', role: 'Allenatore' },
  { name: 'Giacomo Mascolo', role: 'Allenatore' },
  { name: 'Lorenzo Cassese', role: 'Allenatore' },
];

const SettoreGiovanile: React.FC = () => (
  <>
    <PageHead {...seoFor('/settore-giovanile')} />

    <div className="pg">
      <ArenaPageHero
        shot="minibasket"
        floorTitle="Minibasket"
        kicker="Settore giovanile · 5–11 anni"
        title="Minibasket"
        lead="Il futuro del basket parte da qui: giochiamo, impariamo e cresciamo insieme, a canestro basso."
        image="/images/contact-hero.jpg"
        miniHoop={[-6.5, 0, -4.2]}
        actions={
          <>
            <Link to="/contatti" className="hy-btn hy-btn--primary">
              Prenota una prova gratuita
            </Link>
            <a href="#gruppi" className="hy-btn hy-btn--ghost">
              I gruppi per età
            </a>
          </>
        }
      />

      <section className="pg-sec">
        <div className="pg-wrap pg-split">
          <div>
            <h2 className="hy-h2">Il nostro progetto</h2>
            <p className="pg-quote">Formiamo campioni, sul campo e nella vita.</p>
          </div>
          <div className="pg-prose">
            <p>
              Il minibasket è il cuore del futuro di Hyria Basket. Crediamo che la crescita di una società sportiva passi
              dallo sviluppo dei giovani atleti del territorio.
            </p>
            <p>
              Il nostro programma accompagna bambini e ragazzi in un percorso di crescita sportiva e personale, dal
              minibasket fino alle soglie della prima squadra.
            </p>
            <p>
              Ogni gruppo ha obiettivi e programmi adatti all'età, ma tutti condividono la stessa filosofia: insegnare il
              basket come scuola di vita.
            </p>
            <Link to="/minibasket-nola" className="hy-link">
              Orari, palestra e prova gratuita
            </Link>
          </div>
        </div>
      </section>

      <section id="gruppi" className="pg-sec pg-sec--deep">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Un gruppo per ogni età</h2>
            <p>
              Il minibasket accoglie bambini dai 5 agli 11 anni, con <strong>2 allenamenti a settimana</strong>. Si
              impara giocando: coordinazione, capacità motorie e spirito di squadra.
            </p>
          </header>
          <ol className="sg-ladder">
            {GROUPS.map((g) => (
              <li key={g.name}>
                <span className="sg-ladder-age">{g.age}</span>
                <span className="sg-ladder-name">{g.name}</span>
              </li>
            ))}
          </ol>
          <div className="hy-actions">
            <Link to="/contatti" className="hy-btn hy-btn--primary">
              Informazioni e iscrizioni
            </Link>
          </div>
        </div>
      </section>

      <section className="pg-sec">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Il nostro metodo</h2>
          </header>
          <ul className="pg-rules">
            {METHOD.map((m) => (
              <li key={m.title}>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pg-sec pg-sec--deep">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Lo staff tecnico</h2>
            <p>Gli allenatori che seguono i nostri bambini in palestra, ogni settimana.</p>
          </header>
          <PeopleList people={COACHES} />
        </div>
      </section>

      <section className="pg-sec">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Domande frequenti</h2>
          </header>
          <FaqList faqs={PARENT_FAQS} />
        </div>
      </section>

      <section className="pg-sec pg-sec--maroon">
        <div className="pg-wrap pg-cta">
          <h2 className="hy-h2">Porta tuo figlio a giocare con noi</h2>
          <p>Tre allenamenti di prova gratuiti, senza impegno.</p>
          <div className="hy-actions">
            <Link to="/contatti" className="hy-btn hy-btn--light">
              Prenota una prova gratuita
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default SettoreGiovanile;
