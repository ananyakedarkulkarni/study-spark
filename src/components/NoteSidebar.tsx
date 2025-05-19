import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { X, PlusCircle, Edit, Trash, Save, FileText } from 'lucide-react';

interface NoteItemProps {
  id: string;
  title: string;
  content: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ id, title, content, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-3 mb-3">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(id)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Edit note"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            aria-label="Delete note"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1 line-clamp-3">{content}</p>
    </div>
  );
};

interface NoteFormProps {
  onSave: (note: { title: string; content: string }) => void;
  onCancel: () => void;
  initialValues?: { title: string; content: string };
}

const NoteForm: React.FC<NoteFormProps> = ({ onSave, onCancel, initialValues }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSave({ title, content });
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-3 mb-3">
      <div className="mb-3">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Note title"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Note content"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-xs border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 text-xs border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
        >
          <Save size={14} className="mr-1" /> Save
        </button>
      </div>
    </form>
  );
};

const NoteSidebar: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, isSidebarOpen, toggleSidebar } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const handleAddNote = (note: { title: string; content: string }) => {
    addNote(note);
    setIsCreating(false);
  };

  const handleUpdateNote = (note: { title: string; content: string }) => {
    if (editingNoteId) {
      updateNote(editingNoteId, note);
      setEditingNoteId(null);
    }
  };

  const handleEditNote = (id: string) => {
    setEditingNoteId(id);
    setIsCreating(false);
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      if (editingNoteId === id) {
        setEditingNoteId(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setIsCreating(false);
  };

  if (!isSidebarOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-gray-50 shadow-lg z-40 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FileText size={20} className="mr-2" /> Notes
        </h2>
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {!isCreating && !editingNoteId && (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 mb-4"
        >
          <PlusCircle size={16} className="mr-2" /> Add New Note
        </button>
      )}

      {isCreating && (
        <NoteForm
          onSave={handleAddNote}
          onCancel={handleCancelEdit}
        />
      )}

      <div className="space-y-3">
        {notes.map((note) => (
          editingNoteId === note.id ? (
            <NoteForm
              key={note.id}
              initialValues={{ title: note.title, content: note.content }}
              onSave={handleUpdateNote}
              onCancel={handleCancelEdit}
            />
          ) : (
            <NoteItem
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          )
        ))}

        {notes.length === 0 && !isCreating && (
          <p className="text-center text-gray-500 italic mt-4">
            No notes yet. Create one to get started!
          </p>
        )}
      </div>
    </div>
  );
};

export default NoteSidebar;