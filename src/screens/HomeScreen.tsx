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
      <StatusBar barStyle="light-content" backgroundColor="#0d1b2a" />

      <View style={styles.headerBar}>
        <View style={styles.logoWrap}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoCross}>✝</Text>
          </View>
          <View>
            <Text style={styles.logoTitle}>BibleTeecha</Text>
            <Text style={styles.logoSub}>AI-Powered Scripture Study</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroSmall}>Explore the Word</Text>
            <Text style={styles.heroTitle}>
              <Text style={styles.heroItalic}>Understand</Text>
              {' the Word\n'}
              <Text style={styles.heroSpan}>Deeply & Clearly</Text>
            </Text>
          </View>

          <View style={styles.searchCard}>
            <Text style={styles.searchLabel}>BIBLE REFERENCE</Text>
            <View style={styles.searchRow}>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.searchInput}
                  value={input}
                  onChangeText={setInput}
                  placeholder="e.g. John 3:16 or Psalm 23"
                  placeholderTextColor="#9a8c78"
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.8}>
                <Text style={styles.searchBtnIcon}>✦</Text>
                <Text style={styles.searchBtnText}>Explain</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickRefs}>
              <Text style={styles.quickLabel}>Quick:</Text>
              <View style={styles.quickRow}>
                {QUICK_REFS.map(ref => (
                  <TouchableOpacity
                    key={ref}
                    style={styles.quickBtn}
                    onPress={() => onSearch(ref)}
                    activeOpacity={0.7}>
                    <Text style={styles.quickBtnText}>{ref}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#c9952e18' }]}>
                <Text style={styles.featureEmoji}>📖</Text>
              </View>
              <Text style={styles.featureTitle}>Original Language</Text>
              <Text style={styles.featureDesc}>Greek, Hebrew & Aramaic with Strong's numbers</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#2c5f8a18' }]}>
                <Text style={styles.featureEmoji}>📜</Text>
              </View>
              <Text style={styles.featureTitle}>Historical Context</Text>
              <Text style={styles.featureDesc}>Cultural & biblical background explained</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#3a7d4418' }]}>
                <Text style={styles.featureEmoji}>🕊</Text>
              </View>
              <Text style={styles.featureTitle}>Life Application</Text>
              <Text style={styles.featureDesc}>Practical wisdom for today</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerDivider} />
            <Text style={styles.footerText}>
              "Your word is a lamp to my feet and a light to my path."
            </Text>
            <Text style={styles.footerRef}>— Psalm 119:105</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f1e8',
  },
  headerBar: {
    backgroundColor: '#0d1b2a',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#c9952e',
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#c9952e20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCross: {
    fontSize: 20,
    color: '#c9952e',
  },
  logoTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#d4af37',
    letterSpacing: 0.3,
  },
  logoSub: {
    fontSize: 10,
    color: 'rgba(212,175,55,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 20,
  },
  heroTextWrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  heroSmall: {
    fontSize: 12,
    color: '#8c7d6a',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '600',
    color: '#1a1612',
    textAlign: 'center',
    lineHeight: 40,
  },
  heroItalic: {
    fontStyle: 'italic',
    color: '#c9952e',
  },
  heroSpan: {
    color: '#0d1b2a',
    fontWeight: '700',
  },
  searchCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd0b8',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#0d1b2a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  searchLabel: {
    fontSize: 11,
    color: '#8c7d6a',
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ddd0b8',
    borderRadius: 14,
    backgroundColor: '#faf7f2',
    overflow: 'hidden',
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    fontFamily: 'serif',
    color: '#1a1612',
  },
  searchBtn: {
    backgroundColor: '#0d1b2a',
    borderRadius: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#0d1b2a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  searchBtnIcon: {
    color: '#c9952e',
    fontSize: 14,
  },
  searchBtnText: {
    color: '#d4af37',
    fontWeight: '700',
    fontSize: 14,
    fontFamily: 'serif',
  },
  quickRefs: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0e8d4',
  },
  quickLabel: {
    fontSize: 10,
    color: '#8c7d6a',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickBtn: {
    borderWidth: 1,
    borderColor: '#ddd0b8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#faf7f2',
  },
  quickBtnText: {
    fontSize: 12,
    color: '#5c4e3d',
    fontFamily: 'serif',
  },
  features: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 28,
    width: '100%',
  },
  featureItem: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8dfc8',
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureEmoji: {
    fontSize: 18,
  },
  featureTitle: {
    fontFamily: 'serif',
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1612',
    textAlign: 'center',
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 10,
    color: '#6b5d4a',
    textAlign: 'center',
    lineHeight: 14,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  footerDivider: {
    width: 50,
    height: 2,
    backgroundColor: '#c9952e',
    borderRadius: 1,
    marginBottom: 14,
  },
  footerText: {
    fontSize: 13,
    color: '#6b5d4a',
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: 'serif',
  },
  footerRef: {
    fontSize: 11,
    color: '#8c7d6a',
    marginTop: 4,
  },
});
