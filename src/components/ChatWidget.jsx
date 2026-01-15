import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, User, ArrowUp, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- SENIOR DEV STRATEGY: STABILITY FIRST ---
const MODEL_PRIORITY_LIST = [
  "gemini-2.0-flash",       
  "gemini-2.5-flash",       
  "gemini-1.5-flash"        
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Initial message is cleaner now
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm the PortraCV Assistant. How can I help you with your printing automation today?", 
      sender: 'bot' 
    }
  ]);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  // --- SMART FALLBACK WITH DELAY ---
  async function generateWithFallback(genAI, prompt, modelIndex = 0) {
    if (modelIndex >= MODEL_PRIORITY_LIST.length) {
      throw new Error("All AI models are currently overloaded or unreachable.");
    }

    const currentModelName = MODEL_PRIORITY_LIST[modelIndex];
    
    try {
      // console.log(`🤖 Connecting to [${currentModelName}]...`); // Optional logging
      const model = genAI.getGenerativeModel({ model: currentModelName });
      
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))
      ]);

      const response = await result.response;
      return response.text();

    } catch (error) {
      console.warn(`⚠️ Error on ${currentModelName}:`, error.message);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await generateWithFallback(genAI, prompt, modelIndex + 1);
    }
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) throw new Error("API Key Missing in .env");

        const genAI = new GoogleGenerativeAI(apiKey);

        // --- UPDATED SYSTEM CONTEXT ---
        // I separated "Identity" from "Knowledge Base" so it knows WHEN to speak about what.
        const systemContext = `
          IDENTITY:
          You are the AI Assistant for "PortraCV", a printing shop automation tool.
          You are NOT a human. You are helpful, professional, and concise.

          STRICT RULES:
          1. Do NOT mention the developer (Dheyn/Necookie) unless the user explicitly asks "Who made this?", "Who is the developer?", or "Contact info".
          2. If asked "Who are you?", answer ONLY about being the PortraCV Assistant.
          3. Keep answers short (max 2-3 sentences).

          KNOWLEDGE BASE (Use only if asked):
          - Developer: Dheyn Michael Orlanda (Necookie).
          - Developer Status: Full Stack Developer & Student at LSPU.
          - Portfolio: necookie.dev
          - Product Features: Auto-layout (2x2/1x1), Smart Background Removal.
          - Coming Soon: AI Formal Attire Generator.
        `;

        const fullPrompt = `${systemContext}\n\nUser Question: "${input}"`;

        const responseText = await generateWithFallback(genAI, fullPrompt);

        setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: 'bot' }]);

    } catch (error) {
        console.error("Critical AI Failure:", error);
        
        let errorMessage = "My brain is having a quick hiccup. Please try again in a moment.";
        
        if (error.message.includes("API Key")) {
            errorMessage = "Developer Configuration Error: API Key is missing.";
        } else if (error.message.includes("overloaded")) {
            errorMessage = "I'm receiving too many messages right now. Give me 5 seconds!";
        }

        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            text: errorMessage, 
            sender: 'bot',
            isError: true 
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Minimalist Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[360px] h-[500px] max-h-[80vh] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 text-sm">Assistant</h3>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wide">PORTRA CV</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-all"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-white scrollbar-thin scrollbar-thumb-slate-100">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`
                            max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm
                            ${msg.sender === 'user' 
                                ? 'bg-slate-900 text-white rounded-br-none' 
                                : msg.isError 
                                    ? 'bg-red-50 text-red-600 border border-red-100 rounded-bl-none'
                                    : 'bg-slate-50 text-slate-600 border border-slate-100 rounded-bl-none'}
                        `}>
                            {msg.isError && <AlertCircle size={14} className="inline mr-2 -mt-0.5" />}
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white">
                <div className="relative flex items-center group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-slate-50 text-slate-800 placeholder:text-slate-400 text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 p-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 rounded-full text-white transition-all transform active:scale-95"
                    >
                        <ArrowUp size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* --- Toggle Button --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
            h-14 w-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 transform hover:scale-105 flex items-center justify-center
            ${isOpen ? 'bg-white text-slate-800 rotate-90' : 'bg-slate-900 text-white hover:bg-slate-800'}
        `}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>
    </div>
  );
}