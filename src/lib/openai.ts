import OpenAI from 'openai';
import { getSubjectContext } from './supabase';
import { WorksheetQuestion } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateAIResponse = async (prompt: string, subject: string) => {
  try {
    // Get subject context from database
    const context = await getSubjectContext(subject);

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are an educational AI assistant helping Class 9 students with NCERT and Maharashtra State Board subjects. Use this context for your responses: ${context}`
        },
        { role: "user", content: prompt }
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'I apologize, but I encountered an error. Please try again.';
  }
};

export const generateWorksheet = async (subject: string, chapter: string, difficulty: string): Promise<WorksheetQuestion[]> => {
  try {
    const context = await getSubjectContext(subject);
    const prompt = `Create a worksheet for Class 9 ${subject}, chapter: ${chapter}, difficulty: ${difficulty}. 
    Include 5 multiple choice questions, 3 short answer questions, and 2 long answer questions.
    Format the response as a JSON array with this structure:
    [
      {
        "question": "Question text",
        "type": "multiple-choice",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": "correct option"
      }
    ]`;
    
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are an educational worksheet generator for Class 9 students. Use this context: ${context}`
        },
        { role: "user", content: prompt }
      ],
      model: "gpt-3.5-turbo-json",
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || '[]');
    return response.questions.map((q: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      ...q
    }));
  } catch (error) {
    console.error('Error generating worksheet:', error);
    return [];
  }
};