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
        <Text style={styles.headerIcon}>💬</Text>
        <View>
          <Text style={styles.headerTitle}>Ask About This Verse</Text>
          <Text style={styles.headerSub}>
            Ask any follow-up question about {verse.reference}
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
            <Text style={styles.thinkingDot}>•</Text>
            <Text style={[styles.thinkingDot, styles.dot2]}>•</Text>
            <Text style={[styles.thinkingDot, styles.dot3]}>•</Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="What does eternal life mean in this verse?"
            placeholderTextColor="#bbb0a0"
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendBtn, isLoading && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={isLoading}>
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.suggestions}>
          <Text style={styles.suggLabel}>Suggestions:</Text>
          <View style={styles.suggRow}>
            {SUGGESTIONS.slice(0, 2).map(s => (
              <TouchableOpacity
                key={s}
                style={styles.suggBtn}
                onPress={() => sendMessage(s)}>
                <Text style={styles.suggBtnText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.suggRow}>
            {SUGGESTIONS.slice(2).map(s => (
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
    borderWidth: 1.5,
    borderColor: '#e8dfc8',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 24,
    shadowColor: '#1a2744',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  header: {
    backgroundColor: '#1a2744',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#c9a84c',
  },
  headerIcon: {
    fontSize: 22,
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 17,
    fontWeight: '600',
    color: '#e2c97e',
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(226,201,126,0.6)',
    marginTop: 1,
  },
  chatContainer: {
    flex: 1,
  },
  messageList: {
    maxHeight: 360,
    backgroundColor: '#faf6ed',
  },
  messageListContent: {
    padding: 16,
    gap: 12,
  },
  bubble: {
    maxWidth: '85%',
    padding: 13,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#1a2744',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e8dfc8',
  },
  userText: {
    color: '#f5e9c0',
    fontSize: 15,
    lineHeight: 22,
  },
  assistantText: {
    color: '#4a3f2f',
    fontSize: 15,
    lineHeight: 22,
  },
  thinking: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 4,
    backgroundColor: '#faf6ed',
  },
  thinkingDot: {
    fontSize: 20,
    color: '#c9a84c',
  },
  dot2: { opacity: 0.6 },
  dot3: { opacity: 0.3 },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e8dfc8',
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ddd0b8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: 'System',
    color: '#1e1a14',
    backgroundColor: '#faf6ed',
  },
  sendBtn: {
    backgroundColor: '#1a2744',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendBtnText: {
    color: '#e2c97e',
    fontWeight: '600',
    fontSize: 15,
  },
  suggestions: {
    padding: 12,
    paddingTop: 4,
    backgroundColor: '#ffffff',
    gap: 6,
  },
  suggLabel: {
    fontSize: 12,
    color: '#7a6a52',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  suggRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  suggBtn: {
    borderWidth: 1,
    borderColor: '#ddd0b8',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  suggBtnText: {
    fontSize: 13,
    color: '#7a5c2e',
  },
});
