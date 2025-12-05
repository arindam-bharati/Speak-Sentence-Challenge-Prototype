import React from 'react';
import { Zap, Clock, ArrowRight } from 'lucide-react';

interface CompletionScreenProps {
  onSeeFeedback: () => void;
  onHome: () => void;
  xp: number;
  timeTaken: string;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onSeeFeedback, onHome, xp, timeTaken }) => {
  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto items-center justify-center p-6 space-y-10 animate-in zoom-in duration-500">
      
      {/* Celebration Header */}
      <div className="relative mt-8">
        <div className="absolute inset-0 bg-yellow-200 rounded-full blur-2xl opacity-60 animate-pulse"></div>
        <img 
          src="https://img.freepik.com/free-vector/trophy-flat-style_78370-3222.jpg" 
          alt="Trophy" 
          className="w-48 h-48 relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Challenge Complete!</h2>
        <p className="text-gray-500 font-medium text-lg">You are making great progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="flex w-full justify-center space-x-6">
        
        {/* XP Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-100 p-5 rounded-3xl flex flex-col items-center w-36 shadow-lg transform transition-transform hover:-translate-y-1">
          <span className="font-bold text-orange-400 text-xs uppercase tracking-widest mb-2">Total XP</span>
          <div className="flex items-center text-orange-500 font-black text-4xl">
            <Zap className="fill-current mr-1 stroke-[3px]" size={28} /> {xp}
          </div>
        </div>
        
        {/* Time Card - Replaced 'Amazing' */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-cyan-100 p-5 rounded-3xl flex flex-col items-center w-36 shadow-lg transform transition-transform hover:-translate-y-1">
           <span className="font-bold text-cyan-500 text-xs uppercase tracking-widest mb-2">Time Taken</span>
           <div className="flex items-center text-cyan-600 font-black text-3xl">
             <Clock className="mr-2 stroke-[3px]" size={24} />
             <span>{timeTaken}</span>
           </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-4 pt-4">
        <button 
          onClick={onSeeFeedback}
          className="group w-full py-4 rounded-2xl font-bold text-lg bg-white border-2 border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 shadow-sm transition-all flex items-center justify-center"
        >
          Detailed Feedback
        </button>

        <button 
          onClick={onHome}
          className="w-full py-4 rounded-2xl font-bold text-lg bg-green-500 text-white hover:bg-green-600 shadow-[0_4px_0_rgb(22,163,74)] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center"
        >
          Continue <ArrowRight className="ml-2" size={20} strokeWidth={3} />
        </button>
      </div>

    </div>
  );
};

export default CompletionScreen;