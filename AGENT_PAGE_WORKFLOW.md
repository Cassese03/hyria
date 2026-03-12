# Hyria – Workflow Unificato per Modifiche Pagina (Design + Performance)

Questo documento è il riferimento unico da dare all’agente quando vuoi modificare una pagina del progetto in modo coerente, misurabile e senza regressioni.

---

## 1) Obiettivo

Applicare su qualsiasi pagina la stessa logica usata su Home:

1. Raccolta contesto
2. Baseline misurabile
3. Interventi mirati (non casuali)
4. Verifica post-fix
5. Report finale con delta prima/dopo

---

## 2) Regole obbligatorie

### Scope e precisione
- Modificare solo la pagina richiesta + file strettamente correlati.
- Non introdurre feature extra non richieste.
- Non cambiare naming/struttura senza necessità.

### Design system Hyria
- Usare solo palette/tokens/font esistenti (`hyria-primary`, `hyria-secondary`, `hyria-dark`, `hyria-light`, Montserrat/Arvo).
- Niente colori hardcoded fuori brand, salvo eccezioni motivate.
- Dark-mode only coerente con il progetto.

### Performance by default
- Misurare sempre prima e dopo.
- Ottimizzare i colli di bottiglia più impattanti prima dei micro-fix.
- Evitare ottimizzazioni premature.

### Sicurezza regressioni
- Build finale obbligatoria.
- Nessun errore TypeScript/lint introdotto.
- Se un fix impatta altre pagine, dichiararlo e ridurre il blast radius.

---

## 3) Procedura standard (sempre uguale)

## Fase A — Context Gathering
- Leggere la pagina target e i CSS/utility correlati.
- Identificare: audience, obiettivo pagina, componenti critici, vincoli brand.
- Se mancano informazioni chiave, chiedere chiarimento prima di modificare.

## Fase B — Baseline (prima)
- Eseguire build produzione e annotare output bundle.
- Identificare asset pesanti (immagini/video) usati dalla pagina.
- Annotare criticità iniziali:
  - LCP probabile (hero media)
  - CLS (media senza dimensioni/aspect-ratio)
  - INP/TBT (JS iniziale eccessivo, animazioni pesanti)

## Fase C — Interventi
Applicare solo interventi con impatto reale, in ordine:

1. **Network/Asset**
   - `loading="lazy"` sotto la fold
   - `width`/`height` su immagini/video
   - `srcset`/`sizes` quando sensato
   - video non critici: lazy con `IntersectionObserver`

2. **Bundle/JS**
   - code splitting route/component (`lazy` + `Suspense`)
   - rimuovere logica ridondante e re-render inutili

3. **Rendering**
   - `content-visibility: auto` su sezioni sotto la fold
   - `contain` dove utile
   - animare solo `transform`/`opacity`

4. **UX/Design consistency**
   - mantenere gerarchia tipografica, spaziature e tono visivo Hyria
   - evitare pattern AI generici

## Fase D — Verifica (dopo)
- Rieseguire build.
- Confrontare prima/dopo (dimensione JS/CSS, chunk, tempi build indicativi).
- Controllare assenza errori su file toccati.

## Fase E — Report finale
Il report deve includere sempre:
- Cosa è stato cambiato
- Dove (file)
- Delta misurabile prima/dopo
- Rischi/nota tecnica
- Prossimo step consigliato

---

## 4) Checklist operativa rapida

- [ ] Ho letto pagina + stili correlati
- [ ] Ho una baseline prima delle modifiche
- [ ] Ho toccato solo i file necessari
- [ ] Ho applicato ottimizzazioni ad alto impatto
- [ ] Ho verificato TypeScript/errori
- [ ] Ho rieseguito build
- [ ] Ho riportato il delta prima/dopo

---

## 5) Template prompt (comando da usare)

Quando vuoi applicare questo workflow a una pagina, incolla questo prompt:

```text
Segui le istruzioni in AGENT_PAGE_WORKFLOW.md.
Task: ottimizza e rifinisci la pagina [INSERISCI_PAGINA].
Vincoli:
- modifica solo file necessari
- mantieni design system Hyria
- misura prima/dopo e riporta delta
- build finale obbligatoria
Output richiesto:
- elenco modifiche
- file toccati
- metriche prima/dopo
- prossimi step
```

Esempio pratico:

```text
Segui le istruzioni in AGENT_PAGE_WORKFLOW.md.
Task: ottimizza e rifinisci la pagina src/pages/Team.tsx.
Vincoli:
- modifica solo file necessari
- mantieni design system Hyria
- misura prima/dopo e riporta delta
- build finale obbligatoria
Output richiesto:
- elenco modifiche
- file toccati
- metriche prima/dopo
- prossimi step
```

---

## 6) Comandi consigliati (quando richiesti)

- Baseline/build:
  - `npm run build`
- Error check file modificati (via strumenti IDE/agente)
- Analisi asset pesanti:
  - PowerShell su `public/images` ordinato per dimensione

Nota: Lighthouse/Web Vitals reali vanno eseguiti in browser su device/rete realistici quando serve audit approfondito.

---

## 7) Definition of Done (DoD)

Un task su pagina è “done” solo se:

1. Build produzione OK
2. Nessun errore introdotto
3. Delta misurabile documentato
4. Coerenza visiva con Hyria preservata
5. Nessuna regressione evidente su layout/responsive
