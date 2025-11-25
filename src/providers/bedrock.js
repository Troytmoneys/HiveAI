const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');

const MODEL_CATALOG = {
  'amazon-nova-lite': {
    modelId: 'amazon.nova-lite-v1:0',
    name: 'Amazon Nova Lite'
  },
  'anthropic-claude-sonnet-4': {
    modelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    name: 'Anthropic Claude 3.5 Sonnet'
  },
  'deepseek-v3-1': {
    modelId: 'deepseek.r1-v1:0',
    name: 'DeepSeek V3.1'
  },
  'meta-llama-3-2-90b-instruct': {
    modelId: 'meta.llama3-2-90b-instruct-v1:0',
    name: 'Meta Llama 3.2 90B Instruct'
  },
  'openai-gpt-oss-120b': {
    modelId: 'openai.gpt-4o-mini-2024-07-18-v1:0',
    name: 'OpenAI GPT-OSS-120B'
  },
  'qwen3-235b-a22b-2507': {
    modelId: 'qwen.qwen3-235b-a22b-instruct-v1:0',
    name: 'Qwen Qwen3 235B A22B 2507'
  },
  'writer-palmyra-x5': {
    modelId: 'cohere.command-r-plus-v1:0',
    name: 'Writer Palmyra X5'
  }
};

function createClient() {
  const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
  if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error('Missing AWS credentials or AWS_REGION');
  }
  return new BedrockRuntimeClient({ region: AWS_REGION });
}

function extractTextFromResponse(response) {
  const message = response?.output?.message;
  if (!message?.content) return null;

  const contentText = message.content
    .map((part) => part.text || '')
    .filter(Boolean)
    .join('\n');

  return contentText || null;
}

async function invokeBedrockModel(modelKey, prompt, options = {}) {
  const config = MODEL_CATALOG[modelKey];
  if (!config) {
    return { provider: modelKey, error: 'Unsupported Bedrock model' };
  }

  let client;
  try {
    client = createClient();
  } catch (error) {
    return { provider: modelKey, error: error.message };
  }

  const messages = [
    {
      role: 'user',
      content: [{ text: prompt }]
    }
  ];

  const command = new ConverseCommand({
    modelId: config.modelId,
    messages,
    inferenceConfig: {
      maxTokens: options.maxTokens || 512,
      temperature: options.temperature ?? 0.6
    }
  });

  try {
    const response = await client.send(command);
    const text = extractTextFromResponse(response) || 'No response text received.';
    return { provider: modelKey, name: config.name, content: text };
  } catch (error) {
    return { provider: modelKey, name: config.name, error: error.message };
  }
}

module.exports = { MODEL_CATALOG, invokeBedrockModel };
