import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { TRANSLATIONS } from '../constants';
import { sanitizeInput } from '../utils/validation';

interface ChatbotProps {
  lang: Language;
  setPage: (page: string) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ lang, setPage }) => {
  const t = TRANSLATIONS[lang].chatbot;
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: t.welcome,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRTL = lang === 'ar';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Reset welcome message if language changes
  useEffect(() => {
    setMessages(prev => {
        // Keep history but if empty or just welcome, update language
        if (prev.length === 1 && prev[0].sender === 'bot') {
            return [{
                id: '1',
                text: t.welcome,
                sender: 'bot',
                timestamp: new Date()
            }];
        }
        return prev;
    });
  }, [lang, t.welcome]);

  const generateResponse = (text: string): { text: string, action?: string } => {
    const lower = text.toLowerCase();
    const tResp = t.responses;

    if (lower.includes('register') || lower.includes('تسجيل') || lower.includes('form') || lower.includes('نموذج')) {
      return { text: tResp.register, action: 'register' };
    }
    if (lower.includes('contact') || lower.includes('تواصل') || lower.includes('phone') || lower.includes('email') || lower.includes('رقم')) {
      return { text: tResp.contact, action: 'contact' };
    }
    if (lower.includes('admin') || lower.includes('login') || lower.includes('ادارة') || lower.includes('دخول')) {
      return { text: tResp.admin, action: 'admin' };
    }
    
    return { text: tResp.default };
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = sanitizeInput(inputText);
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate bot thinking
    setTimeout(() => {
      const response = generateResponse(userText);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        action: response.action
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  const handleActionClick = (action: string) => {
    setPage(action);
    // Optionally close chat on mobile
    if (window.innerWidth < 768) {
        setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:scale-105 transition-all duration-300 flex items-center justify-center`}
        aria-label="Open Chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
            className={`fixed bottom-24 ${isRTL ? 'left-6' : 'right-6'} z-50 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-10`}
            style={{ maxHeight: '600px', height: '80vh' }}
        >
          {/* Header */}
          <div className="bg-primary-600 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">{t.title}</h3>
                <span className="text-xs text-primary-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user' 
                            ? 'bg-primary-600 text-white rounded-br-none' 
                            : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 shadow-sm border border-gray-100 dark:border-slate-600 rounded-bl-none'
                    }`}
                >
                  <p>{msg.text}</p>
                  {msg.action && (
                    <button 
                        onClick={() => handleActionClick(msg.action!)}
                        className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-primary-100 underline decoration-dotted"
                    >
                        {isRTL ? 'اضغط هنا للذهاب' : 'Click here to go'}
                    </button>
                  )}
                  <span className={`text-[10px] block mt-1 opacity-70 ${msg.sender === 'user' ? 'text-primary-100' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.placeholder}
                maxLength={200}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={18} className={isRTL ? 'rotate-180' : ''} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};