/**
 * chatGuardrails.js
 *
 * Client-side pre-filter for the PortraCV AI ChatWidget.
 *
 * PURPOSE:
 * - Catches obvious off-topic or jailbreak attempts BEFORE hitting the Gemini API.
 * - Saves API quota and provides instant, consistent feedback.
 * - Acts as a first line of defense; the system prompt is the second layer.
 *
 * HOW IT WORKS:
 * - JAILBREAK_PATTERNS: Regex list targeting known prompt-injection and persona-override techniques.
 * - OFF_TOPIC_KEYWORDS: Regex list of subjects that are clearly outside PortraCV's domain.
 * - checkGuardrails(message): The exported function that runs both checks.
 */

// ─── JAILBREAK DETECTION ────────────────────────────────────────────────────
// Targets common prompt-injection patterns like "ignore previous instructions",
// persona overrides, and attempts to reveal the system prompt.
const JAILBREAK_PATTERNS = [
  /ignore (previous|all|your) instructions/i,
  /pretend (you are|to be|you're)/i,
  /you are now/i,
  /act as (a |an )?(different|other|new)/i,
  /roleplay as/i,
  /forget (your|the) (rules|instructions|guidelines|system prompt)/i,
  /bypass (your|the) (filter|restriction|guardrail|safety)/i,
  /\bDAN\b/,                                    // "Do Anything Now" jailbreak
  /hypothetically (speaking|if|you)/i,
  /for (educational|research|training) purposes/i,
  /override (your|the) (system|instructions|rules|prompt)/i,
  /reveal (your|the) system prompt/i,
  /what (are|were) your instructions/i,
  /show me your (prompt|instructions|system)/i,
  /do anything now/i,
  /developer mode/i,
  /unlock (your|all) (capabilities|modes|features)/i,
  /no (restrictions|filters|limits)/i,
  /disregard (your|all|any) (rules|guidelines|instructions)/i,
  /jailbreak/i,
];

// ─── OFF-TOPIC DETECTION ────────────────────────────────────────────────────
// Catches queries that are clearly unrelated to PortraCV or its developer.
// This is intentionally broad to keep the assistant focused.
const OFF_TOPIC_KEYWORDS = [
  // General knowledge / creative tasks
  /write (a|an) (essay|story|poem|novel|letter|email|code|script|app|program)/i,
  /tell me a (joke|story|riddle)/i,
  /\bfunny\b/i,

  // Finance & crypto
  /\bstocks?\b/i,
  /\bcrypto(currency)?\b/i,
  /\bbitcoin\b/i,
  /\binvest(ment|ing)?\b/i,

  // Geography & weather
  /\bweather\b/i,
  /\btemperature\b/i,
  /what('s| is) the (capital|population) of/i,

  // Math & science
  /\bmath(ematics)?\b/i,
  /\bcalculate\b/i,
  /\bequation\b/i,
  /\bphysics\b/i,
  /\bchemistry\b/i,

  // Food & lifestyle
  /\brecipe\b/i,
  /\bcook(ing)?\b/i,
  /\bfood\b/i,
  /\brestaurant\b/i,

  // Politics & news
  /\bpolitics\b/i,
  /\belection\b/i,
  /\bpresident\b/i,
  /\bgovernment\b/i,
  /\bnews\b/i,
  /\bwar\b/i,

  // Entertainment
  /\bmovie(s)?\b/i,
  /\bmusic\b/i,
  /\bsong(s)?\b/i,
  /\bgame(s)?\b/i,
  /\bsports?\b/i,
  /\bfootball\b/i,
  /\bbasketball\b/i,
  /\bNetflix\b/i,
  /\bSpotify\b/i,

  // History & social studies
  /\bhistory\b/i,
  /\bworld war\b/i,

  // Translation
  /\btranslate\b/i,
  /how (do|do you) say .+ in/i,

  // Other AI assistants
  /\bChatGPT\b/i,
  /\bOpenAI\b/i,
  /\bClaude\b/i,
  /\bCopilot\b/i,
];

// ─── GUARDRAIL RESPONSES ─────────────────────────────────────────────────────
const JAILBREAK_REPLY =
  "I'm not able to bypass my guidelines. I'm here exclusively to help with PortraCV — photo layouts, background removal, account questions, and anything about the developer Necookie. What can I help you with?";

const OFF_TOPIC_REPLY =
  "I'm specifically trained to assist with PortraCV questions only. Is there something about the layout engine, background remover, your account, or the developer Necookie I can help you with?";

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

/**
 * Runs both the jailbreak and off-topic checks on a user message.
 *
 * @param {string} message - The raw user input string.
 * @returns {{ blocked: boolean, reason?: string, reply?: string }}
 */
export function checkGuardrails(message) {
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(message)) {
      return { blocked: true, reason: 'jailbreak', reply: JAILBREAK_REPLY };
    }
  }

  for (const pattern of OFF_TOPIC_KEYWORDS) {
    if (pattern.test(message)) {
      return { blocked: true, reason: 'off-topic', reply: OFF_TOPIC_REPLY };
    }
  }

  return { blocked: false };
}
