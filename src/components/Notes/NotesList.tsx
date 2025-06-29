import React from 'react';
import { format } from 'date-fns';
import { Heart, Tag, User, Calendar, MoreVertical, Trash2 } from 'lucide-react';
import { Note } from '../../types';

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  selectedNote,
  onNoteSelect,
  onToggleFavorite,
  onDeleteNote
}) => {
  const getTagColor = (tagName: string) => {
    const colors = {
      'aqidah': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'fiqh': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'akhlaq': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'sirah': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'tafsir': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'hadith': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return colors[tagName as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const truncateContent = (content: string, maxLength: number = 80) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...' 
      : textContent;
  };

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Tag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
          No notes found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm sm:text-base">
          Start taking notes from your Islamic lectures and they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onNoteSelect(note)}
          className={`bg-white dark:bg-gray-800 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
            selectedNote?.id === note.id
              ? 'border-islamic-500 ring-2 ring-islamic-500 ring-opacity-20'
              : 'border-gray-200 dark:border-gray-700 hover:border-islamic-300 dark:hover:border-islamic-600'
          }`}
        >
          <div className="p-3 sm:p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {note.title || 'Untitled Note'}
                </h3>
                <div className="flex items-center space-x-2 sm:space-x-4 mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    <span className="truncate max-w-20 sm:max-w-none">{note.ustadz || 'Unknown'}</span>
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(note.date), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(note.id);
                  }}
                  className={`p-1 rounded-full transition-colors ${
                    note.isFavorite
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this note?')) {
                      onDeleteNote(note.id);
                    }
                  }}
                  className="p-1 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Content Preview */}
            <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">
              {truncateContent(note.content)}
            </p>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {note.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
                {note.tags.length > 2 && (
                  <span className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    +{note.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};