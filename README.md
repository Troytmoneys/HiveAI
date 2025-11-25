# HiveAI

A lightweight web app that lets you query multiple AI engines side-by-side: Gemini, ChatGPT, Amazon Bedrock, DeepAI, Perplexity, and Claude.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with the keys you want to use:
   ```bash
   GEMINI_API_KEY=your_gemini_key
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   DEEP_AI_API_KEY=your_deepai_key
   PERPLEXITY_API_KEY=your_perplexity_key
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
   ```
   Providers without credentials will stay disabled in the UI.
3. Start the server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to chat with the hive.

## Notes
- The Bedrock provider uses the AWS SDK; ensure your IAM user or role can invoke the chosen model.
- Frontend calls `/api/query` with your prompt and chosen providers; responses show success or error messages per engine.
