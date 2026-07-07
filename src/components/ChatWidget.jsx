import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, ArrowUp, AlertCircle, Bot, User, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Separated modules for maintainability
import { SYSTEM_PROMPT } from '../constants/chatSystemPrompt';
import { SAFETY_SETTINGS } from '../constants/chatSafetySettings';
import { checkGuardrails } from '../utils/chatGuardrails';

// ============================================================
// INITIAL WELCOME MESSAGE
// ============================================================
const INITIAL_MESSAGE = {
  id: 'welcome',
  text: "👋 Hi! I'm the PortraCV Assistant. I can help you with photo layouts, background removal, account issues, or anything about this app. What do you need?",
  sender: 'bot',
};

// Quick-action pills shown on first load to guide new users.
const QUICK_SUGGESTIONS = [
  "What layouts are available?",
  "How do I remove a background?",
  "Why can't I log in?",
  "Who made PortraCV?",
  "How do I print my photos?",
];

// ============================================================
// CHAT WIDGET COMPONENT
// ============================================================
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);

  // Gemini chat session — persisted across sends for conversation history
  const chatSessionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus the input field when the panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  /**
   * Initializes (or reuses) a Gemini chat session.
   * The session maintains conversation history automatically via the SDK.
   * System prompt and safety settings are baked in at model creation time.
   */
  const getOrCreateChatSession = () => {
    if (chatSessionRef.current) return chatSessionRef.current;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      safetySettings: SAFETY_SETTINGS,
    });

    const session = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 512, // Keeps responses concise
        temperature: 0.4,     // Lower = more focused & consistent
        topP: 0.9,
        topK: 40,
      },
    });

    chatSessionRef.current = session;
    return session;
  };

  /**
   * Resets the conversation to initial state.
   * Destroys the chat session so a fresh one is created on the next message.
   */
  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    chatSessionRef.current = null;
    setInput('');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    // Append user message immediately for a snappy UX
    const userMsg = { id: Date.now(), text: trimmed, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // ── Layer 1: Client-side guardrail check ──────────────────────────────────
    const guard = checkGuardrails(trimmed);
    if (guard.blocked) {
      // Small delay so the response feels natural, not instant
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: guard.reply,
          sender: 'bot',
          isWarning: true,
        }]);
        setIsTyping(false);
      }, 600);
      return;
    }

    // ── Layer 2: Gemini API call (with system prompt + safety settings) ────────
    try {
      const chat = getOrCreateChatSession();
      const result = await chat.sendMessage(trimmed);
      const response = result.response;

      // Check if Gemini's own safety filter blocked the output
      if (response.promptFeedback?.blockReason) {
        throw new Error("SAFETY_BLOCKED");
      }

      const text = response.text();
      setMessages(prev => [...prev, { id: Date.now() + 1, text, sender: 'bot' }]);

    } catch (error) {
      console.error("ChatWidget AI Error:", error);

      let errorText =
        "I'm having trouble connecting right now. Please try again in a moment, or contact Dheyn directly at Dheyn.main@gmail.com.";

      if (error.message === "GEMINI_API_KEY_MISSING") {
        errorText =
          "The assistant isn't configured yet. Please contact Dheyn (Necookie) to set up the API key.";
      } else if (error.message === "SAFETY_BLOCKED") {
        errorText =
          "I can't respond to that request. Let's keep things focused on PortraCV!";
      } else if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("Quota")) {
        // Parse the retry delay from the API error if available
        const retryMatch = error.message?.match(/(\d+)s/);
        const retrySec = retryMatch ? parseInt(retryMatch[1], 10) : 60;
        const retryMin = Math.ceil(retrySec / 60);
        errorText =
          `The assistant is temporarily rate-limited. Please wait about ${
            retrySec < 60 ? `${retrySec} seconds` : `${retryMin} minute${retryMin > 1 ? 's' : ''}`
          } and try again. For urgent help, reach Dheyn at Dheyn.main@gmail.com.`;
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: errorText,
        sender: 'bot',
        isError: true,
      }]);

      // Reset session on error so the next message starts clean
      chatSessionRef.current = null;

    } finally {
      setIsTyping(false);
    }
  };

  // Submit on Enter, allow Shift+Enter for newlines
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSend(e);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">

      {/* ===== CHAT PANEL ===== */}
      {isOpen && (
        <div className="mb-4 w-[92vw] sm:w-[370px] h-[540px] max-h-[82vh] bg-white rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.14)] border border-stone-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

          {/* --- Header --- */}
          <div className="px-5 py-4 border-b border-stone-50 flex justify-between items-center bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                  <Bot size={18} />
                </div>
                {/* Online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white block" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-800 text-sm leading-tight">PortraCV Assistant</h3>
                <p className="text-[10px] text-emerald-500 font-semibold tracking-wide uppercase">
                  Online · Powered by Gemini
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset conversation"
                className="text-stone-400 hover:text-stone-600 p-2 rounded-full transition-colors"
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* --- Message List --- */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-stone-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>

                {/* Bot avatar */}
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0 mt-0.5">
                    <Bot size={13} />
                  </div>
                )}

                <div className={`
                  max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm
                  ${msg.sender === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-sm'
                    : msg.isError
                      ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-sm'
                      : msg.isWarning
                        ? 'bg-amber-50 text-amber-800 border border-amber-100 rounded-tl-sm'
                        : 'bg-white text-stone-700 border border-stone-100 rounded-tl-sm'
                  }
                `}>
                  {(msg.isError || msg.isWarning) && (
                    <AlertCircle size={13} className="inline mr-1.5 -mt-0.5 opacity-70" />
                  )}
                  {msg.text}
                </div>

                {/* User avatar */}
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-stone-900 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <User size={13} />
                  </div>
                )}
              </div>
            ))}

            {/* Quick-action suggestion pills — shown only on fresh start */}
            {messages.length === 1 && !isTyping && (
              <div className="pt-1 flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      // Small delay so input state updates before submit fires
                      setTimeout(() => {
                        document.getElementById('chat-submit-btn')?.click();
                      }, 50);
                    }}
                    className="text-[11px] bg-white border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-600 hover:text-rose-700 px-3 py-1.5 rounded-full transition-all shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0">
                  <Bot size={13} />
                </div>
                <div className="bg-white border border-stone-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* --- Scope Disclaimer --- */}
          <div className="px-5 py-2 bg-stone-50 border-t border-stone-100 text-[10px] text-stone-400 text-center leading-tight">
            Responses limited to PortraCV topics only.
          </div>

          {/* --- Input Form --- */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-50">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about PortraCV..."
                disabled={isTyping}
                maxLength={500}
                className="w-full bg-stone-50 text-stone-800 placeholder:text-stone-400 text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all border border-stone-100 disabled:opacity-60"
              />
              <button
                id="chat-submit-btn"
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 bg-rose-600 hover:bg-rose-700 disabled:bg-stone-200 rounded-full text-white transition-all transform active:scale-95 flex items-center justify-center"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== LAUNCHER BUTTON ===== */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        className={`
          h-14 w-14 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.15)]
          transition-all duration-300 transform hover:scale-105
          flex items-center justify-center
          ${isOpen
            ? 'bg-white text-stone-700 border border-stone-100'
            : 'bg-rose-600 text-white hover:bg-rose-700'
          }
        `}
      >
        {isOpen ? <X size={22} /> : <Sparkles size={22} />}
      </button>
    </div>
  );
}
