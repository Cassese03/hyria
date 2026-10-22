import React from 'react';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import { seoFor } from '../seo/routes';
import ArenaPageHero from '../components/ArenaPageHero';
import { BOARD_SPONSORS, SPONSOR_BENEFITS, SPONSOR_PACKAGES, SPONSOR_TIERS, type SponsorEntry } from '../data/sponsors';
import '../styles/sponsor.css';

const SponsorLogo: React.FC<{ sponsor: SponsorEntry }> = ({ sponsor }) => {
  const content = (
    <>
      <span className="sp-logo-plate">
        <img src={sponsor.image} alt={sponsor.name} loading="lazy" decoding="async" />
      </span>
      <span className="sp-logo-name">{sponsor.name}</span>
    </>
  );
  return sponsor.website ? (
    <a className="sp-logo" href={sponsor.website} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <div className="sp-logo">{content}</div>
  );
};

const Sponsor: React.FC = () => (
  <>
    <PageHead {...seoFor('/sponsor')} />

    <div className="pg sp">
      <ArenaPageHero
        shot="sponsor"
        floorTitle="I nostri sponsor"
        kicker="Partnership"
        title="I nostri sponsor"
        lead="Le aziende che portano Hyria in campo, partita dopo partita. I loro marchi corrono sui cartelloni a bordo campo."
        image="/images/contact-hero.jpg"
        boards={BOARD_SPONSORS}
        actions={
          <>
            <a href="#pacchetti" className="hy-btn hy-btn--primary">
              Diventa partner
            </a>
            <a href="#sostenitori" className="hy-btn hy-btn--ghost">
              Chi ci sostiene
            </a>
          </>
        }
      />

      {/* Perché una partnership */}
      <section className="pg-sec">
        <div className="pg-wrap pg-split">
          <div>
            <h2 className="hy-h2">Più che finanziatori</h2>
            <p className="pg-quote">Gli sponsor sono parte integrante del nostro progetto.</p>
          </div>
          <div className="pg-prose">
            <p>
              Hyria Basket crede nel valore delle partnership strategiche. I nostri sponsor sono molto più che
              semplici finanziatori: crescono con noi, partita dopo partita.
            </p>
            <p>
              Ogni partnership crea valore per entrambi. Le aziende ottengono visibilità, un legame con la comunità e
              occasioni di networking; noi possiamo contare sulle risorse per portare avanti la nostra missione
              sportiva ed educativa.
            </p>
            <p>
              Grazie agli sponsor investiamo nei giovani talenti, miglioriamo le strutture e offriamo un'esperienza di
              qualità a tutti i nostri atleti, dai più piccoli alla prima squadra.
            </p>
          </div>
        </div>
      </section>

      {/* Sponsor attuali */}
      <section id="sostenitori" className="pg-sec pg-sec--deep">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Chi ci sostiene</h2>
            <p>Li trovi sui cartelloni a bordo campo in tutte le partite casalinghe.</p>
          </header>
          {SPONSOR_TIERS.map((tier) => (
            <div key={tier.id} className={`sp-tier sp-tier--${tier.id}`}>
              <h3 className="sp-tier-name">{tier.label}</h3>
              <ul className="sp-logos">
                {tier.sponsors.map((s) => (
                  <li key={s.name}>
                    <SponsorLogo sponsor={s} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Pacchetti */}
      <section id="pacchetti" className="pg-sec">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Opportunità di sponsorizzazione</h2>
            <p>Quattro livelli di visibilità. Ogni pacchetto comprende tutto quello del livello precedente.</p>
          </header>
          <ol className="sp-packages">
            {SPONSOR_PACKAGES.map((pkg) => (
              <li key={pkg.name} className={`sp-package ${pkg.name === 'Title' ? 'is-top' : ''}`}>
                <h3 className="sp-package-name">{pkg.name}</h3>
                <p className="sp-package-price">{pkg.price}</p>
                {pkg.includes && <p className="sp-package-includes">Tutto il pacchetto {pkg.includes}, più:</p>}
                <ul className="sp-package-benefits">
                  {pkg.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <Link to="/contatti" className="hy-link">
                  Contattaci
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Vantaggi */}
      <section className="pg-sec pg-sec--deep">
        <div className="pg-wrap">
          <header className="pg-head">
            <h2 className="hy-h2">Perché investire in Hyria</h2>
          </header>
          <ul className="pg-rules">
            {SPONSOR_BENEFITS.map((b) => (
              <li key={b.title}>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Chiusura */}
      <section className="pg-sec pg-sec--maroon">
        <div className="pg-wrap pg-cta">
          <h2 className="hy-h2">Porta la tua azienda a bordo campo</h2>
          <p>Raccontaci cosa cerchi: prepariamo una proposta su misura per la tua attività.</p>
          <div className="hy-actions">
            <Link to="/contatti" className="hy-btn hy-btn--light">
              Richiedi una proposta
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default Sponsor;
