const { OPENAI_API_KEY } = process.env;

async function callOpenAI(prompt) {
  if (!OPENAI_API_KEY) {
    return { provider: 'openai', error: 'Missing OPENAI_API_KEY' };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { provider: 'openai', error: `API error: ${response.status} ${errorText}` };
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || 'No response text received.';
  return { provider: 'openai', content: text };
}

module.exports = callOpenAI;
