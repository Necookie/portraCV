/**
 * MessageBubble.jsx
 *
 * Renders a single chat message bubble with human-friendly formatting.
 *
 * Even though the system prompt tells Gemini not to use markdown, this
 * component acts as a safety net — it strips any accidental ** or ## that
 * slip through, and converts plain newlines into proper line breaks so
 * numbered steps display on separate lines instead of one long wall of text.
 */

import React from 'react';
import { AlertCircle, Bot, User } from 'lucide-react';

/**
 * Cleans up any residual markdown syntax that may slip through from the AI,
 * then splits on newlines so steps appear on their own lines.
 *
 * @param {string} text - Raw text from the AI response.
 * @returns {string} Cleaned plain text.
 */
function cleanMarkdown(text) {
  if (typeof text !== 'string') return '';

  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')      // **bold** → plain
    .replace(/\*(.+?)\*/g, '$1')          // *italic* → plain
    .replace(/^#{1,6}\s+/gm, '')          // ## Heading → plain
    .replace(/`(.+?)`/g, '$1')            // `code` → plain
    .replace(/__(.+?)__/g, '$1')          // __underline__ → plain
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')   // [link](url) → link text only
    .trim();
}

export default function MessageBubble({ msg }) {
  const isBot = msg.sender === 'bot';
  const isUser = msg.sender === 'user';

  const cleanedText = isBot ? cleanMarkdown(msg.text) : msg.text;

  // Split on newlines so steps/paragraphs render on separate lines
  const lines = cleanedText.split('\n').filter((line) => line.trim() !== '');

  return (
    <div className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>

      {/* Bot avatar */}
      {isBot && (
        <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0 mt-0.5">
          <Bot size={13} />
        </div>
      )}

      <div className={`
        max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm
        ${isUser
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

        {/* Render each line separately so steps don't collapse into one block */}
        {lines.map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
            {line}
          </p>
        ))}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-xl bg-stone-900 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
          <User size={13} />
        </div>
      )}
    </div>
  );
}
