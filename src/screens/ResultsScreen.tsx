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
  getSimpleMeaning,
  getOriginalLanguageAnalysis,
  getHistoricalContext,
  getLifeApplication,
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
  const [error, setError] = useState('');

  useEffect(() => {
    loadContent();
  }, [verse.reference]);

  const loadContent = async () => {
    setLoading(true);
    setError('');

    try {
      const systemPrompt = buildSystemPrompt(verse);

      setLoadingStep('Generating simple explanation…');
      const meaning = await getSimpleMeaning(verse, systemPrompt);
      setContent(prev => ({ ...prev, meaning }));

      setLoadingStep('Analyzing original language…');
      const language = await getOriginalLanguageAnalysis(verse, systemPrompt);
      setContent(prev => ({ ...prev, language }));

      setLoadingStep('Researching historical context…');
      const context = await getHistoricalContext(verse, systemPrompt);
      setContent(prev => ({ ...prev, context }));

      setLoadingStep('Preparing life applications…');
      const application = await getLifeApplication(verse, systemPrompt);
      setContent(prev => ({ ...prev, application }));

      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a2744" />
        <Text style={styles.errorIcon}>⚠</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.errorBtn} onPress={onBack}>
          <Text style={styles.errorBtnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a2744" />

      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← New Search</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bible Teacher</Text>
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
          icon="♡"
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
    backgroundColor: '#faf6ed',
  },
  headerBar: {
    backgroundColor: '#1a2744',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#c9a84c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 100,
  },
  backBtnText: {
    color: '#e2c97e',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#e2c97e',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Georgia',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#faf6ed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#b84040',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorBtn: {
    backgroundColor: '#1a2744',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  errorBtnText: {
    color: '#e2c97e',
    fontWeight: '600',
    fontSize: 15,
  },
});
