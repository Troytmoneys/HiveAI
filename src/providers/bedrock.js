const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const { AWS_REGION, BEDROCK_MODEL_ID } = process.env;

async function callBedrock(prompt) {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
    return { provider: 'bedrock', error: 'Missing AWS credentials or AWS_REGION' };
  }

  const modelId = BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';
  const client = new BedrockRuntimeClient({ region: AWS_REGION });

  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 256,
    messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }]
  });

  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body
  });

  try {
    const response = await client.send(command);
    const resultString = new TextDecoder().decode(response.body);
    const data = JSON.parse(resultString);
    const text = data?.output_text || data?.content?.map((part) => part.text).join('\n') || 'No response text received.';
    return { provider: 'bedrock', content: text };
  } catch (error) {
    return { provider: 'bedrock', error: error.message };
  }
}

module.exports = callBedrock;
