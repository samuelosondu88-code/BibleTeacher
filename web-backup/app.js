// ============================================
//   BibleTeecha — Frontend App Logic (app.js)
//   Pure Vanilla JS — no frameworks needed
// ============================================

// ---------- STATE ----------
let currentVerse   = '';   // e.g. "John 3:16"
let currentVerseText = ''; // full verse text
let chatHistory    = [];   // conversation history for AI chat
let isLoading      = false;

// ---------- ELEMENTS ----------
const verseInput     = document.getElementById('verseInput');
const loadingSection = document.getElementById('loadingSection');
const errorSection   = document.getElementById('errorSection');
const resultsSection = document.getElementById('resultsSection');
const heroSection    = document.getElementById('home');
const loadingFill    = document.getElementById('loadingFill');
const loadingSub     = document.getElementById('loadingSub');
const chatMessages   = document.getElementById('chatMessages');
const chatInput      = document.getElementById('chatInput');
const chatSendBtn    = document.getElementById('chatSendBtn');

// ---------- QUICK SEARCH ----------
function quickSearch(ref) {
  verseInput.value = ref;
  explainVerse();
}

// ---------- ACCORDION ----------
function toggleAccord(id) {
  const item = document.getElementById(id);
  const body = item.querySelector('.accord-body');
  const isOpen = item.classList.contains('open');

  if (isOpen) {
    item.classList.remove('open');
    body.style.display = 'none';
  } else {
    item.classList.add('open');
    body.style.display = 'block';
  }
}

// ---------- SHOW / HIDE SECTIONS ----------
function showLoading() {
  heroSection.style.display     = 'none';
  errorSection.style.display    = 'none';
  resultsSection.style.display  = 'none';
  loadingSection.style.display  = 'block';
  loadingFill.style.width       = '0%';
}

function showResults() {
  loadingSection.style.display = 'none';
  errorSection.style.display   = 'none';
  resultsSection.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showError(msg) {
  loadingSection.style.display = 'none';
  resultsSection.style.display = 'none';
  errorSection.style.display   = 'block';
  document.getElementById('errorMsg').textContent = msg || 'Something went wrong. Please try again.';
  heroSection.style.display = 'none';
}

function resetApp() {
  heroSection.style.display    = 'block';
  loadingSection.style.display = 'none';
  errorSection.style.display   = 'none';
  resultsSection.style.display = 'none';
  verseInput.value = '';
  currentVerse     = '';
  currentVerseText = '';
  chatHistory      = [];
  chatMessages.innerHTML = `
    <div class="chat-bubble assistant">
      <span class="bubble-text">I'm ready to answer your questions about this verse. Ask me anything — about the original language, historical background, theology, or how it applies to your life today.</span>
    </div>`;
}

// ---------- PROGRESS BAR SIMULATION ----------
function animateProgress(start, end, duration, label) {
  const steps   = 30;
  const stepTime = duration / steps;
  const stepSize = (end - start) / steps;
  let current = start;
  const timer = setInterval(() => {
    current += stepSize;
    loadingFill.style.width = Math.min(current, end) + '%';
    if (current >= end) clearInterval(timer);
  }, stepTime);
  if (label) loadingSub.textContent = label;
}

// ---------- FETCH VERSE TEXT ----------
async function fetchVerseText(reference) {
  // Bible-API.com — free, no key needed
  const encoded  = encodeURIComponent(reference);
  const url      = `https://bible-api.com/${encoded}?translation=kjv`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Verse not found. Please check the reference and try again.');
  const data = await response.json();
  if (data.error) throw new Error('Verse not found: ' + data.error);
  return {
    reference: data.reference,
    text: data.text.replace(/\n/g, ' ').trim(),
    translation: data.translation_name || 'King James Version'
  };
}

// ---------- CALL NETLIFY FUNCTION (AI) ----------
async function callAI(prompt, systemContext) {
  const response = await fetch('/.netlify/functions/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemContext })
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'AI request failed. Please try again.');
  }
  const data = await response.json();
  return data.result;
}

