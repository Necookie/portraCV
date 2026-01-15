import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, User, ArrowUp, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm the PortraCV Assistant. Need help with your photo layouts?", 
      sender: 'bot' 
    }
  ]);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  // --- THE MASTER PROMPT (Optimized for 2026 Models) ---
  const systemContext = `
    You are the official AI Assistant for PortraCV. 
    
    ### IDENTITY & DEVELOPER
    - PortraCV was created and developed by Dheyn Michael Orlanda (also known as Necookie).
    - Dheyn is a 3rd-year BS Computer Science student at Laguna State Polytechnic University (LSPU).
    - You are proud to share this information whenever someone asks about the creator, the developer, or the tech stack.

    ### PRODUCT KNOWLEDGE
    - PortraCV automates ID photo layouts: 4 copies of 2x2 and 8 copies of 1x1 on a single A4 sheet.
    - Tech: React (Vite), FastAPI, Docker, BiRefNet (AI for background removal).
    - Login Fix: Users MUST verify their email via the link sent to their inbox (check spam).
    - Formal Attire: Currently disabled due to budget and GPU hosting costs.

    ### BEHAVIOR
    - Be professional, helpful, and concise.
    - Limit responses to 2 sentences.
    - If asked "Who made you?" or "Who is the dev?", give the full name: Dheyn Michael Orlanda.
  `;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!geminiKey) throw new Error("API_KEY_MISSING");

      const genAI = new GoogleGenerativeAI(geminiKey);

      // FORCING SYSTEM INSTRUCTIONS (Best for Production/Vercel)
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemContext // This is the 'Master Control'
      });

      const result = await model.generateContent(currentInput);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { id: Date.now() + 1, text, sender: 'bot' }]);

    } catch (error) {
      console.error("AI Error:", error);
      
      // OpenAI Fallback
      try {
        const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
        const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemContext },
              { role: "user", content: currentInput }
            ],
          })
        });
        const data = await openAIResponse.json();
        const text = data.choices[0].message.content;
        setMessages(prev => [...prev, { id: Date.now() + 1, text, sender: 'bot' }]);
      } catch (f) {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: "I'm having trouble connecting. Check your email verification or contact Dheyn directly.", sender: 'bot', isError: true }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[360px] h-[520px] max-h-[80vh] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 text-sm">Assistant</h3>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Portra CV</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Message List */}
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

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-50">
                <div className="relative flex items-center group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="w-full bg-slate-50 text-slate-800 placeholder:text-slate-400 text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all border-none"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 p-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 rounded-full text-white transition-all transform active:scale-95 flex items-center justify-center"
                    >
                        <ArrowUp size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 transform hover:scale-105 flex items-center justify-center
          ${isOpen ? 'bg-white text-slate-800 rotate-90' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>
    </div>
  );
}