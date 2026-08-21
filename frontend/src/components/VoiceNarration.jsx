
import { useState, useEffect } from "react";

const VoiceNarration = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false); 
  const [supported, setSupported] = useState(true); 

  
  useEffect(() => {
    setSupported("speechSynthesis" in window);
    
    return () => window.speechSynthesis?.cancel();
  }, []);

  const handleToggle = () => {
    const synth = window.speechSynthesis;

    if (isSpeaking) {
      
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false); 
    utterance.onerror = () => setIsSpeaking(false);

    synth.cancel(); 
    synth.speak(utterance);
    setIsSpeaking(true);
  };

  if (!supported) return null; 

  return (
    <button
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent transition-colors"
      aria-pressed={isSpeaking} 
    >
      
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 5 6 9H2v6h4l5 4V5Z" />
        {isSpeaking && <path d="M15.5 8.5a5 5 0 0 1 0 7" />}
      </svg>
      {isSpeaking ? "Stop narration" : "Listen to this"}
    </button>
  );
};

export default VoiceNarration;