import { useState, useEffect } from 'react';
import { Note } from '../types';
import { StorageService } from '../services/storageService';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await StorageService.getAllNotes();
      setNotes(savedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (note: Note) => {
    try {
      await StorageService.saveNote(note);
      setNotes(prev => {
        const existing = prev.find(n => n.id === note.id);
        if (existing) {
          return prev.map(n => n.id === note.id ? note : n);
        }
        return [note, ...prev];
      });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await StorageService.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      const updatedNote = { ...note, isFavorite: !note.isFavorite };
      await saveNote(updatedNote);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.ustadz.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => note.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  return {
    notes: filteredNotes,
    allNotes: notes,
    loading,
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    allTags,
    saveNote,
    deleteNote,
    toggleFavorite,
    loadNotes
  };
};