# HiveAI

A lightweight web app that fans prompts across Amazon Bedrock models (Nova, Claude, DeepSeek, Llama, Qwen, OpenAI, and Writer) and returns a combined summary.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with AWS credentials and region that can invoke the desired Bedrock models:
   ```bash
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   ```
   The UI enables all models only when these values are present.
3. Start the server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to chat with the hive.

## Providers
All providers run through Amazon Bedrock:
- Amazon Nova Lite (`amazon.nova-lite-v1:0`)
- Anthropic Claude 3.5 Sonnet (`anthropic.claude-3-5-sonnet-20241022-v2:0`)
- DeepSeek V3.1 (`deepseek.r1-v1:0`)
- Meta Llama 3.2 90B Instruct (`meta.llama3-2-90b-instruct-v1:0`)
- OpenAI GPT-OSS-120B (mapped to `openai.gpt-4o-mini-2024-07-18-v1:0`)
- Qwen Qwen3 235B A22B 2507 (`qwen.qwen3-235b-a22b-instruct-v1:0`)
- Writer Palmyra X5 (`cohere.command-r-plus-v1:0`)

The app auto-summarizes all provider answers into a single bullet list using Nova Lite.

## Notes
- Make sure your AWS account has Bedrock access to the listed model IDs.
- Frontend calls `/api/query` with your prompt and chosen providers; responses show success or error messages per engine and include a unified summary panel.
