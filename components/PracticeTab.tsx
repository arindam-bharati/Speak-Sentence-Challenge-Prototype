import React from 'react';
import { Mic, Headphones, BookOpen, Radio, MessageCircle, HeartCrack, Video } from 'lucide-react';

interface PracticeTabProps {
  onStartChallenge: () => void;
  onOpenAchievements: () => void;
  hasBadgeNotification: boolean;
}

const PracticeTab: React.FC<PracticeTabProps> = ({ 
  onStartChallenge, 
  onOpenAchievements,
  hasBadgeNotification 
}) => {
  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto shadow-xl overflow-hidden">
      {/* Clean, Editorial Header */}
      <div className="px-6 pt-8 pb-4 bg-white flex flex-col justify-end">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Practice
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* The Feature - Priority at Top */}
        <div 
          onClick={onStartChallenge}
          className="group bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer transition-all active:scale-95 transform duration-150 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 p-2 opacity-10">
             <MessageCircle size={80} className="text-green-700" />
          </div>
          
          <div className="bg-green-500 p-3 rounded-xl text-white shadow-lg z-10 group-hover:bg-green-600 transition-colors">
            <MessageCircle size={24} />
          </div>
          <div className="flex-1 z-10">
            <h3 className="font-bold text-gray-800 text-lg leading-tight">Speak to Form Sentences</h3>
            <p className="text-sm text-green-700 font-medium mt-1">Challenge yourself!</p>
          </div>
          <div className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10 tracking-wide">
            NEW
          </div>
        </div>

        {/* Standard Practice Items */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-blue-50 rounded-2xl p-4 flex items-center space-x-4 hover:bg-blue-100 transition-colors cursor-pointer">
            <div className="bg-blue-500 p-3 rounded-xl text-white shadow-sm">
              <Mic size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">Speak</h3>
              <p className="text-sm text-gray-500">Practice pronunciation</p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 flex items-center space-x-4 hover:bg-purple-100 transition-colors cursor-pointer">
            <div className="bg-purple-500 p-3 rounded-xl text-white shadow-sm">
              <Headphones size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">Listen</h3>
              <p className="text-sm text-gray-500">Improve comprehension</p>
            </div>
          </div>

          {/* Mistakes */}
          <div className="bg-red-50 rounded-2xl p-4 flex items-center space-x-4 hover:bg-red-100 transition-colors cursor-pointer">
            <div className="bg-red-500 p-3 rounded-xl text-white shadow-sm">
              <HeartCrack size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">Mistakes</h3>
              <p className="text-sm text-gray-500">Review your errors</p>
            </div>
          </div>

          <div className="bg-orange-50 rounded-2xl p-4 flex items-center space-x-4 hover:bg-orange-100 transition-colors cursor-pointer">
            <div className="bg-orange-500 p-3 rounded-xl text-white shadow-sm">
              <BookOpen size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">Stories</h3>
              <p className="text-sm text-gray-500">Read short stories</p>
            </div>
          </div>

          <div className="bg-teal-50 rounded-2xl p-4 flex items-center space-x-4 hover:bg-teal-100 transition-colors cursor-pointer">
            <div className="bg-teal-500 p-3 rounded-xl text-white shadow-sm">
              <Radio size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">Radio</h3>
              <p className="text-sm text-gray-500">Listen to podcasts</p>
            </div>
          </div>

          {/* Video Call */}
          <div className="bg-indigo-50 rounded-2xl p-4 flex items-center space-x-4 hover:bg-indigo-100 transition-colors cursor-pointer">
            <div className="bg-indigo-500 p-3 rounded-xl text-white shadow-sm">
              <Video size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">Video Call</h3>
              <p className="text-sm text-gray-500">Chat with AI Tutor</p>
            </div>
          </div>
        </div>

      </div>
      
      {/* Bottom Nav */}
      <div className="border-t border-gray-100 p-2 pb-6 flex justify-around text-gray-300 items-center bg-white">
        <div className="hover:text-green-500 hover:bg-gray-50 rounded-xl cursor-pointer p-4 transition-all">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        
        {/* Achievements Icon - Colored to catch eye */}
        <button 
          onClick={onOpenAchievements}
          className={`relative p-4 rounded-xl transition-all group ${
            hasBadgeNotification 
              ? 'text-amber-500 bg-amber-100' 
              : 'text-amber-500 hover:bg-amber-50'
          }`}
        >
          <span className={`block transform transition-transform group-hover:scale-110 ${hasBadgeNotification ? 'animate-bounce' : ''}`}>
             {/* Target Icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </span>
          {hasBadgeNotification && (
            <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
          )}
        </button>

        <div className="text-green-500 bg-green-50 rounded-xl cursor-pointer p-4 transition-all shadow-sm">
           {/* Dumbbell Icon for Practice */}
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
        </div>
        
        <div className="hover:text-green-500 hover:bg-gray-50 rounded-xl cursor-pointer p-4 transition-all">
           {/* User Icon */}
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      </div>
    </div>
  );
};

export default PracticeTab;