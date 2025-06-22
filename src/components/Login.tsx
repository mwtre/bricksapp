import React, { useState } from 'react';
import { Building, Mail, Lock, AlertCircle, UserPlus, Info, ArrowRight, Hammer, Ruler, Shield, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { RecruitmentForm } from './RecruitmentForm';
import { ConstructionTutorials } from './ConstructionTutorials';
import { VideoBackground } from './VideoBackground';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRecruitment, setShowRecruitment] = useState(false);
  const [loginType, setLoginType] = useState<'management' | 'bricklayer'>('management');
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError(t('login.invalidCredentials'));
    }
  };

  const handleGoogleLogin = async () => {
    // TODO: Implement Google OAuth
    console.log('Google login clicked');
    // For now, show recruitment form
    setShowRecruitment(true);
  };

  const demoAccounts = [
    { email: 'lars@bricksapp.dk', role: t('role.bricklayer') },
    { email: 'mette@bricksapp.dk', role: t('role.projectManager') },
    { email: 'anne@bricksapp.dk', role: t('role.recruiter') }
  ];

  if (showRecruitment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        <VideoBackground videoSrc="/intro.mp4" playOnce={true} />
        
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-50">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        
        <div className="max-w-7xl mx-auto p-4 relative z-10">
          <div className="text-center mb-8">
            <img src="/brickwall.png" alt="BricksApp Logo" className="h-12 w-auto mx-auto mb-4 filter brightness-0 invert" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('app.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('login.welcomeNewBricklayer')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Recruitment Form - Full Width at Top */}
            <div className="lg:col-span-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/30 dark:border-gray-700/30">
              <RecruitmentForm />
            </div>

            {/* App Information */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm p-6 border border-white/30 dark:border-gray-700/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                {t('login.howWeUseApp')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3 mt-1">
                    <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('login.projectManagement')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('login.projectManagementDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg mr-3 mt-1">
                    <UserPlus className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('login.teamCollaboration')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('login.teamCollaborationDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg mr-3 mt-1">
                    <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('login.communication')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('login.communicationDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-lg mr-3 mt-1">
                    <ArrowRight className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('login.nextSteps')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('login.nextStepsDesc')}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowRecruitment(false)}
                className="mt-6 w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {t('login.backToLogin')}
              </button>
            </div>

            {/* Brick Building Methods */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm p-6 border border-white/30 dark:border-gray-700/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Hammer className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                {t('login.ourBrickMethods')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg mr-3 mt-1">
                    <Ruler className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('login.precisionWork')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('login.precisionWorkDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3 mt-1">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('login.qualityStandards')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('login.qualityStandardsDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg mr-3 mt-1">
                    <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('login.efficientProcesses')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('login.efficientProcessesDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-lg mr-3 mt-1">
                    <Building className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('login.modernTechniques')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('login.modernTechniquesDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Construction Tutorials */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/30 dark:border-gray-700/30">
                <ConstructionTutorials />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      <VideoBackground videoSrc="/intro.mp4" playOnce={true} />
      
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-50">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-white/30 dark:border-gray-700/30">
          <div className="text-center mb-8">
            <img src="/brickwall.png" alt="BricksApp Logo" className="h-12 w-auto mx-auto mb-4 filter brightness-0 invert" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('app.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('app.subtitle')}</p>
          </div>

          {/* Login Type Selector */}
          <div className="mb-6">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setLoginType('management')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === 'management'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('login.managementTeam')}
              </button>
              <button
                onClick={() => setLoginType('bricklayer')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === 'bricklayer'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('login.bricklayers')}
              </button>
            </div>
          </div>

          {loginType === 'management' ? (
            /* Management Team Login */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.email')}
                </label>
                <div className="relative">
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder={t('login.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.password')}
                </label>
                <div className="relative">
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder={t('login.passwordPlaceholder')}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? t('login.loggingIn') : t('login.loginButton')}
              </button>
            </form>
          ) : (
            /* Bricklayer Login */
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t('login.bricklayerLoginDesc')}</p>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t('login.continueWithGoogle')}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t('login.or')}</span>
                </div>
              </div>

              <button
                onClick={() => setShowRecruitment(true)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {t('login.applyForJob')}
              </button>
            </div>
          )}

          {loginType === 'management' && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('login.demoAccounts')}</h3>
              <div className="space-y-2">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setEmail(account.email);
                      setPassword('password123');
                    }}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded border border-gray-200 dark:border-gray-600 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{account.email}</div>
                    <div className="text-gray-600 dark:text-gray-400">{account.role}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('login.demoPassword')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};