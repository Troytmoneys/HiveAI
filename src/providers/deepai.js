const { DEEP_AI_API_KEY } = process.env;

async function callDeepAI(prompt) {
  if (!DEEP_AI_API_KEY) {
    return { provider: 'deepai', error: 'Missing DEEP_AI_API_KEY' };
  }

  const response = await fetch('https://api.deepai.org/api/text-generator', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'api-key': DEEP_AI_API_KEY
    },
    body: new URLSearchParams({ text: prompt })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { provider: 'deepai', error: `API error: ${response.status} ${errorText}` };
  }

  const data = await response.json();
  const text = data?.output || 'No response text received.';
  return { provider: 'deepai', content: text };
}

module.exports = callDeepAI;
