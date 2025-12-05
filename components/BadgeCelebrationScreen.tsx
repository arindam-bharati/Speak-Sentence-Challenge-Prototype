import React from 'react';
import { Award } from 'lucide-react';

interface BadgeCelebrationScreenProps {
  onContinue: () => void;
}

const BadgeCelebrationScreen: React.FC<BadgeCelebrationScreenProps> = ({ onContinue }) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-yellow-300 to-yellow-500 max-w-md mx-auto items-center justify-center p-6 text-white relative overflow-hidden animate-in fade-in duration-500">
      
      {/* Background rays/confetti effect */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-white to-transparent scale-150 animate-spin-slow"></div>

      <div className="z-10 flex flex-col items-center text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500 border-8 border-yellow-200">
            <Award size={96} className="text-yellow-500 fill-current" />
          </div>
          <div className="absolute -bottom-4 bg-red-500 text-white font-bold px-4 py-1 rounded-full shadow-lg border-2 border-white transform -rotate-6">
            NEW!
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold drop-shadow-md">Congratulations!</h2>
          <p className="text-xl font-medium drop-shadow-sm opacity-90">You unlocked a new badge</p>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 w-full">
          <h3 className="text-2xl font-bold mb-1">Confidence Speaker</h3>
          <p className="text-sm opacity-90">Completed 2 speaking challenges successfully.</p>
        </div>
      </div>

      <div className="absolute bottom-8 w-full px-6 z-10">
        <button 
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-bold text-lg bg-white text-yellow-600 hover:bg-gray-50 shadow-lg active:scale-95 transition-all"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};

export default BadgeCelebrationScreen;