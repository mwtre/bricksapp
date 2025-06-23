import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, TrendingUp, AlertTriangle, CheckCircle, Construction, Hourglass, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getProjects, updateRoadmapStepStatus } from '../../data/mockData';
import { Project } from '../../types';

export const BricklayerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [projects, setProjects] = useState(getProjects());

  useEffect(() => {
    const handleProjectsUpdate = () => setProjects(getProjects());
    window.addEventListener('projects-updated', handleProjectsUpdate);
    return () => window.removeEventListener('projects-updated', handleProjectsUpdate);
  }, []);

  const myProjects = projects.filter((p: Project) => p.assignedBricklayers?.includes(user?.id || ''));
  const completedProjects = myProjects.filter((p: Project) => p.status === 'completed').length;
  const activeProjects = myProjects.filter((p: Project) => p.status === 'active').length;
  const upcomingProjects = myProjects.filter((p: Project) => p.status === 'planning').length;

  const stats = [
    { label: t('dashboard.completedProjects'), value: completedProjects, icon: TrendingUp, color: 'text-green-600 dark:text-green-400' },
    { label: t('dashboard.activeProjects'), value: activeProjects, icon: Clock, color: 'text-blue-600 dark:text-blue-400' },
    { label: t('dashboard.upcomingProjects'), value: upcomingProjects, icon: Calendar, color: 'text-orange-600 dark:text-orange-400' }
  ];

  const handleMarkInReview = (projectId: string, phase: string) => {
    updateRoadmapStepStatus(projectId, phase, 'in_review');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('dashboard.welcome')}, {user?.name || ''}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t('dashboard.bricklayerSubtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

      {/* Current Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.currentProjects')}</h2>
        </div>
        <div className="p-6">
          {myProjects.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('dashboard.noProjects')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myProjects.slice(0, 5).map((project: Project) => (
                <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-1" />
                        {project.address}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {t('common.deadline')}: {new Date(project.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'completed' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                          : project.status === 'active'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                          : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                      }`}>
                        {t(`status.${project.status}`)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      {project.assignedBricklayers?.length || 0} {t('common.bricklayers')}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('common.progress')}: {Math.round((project.brickCountUsed / project.brickCountRequired) * 100)}%
                    </div>
                  </div>
                  {/* Roadmap */}
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Projekt Roadmap</h4>
                    <div className="flex items-center space-x-2 overflow-x-auto">
                      {project.roadmap.map((step, index) => {
                        const isCompleted = step.status === 'completed';
                        const isActive = step.status === 'active';
                        const isInReview = step.status === 'in_review';
                        return (
                          <React.Fragment key={step.phase}>
                            <div className="flex flex-col items-center min-w-[80px]">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                                isCompleted ? 'bg-green-500' : isInReview ? 'bg-yellow-400 animate-pulse' : isActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'
                              }`}>
                                {isCompleted ? <CheckCircle className="w-4 h-4 text-white" /> : isInReview ? <Eye className="w-4 h-4 text-white" /> : isActive ? <Construction className="w-4 h-4 text-white" /> : <Hourglass className="w-4 h-4 text-gray-500" />}
                              </div>
                              <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">{step.phase}</p>
                              {['active', 'pending'].includes(step.status) && (
                                <button
                                  onClick={() => handleMarkInReview(project.id, step.phase)}
                                  className="mt-1 px-2 py-1 text-xs bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                >
                                  Markér som klar
                                </button>
                              )}
                              {isInReview && <span className="text-[10px] text-yellow-700 dark:text-yellow-300 mt-1">Afventer godkendelse</span>}
                              {isCompleted && <span className="text-[10px] text-green-700 dark:text-green-300 mt-1">Godkendt</span>}
                            </div>
                            {index < project.roadmap.length - 1 && (
                              <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                            )}
                          </React.Fragment>
                        );
                      })}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{t('dashboard.viewSchedule')}</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{t('dashboard.logHours')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};