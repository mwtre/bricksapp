import React, { useState } from 'react';
import { Calendar, Users, Building, TrendingUp, AlertTriangle, MapPin, Video, Grid } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { mockProjects } from '../../data/mockData';
import { Project } from '../../types';
import { LiveCamera } from '../LiveCamera';
import { MultiCameraView } from '../MultiCameraView';

export const ProjectManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showMultiCamera, setShowMultiCamera] = useState(false);
  
  const managedProjects = mockProjects.filter((p: Project) => p.managerId === user?.id);
  const activeProjects = managedProjects.filter((p: Project) => p.status === 'active').length;
  const completedProjects = managedProjects.filter((p: Project) => p.status === 'completed').length;
  const delayedProjects = managedProjects.filter((p: Project) => p.status === 'delayed').length;

  const stats = [
    { label: t('dashboard.totalProjects'), value: managedProjects.length, icon: Building, color: 'text-blue-600 dark:text-blue-400' },
    { label: t('dashboard.activeProjects'), value: activeProjects, icon: TrendingUp, color: 'text-green-600 dark:text-green-400' },
    { label: t('dashboard.completedProjects'), value: completedProjects, icon: Calendar, color: 'text-purple-600 dark:text-purple-400' },
    { label: t('dashboard.delayedProjects'), value: delayedProjects, icon: AlertTriangle, color: 'text-red-600 dark:text-red-400' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('role.projectManager')} Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('da-DK', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('dashboard.welcome')}, {user?.name || ''}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t('dashboard.projectManagerSubtitle')}</p>
      </div>

      {/* Live Camera Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Video className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            {t('camera.liveMonitoring')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMultiCamera(true)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Grid className="h-4 w-4 mr-2" />
              {t('camera.viewAllCameras')}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managedProjects.filter(p => p.status === 'active').map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
              className={`p-4 border rounded-lg transition-colors ${
                selectedProject === project.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-600 dark:text-red-400">LIVE</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.address}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{t('camera.clickToView')}</span>
                <Video className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Camera View */}
      {selectedProject && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('camera.liveFeed')} - {managedProjects.find(p => p.id === selectedProject)?.name}
            </h2>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <LiveCamera
              projectId={selectedProject}
              projectName={managedProjects.find(p => p.id === selectedProject)?.name || ''}
            />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Project Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.projectOverview')}</h2>
        </div>
        <div className="p-6">
          {managedProjects.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('dashboard.noProjects')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {managedProjects.map((project: Project) => (
                <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-1" />
                        {project.address}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {t('common.deadline')}: {new Date(project.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'completed' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                          : project.status === 'active'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                          : project.status === 'delayed'
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                          : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                      }`}>
                        {t(`status.${project.status}`)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      {project.assignedBricklayers?.length || 0} {t('common.bricklayers')}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('common.progress')}: {Math.round((project.brickCountUsed / project.brickCountRequired) * 100)}%
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(Math.round((project.brickCountUsed / project.brickCountRequired) * 100), 100)}%` }}
                      ></div>
                    </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Building className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{t('dashboard.createProject')}</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{t('dashboard.assignTeam')}</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{t('dashboard.viewReports')}</span>
          </button>
        </div>
      </div>

      {/* Multi-Camera View Modal */}
      <MultiCameraView 
        isOpen={showMultiCamera} 
        onClose={() => setShowMultiCamera(false)} 
      />
    </div>
  );
};