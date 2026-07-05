import CONFIG from '../config';
import { VerseData } from '../types';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free models available on OpenRouter (no credit card needed)
const MODELS = {
  PRIMARY: 'meta-llama/llama-3.2-3b-instruct',
  FALLBACK: 'google/gemini-2.0-flash-001',
};

async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string,
  options?: { maxTokens?: number; model?: string },
): Promise<string> {
  if (!CONFIG.OPENAI_API_KEY) {
    throw new Error(
      'Get a free API key at https://openrouter.ai/keys then add it in src/config.ts',
    );
  }

  const body = {
    model: options?.model || MODELS.PRIMARY,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: options?.maxTokens || 2800,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CONFIG.OPENAI_API_KEY}`,
        'HTTP-Referer': 'https://bibleteecha.app',
        'X-Title': 'BibleTeecha',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      let msg = `API error ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        msg = errorData.error?.message || errorData.error || msg;
      } catch {}
      throw new Error(msg);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error('Empty response from AI.');
    }
    return text;
  } finally {
    clearTimeout(timeoutId);
  }
}

function extractJSON(text: string): any {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  const raw = jsonMatch[0]
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\t/g, '  ');
  try {
    return JSON.parse(raw);
  } catch {
    try {
      const fixed = raw
        .replace(/(['"])?([a-zA-Z_][a-zA-Z0-9_]*)(['"])?\s*:/g, '"$2":')
        .replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(fixed);
    } catch {
      return null;
    }
  }
}

export function buildSystemPrompt(verse: VerseData): string {
  return `You are BibleTeecha, an expert AI Bible study assistant. You have deep knowledge of:
- Biblical Greek, Hebrew, and Aramaic (including Strong's Concordance numbers)
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
  const userPrompt = `Analyze ${verse.reference} ("${verse.text}") and respond as valid JSON only. Use exactly this structure:

{
  "simple_meaning": "2-3 paragraphs explaining this verse in simple clear language...",
  "original_language": "For each key word (2-5 words):\n**Word:** [English]\n**Strong's Number:** [e.g. G26 or H7225]\n**Original:** [word in Greek/Hebrew/Aramaic script]\n**Transliteration:** [pronunciation]\n**Root:** [root word and meaning]\n**Word Type:** [grammatical details]\n**Meaning:** [lexical meaning in context]",
  "historical_context": "Author, date, audience, purpose, surrounding context, and historical background in 2-3 paragraphs",
  "life_application": "3-4 practical, actionable applications for modern Christians"
}

Return ONLY the JSON object. No markdown, no code fences, no extra text.`;

  // Try primary model first, fallback to secondary if it fails
  const modelsToTry = [MODELS.PRIMARY, MODELS.FALLBACK];

  for (let i = 0; i < modelsToTry.length; i++) {
    try {
      const result = await callOpenRouter(systemPrompt, userPrompt, {
        model: modelsToTry[i],
        maxTokens: 2800,
      });
      const parsed = extractJSON(result);
      if (parsed) {
        return {
          meaning: parsed.simple_meaning || parsed.meaning || '',
          language: parsed.original_language || parsed.language || '',
          context: parsed.historical_context || parsed.context || '',
          application: parsed.life_application || parsed.application || '',
        };
      }
      // If JSON parsing failed but we have text, show it as meaning
      if (result && i === modelsToTry.length - 1) {
        return { meaning: result, language: '', context: '', application: '' };
      }
    } catch (err: any) {
      // On last attempt, propagate the error
      if (i === modelsToTry.length - 1) {
        throw err;
      }
    }
  }

  throw new Error('All AI models failed.');
}

export function isQuotaError(err: any): boolean {
  const msg = (err?.message || '').toLowerCase();
  return (
    msg.includes('quota') ||
    msg.includes('429') ||
    msg.includes('rate limit') ||
    msg.includes('insufficient') ||
    msg.includes('exceeded') ||
    msg.includes('402')
  );
}

export async function chatWithAI(
  verse: VerseData,
  question: string,
  history: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> {
  if (!CONFIG.OPENAI_API_KEY) {
    throw new Error(
      'Get a free API key at https://openrouter.ai/keys then add it in src/config.ts',
    );
  }

  const messages: { role: string; content: string }[] = [
    {
      role: 'system',
      content: `You are BibleTeecha, an AI Bible study assistant focused on ${verse.reference}.
Verse text: "${verse.text}"
Answer questions about this verse. Be insightful, warm, and accessible.`,
    },
  ];

  for (const msg of history) {
    messages.push({ role: msg.role, content: msg.content });
  }

  messages.push({ role: 'user', content: question });

  const body = {
    model: MODELS.PRIMARY,
    messages,
    temperature: 0.7,
    max_tokens: 1000,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CONFIG.OPENAI_API_KEY}`,
        'HTTP-Referer': 'https://bibleteecha.app',
        'X-Title': 'BibleTeecha',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      let msg = 'AI request failed.';
      try {
        const errorData = JSON.parse(errorText);
        msg = errorData.error?.message || errorData.error || msg;
      } catch {}
      throw new Error(msg);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error('Empty response from AI.');
    }
    return text;
  } finally {
    clearTimeout(timeoutId);
  }
}