// ---------- RENDER MARKDOWN-LITE ----------
// Converts **bold**, *italic*, and numbered lines into HTML
function renderText(text) {
  if (!text) return '<p>No information available.</p>';
  return text
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => {
      // Convert **bold**
      p = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Convert *italic*
      p = p.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Word / Lang blocks: detect "Word: X\nLanguage: Y\nMeaning: Z"
      if (p.match(/^Word:/i)) {
        const lines = p.split('\n').map(l => l.trim());
        let html = '<div class="lang-word">';
        lines.forEach(line => {
          if (line.match(/^Word:/i)) {
            html += `<div class="lang-word-original">${line.replace(/^Word:\s*/i, '')}</div>`;
          } else if (line.match(/^(Greek|Hebrew|Aramaic|Language):/i)) {
            html += `<div class="lang-word-transliteration">${line}</div>`;
          } else if (line.match(/^Meaning:/i)) {
            html += `<div class="lang-word-meaning">${line.replace(/^Meaning:\s*/i, '')}</div>`;
          } else if (line) {
            html += `<div class="lang-word-meaning">${line}</div>`;
          }
        });
        html += '</div>';
        return html;
      }
      return `<p>${p}</p>`;
    })
    .join('');
}

// ---------- MAIN EXPLAIN FUNCTION ----------
async function explainVerse() {
  if (isLoading) return;
  const query = verseInput.value.trim();
  if (!query) {
    verseInput.focus();
    verseInput.style.borderColor = '#c9a84c';
    setTimeout(() => verseInput.style.borderColor = '', 2000);
    return;
  }

  isLoading = true;
  showLoading();

  try {
    // Step 1: Get verse text
    animateProgress(0, 20, 600, 'Retrieving verse text…');
    const verse = await fetchVerseText(query);
    currentVerse     = verse.reference;
    currentVerseText = verse.text;

    // Update verse display
    document.getElementById('verseRefBadge').textContent = verse.reference;
    document.getElementById('verseText').textContent     = verse.text;
    document.getElementById('verseMeta').textContent     = verse.translation;
    document.getElementById('chatVerseRef').textContent  = verse.reference;

    // Reset chat
    chatHistory = [];
    chatMessages.innerHTML = `
      <div class="chat-bubble assistant">
        <span class="bubble-text">I'm ready to answer your questions about <strong>${verse.reference}</strong>. Ask me anything!</span>
      </div>`;

    // Clear accordion content (show skeletons)
    ['meaning','language','context','application'].forEach(id => {
      document.getElementById('content-' + id).innerHTML =
        '<div class="skeleton-lines"><div></div><div></div><div></div></div>';
    });
    // Open first section
    ['sec-meaning','sec-language','sec-context','sec-application'].forEach((id, i) => {
      const item = document.getElementById(id);
      const body = item.querySelector('.accord-body');
      if (i === 0) { item.classList.add('open'); body.style.display = 'block'; }
      else          { item.classList.remove('open'); body.style.display = 'none'; }
    });

    showResults();

    const systemPrompt = `You are BibleTeecha, an expert AI Bible study assistant. You have deep knowledge of:
- Biblical Greek, Hebrew, and Aramaic
- Historical and cultural context of the Bible
- Theological interpretation across Christian traditions
- Practical Christian living

The verse being studied is: ${verse.reference}
Verse text: "${verse.text}"

Keep explanations clear, warm, and accessible to all believers including new Christians.`;

    // Step 2: Simple Meaning
    animateProgress(20, 40, 800, 'Generating simple explanation…');
    const meaningResult = await callAI(
      `Explain this verse in simple, clear language that any Christian can understand: "${verse.reference}" — "${verse.text}". Write 2–3 paragraphs. Be warm, pastoral, and accessible.`,
      systemPrompt
    );
    document.getElementById('content-meaning').innerHTML = renderText(meaningResult);

    // Step 3: Original Language Analysis
    animateProgress(40, 60, 800, 'Analyzing original language…');
    const languageResult = await callAI(
      `Analyze the key words from ${verse.reference} ("${verse.text}") in their original language (Hebrew, Greek, or Aramaic as appropriate). For each key word, provide:
Word: [English word]
Greek/Hebrew: [original word]  
Meaning: [deep meaning and significance]

Identify 2–4 key words maximum. Focus on words that reveal deeper spiritual meaning.`,
      systemPrompt
    );
    document.getElementById('content-language').innerHTML = renderText(languageResult);

    // Step 4: Historical Context
    animateProgress(60, 80, 800, 'Researching historical context…');
    const contextResult = await callAI(
      `Provide the historical and biblical context for ${verse.reference} ("${verse.text}"). Explain: who wrote it, when, why, the surrounding story, and what it meant to the original audience. Write 2–3 paragraphs.`,
      systemPrompt
    );
    document.getElementById('content-context').innerHTML = renderText(contextResult);

    // Step 5: Life Application
    animateProgress(80, 100, 600, 'Preparing life applications…');
    const applicationResult = await callAI(
      `Give 3–4 practical life applications of ${verse.reference} ("${verse.text}") for modern Christians. Make them specific, actionable, and encouraging. Write in a warm, pastoral tone.`,
      systemPrompt
    );
    document.getElementById('content-application').innerHTML = renderText(applicationResult);

    // Update chat system prompt
    chatHistory = [];

  } catch (err) {
    console.error(err);
    showError(err.message || 'An error occurred. Please try again.');
  } finally {
    isLoading = false;
  }
}

