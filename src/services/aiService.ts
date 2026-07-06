import CONFIG from '../config';
import { VerseData } from '../types';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODELS = {
  PRIMARY: 'meta-llama/llama-3.3-70b-instruct:free',
  FALLBACK: 'openrouter/free',
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
  const timeoutId = setTimeout(() => controller.abort(), 60000);

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

  const tryParse = (s: string) => {
    try { return JSON.parse(s); } catch { return null; }
  };

  let parsed = tryParse(raw);
  if (parsed) return parsed;

  const fixed = raw
    .replace(/(['"])?([a-zA-Z_][a-zA-Z0-9_]*)(['"])?\s*:/g, '"$2":')
    .replace(/,\s*([}\]])/g, '$1');
  parsed = tryParse(fixed);
  if (parsed) return parsed;

  const withStringValues = raw
    .replace(/:\s*([^"{}\[\],\n]+)([,}\n])/g, ':"$1"$2')
    .replace(/:\s*'([^']*)'/g, ':"$1"');
  parsed = tryParse(withStringValues);
  if (parsed) return parsed;

  return null;
}

function detectSectionHeader(line: string): string | null {
  const trimmed = line.trim();
  if (trimmed.length > 120) return null;

  const lower = trimmed.toLowerCase();

  const stripped = lower
    .replace(/^#+\s*/, '')
    .replace(/^\d+[\.\)]\s*/, '')
    .replace(/^\*+/, '')
    .replace(/\*+$/, '')
    .replace(/^\s*[-–—]\s*/, '')
    .trim();

  if (/^(simple\s+)?meaning/.test(stripped)) return 'meaning';
  if (/^(original\s+)?language\s*(insight)?/.test(stripped)) return 'language';
  if (/^(historical|biblical)\s*(\&|\sand\s)?\s*(context|background)/.test(stripped)) return 'context';
  if (/^historical\b/.test(stripped)) return 'context';
  if (/^life\s+application/.test(stripped)) return 'application';
  if (/^application/.test(stripped)) return 'application';

  if (/^1\.?\s*(simple\s+)?meaning/i.test(trimmed)) return 'meaning';
  if (/^2\.?\s*(original\s+)?language/i.test(trimmed)) return 'language';
  if (/^3\.?\s*(historical|biblical)/i.test(trimmed)) return 'context';
  if (/^4\.?\s*(life\s+)?application/i.test(trimmed)) return 'application';

  if (/^(meaning|language|context|application)\s*:/.test(stripped + ':')) {
    const m = stripped.match(/^(meaning|language|context|application)/);
    if (m) return m[1] === 'meaning' ? 'meaning' : m[1] === 'language' ? 'language' : m[1] === 'context' ? 'context' : 'application';
  }

  return null;
}

function extractSectionsFromMarkdown(text: string): {
  meaning: string;
  language: string;
  context: string;
  application: string;
} {
  const result = { meaning: '', language: '', context: '', application: '' };
  const lines = text.split('\n');
  let currentSection = '';
  const sections: Record<string, string[]> = {};

  for (const line of lines) {
    const header = detectSectionHeader(line);
    if (header) {
      currentSection = header;
      continue;
    }
    if (currentSection) {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
    }
  }

  result.meaning = (sections.meaning || []).join('\n').trim();
  result.language = (sections.language || []).join('\n').trim();
  result.context = (sections.context || []).join('\n').trim();
  result.application = (sections.application || []).join('\n').trim();

  return result;
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

function splitByNumberedSections(text: string): {
  meaning: string; language: string; context: string; application: string;
} | null {
  const sections = { meaning: '', language: '', context: '', application: '' };
  const lines = text.split('\n');
  let current: string | null = null;
  const map: Record<string, string[]> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    const m = trimmed.match(/^\d+[\.\)]\s*(.+)/);
    if (m) {
      const heading = m[1].toLowerCase();
      if (/meaning|explanation/.test(heading)) current = 'meaning';
      else if (/language|greek|hebrew/.test(heading)) current = 'language';
      else if (/context|historical|background/.test(heading)) current = 'context';
      else if (/application|practical/.test(heading)) current = 'application';
      else current = null;
      continue;
    }
    if (current) {
      if (!map[current]) map[current] = [];
      map[current].push(line);
    }
  }

  sections.meaning = (map.meaning || []).join('\n').trim();
  sections.language = (map.language || []).join('\n').trim();
  sections.context = (map.context || []).join('\n').trim();
  sections.application = (map.application || []).join('\n').trim();

  if (sections.meaning || sections.language || sections.context || sections.application) {
    return sections;
  }
  return null;
}

export async function getCombinedAnalysis(
  verse: VerseData,
  systemPrompt: string,
): Promise<{ meaning: string; language: string; context: string; application: string }> {
  const userPrompt = `You are analyzing ${verse.reference} ("${verse.text}").

Respond with ONLY valid JSON using this exact structure (no other text, no markdown, no code fences):

{
  "simple_meaning": "2-3 paragraphs explaining this verse in simple clear language...",
  "original_language": "For each key word (2-5 words):\n**Word:** [English]\n**Strong's Number:** [e.g. G26 or H7225]\n**Original:** [word in Greek/Hebrew/Aramaic script]\n**Transliteration:** [pronunciation]\n**Root:** [root word and meaning]\n**Word Type:** [grammatical details]\n**Meaning:** [lexical meaning in context]",
  "historical_context": "Author, date, audience, purpose, surrounding context, and historical background in 2-3 paragraphs",
  "life_application": "3-4 practical, actionable applications for modern Christians"
}

JSON:`;

  const modelsToTry = [MODELS.PRIMARY, MODELS.FALLBACK];
  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    try {
      const result = await callOpenRouter(systemPrompt, userPrompt, {
        model: modelsToTry[i],
        maxTokens: 3500,
      });
      const parsed = extractJSON(result);
      if (parsed) {
        return {
          meaning: parsed.simple_meaning || parsed.meaning || parsed.Simple_Meaning || parsed['Simple Meaning'] || '',
          language: parsed.original_language || parsed.language || parsed.Original_Language || parsed['Original Language'] || '',
          context: parsed.historical_context || parsed.context || parsed.Historical_Context || parsed['Historical Context'] || parsed['Historical & Biblical Context'] || '',
          application: parsed.life_application || parsed.application || parsed.Life_Application || parsed['Life Application'] || '',
        };
      }
      const sections = extractSectionsFromMarkdown(result);
      if (sections.meaning || sections.language || sections.context || sections.application) {
        return sections;
      }
      const numbered = splitByNumberedSections(result);
      if (numbered) { return numbered; }
      if (i === modelsToTry.length - 1) {
        return { meaning: result, language: '', context: '', application: '' };
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  const msg = (lastError?.message || '').toLowerCase();
  if (msg.includes('no endpoints') || msg.includes('free') || msg.includes('not found')) {
    throw new Error(
      'The AI service is temporarily unavailable for free models. Your API key is valid but OpenRouter has no free endpoints available right now. Please try again later.',
    );
  }
  throw lastError || new Error('All AI models failed.');
}

export function isQuotaError(err: any): boolean {
  const msg = (err?.message || '').toLowerCase();
  return (
    msg.includes('quota') ||
    msg.includes('429') ||
    msg.includes('rate limit') ||
    msg.includes('insufficient') ||
    msg.includes('exceeded') ||
    msg.includes('402') ||
    msg.includes('no endpoints') ||
    msg.includes('free model') ||
    msg.includes('not enough credits')
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
  const timeoutId = setTimeout(() => controller.abort(), 60000);

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
