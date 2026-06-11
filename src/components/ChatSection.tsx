import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { VerseData, ChatMessage } from '../types';
import { chatWithAI } from '../services/aiService';
import { renderMarkdown } from '../utils/markdown';

interface Props {
  verse: VerseData;
}

const SUGGESTIONS = [
  'What is the key word in this verse?',
  'How does this apply today?',
  'What is the Hebrew/Greek root?',
  'What does eternal life mean?',
];

export default function ChatSection({ verse }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: `I'm ready to answer your questions about **${verse.reference}**. Ask me anything — about the original language, historical background, theology, or how it applies to your life today.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: `I'm ready to answer your questions about **${verse.reference}**. Ask me anything!`,
      },
    ]);
  }, [verse.reference]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) {
      return;
    }

    setInput('');

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== '0')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const result = await chatWithAI(verse, messageText, history);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      const isQuota = err.message?.toLowerCase().includes('quota') || err.message?.toLowerCase().includes('limit');
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isQuota
          ? `The AI chat is currently unavailable because your API quota has been reached. The verse analysis and explanation above are still available. You can try again later or add more credits to your OpenAI account.`
          : `Sorry, I had trouble answering that. ${err.message || 'Please try again.'}`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.bubble,
        item.role === 'user' ? styles.userBubble : styles.assistantBubble,
      ]}>
      <Text style={item.role === 'user' ? styles.userText : styles.assistantText}>
        {renderMarkdown(item.content)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIconWrap}>
          <Text style={styles.headerIcon}>💬</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Ask About This Verse</Text>
          <Text style={styles.headerSub}>
            Follow-up questions about {verse.reference}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.chatContainer}
        keyboardVerticalOffset={100}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {isLoading && (
          <View style={styles.thinking}>
            <View style={styles.thinkingDot} />
            <View style={[styles.thinkingDot, styles.dot2]} />
            <View style={[styles.thinkingDot, styles.dot3]} />
          </View>
        )}

        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask a follow-up question…"
              placeholderTextColor="#9a8c78"
              onSubmitEditing={() => sendMessage()}
              returnKeyType="send"
              editable={!isLoading}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, isLoading && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={isLoading}
            activeOpacity={0.8}>
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.suggestions}>
          <Text style={styles.suggLabel}>Suggestions</Text>
          <View style={styles.suggRow}>
            {SUGGESTIONS.map(s => (
              <TouchableOpacity
                key={s}
                style={styles.suggBtn}
                onPress={() => sendMessage(s)}>
                <Text style={styles.suggBtnText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd0b8',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 24,
    shadowColor: '#0d1b2a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    backgroundColor: '#0d1b2a',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#c9952e',
  },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#c9952e18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 17,
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#d4af37',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(212,175,55,0.5)',
    marginTop: 1,
  },
  chatContainer: {
    flex: 1,
  },
  messageList: {
    maxHeight: 360,
    backgroundColor: '#faf7f2',
  },
  messageListContent: {
    padding: 16,
    gap: 10,
  },
  bubble: {
    maxWidth: '85%',
    padding: 13,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#0d1b2a',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd0b8',
  },
  userText: {
    color: '#f5e9c0',
    fontSize: 15,
    lineHeight: 22,
  },
  assistantText: {
    color: '#2c2418',
    fontSize: 15,
    lineHeight: 22,
  },
  thinking: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 5,
    backgroundColor: '#faf7f2',
  },
  thinkingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c9952e',
  },
  dot2: { opacity: 0.5 },
  dot3: { opacity: 0.2 },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 8,
    gap: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0e8d4',
  },
  inputWrap: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ddd0b8',
    borderRadius: 14,
    backgroundColor: '#faf7f2',
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1a1612',
  },
  sendBtn: {
    backgroundColor: '#0d1b2a',
    borderRadius: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendBtnText: {
    color: '#d4af37',
    fontWeight: '600',
    fontSize: 14,
  },
  suggestions: {
    padding: 12,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: '#faf7f2',
    borderTopWidth: 1,
    borderTopColor: '#f0e8d4',
  },
  suggLabel: {
    fontSize: 10,
    color: '#8c7d6a',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  suggRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  suggBtn: {
    borderWidth: 1,
    borderColor: '#ddd0b8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#ffffff',
  },
  suggBtnText: {
    fontSize: 12,
    color: '#5c4e3d',
  },
});
