import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';
import { BIBLE_BOOKS, BookInfo } from '../data/bibleMetadata';
import { LANGUAGES, BIBLE_VERSIONS } from '../config';

interface Props {
  onSearch: (reference: string, translation?: string) => void;
  language: string;
  translation: string;
  onLanguageChange: (lang: string) => void;
  onTranslationChange: (trans: string) => void;
  bookmark: { book: string; chapter: number; verse: number };
  onBookmarkChange: (book: string, chapter: number, verse: number) => void;
}

const QUICK_REFS = ['John 3:16', 'Psalm 23:1', 'Romans 8:28', 'Proverbs 3:5', 'Isaiah 41:10'];

type PickerStep = 'testament' | 'book' | 'chapter' | 'verse';

export default function HomeScreen({
  onSearch, language, translation, onLanguageChange, onTranslationChange, bookmark, onBookmarkChange,
}: Props) {
  const [input, setInput] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerStep, setPickerStep] = useState<PickerStep>('testament');
  const [selectedTestament, setSelectedTestament] = useState<'OT' | 'NT'>('NT');
  const [selectedBook, setSelectedBook] = useState<BookInfo | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [langDropdownVisible, setLangDropdownVisible] = useState(false);
  const [versionDropdownVisible, setVersionDropdownVisible] = useState(false);

  const handleSearch = () => {
    const query = input.trim();
    if (query) {
      onSearch(query);
    }
  };

  const openPicker = () => {
    setPickerStep('testament');
    setSelectedTestament('NT');
    setSelectedBook(null);
    setSelectedChapter(0);
    setPickerVisible(true);
  };

  const handleTestamentSelect = (t: 'OT' | 'NT') => {
    setSelectedTestament(t);
    setPickerStep('book');
  };

  const handleBookSelect = (book: BookInfo) => {
    setSelectedBook(book);
    setSelectedChapter(0);
    setPickerStep('chapter');
  };

  const handleChapterSelect = (ch: number) => {
    setSelectedChapter(ch);
    setPickerStep('verse');
  };

  const handleVerseSelect = (vrs: number) => {
    const bookName = selectedBook!.name;
    const ref = `${bookName} ${selectedChapter}:${vrs}`;
    setInput(ref);
    onBookmarkChange(bookName, selectedChapter, vrs);
    setPickerVisible(false);
  };

  const books = selectedTestament === 'OT' ? BIBLE_BOOKS.OT : BIBLE_BOOKS.NT;
  const chapterCount = selectedBook ? selectedBook.chapters.length : 0;
  const verseCount = selectedChapter > 0 && selectedBook ? selectedBook.chapters[selectedChapter - 1] : 0;

  const hasBookmark = bookmark.book && bookmark.chapter && bookmark.verse;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f766e" />

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

          <View style={styles.quickRefsSection}>
            <Text style={styles.quickRefsTitle}>Quick Features</Text>
            <View style={styles.quickRefsRow}>
              {QUICK_REFS.map(ref => (
                <TouchableOpacity
                  key={ref}
                  style={styles.quickRefBtn}
                  onPress={() => onSearch(ref)}
                  activeOpacity={0.7}>
                  <Text style={styles.quickRefBtnText}>{ref}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#d9770618' }]}>
                <Text style={styles.featureEmoji}>📖</Text>
              </View>
              <Text style={styles.featureTitle}>Original Language</Text>
              <Text style={styles.featureDesc}>Greek, Hebrew & Aramaic with Strong's numbers</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#0f766e18' }]}>
                <Text style={styles.featureEmoji}>📜</Text>
              </View>
              <Text style={styles.featureTitle}>Historical Context</Text>
              <Text style={styles.featureDesc}>Cultural & biblical background explained</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#05966918' }]}>
                <Text style={styles.featureEmoji}>🕊</Text>
              </View>
              <Text style={styles.featureTitle}>Life Application</Text>
              <Text style={styles.featureDesc}>Practical wisdom for today</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.bibleNavBtn} onPress={openPicker} activeOpacity={0.8}>
            <Text style={styles.bibleNavBtnIcon}>📖</Text>
            <View style={styles.bibleNavBtnTextWrap}>
              <Text style={styles.bibleNavBtnLabel}>Browse the Bible</Text>
              <Text style={styles.bibleNavBtnHint}>
                {hasBookmark
                  ? `${bookmark.book} ${bookmark.chapter}:${bookmark.verse}`
                  : 'Tap to select book, chapter & verse'}
              </Text>
            </View>
            <Text style={styles.bibleNavBtnArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.searchCard}>
            <View style={styles.selectorRow}>
              <View style={styles.selectorGroup}>
                <Text style={styles.selectorLabel}>Language</Text>
                <TouchableOpacity style={styles.dropdownBtn} onPress={() => setLangDropdownVisible(true)} activeOpacity={0.7}>
                  <Text style={styles.dropdownBtnText}>{LANGUAGES.find(l => l.code === language)?.label || 'English'}</Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.selectorRow}>
              <View style={styles.selectorGroup}>
                <Text style={styles.selectorLabel}>Version</Text>
                <TouchableOpacity style={styles.dropdownBtn} onPress={() => setVersionDropdownVisible(true)} activeOpacity={0.7}>
                  <Text style={styles.dropdownBtnText}>{BIBLE_VERSIONS.find(v => v.id === translation)?.label || 'King James Version (KJV)'}</Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.searchLabel}>BIBLE REFERENCE</Text>
            <View style={styles.searchRow}>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.searchInput}
                  value={input}
                  onChangeText={setInput}
                  placeholder="e.g. John 3:16 or Psalm 23"
                  placeholderTextColor="#9ca3af"
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

      <Modal visible={langDropdownVisible} transparent animationType="fade" onRequestClose={() => setLangDropdownVisible(false)}>
        <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setLangDropdownVisible(false)}>
          <View style={styles.dropdownMenu}>
            {LANGUAGES.map(l => (
              <TouchableOpacity
                key={l.code}
                style={[styles.dropdownItem, language === l.code && styles.dropdownItemActive]}
                onPress={() => { onLanguageChange(l.code); setLangDropdownVisible(false); }}
                activeOpacity={0.7}>
                <Text style={[styles.dropdownItemText, language === l.code && styles.dropdownItemTextActive]}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={versionDropdownVisible} transparent animationType="fade" onRequestClose={() => setVersionDropdownVisible(false)}>
        <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setVersionDropdownVisible(false)}>
          <View style={styles.dropdownMenu}>
            {BIBLE_VERSIONS.map(v => (
              <TouchableOpacity
                key={v.id}
                style={[styles.dropdownItem, translation === v.id && styles.dropdownItemActive]}
                onPress={() => { onTranslationChange(v.id); setVersionDropdownVisible(false); }}
                activeOpacity={0.7}>
                <Text style={[styles.dropdownItemText, translation === v.id && styles.dropdownItemTextActive]}>{v.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={pickerVisible} animationType="slide" transparent>
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity
                onPress={() => {
                  if (pickerStep === 'book') setPickerStep('testament');
                  else if (pickerStep === 'chapter') setPickerStep('book');
                  else if (pickerStep === 'verse') setPickerStep('chapter');
                  else setPickerVisible(false);
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.pickerBack}>‹ Back</Text>
              </TouchableOpacity>
              <Text style={styles.pickerTitle}>
                {pickerStep === 'testament' ? 'Select Testament' :
                 pickerStep === 'book' ? `Select ${selectedTestament} Book` :
                 pickerStep === 'chapter' ? `Select Chapter` :
                 `Select Verse`}
              </Text>
              <TouchableOpacity
                onPress={() => setPickerVisible(false)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.pickerClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {pickerStep === 'testament' && (
              <View style={styles.pickerBody}>
                <TouchableOpacity style={styles.testamentBtn} onPress={() => handleTestamentSelect('OT')} activeOpacity={0.8}>
                  <Text style={styles.testamentIcon}>📜</Text>
                  <Text style={styles.testamentTitle}>Old Testament</Text>
                  <Text style={styles.testamentCount}>39 Books</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.testamentBtn} onPress={() => handleTestamentSelect('NT')} activeOpacity={0.8}>
                  <Text style={styles.testamentIcon}>✝</Text>
                  <Text style={styles.testamentTitle}>New Testament</Text>
                  <Text style={styles.testamentCount}>27 Books</Text>
                </TouchableOpacity>
              </View>
            )}

            {pickerStep === 'book' && (
              <ScrollView style={styles.pickerBody} contentContainerStyle={styles.bookGrid}>
                {books.map(b => (
                  <TouchableOpacity
                    key={b.name}
                    style={styles.bookBtn}
                    onPress={() => handleBookSelect(b)}
                    activeOpacity={0.7}>
                    <Text style={styles.bookBtnName}>{b.name}</Text>
                    <Text style={styles.bookBtnChapters}>{b.chapters.length} ch.</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {pickerStep === 'chapter' && (
              <ScrollView style={styles.pickerBody} contentContainerStyle={styles.numberGrid}>
                {Array.from({ length: chapterCount }, (_, i) => i + 1).map(ch => (
                  <TouchableOpacity
                    key={ch}
                    style={styles.numBtn}
                    onPress={() => handleChapterSelect(ch)}
                    activeOpacity={0.7}>
                    <Text style={styles.numBtnText}>{ch}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {pickerStep === 'verse' && (
              <ScrollView style={styles.pickerBody} contentContainerStyle={styles.numberGrid}>
                {Array.from({ length: verseCount }, (_, i) => i + 1).map(v => (
                  <TouchableOpacity
                    key={v}
                    style={styles.numBtn}
                    onPress={() => handleVerseSelect(v)}
                    activeOpacity={0.7}>
                    <Text style={styles.numBtnText}>{v}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdfa',
  },
  headerBar: {
    backgroundColor: '#0f766e',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f59e0b',
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
    backgroundColor: '#f59e0b20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCross: {
    fontSize: 20,
    color: '#fbbf24',
  },
  logoTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#fbbf24',
    letterSpacing: 0.3,
  },
  logoSub: {
    fontSize: 10,
    color: 'rgba(251,191,36,0.55)',
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
    marginBottom: 24,
  },
  heroSmall: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '600',
    color: '#1c1917',
    textAlign: 'center',
    lineHeight: 40,
  },
  heroItalic: {
    fontStyle: 'italic',
    color: '#d97706',
  },
  heroSpan: {
    color: '#0f766e',
    fontWeight: '700',
  },
  quickRefsSection: {
    width: '100%',
    marginBottom: 16,
  },
  quickRefsTitle: {
    fontSize: 11,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 10,
  },
  quickRefsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickRefBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
  },
  quickRefBtnText: {
    fontSize: 13,
    color: '#4b5563',
    fontFamily: 'serif',
  },
  bibleNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginBottom: 16,
  },
  bibleNavBtnIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  bibleNavBtnTextWrap: {
    flex: 1,
  },
  bibleNavBtnLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1917',
    fontFamily: 'serif',
  },
  bibleNavBtnHint: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  bibleNavBtnArrow: {
    fontSize: 22,
    color: '#9ca3af',
    fontWeight: '700',
  },
  searchCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  selectorRow: {
    marginBottom: 12,
  },
  selectorGroup: {
  },
  selectorLabel: {
    fontSize: 10,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#f9fafb',
  },
  dropdownBtnText: {
    fontSize: 13,
    color: '#1c1917',
    fontWeight: '600',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 8,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  dropdownMenu: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemActive: {
    backgroundColor: '#0f766e',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#1c1917',
    fontWeight: '600',
  },
  dropdownItemTextActive: {
    color: '#ffffff',
  },
  searchLabel: {
    fontSize: 11,
    color: '#6b7280',
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
    borderColor: '#d1d5db',
    borderRadius: 14,
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    fontFamily: 'serif',
    color: '#1c1917',
  },
  searchBtn: {
    backgroundColor: '#0f766e',
    borderRadius: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  searchBtnIcon: {
    color: '#fbbf24',
    fontSize: 14,
  },
  searchBtnText: {
    color: '#fbbf24',
    fontWeight: '700',
    fontSize: 14,
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
    borderColor: '#e5e7eb',
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
    color: '#1c1917',
    textAlign: 'center',
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 10,
    color: '#6b7280',
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
    backgroundColor: '#d97706',
    borderRadius: 1,
    marginBottom: 14,
  },
  footerText: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: 'serif',
  },
  footerRef: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '50%',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pickerBack: {
    fontSize: 15,
    color: '#0f766e',
    fontWeight: '600',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1c1917',
    fontFamily: 'serif',
  },
  pickerClose: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '700',
  },
  pickerBody: {
    padding: 16,
  },
  testamentBtn: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  testamentIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  testamentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1917',
    fontFamily: 'serif',
  },
  testamentCount: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  bookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 20,
  },
  bookBtn: {
    width: '30%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  bookBtnName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1c1917',
    fontFamily: 'serif',
    textAlign: 'center',
  },
  bookBtnChapters: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 20,
  },
  numBtn: {
    width: '18%',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  numBtnText: {
    fontSize: 14,
    color: '#1c1917',
    fontWeight: '600',
  },
});
