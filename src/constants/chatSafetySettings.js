/**
 * chatSafetySettings.js
 *
 * Gemini AI safety configuration for the PortraCV chatbot.
 *
 * These settings are applied at the model level via the Google Generative AI SDK.
 * They control what types of harmful content the model can output.
 *
 * Threshold Options (from most to least permissive):
 * - BLOCK_NONE            — No blocking (not recommended for production)
 * - BLOCK_ONLY_HIGH       — Only block high-probability harmful content
 * - BLOCK_MEDIUM_AND_ABOVE — Block medium and high (recommended default)
 * - BLOCK_LOW_AND_ABOVE   — Block low, medium, and high (most restrictive)
 *
 * For a public-facing app like PortraCV, BLOCK_MEDIUM_AND_ABOVE is the right
 * balance between usability and safety.
 */
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];
