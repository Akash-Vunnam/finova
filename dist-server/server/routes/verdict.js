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
        const prompt = `Provide a rapid Buy, Hold, or Sell verdict for ${ticker} based on general market sentiment and the company's fundamentals. Output format strictly:
VERDICT: [Buy/Hold/Sell]
REASON: [1 short sentence, no asterisks]`;
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        let verdict = 'HOLD';
        let reason = text;
        if (text.includes('VERDICT:')) {
            for (const line of text.split('\n')) {
                if (line.startsWith('VERDICT:')) {
                    verdict = line.replace('VERDICT:', '').trim().toUpperCase();
                }
                else if (line.startsWith('REASON:')) {
                    reason = line.replace('REASON:', '').trim();
                }
            }
        }
        if (verdict.includes('BUY'))
            verdict = 'BUY';
        else if (verdict.includes('SELL'))
            verdict = 'SELL';
        else
            verdict = 'HOLD';
        res.json({ verdict, reason });
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
