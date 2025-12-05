import React from 'react';
import { ArrowLeft, Award, Lock } from 'lucide-react';

interface AchievementsScreenProps {
  earnedBadges: string[];
  onBack: () => void;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ earnedBadges, onBack }) => {
  const isConfidenceUnlocked = earnedBadges.includes('CONFIDENCE_SPEAKER');

  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50">
        <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="flex-1 text-center font-bold text-xl text-gray-700 mr-8">Achievements</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Banner */}
        <div className="bg-yellow-100 rounded-2xl p-6 flex items-center justify-between mb-8">
           <div>
             <h2 className="font-bold text-yellow-800 text-lg">Badge Collection</h2>
             <p className="text-yellow-700 text-sm">Keep practicing to earn them all!</p>
           </div>
           <Award size={40} className="text-yellow-600" />
        </div>

        {/* Badge List */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Confidence Badge */}
          <div className={`flex flex-col items-center p-4 rounded-xl border-2 text-center transition-all ${
            isConfidenceUnlocked 
              ? 'border-yellow-400 bg-yellow-50 shadow-md' 
              : 'border-gray-200 bg-gray-50 opacity-60'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${
               isConfidenceUnlocked ? 'bg-yellow-200' : 'bg-gray-200'
            }`}>
              {isConfidenceUnlocked ? (
                <Award size={40} className="text-yellow-600 fill-current" />
              ) : (
                <Lock size={32} className="text-gray-400" />
              )}
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-1">Confidence Speaker</h3>
            <p className="text-xs text-gray-500">
              {isConfidenceUnlocked ? "Completed 2 challenges!" : "Complete 2 challenges to unlock"}
            </p>
            {isConfidenceUnlocked && (
              <span className="mt-2 text-[10px] font-bold bg-yellow-400 text-white px-2 py-0.5 rounded-full">
                EARNED
              </span>
            )}
          </div>

          {/* Placeholder for other badges */}
          <div className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-60 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
               <Lock size={32} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-1">Grammar Guru</h3>
            <p className="text-xs text-gray-500">Score 100% on 5 challenges</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-60 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
               <Lock size={32} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-1">Early Bird</h3>
            <p className="text-xs text-gray-500">Practice before 8 AM</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-60 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
               <Lock size={32} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-1">Streak Master</h3>
            <p className="text-xs text-gray-500">Maintain a 7 day streak</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AchievementsScreen;