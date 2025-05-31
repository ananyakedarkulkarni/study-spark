import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Resource } from '../types';
import { Upload, BookOpen, Trash2, FileText, Download, Plus, X } from 'lucide-react';
import { uploadPDF, fetchSubjectResources } from '../lib/supabase';

interface SubjectCardProps {
  id: string;
  name: string;
  resources: Resource[];
  onUpload: (files: FileList) => void;
  onDeleteResource: (resourceId: string) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  id, 
  name, 
  resources, 
  onUpload, 
  onDeleteResource 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      await handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileUpload(e.target.files);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (file.type === 'application/pdf') {
          await uploadPDF(file, id);
        }
      }
      // Refresh resources after upload
      const updatedResources = await fetchSubjectResources(id);
      onUpload(files);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center">
          <BookOpen size={24} className="mr-3" />
          <h3 className="text-xl font-semibold">{name}</h3>
        </div>
      </div>
      
      <div 
        className={`p-6 border-2 border-dashed border-gray-300 rounded-lg m-4 transition-colors ${
          isDragging ? 'bg-blue-50 border-blue-400' : 'bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 mb-2">
                Drag & drop PDF files here or <button onClick={triggerFileInput} className="text-blue-600 font-medium hover:text-blue-800">browse</button>
              </p>
              <p className="text-xs text-gray-500">
                Upload NCERT materials for Class 9 {name}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                accept=".pdf"
                multiple
              />
            </>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
          <FileText size={16} className="mr-2" />
          Uploaded Resources ({resources.length})
        </h4>
        
        {resources.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {resources.map((resource) => (
              <li key={resource.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-md mr-3">
                    <FileText size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{resource.name}</p>
                    <p className="text-xs text-gray-500">Uploaded on {formatDate(resource.uploadDate)}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Download"
                  >
                    <Download size={16} />
                  </a>
                  <button
                    onClick={() => onDeleteResource(resource.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No resources uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubject: (name: string) => void;
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ isOpen, onClose, onAddSubject }) => {
  const [subjectName, setSubjectName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjectName.trim()) {
      onAddSubject(subjectName);
      setSubjectName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Subject</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">
              Subject Name
            </label>
            <input
              type="text"
              id="subjectName"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter subject name"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Resources: React.FC = () => {
  const { subjects, addSubject, addResource, deleteResource } = useAppContext();
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  // Load resources for each subject on component mount
  useEffect(() => {
    const loadResources = async () => {
      for (const subject of subjects) {
        try {
          const resources = await fetchSubjectResources(subject.id);
          resources.forEach(resource => {
            addResource(subject.id, {
              name: resource.name,
              file: null,
              url: resource.url
            });
          });
        } catch (error) {
          console.error(`Error loading resources for ${subject.name}:`, error);
        }
      }
    };

    loadResources();
  }, []);

  const handleFileUpload = async (subjectId: string, files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf') {
        addResource(subjectId, {
          name: file.name,
          file: file,
          url: URL.createObjectURL(file)
        });
      }
    });
  };

  const handleAddSubject = (name: string) => {
    addSubject(name);
  };

  const handleDeleteResource = async (subjectId: string, resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        // Delete from Supabase storage and database
        // This would be implemented in your supabase.ts file
        deleteResource(subjectId, resourceId);
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Class 9 Resources</h1>
          <p className="text-gray-600">
            Upload and manage your NCERT study materials by subject
          </p>
        </div>
        <button
          onClick={() => setIsAddSubjectModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={18} className="mr-1" /> Add Subject
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            id={subject.id}
            name={subject.name}
            resources={subject.resources}
            onUpload={(files) => handleFileUpload(subject.id, files)}
            onDeleteResource={(resourceId) => handleDeleteResource(subject.id, resourceId)}
          />
        ))}
      </div>
      
      <AddSubjectModal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        onAddSubject={handleAddSubject}
      />
    </div>
  );
};

export default Resources;