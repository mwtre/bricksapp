import React, { useState, useEffect, useRef } from 'react';
import { Building, Mail, Lock, AlertCircle, UserPlus, Info, ArrowRight, Hammer, Ruler, Shield, Clock, HelpCircle, RotateCcw, Users, Star, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { RecruitmentForm } from './RecruitmentForm';
import { ConstructionTutorials } from './ConstructionTutorials';
import { VideoBackground } from './VideoBackground';
import { AppTutorial } from './AppTutorial';
import RecruitmentPortal from './RecruitmentPortal';

interface LoginProps {
  onBackToLanding?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRecruitment, setShowRecruitment] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showRecruitmentPortal, setShowRecruitmentPortal] = useState(false);
  const [loginType, setLoginType] = useState<'company' | 'heroes' | 'database'>('company');
  const { login, googleLogin, isLoading } = useAuth();
  const { t, setHasSelectedLanguage } = useLanguage();
  const hasPlayedSound = useRef(false);

  // Play sound when component mounts
  useEffect(() => {
    if (!hasPlayedSound.current) {
      const playSound = async () => {
        try {
          const audio = new Audio('./bricksund.mp3');
          audio.volume = 0.5;
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            await playPromise;
            console.log('Login sound played successfully');
          }
        } catch (error) {
          console.log('Could not play login sound automatically:', error);
          // If autoplay fails, try on first user interaction
          const handleUserInteraction = () => {
            const audio = new Audio('./bricksund.mp3');
            audio.volume = 0.5;
            audio.play().catch(err => console.log('Still cannot play login sound:', err));
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
          };
          
          document.addEventListener('click', handleUserInteraction);
          document.addEventListener('keydown', handleUserInteraction);
        }
      };
      
      playSound();
      hasPlayedSound.current = true;
    }
  }, []);

  const resetLanguageSelection = () => {
    localStorage.removeItem('expatheros-language-selected');
    setHasSelectedLanguage(false);
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError(t('login.invalidCredentials'));
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const success = await googleLogin();
    if (!success) {
      setError(t('login.googleLoginFailed'));
    }
  };

  const demoAccounts = [
    { email: 'lars@expatheros.nl', role: 'Company' },
    { email: 'mette@expatheros.nl', role: 'Heroes' },
    { email: 'anne@expatheros.nl', role: t('role.recruiter') }
  ];

  if (showRecruitment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        <VideoBackground videoSrc="/intro.mp4" playOnce={true} />
        
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-50">
          <button
            onClick={() => setShowTutorial(true)}
            className="flex items-center text-sm text-white hover:text-gray-200 transition-colors bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg"
            title="App Tutorial"
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            Tutorial
          </button>
          <button
            onClick={resetLanguageSelection}
            className="flex items-center text-sm text-white hover:text-gray-200 transition-colors bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg"
            title="Reset Language Selection (for testing)"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset Lang
          </button>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        
        <div className="max-w-7xl mx-auto p-4 relative z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                  <img 
                    src={`${import.meta.env.BASE_URL}expat%20hero.jpeg`}
                    alt="Expat Hero"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Recruitment Form - Full Width at Top */}
            <div className="lg:col-span-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/30 dark:border-gray-700/30">
              <RecruitmentForm onApplicationSubmitted={() => {
                // Force a refresh of the applications data
                console.log('New application submitted - dashboard will refresh');
              }} />
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

        {/* Tutorial Modal */}
        <AppTutorial
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
          currentPage="login"
          onPageChange={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-50">
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
            title="Back to Landing Page"
          >
            <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
            Back to Landing
          </button>
        )}
        <button
          onClick={() => setShowTutorial(true)}
          className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-lg"
          title="App Tutorial"
        >
          <HelpCircle className="h-4 w-4 mr-1" />
          Tutorial
        </button>
        <button
          onClick={resetLanguageSelection}
          className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-lg"
          title="Reset Language Selection (for testing)"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset Lang
        </button>
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                  <img 
                    src={`${import.meta.env.BASE_URL}expat%20hero.jpeg`}
                    alt="Expat Hero"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Login Type Selector */}
          <div className="mb-6">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setLoginType('company')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === 'company'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Company Login
              </button>
              <button
                onClick={() => setLoginType('heroes')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === 'heroes'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Heroes Login
              </button>
              <button
                onClick={() => setLoginType('database')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === 'database'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Users className="h-4 w-4 mr-1 inline" />
                Access Heroes Database
              </button>
            </div>
          </div>

          {loginType === 'company' ? (
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
          ) : loginType === 'database' ? (
            /* Access Heroes Database */
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Access Heroes Database</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Browse available construction professionals and connect with skilled workers
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Available Workers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    View profiles of skilled bricklayers, tilers, and construction professionals
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>4.7+ average rating</span>
                    <span className="mx-2">•</span>
                    <span>Verified professionals</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Advanced Filtering</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Filter by skills, location, availability, and experience level
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-1 text-green-500" />
                    <span>Multiple locations</span>
                    <span className="mx-2">•</span>
                    <span>Real-time availability</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowRecruitmentPortal(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
              >
                <Users className="h-5 w-5 mr-2" />
                Open Heroes Database
              </button>
            </div>
          ) : (
            /* Heroes Login */
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

          {loginType === 'company' && (
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

      {/* Tutorial Modal */}
      <AppTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        currentPage="login"
        onPageChange={() => {}}
      />

      {/* Recruitment Portal Modal */}
      <RecruitmentPortal
        isOpen={showRecruitmentPortal}
        onClose={() => setShowRecruitmentPortal(false)}
      />
    </div>
  );
};