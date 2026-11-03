import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function VoiceInputButton({ onSpeechResult, placeholder = "Speak..." }) {
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMsg('');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      if (onSpeechResult) {
        onSpeechResult(transcript);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setErrorMsg('Could not capture audio');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleListening}
        className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center ${
          isListening 
            ? 'bg-red-500 text-white ring-4 ring-red-200 animate-pulse' 
            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
        }`}
        title={isListening ? "Listening... Speak now" : "Click to speak voice input"}
      >
        {isListening ? <Mic className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
      </button>
      {isListening && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow whitespace-nowrap">
          Listening...
        </span>
      )}
    </div>
  );
}

export function ReadAloudButton({ textToRead }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const cleanText = textToRead.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={speak}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
        speaking ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
      }`}
      title="Listen to recommendation aloud"
    >
      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
      {speaking ? 'Stop Audio' : 'Read Aloud'}
    </button>
  );
}
