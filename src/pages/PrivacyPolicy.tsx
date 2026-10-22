import PageHead from '../components/PageHead';
import { seoFor } from '../seo/routes';
import '../styles/legal.css';

const UPDATED = '12 ottobre 2026';

const PrivacyPolicy = () => (
  <>
    <PageHead {...seoFor('/privacy-policy')} />
    <div className="pg">
    <article className="legal">
      <header className="legal__head">
        <h1>Privacy Policy</h1>
        <p>Ultimo aggiornamento: {UPDATED}</p>
      </header>

      <section>
        <h2>Chi tratta i tuoi dati</h2>
        <p>
          Il titolare del trattamento è <strong>ASD Hyria Basket</strong>, Via Madonna delle Grazie 61, 80035 Nola (NA). Per qualsiasi domanda sui
          tuoi dati scrivi a <a href="mailto:info@hyriabasket.it">info@hyriabasket.it</a>.
        </p>
      </section>

      <section>
        <h2>Modulo contatti</h2>
        <dl>
          <dt>Dati</dt>
          <dd>Nome, email, telefono (facoltativo), motivo del contatto e messaggio.</dd>
          <dt>Perché</dt>
          <dd>Per rispondere alla tua richiesta. La base giuridica è la tua richiesta stessa (art. 6.1.b GDPR).</dd>
          <dt>Per quanto</dt>
          <dd>Il tempo necessario a gestire la richiesta e gli eventuali seguiti, come un'iscrizione.</dd>
        </dl>
      </section>

      <section>
        <h2>Schedina virtuale</h2>
        <p>
          La Schedina è un gioco amatoriale tra tifosi: gli Hyria Coin sono virtuali, non si acquistano e non hanno valore
          in denaro.
        </p>
        <dl>
          <dt>Dati</dt>
          <dd>
            Email, nickname e pronostici giocati. Per limitare gli abusi conserviamo per un'ora un'impronta cifrata (hash) dell'indirizzo IP, mai
            l'indirizzo in chiaro.
          </dd>
          <dt>Perché</dt>
          <dd>
            Per inviarti dopo ogni partita l'esito delle tue schedine e gli Hyria Coin vinti, e per la classifica, dove compare solo il nickname.
            L'email non viene mostrata a nessuno e non è usata per newsletter o pubblicità. La base giuridica è l'erogazione del gioco che hai
            richiesto (art. 6.1.b GDPR); il limite anti-abuso si basa sul legittimo interesse a proteggere il servizio (art. 6.1.f).
          </dd>
          <dt>Per quanto</dt>
          <dd>Fino al termine della stagione sportiva in corso, o fino a quando chiedi la cancellazione.</dd>
          <dt>Sul tuo dispositivo</dt>
          <dd>
            Nickname, email e l'elenco delle schedine giocate restano salvati nel tuo browser (localStorage) per non doverli riscrivere. Puoi
            cancellarli in qualsiasi momento svuotando i dati del sito.
          </dd>
        </dl>
      </section>

      <section>
        <h2>Statistiche di navigazione</h2>
        <p>
          Il sito usa Google Firebase Analytics per misurare in forma aggregata le visite. Per i dettagli sui cookie consulta la{' '}
          <a href="/cookie-policy">Cookie Policy</a>.
        </p>
      </section>

      <section>
        <h2>Fornitori</h2>
        <p>Per far funzionare il sito ci appoggiamo a fornitori che trattano i dati per nostro conto, solo per le finalità descritte sopra:</p>
        <ul>
          <li>Vercel: hosting del sito e del servizio di invio email;</li>
          <li>Supabase: database della Schedina, su server nell'Unione Europea;</li>
          <li>SendPulse: invio delle email;</li>
          <li>Google (Firebase): statistiche di navigazione.</li>
        </ul>
        <p>
          Alcuni di questi fornitori possono trattare dati anche fuori dall'Unione Europea; in quel caso il trasferimento avviene con le garanzie
          previste dal GDPR, come le clausole contrattuali standard della Commissione Europea o il Data Privacy Framework UE-USA.
        </p>
      </section>

      <section>
        <h2>I tuoi diritti</h2>
        <p>
          Puoi chiedere in qualsiasi momento di accedere ai tuoi dati, correggerli, cancellarli, limitarne il trattamento o opporti, oltre alla
          portabilità (artt. 15–22 GDPR). Basta una email a <a href="mailto:info@hyriabasket.it">info@hyriabasket.it</a>: per la Schedina indica
          l'indirizzo con cui hai giocato. Se ritieni che i tuoi dati siano trattati in modo non corretto puoi presentare reclamo al{' '}
          <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
            Garante per la protezione dei dati personali
          </a>
          .
        </p>
      </section>
    </article>
    </div>
  </>
);

export default PrivacyPolicy;
