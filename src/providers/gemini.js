const { GEMINI_API_KEY } = process.env;

async function callGemini(prompt) {
  if (!GEMINI_API_KEY) {
    return { provider: 'gemini', error: 'Missing GEMINI_API_KEY' };
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}` , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }]}]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { provider: 'gemini', error: `API error: ${response.status} ${errorText}` };
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') || 'No response text received.';
  return { provider: 'gemini', content: text };
}

module.exports = callGemini;
