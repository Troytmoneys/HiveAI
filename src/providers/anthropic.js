const { ANTHROPIC_API_KEY } = process.env;

async function callAnthropic(prompt) {
  if (!ANTHROPIC_API_KEY) {
    return { provider: 'claude', error: 'Missing ANTHROPIC_API_KEY' };
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { provider: 'claude', error: `API error: ${response.status} ${errorText}` };
  }

  const data = await response.json();
  const text = data?.content?.map((entry) => entry.text).join('\n') || 'No response text received.';
  return { provider: 'claude', content: text };
}

module.exports = callAnthropic;
