import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, Alert, BackHandler, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingModal from './src/components/LoadingModal';
import { VerseData } from './src/types';
import { fetchVerse } from './src/services/bibleService';

type Screen = 'home' | 'results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (reference: string) => {
    setIsLoading(true);

    try {
      const verseData = await fetchVerse(reference);
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
  }, []);

  const handleBack = useCallback(() => {
    setScreen('home');
    setVerse(null);
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
