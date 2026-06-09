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
  const prompt = `Analyze ${verse.reference} ("${verse.text}") and return your response as valid JSON only (no markdown, no code fences). Use exactly this structure:

{
  "simple_meaning": "2-3 paragraphs explaining this verse in simple, clear language...",
  "original_language": "For each key word (2-5 words), provide:\\n**Word:** [English]\\n**Strong's Number:** [e.g. G26]\\n**Original:** [Greek/Hebrew/Aramaic script]\\n**Transliteration:** [pronunciation]\\n**Root:** [root word and meaning]\\n**Word Type:** [grammatical details]\\n**Meaning:** [lexical meaning in context]\\n**Related Words:** [same-root words]",
  "historical_context": "Author, date, audience, purpose, surrounding context, historical background in 2-3 paragraphs",
  "life_application": "3-4 practical, actionable applications for modern Christians"
}

CRITICAL: Return ONLY valid JSON, nothing else. No explanations, no greetings, no markdown.`;

  const result = await callAI(prompt, systemPrompt, 2800);

  try {
    const jsonStr = result.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    const parsed = JSON.parse(jsonStr);
    return {
      meaning: parsed.simple_meaning || parsed.meaning || '',
      language: parsed.original_language || parsed.language || '',
      context: parsed.historical_context || parsed.context || '',
      application: parsed.life_application || parsed.application || '',
    };
  } catch {
    const lines = result.split('\n').filter(l => l.trim());
    return {
      meaning: lines.slice(0, Math.ceil(lines.length / 4)).join('\n') || '',
      language: '',
      context: '',
      application: '',
    };
  }
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
