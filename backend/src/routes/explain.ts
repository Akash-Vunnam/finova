import { Router } from 'express';
import { getGeminiModel } from '../lib/gemini';

const router = Router();

router.get('/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const customKey = req.headers['x-gemini-key'] as string | undefined;
  const model = getGeminiModel(customKey);

  if (!model) {
    return res.status(500).json({
      error: true,
      type: "API_KEY_MISSING",
      message: "API key not found. Please configure your Gemini API Key."
    });
  }

  try {
    const prompt = `Explain what the company with ticker symbol ${ticker} does. Keep it very simple, engaging, and exactly 3 short sentences. No introductory or concluding remarks. No asterisks or markdown.`;
    const result = await model.generateContent(prompt);
    const explanation = result.response.text().trim();
    res.json({ explanation });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gemini error';
    res.status(500).json({ 
      error: true,
      type: "GEMINI_ERROR",
      message 
    });
  }
});

export default router;
