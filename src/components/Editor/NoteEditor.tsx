import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2,
  BookOpen,
  Book,
  Save,
  Tag,
  User,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Note } from '../../types';
import { format } from 'date-fns';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Note) => void;
  onQuranSearch: () => void;
  onHadithSearch: () => void;
  insertText?: string;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onQuranSearch,
  onHadithSearch,
  insertText
}) => {
  const [title, setTitle] = useState('');
  const [ustadz, setUstadz] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] sm:min-h-[400px] p-4 dark:prose-invert max-w-none',
      },
    },
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setUstadz(note.ustadz);
      setDate(note.date);
      setTags(note.tags);
      editor?.commands.setContent(note.content);
    } else {
      const today = format(new Date(), 'yyyy-MM-dd');
      setTitle('');
      setUstadz('');
      setDate(today);
      setTags([]);
      editor?.commands.setContent('');
    }
  }, [note, editor]);

  useEffect(() => {
    if (insertText && editor) {
      editor.commands.focus();
      editor.commands.insertContent(insertText);
    }
  }, [insertText, editor]);

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);
    const content = editor.getHTML();
    
    const noteData: Note = {
      id: note?.id || `note-${Date.now()}`,
      title: title.trim() || 'Untitled Note',
      content,
      tags,
      ustadz: ustadz.trim(),
      date,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: note?.isFavorite || false
    };

    await onSave(noteData);
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 space-y-4">
        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl sm:text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Metadata Toggle Button - Mobile */}
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className="sm:hidden flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <span className="text-sm">Details</span>
          {showMetadata ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Metadata */}
        <div className={`space-y-4 ${showMetadata ? 'block' : 'hidden sm:block'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Ustadz name..."
                value={ustadz}
                onChange={(e) => setUstadz(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-islamic-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-islamic-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Add tags (press Enter)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-islamic-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-islamic-100 text-islamic-800 dark:bg-islamic-900 dark:text-islamic-200"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-islamic-200 dark:bg-islamic-800 flex items-center justify-center hover:bg-islamic-300 dark:hover:bg-islamic-700 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar Toggle Button - Mobile */}
      <button
        onClick={() => setShowToolbar(!showToolbar)}
        className="sm:hidden border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      >
        <span className="text-sm">Formatting</span>
        {showToolbar ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Toolbar */}
      <div className={`border-b border-gray-200 dark:border-gray-700 p-4 ${showToolbar ? 'block' : 'hidden sm:block'}`}>
        <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap gap-2">
          <div className="flex items-center space-x-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                editor.isActive('bold')
                  ? 'bg-islamic-100 text-islamic-700 dark:bg-islamic-900 dark:text-islamic-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Bold className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                editor.isActive('italic')
                  ? 'bg-islamic-100 text-islamic-700 dark:bg-islamic-900 dark:text-islamic-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Italic className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                editor.isActive('heading', { level: 1 })
                  ? 'bg-islamic-100 text-islamic-700 dark:bg-islamic-900 dark:text-islamic-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Heading1 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                editor.isActive('heading', { level: 2 })
                  ? 'bg-islamic-100 text-islamic-700 dark:bg-islamic-900 dark:text-islamic-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Heading2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                editor.isActive('bulletList')
                  ? 'bg-islamic-100 text-islamic-700 dark:bg-islamic-900 dark:text-islamic-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <List className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                editor.isActive('orderedList')
                  ? 'bg-islamic-100 text-islamic-700 dark:bg-islamic-900 dark:text-islamic-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <ListOrdered className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                editor.isActive('blockquote')
                  ? 'bg-islamic-100 text-islamic-700 dark:bg-islamic-900 dark:text-islamic-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Quote className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={onQuranSearch}
              className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-islamic-100 dark:hover:bg-islamic-900 hover:text-islamic-700 dark:hover:text-islamic-300 transition-colors"
              title="Insert Quran Verse"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={onHadithSearch}
              className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-islamic-100 dark:hover:bg-islamic-900 hover:text-islamic-700 dark:hover:text-islamic-300 transition-colors"
              title="Insert Hadith"
            >
              <Book className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="ml-auto">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-islamic-600 hover:bg-islamic-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
              <span className="sm:hidden">{isSaving ? '...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto bg-geometric-pattern">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};