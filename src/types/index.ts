export interface TimerSettings {
  focusTime: number; // in minutes
  shortBreakTime: number; // in minutes
  longBreakTime: number; // in minutes
  rounds: number;
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  resources: Resource[];
}

export interface Resource {
  id: string;
  name: string;
  file: File | null;
  url: string;
  subjectId: string;
  uploadDate: Date;
}

export interface Worksheet {
  id: string;
  title: string;
  subject: string;
  description: string;
  questions: WorksheetQuestion[];
  createdAt: Date;
}

export interface WorksheetQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  type: 'multiple-choice' | 'short-answer' | 'long-answer';
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  subject: string;
  messages: Message[];
  createdAt: Date;
}