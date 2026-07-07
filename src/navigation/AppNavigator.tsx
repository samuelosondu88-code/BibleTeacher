import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ResultsScreen from '../screens/ResultsScreen';
import { VerseData } from '../types';

type Screen = 'home' | 'results';

interface Props {
  onVerseSelect: (reference: string, translation?: string) => void;
  verse: VerseData | null;
  screen: Screen;
  onBack: () => void;
  language: string;
  translation: string;
  onLanguageChange: (lang: string) => void;
  onTranslationChange: (trans: string) => void;
  bookmark: { book: string; chapter: number; verse: number };
  onBookmarkChange: (book: string, chapter: number, verse: number) => void;
}

export default function AppNavigator({
  onVerseSelect,
  verse,
  screen,
  onBack,
  language,
  translation,
  onLanguageChange,
  onTranslationChange,
  bookmark,
  onBookmarkChange,
}: Props) {
  if (screen === 'results' && verse) {
    return (
      <View style={styles.container}>
        <ResultsScreen
          verse={verse}
          onBack={onBack}
          language={language}
          onNewSearch={(ref: string) => onVerseSelect(ref, translation)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HomeScreen
        onSearch={onVerseSelect}
        language={language}
        translation={translation}
        onLanguageChange={onLanguageChange}
        onTranslationChange={onTranslationChange}
        bookmark={bookmark}
        onBookmarkChange={onBookmarkChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
