import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { WorksheetQuestion } from '../types';
import { FileText, PlusCircle, Save, Trash, Edit, Check, X, Download, Eye } from 'lucide-react';

interface WorksheetFormProps {
  onSave: (worksheet: { title: string; subject: string; description: string; questions: WorksheetQuestion[] }) => void;
  onCancel: () => void;
  initialValues?: { title: string; subject: string; description: string; questions: WorksheetQuestion[] };
}

const WorksheetForm: React.FC<WorksheetFormProps> = ({ onSave, onCancel, initialValues }) => {
  const { subjects } = useAppContext();
  const [title, setTitle] = useState(initialValues?.title || '');
  const [subject, setSubject] = useState(initialValues?.subject || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [questions, setQuestions] = useState<WorksheetQuestion[]>(initialValues?.questions || []);

  const addQuestion = () => {
    const newQuestion: WorksheetQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'short-answer'
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, data: Partial<WorksheetQuestion>) => {
    setQuestions(
      questions.map(q => (q.id === id ? { ...q, ...data } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && subject && questions.length > 0) {
      onSave({
        title,
        subject,
        description,
        questions
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Worksheet Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter worksheet title"
              required
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.name}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter worksheet description"
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Questions</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <PlusCircle size={16} className="mr-1" /> Add Question
            </button>
          </div>
          
          {questions.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">No questions added yet. Click "Add Question" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter question"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Type
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(
                        question.id, 
                        { 
                          type: e.target.value as 'multiple-choice' | 'short-answer' | 'long-answer',
                          options: e.target.value === 'multiple-choice' ? ['', '', '', ''] : undefined
                        }
                      )}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="short-answer">Short Answer</option>
                      <option value="long-answer">Long Answer</option>
                    </select>
                  </div>
                  
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Options
                      </label>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === option}
                            onChange={() => updateQuestion(question.id, { correctAnswer: option })}
                            className="mr-2"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options!];
                              newOptions[optIndex] = e.target.value;
                              updateQuestion(question.id, { options: newOptions });
                            }}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder={`Option ${optIndex + 1}`}
                          />
                        </div>
                      ))}
                      <p className="text-xs text-gray-500">Select the radio button next to the correct answer.</p>
                    </div>
                  )}
                  
                  {question.type === 'short-answer' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correct Answer (Optional)
                      </label>
                      <input
                        type="text"
                        value={question.correctAnswer || ''}
                        onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter correct answer"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
            disabled={!title || !subject || questions.length === 0}
          >
            <Save size={16} className="mr-1" /> Save Worksheet
          </button>
        </div>
      </form>
    </div>
  );
};

