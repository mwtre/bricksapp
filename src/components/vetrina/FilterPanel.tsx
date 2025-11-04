import React from 'react';
import { X, MapPin, Star, Calendar, DollarSign, Award } from 'lucide-react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    location: string;
    minRating: number;
    availability: string;
    skills: string[];
    experience: string;
    priceRange: string;
  };
  onFiltersChange: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, filters, onFiltersChange }) => {
  if (!isOpen) return null;

  const skillOptions = ['Bricklaying', 'Tiling', 'Concrete', 'Woodwork', 'Roofing', 'Painting'];
  const locations = ['New York, NY', 'Boston, MA', 'Miami, FL', 'Chicago, IL', 'Phoenix, AZ', 'San Francisco, CA'];

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleSkill = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    updateFilter('skills', newSkills);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end backdrop-blur-sm">
      <div className="bg-gray-800 w-full max-w-md h-full overflow-y-auto border-l border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Advanced Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-gray-100"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Star size={16} className="inline mr-2" />
                Minimum Rating
              </label>
              <div className="flex gap-2">
                {[3, 4, 4.5, 4.8].map(rating => (
                  <button
                    key={rating}
                    onClick={() => updateFilter('minRating', rating)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.minRating === rating
                        ? 'bg-yellow-900/50 text-yellow-300 border-2 border-yellow-600'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                    }`}
                  >
                    {rating}+ ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Availability
              </label>
              <div className="space-y-2">
                {[
                  { value: '', label: 'All Workers' },
                  { value: 'available', label: 'Available Now' },
                  { value: 'this-week', label: 'Available This Week' },
                  { value: 'this-month', label: 'Available This Month' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value={option.value}
                      checked={filters.availability === option.value}
                      onChange={(e) => updateFilter('availability', e.target.value)}
                      className="mr-3 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Award size={16} className="inline mr-2" />
                Required Skills
              </label>
              <div className="grid grid-cols-2 gap-2">
                {skillOptions.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.skills.includes(skill)
                        ? 'bg-blue-900/50 text-blue-300 border-2 border-blue-600'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Years of Experience
              </label>
              <select
                value={filters.experience}
                onChange={(e) => updateFilter('experience', e.target.value)}
                className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-gray-100"
              >
                <option value="">Any Experience</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="11-15">11-15 years</option>
                <option value="15+">15+ years</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <DollarSign size={16} className="inline mr-2" />
                Hourly Rate Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => updateFilter('priceRange', e.target.value)}
                className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-gray-100"
              >
                <option value="">Any Rate</option>
                <option value="25-35">$25-35/hour</option>
                <option value="35-50">$35-50/hour</option>
                <option value="50-75">$50-75/hour</option>
                <option value="75+">$75+/hour</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => onFiltersChange({
                location: '',
                minRating: 0,
                availability: '',
                skills: [],
                experience: '',
                priceRange: ''
              })}
              className="flex-1 bg-gray-700 text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium border border-gray-600"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;