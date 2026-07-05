import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { VerseData, AIContent } from '../types';
import {
  buildSystemPrompt,
  getCombinedAnalysis,
} from '../services/aiService';
import VerseCard from '../components/VerseCard';
import AccordionSection from '../components/AccordionSection';
import SkeletonLoader from '../components/SkeletonLoader';
import ChatSection from '../components/ChatSection';
import LoadingModal from '../components/LoadingModal';
import { renderMarkdown } from '../utils/markdown';

interface Props {
  verse: VerseData;
  onBack: () => void;
}

export default function ResultsScreen({ verse, onBack }: Props) {
  const [content, setContent] = useState<AIContent>({
    meaning: '',
    language: '',
    context: '',
    application: '',
  });
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState('Retrieving verse text…');
  const [hasError, setHasError] = useState(false);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    setLoadingStep('Generating AI-powered Bible study…');

    try {
      const systemPrompt = buildSystemPrompt(verse);
      const analysis = await getCombinedAnalysis(verse, systemPrompt);
      setContent(analysis);
      setLoading(false);
    } catch (err: any) {
      setContent({
        meaning: `**Analysis unavailable**\n\n${err.message || 'An error occurred.'}`,
        language: '',
        context: '',
        application: '',
      });
      setHasError(true);
      setLoading(false);
    }
  }, [verse]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const sections = [
    { title: 'Simple Meaning', icon: '☀', key: 'meaning' as const, lines: 3 },
    { title: 'Original Language Insights', icon: 'α', key: 'language' as const, lines: 4 },
    { title: 'Historical & Biblical Context', icon: '📜', key: 'context' as const, lines: 3 },
    { title: 'Life Application', icon: '🕊', key: 'application' as const, lines: 3 },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f766e" />

      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backBtnText}>New Search</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BibleTeecha</Text>
        <View style={styles.backBtn}>
          {hasError && (
            <TouchableOpacity onPress={loadContent}>
              <Text style={styles.retryBtn}>↻</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <VerseCard verse={verse} />

        {sections.map(s => (
          <AccordionSection
            key={s.key}
            title={s.title}
            icon={s.icon}
            defaultOpen={!loading && !!content[s.key]}>
            {loading && !content[s.key] ? (
              <SkeletonLoader lines={s.lines} />
            ) : (
              renderMarkdown(content[s.key])
            )}
          </AccordionSection>
        ))}

        {hasError && (
          <TouchableOpacity style={styles.retryBar} onPress={loadContent}>
            <Text style={styles.retryBarText}>↻ Tap to retry analysis</Text>
          </TouchableOpacity>
        )}

        {!loading && !hasError && <ChatSection verse={verse} />}
      </ScrollView>

      <LoadingModal visible={loading} step={loadingStep} />
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backArrow: {
    color: '#fbbf24',
    fontSize: 18,
    fontWeight: '600',
  },
  backBtnText: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '600',
  },
  retryBtn: {
    color: '#fbbf24',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  headerTitle: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'serif',
    textAlign: 'center',
    flex: 1,
    letterSpacing: 0.3,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  retryBar: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginTop: 8,
  },
  retryBarText: {
    color: '#0f766e',
    fontSize: 15,
    fontWeight: '600',
  },
});
