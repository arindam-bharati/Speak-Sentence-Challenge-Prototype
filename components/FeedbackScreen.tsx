import React from 'react';
import { EvaluationResult } from '../types';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface FeedbackScreenProps {
  results: EvaluationResult[];
  onFinish: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ results, onFinish }) => {
  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center">
        <button onClick={onFinish} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-gray-700 mr-8">Session Feedback</h1>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-800 mb-2">Things to improve!</h3>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
             <li>Review the alternatives below for better fluency.</li>
             <li>Focus on grammar when forming sentences.</li>
          </ul>
        </div>

        {results.map((result, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                Prompt {idx + 1}
              </span>
              {result.isCorrect ? (
                <span className="flex items-center text-green-600 text-sm font-bold">
                  <CheckCircle size={16} className="mr-1" /> Excellent
                </span>
              ) : (
                <span className="flex items-center text-orange-500 text-sm font-bold">
                  <AlertCircle size={16} className="mr-1" /> Needs Work
                </span>
              )}
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">You said:</p>
              <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg">"{result.userTranscript}"</p>
            </div>

            <div className="mb-4">
               <p className="text-xs text-green-600 font-bold uppercase mb-1">
                 {result.isCorrect ? "Alternative sentences:" : "Better alternatives:"}
               </p>
               <div className="space-y-2">
                 {result.exampleSentences && result.exampleSentences.map((sent, i) => (
                   <div key={i} className="text-green-700 font-medium bg-green-50 p-3 rounded-lg border border-green-100">
                      "{sent}"
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic">
               AI Feedback: {result.grammarFeedback}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onFinish}
          className="w-full py-4 rounded-2xl font-bold text-lg bg-green-500 text-white hover:bg-green-600 shadow-[0_4px_0_rgb(22,163,74)] active:shadow-none active:translate-y-[4px] transition-all"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default FeedbackScreen;