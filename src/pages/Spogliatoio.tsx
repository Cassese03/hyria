import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PaintBrushIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline';
import PageHead from '../components/PageHead';
import { LockerAudio } from '../locker/audio';
import { LockerScene, type LockerMode } from '../locker/LockerScene';
import { CATEGORY_ORDER, LOCKER_ROSTER, type LockerPlayer } from '../locker/roster';
import { DEFAULT_KIT, type KitOptions } from '../locker/jerseyTexture';
import '../styles/locker.css';

const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&family=Bebas+Neue&family=Graduate&display=swap';
const MAX_UPLOAD = 8 * 1024 * 1024;

type UploadKind = 'graphic' | 'logo' | 'sponsor';

const dash = (v: string | number | null, suffix = '') => (v === null ? '—' : `${v}${suffix}`);

const statRows = (p: LockerPlayer): [string, string][] => [
  ['Club', p.club],
  ['Anno di nascita', dash(p.birthYear)],
  ['Luogo', dash(p.birthPlace)],
  ['Altezza', dash(p.heightCm, ' cm')],
];

function loadFile(file: File): Promise<{ img: HTMLImageElement; url: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Immagine non valida'));
    };
    img.src = url;
  });
}

const Spogliatoio = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<LockerScene | null>(null);
  const audioRef = useRef<LockerAudio | null>(null);
  const urlsRef = useRef<{ graphic?: string; logo?: string; sponsor?: string }>({});
  if (!audioRef.current) audioRef.current = new LockerAudio();

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<LockerMode>('overview');
  const [highlight, setHighlight] = useState(0);
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem('hyria-locker-muted') === '1';
    } catch {
      return false;
    }
  });
  const [panelOpen, setPanelOpen] = useState(false);
  const [kit, setKit] = useState<KitOptions>(DEFAULT_KIT);
  const [fileNames, setFileNames] = useState<{ graphic?: string; logo?: string; sponsor?: string }>({});
  const [uploadError, setUploadError] = useState<string | null>(null);

  const player = LOCKER_ROSTER[highlight];
  const categoryStart = useMemo(
    () => Object.fromEntries(CATEGORY_ORDER.map((c) => [c, LOCKER_ROSTER.findIndex((p) => p.category === c)])),
    [],
  );

  // font display (Bebas Neue per stampe e numeri, Arvo per i titoli)
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const container = stageRef.current;
    if (!container) return;
    let cancelled = false;
    let engine: LockerScene | null = null;

    LockerScene.create({
      container,
      roster: LOCKER_ROSTER,
      audio: audioRef.current!,
      onReady: () => !cancelled && setReady(true),
      onHighlight: (i) => !cancelled && setHighlight(i),
      onMode: (m) => !cancelled && setMode(m),
    })
      .then((s) => {
        if (cancelled) {
          s.dispose();
          return;
        }
        engine = s;
        engineRef.current = s;
        s.setLabelElement(labelRef.current);
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      engine?.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    audioRef.current?.setMuted(muted);
    try {
      localStorage.setItem('hyria-locker-muted', muted ? '1' : '0');
    } catch {
      /* storage non disponibile */
    }
  }, [muted]);

  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      Object.values(urls).forEach((u) => u && URL.revokeObjectURL(u));
      audioRef.current?.dispose();
    };
  }, []);

  // tastiera
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      const eng = engineRef.current;
      if (!eng) return;
      audioRef.current?.unlock();
      if (e.key === 'ArrowRight') eng.step(1);
      else if (e.key === 'ArrowLeft') eng.step(-1);
      else if (e.key === 'Escape') {
        if (panelOpen) setPanelOpen(false);
        else eng.closeDetail();
      } else if (e.key === 'Enter' && eng.getMode() === 'overview' && !(t instanceof HTMLButtonElement)) eng.openDetail();
      else if ((e.key === 'f' || e.key === 'F') && eng.getMode() === 'detail') eng.flip();
      else return;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panelOpen]);

  const withAudio = useCallback((fn: (eng: LockerScene) => void) => {
    audioRef.current?.unlock();
    const eng = engineRef.current;
    if (eng) fn(eng);
  }, []);

  const applyKit = useCallback((next: KitOptions) => {
    setKit(next);
    engineRef.current?.setKit(next);
  }, []);

  const onUpload = async (kind: UploadKind, file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
      setUploadError('Formato non supportato: usa PNG o JPG.');
      return;
    }
    if (file.size > MAX_UPLOAD) {
      setUploadError('File troppo pesante (max 8 MB).');
      return;
    }
    try {
      const { img, url } = await loadFile(file);
      const prev = urlsRef.current[kind];
      if (prev) URL.revokeObjectURL(prev);
      urlsRef.current[kind] = url;
      setFileNames((f) => ({ ...f, [kind]: file.name }));
      applyKit({ ...kit, [kind]: img });
    } catch {
      setUploadError('Impossibile leggere l’immagine.');
    }
  };

  const clearUpload = (kind: UploadKind) => {
    const prev = urlsRef.current[kind];
    if (prev) URL.revokeObjectURL(prev);
    urlsRef.current[kind] = undefined;
    setFileNames((f) => ({ ...f, [kind]: undefined }));
    applyKit({ ...kit, [kind]: null });
  };

  const download = () =>
    withAudio((eng) => {
      const shot = eng.screenshot();
      if (!shot) return;
      const a = document.createElement('a');
      a.href = shot.dataUrl;
      a.download = shot.filename;
      a.click();
    });

  const detail = mode === 'detail';

  return (
    <>
      <PageHead
        title="Spogliatoio 3D – Hyria Basket"
        description="Entra nello spogliatoio di Hyria Basket: sfoglia le maglie della prima squadra in 3D e scopri la scheda di ogni giocatore."
        canonicalUrl="https://hyriabasket.it/spogliatoio"
        ogUrl="https://hyriabasket.it/spogliatoio"
      />
      <div className="locker-page" data-mode={mode}>
        <div className="locker-stage" ref={stageRef} />

        {failed && (
          <div className="locker-fallback" role="alert">
            <p>Il tuo dispositivo non supporta la grafica 3D necessaria allo spogliatoio.</p>
            <a href="/team" className="locker-btn locker-btn--primary">
              VEDI IL ROSTER
            </a>
          </div>
        )}

        <div className={`locker-loader ${ready || failed ? 'is-done' : ''}`} aria-hidden={ready}>
          <span className="locker-loader__bar" />
          <p>PREPARO LO SPOGLIATOIO</p>
        </div>

        <p className="locker-sr" aria-live="polite">
          {detail ? `Scheda di ${player.firstName} ${player.lastName}, numero ${player.number}` : `Maglia evidenziata: ${player.lastName}, numero ${player.number}`}
        </p>

        {/* barra alta: categorie */}
        <div className="locker-top">
          <p className="locker-kicker">SPOGLIATOIO · 2026/27</p>
          <nav className="locker-tabs" aria-label="Categorie roster">
            {CATEGORY_ORDER.map((c) => (
              <button
                key={c}
                type="button"
                className={`locker-tab ${player.category === c ? 'is-active' : ''}`}
                aria-pressed={player.category === c}
                onClick={() => withAudio((eng) => eng.setHighlight(categoryStart[c]))}
              >
                {c}
                <span>{LOCKER_ROSTER.filter((p) => p.category === c).length}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* indicatore sotto la maglia evidenziata */}
        <div className="locker-label" ref={labelRef}>
          <span className="locker-label__num">{player.number}</span>
          <span className="locker-label__name">{player.lastName}</span>
          <span className="locker-label__role">{player.role}</span>
          <button type="button" className="locker-label__cta" onClick={() => withAudio((eng) => eng.openDetail())}>
            APRI SCHEDA
          </button>
        </div>

        {!detail && (
          <>
            <button
              type="button"
              className="locker-arrow locker-arrow--left"
              aria-label="Giocatore precedente"
              disabled={highlight === 0}
              onClick={() => withAudio((eng) => eng.step(-1))}
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              className="locker-arrow locker-arrow--right"
              aria-label="Giocatore successivo"
              disabled={highlight === LOCKER_ROSTER.length - 1}
              onClick={() => withAudio((eng) => eng.step(1))}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}

        {/* scheda giocatore */}
        <AnimatePresence mode="wait">
          {detail && (
            <motion.aside
              key="sheet"
              className="locker-sheet"
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, x: 32, transition: { duration: 0.25 } }}
              aria-label={`Scheda di ${player.firstName} ${player.lastName}`}
            >
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.35 } }}
              >
                <header className="locker-sheet__head">
                  <img src="/images/logo-hyria.png" alt="Hyria Basket" className="locker-sheet__badge" width={56} height={56} />
                  <div>
                    <p className="locker-sheet__club">HYRIA BASKET</p>
                    <p className="locker-sheet__season">SQUAD SHEET · 2026/27</p>
                  </div>
                </header>

                <div className="locker-sheet__id">
                  <div>
                    <p className="locker-sheet__role">{player.role}</p>
                    <h2 className="locker-sheet__name">
                      <span>{player.firstName}</span>
                      {player.lastName}
                    </h2>
                  </div>ascina 
                  <span className="locker-sheet__num" aria-label={`Numero ${player.number}`}>
                    {player.number}
                  </span>
                </div>

                <dl className="locker-stats">
                  {statRows(player).map(([k, v]) => (
                    <div key={k} className="locker-stats__row">
                      <dt>{k}</dt>
                      <span className="locker-stats__dots" aria-hidden="true" />
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>

              <footer className="locker-sheet__foot">
                <button type="button" className="locker-btn locker-btn--primary" onClick={() => withAudio((eng) => eng.closeDetail())}>
                  ← INDIETRO
                </button>
                <div className="locker-sheet__nav">
                  <button type="button" className="locker-icon-btn" aria-label="Giocatore precedente" disabled={highlight === 0} onClick={() => withAudio((eng) => eng.step(-1))}>
                    <ChevronLeftIcon />
                  </button>
                  <button type="button" className="locker-icon-btn" aria-label="Giocatore successivo" disabled={highlight === LOCKER_ROSTER.length - 1} onClick={() => withAudio((eng) => eng.step(1))}>
                    <ChevronRightIcon />
                  </button>
                </div>
              </footer>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* strumenti */}
        <div className="locker-tools" style={{display:'none'}}>
          {panelOpen && (
            <div className="locker-panel" role="dialog" aria-label="Personalizza maglia">
              <p className="locker-panel__title">PERSONALIZZA LA MAGLIA</p>

              <div className="locker-panel__field">
                <span>Grafica / pattern societario</span>
                <label className="locker-btn locker-btn--ghost">
                  {fileNames.graphic ? 'SOSTITUISCI' : 'CARICA PNG / JPG'}
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { void onUpload('graphic', e.target.files?.[0]); e.target.value = ''; }} />
                </label>
                {fileNames.graphic && (
                  <p className="locker-panel__file">
                    {fileNames.graphic}
                    <button type="button" onClick={() => clearUpload('graphic')}>rimuovi</button>
                  </p>
                )}
                <label className="locker-panel__range">
                  <span>Fusione {Math.round(kit.graphicBlend * 100)}%</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(kit.graphicBlend * 100)}
                    disabled={!kit.graphic}
                    onChange={(e) => applyKit({ ...kit, graphicBlend: Number(e.target.value) / 100 })}
                  />
                </label>
              </div>

              <div className="locker-panel__field">
                <span>Stemma sul petto</span>
                <label className="locker-btn locker-btn--ghost">
                  {fileNames.logo ? 'SOSTITUISCI' : 'CARICA LOGO'}
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { void onUpload('logo', e.target.files?.[0]); e.target.value = ''; }} />
                </label>
                {fileNames.logo && (
                  <p className="locker-panel__file">
                    {fileNames.logo}
                    <button type="button" onClick={() => clearUpload('logo')}>rimuovi</button>
                  </p>
                )}
              </div>

              <div className="locker-panel__field">
                <span>Sponsor al centro</span>
                <label className="locker-btn locker-btn--ghost">
                  {fileNames.sponsor ? 'SOSTITUISCI' : 'CARICA SPONSOR'}
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { void onUpload('sponsor', e.target.files?.[0]); e.target.value = ''; }} />
                </label>
                {fileNames.sponsor && (
                  <p className="locker-panel__file">
                    {fileNames.sponsor}
                    <button type="button" onClick={() => clearUpload('sponsor')}>rimuovi</button>
                  </p>
                )}
              </div>

              {uploadError && <p className="locker-panel__error" role="alert">{uploadError}</p>}
              <p className="locker-panel__hint">Si applica a tutte le maglie. Le immagini restano sul tuo dispositivo.</p>
            </div>
          )}

          <div className="locker-tools__row" style={{display:'hidden'}}>
            <button type="button" className="locker-icon-btn" aria-label={muted ? 'Attiva audio' : 'Disattiva audio'} aria-pressed={muted} onClick={() => { audioRef.current?.unlock(); setMuted((m) => !m); }}>
              {muted ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />}
            </button>
            <button type="button" className={`locker-icon-btn ${panelOpen ? 'is-on' : ''}`} aria-label="Personalizza maglia" aria-expanded={panelOpen} onClick={() => setPanelOpen((o) => !o)}>
              <PaintBrushIcon />
            </button>
            {detail && (
              <button type="button" className="locker-icon-btn" aria-label="Gira la maglia: fronte / retro" onClick={() => withAudio((eng) => eng.flip())}>
                <ArrowPathIcon />
              </button>
            )}
            <button type="button" className="locker-icon-btn" aria-label="Scarica screenshot PNG della maglia" onClick={download}>
              <ArrowDownTrayIcon />
            </button>
            {detail && <p className="locker-tools__hint">TRASCINA PER RUOTARE</p>}
          </div>
        </div>

      </div>
    </>
  );
};

export default Spogliatoio;
