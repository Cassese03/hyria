// Ciò che resta solo su questo dispositivo: dati del form e chiavi delle schedine giocate.
const KEY = 'hyria-schedina-v1';
const MAX_TOKENS = 50;

export interface DeviceData {
  nickname: string;
  email: string;
  tokens: string[];
}

const EMPTY: DeviceData = { nickname: '', email: '', tokens: [] };

export function loadDevice(): DeviceData {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<DeviceData> | null;
    if (!raw || typeof raw !== 'object') return EMPTY;
    return {
      nickname: typeof raw.nickname === 'string' ? raw.nickname : '',
      email: typeof raw.email === 'string' ? raw.email : '',
      tokens: Array.isArray(raw.tokens) ? raw.tokens.filter((t): t is string => typeof t === 'string').slice(0, MAX_TOKENS) : [],
    };
  } catch {
    return EMPTY;
  }
}

export function saveDevice(data: DeviceData) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...data, tokens: data.tokens.slice(0, MAX_TOKENS) }));
  } catch {
    /* navigazione privata o spazio pieno: lo storico resta solo per questa visita */
  }
}
