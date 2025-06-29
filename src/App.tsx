import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { NotesList } from './components/Notes/NotesList';
import { NoteEditor } from './components/Editor/NoteEditor';
import { QuranSearch } from './components/Search/QuranSearch';
import { HadithSearch } from './components/Search/HadithSearch';
import { useNotes } from './hooks/useNotes';
import { useTheme } from './hooks/useTheme';
import { Note } from './types';
import { Menu, X } from 'lucide-react';

function App() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showQuranSearch, setShowQuranSearch] = useState(false);
  const [showHadithSearch, setShowHadithSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notesListOpen, setNotesListOpen] = useState(false);
  const [insertText, setInsertText] = useState<string>('');

  const {
    notes,
    loading,
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    allTags,
    saveNote,
    deleteNote,
    toggleFavorite
  } = useNotes();

  const { settings } = useTheme();

  // Close mobile menus when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
        setNotesListOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewNote = () => {
    setSelectedNote(null);
    setNotesListOpen(false);
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setNotesListOpen(false);
  };

  const handleNoteSave = async (note: Note) => {
    await saveNote(note);
    setSelectedNote(note);
  };

  const handleNoteDelete = async (id: string) => {
    await deleteNote(id);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSearchQuery('');
  };

  const handleInsertText = (text: string) => {
    setInsertText(text);
    setTimeout(() => setInsertText(''), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSettingsClick={() => setShowSettings(true)}
        onMenuClick={() => setSidebarOpen(true)}
        onNotesClick={() => setNotesListOpen(true)}
        notesCount={notes.length}
      />
      
      <div className="flex h-[calc(100vh-4rem)] relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${window.innerWidth >= 1024 ? 'block' : ''}
        `}>
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <Sidebar
            selectedTags={selectedTags}
            allTags={allTags}
            onTagToggle={handleTagToggle}
            onNewNote={handleNewNote}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Mobile Notes List Overlay */}
        {notesListOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setNotesListOpen(false)}
          />
        )}

        {/* Notes List */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-full sm:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${notesListOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:block overflow-y-auto
        `}>
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notes ({notes.length})
            </h2>
            <button
              onClick={() => setNotesListOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            <div className="hidden lg:flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notes ({notes.length})
              </h2>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-600"></div>
              </div>
            ) : (
              <NotesList
                notes={notes}
                selectedNote={selectedNote}
                onNoteSelect={handleNoteSelect}
                onToggleFavorite={toggleFavorite}
                onDeleteNote={handleNoteDelete}
              />
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          {selectedNote || notes.length === 0 ? (
            <NoteEditor
              note={selectedNote}
              onSave={handleNoteSave}
              onQuranSearch={() => setShowQuranSearch(true)}
              onHadithSearch={() => setShowHadithSearch(true)}
              insertText={insertText}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 p-4">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-islamic-100 dark:bg-islamic-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a note to start editing
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  Choose a note from the list to view and edit its content, or create a new note to get started.
                </p>
                <button
                  onClick={() => setNotesListOpen(true)}
                  className="mt-4 lg:hidden px-4 py-2 bg-islamic-600 text-white rounded-lg hover:bg-islamic-700 transition-colors"
                >
                  View Notes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <QuranSearch
        isOpen={showQuranSearch}
        onClose={() => setShowQuranSearch(false)}
        onInsert={handleInsertText}
      />
      
      <HadithSearch
        isOpen={showHadithSearch}
        onClose={() => setShowHadithSearch(false)}
        onInsert={handleInsertText}
      />
    </div>
  );
}

export default App;