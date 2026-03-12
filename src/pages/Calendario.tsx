import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PageHead from '../components/PageHead';
import PageHero from '../components/PageHero';
import { fadeInUp } from '../utils/animations';

const Calendario = () => {
  const [classifica, setClassifica] = useState<any[]>([]);
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
      <PageHead title="Classifica – Hyria Basket" description="..." />

      <div className="home-container">
        <PageHero 
          backgroundImage="/images/basketball-hero.jpg" 
          normalText="" 
          coloredText="CLASSIFICA" 
          subtitle="Stagione 2025/2026 · Aggiornato in tempo reale" 
        />

        {/* CLASSIFICA - Versione Semplificata e Centrata */}
<section className="section-padding" style={{ background: 'var(--color-dark)' }}>
  <div className="container mx-auto px-4">
    <motion.h2 className="section-title text-white text-center">CLASSIFICA</motion.h2>
    <div className="section-divider" style={{ margin: '0.75rem auto 2.5rem' }} />

    <div style={{ display: 'flex', justifyContent: 'center' }}>
    <motion.div 
      variants={fadeInUp} 
      className="w-full overflow-hidden rounded-lg border border-white/10"
      style={{ maxWidth: '672px' }}
    >
      <table className="w-full text-sm sm:text-base" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(217,108,0,0.2)', borderBottom: '2px solid #d96c00' }}>
            <th className="px-4 py-4 text-left font-bold tracking-widest" style={{ color: '#d96c00', width: '15%' }}>#</th>
            <th className="px-4 py-4 text-left font-bold tracking-widest" style={{ color: '#d96c00', width: '70%' }}>SQUADRA</th>
            <th className="px-4 py-4 text-center font-bold tracking-widest" style={{ color: '#d96c00', width: '15%' }}>PT</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={3} className="text-center py-10 text-white opacity-50">Caricamento dati...</td></tr>
          ) : (
            classifica.map((row, i) => {
              // Row[1] è il nome squadra, Row[7] sono i punti nel CSV originale
              const isHyria = row.team?.toUpperCase().includes('HYRIA');
              
              return (
                <tr 
                  key={i} 
                  style={{ 
                    background: isHyria ? 'rgba(217,108,0,0.15)' : 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.05)' 
                  }}
                >
                  <td className="px-4 py-3 font-mono" style={{ color: isHyria ? '#d96c00' : '#888' }}>
                    {row.pos}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white uppercase tracking-tight">
                    {row.team}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-white">
                    {row.points}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </motion.div>
    </div>
  </div>
</section>

        {/* 
        <section className="section-padding" style={{ background: 'var(--color-primary)' }}>
          <div className="container">
            <h2 className="section-title text-white text-center">RISULTATI</h2>
            <div className="section-divider" style={{ margin: '0.75rem auto 2.5rem' }} />
            <div className="space-y-3">
              {risultati.length === 0 ? (
                <p className="text-center text-white/50">Nessun risultato ancora disponibile</p>
              ) : (
                risultati.map((m, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
                    <div className="text-xs font-mono opacity-60">{m[0]}</div>
                    <div className="flex items-center gap-4 flex-1 justify-center">
                      <span className={`font-bold w-32 text-right ${m[1].includes('Hyria') ? 'text-orange-500' : ''}`}>{m[1]}</span>
                      <div className="bg-orange-600 px-4 py-1 rounded font-black text-xl">{m[2]}</div>
                      <span className={`font-bold w-32 text-left ${m[3]?.includes('Hyria') ? 'text-orange-500' : ''}`}>{m[3]}</span>
                    </div>
                    <div className="text-[10px] font-bold tracking-widest bg-green-500/20 text-green-400 px-2 py-1 rounded">FINALE</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="section-padding" style={{ background: 'var(--color-dark)' }}>
          <div className="container">
            <h2 className="section-title text-white text-center">PROSSIME SFIDE</h2>
            <div className="section-divider" style={{ margin: '0.75rem auto 2.5rem' }} />
            <div className="space-y-4">
              {prossimiMatch.map((m, i) => (
                <div key={i} className="p-6 rounded-lg bg-orange-900/10 border border-orange-600/20 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
                  <div className="text-orange-500 font-bold">{m[0]}</div>
                  <div className="flex items-center gap-6">
                    <span className={`text-lg font-black uppercase ${m[1].includes('Hyria') ? 'text-orange-500' : ''}`}>{m[1]}</span>
                    <span className="text-xs font-black bg-white/10 px-3 py-1 rounded">VS</span>
                    <span className={`text-lg font-black uppercase ${m[3]?.includes('Hyria') ? 'text-orange-500' : ''}`}>{m[3]}</span>
                  </div>
                  <div className="text-[10px] font-bold border border-orange-600 px-3 py-1 rounded text-orange-600">IN PROGRAMMA</div>
                </div>
              ))}
            </div>
          </div>
        </section> */ }
      </div>
    </>
  );
};

export default Calendario;