// ---------- CHAT FUNCTIONS ----------
function addChatBubble(text, role, isThinking) {
  const div = document.createElement('div');
  div.className = 'chat-bubble ' + role;
  if (isThinking) {
    div.innerHTML = '<div class="thinking-dots"><span></span><span></span><span></span></div>';
    div.id = 'thinking-bubble';
  } else {
    div.innerHTML = `<span class="bubble-text">${text}</span>`;
  }
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

async function sendChat() {
  const question = chatInput.value.trim();
  if (!question || !currentVerse) return;
  if (chatSendBtn.disabled) return;

  chatInput.value = '';
  chatSendBtn.disabled = true;

  // Add user bubble
  addChatBubble(question, 'user');

  // Add thinking bubble
  const thinkingBubble = addChatBubble('', 'thinking', true);

  try {
    // Build conversation for context
    chatHistory.push({ role: 'user', content: question });

    const systemPrompt = `You are BibleTeecha, an expert AI Bible study assistant focused specifically on ${currentVerse}.
Verse text: "${currentVerseText}"
Keep all answers focused on this verse. Be insightful, warm, and scholarly yet accessible.
Answer in 2–4 paragraphs. Use plain language. Mention original language insights when relevant.`;

    const conversationContext = chatHistory.length > 2
      ? 'Previous questions in this session:\n' +
        chatHistory.slice(-4, -1).map(m => `${m.role === 'user' ? 'Q' : 'A'}: ${m.content}`).join('\n') +
        '\n\nCurrent question: ' + question
      : question;

    const answer = await callAI(conversationContext, systemPrompt);
    chatHistory.push({ role: 'assistant', content: answer });

    // Remove thinking, add real answer
    thinkingBubble.remove();
    addChatBubble(answer.replace(/\n/g, '<br>'), 'assistant');

  } catch (err) {
    thinkingBubble.remove();
    addChatBubble('Sorry, I had trouble answering that. Please try again.', 'assistant');
  } finally {
    chatSendBtn.disabled = false;
    chatInput.focus();
  }
}

function askSuggestion(btn) {
  chatInput.value = btn.textContent;
  sendChat();
}

// ---------- ENTER KEY on search ----------
verseInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') explainVerse();
});

// ---------- KEYBOARD SHORTCUT (Escape to reset) ----------
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && resultsSection.style.display !== 'none') {
    resetApp();
  }
});
