import React from 'react';
import { Search, Filter, Users, Clock, CheckCircle, SlidersHorizontal, MapPin } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterClick: () => void;
  activeFiltersCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onFilterClick,
  activeFiltersCount 
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Search Input */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, skill, location, project, or client..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 shadow-lg text-gray-100 placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              ×
            </button>
          )}
        </div>
        <button
          onClick={onFilterClick}
          className="relative bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg"
        >
          <SlidersHorizontal size={18} />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Enhanced Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button className="bg-green-900/50 hover:bg-green-800/60 text-green-300 border border-green-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors duration-200 font-medium backdrop-blur-sm">
          <CheckCircle size={14} />
          Available Now
          <span className="bg-green-800/60 text-green-200 px-2 py-0.5 rounded-full text-xs">12</span>
        </button>
        <button className="bg-blue-900/50 hover:bg-blue-800/60 text-blue-300 border border-blue-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors duration-200 font-medium backdrop-blur-sm">
          <Users size={14} />
          Expert Level (4.8+)
          <span className="bg-blue-800/60 text-blue-200 px-2 py-0.5 rounded-full text-xs">8</span>
        </button>
        <button className="bg-purple-900/50 hover:bg-purple-800/60 text-purple-300 border border-purple-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors duration-200 font-medium backdrop-blur-sm">
          <Clock size={14} />
          This Week
          <span className="bg-purple-800/60 text-purple-200 px-2 py-0.5 rounded-full text-xs">5</span>
        </button>
        <button className="bg-orange-900/50 hover:bg-orange-800/60 text-orange-300 border border-orange-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors duration-200 font-medium backdrop-blur-sm">
          <MapPin size={14} />
          Near Me
          <span className="bg-orange-800/60 text-orange-200 px-2 py-0.5 rounded-full text-xs">15</span>
        </button>
        <button className="bg-yellow-900/50 hover:bg-yellow-800/60 text-yellow-300 border border-yellow-700 px-4 py-2 rounded-full text-sm transition-colors duration-200 font-medium backdrop-blur-sm">
          Top Rated (5.0)
          <span className="bg-yellow-800/60 text-yellow-200 px-2 py-0.5 rounded-full text-xs ml-2">3</span>
        </button>
        <button className="bg-gray-700/50 hover:bg-gray-600/60 text-gray-300 border border-gray-600 px-4 py-2 rounded-full text-sm transition-colors duration-200 font-medium backdrop-blur-sm">
          Budget Friendly
          <span className="bg-gray-600/60 text-gray-200 px-2 py-0.5 rounded-full text-xs ml-2">9</span>
        </button>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-300 font-medium">
              {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
            </span>
            <button
              onClick={onFilterClick}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View/Edit Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;