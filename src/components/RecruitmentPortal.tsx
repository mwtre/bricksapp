import React, { useState, useEffect } from 'react';
import { X, Users, Search, Filter, Star, MapPin, Calendar, DollarSign, Award, Hammer, Ruler, Shield, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { workerService } from '../services/database';

// Import vetrina components
import SearchBar from './vetrina/SearchBar';
import WorkerCard from './vetrina/WorkerCard';
import WorkerModal from './vetrina/WorkerModal';
import FilterPanel from './vetrina/FilterPanel';

// Define types to match vetrina components
interface Skill {
  name: string;
  level: number;
  icon: React.ComponentType<any>;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  completedDate: string;
  client: string;
  skills: string[];
}

interface Worker {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  skills: Skill[];
  yearsExperience: number;
  location: string;
  availability: {
    status: 'available' | 'busy' | 'partially-available';
    availableFrom?: string;
    notes?: string;
  };
  portfolio: PortfolioItem[];
  rating: number;
  completedProjects: number;
}

// Mock data for workers
const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'Marco Andersen',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+45 12 34 56 78',
      email: 'marco@expatheros.nl',
    skills: [
      { name: 'Bricklaying', level: 95, icon: Hammer },
      { name: 'Tiling', level: 88, icon: Award },
      { name: 'Concrete', level: 82, icon: Shield },
      { name: 'Woodwork', level: 75, icon: Ruler }
    ],
    yearsExperience: 8,
    location: 'København, Denmark',
    availability: {
      status: 'available',
      availableFrom: '2024-01-15',
      notes: 'Available for immediate start'
    },
    portfolio: [
      {
        id: '1',
        title: 'Modern Office Complex',
        description: 'Complete brickwork for 12-story office building in downtown Copenhagen',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop',
        completedDate: '2023-12-15',
        client: 'Nordic Construction',
        skills: ['Bricklaying', 'Tiling', 'Concrete']
      },
      {
        id: '2',
        title: 'Luxury Residential Villa',
        description: 'Custom brickwork and stone masonry for high-end residential project',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=200&fit=crop',
        completedDate: '2023-10-20',
        client: 'Elite Homes',
        skills: ['Bricklaying', 'Stone Masonry', 'Tiling']
      }
    ],
    rating: 4.9,
    completedProjects: 45
  },
  {
    id: '2',
    name: 'Erik Nielsen',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+45 23 45 67 89',
      email: 'erik@expatheros.nl',
    skills: [
      { name: 'Bricklaying', level: 92, icon: Hammer },
      { name: 'Roofing', level: 85, icon: Award },
      { name: 'Concrete', level: 78, icon: Shield },
      { name: 'Painting', level: 70, icon: Clock }
    ],
    yearsExperience: 12,
    location: 'Aarhus, Denmark',
    availability: {
      status: 'partially-available',
      availableFrom: '2024-02-01',
      notes: 'Available for part-time work'
    },
    portfolio: [
      {
        id: '3',
        title: 'Historic Building Restoration',
        description: 'Restoration of 19th-century brick facade and structural repairs',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop',
        completedDate: '2023-11-30',
        client: 'Heritage Foundation',
        skills: ['Restoration', 'Bricklaying', 'Structural Repair']
      }
    ],
    rating: 4.8,
    completedProjects: 67
  },
  {
    id: '3',
    name: 'Lars Pedersen',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    phone: '+45 34 56 78 90',
      email: 'lars@expatheros.nl',
    skills: [
      { name: 'Bricklaying', level: 88, icon: Hammer },
      { name: 'Tiling', level: 85, icon: Award },
      { name: 'Woodwork', level: 80, icon: Ruler },
      { name: 'Plumbing', level: 72, icon: Clock }
    ],
    yearsExperience: 6,
    location: 'Odense, Denmark',
    availability: {
      status: 'busy',
      availableFrom: '2024-03-01',
      notes: 'Currently on long-term project'
    },
    portfolio: [
      {
        id: '4',
        title: 'Commercial Shopping Center',
        description: 'Complete brickwork and tiling for new shopping center development',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
        completedDate: '2023-09-15',
        client: 'Retail Development Corp',
        skills: ['Bricklaying', 'Tiling', 'Commercial Construction']
      }
    ],
    rating: 4.7,
    completedProjects: 38
  }
];

interface RecruitmentPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RecruitmentPortal: React.FC<RecruitmentPortalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minRating: 0,
    availability: '',
    skills: [] as string[],
    experience: '',
    priceRange: ''
  });

  const [filteredWorkers, setFilteredWorkers] = useState<any[]>([]);

  // Load workers from database
  useEffect(() => {
    const loadWorkers = async () => {
      try {
        setLoading(true);
        const workersData = await workerService.getWorkers();
        setWorkers(workersData);
        setFilteredWorkers(workersData);
      } catch (error) {
        console.error('Error loading workers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadWorkers();
    }
  }, [isOpen]);

  // Filter workers based on search term and filters
  useEffect(() => {
    let filtered = workers;

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(worker =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.skills.some((skill: any) => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(worker => worker.location.includes(filters.location));
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(worker => worker.rating >= filters.minRating);
    }

    // Availability filter
    if (filters.availability) {
      filtered = filtered.filter(worker => worker.availability.status === filters.availability);
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(worker =>
        filters.skills.some(skill =>
          worker.skills.some((workerSkill: any) => workerSkill.name === skill)
        )
      );
    }

    // Experience filter
    if (filters.experience) {
      const [min, max] = filters.experience.split('-').map(Number);
      filtered = filtered.filter(worker => {
        if (max) {
          return worker.yearsExperience >= min && worker.yearsExperience <= max;
        } else {
          return worker.yearsExperience >= min;
        }
      });
    }

    setFilteredWorkers(filtered);
  }, [searchTerm, filters]);

  const handleViewWorker = (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (worker) {
      setSelectedWorker(worker);
      setShowWorkerModal(true);
    }
  };

  const handleEditWorker = (workerId: string) => {
    // Handle edit functionality
    console.log('Edit worker:', workerId);
  };

  const handleContactWorker = (workerId: string) => {
    // Handle contact functionality
    console.log('Contact worker:', workerId);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.minRating > 0) count++;
    if (filters.availability) count++;
    if (filters.skills.length > 0) count++;
    if (filters.experience) count++;
    if (filters.priceRange) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Recruitment Portal</h1>
              <p className="text-blue-100">Find and connect with skilled construction professionals</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto bg-gray-900">
          {/* Search and Filters */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterClick={() => setShowFilters(true)}
            activeFiltersCount={getActiveFiltersCount()}
          />

          {/* Workers Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Loading workers...</h3>
              <p className="text-gray-500">Please wait while we fetch the latest data</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkers.map(worker => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    onView={handleViewWorker}
                    onEdit={handleEditWorker}
                    onContact={handleContactWorker}
                  />
                ))}
              </div>

              {filteredWorkers.length === 0 && (
                <div className="text-center py-12">
                  <Users size={48} className="text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No workers found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Filter Panel */}
        <FilterPanel
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Worker Modal */}
        <WorkerModal
          worker={selectedWorker}
          isOpen={showWorkerModal}
          onClose={() => {
            setShowWorkerModal(false);
            setSelectedWorker(null);
          }}
        />
      </div>
    </div>
  );
};

export default RecruitmentPortal; 