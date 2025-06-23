import React, { useState } from 'react';
import { Users, Mail, Phone, Building, Plus, Search, UserPlus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { mockUsers, mockProjects } from '../../data/mockData';

export const TeamPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { t } = useLanguage();

  const teamMembers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleText = (role: string) => {
    switch (role) {
      case 'bricklayer': return t('role.bricklayer');
      case 'project_manager': return t('role.projectManager');
      case 'recruiter': return t('role.recruiter');
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'bricklayer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'project_manager': return 'bg-green-100 text-green-800 border-green-200';
      case 'recruiter': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('team.title')}</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
          <UserPlus className="h-4 w-4 mr-2" />
          {t('team.addMember')}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('team.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t('common.all')} {t('common.team')}</option>
              <option value="bricklayer">{t('role.bricklayer')}</option>
              <option value="project_manager">{t('role.projectManager')}</option>
              <option value="recruiter">{t('role.recruiter')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('team.totalBricklayers')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockUsers.filter(u => u.role === 'bricklayer').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <Building className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('team.projectManagers')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockUsers.filter(u => u.role === 'project_manager').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <UserPlus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.activeProjects')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockProjects.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => {
          const assignedProjects = member.assignedProjects 
            ? mockProjects.filter(p => member.assignedProjects!.includes(p.id))
            : [];

          return (
            <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{member.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getRoleColor(member.role)}`}>
                      {getRoleText(member.role)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">{member.phone}</span>
                    </div>
                  )}
                </div>

                {member.role === 'bricklayer' && assignedProjects.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">{t('team.assignedProjects')}:</p>
                    <div className="space-y-1">
                      {assignedProjects.slice(0, 2).map((project) => (
                        <div key={project.id} className="bg-gray-50 rounded p-2">
                          <p className="text-sm font-medium text-gray-900">{project.name}</p>
                          <p className="text-xs text-gray-600">{project.address}</p>
                        </div>
                      ))}
                      {assignedProjects.length > 2 && (
                        <p className="text-xs text-gray-500">+{assignedProjects.length - 2} {t('common.more')} {t('nav.projects')}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    {t('team.viewProfile')}
                  </button>
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    {t('common.edit')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('team.noMembers')}</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('common.noData')}
          </p>
        </div>
      )}
    </div>
  );
};