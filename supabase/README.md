# Schedina Hyria · Supabase

Database della pagina `/schedina`: palinsesto, schedine, esiti via email e classifica Hyria Coin.

**Modello:** niente account, niente login, niente saldo. Chi gioca inserisce nickname ed email sulla schedina e sceglie una puntata virtuale (10, 25, 50 o 100 HC). Dopo il referto riceve per email l'esito e gli HC vinti. Gli HC si sommano per email e formano la classifica, dove compare solo il nickname.

**Dati personali:** salviamo solo l'email, usata per mandare gli esiti, con l'indirizzo normalizzato in minuscolo. L'IP non viene salvato in chiaro: ne resta un hash per un'ora, come limite anti-abuso. Va aggiornata la Privacy Policy del sito (vedi in fondo).

**Sicurezza:**
- Dalle API pubbliche si legge solo il palinsesto.
- Le schedine contengono le email e non sono leggibili. Il sito passa da tre funzioni (`piazza_schedina`, `le_mie_schedine`, `classifica`) che non restituiscono mai un'email.
- Le email partono dal database con `pg_net`, non dal browser.

---

## Configurazione (una volta)

1. **Crea il progetto** su [supabase.com](https://supabase.com). Scegli una region europea, ad esempio Frankfurt.
2. **SQL Editor → New query**: incolla tutto [schema.sql](schema.sql) e premi *Run*. Lo script attiva anche l'estensione `pg_net`, che serve per spedire le email.
3. **Project Settings → API Keys**: copia *Project URL* e la chiave pubblica (*publishable* o *anon*) nelle variabili `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY`. Vanno bene anche i nomi `NEXT_PUBLIC_…` creati dall'integrazione Supabase di Vercel. Nel sito entrano solo queste due: se per errore ci finisce una chiave segreta, la build si ferma.
   - in locale: copia `.env.example` in `.env.local` e compila i valori;
   - su Vercel: *Settings → Environment Variables*, stessi nomi, poi rifai il deploy.
   - **Non usare mai la chiave `service_role` nel sito.**
4. **Ping anti-pausa**: non serve configurare niente. Un Vercel Cron (`crons` in [vercel.json](../vercel.json)) chiama ogni giorno [api/keepalive.js](../api/keepalive.js), che interroga il database con le stesse variabili del punto 3. Senza traffico per 7 giorni, i progetti Free vanno in pausa. Dopo il deploy lo trovi in Vercel, *Settings → Cron Jobs*, dove puoi anche lanciarlo a mano.

### Email

Le email usano lo stesso endpoint del form contatti, già scritto in `private.config`:

| chiave | valore iniziale |
|---|---|
| `email_endpoint` | `https://send-email-nine-pi.vercel.app/api/send-email` |
| `email_from` | `info@hyriabasket.it` |
| `email_header_nome` / `email_header_valore` | vuoti: header segreto facoltativo |

> ⚠️ **Da fare:** oggi quell'endpoint riceve `to`, `from` e il testo direttamente dal browser (vedi `src/components/ContactForm.tsx`). Se non controlla niente, chiunque può usarlo per spedire email a nome di `info@hyriabasket.it`. Conviene fargli richiedere un header segreto e impostarlo qui:
>
> ```sql
> update private.config set valore = 'x-api-key' where chiave = 'email_header_nome';
> update private.config set valore = '<segreto>' where chiave = 'email_header_valore';
> ```
>
> Il form contatti andrebbe poi spostato su una funzione server, perché un segreto messo nel browser non è più un segreto.

---

## Gestione partita (staff)

Tutti i comandi vanno nel **SQL Editor** di Supabase.

### 1. Pubblica il palinsesto

```bash
node scripts/palinsesto.ts --avversario "Basket Pomigliano" --data "2026-10-25 18:30" --luogo "PalaNola"
# opzioni: --trasferta · --escludi 21-cassese,9-spiezia (infortunati) · --apri
```

Lo script crea `supabase/palinsesti/<data>-<avversario>.sql`: incollalo ed eseguilo. La partita nasce in **bozza**, quindi è invisibile. Controlla le quote e poi aprila:

```sql
update public.partite set stato = 'aperta' where id = 1;
```

Le giocate si chiudono da sole all'orario di `data_ora`.

### 2. Ritocchi durante la settimana

```sql
-- cambiare una quota (chi ha già la vecchia in schedina viene avvisato e la schedina si aggiorna)
update public.esiti set quota = 1.95 where id = 123;

-- sospendere i mercati di un giocatore in dubbio
update public.mercati set stato = 'sospeso' where partita_id = 1 and giocatore_id = '21-cassese';
```

Le giocate già piazzate mantengono la quota del momento.

### 3. Dopo la partita: tabellino, referto, email

Inserisci una riga per ogni giocatore **che è sceso in campo**. I mercati di chi non ha giocato vengono annullati e valgono 1.00.

```sql
insert into public.statistiche (partita_id, giocatore_id, punti, assist, rimbalzi, triple, falli, tecnici, clutch) values
  (1, '3-ascione',  14, 4, 3, 2, 2, 0, true),
  (1, '21-cassese',  9, 1, 6, 1, 5, 1, false);
  -- falli: 5 = foul out · tecnici: numero di falli tecnici · clutch: ha segnato negli ultimi 2 minuti

select private.referta_partita(1);  -- chiude le schedine e calcola gli HC vinti
select private.invia_esiti(1);      -- una email per indirizzo con esito e totale stagione
```

`invia_esiti` si può rilanciare senza problemi: chi ha già ricevuto l'email per quella partita non la riceve di nuovo.

Per controllare che le email siano partite davvero:

```sql
select id, status_code, content, created from net._http_response order by created desc limit 20;
```

### Altri comandi

```sql
select private.annulla_partita(1);                     -- partita rinviata: annulla tutti i mercati
select private.cancella_email('nome@email.it');        -- richiesta di cancellazione: le schedine restano anonime
```

---

## Regole fisse

Sono uguali nel sito e nel database:

- puntate da 10, 25, 50 o 100 HC (virtuali: non si scalano da nessun saldo);
- massimo 15 eventi per schedina;
- vincita massima 100000 HC;
- bonus +5% con 3 eventi, +10% con 5, +20% con 7;
- anti-abuso: massimo 10 schedine al giorno per email e 30 l'ora per rete.

## Note

- `giocatore_id` è l'id del roster in [src/locker/roster.ts](../src/locker/roster.ts) (`<numero>-<cognome>`). Se cambi numero o cognome a un giocatore, cambia anche l'id: le partite già pubblicate con il vecchio id non lo mostrano più.
- Lo storico "Le tue schedine" vive nel browser: ogni schedina ha un token segreto salvato in `localStorage`. Se l'utente cancella i dati di navigazione, perde la lista sul sito, ma i suoi HC restano legati all'email e l'esito gli arriva comunque.
- **Privacy Policy:** aggiungere che per la Schedina raccogliamo l'email solo per inviare esiti e HC vinti, per tutta la stagione sportiva, senza usi di marketing, e che si può chiedere la cancellazione scrivendo a info@hyriabasket.it.
