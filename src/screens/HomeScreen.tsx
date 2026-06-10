import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';

interface Props {
  onSearch: (reference: string) => void;
}

const QUICK_REFS = ['John 3:16', 'Psalm 23:1', 'Romans 8:28', 'Proverbs 3:5', 'Isaiah 41:10'];

export default function HomeScreen({ onSearch }: Props) {
  const [input, setInput] = useState('');

  const handleSearch = () => {
    const query = input.trim();
    if (query) {
      onSearch(query);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a2744" />

      <View style={styles.headerBar}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoCross}>✝</Text>
          <View>
            <Text style={styles.logoTitle}>BibleTeecha</Text>
            <Text style={styles.logoSub}>AI-Powered Scripture Study</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            <Text style={styles.heroItalic}>Understand</Text>
            {' the Word of God\n'}
            <Text style={styles.heroSpan}>Deeply & Clearly</Text>
          </Text>
          <Text style={styles.heroSub}>
            Enter any Bible verse or reference. BibleTeecha uses AI to reveal
            the original language, historical context, and practical wisdom
            within every passage.
          </Text>

          <View style={styles.searchCard}>
            <Text style={styles.searchLabel}>
              ENTER A BIBLE REFERENCE OR VERSE
            </Text>
            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                value={input}
                onChangeText={setInput}
                placeholder="e.g. John 3:16 or Psalm 23:1"
                placeholderTextColor="#bbb0a0"
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                multiline={false}
              />
              <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                <Text style={styles.searchBtnText}>✦ Explain Verse</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickRefs}>
              <Text style={styles.quickLabel}>Quick:</Text>
              {QUICK_REFS.map(ref => (
                <TouchableOpacity
                  key={ref}
                  style={styles.quickBtn}
                  onPress={() => onSearch(ref)}>
                  <Text style={styles.quickBtnText}>{ref}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerCross}>✝</Text>
            <Text style={styles.footerText}>
              "Your word is a lamp to my feet and a light to my path." — Psalm
              119:105
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4eb',
  },
  headerBar: {
    backgroundColor: '#1a2744',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#c9a84c',
    shadowColor: '#1a2744',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCross: {
    fontSize: 24,
    color: '#c9a84c',
  },
  logoTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#e2c97e',
  },
  logoSub: {
    fontSize: 10,
    color: 'rgba(226,201,126,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1.8,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  hero: {
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '600',
    color: '#1a2744',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 12,
  },
  heroItalic: {
    fontStyle: 'italic',
    color: '#b8942e',
  },
  heroSpan: {
    color: '#2c3a5c',
    fontWeight: '700',
  },
  heroSub: {
    fontSize: 14,
    color: '#5c4e38',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  searchCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0d5b8',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#3a2a14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  searchLabel: {
    fontSize: 11,
    color: '#8c7a5a',
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#d4c5a0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'serif',
    color: '#2c2418',
    backgroundColor: '#fefcf5',
  },
  searchBtn: {
    backgroundColor: '#1a2744',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    shadowColor: '#1a2744',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  searchBtnText: {
    color: '#e2c97e',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'serif',
  },
  quickRefs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  quickLabel: {
    fontSize: 11,
    color: '#8c7a5a',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  quickBtn: {
    borderWidth: 1,
    borderColor: '#d4c5a0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#fefcf5',
  },
  quickBtnText: {
    fontSize: 12,
    color: '#5c4e38',
    fontFamily: 'serif',
  },
  footer: {
    marginTop: 48,
    alignItems: 'center',
  },
  footerCross: {
    fontSize: 20,
    color: '#c9a84c',
    marginBottom: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#8c7a5a',
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: 'serif',
  },
});
