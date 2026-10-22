import React from 'react';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import { seoFor } from '../seo/routes';
import ArenaPageHero from '../components/ArenaPageHero';
import PeopleList from '../components/PeopleList';

const ABOUT_VALUES = [
  {
    title: 'Passione',
    text: "L'amore per il basket è il motore di tutto ciò che facciamo, dalla prima squadra al minibasket.",
  },
  {
    title: 'Comunità',
    text: 'Crediamo nel valore di una comunità unita attorno al nostro progetto sportivo, dentro e fuori dal campo.',
  },
  {
    title: 'Crescita',
    text: 'Investiamo nello sviluppo tecnico e umano di ogni atleta, a qualsiasi livello.',
  },
];

const STAFF = [
  { name: 'Attilio De Sena', role: 'Presidente' },
  { name: 'Paolino Franzese', role: 'Vicepresidente' },
  { name: 'Lorenzo Cassese', role: 'Socio fondatore' },
  { name: 'Giovanni Sangermano', role: 'Socio fondatore' },
  { name: 'Davide Esposito', role: 'Socio fondatore' },
  { name: 'Agostino Esposito', role: 'Socio fondatore' },
  { name: 'Giacomo Mascolo', role: 'Socio fondatore' },
];

const About: React.FC = () => (
  <>
    <PageHead {...seoFor('/chi-siamo')} />

    <div className="pg">
      <ArenaPageHero
        shot="about"
        floorTitle="Chi siamo"
        kicker="Nola, dal 2025"
        title="Chi siamo"
        lead="Un club giovane, nato a Nola da imprenditori appassionati di basket e del proprio territorio."
        image="/images/contact-hero.jpg"
        actions={
          <>
            <a href="#storia" className="hy-btn hy-btn--primary">
              La nostra storia
            </a>
            <Link to="/spogliatoio" className="hy-btn hy-btn--ghost">
              Il roster
            </Link>
          </>
        }
      />

      <section id="storia" className="pg-sec">
        <div className="pg-wrap pg-split">
          <div>
            <h2 className="hy-h2">La nostra storia</h2>
            <p className="pg-quote">Radici antiche, visione moderna.</p>
          </div>
          <div className="pg-prose">
            <p>
              Hyria Basket nasce nel 2025 dal progetto di un gruppo di giovani imprenditori appassionati di basket e del
              proprio territorio, con una visione chiara: creare una società sportiva moderna che unisca la tradizione
              del basket alla tecnologia e all'innovazione.
            </p>
            <p>
              Il nome "Hyria" richiama l'antica città che sorgeva nell'area nolana, simbolo di tradizione e radici
              territoriali, mentre lo sguardo è rivolto al futuro del basket moderno.
            </p>
            <p>
              In poco tempo abbiamo costruito un progetto solido che comprende prima squadra, minibasket e numerose
              iniziative sul territorio, diventando un punto di riferimento per la pallacanestro della nostra zona.
            </p>
            {/*<Link to="/storia" className="hy-link">
              Sfoglia l'archivio storico
            </Link>  */}
          </div>
        </div>
      </section>

      <section className="pg-sec pg-sec--deep">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">I nostri valori</h2>
            <p>Tre idee guidano ogni scelta del club, dalla prima squadra ai più piccoli.</p>
          </header>
          <ul className="pg-rules">
            {ABOUT_VALUES.map((v) => (
              <li key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pg-sec">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Le persone del club</h2>
            <p>La forza di Hyria Basket sta nelle persone che ogni giorno portano avanti il progetto.</p>
          </header>
          <PeopleList people={STAFF} />
        </div>
      </section>

      <section className="pg-sec pg-sec--maroon">
        <div className="pg-wrap pg-cta">
          <h2 className="hy-h2">Entra a far parte della nostra famiglia</h2>
          <p>Come giocatore, partner o tifoso: c'è un posto per te in Hyria Basket.</p>
          <div className="hy-actions">
            <Link to="/contatti" className="hy-btn hy-btn--light">
              Contattaci
            </Link>
            <Link to="/settore-giovanile" className="hy-btn hy-btn--ghost">
              Scopri il minibasket
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default About;
