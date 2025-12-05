import React, { useState, useEffect, useRef } from 'react';
import PracticeTab from './components/PracticeTab';
import ChallengeScreen from './components/ChallengeScreen';
import CompletionScreen from './components/CompletionScreen';
import FeedbackScreen from './components/FeedbackScreen';
import BadgeCelebrationScreen from './components/BadgeCelebrationScreen';
import AchievementsScreen from './components/AchievementsScreen';
import { Screen, ChallengePrompt, EvaluationResult } from './types';

// Hardcoded Prompts as per PRD
const SAMPLE_PROMPTS: ChallengePrompt[] = [
  { 
    id: 1, 
    words: ["we", "go", "coffee"],
    characterImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&h=200" // Coffee cup/shop vibe
  },
  { 
    id: 2, 
    words: ["Hey", "good", "you?"],
    characterImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200" // Friendly person smiling
  },
  { 
    id: 3, 
    words: ["restaurant", "tonight", "food"],
    characterImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=200&h=200" // Restaurant setting
  },
];

const BADGE_ID_CONFIDENCE = 'CONFIDENCE_SPEAKER';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.PRACTICE_TAB);
  const [sessionResults, setSessionResults] = useState<EvaluationResult[]>([]);
  const [sessionXP, setSessionXP] = useState<number>(0);
  const [sessionTime, setSessionTime] = useState<string>("0:00");
  
  // Persistent State
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [consecutivePerfectCount, setConsecutivePerfectCount] = useState<number>(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [hasBadgeNotification, setHasBadgeNotification] = useState<boolean>(false);
  
  // Temporary state to control navigation flow after challenge
  const [justUnlockedBadge, setJustUnlockedBadge] = useState<boolean>(false);

  const startTimeRef = useRef<number>(0);

  // Load from local storage on mount
  useEffect(() => {
    const storedCount = localStorage.getItem('lingo_completed_count');
    const storedBadges = localStorage.getItem('lingo_earned_badges');
    const storedStreak = localStorage.getItem('lingo_consecutive_perfect');
    
    if (storedCount) setCompletedCount(parseInt(storedCount, 10));
    if (storedStreak) setConsecutivePerfectCount(parseInt(storedStreak, 10));
    if (storedBadges) {
      const badges = JSON.parse(storedBadges);
      setEarnedBadges(badges);
    }
  }, []);

  const startChallenge = () => {
    startTimeRef.current = Date.now();
    setSessionResults([]);
    setSessionXP(0);
    setCurrentScreen(Screen.CHALLENGE);
  };

  const handleChallengeComplete = (results: EvaluationResult[]) => {
    // Calculate Duration
    const endTime = Date.now();
    const durationMs = endTime - startTimeRef.current;
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    setSessionTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);

    setSessionResults(results);
    
    // 1. Calculate XP
    let xp = 0;
    let isPerfect = true;
    
    results.forEach(r => {
      if (r.isCorrect) {
        xp += 25;
      } else {
        xp -= 10;
        isPerfect = false;
      }
    });
    
    if (xp < 0) xp = 0; // Ensure XP doesn't go below 0
    setSessionXP(xp);

    // 2. Update completion stats
    const newCount = completedCount + 1;
    setCompletedCount(newCount);
    localStorage.setItem('lingo_completed_count', newCount.toString());

    // 3. Strict Badge Logic: 2 consecutive perfect challenges
    let newStreak = isPerfect ? consecutivePerfectCount + 1 : 0;
    setConsecutivePerfectCount(newStreak);
    localStorage.setItem('lingo_consecutive_perfect', newStreak.toString());

    if (newStreak >= 2 && !earnedBadges.includes(BADGE_ID_CONFIDENCE)) {
      const newBadges = [...earnedBadges, BADGE_ID_CONFIDENCE];
      setEarnedBadges(newBadges);
      localStorage.setItem('lingo_earned_badges', JSON.stringify(newBadges));
      
      setJustUnlockedBadge(true);
      setHasBadgeNotification(true); 
    } else {
      setJustUnlockedBadge(false);
    }

    setCurrentScreen(Screen.COMPLETION);
  };

  // Called from CompletionScreen "Continue" button
  const handleCompletionContinue = () => {
    if (justUnlockedBadge) {
      setCurrentScreen(Screen.BADGE_CELEBRATION);
      setJustUnlockedBadge(false); // Reset so we don't show it again immediately
    } else {
      setCurrentScreen(Screen.PRACTICE_TAB);
    }
  };

  const handleOpenAchievements = () => {
    setHasBadgeNotification(false); // Clear notification when viewing
    setCurrentScreen(Screen.ACHIEVEMENTS);
  };

  const handleExit = () => {
    setCurrentScreen(Screen.PRACTICE_TAB);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.PRACTICE_TAB:
        return (
          <PracticeTab 
            onStartChallenge={startChallenge} 
            onOpenAchievements={handleOpenAchievements}
            hasBadgeNotification={hasBadgeNotification}
          />
        );
      
      case Screen.CHALLENGE:
        return (
          <ChallengeScreen 
            prompts={SAMPLE_PROMPTS}
            onComplete={handleChallengeComplete}
            onExit={handleExit}
          />
        );

      case Screen.COMPLETION:
        return (
          <CompletionScreen 
            onSeeFeedback={() => setCurrentScreen(Screen.FEEDBACK)}
            onHome={handleCompletionContinue} // Logic determines next screen
            xp={sessionXP}
            timeTaken={sessionTime}
          />
        );

      case Screen.BADGE_CELEBRATION:
        return (
          <BadgeCelebrationScreen 
            onContinue={() => setCurrentScreen(Screen.PRACTICE_TAB)}
          />
        );

      case Screen.ACHIEVEMENTS:
        return (
          <AchievementsScreen 
            earnedBadges={earnedBadges}
            onBack={handleExit}
          />
        );

      case Screen.FEEDBACK:
        return (
          <FeedbackScreen 
            results={sessionResults}
            onFinish={handleExit}
          />
        );
      
      default:
        return <PracticeTab onStartChallenge={startChallenge} onOpenAchievements={handleOpenAchievements} hasBadgeNotification={false} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-8 px-4">
      {/* Container simulating a mobile device view */}
      <div className="w-full max-w-md h-[800px] bg-white rounded-[32px] overflow-hidden shadow-2xl relative border-8 border-gray-900">
        {/* Notch simulation */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-2xl z-50"></div>
        
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;