import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  TimerSettings, 
  TimerMode, 
  TimerStatus, 
  Note, 
  Subject, 
  Resource, 
  Worksheet,
  Conversation
} from '../types';

interface AppContextType {
  // Timer related
  timerSettings: TimerSettings;
  updateTimerSettings: (settings: Partial<TimerSettings>) => void;
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => void;
  timerStatus: TimerStatus;
  setTimerStatus: (status: TimerStatus) => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  currentRound: number;
  setCurrentRound: (round: number) => void;
  
  // Note related
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, noteData: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Subject and Resource related
  subjects: Subject[];
  addSubject: (name: string) => void;
  deleteSubject: (id: string) => void;
  addResource: (subjectId: string, resource: Omit<Resource, 'id' | 'subjectId' | 'uploadDate'>) => void;
  deleteResource: (subjectId: string, resourceId: string) => void;
  
  // Worksheet related
  worksheets: Worksheet[];
  addWorksheet: (worksheet: Omit<Worksheet, 'id' | 'createdAt'>) => void;
  updateWorksheet: (id: string, worksheetData: Partial<Worksheet>) => void;
  deleteWorksheet: (id: string) => void;
  
  // AI Assistant related
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addConversation: (subject: string) => void;
  addMessage: (conversationId: string, content: string, sender: 'user' | 'assistant') => void;
  
  // UI state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Default timer settings
const defaultTimerSettings: TimerSettings = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  rounds: 4
};

// Create context with default values
const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data for subjects
const initialSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', resources: [] },
  { id: '2', name: 'Science', resources: [] },
  { id: '3', name: 'Social Science', resources: [] },
  { id: '4', name: 'English', resources: [] },
  { id: '5', name: 'Marathi', resources: [] },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Timer state
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(defaultTimerSettings);
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [timeRemaining, setTimeRemaining] = useState<number>(timerSettings.focusTime * 60);
  const [currentRound, setCurrentRound] = useState<number>(1);
  
  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Subject and Resource state
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  
  // Worksheet state
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  
  // AI Assistant state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  
  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Timer settings update
  const updateTimerSettings = (settings: Partial<TimerSettings>) => {
    setTimerSettings(prev => ({ ...prev, ...settings }));
  };

  // Notes operations
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, noteData: Partial<Note>) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id 
          ? { ...note, ...noteData, updatedAt: new Date() } 
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // Subject operations
  const addSubject = (name: string) => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name,
      resources: []
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  // Resource operations
  const addResource = (subjectId: string, resource: Omit<Resource, 'id' | 'subjectId' | 'uploadDate'>) => {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
      subjectId,
      uploadDate: new Date()
    };

    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId
          ? { ...subject, resources: [...subject.resources, newResource] }
          : subject
      )
    );
  };

  const deleteResource = (subjectId: string, resourceId: string) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId
          ? { 
              ...subject, 
              resources: subject.resources.filter(resource => resource.id !== resourceId) 
            }
          : subject
      )
    );
  };

  // Worksheet operations
  const addWorksheet = (worksheet: Omit<Worksheet, 'id' | 'createdAt'>) => {
    const newWorksheet: Worksheet = {
      ...worksheet,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setWorksheets(prev => [...prev, newWorksheet]);
  };

  const updateWorksheet = (id: string, worksheetData: Partial<Worksheet>) => {
    setWorksheets(prev => 
      prev.map(worksheet => 
        worksheet.id === id 
          ? { ...worksheet, ...worksheetData } 
          : worksheet
      )
    );
  };

  const deleteWorksheet = (id: string) => {
    setWorksheets(prev => prev.filter(worksheet => worksheet.id !== id));
  };

  // AI Assistant operations
  const addConversation = (subject: string) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      subject,
      messages: [],
      createdAt: new Date()
    };
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
  };

  const addMessage = (conversationId: string, content: string, sender: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date()
    };

    setConversations(prev => 
      prev.map(conversation => 
        conversation.id === conversationId
          ? { 
              ...conversation, 
              messages: [...conversation.messages, newMessage] 
            }
          : conversation
      )
    );

    if (currentConversation?.id === conversationId) {
      setCurrentConversation(prev => 
        prev ? { 
          ...prev, 
          messages: [...prev.messages, newMessage] 
        } : null
      );
    }
  };

  // UI operations
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Effect to update timeRemaining when timerMode or timerSettings change
  useEffect(() => {
    if (timerStatus === 'idle') {
      switch (timerMode) {
        case 'focus':
          setTimeRemaining(timerSettings.focusTime * 60);
          break;
        case 'shortBreak':
          setTimeRemaining(timerSettings.shortBreakTime * 60);
          break;
        case 'longBreak':
          setTimeRemaining(timerSettings.longBreakTime * 60);
          break;
      }
    }
  }, [timerMode, timerSettings, timerStatus]);

  const contextValue: AppContextType = {
    timerSettings,
    updateTimerSettings,
    timerMode,
    setTimerMode,
    timerStatus,
    setTimerStatus,
    timeRemaining,
    setTimeRemaining,
    currentRound,
    setCurrentRound,
    notes,
    addNote,
    updateNote,
    deleteNote,
    subjects,
    addSubject,
    deleteSubject,
    addResource,
    deleteResource,
    worksheets,
    addWorksheet,
    updateWorksheet,
    deleteWorksheet,
    conversations,
    currentConversation,
    setCurrentConversation,
    addConversation,
    addMessage,
    isSidebarOpen,
    toggleSidebar
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};