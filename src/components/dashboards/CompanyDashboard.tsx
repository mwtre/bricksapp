import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, MapPin, Clock, Star, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, Hammer, Building, Send, Briefcase, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { workerService, companyRequestService, jobOfferSubmissionService } from '../../services/database';
import WorkerCard from '../vetrina/WorkerCard';

// Job categories from landing page
const PROFESSIONS = [
  'Bricklayer',
  'Courier',
  'Food Production',
  'Forklift',
  'Waitress',
  'CE Driver',
  'Bar Employee',
  'Industrial Cleaner',
  'Supermarket Employee',
  'Line Operator',
  'Electrician'
];

const AVAILABILITY_FILTERS = [
  { value: 'all', label: 'All Availability' },
  { value: 'available', label: 'Available Now' },
  { value: 'partially-available', label: 'Partially Available' },
  { value: 'busy', label: 'Busy' }
];

export const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [workers, setWorkers] = useState<any[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'projects' | 'name'>('rating');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedWorkerForRequest, setSelectedWorkerForRequest] = useState<any>(null);
  const [companyNotes, setCompanyNotes] = useState('');
  const [showJobOfferForm, setShowJobOfferForm] = useState(false);
  const [jobOfferData, setJobOfferData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    requirements: ''
  });

  // Mock candidate data
  const mockCandidates = [
    {
      id: 'mock-1',
      name: 'Marco',
      photo: `${import.meta.env.BASE_URL}candidate/marco.jpeg`,
      phone: '+31 6 12345678',
      email: 'marco@expatheros.nl',
      skills: [
        { name: 'Bricklayer', level: 95, icon: Hammer },
        { name: 'Construction', level: 88, icon: Building },
        { name: 'Tiling', level: 82, icon: Building }
      ],
      yearsExperience: 8,
      location: 'Amsterdam, Netherlands',
      availability: { status: 'available', notes: 'Available immediately' },
      portfolio: [
        {
          id: '1',
          title: 'Residential Building Project',
          description: 'Complete brickwork for modern apartment complex',
          image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop',
          completedDate: '2024-01-15',
          client: 'Dutch Construction Co.',
          skills: ['Bricklayer', 'Construction']
        }
      ],
      rating: 4.9,
      completedProjects: 45,
      hourlyRateMin: 17.50, // €2,800/month ÷ 160 hours
      hourlyRateMax: 20.00, // €3,200/month ÷ 160 hours
      isActive: true,
      isVerified: true
    },
    {
      id: 'mock-2',
      name: 'Luis',
      photo: `${import.meta.env.BASE_URL}candidate/luis.jpeg`,
      phone: '+31 6 23456789',
      email: 'luis@expatheros.nl',
      skills: [
        { name: 'Courier', level: 90, icon: Building },
        { name: 'Delivery', level: 85, icon: Building },
        { name: 'Logistics', level: 80, icon: Building }
      ],
      yearsExperience: 5,
      location: 'Rotterdam, Netherlands',
      availability: { status: 'available', notes: 'Flexible schedule' },
      portfolio: [
        {
          id: '2',
          title: 'Retail Distribution',
          description: 'Efficient delivery routes for supermarket chain',
          image: 'https://images.unsplash.com/photo-1604910608047-7c6b4b964b1a?w=400&h=200&fit=crop',
          completedDate: '2024-02-01',
          client: 'Retail Distribution NL',
          skills: ['Courier', 'Delivery']
        }
      ],
      rating: 4.7,
      completedProjects: 32,
      hourlyRateMin: 15.16, // €2,426/month ÷ 160 hours
      hourlyRateMax: 17.50, // €2,800/month ÷ 160 hours
      isActive: true,
      isVerified: true
    },
    {
      id: 'mock-3',
      name: 'Silvia',
      photo: `${import.meta.env.BASE_URL}candidate/silvia.jpeg`,
      phone: '+31 6 34567890',
      email: 'silvia@expatheros.nl',
      skills: [
        { name: 'Bar Employee', level: 92, icon: Building },
        { name: 'Hospitality', level: 88, icon: Building },
        { name: 'Customer Service', level: 95, icon: Building }
      ],
      yearsExperience: 6,
      location: 'Amsterdam, Netherlands',
      availability: { status: 'partially-available', availableFrom: '2024-11-15', notes: 'Available evenings and weekends' },
      portfolio: [
        {
          id: '3',
          title: 'Hotel Bar - Amsterdam',
          description: 'Premium bar service in luxury hotel',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop',
          completedDate: '2024-01-20',
          client: 'Amsterdam Hotels',
          skills: ['Bar Employee', 'Hospitality']
        }
      ],
      rating: 4.8,
      completedProjects: 28,
      hourlyRateMin: 15.94, // €2,550/month ÷ 160 hours
      hourlyRateMax: 16.88, // €2,700/month ÷ 160 hours
      isActive: true,
      isVerified: true
    },
    {
      id: 'mock-4',
      name: 'Javier',
      photo: `${import.meta.env.BASE_URL}candidate/javier%20.jpeg`,
      phone: '+31 6 45678901',
      email: 'javier@expatheros.nl',
      skills: [
        { name: 'Food Production', level: 88, icon: Building },
        { name: 'Line Operator', level: 85, icon: Building },
        { name: 'Quality Control', level: 82, icon: Building }
      ],
      yearsExperience: 7,
      location: 'Utrecht, Netherlands',
      availability: { status: 'available', notes: 'Full-time availability' },
      portfolio: [
        {
          id: '4',
          title: 'Food Production Line',
          description: 'Production line operator for food manufacturing',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop',
          completedDate: '2024-02-10',
          client: 'Food Production NL',
          skills: ['Food Production', 'Line Operator']
        }
      ],
      rating: 4.6,
      completedProjects: 38,
      hourlyRateMin: 22.98, // €3,676/month ÷ 160 hours
      hourlyRateMax: 31.97, // €5,115/month ÷ 160 hours
      isActive: true,
      isVerified: true
    },
    {
      id: 'mock-5',
      name: 'Filip',
      photo: `${import.meta.env.BASE_URL}candidate/filip.jpeg`,
      phone: '+31 6 56789012',
      email: 'filip@expatheros.nl',
      skills: [
        { name: 'Electrician', level: 93, icon: Hammer },
        { name: 'Electrical Installation', level: 90, icon: Building },
        { name: 'Maintenance', level: 85, icon: Building }
      ],
      yearsExperience: 10,
      location: 'Haarlem, Netherlands',
      availability: { status: 'available', notes: 'Experienced electrician available' },
      portfolio: [
        {
          id: '5',
          title: 'Commercial Electrical Installation',
          description: 'Complete electrical system installation for office building',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop',
          completedDate: '2024-01-25',
          client: 'Haarlem Electric Co.',
          skills: ['Electrician', 'Electrical Installation']
        }
      ],
      rating: 4.9,
      completedProjects: 67,
      hourlyRateMin: 15.63, // €2,500/month ÷ 160 hours
      hourlyRateMax: 23.44, // €3,750/month ÷ 160 hours
      isActive: true,
      isVerified: true
    },
    {
      id: 'mock-6',
      name: 'Enrique',
      photo: `${import.meta.env.BASE_URL}candidate/enrique%20.jpg`,
      phone: '+31 6 67890123',
      email: 'enrique@expatheros.nl',
      skills: [
        { name: 'Industrial Cleaner', level: 90, icon: Building },
        { name: 'Maintenance', level: 85, icon: Building },
        { name: 'Quality Control', level: 80, icon: Building }
      ],
      yearsExperience: 6,
      location: 'Arkel, Netherlands',
      availability: { status: 'available', notes: 'Full-time availability' },
      portfolio: [
        {
          id: '6',
          title: 'Industrial Cleaning - Production Facility',
          description: 'Complete cleaning and maintenance of production facility',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop',
          completedDate: '2024-02-05',
          client: 'Raaak Personeel',
          skills: ['Industrial Cleaner', 'Maintenance']
        }
      ],
      rating: 4.7,
      completedProjects: 42,
      hourlyRateMin: 20.00, // €3,200/month ÷ 160 hours
      hourlyRateMax: 20.00, // €3,200/month ÷ 160 hours
      isActive: true,
      isVerified: true
    },
    {
      id: 'mock-7',
      name: 'Fabian',
      photo: `${import.meta.env.BASE_URL}candidate/fabian.jpg`,
      phone: '+31 6 78901234',
      email: 'fabian@expatheros.nl',
      skills: [
        { name: 'Forklift', level: 92, icon: Building },
        { name: 'Warehouse Operations', level: 88, icon: Building },
        { name: 'Logistics', level: 85, icon: Building }
      ],
      yearsExperience: 7,
      location: 'Eindhoven, Netherlands',
      availability: { status: 'available', notes: 'Experienced forklift operator' },
      portfolio: [
        {
          id: '7',
          title: 'Warehouse Operations',
          description: 'Efficient forklift operations in large distribution center',
          image: 'https://images.unsplash.com/photo-1604910608047-7c6b4b964b1a?w=400&h=200&fit=crop',
          completedDate: '2024-01-30',
          client: 'Distribution Center NL',
          skills: ['Forklift', 'Warehouse Operations']
        }
      ],
      rating: 4.8,
      completedProjects: 35,
      hourlyRateMin: 17.50, // €2,800/month ÷ 160 hours (using similar rate to bricklayer)
      hourlyRateMax: 22.50, // €3,600/month ÷ 160 hours
      isActive: true,
      isVerified: true
    },
    {
      id: 'mock-8',
      name: 'Marie',
      photo: `${import.meta.env.BASE_URL}candidate/marie.jpg`,
      phone: '+31 6 89012345',
      email: 'marie@expatheros.nl',
      skills: [
        { name: 'Waitress', level: 95, icon: Building },
        { name: 'Hospitality', level: 90, icon: Building },
        { name: 'Customer Service', level: 92, icon: Building }
      ],
      yearsExperience: 5,
      location: 'Amsterdam, Netherlands',
      availability: { status: 'partially-available', availableFrom: '2024-11-20', notes: 'Available for restaurant shifts' },
      portfolio: [
        {
          id: '8',
          title: 'Restaurant Service - Amsterdam',
          description: 'High-end restaurant service and customer relations',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop',
          completedDate: '2024-02-08',
          client: 'Amsterdam Restaurants',
          skills: ['Waitress', 'Hospitality']
        }
      ],
      rating: 4.9,
      completedProjects: 29,
      hourlyRateMin: 15.94, // €2,550/month ÷ 160 hours (similar to bar employee)
      hourlyRateMax: 16.88, // €2,700/month ÷ 160 hours
      isActive: true,
      isVerified: true
    },
    {
      id: 'mock-9',
      name: 'Roman',
      photo: `${import.meta.env.BASE_URL}candidate/roman%20.jpg`,
      phone: '+31 6 90123456',
      email: 'roman@expatheros.nl',
      skills: [
        { name: 'Supermarket Employee', level: 88, icon: Building },
        { name: 'Retail', level: 85, icon: Building },
        { name: 'Customer Service', level: 90, icon: Building }
      ],
      yearsExperience: 4,
      location: 'Utrecht, Netherlands',
      availability: { status: 'available', notes: 'Full-time supermarket employee' },
      portfolio: [
        {
          id: '9',
          title: 'Supermarket Operations',
          description: 'Full-time supermarket employee with customer service expertise',
          image: 'https://images.unsplash.com/photo-1604910608047-7c6b4b964b1a?w=400&h=200&fit=crop',
          completedDate: '2024-02-12',
          client: 'Supermarket Chain NL',
          skills: ['Supermarket Employee', 'Retail']
        }
      ],
      rating: 4.6,
      completedProjects: 24,
      hourlyRateMin: 15.94, // €2,550/month ÷ 160 hours
      hourlyRateMax: 16.88, // €2,700/month ÷ 160 hours
      isActive: true,
      isVerified: true
    },
    {
      id: 'mock-10',
      name: 'Yan',
      photo: `${import.meta.env.BASE_URL}candidate/yan.jpg`,
      phone: '+31 6 01234567',
      email: 'yan@expatheros.nl',
      skills: [
        { name: 'CE Driver', level: 93, icon: Building },
        { name: 'Truck Driving', level: 90, icon: Building },
        { name: 'Logistics', level: 88, icon: Building }
      ],
      yearsExperience: 9,
      location: 'Rotterdam, Netherlands',
      availability: { status: 'available', notes: 'Experienced CE driver available' },
      portfolio: [
        {
          id: '10',
          title: 'Retail Distribution',
          description: 'CE driver for retail distribution with excellent safety record',
          image: 'https://images.unsplash.com/photo-1604910608047-7c6b4b964b1a?w=400&h=200&fit=crop',
          completedDate: '2024-01-28',
          client: 'Retail Distribution NL',
          skills: ['CE Driver', 'Truck Driving']
        }
      ],
      rating: 4.8,
      completedProjects: 51,
      hourlyRateMin: 17.50, // €2,800/month ÷ 160 hours (similar to courier)
      hourlyRateMax: 20.00, // €3,200/month ÷ 160 hours
      isActive: true,
      isVerified: true
    }
  ];

  // Load workers from database
  const loadWorkers = async () => {
    try {
      setIsLoading(true);
      const workersData = await workerService.getWorkers();
      console.log('Loaded workers from database:', workersData);
      
      // Combine database workers with mock candidates
      const allWorkers = [...(workersData || []), ...mockCandidates];
      
      setWorkers(allWorkers);
      setFilteredWorkers(allWorkers);
    } catch (error) {
      console.error('Error loading workers:', error);
      // On error, use mock candidates
      setWorkers(mockCandidates);
      setFilteredWorkers(mockCandidates);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  // Get all unique skills from workers
  const getAllSkills = () => {
    const skillSet = new Set<string>();
    workers.forEach(worker => {
      if (worker.skills && Array.isArray(worker.skills)) {
        worker.skills.forEach((skill: any) => {
          if (typeof skill === 'string') {
            skillSet.add(skill);
          } else if (skill.name) {
            skillSet.add(skill.name);
          }
        });
      }
    });
    return Array.from(skillSet).sort();
  };

  // Filter and sort workers
  useEffect(() => {
    let filtered = [...workers];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(worker =>
        worker.name?.toLowerCase().includes(query) ||
        worker.email?.toLowerCase().includes(query) ||
        worker.location?.toLowerCase().includes(query) ||
        worker.skills?.some((skill: any) => {
          const skillName = typeof skill === 'string' ? skill : skill.name;
          return skillName?.toLowerCase().includes(query);
        })
      );
    }

    // Profession filter
    if (selectedProfession !== 'all') {
      filtered = filtered.filter(worker => {
        const skills = worker.skills || [];
        return skills.some((skill: any) => {
          const skillName = typeof skill === 'string' ? skill : skill.name;
          return skillName?.toLowerCase().includes(selectedProfession.toLowerCase());
        });
      });
    }

    // Availability filter
    if (selectedAvailability !== 'all') {
      filtered = filtered.filter(worker => {
        const availability = worker.availability || {};
        return availability.status === selectedAvailability;
      });
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(worker => {
        const skills = worker.skills || [];
        const workerSkillNames = skills.map((skill: any) => 
          typeof skill === 'string' ? skill.toLowerCase() : skill.name?.toLowerCase()
        );
        return selectedSkills.some(selectedSkill =>
          workerSkillNames.includes(selectedSkill.toLowerCase())
        );
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'experience':
          return (b.yearsExperience || 0) - (a.yearsExperience || 0);
        case 'projects':
          return (b.completedProjects || 0) - (a.completedProjects || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });

    setFilteredWorkers(filtered);
  }, [workers, searchQuery, selectedProfession, selectedAvailability, selectedSkills, sortBy]);

  const handleViewWorker = (id: string) => {
    console.log('View worker:', id);
    // TODO: Open worker detail modal
  };

  const handleEditWorker = (id: string) => {
    console.log('Edit worker:', id);
    // TODO: Open edit worker modal
  };

  const handleContactWorker = (id: string) => {
    const worker = workers.find(w => w.id === id);
    if (worker) {
      console.log('Contact worker:', worker);
      // TODO: Open contact modal or navigate to contact
      window.open(`mailto:${worker.email}`, '_blank');
    }
  };

  const handleRequestCandidate = (worker: any) => {
    setSelectedWorkerForRequest(worker);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async () => {
    if (!user?.id || !selectedWorkerForRequest) return;
    
    try {
      await companyRequestService.createRequest(
        user.id,
        selectedWorkerForRequest.id,
        companyNotes
      );
      alert('Candidate request submitted! The recruiter will review it.');
      setShowRequestModal(false);
      setSelectedWorkerForRequest(null);
      setCompanyNotes('');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Error submitting request');
    }
  };

  const handleSubmitJobOffer = async () => {
    if (!user?.id || !jobOfferData.title || !jobOfferData.category || !jobOfferData.location) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await jobOfferSubmissionService.createSubmission(user.id, jobOfferData);
      alert('Job offer submitted! The recruiter will review it.');
      setShowJobOfferForm(false);
      setJobOfferData({
        title: '',
        category: '',
        location: '',
        description: '',
        requirements: ''
      });
    } catch (error) {
      console.error('Error submitting job offer:', error);
      alert('Error submitting job offer');
    }
  };

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedProfession('all');
    setSelectedAvailability('all');
    setSelectedSkills([]);
  };

  const availableSkills = getAllSkills();
  const activeFiltersCount = 
    (selectedProfession !== 'all' ? 1 : 0) +
    (selectedAvailability !== 'all' ? 1 : 0) +
    selectedSkills.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Company Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Browse and manage your candidate database
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome, {user?.name || 'Company'}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Find the perfect candidates for your projects. Use filters to narrow down your search.
            </p>
          </div>
          <button
            onClick={() => setShowJobOfferForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Job Offer
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, location, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Filter size={20} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
            {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="rating">Sort by Rating</option>
            <option value="experience">Sort by Experience</option>
            <option value="projects">Sort by Projects</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            {/* Profession Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profession
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedProfession('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedProfession === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All Professions
                </button>
                {PROFESSIONS.map(profession => (
                  <button
                    key={profession}
                    onClick={() => setSelectedProfession(profession)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedProfession === profession
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {profession}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Availability
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY_FILTERS.map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedAvailability(filter.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedAvailability === filter.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {filter.value === 'available' && <CheckCircle size={16} />}
                    {filter.value === 'busy' && <XCircle size={16} />}
                    {filter.value === 'partially-available' && <AlertCircle size={16} />}
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Filter */}
            {availableSkills.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills {selectedSkills.length > 0 && `(${selectedSkills.length} selected)`}
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkillFilter(skill)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedSkills.includes(skill)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredWorkers.length}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{workers.length}</span> candidates
        </p>
      </div>

      {/* Workers Grid */}
      {filteredWorkers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No candidates found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || activeFiltersCount > 0
              ? 'Try adjusting your search or filters'
              : 'No candidates available at the moment'}
          </p>
          {(searchQuery || activeFiltersCount > 0) && (
            <button
              onClick={clearFilters}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map(worker => {
            // Transform worker data to match WorkerCard expected format
            const transformedWorker = {
              ...worker,
              skills: Array.isArray(worker.skills) 
                ? worker.skills.map((skill: any) => {
                    // If skill is already an object with name and level, use it
                    if (typeof skill === 'object' && skill.name) {
                      return skill;
                    }
                    // If skill is a string, create a basic skill object
                    if (typeof skill === 'string') {
                      // Map skill names to appropriate icons
                      const skillLower = skill.toLowerCase();
                      let icon = Building; // Default icon
                      if (skillLower.includes('brick') || skillLower.includes('mason')) {
                        icon = Hammer;
                      } else if (skillLower.includes('construction') || skillLower.includes('building')) {
                        icon = Building;
                      }
                      
                      return {
                        name: skill,
                        level: 75, // Default level
                        icon: icon
                      };
                    }
                    return skill;
                  })
                : [],
              portfolio: Array.isArray(worker.portfolio) ? worker.portfolio : [],
              availability: worker.availability || { status: 'available' },
              rating: worker.rating || 0,
              completedProjects: worker.completedProjects || 0,
              yearsExperience: worker.yearsExperience || 0,
              hourlyRateMin: worker.hourlyRateMin,
              hourlyRateMax: worker.hourlyRateMax,
              photo: worker.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
            };

            return (
              <div key={worker.id} className="relative">
                <WorkerCard
                  worker={transformedWorker}
                  onView={handleViewWorker}
                  onEdit={handleEditWorker}
                  onContact={handleContactWorker}
                />
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleRequestCandidate(worker)}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors shadow-lg"
                    title="Request Candidate"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Request
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

