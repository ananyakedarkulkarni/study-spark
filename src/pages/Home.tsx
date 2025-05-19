import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, MessageSquare, Clock, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white rounded-xl shadow-lg overflow-hidden">
        <div className="container mx-auto py-12 px-6 md:py-16 md:px-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Elevate Your Learning Journey
              </h1>
              <p className="text-lg md:text-xl mb-6 text-blue-100">
                StudySpark helps Class 9 students organize resources, create worksheets, 
                and get AI-powered assistance while maintaining focus with study timers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/resources" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors shadow-md flex items-center"
                >
                  <BookOpen className="mr-2" size={20} />
                  Browse Resources
                </Link>
                <Link 
                  to="/ai-assistant" 
                  className="bg-blue-500 text-white hover:bg-blue-400 px-6 py-3 rounded-lg font-medium transition-colors shadow-md border border-blue-400 flex items-center"
                >
                  <MessageSquare className="mr-2" size={20} />
                  Ask AI Assistant
                </Link>
              </div>
            </div>
            <div className="md:w-2/5">
              <img 
                src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Students studying" 
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How StudySpark Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform brings together everything you need to excel in your Class 9 studies
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Resource Management</h3>
            <p className="text-gray-600 mb-4">
              Upload and organize study materials for Math, Science, Social Science, 
              English, and Marathi subjects based on NCERT curriculum.
            </p>
            <Link to="/resources" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              Browse Resources <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full w-fit mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Worksheet Creation</h3>
            <p className="text-gray-600 mb-4">
              Generate personalized worksheets based on uploaded study materials 
              to reinforce learning and assess understanding.
            </p>
            <Link to="/worksheets" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              Create Worksheets <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
            <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mb-4">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Study Assistant</h3>
            <p className="text-gray-600 mb-4">
              Get instant help with homework, explanations, and study guidance 
              with our AI assistant that references your uploaded materials.
            </p>
            <Link to="/ai-assistant" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              Ask Assistant <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="bg-gray-100 rounded-xl p-8 md:p-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Use StudySpark</h2>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
              <CheckCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Step 1: Upload Your Resources</h3>
              <p className="text-gray-600">
                Navigate to the Resources page and upload your subject PDFs. You can organize them by subject
                for easy access later. These resources will power your worksheets and AI assistance.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
              <CheckCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Step 2: Create Custom Worksheets</h3>
              <p className="text-gray-600">
                Visit the Worksheets page to generate practice problems and questions based on
                your uploaded materials. These worksheets help reinforce what you've learned.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
              <CheckCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Step 3: Get Help from AI Assistant</h3>
              <p className="text-gray-600">
                When you have questions or need help, use the AI Assistant page. It will reference
                your uploaded materials to provide accurate, personalized answers.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
              <CheckCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Step 4: Stay Focused with the Study Timer</h3>
              <p className="text-gray-600">
                Use the floating Study Timer for focused study sessions and breaks. You can customize
                focus time, short breaks, and long breaks to match your study style.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
              <CheckCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Step 5: Take Notes Along the Way</h3>
              <p className="text-gray-600">
                Use the Notes sidebar to quickly jot down important information while studying.
                Notes are accessible from any page except the home page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Study Timer Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-8 md:p-12">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Focused with the Pomodoro Timer
            </h2>
            <p className="text-lg mb-6 text-indigo-100">
              Our built-in study timer helps you maintain focus during study sessions. 
              Use the Pomodoro technique with customizable focus periods and breaks.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <CheckCircle size={20} className="mr-2" />
                <span>Customizable focus and break durations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle size={20} className="mr-2" />
                <span>Timer available on every page</span>
              </li>
              <li className="flex items-center">
                <CheckCircle size={20} className="mr-2" />
                <span>Audio notifications when time is up</span>
              </li>
              <li className="flex items-center">
                <CheckCircle size={20} className="mr-2" />
                <span>Track study session rounds</span>
              </li>
            </ul>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-white rounded-full w-40 h-40 flex items-center justify-center shadow-xl">
              <Clock size={80} className="text-indigo-600" />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="text-center py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Ready to Boost Your Learning?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Start exploring StudySpark's features today and take your Class 9 studies to the next level.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/resources" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;