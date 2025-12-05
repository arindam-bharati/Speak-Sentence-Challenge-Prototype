export enum Screen {
  PRACTICE_TAB = 'PRACTICE_TAB',
  CHALLENGE = 'CHALLENGE',
  COMPLETION = 'COMPLETION',
  FEEDBACK = 'FEEDBACK',
  BADGE_CELEBRATION = 'BADGE_CELEBRATION',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
}

export interface ChallengePrompt {
  id: number;
  words: string[]; // e.g. ["we", "go", "coffee"]
  characterImage?: string; // placeholder URL
}

export interface EvaluationResult {
  promptId: number;
  userTranscript: string;
  isCorrect: boolean; // General pass/fail based on basic word usage
  missingWords: string[];
  grammarFeedback: string;
  exampleSentences: string[]; // Changed from betterSentence to array
  fluencyScore: number; // 0-100
}

export interface SpeechState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
}

// For Gemini JSON Response
export interface GeminiResponseSchema {
  grammarCorrect: boolean;
  usedTargetWords: boolean;
  missingWords: string[];
  feedback: string;
  exampleSentences: string[]; // Changed from improvedSentence to array
}