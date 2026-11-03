import React, { useState } from 'react';
import { 
  MessageSquareCode, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Volume2, 
  Mic, 
  RefreshCw 
} from 'lucide-react';
import VoiceInputButton, { ReadAloudButton } from '../components/VoiceInputButton';

export default function AssistantPage({ user, t }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Namaste & Welcome! I am your SmartCrop AI Agronomist. Ask me anything about crop diseases, yellowing leaves, reducing fertilizer costs, companion planting, or farmer support schemes.",
      chips: [
        "How to treat yellow leaves in crops?",
        "How to reduce fertilizer cost by 30%?",
        "Best companion crops for maize",
        "PM-KISAN and crop insurance schemes"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          current_crop: "Rice",
          location: "Punjab"
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: data.reply,
            chips: data.suggested_chips || []
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "I experienced a temporary network connection issue. Please verify your query and ask again.",
          chips: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <MessageSquareCode className="w-3.5 h-3.5" />
            AI Agronomist Knowledge Base
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.assistant} & Conversational Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Instant troubleshooting for leaf symptoms, organic pest deterrents, soil amendments, and agricultural subsidies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <VoiceInputButton onSpeechResult={(spokenText) => setInputText(spokenText)} />
          <span className="text-xs text-slate-500 font-semibold">Voice Dictation Ready</span>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div 
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-sm ${
                m.sender === 'user' 
                  ? 'bg-emerald-700 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}>
                <div className="whitespace-pre-line">
                  {m.text}
                </div>

                {m.sender === 'bot' && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <ReadAloudButton textToRead={m.text} />
                  </div>
                )}

                {/* Prompt Chips */}
                {m.chips && m.chips.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {m.chips.map((chip, ci) => (
                      <button
                        key={ci}
                        type="button"
                        onClick={() => sendMessage(chip)}
                        className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 transition"
                      >
                        ⚡ {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-500">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Consulting agronomic knowledge base...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your question or click the mic button..."
            className="flex-1 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <VoiceInputButton onSpeechResult={(spokenText) => setInputText(spokenText)} />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!inputText.trim() || loading}
            className="p-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
