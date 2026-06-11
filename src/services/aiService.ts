import CONFIG from '../config';
import { VerseData } from '../types';

function buildGeminiUrl(): string {
  return `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${CONFIG.OPENAI_API_KEY}`;
}

async function callGemini(
  prompt: string,
  systemContext: string,
): Promise<string> {
  if (!CONFIG.OPENAI_API_KEY) {
    throw new Error(
      'Get a free API key at https://aistudio.google.com/app/apikey then add it in src/config.ts',
    );
  }

  const fullPrompt = `${systemContext}\n\n${prompt}`;

  const body = {
    contents: [
      {
        parts: [{ text: fullPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2800,
    },
  };

  const response = await fetch(buildGeminiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    let msg = `API error ${response.status}`;
    try {
      const errorData = JSON.parse(errorText);
      msg = errorData.error?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    throw new Error('Empty response from AI.');
  }
  return text;
}

function extractJSON(text: string): any {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  const cleaned = jsonMatch[0].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\t/g, '  ');
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
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
  const prompt = `Analyze ${verse.reference} ("${verse.text}") and respond as valid JSON only. Use exactly this structure:

{
  "simple_meaning": "2-3 paragraphs explaining this verse in simple clear language...",
  "original_language": "For each key word (2-5 words):\\n**Word:** [English]\\n**Strong's Number:** [e.g. G26 or H7225]\\n**Original:** [word in Greek/Hebrew/Aramaic script]\\n**Transliteration:** [pronunciation]\\n**Root:** [root word and meaning]\\n**Word Type:** [grammatical details]\\n**Meaning:** [lexical meaning in context]",
  "historical_context": "Author, date, audience, purpose, surrounding context, and historical background in 2-3 paragraphs",
  "life_application": "3-4 practical, actionable applications for modern Christians"
}

Return ONLY the JSON object. No markdown, no code fences, no extra text.`;

  try {
    const result = await callGemini(prompt, systemPrompt);
    const parsed = extractJSON(result);
    if (parsed) {
      return {
        meaning: parsed.simple_meaning || parsed.meaning || '',
        language: parsed.original_language || parsed.language || '',
        context: parsed.historical_context || parsed.context || '',
        application: parsed.life_application || parsed.application || '',
      };
    }
    return { meaning: result || '', language: '', context: '', application: '' };
  } catch (err: any) {
    const msg = err.message || '';
    return {
      meaning: `**Analysis unavailable**\n\n${msg}`,
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
  if (!CONFIG.OPENAI_API_KEY) {
    throw new Error(
      'Get a free API key at https://aistudio.google.com/app/apikey then add it in src/config.ts',
    );
  }

  const systemPrompt = `You are BibleTeecha, an expert AI Bible study assistant focused specifically on ${verse.reference}.
Verse text: "${verse.text}"
Keep all answers focused on this verse. Be insightful, warm, and scholarly yet accessible.
Answer in 2-4 paragraphs. Use plain language. Mention original language insights when relevant.`;

  const contents: any[] = [{ role: 'user', parts: [{ text: systemPrompt }] }];

  for (const msg of history) {
    const role = msg.role === 'assistant' ? 'model' : 'user';
    contents.push({ role, parts: [{ text: msg.content }] });
  }

  contents.push({ role: 'user', parts: [{ text: question }] });

  const body = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    },
  };

  const response = await fetch(buildGeminiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    let msg = 'AI request failed.';
    try {
      const errorData = JSON.parse(errorText);
      msg = errorData.error?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    throw new Error('Empty response from AI.');
  }
  return text;
}
