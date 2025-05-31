import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY',
  dangerouslyAllowBrowser: true
});

export const generateAIResponse = async (prompt: string, context: string) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are an educational AI assistant helping Class 9 students with NCERT and Maharashtra State Board subjects. ${context}`
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

export const generateWorksheet = async (subject: string, chapter: string, difficulty: string) => {
  try {
    const prompt = `Create a worksheet for Class 9 ${subject}, chapter: ${chapter}, difficulty: ${difficulty}. Include a mix of multiple choice, short answer, and long answer questions.`;
    
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are an educational worksheet generator for Class 9 students. Generate questions based on NCERT and Maharashtra State Board curriculum."
        },
        { role: "user", content: prompt }
      ],
      model: "gpt-3.5-turbo",
    });

    // Parse the response and structure it into worksheet format
    const questions = parseAIResponseToQuestions(completion.choices[0].message.content);
    return questions;
  } catch (error) {
    console.error('Error generating worksheet:', error);
    return [];
  }
};

const parseAIResponseToQuestions = (response: string) => {
  // Implementation to parse AI response into structured questions
  // This would need to be implemented based on the AI's response format
  return [];
};