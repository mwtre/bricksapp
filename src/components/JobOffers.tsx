import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Briefcase, MapPin, Clock, CheckCircle } from 'lucide-react';

interface JobPosition {
  id: string;
  title: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  postedDate: string;
  company: string;
}

interface JobCategory {
  id: string;
  name: string;
  positions: JobPosition[];
}

// Job categories matching landing page
const jobCategories: JobCategory[] = [
  {
    id: 'bricklayer',
    name: 'Bricklayer',
    positions: [
      {
        id: 'brick-1',
        title: 'Bricklayer - Amsterdam',
        location: 'Amsterdam, Netherlands',
        type: 'Full-time',
        postedDate: '2024-11-01',
        company: 'Haldu Groep'
      },
      {
        id: 'brick-2',
        title: 'Bricklayer - Rotterdam',
        location: 'Rotterdam, Netherlands',
        type: 'Full-time',
        postedDate: '2024-11-02',
        company: 'Haldu Groep'
      }
    ]
  },
  {
    id: 'courier',
    name: 'Courier',
    positions: [
      {
        id: 'courier-1',
        title: 'Food Delivery Courier',
        location: 'Amsterdam, Netherlands',
        type: 'Part-time',
        postedDate: '2024-11-03',
        company: 'Delivery Services NL'
      }
    ]
  },
  {
    id: 'food-production',
    name: 'Food Production',
    positions: [
      {
        id: 'food-1',
        title: 'Food Production Worker',
        location: 'Heerenveen, Netherlands',
        type: 'Full-time',
        postedDate: '2024-11-01',
        company: 'Henri Willig'
      }
    ]
  },
  {
    id: 'forklift',
    name: 'Forklift',
    positions: [
      {
        id: 'forklift-1',
        title: 'Forklift Operator',
        location: 'Eindhoven, Netherlands',
        type: 'Full-time',
        postedDate: '2024-11-04',
        company: 'Distribution Center NL'
      }
    ]
  },
  {
    id: 'waitress',
    name: 'Waitress',
    positions: [
      {
        id: 'waitress-1',
        title: 'Restaurant Waitress',
        location: 'Amsterdam, Netherlands',
        type: 'Part-time',
        postedDate: '2024-11-02',
        company: 'Amsterdam Restaurants'
      }
    ]
  },
  {
    id: 'ce-driver',
    name: 'CE Driver',
    positions: [
      {
        id: 'ce-driver-1',
        title: 'CE Driver - Retail Distribution',
        location: 'Rotterdam, Netherlands',
        type: 'Full-time',
        postedDate: '2024-11-01',
        company: 'Retail Distribution NL'
      }
    ]
  },
  {
    id: 'bar-employee',
    name: 'Bar Employee',
    positions: [
      {
        id: 'bar-1',
        title: 'Bar Employee - Amsterdam',
        location: 'Amsterdam, Netherlands',
        type: 'Full-time',
        postedDate: '2024-11-03',
        company: 'Library Bar'
      }
    ]
  },
  {
    id: 'industrial-cleaner',
    name: 'Industrial Cleaner',
    positions: [
      {
        id: 'cleaner-1',
        title: 'Industrial Cleaner - Arkel',
        location: 'Arkel, Netherlands',
        type: 'Full-time',
        postedDate: '2024-11-01',
        company: 'Raaak Personeel'
      }
    ]
  },
  {
    id: 'supermarket',
    name: 'Supermarket Employee',
    positions: [
      {
        id: 'supermarket-1',
        title: 'Full-Time Supermarket Employee',
        location: 'Utrecht, Netherlands',
        type: 'Full-time',
        postedDate: '2024-11-02',
        company: 'Supermarket Chain NL'
      }
    ]
  },
  {
    id: 'line-operator',
    name: 'Line Operator',
    positions: [
      {
        id: 'line-1',
        title: 'Line Operator - Food Production (Urk)',
        location: 'Urk, Netherlands',
        type: 'Full-time',
        postedDate: '2024-11-01',
        company: 'Food Production NL'
      }
    ]
  },
  {
    id: 'electrician',
    name: 'Electrician',
    positions: [
      {
        id: 'electrician-1',
        title: 'Electrician - Haarlem',
        location: 'Haarlem, Netherlands',
        type: 'Full-time',
        postedDate: '2024-11-01',
        company: 'Haarlem Electric Co.'
      }
    ]
  }
];

interface JobOffersProps {
  onApply?: (positionId: string) => void;
}

export const JobOffers: React.FC<JobOffersProps> = ({ onApply }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleApply = (positionId: string) => {
    if (onApply) {
      onApply(positionId);
    } else {
      alert(`Application submitted for position: ${positionId}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
          <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Job Offers</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Browse available positions and apply directly
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {jobCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const hasPositions = category.positions.length > 0;

          return (
            <div
              key={category.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={!hasPositions}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                  {hasPositions && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({category.positions.length} {category.positions.length === 1 ? 'position' : 'positions'})
                    </span>
                  )}
                </div>
                {hasPositions ? (
                  isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )
                ) : (
                  <span className="text-sm text-gray-400 dark:text-gray-500">No positions available</span>
                )}
              </button>

              {/* Expanded Positions */}
              {isExpanded && hasPositions && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <div className="p-4 space-y-3">
                    {category.positions.map((position) => (
                      <div
                        key={position.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {position.title}
                            </h4>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="h-4 w-4 mr-1.5" />
                                {position.location}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Briefcase className="h-4 w-4 mr-1.5" />
                                {position.company}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1.5" />
                                  {position.type}
                                </span>
                                <span className="flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1.5" />
                                  Posted {formatDate(position.postedDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleApply(position.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Apply Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

