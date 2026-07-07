import CONFIG from '../config';
import { VerseData } from '../types';

const BOOK_ALIASES: Record<string, string> = {
  gen: 'Genesis', ex: 'Exodus', lev: 'Leviticus', num: 'Numbers',
  deut: 'Deuteronomy', josh: 'Joshua', judg: 'Judges',
  ruth: 'Ruth', '1 sam': '1 Samuel', '2 sam': '2 Samuel',
  '1 kgs': '1 Kings', '2 kgs': '2 Kings',
  '1 chr': '1 Chronicles', '2 chr': '2 Chronicles',
  ezra: 'Ezra', neh: 'Nehemiah', esth: 'Esther', job: 'Job',
  ps: 'Psalm', psa: 'Psalm', prov: 'Proverbs', ecc: 'Ecclesiastes',
  song: 'Song of Solomon', isa: 'Isaiah',
  jer: 'Jeremiah', lam: 'Lamentations', ezek: 'Ezekiel', dan: 'Daniel',
  hos: 'Hosea', joel: 'Joel', amos: 'Amos', obad: 'Obadiah',
  jon: 'Jonah', mic: 'Micah', nah: 'Nahum', hab: 'Habakkuk',
  zeph: 'Zephaniah', hag: 'Haggai', zach: 'Zechariah', mal: 'Malachi',
  matt: 'Matthew', mk: 'Mark', lk: 'Luke', jn: 'John',
  acts: 'Acts',
  rom: 'Romans', '1 cor': '1 Corinthians', '2 cor': '2 Corinthians',
  gal: 'Galatians', eph: 'Ephesians', phil: 'Philippians',
  col: 'Colossians',
  '1 thes': '1 Thessalonians', '2 thes': '2 Thessalonians',
  '1 tim': '1 Timothy', '2 tim': '2 Timothy',
  titus: 'Titus', philem: 'Philemon',
  heb: 'Hebrews', james: 'James',
  '1 pet': '1 Peter', '2 pet': '2 Peter',
  '1 jn': '1 John', '2 jn': '2 John', '3 jn': '3 John',
  jude: 'Jude', rev: 'Revelation',
};

function normalizeReference(ref: string): string {
  const trimmed = ref.trim();
  const lower = trimmed.toLowerCase();
  const sortedAliases = Object.entries(BOOK_ALIASES).sort(
    ([a], [b]) => b.length - a.length,
  );
  for (const [alias, full] of sortedAliases) {
    if (lower === alias || lower.startsWith(alias + ' ')) {
      return full + trimmed.slice(alias.length);
    }
  }
  return trimmed;
}

export async function fetchVerse(
  reference: string,
  translation?: string,
): Promise<VerseData> {
  const normalized = normalizeReference(reference);
  if (!normalized) {
    throw new Error('Please enter a verse reference (e.g. "John 3:16").');
  }

  const encoded = encodeURIComponent(normalized);
  const trans = translation || CONFIG.BIBLE_TRANSLATION;
  const url = `${CONFIG.BIBLE_API_URL}/${encoded}?translation=${trans}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      'Verse not found. Try formats like "John 3:16", "Ps 23", or "Gen 1:1-10".',
    );
  }

  const data = await response.json();
  if (data.error) {
    throw new Error('Verse not found: ' + data.error);
  }

  return {
    reference: data.reference,
    text: data.text.replace(/\n/g, ' ').trim(),
    translation: data.translation_name || translation || 'King James Version',
  };
}
