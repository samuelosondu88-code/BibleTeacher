// BibleTeecha - Configuration
// Get a FREE OpenRouter API key at https://openrouter.ai/keys
// No credit card needed — many free models available (Llama 3.2, Gemini 2.0 Flash, etc.)
// The GitHub Actions workflow injects the key from secrets.OPENAI_API_KEY at build time.
// For local dev, paste your key between the quotes below.
const CONFIG = {
  OPENAI_API_KEY: '',
  BIBLE_API_URL: 'https://bible-api.com',
  BIBLE_TRANSLATION: 'kjv',
};

export default CONFIG;
