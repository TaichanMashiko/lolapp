import { Advice, MatchLog } from "../types";

// Key for persisting the active user's email
const ACTIVE_USER_KEY = 'lol_tracker_active_user';

// In-memory cache
let CURRENT_USER_EMAIL = '';

export const setCurrentUser = (email: string) => {
  CURRENT_USER_EMAIL = email;
  if (email) {
    localStorage.setItem(ACTIVE_USER_KEY, email);
  } else {
    localStorage.removeItem(ACTIVE_USER_KEY);
  }
};

export const getCurrentUser = () => {
  if (!CURRENT_USER_EMAIL) {
    CURRENT_USER_EMAIL = localStorage.getItem(ACTIVE_USER_KEY) || '';
  }
  return CURRENT_USER_EMAIL;
};

const getUserKey = (baseKey: string) => {
  const user = getCurrentUser();
  if (!user) return baseKey; // Fallback for guest/unauthed (though flow prevents this)
  return `${user}_${baseKey}`;
};

const ADVICE_KEY_BASE = 'lol_tracker_advice_v1';
const MATCHES_KEY_BASE = 'lol_tracker_matches_v1';

// Sheet 1: Knowledge_Base
export const saveAdvice = (newAdvice: Advice[]): void => {
  const key = getUserKey(ADVICE_KEY_BASE);
  const existingJson = localStorage.getItem(key);
  const existing: Advice[] = existingJson ? JSON.parse(existingJson) : [];
  const updated = [...existing, ...newAdvice];
  localStorage.setItem(key, JSON.stringify(updated));
};

export const getAdvice = (): Advice[] => {
  const key = getUserKey(ADVICE_KEY_BASE);
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : [];
};

// Sheet 2: Match_History
export const saveMatch = (match: MatchLog): void => {
  const key = getUserKey(MATCHES_KEY_BASE);
  const existingJson = localStorage.getItem(key);
  const existing: MatchLog[] = existingJson ? JSON.parse(existingJson) : [];
  const updated = [match, ...existing]; 
  localStorage.setItem(key, JSON.stringify(updated));
};

export const getMatches = (): MatchLog[] => {
  const key = getUserKey(MATCHES_KEY_BASE);
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : [];
};

export const clearData = () => {
  // Only clear current user's data
  const aKey = getUserKey(ADVICE_KEY_BASE);
  const mKey = getUserKey(MATCHES_KEY_BASE);
  localStorage.removeItem(aKey);
  localStorage.removeItem(mKey);
};

export const exportMatchHistoryCSV = (): string => {
  const matches = getMatches();
  const header = ['timestamp', 'role', 'champion', 'result', 'achievement_rate', 'checked_count', 'total_count', 'note'];
  const rows = matches.map(m => [
    m.timestamp,
    m.role,
    m.champion,
    m.result,
    `${m.achievement_rate}%`,
    m.checked_count,
    m.total_count,
    `"${m.note.replace(/"/g, '""')}"` 
  ]);
  
  return [header.join(','), ...rows.map(r => r.join(','))].join('\n');
};