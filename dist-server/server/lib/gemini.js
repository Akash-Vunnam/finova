"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAI = void 0;
exports.getGeminiModel = getGeminiModel;
const generative_ai_1 = require("@google/generative-ai");
const defaultApiKey = process.env.GEMINI_API_KEY;
let defaultGenAI = null;
exports.genAI = defaultGenAI;
if (defaultApiKey) {
    exports.genAI = defaultGenAI = new generative_ai_1.GoogleGenerativeAI(defaultApiKey);
}
/**
 * Returns the Gemini 2.5 Flash model instance.
 * Uses customKey if provided, otherwise falls back to environment variable.
 * Returns null if no key is available.
 */
function getGeminiModel(customKey) {
    if (customKey) {
        const customGenAI = new generative_ai_1.GoogleGenerativeAI(customKey);
        return customGenAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }
    if (!defaultGenAI)
        return null;
    return defaultGenAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}
