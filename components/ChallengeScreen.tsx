import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { ChallengePrompt, EvaluationResult } from '../types';
import { evaluateSentence } from '../services/geminiService';
import { VoiceVisualizer } from './VoiceVisualizer';

interface ChallengeScreenProps {
  prompts: ChallengePrompt[];
  onComplete: (results: EvaluationResult[]) => void;
  onExit: () => void;
}

// Helper for Web Speech API
const getSpeechRecognition = () => {
  if (typeof window !== 'undefined') {
    // @ts-ignore - Vendor prefixes
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }
  return null;
};

const MAX_TIME_SECONDS = 120; // 2 minutes

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ prompts, onComplete, onExit }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isChecking, setIsChecking] = useState(false); // AI loading state
  const [hasChecked, setHasChecked] = useState(false); // Result shown state
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME_SECONDS);
  const [timerActive, setTimerActive] = useState(true);
  const [aiResponse, setAiResponse] = useState<any>(null); // Store temp AI response
  
  // XP Animation State
  const [xpNotification, setXpNotification] = useState<{ value: number; id: number } | null>(null);

  const recognitionRef = useRef<any>(null);

  const currentPrompt = prompts[currentPromptIndex];
  const isLastPrompt = currentPromptIndex === prompts.length - 1;

  // Timer Logic
  useEffect(() => {
    if (!timerActive) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishChallenge(); // Auto finish on time out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
             // We could use interim for real-time preview, 
             // but for simplicity we just grab the latest
             setTranscript(prev => {
                // simple strategy: Replace completely if new interim
                return event.results[i][0].transcript;
             });
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (hasChecked) return; // Disable mic if already checked

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript(''); // Clear previous try
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleCheck = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    if (!transcript.trim()) return;

    setIsChecking(true);
    setTimerActive(false); // Pause timer while checking

    // Call Gemini
    const evaluation = await evaluateSentence(currentPrompt.words, transcript);
    setAiResponse(evaluation);
    
    // Construct Result Object
    const isCorrect = evaluation.grammarCorrect && evaluation.usedTargetWords;
    
    const result: EvaluationResult = {
      promptId: currentPrompt.id,
      userTranscript: transcript,
      isCorrect: isCorrect,
      missingWords: evaluation.missingWords,
      grammarFeedback: evaluation.feedback,
      exampleSentences: evaluation.exampleSentences,
      fluencyScore: evaluation.grammarCorrect ? 100 : 50, // Simplified score
    };

    setResults([...results, result]);
    setHasChecked(true);
    setIsChecking(false);

    // Trigger XP Animation
    const xpChange = isCorrect ? 25 : -10;
    setXpNotification({ value: xpChange, id: Date.now() });
    
    // Clear animation after it plays
    setTimeout(() => {
      setXpNotification(null);
    }, 2000);
  };

  const handleNext = () => {
    if (isLastPrompt) {
      finishChallenge();
    } else {
      setCurrentPromptIndex(prev => prev + 1);
      resetState();
    }
  };

  const finishChallenge = () => {
    onComplete(results);
  };

  const resetState = () => {
    setTranscript('');
    setHasChecked(false);
    setAiResponse(null);
    setIsListening(false);
    setTimerActive(true);
    setXpNotification(null);
  };

  // Progress Bar Width
  const progressWidth = (timeLeft / MAX_TIME_SECONDS) * 100;

  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto relative shadow-2xl overflow-hidden">
      
      {/* XP Animation Styles */}
      <style>{`
        @keyframes xpSlide {
          0% { opacity: 0; transform: translate(-150%, -50%) scale(0.5); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(50%, -50%) scale(0.8); }
        }
        .xp-anim-text {
          animation: xpSlide 1.5s ease-out forwards;
        }
      `}</style>

      {/* Floating XP Notification */}
      {xpNotification && (
        <div 
          key={xpNotification.id} 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 xp-anim-text"
        >
           <span 
             className={`text-5xl font-black drop-shadow-xl stroke-white ${
               xpNotification.value > 0 ? 'text-yellow-400' : 'text-red-500'
             }`}
             style={{ 
               textShadow: '2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff' 
             }}
           >
             {xpNotification.value > 0 ? '+' : ''}{xpNotification.value} XP
           </span>
        </div>
      )}

      {/* Header with Timer */}
      <div className="p-4 pt-8 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
          <div className="flex-1 mx-4 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <span className="text-sm font-bold text-green-600">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
          Speak to Form Sentences
        </h2>
        <p className="text-gray-500 text-center text-sm">
          Use the words below to create a sentence.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start p-6 space-y-8 overflow-y-auto w-full">
        
        {/* Character */}
        <div className="relative shrink-0">
          <img 
            src={currentPrompt.characterImage || "https://picsum.photos/100/100"} 
            alt="Context Avatar" 
            className="w-24 h-24 rounded-full border-4 border-gray-100 object-cover shadow-sm"
          />
           <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1 rounded-full">
            ⭐
           </div>
        </div>

        {/* Word Prompt Bubble */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm w-full relative shrink-0">
           <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-l-2 border-b-2 border-gray-200 rotate-45"></div>
           <div className="flex flex-wrap gap-2 justify-center">
             {currentPrompt.words.map((word, i) => (
               <span key={i} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-bold text-lg">
                 {word}
               </span>
             ))}
           </div>
        </div>

        {/* Transcript / Input Area */}
        <div className={`w-full min-h-[80px] p-4 rounded-xl border-2 transition-colors shrink-0 ${
          isListening ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'
        }`}>
          {transcript ? (
            <p className="text-lg font-medium text-gray-800 text-center">
              "{transcript}"
            </p>
          ) : (
            <p className="text-gray-400 text-center italic">
              {isListening ? "Listening..." : "Tap the mic and speak..."}
            </p>
          )}
          {isListening && <div className="mt-4"><VoiceVisualizer /></div>}
        </div>

      </div>

      {/* Footer Controls */}
      <div className="p-6 border-t border-gray-100 bg-white shrink-0 z-10">
        
        {!hasChecked ? (
          <div className="flex flex-col items-center space-y-4">
             {/* Mic Button */}
            <button
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
                isListening 
                  ? 'bg-red-500 ring-4 ring-red-200 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
               {isListening ? <div className="w-8 h-8 bg-white rounded-md" /> : <Mic size={32} className="text-white" />}
            </button>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              {isListening ? 'Tap to Stop' : 'Tap to Speak'}
            </p>

            <button 
              onClick={handleCheck}
              disabled={!transcript || isListening}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-b-md transition-all ${
                !transcript || isListening
                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                 : 'bg-green-500 text-white hover:bg-green-600 shadow-[0_4px_0_rgb(22,163,74)] active:shadow-none active:translate-y-[4px]'
              }`}
            >
              {isChecking ? "Checking..." : "CHECK"}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Immediate Feedback */}
            <div className={`p-4 rounded-xl flex items-start space-x-3 max-h-64 overflow-y-auto ${
              aiResponse?.grammarCorrect && aiResponse?.usedTargetWords 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
               <div className="mt-1 shrink-0">
                 {aiResponse?.grammarCorrect && aiResponse?.usedTargetWords ? <Check size={20} /> : <RotateCcw size={20} />}
               </div>
               <div>
                 <h4 className="font-bold">
                    {aiResponse?.grammarCorrect && aiResponse?.usedTargetWords ? "Great Job!" : "Almost there!"}
                 </h4>
                 <p className="text-sm mt-1 leading-relaxed">{aiResponse?.feedback}</p>
                 {!aiResponse?.grammarCorrect && aiResponse?.exampleSentences?.length > 0 && (
                   <div className="mt-2 text-sm font-semibold bg-white/50 p-2 rounded">
                      Better: "{aiResponse?.exampleSentences[0]}"
                   </div>
                 )}
               </div>
            </div>

            <button 
              onClick={handleNext}
              className="w-full py-4 rounded-2xl font-bold text-lg bg-green-500 text-white hover:bg-green-600 shadow-[0_4px_0_rgb(22,163,74)] active:shadow-none active:translate-y-[4px] transition-all"
            >
               {isLastPrompt ? "FINISH" : "NEXT"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeScreen;