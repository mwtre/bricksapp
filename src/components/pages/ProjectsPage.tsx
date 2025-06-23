import React, { useState } from 'react';
import { Building, MapPin, Calendar, Users, Plus, Search, Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { mockProjects, mockUsers, mockMaterials } from '../../data/mockData';

interface ProjectsPageProps {
  userRole: string;
  userId: string;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ userRole, userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { t } = useLanguage();

  const filteredProjects = mockProjects.filter(project => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {userRole === 'project_manager' ? t('projects.allProjects') : t('projects.myProjects')}
        </h1>
        {userRole === 'project_manager' && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            {t('projects.newProject')}
          </button>
        )}
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
          const materials = mockMaterials.filter(m => m.projectId === project.id);
          const assignedBricklayers = mockUsers.filter(u => 
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
                      {materials.slice(0, 2).map((material) => (
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