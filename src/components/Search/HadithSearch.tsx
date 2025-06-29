import React, { useState, useEffect } from 'react';
import { Search, Book, X, Copy, Plus, Loader } from 'lucide-react';
import { HadithService } from '../../services/hadithService';
import { Hadith } from '../../types';

interface HadithSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
}

export const HadithSearch: React.FC<HadithSearchProps> = ({
  isOpen,
  onClose,
  onInsert
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
      setError('');
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const results = await HadithService.searchHadith(searchQuery);
      setSearchResults(results);
      if (results.length === 0 && searchQuery.trim()) {
        setError('No Hadith found. Try searching for topics like "intention", "prayer", "faith", "manners"');
      }
    } catch (error) {
      console.error('Error searching Hadith:', error);
      setError('Error searching Hadith. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInsertHadith = (hadith: Hadith) => {
    const formattedHadith = HadithService.formatHadithForInsertion(hadith);
    onInsert(formattedHadith);
    onClose();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const popularSearches = [
    { label: 'Intention', query: 'intention' },
    { label: 'Prayer', query: 'prayer' },
    { label: 'Faith', query: 'faith' },
    { label: 'Manners', query: 'manners' },
    { label: 'Mercy', query: 'mercy' },
    { label: 'Brotherhood', query: 'brother' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Book className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-islamic-600" />
              <span className="hidden sm:inline">Search Hadith</span>
              <span className="sm:hidden">Hadith Search</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by keywords, topics, or narrator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-islamic-500 focus:border-transparent text-sm sm:text-base"
              autoFocus
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-islamic-600" />
              </div>
            )}
          </div>
          
          {/* Popular Searches */}
          <div className="mt-4">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Popular topics:</p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {popularSearches.map((search) => (
                <button
                  key={search.query}
                  onClick={() => setSearchQuery(search.query)}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-islamic-100 dark:bg-islamic-900 text-islamic-700 dark:text-islamic-300 rounded-full hover:bg-islamic-200 dark:hover:bg-islamic-800 transition-colors"
                >
                  {search.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base px-4">{error}</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((hadith) => (
                <div
                  key={hadith.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:border-islamic-300 dark:hover:border-islamic-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-islamic-700 dark:text-islamic-300 text-sm sm:text-base">
                        {hadith.book} - {hadith.chapter}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Narrator: {hadith.narrator} | Grade: {hadith.grade}
                      </p>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2 ml-2">
                      <button
                        onClick={() => copyToClipboard(`${hadith.book} - ${hadith.chapter}\n\n${hadith.text}\n\n"${hadith.translation}"\n\nNarrator: ${hadith.narrator} | Grade: ${hadith.grade}`)}
                        className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleInsertHadith(hadith)}
                        className="p-1.5 sm:p-2 text-islamic-600 hover:text-islamic-700 dark:text-islamic-400 hover:bg-islamic-100 dark:hover:bg-islamic-900 rounded-lg transition-colors"
                        title="Insert into note"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-right text-base sm:text-lg font-arabic leading-relaxed text-gray-900 dark:text-white">
                      {hadith.text}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 italic text-sm sm:text-base">
                      "{hadith.translation}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8">
              <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                No Hadith found for "{searchQuery}"
              </p>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2">
                Try searching with different keywords or topics
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                Enter a search query to find Hadith
              </p>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2">
                Search by topics, keywords, or try popular topics above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};