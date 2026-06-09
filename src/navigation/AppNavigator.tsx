import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ResultsScreen from '../screens/ResultsScreen';
import { VerseData } from '../types';

type Screen = 'home' | 'results';

interface Props {
  onVerseSelect: (verse: VerseData) => void;
  verse: VerseData | null;
  screen: Screen;
  onBack: () => void;
}

export default function AppNavigator({
  onVerseSelect,
  verse,
  screen,
  onBack,
}: Props) {
  if (screen === 'results' && verse) {
    return (
      <View style={styles.container}>
        <ResultsScreen verse={verse} onBack={onBack} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HomeScreen onSearch={onVerseSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
