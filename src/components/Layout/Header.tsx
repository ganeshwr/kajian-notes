import React from 'react';
import { Moon, Sun, Search, Settings, BookOpen, Menu, FileText } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onSettingsClick: () => void;
  onMenuClick: () => void;
  onNotesClick: () => void;
  notesCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearchChange, 
  searchQuery, 
  onSettingsClick,
  onMenuClick,
  onNotesClick,
  notesCount
}) => {
  const { settings, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-islamic-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Kajian Notes
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Islamic Lecture Notes
              </p>
            </div>
          </div>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes, ustadz, or topics..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-islamic-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="flex md:hidden flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-islamic-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Notes Button */}
            <button
              onClick={onNotesClick}
              className="lg:hidden relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              {notesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-islamic-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notesCount > 99 ? '99+' : notesCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {settings.theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button
              onClick={onSettingsClick}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};