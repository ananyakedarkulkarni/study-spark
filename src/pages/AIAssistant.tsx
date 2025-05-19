import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { MessageSquare, Send, User, Bot, HelpCircle, RefreshCw, ChevronDown } from 'lucide-react';

interface MessageProps {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Message: React.FC<MessageProps> = ({ content, sender, timestamp }) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] ${
        sender === 'user' 
          ? 'bg-blue-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
          : 'bg-gray-100 text-gray-800 rounded-tr-lg rounded-tl-lg rounded-br-lg'
      } px-4 py-3 shadow-sm`}>
        <div className="flex items-center mb-1">
          {sender === 'assistant' ? (
            <Bot size={16} className="mr-2 text-blue-600" />
          ) : (
            <User size={16} className="mr-2" />
          )}
          <span className={`text-xs ${sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
            {sender === 'user' ? 'You' : 'AI Assistant'} • {formatTime(timestamp)}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

interface SubjectSelectorProps {
  subjects: string[];
  onSelect: (subject: string) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ subjects, onSelect }) => {
  return (
    <div className="text-center py-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Select a subject to get started
      </h2>
      <p className="text-gray-600 mb-6">
        The AI assistant will reference your uploaded study materials for this subject
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-3xl mx-auto">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => onSelect(subject)}
            className="bg-white hover:bg-blue-50 text-gray-800 border border-gray-200 rounded-lg p-4 transition-colors shadow-sm hover:border-blue-300"
          >
            <div className="text-blue-600 mb-2">
              <MessageSquare size={24} className="mx-auto" />
            </div>
            <span className="font-medium">{subject}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

interface WelcomeMessageProps {
  subject: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ subject }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
      <div className="flex items-start">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <HelpCircle size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium text-blue-800 mb-1">AI Assistant for {subject}</h3>
          <p className="text-blue-700 text-sm">
            I can help you with questions related to your {subject} materials. Try asking me about concepts, problems, or specific topics from your NCERT Class 9 syllabus.
          </p>
        </div>
      </div>
    </div>
  );
};

const AIAssistant: React.FC = () => {
  const { subjects, conversations, currentConversation, setCurrentConversation, addConversation, addMessage } = useAppContext();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const subjectNames = subjects.map(subject => subject.name);
  
  const handleSendMessage = () => {
    if (!message.trim() || !currentConversation) return;
    
    // Add user message
    addMessage(currentConversation.id, message, 'user');
    setMessage('');
    setIsLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      let response = `I'll help you with your ${currentConversation.subject} question. `;
      
      if (message.toLowerCase().includes('what') && message.toLowerCase().includes('chapter')) {
        response += `The NCERT Class 9 ${currentConversation.subject} textbook typically covers topics such as:
        
1. Basic concepts and fundamentals
2. Problem-solving techniques
3. Real-world applications
        
Is there a specific chapter or topic you'd like me to explain?`;
      } else if (message.toLowerCase().includes('explain') || message.toLowerCase().includes('how')) {
        response += `Here's an explanation based on the NCERT materials:
        
The concept you're asking about is fundamental in ${currentConversation.subject}. According to the textbook, it involves understanding the core principles and applying them systematically to solve problems.

Would you like me to provide a step-by-step example?`;
      } else if (message.toLowerCase().includes('example') || message.toLowerCase().includes('problem')) {
        response += `Here's an example problem from the NCERT ${currentConversation.subject} textbook:
        
Problem: [Example problem would be shown here]

Step 1: Understand what the problem is asking
Step 2: Identify the relevant concepts
Step 3: Apply the appropriate formula or method
Step 4: Solve step-by-step
Step 5: Verify your answer

Does this help? Would you like me to explain any part in more detail?`;
      } else {
        response += `Based on the NCERT Class 9 ${currentConversation.subject} curriculum, I can provide information on various topics including fundamental concepts, problem-solving approaches, and examples.

What specific aspect of ${currentConversation.subject} would you like to learn more about?`;
      }
      
      // Add AI response
      addMessage(currentConversation.id, response, 'assistant');
      setIsLoading(false);
    }, 1500);
  };
  
  const handleStartNewConversation = (subject: string) => {
    addConversation(subject);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages]);
  
  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Study Assistant</h1>
        <p className="text-gray-600">
          Get help with your studies using our AI assistant that references your uploaded materials
        </p>
      </div>
      
      <div className="flex-grow flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        {!currentConversation ? (
          <SubjectSelector 
            subjects={subjectNames} 
            onSelect={handleStartNewConversation} 
          />
        ) : (
          <>
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <MessageSquare size={20} className="text-blue-600 mr-2" />
                  <h2 className="font-semibold text-gray-800">
                    {currentConversation.subject} Assistant
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentConversation(null)}
                  className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                >
                  New Chat <ChevronDown size={16} className="ml-1" />
                </button>
              </div>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto">
              {currentConversation.messages.length === 0 && (
                <WelcomeMessage subject={currentConversation.subject} />
              )}
              
              {currentConversation.messages.map((msg) => (
                <Message
                  key={msg.id}
                  content={msg.content}
                  sender={msg.sender}
                  timestamp={msg.timestamp}
                />
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 text-gray-800 rounded-tr-lg rounded-tl-lg rounded-br-lg px-4 py-3 shadow-sm max-w-[75%]">
                    <div className="flex items-center">
                      <Bot size={16} className="mr-2 text-blue-600" />
                      <span className="text-xs text-gray-500">AI Assistant</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <RefreshCw size={16} className="animate-spin text-blue-600 mr-2" />
                      <span className="text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask about ${currentConversation.subject}...`}
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className={`absolute right-3 bottom-3 text-white p-2 rounded-full ${
                    message.trim() && !isLoading
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for a new line
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;