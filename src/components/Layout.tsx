import React from 'react';
import { LogOut, Building, Users, FileText, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const navigationItems = {
    bricklayer: [
      { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
      { id: 'projects', label: t('nav.myProjects'), icon: Building }
    ],
    project_manager: [
      { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
      { id: 'projects', label: t('nav.allProjects'), icon: Building },
      { id: 'team', label: t('nav.team'), icon: Users }
    ],
    recruiter: [
      { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
      { id: 'applications', label: t('nav.applications'), icon: FileText }
    ]
  };

  const navItems = user ? navigationItems[user.role] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="https://i.ibb.co/S4dQf3c1/brickwall.png" alt="BricksApp Logo" className="h-8 w-auto mr-3 filter brightness-0 invert" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('app.title')}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSwitcher />
              {user && (
                <>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('common.welcome')}, {user.name}</span>
                  <button
                    onClick={logout}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    {t('common.logout')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        {user && (
          <nav className="w-64 bg-white dark:bg-gray-800 shadow-sm min-h-screen border-r border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onPageChange(item.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          currentPage === item.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-2 border-blue-700 dark:border-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};