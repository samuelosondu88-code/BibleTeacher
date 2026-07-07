import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  isQuotaError,
} from '../services/aiService';
import VerseCard from '../components/VerseCard';
import AccordionSection from '../components/AccordionSection';
import SkeletonLoader from '../components/SkeletonLoader';
import ChatSection from '../components/ChatSection';
import { renderMarkdown } from '../utils/markdown';

interface Props {
  verse: VerseData;
  onBack: () => void;
  language: string;
  onNewSearch: (reference: string) => void;
}

const LOADING_STEPS = [
  'Analyzing verse meaning…',
  'Researching original languages…',
  'Studying historical context…',
  'Preparing life application…',
];

const SECTIONS = [
  { title: 'Simple Meaning', icon: '☀', key: 'meaning' as const, lines: 3 },
  { title: 'Original Language Insights', icon: 'α', key: 'language' as const, lines: 4 },
  { title: 'Historical & Biblical Context', icon: '📜', key: 'context' as const, lines: 3 },
  { title: 'Life Application', icon: '🕊', key: 'application' as const, lines: 3 },
];

export default function ResultsScreen({ verse, onBack, language }: Props) {
  const [content, setContent] = useState<AIContent>({
    meaning: '',
    language: '',
    context: '',
    application: '',
  });
  const [loading, setLoading] = useState(true);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    stepTimerRef.current = setInterval(() => {
      setLoadingStepIndex(i => Math.min(i + 1, LOADING_STEPS.length - 1));
    }, 4000);
    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, []);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    setLoadingStepIndex(0);

    try {
      const systemPrompt = buildSystemPrompt(verse, language);
      const analysis = await getCombinedAnalysis(verse, systemPrompt);
      setContent(analysis);
      setLoading(false);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    } catch (err: any) {
      const msg = err?.message || 'An error occurred.';
      const isQuota = isQuotaError(err);
      const displayMsg = isQuota
        ? `**Free AI service unavailable**\n\nThe free API limit was reached. To continue:\n\n1. Go to **openrouter.ai/keys**\n2. Get a free API key (no credit card)\n3. Set it in **src/config.ts** (or as GitHub secret)\n\nThen tap retry below.`
        : `**Analysis unavailable**\n\n${msg}\n\nTap retry to try again.`;
      setContent({
        meaning: displayMsg,
        language: '',
        context: '',
        application: '',
      });
      setHasError(true);
      setLoading(false);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    }
  }, [verse, language]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f766e" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backBtnText}>Back</Text>
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <VerseCard verse={verse} />

        {loading && !hasError && (
          <View style={styles.loadingHint}>
            <Text style={styles.loadingHintText}>
              {LOADING_STEPS[loadingStepIndex]}
            </Text>
          </View>
        )}

        {SECTIONS.map(s => (
          <AccordionSection
            key={s.key}
            title={s.title}
            icon={s.icon}
            defaultOpen={!loading && !!content[s.key]}>
            {loading && !content[s.key] ? (
              <SkeletonLoader lines={s.lines} />
            ) : content[s.key] ? (
              renderMarkdown(content[s.key])
            ) : null}
          </AccordionSection>
        ))}

        {hasError && (
          <TouchableOpacity style={styles.retryBar} onPress={loadContent}>
            <Text style={styles.retryBarText}>↻ Tap to retry analysis</Text>
          </TouchableOpacity>
        )}

        {!loading && !hasError && (
          <ChatSection verse={verse} language={language} />
        )}
      </ScrollView>
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    minWidth: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backArrow: {
    color: '#fbbf24',
    fontSize: 22,
    fontWeight: '700',
  },
  backBtnText: {
    color: '#fbbf24',
    fontSize: 16,
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
  loadingHint: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  loadingHintText: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
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
