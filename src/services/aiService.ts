import CONFIG from '../config';
import { VerseData } from '../types';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callAI(
  prompt: string,
  systemContext: string,
  maxTokens = 2000,
): Promise<string> {
  if (!CONFIG.OPENAI_API_KEY) {
    throw new Error(
      'Add your OpenAI API key in src/config.ts',
    );
  }

  const messages: AIMessage[] = [
    { role: 'system', content: systemContext },
    { role: 'user', content: prompt },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CONFIG.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: CONFIG.OPENAI_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = errorData.error?.message || `API error ${response.status}`;
    if (response.status === 429 || response.status === 402) {
      throw new Error(
        'API quota exceeded. The AI features need a paid OpenAI plan. The verse text is still displayed below.',
      );
    }
    throw new Error(msg);
  }

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content?.trim();

  if (!result) {
    throw new Error('Empty response from AI. Please try again.');
  }

  return result;
}

export function buildSystemPrompt(verse: VerseData): string {
  return `You are Bible Teacher, an expert AI Bible study assistant. You have deep knowledge of:
- Biblical Greek, Hebrew, and Aramaic
- Historical and cultural context of the Bible
- Theological interpretation across Christian traditions
- Practical Christian living

The verse being studied is: ${verse.reference}
Verse text: "${verse.text}"

Keep explanations clear, warm, and accessible to all believers including new Christians.`;
}

export async function getCombinedAnalysis(
  verse: VerseData,
  systemPrompt: string,
): Promise<{ meaning: string; language: string; context: string; application: string }> {
  const prompt = `Analyze ${verse.reference} ("${verse.text}") and return your response in exactly 4 clearly separated sections labeled exactly as shown below.

[SIMPLE MEANING]
Write 2-3 paragraphs explaining this verse in simple, clear language that any Christian can understand. Be warm, pastoral, and accessible.

[ORIGINAL LANGUAGE ANALYSIS]
Analyze 2-4 key words from this verse in their original language (Hebrew, Greek, or Aramaic as appropriate). For each word provide: the English word, the original language name, a transliteration, and the deep meaning/significance.

[HISTORICAL AND BIBLICAL CONTEXT]
Provide who wrote this book, when, to whom, and why. Then explain the surrounding passage context and the historical/cultural background in 2-3 paragraphs.

[LIFE APPLICATION]
Give 3-4 practical, specific, and actionable life applications for modern Christians. Write in a warm, encouraging tone.`;

  const result = await callAI(prompt, systemPrompt, 2500);

  const extract = (label: string): string => {
    const regex = new RegExp(`\\[${label}\\]([\\s\\S]*?)(?=\\[|$)`, 'i');
    const match = result.match(regex);
    return match ? match[1].trim() : `(${label.replace(/_/g, ' ')} not available)`;
  };

  return {
    meaning: extract('SIMPLE MEANING'),
    language: extract('ORIGINAL LANGUAGE ANALYSIS'),
    context: extract('HISTORICAL AND BIBLICAL CONTEXT'),
    application: extract('LIFE APPLICATION'),
  };
}

export async function chatWithAI(
  verse: VerseData,
  question: string,
  history: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> {
  const systemPrompt = `You are Bible Teacher, an expert AI Bible study assistant focused specifically on ${verse.reference}.
Verse text: "${verse.text}"
Keep all answers focused on this verse. Be insightful, warm, and scholarly yet accessible.
Answer in 2-4 paragraphs. Use plain language. Mention original language insights when relevant.`;

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
  ];

  for (const msg of history) {
    messages.push({ role: msg.role, content: msg.content });
  }

  messages.push({ role: 'user', content: question });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CONFIG.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: CONFIG.OPENAI_MODEL,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = errorData.error?.message || 'AI request failed. Please try again.';
    if (response.status === 429) {
      throw new Error('Chat is temporarily unavailable due to API limits. Please try again later.');
    }
    throw new Error(msg);
  }

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content?.trim();

  if (!result) {
    throw new Error('Empty response from AI. Please try again.');
  }

  return result;
}
