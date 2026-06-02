"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gemini_1 = require("../lib/gemini");
const router = (0, express_1.Router)();
router.get('/:ticker', async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    const customKey = req.headers['x-gemini-key'];
    const model = (0, gemini_1.getGeminiModel)(customKey);
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
