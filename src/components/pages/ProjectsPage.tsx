import React, { useState, useEffect } from 'react';
import { Building, MapPin, Calendar, Users, Plus, Search, Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { projectService, userService } from '../../services/database';
import { Project, User } from '../../types';

interface ProjectsPageProps {
  userRole: string;
  userId: string;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ userRole, userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  // Load projects and users from Supabase
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [projectsData, usersData] = await Promise.all([
        projectService.getProjects(),
        userService.getUsers()
      ]);
      console.log('Loaded projects from Supabase:', projectsData);
      console.log('Loaded users from Supabase:', usersData);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Subscribe to real-time project updates
    const subscription = projectService.subscribeToProjects((updatedProjects) => {
      console.log('Real-time project update received:', updatedProjects);
      setProjects(updatedProjects);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesRole = userRole === 'project_manager' || 
                       (userRole === 'bricklayer' && project.assignedBricklayers.includes(userId));
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('status.active');
      case 'delayed': return t('status.delayed');
      case 'planning': return t('status.planning');
      case 'completed': return t('status.completed');
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {userRole === 'project_manager' ? t('projects.allProjects') : t('projects.myProjects')}
        </h1>
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
          {userRole === 'project_manager' && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              {t('projects.newProject')}
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('projects.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t('status.allStatus')}</option>
              <option value="active">{t('status.active')}</option>
              <option value="planning">{t('status.planning')}</option>
              <option value="delayed">{t('status.delayed')}</option>
              <option value="completed">{t('status.completed')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const progress = Math.round((project.brickCountUsed / project.brickCountRequired) * 100);
          const materials = project.materials || [];
          const assignedBricklayers = users.filter(u => 
            project.assignedBricklayers.includes(u.id)
          );
          
          return (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{project.name}</h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{project.address}</span>
                    </div>
                  </div>
                  <span className={`mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{t('common.progress')}</span>
                    <span className="text-sm text-gray-600">{progress}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {t('projects.bricksProgress', { 
                      used: project.brickCountUsed.toLocaleString(), 
                      required: project.brickCountRequired.toLocaleString() 
                    })}
                  </p>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{t('projects.startDate', { date: new Date(project.startDate).toLocaleDateString('da-DK') })}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{t('projects.endDate', { date: new Date(project.endDate).toLocaleDateString('da-DK') })}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{assignedBricklayers.length} {t('projects.bricklayers')}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{t('projects.materialsCount', { count: materials.length })}</span>
                    </div>
                  </div>
                </div>

                {/* Assigned Team */}
                {assignedBricklayers.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">{t('projects.assignedBricklayersTitle')}</p>
                    <div className="flex flex-wrap gap-1">
                      {assignedBricklayers.map((bricklayer) => (
                        <span key={bricklayer.id} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                          {bricklayer.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials */}
                {materials.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">{t('projects.materialsTitle')}</p>
                    <div className="space-y-1">
                      {materials.slice(0, 2).map((material: any) => (
                        <div key={material.id} className="flex justify-between items-center text-sm bg-gray-50 rounded p-2">
                          <span className="text-gray-600">{material.type}</span>
                          <span className="font-medium text-gray-900">
                            {material.quantityAvailable.toLocaleString()} {material.unit}
                          </span>
                        </div>
                      ))}
                      {materials.length > 2 && (
                        <p className="text-xs text-gray-500">{t('projects.moreMaterials', { count: materials.length - 2 })}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    {t('common.seeDetails')}
                  </button>
                  {userRole === 'project_manager' && (
                    <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      {t('common.edit')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t('projects.noActiveProjects')}</p>
        </div>
      )}
    </div>
  );
};