import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VerseData } from '../types';

interface Props {
  verse: VerseData;
}

export default function VerseCard({ verse }: Props) {
  return (
    <View style={styles.card}>
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
    backgroundColor: '#1a2744',
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#1a2744',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 12,
  },
  badge: {
    backgroundColor: '#c9a84c',
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: '#1a2744',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  verseText: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontStyle: 'italic',
    color: '#f5e9c0',
    textAlign: 'center',
    lineHeight: 32,
  },
  translation: {
    marginTop: 14,
    fontSize: 12,
    color: 'rgba(201,168,76,0.55)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
