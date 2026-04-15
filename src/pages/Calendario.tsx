import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PageHead from '../components/PageHead';
import { heroContainer, heroItem, scaleReveal, revealTransition } from '../utils/animations';

interface ClassificaRow {
  pos: string;
  team: string;
  played: string;
  wins: string;
  losses: string;
  scored: string;
  against: string;
  points: string;
}

const Calendario = () => {
  const [classifica, setClassifica] = useState<ClassificaRow[]>([]);
  //const [risultati, setRisultati] = useState<any[]>([]);
  //const [prossimiMatch, setProssimiMatch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // LINK AGGIORNATI
  const classificaUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-yoKJ6mZg-97DM9iw6Ig4zZd5-PyR1uqlySH2q9uUAcdJbjavJ_d4nWK2Lx9wojFcV8uFoPyTU1bQ/pub?gid=0&single=true&output=csv';
  //const calendarioUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-yoKJ6mZg-97DM9iw6Ig4zZd5-PyR1uqlySH2q9uUAcdJbjavJ_d4nWK2Lx9wojFcV8uFoPyTU1bQ/pub?gid=67573488&single=true&output=csv';

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Classifica
      const resC = await fetch(classificaUrl);
      const csvC = await resC.text();
      const righeC = csvC.split('\n').map(r => r.split(','));
      const puliteC = righeC.filter(r => r.length > 1).map(r => r.map(c => c.replace(/^"|"$/g, '').trim()));
      
      if (puliteC.length > 1) {
        // Mappatura dinamica: cerchiamo di capire quali colonne usare
        const data = puliteC.slice(1).map(row => ({
          pos: row[0],
          team: row[1],
          played: row[2],
          wins: row[3],
          losses: row[4],
          scored: row[5],
          against: row[6],
          points: row[2]
        }));
        setClassifica(data);
      }

      // 2. Fetch Calendario
/*     const resCal = await fetch(calendarioUrl);
      const csvCal = await resCal.text();
      // Usiamo una regex per lo split per gestire meglio virgole dentro le virgolette
      const righeCal = csvCal.split('\n').map(r => r.split(','));
      
      const soloHyria = righeCal.filter(riga => 
        riga.some(cella => cella.toUpperCase().includes('HYRIA'))
      ).map(riga => riga.map(cella => cella.replace(/^"|"$/g, '').trim()));

      // LOGICA DI SEPARAZIONE RISULTATI / PROSSIMI
      const fatti: any[] = [];
      const daFare: any[] = [];

      soloHyria.forEach(m => {
        // Playbasket solitamente mette il punteggio nella colonna 2 (indice 2) o 3
        // Se troviamo un trattino "-" e dei numeri, è un risultato
        const colonnaPunteggio = m[2] || "";
        const haPunteggio = colonnaPunteggio.includes('-') && /\d/.test(colonnaPunteggio);

        if (haPunteggio) {
          fatti.push(m);
        } else {
          daFare.push(m);
        }
      });

      setRisultati(fatti);
      setProssimiMatch(daFare);
      */

    } catch (error) {
      console.error('Errore caricamento dati:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <PageHead
        title="Classifica | Hyria Basket – Stagione 2025/26"
        description="Classifica aggiornata in tempo reale della stagione 2025/26 di Hyria Basket Nola."
        keywords="classifica, calendario, risultati, Hyria Basket, Nola, basket"
        ogTitle="Classifica – Hyria Basket"
        ogDescription="Segui la classifica aggiornata di Hyria Basket nella stagione 2025/26."
        ogUrl="https://hyriabasket.it/classifica"
        canonicalUrl="https://hyriabasket.it/classifica"
      />

      <div className="calendario-page calendario-bolder">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="hero-section calendario-hero">
          <div className="hero-background">
            <img
              src="/images/basketball-hero.jpg"
              alt="Hyria Basket in campo"
              className="hero-bg-image"
              width={1920}
              height={1080}
              decoding="async"
              fetchPriority="high"
            />
            <div className="hero-overlay" />
          </div>
          <div className="hero-content">
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="visible"
              className="hero-text-container"
            >
              <motion.p variants={heroItem} className="hero-kicker">
                STAGIONE 2025/26 · SERIE DR2
              </motion.p>
              <motion.h1 variants={heroItem} className="hero-title">
                CLASSI<span className="hero-accent">FICA</span>
              </motion.h1>
            </motion.div>
          </div>
        </section>

        {/* ── Classifica ───────────────────────────────────────── */}
        <section className="about-section section-padding">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
            >
              CLASSIFICA GENERALE
            </motion.h2>
            <motion.div
              className="section-divider"
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ transformOrigin: 'left center' }}
            />
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.12 }}
            >
              Aggiornamento automatico dalla piattaforma ufficiale
            </motion.p>

            <div className="classifica-live-badge">
              <span className="classifica-live-dot" />
              Dati in tempo reale
            </div>

            <motion.div
              className="classifica-table-wrap"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ ...revealTransition, delay: 0.18 }}
            >
              <table className="classifica-table">
                <thead>
                  <tr>
                    <th className="classifica-th classifica-th--pos">#</th>
                    <th className="classifica-th classifica-th--team">Squadra</th>
                    <th className="classifica-th classifica-th--pts">PT</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="classifica-loading">
                        Caricamento in corso…
                      </td>
                    </tr>
                  ) : (
                    classifica.map((row, i) => {
                      const isHyria = row.team?.toUpperCase().includes('HYRIA');
                      return (
                        <tr
                          key={i}
                          className={`classifica-row${isHyria ? ' classifica-row--hyria' : ''}`}
                        >
                          <td className="classifica-td classifica-td--pos">
                            <span className="classifica-pos">{row.pos}</span>
                          </td>
                          <td className="classifica-td classifica-td--team">
                            {isHyria && (
                              <span className="classifica-hyria-badge">NOI</span>
                            )}
                            <span className="classifica-team-name">{row.team}</span>
                          </td>
                          <td className="classifica-td classifica-td--pts">
                            <span className="classifica-pts">{row.points}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Calendario;