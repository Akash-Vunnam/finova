import { Router } from 'express';
import { getGeminiModel } from '../lib/gemini';
import { adminDb, verifyFirebaseToken } from '../services/firebase-admin';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const customKey = req.headers['x-gemini-key'] as string | undefined;
    const model = getGeminiModel(customKey);

    if (!model) {
      return res.status(500).json({
        error: true,
        type: "API_KEY_MISSING",
        message: "API key not found. Please configure your Gemini API Key."
      });
    }

    const authHeader = req.headers.authorization;
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const user = await verifyFirebaseToken(token);
      if (user) userId = user.id;
    }

    let historyContext = '';
    if (userId) {
      try {
        const snap = await adminDb
          .collection('users')
          .doc(userId)
          .collection('chat_history')
          .orderBy('created_at', 'desc')
          .limit(5)
          .get();

        if (!snap.empty) {
          historyContext = snap.docs
            .map(doc => doc.data())
            .reverse()
            .map((h: any) => `User: ${h.message}\nAI: ${h.response}`)
            .join('\n\n');
        }
      } catch {
        // Non-fatal
      }
    } else if (history.length > 0) {
      historyContext = history
        .slice(-5)
        .map((m: any) => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
        .join('\n');
    }

    const systemPrompt = `You are Finova AI, a friendly and expert investment copilot. You provide clear, actionable, and thoughtful financial insights. You never provide official financial advice but help users understand markets, stocks, and investment concepts. Be concise and engaging.`;

    const fullPrompt = historyContext
      ? `${systemPrompt}\n\nConversation history:\n${historyContext}\n\nUser: ${message}\nAI:`
      : `${systemPrompt}\n\nUser: ${message}\nAI:`;

    const result = await model.generateContent(fullPrompt);
    const aiResponse = result.response.text().trim();

    if (userId) {
      try {
        await adminDb.collection('users').doc(userId).collection('chat_history').add({
          message,
          response: aiResponse,
          created_at: new Date().toISOString(),
        });
      } catch {
        // Non-fatal
      }
    }

    res.json({ response: aiResponse });
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
