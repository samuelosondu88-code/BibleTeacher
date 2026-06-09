// ============================================
//   BibleTeecha — Netlify Function
//   File: netlify/functions/explain.js
//   Calls OpenAI ChatGPT API on the server
//   API key is stored in Netlify env variable
// ============================================

exports.handler = async function (event, context) {

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Parse request body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  const { prompt, systemContext } = body;

  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No prompt provided' })
    };
  }

  // -------------------------------------------------------
  // YOUR OPENAI API KEY — stored in Netlify Environment Variables
  // In your Netlify dashboard:
  //   Site Settings → Environment Variables → Add variable
  //   Key:   OPENAI_API_KEY
  //   Value: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  ← your real key
  // -------------------------------------------------------
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in Netlify environment variables.' })
    };
  }

  // Build messages array for OpenAI
  const messages = [];

  if (systemContext) {
    messages.push({ role: 'system', content: systemContext });
  }

  messages.push({ role: 'user', content: prompt });

  // Call OpenAI API
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model:       'gpt-4o',          // Change to 'gpt-3.5-turbo' if you prefer lower cost
        messages:    messages,
        max_tokens:  900,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: errorData.error?.message || 'OpenAI API error. Please try again.'
        })
      };
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim();

    if (!result) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Empty response from AI. Please try again.' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ result })
    };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error: ' + err.message })
    };
  }
};
