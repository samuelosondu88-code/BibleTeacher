import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    loadContent();
  }, [verse.reference]);

  const loadContent = async () => {
    setLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(verse);

      setLoadingStep('Generating AI-powered Bible study…');
      const analysis = await getCombinedAnalysis(verse, systemPrompt);
      setContent(analysis);
      setLoading(false);
    } catch (err: any) {
      setContent({
        meaning: err.message || 'An error occurred.',
        language: '',
        context: '',
        application: '',
      });
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1b2a" />

      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backBtnText}>New Search</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BibleTeecha</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <VerseCard verse={verse} />

        <AccordionSection
          title="Simple Meaning"
          icon="☀"
          defaultOpen={!loading && !!content.meaning}>
          {loading && !content.meaning ? (
            <SkeletonLoader lines={3} />
          ) : (
            renderMarkdown(content.meaning)
          )}
        </AccordionSection>

        <AccordionSection
          title="Original Language Insights"
          icon="α"
          defaultOpen={!loading && !!content.language}>
          {loading && !content.language ? (
            <SkeletonLoader lines={4} />
          ) : (
            renderMarkdown(content.language)
          )}
        </AccordionSection>

        <AccordionSection
          title="Historical & Biblical Context"
          icon="📜"
          defaultOpen={!loading && !!content.context}>
          {loading && !content.context ? (
            <SkeletonLoader lines={3} />
          ) : (
            renderMarkdown(content.context)
          )}
        </AccordionSection>

        <AccordionSection
          title="Life Application"
          icon="🕊"
          defaultOpen={!loading && !!content.application}>
          {loading && !content.application ? (
            <SkeletonLoader lines={3} />
          ) : (
            renderMarkdown(content.application)
          )}
        </AccordionSection>

        {!loading && <ChatSection verse={verse} />}
      </ScrollView>

      <LoadingModal visible={loading} step={loadingStep} />
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#c9952e',
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
    color: '#c9952e',
    fontSize: 18,
    fontWeight: '600',
  },
  backBtnText: {
    color: '#d4af37',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#d4af37',
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
});
