const { PERPLEXITY_API_KEY } = process.env;

async function callPerplexity(prompt) {
  if (!PERPLEXITY_API_KEY) {
    return { provider: 'perplexity', error: 'Missing PERPLEXITY_API_KEY' };
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${PERPLEXITY_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3-8b-instruct',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { provider: 'perplexity', error: `API error: ${response.status} ${errorText}` };
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || 'No response text received.';
  return { provider: 'perplexity', content: text };
}

module.exports = callPerplexity;
