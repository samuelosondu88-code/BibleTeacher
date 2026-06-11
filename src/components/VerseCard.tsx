import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VerseData } from '../types';

interface Props {
  verse: VerseData;
}

export default function VerseCard({ verse }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{verse.reference}</Text>
      </View>
      <Text style={styles.verseText}>{verse.text}</Text>
      <Text style={styles.translation}>{verse.translation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 28,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#0d1b2a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e8dfc8',
    position: 'relative',
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#c9952e',
  },
  badge: {
    backgroundColor: '#f5f1e8',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e0d5c0',
  },
  badgeText: {
    color: '#5c4e3d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  verseText: {
    fontFamily: 'serif',
    fontSize: 20,
    fontStyle: 'italic',
    color: '#2c2418',
    textAlign: 'center',
    lineHeight: 32,
  },
  translation: {
    marginTop: 14,
    fontSize: 11,
    color: '#8c7d6a',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
});
