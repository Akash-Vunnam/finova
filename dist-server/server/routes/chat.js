"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gemini_1 = require("../lib/gemini");
const firebase_admin_1 = require("../services/firebase-admin");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        if (!message?.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const customKey = req.headers['x-gemini-key'];
        const model = (0, gemini_1.getGeminiModel)(customKey);
        if (!model) {
            return res.status(500).json({
                error: true,
                type: "API_KEY_MISSING",
                message: "API key not found. Please configure your Gemini API Key."
            });
        }
        const authHeader = req.headers.authorization;
        let userId = null;
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            const user = await (0, firebase_admin_1.verifyFirebaseToken)(token);
            if (user)
                userId = user.id;
        }
        let historyContext = '';
        if (userId) {
            try {
                const snap = await firebase_admin_1.adminDb
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
                        .map((h) => `User: ${h.message}\nAI: ${h.response}`)
                        .join('\n\n');
                }
            }
            catch {
                // Non-fatal
            }
        }
        else if (history.length > 0) {
            historyContext = history
                .slice(-5)
                .map((m) => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
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
                await firebase_admin_1.adminDb.collection('users').doc(userId).collection('chat_history').add({
                    message,
                    response: aiResponse,
                    created_at: new Date().toISOString(),
                });
            }
            catch {
                // Non-fatal
            }
        }
        res.json({ response: aiResponse });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Gemini error';
        res.status(500).json({
            error: true,
            type: "GEMINI_ERROR",
            message
        });
    }
});
exports.default = router;
