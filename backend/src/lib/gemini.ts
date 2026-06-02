import { GoogleGenerativeAI } from '@google/generative-ai';

const defaultApiKey = process.env.GEMINI_API_KEY;

let defaultGenAI: GoogleGenerativeAI | null = null;

if (defaultApiKey) {
  defaultGenAI = new GoogleGenerativeAI(defaultApiKey);
}

/**
 * Returns the Gemini 2.5 Flash model instance.
 * Uses customKey if provided, otherwise falls back to environment variable.
 * Returns null if no key is available.
 */
export function getGeminiModel(customKey?: string) {
  if (customKey) {
    const customGenAI = new GoogleGenerativeAI(customKey);
    return customGenAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
  
  if (!defaultGenAI) return null;
  return defaultGenAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

export { defaultGenAI as genAI };
