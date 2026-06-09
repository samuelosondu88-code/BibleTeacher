import CONFIG from '../config';
import { VerseData } from '../types';

export async function fetchVerse(reference: string): Promise<VerseData> {
  const encoded = encodeURIComponent(reference);
  const url = `${CONFIG.BIBLE_API_URL}/${encoded}?translation=${CONFIG.BIBLE_TRANSLATION}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Verse not found. Please check the reference and try again.');
  }

  const data = await response.json();
  if (data.error) {
    throw new Error('Verse not found: ' + data.error);
  }

  return {
    reference: data.reference,
    text: data.text.replace(/\n/g, ' ').trim(),
    translation: data.translation_name || 'King James Version',
  };
}