interface WorksheetCardProps {
  id: string;
  title: string;
  subject: string;
  description: string;
  questionsCount: number;
  createdAt: Date;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

const WorksheetCard: React.FC<WorksheetCardProps> = ({
  id,
  title,
  subject,
  description,
  questionsCount,
  createdAt,
  onEdit,
  onDelete,
  onView
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 text-blue-600 p-1.5 rounded mr-2">
                <FileText size={16} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <p className="text-sm text-gray-500">
              {subject} • {questionsCount} questions • Created on {formatDate(createdAt)}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onView}
              className="text-blue-600 hover:text-blue-800 transition-colors p-1"
              title="View Worksheet"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={onEdit}
              className="text-gray-600 hover:text-gray-800 transition-colors p-1"
              title="Edit Worksheet"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800 transition-colors p-1"
              title="Delete Worksheet"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
        
        {description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
};

interface WorksheetViewProps {
  worksheet: {
    id: string;
    title: string;
    subject: string;
    description: string;
    questions: WorksheetQuestion[];
    createdAt: Date;
  };
  onClose: () => void;
}

const WorksheetView: React.FC<WorksheetViewProps> = ({ worksheet, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{worksheet.title}</h2>
              <p className="text-gray-600">{worksheet.subject}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          
          {worksheet.description && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600">{worksheet.description}</p>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Questions</h3>
            <ol className="space-y-6">
              {worksheet.questions.map((question, index) => (
                <li key={question.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-3">
                    <span className="font-medium text-gray-800">{index + 1}. </span>
                    <span className="text-gray-800">{question.question}</span>
                  </div>
                  
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="ml-6 space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                            question.correctAnswer === option 
                              ? 'border-green-500 text-green-500' 
                              : 'border-gray-300'
                          }`}>
                            {question.correctAnswer === option && <Check size={12} />}
                          </div>
                          <span className="text-gray-700">{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'short-answer' && question.correctAnswer && (
                    <div className="ml-6 mt-2">
                      <p className="text-sm text-gray-500">Answer: <span className="text-gray-800">{question.correctAnswer}</span></p>
                    </div>
                  )}
                  
                  {question.type === 'long-answer' && (
                    <div className="ml-6 mt-2 border-t border-gray-200 pt-2">
                      <p className="text-sm text-gray-500 italic">Essay/long-form response required</p>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                // In a real app, we would generate a PDF here
                alert('PDF download functionality would be implemented here');
              }}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
            >
              <Download size={16} className="mr-1" /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Worksheets: React.FC = () => {
  const { subjects, worksheets, addWorksheet, updateWorksheet, deleteWorksheet } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [editingWorksheetId, setEditingWorksheetId] = useState<string | null>(null);
  const [viewingWorksheet, setViewingWorksheet] = useState<string | null>(null);
  
  const handleSaveWorksheet = (worksheetData: { title: string; subject: string; description: string; questions: WorksheetQuestion[] }) => {
    if (editingWorksheetId) {
      updateWorksheet(editingWorksheetId, worksheetData);
      setEditingWorksheetId(null);
    } else {
      addWorksheet(worksheetData);
      setIsCreating(false);
    }
  };
  
  const handleEditWorksheet = (id: string) => {
    setEditingWorksheetId(id);
    setIsCreating(false);
  };
  
  const handleDeleteWorksheet = (id: string) => {
    if (window.confirm('Are you sure you want to delete this worksheet?')) {
      deleteWorksheet(id);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingWorksheetId(null);
    setIsCreating(false);
  };
  
  const editingWorksheet = editingWorksheetId 
    ? worksheets.find(w => w.id === editingWorksheetId) 
    : undefined;
    
  const viewingWorksheetData = viewingWorksheet 
    ? worksheets.find(w => w.id === viewingWorksheet) 
    : undefined;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Class 9 Worksheets</h1>
          <p className="text-gray-600">
            Create and manage practice worksheets based on your NCERT materials
          </p>
        </div>
        
        {!isCreating && !editingWorksheetId && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusCircle size={18} className="mr-1" /> Create Worksheet
          </button>
        )}
      </div>
      
      {(isCreating || editingWorksheetId) ? (
        <WorksheetForm
          onSave={handleSaveWorksheet}
          onCancel={handleCancelEdit}
          initialValues={editingWorksheet}
        />
      ) : (
        <>
          {worksheets.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {worksheets.map((worksheet) => (
                <WorksheetCard
                  key={worksheet.id}
                  id={worksheet.id}
                  title={worksheet.title}
                  subject={worksheet.subject}
                  description={worksheet.description}
                  questionsCount={worksheet.questions.length}
                  createdAt={worksheet.createdAt}
                  onEdit={() => handleEditWorksheet(worksheet.id)}
                  onDelete={() => handleDeleteWorksheet(worksheet.id)}
                  onView={() => setViewingWorksheet(worksheet.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Worksheets Yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first worksheet to help reinforce learning for Class 9 NCERT subjects.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <PlusCircle size={18} className="mr-2" /> Create First Worksheet
              </button>
            </div>
          )}
        </>
      )}
      
      {viewingWorksheetData && (
        <WorksheetView
          worksheet={viewingWorksheetData}
          onClose={() => setViewingWorksheet(null)}
        />
      )}
    </div>
  );
};

export default Worksheets;