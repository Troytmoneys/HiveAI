const callAnthropic = require('./anthropic');
const callBedrock = require('./bedrock');
const callDeepAI = require('./deepai');
const callGemini = require('./gemini');
const callOpenAI = require('./openai');
const callPerplexity = require('./perplexity');

const registry = {
  gemini: callGemini,
  openai: callOpenAI,
  bedrock: callBedrock,
  deepai: callDeepAI,
  perplexity: callPerplexity,
  claude: callAnthropic
};

function listProviders() {
  return Object.keys(registry).map((key) => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1)
  }));
}

async function callProviders(providerIds, prompt) {
  const calls = providerIds.map(async (id) => {
    const caller = registry[id];
    if (!caller) {
      return { provider: id, error: 'Unsupported provider' };
    }

    try {
      return await caller(prompt);
    } catch (error) {
      return { provider: id, error: error.message };
    }
  });

  return Promise.all(calls);
}

module.exports = { callProviders, listProviders };
