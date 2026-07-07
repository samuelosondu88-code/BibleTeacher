import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../types';

const PREFS_KEY = '@BibleTeecha_prefs';

const DEFAULT_PREFS: UserPreferences = {
  language: 'en',
  translation: 'kjv',
  selectedBook: '',
  selectedChapter: 0,
  selectedVerse: 0,
};

export async function loadPreferences(): Promise<UserPreferences> {
  try {
    const stored = await AsyncStorage.getItem(PREFS_KEY);
    if (stored) {
      return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
    }
  } catch {}
  return { ...DEFAULT_PREFS };
}

export async function savePreferences(prefs: Partial<UserPreferences>): Promise<void> {
  try {
    const current = await loadPreferences();
    const merged = { ...current, ...prefs };
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(merged));
  } catch {}
}
