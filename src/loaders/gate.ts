import { useSyncExternalStore } from 'react';

/**
 * Segnala quando la schermata di caricamento del primo ingresso è uscita:
 * le intestazioni 3D aspettano questo momento per far partire camera e testi.
 */
let doneAt: number | null = null;
const listeners = new Set<() => void>();

export const openLoaderGate = () => {
  if (doneAt !== null) return;
  doneAt = performance.now();
  listeners.forEach((fn) => fn());
};

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

/** Momento (performance.now) in cui il loader è uscito, o null se è ancora a schermo */
export const useLoaderDoneAt = () => useSyncExternalStore(subscribe, () => doneAt);
