const CONFIG = {
  OPENAI_API_KEY: '',
  BIBLE_API_URL: 'https://bible-api.com',
  BIBLE_TRANSLATION: 'kjv',
};

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pcm', label: 'Nigerian Pidgin' },
  { code: 'ha', label: 'Hausa' },
  { code: 'ig', label: 'Igbo' },
  { code: 'yo', label: 'Yoruba' },
] as const;

export const BIBLE_VERSIONS = [
  { id: 'kjv', label: 'King James Version (KJV)' },
  { id: 'asv', label: 'American Standard Version (ASV)' },
  { id: 'web', label: 'World English Bible (WEB)' },
  { id: 'bbe', label: 'Bible in Basic English (BBE)' },
  { id: 'drb', label: 'Douay-Rheims (DRB)' },
  { id: 'ylt', label: "Young's Literal Translation (YLT)" },
] as const;

export default CONFIG;
