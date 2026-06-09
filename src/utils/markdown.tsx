import React from 'react';
import { Text } from 'react-native';

interface MarkdownProps {
  text: string;
  style?: any;
}

function parseInlineFormatting(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.*?)\*\*|\*(.*?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <Text key={`t${lastIndex}`}>{text.slice(lastIndex, match.index)}</Text>,
      );
    }

    if (match[1]?.startsWith('**')) {
      parts.push(
        <Text key={`b${match.index}`} style={{ fontWeight: '700' }}>
          {match[2]}
        </Text>,
      );
    } else if (match[1]?.startsWith('*')) {
      parts.push(
        <Text key={`i${match.index}`} style={{ fontStyle: 'italic' }}>
          {match[3]}
        </Text>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<Text key={`t${lastIndex}`}>{text.slice(lastIndex)}</Text>);
  }

  return parts.length > 0 ? parts : [<Text key="0">{text}</Text>];
}

export function renderMarkdown(text: string): React.ReactNode[] {
  if (!text) {
    return [
      <Text key="empty" style={{ fontStyle: 'italic', opacity: 0.6 }}>
        No information available.
      </Text>,
    ];
  }

  const blocks = text.split('\n\n').filter(p => p.trim());
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();

    if (block.startsWith('**Word:**') || block.startsWith('Word:')) {
      const lines = block.split('\n').map(l => l.trim());
      elements.push(
        <Text key={`word-${i}`} style={styles.wordCard}>
          {lines.map((line, j) => {
            if (
              line.match(/^\*\*Word:\*\*/i) ||
              line.match(/^Word:/i)
            ) {
              const wordText = line.replace(/^\*\*Word:\*\*\s*/i, '').replace(/^Word:\s*/i, '');
              return (
                <Text key={j} style={styles.wordOriginal}>
                  {wordText}
                  {'\n'}
                </Text>
              );
            }
            if (
              line.match(/^\*\*Original Language:\*\*/i) ||
              line.match(/^\*\*(Greek|Hebrew|Aramaic|Language):\*\*/i) ||
              line.match(/^(Greek|Hebrew|Aramaic|Language):/i) ||
              line.match(/^\*\*Transliteration:\*\*/i) ||
              line.match(/^Transliteration:/i)
            ) {
              return (
                <Text key={j} style={styles.wordTransliteration}>
                  {line}
                  {'\n'}
                </Text>
              );
            }
            if (
              line.match(/^\*\*Meaning:\*\*/i) ||
              line.match(/^Meaning:/i)
            ) {
              const meaningText = line.replace(/^\*\*Meaning:\*\*\s*/i, '').replace(/^Meaning:\s*/i, '');
              return (
                <Text key={j} style={styles.wordMeaning}>
                  {meaningText}
                  {'\n'}
                </Text>
              );
            }
            return (
              <Text key={j} style={styles.wordMeaning}>
                {line}
                {'\n'}
              </Text>
            );
          })}
        </Text>,
      );
      continue;
    }

    // Check for historical context labels
    const isContextLabel =
      block.startsWith('**Author:**') ||
      block.startsWith('**Date:**') ||
      block.startsWith('**Audience:**') ||
      block.startsWith('**Purpose:**') ||
      block.startsWith('**Immediate Context:**');

    if (isContextLabel) {
      const labelMap: Record<string, string> = {
        '**Author:**': 'Author',
        '**Date:**': 'Date',
        '**Audience:**': 'Audience',
        '**Purpose:**': 'Purpose',
        '**Immediate Context:**': 'Immediate Context',
      };

      const lines = block.split('\n').map(l => l.trim());
      elements.push(
        <Text key={`ctx-${i}`} style={styles.contextBlock}>
          {lines.map((line, j) => {
            for (const [prefix, label] of Object.entries(labelMap)) {
              if (line.startsWith(prefix)) {
                const value = line.replace(prefix, '').trim();
                return (
                  <Text key={j}>
                    <Text style={styles.contextLabel}>{label}:</Text>
                    {` ${value}`}
                    {'\n'}
                  </Text>
                );
              }
            }
            return (
              <Text key={j} style={styles.contextBody}>
                {parseInlineFormatting(line)}
                {'\n'}
              </Text>
            );
          })}
        </Text>,
      );
      continue;
    }

    elements.push(
      <Text key={`p-${i}`} style={styles.paragraph}>
        {parseInlineFormatting(block)}
      </Text>,
    );
  }

  return elements;
}

const styles = {
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: '#4a3f2f',
    marginBottom: 12,
  },
  wordCard: {
    backgroundColor: '#faf6ed',
    borderWidth: 1,
    borderColor: '#e8dfc8',
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
    overflow: 'hidden',
  } as any,
  wordOriginal: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a2744',
    marginBottom: 2,
  },
  wordTransliteration: {
    fontSize: 14,
    color: '#c9a84c',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  wordMeaning: {
    fontSize: 15,
    color: '#4a3f2f',
    lineHeight: 22,
  },
  contextBlock: {
    marginBottom: 12,
  },
  contextLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a2744',
  },
  contextBody: {
    fontSize: 16,
    lineHeight: 26,
    color: '#4a3f2f',
  },
};
