const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { callProviders, listProviders, summarizeResults } = require('./providers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/providers', (req, res) => {
  const hasAwsCreds = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION);
  const providers = listProviders().map((provider) => ({
    ...provider,
    available: hasAwsCreds
  }));

  res.json({ providers });
});

app.post('/api/query', async (req, res) => {
  const { prompt, providers = [] } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const targetProviders = providers.length ? providers : listProviders().map((p) => p.id);
  const results = await callProviders(targetProviders, prompt);
  const summary = await summarizeResults(results, prompt);
  res.json({ results, summary });
});

app.listen(PORT, () => {
  console.log(`HiveAI server listening on http://localhost:${PORT}`);
});
