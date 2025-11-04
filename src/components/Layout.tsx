import React, { useState } from 'react';
import { LogOut, Building, Users, FileText, Home, HelpCircle, RotateCcw, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { AppTutorial } from './AppTutorial';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { user, logout } = useAuth();
  const { t, setHasSelectedLanguage } = useLanguage();
  const [showTutorial, setShowTutorial] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const resetLanguageSelection = () => {
    localStorage.removeItem('expatheros-language-selected');
    setHasSelectedLanguage(false);
    window.location.reload();
  };

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
              <img src="https://i.ibb.co/S4dQf3c1/brickwall.png" alt="expatheros.nl Logo" className="h-8 w-auto mr-3 filter brightness-0 invert" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">{t('app.title')}</h1>
            </div>

            <div className="flex items-center md:hidden">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowTutorial(true)}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="App Tutorial"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                Tutorial
              </button>
              <button
                onClick={resetLanguageSelection}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Reset Language Selection (for testing)"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset Lang
              </button>
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
          <>
            {/* Mobile Sidebar */}
            <div
              className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-30 md:hidden transition-opacity ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            <nav
              className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-40 transform transition-transform md:relative md:transform-none md:shadow-sm md:w-64 md:z-auto ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4 md:hidden">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
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
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Tutorial Modal */}
      <AppTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};