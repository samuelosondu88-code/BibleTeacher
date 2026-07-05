import React, { useState, useCallback } from 'react';
import { SafeAreaView, Alert, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingModal from './src/components/LoadingModal';
import { VerseData } from './src/types';
import { fetchVerse } from './src/services/bibleService';

type Screen = 'home' | 'results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const handleSearch = useCallback(async (reference: string) => {
    setIsLoading(true);
    setLoadingStep('Retrieving verse text…');

    try {
      const verseData = await fetchVerse(reference);
      setVerse(verseData);
      setScreen('results');
    } catch (err: any) {
      Alert.alert('Verse Not Found', err.message || 'Please try a different reference.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBack = useCallback(() => {
    setScreen('home');
    setVerse(null);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <AppNavigator
        screen={screen}
        verse={verse}
        onVerseSelect={handleSearch}
        onBack={handleBack}
      />
      <LoadingModal visible={isLoading} step={loadingStep} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf6ed',
  },
});
