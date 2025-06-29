import React from 'react';
import { Plus, Tag, User, Calendar, Heart, Filter } from 'lucide-react';

interface SidebarProps {
  selectedTags: string[];
  allTags: string[];
  onTagToggle: (tag: string) => void;
  onNewNote: () => void;
  onClearFilters: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedTags,
  allTags,
  onTagToggle,
  onNewNote,
  onClearFilters
}) => {
  const commonTags = [
    { name: 'aqidah', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { name: 'fiqh', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { name: 'akhlaq', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    { name: 'sirah', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    { name: 'tafsir', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    { name: 'hadith', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  ];

  const getTagColor = (tagName: string) => {
    const commonTag = commonTags.find(tag => tag.name === tagName);
    return commonTag ? commonTag.color : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        {/* New Note Button */}
        <button
          onClick={onNewNote}
          className="w-full bg-islamic-600 hover:bg-islamic-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>New Note</span>
        </button>

        {/* Quick Filters */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Quick Filters
          </h3>
          <div className="space-y-1 sm:space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center transition-colors">
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center transition-colors">
              <Calendar className="w-4 h-4 mr-2" />
              Recent
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center transition-colors">
              <User className="w-4 h-4 mr-2" />
              By Ustadz
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Topics
            </h3>
            {selectedTags.length > 0 && (
              <button
                onClick={onClearFilters}
                className="text-xs text-islamic-600 hover:text-islamic-700 dark:text-islamic-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            {commonTags.map(tag => (
              <button
                key={tag.name}
                onClick={() => onTagToggle(tag.name)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedTags.includes(tag.name)
                    ? 'bg-islamic-100 text-islamic-800 dark:bg-islamic-900 dark:text-islamic-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${tag.color.split(' ')[0]}`}></span>
                {tag.name}
              </button>
            ))}
            
            {allTags.filter(tag => !commonTags.some(ct => ct.name === tag)).map(tag => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-islamic-100 text-islamic-800 dark:bg-islamic-900 dark:text-islamic-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs mr-2 ${getTagColor(tag)}`}>
                  {tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};