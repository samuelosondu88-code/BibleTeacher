import CONFIG from '../config';
import { VerseData } from '../types';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callAI(
  prompt: string,
  systemContext: string,
): Promise<string> {
  if (!CONFIG.OPENAI_API_KEY) {
    throw new Error(
      'OpenAI API key not configured. Please add your API key in src/config.ts',
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
      max_tokens: 900,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error?.message || 'AI request failed. Please try again.',
    );
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

export async function getSimpleMeaning(
  verse: VerseData,
  systemPrompt: string,
): Promise<string> {
  return callAI(
    `Explain this verse in simple, clear language that any Christian can understand: "${verse.reference}" — "${verse.text}". Write 2–3 paragraphs. Be warm, pastoral, and accessible.`,
    systemPrompt,
  );
}

export async function getOriginalLanguageAnalysis(
  verse: VerseData,
  systemPrompt: string,
): Promise<string> {
  return callAI(
    `Analyze the key words from ${verse.reference} ("${verse.text}") in their original language (Hebrew, Greek, or Aramaic as appropriate). For each key word, provide:

**Word:** [English word]
**Original Language:** [Greek/Hebrew/Aramaic]
**Transliteration:** [transliteration]
**Meaning:** [deep meaning and significance]

Identify 2–4 key words maximum. Focus on words that reveal deeper spiritual meaning.`,
    systemPrompt,
  );
}

export async function getHistoricalContext(
  verse: VerseData,
  systemPrompt: string,
): Promise<string> {
  return callAI(
    `Provide the historical and biblical context for ${verse.reference} ("${verse.text}"). Include:

**Author:** [who wrote it]
**Date:** [when it was written]
**Audience:** [who it was written to]
**Purpose:** [why it was written]
**Immediate Context:** [surrounding passage context]

Then write 2–3 paragraphs explaining the deeper historical and cultural background.`,
    systemPrompt,
  );
}

export async function getLifeApplication(
  verse: VerseData,
  systemPrompt: string,
): Promise<string> {
  return callAI(
    `Give 3–4 practical life applications of ${verse.reference} ("${verse.text}") for modern Christians. Make them specific, actionable, and encouraging. Write in a warm, pastoral tone.`,
    systemPrompt,
  );
}

export async function chatWithAI(
  verse: VerseData,
  question: string,
  history: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> {
  const systemPrompt = `You are Bible Teacher, an expert AI Bible study assistant focused specifically on ${verse.reference}.
Verse text: "${verse.text}"
Keep all answers focused on this verse. Be insightful, warm, and scholarly yet accessible.
Answer in 2–4 paragraphs. Use plain language. Mention original language insights when relevant.`;

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
    const errorData = await response.json();
    throw new Error(
      errorData.error?.message || 'AI request failed. Please try again.',
    );
  }

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content?.trim();

  if (!result) {
    throw new Error('Empty response from AI. Please try again.');
  }

  return result;
}
