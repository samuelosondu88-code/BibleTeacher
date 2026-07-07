import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, Alert, BackHandler, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingModal from './src/components/LoadingModal';
import { VerseData, UserPreferences } from './src/types';
import { fetchVerse } from './src/services/bibleService';
import { loadPreferences, savePreferences } from './src/services/storageService';

type Screen = 'home' | 'results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [translation, setTranslation] = useState('kjv');
  const [bookmark, setBookmark] = useState({ book: '', chapter: 0, verse: 0 });

  useEffect(() => {
    loadPreferences().then((prefs: UserPreferences) => {
      setLanguage(prefs.language || 'en');
      setTranslation(prefs.translation || 'kjv');
      setBookmark({
        book: prefs.selectedBook || '',
        chapter: prefs.selectedChapter || 0,
        verse: prefs.selectedVerse || 0,
      });
    });
  }, []);

  const handleSearch = useCallback(async (reference: string, translationOverride?: string) => {
    setIsLoading(true);
    const trans = translationOverride || translation;
    try {
      const verseData = await fetchVerse(reference, trans);
      if (!verseData || !verseData.reference || !verseData.text) {
        throw new Error('Invalid verse data returned from API.');
      }
      setVerse(verseData);
      setScreen('results');
    } catch (err: any) {
      const msg = err?.message || 'Please check the reference and try again.';
      Alert.alert('Verse Not Found', msg);
      setVerse(null);
      setScreen('home');
    } finally {
      setIsLoading(false);
    }
  }, [translation]);

  const handleBack = useCallback(() => {
    setScreen('home');
    setVerse(null);
  }, []);

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    savePreferences({ language: lang });
  }, []);

  const handleTranslationChange = useCallback((trans: string) => {
    setTranslation(trans);
    savePreferences({ translation: trans });
  }, []);

  const handleBookmarkChange = useCallback((book: string, chapter: number, vrs: number) => {
    setBookmark({ book, chapter, verse: vrs });
    savePreferences({ selectedBook: book, selectedChapter: chapter, selectedVerse: vrs });
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (screen === 'results') {
        handleBack();
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [screen, handleBack]);

  return (
    <SafeAreaView style={styles.container}>
      <AppNavigator
        screen={screen}
        verse={verse}
        onVerseSelect={handleSearch}
        onBack={handleBack}
        language={language}
        translation={translation}
        onLanguageChange={handleLanguageChange}
        onTranslationChange={handleTranslationChange}
        bookmark={bookmark}
        onBookmarkChange={handleBookmarkChange}
      />
      <LoadingModal visible={isLoading} step="Retrieving verse text…" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf6ed',
  },
});
