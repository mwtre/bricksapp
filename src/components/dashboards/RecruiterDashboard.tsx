import React, { useState, useEffect } from 'react';
import { FileText, Users, Clock, CheckCircle, XCircle, AlertTriangle, Check, X, User, Trash2, Settings, Plus, Eye, Edit, Search, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { applicationService, workerService } from '../../services/database';
import { Application } from '../../types';
import RecruitmentPortal from '../RecruitmentPortal';

// Import vetrina components for worker management
import SearchBar from '../vetrina/SearchBar';
import WorkerCard from '../vetrina/WorkerCard';
import WorkerModal from '../vetrina/WorkerModal';
import FilterPanel from '../vetrina/FilterPanel';

// Define types for worker management
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

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Recruitment Portal Management States
  const [showRecruitmentPortal, setShowRecruitmentPortal] = useState(false);
  const [showWorkerManagement, setShowWorkerManagement] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    minRating: 0,
    availability: '',
    skills: [] as string[],
    experience: '',
    priceRange: ''
  });

  // Workers data from database
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workersLoading, setWorkersLoading] = useState(true);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);

  // Load applications and workers from Supabase
  const loadData = async () => {
    try {
      setIsLoading(true);
      setWorkersLoading(true);
      
      const [applicationsData, workersData] = await Promise.all([
        applicationService.getApplications(),
        workerService.getWorkers()
      ]);
      
      console.log('Loaded applications from Supabase for recruiter dashboard:', applicationsData);
      console.log('Loaded workers from Supabase for recruiter dashboard:', workersData);
      
      setApplications(applicationsData);
      setWorkers(workersData);
      setFilteredWorkers(workersData);
    } catch (error) {
      console.error('Error loading data for recruiter dashboard:', error);
    } finally {
      setIsLoading(false);
      setWorkersLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Subscribe to real-time updates
    const applicationSubscription = applicationService.subscribeToApplications((updatedApplications) => {
      console.log('Real-time application update received in recruiter dashboard:', updatedApplications);
      setApplications(updatedApplications);
    });
    
    const workerSubscription = workerService.subscribeToWorkers((updatedWorkers) => {
      console.log('Real-time worker update received in recruiter dashboard:', updatedWorkers);
      setWorkers(updatedWorkers);
      setFilteredWorkers(updatedWorkers);
    });
    
    return () => {
      applicationSubscription.unsubscribe();
      workerSubscription.unsubscribe();
    };
  }, []);

  // Filter workers based on search term and filters
  useEffect(() => {
    let filtered = workers;

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(worker =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
          worker.skills.some(workerSkill => workerSkill.name === skill)
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
  }, [searchTerm, filters, workers]);

  const handleStatusUpdate = async (applicationId: string, newStatus: 'pending' | 'reviewed' | 'approved' | 'rejected') => {
    try {
      setUpdatingId(applicationId);
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      console.log(`Application ${applicationId} status updated to ${newStatus}`);
      
      // If application is approved, create a worker profile
      if (newStatus === 'approved') {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          // Parse the certifications field to extract worker data
          const certParts = application.certifications?.split(' | ') || [];
          const skillsMatch = certParts.find(part => part.startsWith('Skills: '));
          const locationMatch = certParts.find(part => part.startsWith('Location: '));
          const rateMatch = certParts.find(part => part.startsWith('Rate: '));
          const availabilityMatch = certParts.find(part => part.startsWith('Availability: '));
          
          // Extract skills
          const skills = skillsMatch ? skillsMatch.replace('Skills: ', '').split(', ') : ['Bricklaying'];
          const skillsWithLevels = skills.map(skill => ({
            name: skill,
            level: Math.min(95, 70 + application.experience * 3),
            icon: 'Hammer'
          }));
          
          // Extract location
          const location = locationMatch ? locationMatch.replace('Location: ', '') : 'Denmark';
          
          // Set default hourly rates since they're no longer collected in the form
          const minRate = 35.0;
          const maxRate = 55.0;
          
          // Extract availability
          const availabilityStatus = availabilityMatch ? availabilityMatch.replace('Availability: ', '') : 'available';
          
          // Create worker data from application
          const workerData = {
            name: application.name,
            photo: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&random=${Math.random()}`,
            phone: application.phone,
            email: application.email,
            skills: skillsWithLevels,
            yearsExperience: application.experience,
            location: location,
            availability: {
              status: availabilityStatus as 'available' | 'partially-available' | 'busy',
              availableFrom: new Date().toISOString().split('T')[0],
              notes: 'Available for immediate start'
            },
            portfolio: [],
            rating: 4.0, // Default rating
            completedProjects: 0,
            hourlyRateMin: minRate,
            hourlyRateMax: maxRate,
            isVerified: true
          };
          
          await workerService.createWorkerFromApplication(applicationId, workerData);
          console.log('Worker created from approved application:', applicationId);
        }
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Error updating application status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      try {
        setUpdatingId(applicationId);
        await applicationService.deleteApplication(applicationId);
        console.log(`Application ${applicationId} deleted`);
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Error deleting application');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  // Worker Management Functions
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

  const handleAddWorker = () => {
    // Handle add new worker functionality
    console.log('Add new worker');
  };

  const handleDeleteWorker = async (workerId: string) => {
    if (window.confirm('Are you sure you want to remove this worker from the portal?')) {
      try {
        await workerService.deleteWorker(workerId);
        console.log('Worker deleted:', workerId);
      } catch (error) {
        console.error('Error deleting worker:', error);
        alert('Error deleting worker');
      }
    }
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
  
  const totalApplications = applications.length;
  const pendingApplications = applications.filter((app: Application) => app.status === 'pending').length;
  const reviewedApplications = applications.filter((app: Application) => app.status === 'reviewed').length;
  const approvedApplications = applications.filter((app: Application) => app.status === 'approved').length;
  const rejectedApplications = applications.filter((app: Application) => app.status === 'rejected').length;

  const stats = [
    { label: t('dashboard.pendingApplications'), value: pendingApplications, icon: Clock, color: 'text-orange-600 dark:text-orange-400' },
    { label: t('dashboard.reviewedApplications'), value: reviewedApplications, icon: FileText, color: 'text-blue-600 dark:text-blue-400' },
    { label: t('dashboard.approvedApplications'), value: approvedApplications, icon: CheckCircle, color: 'text-green-600 dark:text-green-400' },
    { label: t('dashboard.rejectedApplications'), value: rejectedApplications, icon: XCircle, color: 'text-red-600 dark:text-red-400' }
  ];

  const recentApplications = applications.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading recruiter dashboard...</p>
        </div>
      </div>
    );
  }

  if (showRecruitmentPortal) {
    return (
      <RecruitmentPortal
        isOpen={showRecruitmentPortal}
        onClose={() => setShowRecruitmentPortal(false)}
      />
    );
  }

  if (showWorkerManagement) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Worker Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage workers in the Recruitment Portal</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowWorkerManagement(false)}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleAddWorker}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Worker
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFilterClick={() => setShowFilters(true)}
          activeFiltersCount={getActiveFiltersCount()}
        />

        {/* Workers Grid */}
        {workersLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Loading workers...</h3>
            <p className="text-gray-500">Please wait while we fetch the latest data</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkers.map(worker => (
                <div key={worker.id} className="relative">
                  <WorkerCard
                    worker={worker}
                    onView={handleViewWorker}
                    onEdit={handleEditWorker}
                    onContact={handleContactWorker}
                  />
                  {/* Management Overlay */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditWorker(worker.id)}
                      className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      title="Edit Worker"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteWorker(worker.id)}
                      className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      title="Remove Worker"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredWorkers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No workers found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or add new workers</p>
              </div>
            )}
          </>
        )}

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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('role.recruiter')} Dashboard</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            className="flex items-center px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-300">
            {new Date().toLocaleDateString('da-DK', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('dashboard.welcome')}, {user?.name || ''}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t('dashboard.recruiterSubtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recruitment Portal Management Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recruitment Portal Management</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {workers.length} active workers
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowRecruitmentPortal(true)}
            className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">View Portal</span>
          </button>
          <button
            onClick={() => setShowWorkerManagement(true)}
            className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">Manage Workers</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">Portal Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.recentApplications')}</h2>
        </div>
        <div className="p-6">
          {recentApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('dashboard.noApplications')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((application: Application) => (
                <div key={application.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{application.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{application.email}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{application.phone}</p>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{t('common.experience')}:</span> {application.experience} {t('common.years')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-0 sm:ml-4 mt-2 sm:mt-0">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        application.status === 'approved' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                          : application.status === 'rejected'
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                          : application.status === 'reviewed'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                          : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                      }`}>
                        {t(`status.${application.status}`)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{application.message}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{t('common.submitted')}: {new Date(application.submittedDate).toLocaleDateString()}</span>
                    <span>{t('common.certifications')}: {application.certifications}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-4 flex items-center justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-gray-600">
                    {application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'approved')}
                          disabled={updatingId === application.id}
                          className="flex items-center px-3 py-1 text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 rounded-md transition-colors disabled:opacity-50"
                          title="Approve Application"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          disabled={updatingId === application.id}
                          className="flex items-center px-3 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 rounded-md transition-colors disabled:opacity-50"
                          title="Reject Application"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'reviewed')}
                          disabled={updatingId === application.id}
                          className="flex items-center px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md transition-colors disabled:opacity-50"
                          title="Mark as Reviewed"
                        >
                          <User className="h-3 w-3 mr-1" />
                          Review
                        </button>
                      </>
                    )}
                    {application.status === 'reviewed' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'approved')}
                          disabled={updatingId === application.id}
                          className="flex items-center px-3 py-1 text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 rounded-md transition-colors disabled:opacity-50"
                          title="Approve Application"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          disabled={updatingId === application.id}
                          className="flex items-center px-3 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 rounded-md transition-colors disabled:opacity-50"
                          title="Reject Application"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteApplication(application.id)}
                      disabled={updatingId === application.id}
                      className="flex items-center px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors disabled:opacity-50"
                      title="Delete Application"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{t('dashboard.reviewApplications')}</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{t('dashboard.scheduleInterviews')}</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <AlertTriangle className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{t('dashboard.sendNotifications')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};