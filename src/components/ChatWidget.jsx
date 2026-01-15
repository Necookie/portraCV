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
      text: "Hello! I'm the PortraCV Assistant. Need help with the Layout Engine?", 
      sender: 'bot' 
    }
  ]);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  // --- THE SMART AI BRAIN (Shared Knowledge) ---
  const systemContext = `
    ### ROLE
    You are the PortraCV Support Specialist. You provide concise, professional support for the PortraCV SaaS platform.

    ### THE DEVELOPER (Dheyn/Necookie)
    - IDENTITY: Created by Dheyn Michael Orlanda (Alias: Necookie).
    - CREDENTIALS: A 3rd-year Computer Science (BSCS) student at Laguna State Polytechnic University (LSPU).
    - EXPERTISE: Full-stack development with a focus on automating printing shop workflows.
    - PORTFOLIO: necookie.dev
    - CONTACT: Dheyn.main@gmail.com | +63 995 492 2742

    ### PRODUCT KNOWLEDGE (PortraCV)
    - CORE VALUE: Replaces manual MS Word dragging. It automates 2x2 and 1x1 photo layouts on A4 paper instantly.
    - TECH STACK: React (Vite), FastAPI (Python), Docker, and BiRefNet AI for background removal. Hosted on Hugging Face and Name.com.
    - ACCOUNT ISSUES: Users MUST verify their email via the link sent during registration. Check the spam folder if missing.
    - FEATURE STATUS: 
    * Background Removal: LIVE (Powered by AI).
    * Formal Attire: ON HOLD (Due to GPU/Budget constraints).

    ### BEHAVIORAL RULES
    1. MENTION DEVELOPER: Only if asked about the creator, LSPU, tech stack, or support.
    2. BREVITY: Max 2-3 sentences. No fluff.
    3. LOG-IN ISSUES: Always remind users about the Verification Email first.
    4. TONE: Minimalist and executive.

    ### USER CONTEXT
    User: "{input}"
    Assistant:
  `;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input; // Capture input before clearing
    setInput('');
    setIsTyping(true);

    try {
      // --- ATTEMPT 1: PRIMARY (GEMINI) ---
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!geminiKey) throw new Error("Gemini Key Missing");

      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(`${systemContext}\nUser: ${currentInput}`);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { id: Date.now() + 1, text, sender: 'bot' }]);

    } catch (error) {
      console.warn("Gemini failed, trying OpenAI backup...", error);

      try {
        // --- ATTEMPT 2: BACKUP (OPENAI) ---
        const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!openaiKey) throw new Error("Both Keys Missing");

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
            max_tokens: 150
          })
        });

        const data = await openAIResponse.json();
        const text = data.choices[0].message.content;

        setMessages(prev => [...prev, { id: Date.now() + 1, text, sender: 'bot' }]);

      } catch (backupError) {
        console.error("Critical AI Failure:", backupError);
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          text: "I'm currently offline. Please contact Dheyn.main@gmail.com directly.", 
          sender: 'bot',
          isError: true 
        }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
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
                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Portra CV</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full">
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

          {/* Form */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-50">
            <div className="relative flex items-center group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
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

      {/* Toggle Button */}
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