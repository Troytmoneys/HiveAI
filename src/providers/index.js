const { MODEL_CATALOG, invokeBedrockModel } = require('./bedrock');

const providerIds = Object.keys(MODEL_CATALOG);

function listProviders() {
  return providerIds.map((id) => ({ id, name: MODEL_CATALOG[id].name }));
}

async function callProviders(providerList, prompt) {
  const targetIds = providerList.length ? providerList : providerIds;

  const calls = targetIds.map(async (id) => {
    if (!MODEL_CATALOG[id]) {
      return { provider: id, error: 'Unsupported provider' };
    }

    try {
      return await invokeBedrockModel(id, prompt);
    } catch (error) {
      return { provider: id, error: error.message };
    }
  });

  return Promise.all(calls);
}

async function summarizeResults(results, originalPrompt) {
  const usable = results.filter((result) => result.content && !result.error);

  if (!usable.length) {
    return { provider: 'summary', content: 'No provider responses available to summarize.' };
  }

  const summaryPrompt = [
    'Summarize the following model answers into a single, concise bullet list.',
    'Blend overlapping ideas, keep it brief, and cite which model contributed key points when helpful.',
    `User prompt: ${originalPrompt}`,
    '',
    'Provider responses:',
    ...usable.map((r) => `${MODEL_CATALOG[r.provider]?.name || r.provider}: ${r.content}`)
  ].join('\n');

  const summary = await invokeBedrockModel('amazon-nova-lite', summaryPrompt, { maxTokens: 300, temperature: 0.3 });
  return { provider: 'summary', name: 'Hive Summary (Nova Lite)', ...summary };
}

module.exports = { callProviders, listProviders, summarizeResults };
