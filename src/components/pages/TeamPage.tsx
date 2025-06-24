import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Building, Plus, Search, UserPlus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { userService, projectService } from '../../services/database';
import { User, Project } from '../../types';

export const TeamPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  // Load users and projects from Supabase
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [usersData, projectsData] = await Promise.all([
        userService.getUsers(),
        projectService.getProjects()
      ]);
      console.log('Loaded users from Supabase:', usersData);
      console.log('Loaded projects from Supabase:', projectsData);
      setUsers(usersData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Subscribe to real-time updates
    const userSubscription = userService.subscribeToUsers((updatedUsers) => {
      console.log('Real-time user update received:', updatedUsers);
      setUsers(updatedUsers);
    });
    
    const projectSubscription = projectService.subscribeToProjects((updatedProjects) => {
      console.log('Real-time project update received:', updatedProjects);
      setProjects(updatedProjects);
    });
    
    return () => {
      userSubscription.unsubscribe();
      projectSubscription.unsubscribe();
    };
  }, []);

  const teamMembers = users.filter(user => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('nav.team')}</h1>
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            {t('team.addMember')}
          </button>
        </div>
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
            <Users className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t('team.allRoles')}</option>
              <option value="bricklayer">{t('role.bricklayer')}</option>
              <option value="project_manager">{t('role.projectManager')}</option>
              <option value="recruiter">{t('role.recruiter')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('team.totalMembers')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <Building className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.activeProjects')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {projects.filter(p => p.status === 'active').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('team.bricklayers')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(u => u.role === 'bricklayer').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => {
          const assignedProjects = projects.filter(p => 
            p.assignedBricklayers.includes(member.id)
          );

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