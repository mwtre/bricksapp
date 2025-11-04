import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { BricklayerDashboard } from './components/dashboards/BricklayerDashboard';
import { ProjectManagerDashboard } from './components/dashboards/ProjectManagerDashboard';
import { RecruiterDashboard } from './components/dashboards/RecruiterDashboard';
import { ProjectsPage } from './components/pages/ProjectsPage';
import { TeamPage } from './components/pages/TeamPage';
import { ApplicationsPage } from './components/pages/ApplicationsPage';
import { RecruitmentForm } from './components/RecruitmentForm';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';
import { Landing } from './components/LANDING/Landing';

function AppContent() {
  const { user } = useAuth();
  const { hasSelectedLanguage } = useLanguage();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const hasPlayedSound = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSeenLanding, setHasSeenLanding] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  console.log('AppContent: Rendering with user:', user, 'hasSelectedLanguage:', hasSelectedLanguage);

  const testSound = () => {
    const audio = new Audio('./bricksund.mp3');
    audio.volume = 0.5;
    audio.play().then(() => {
      console.log('Test sound played successfully');
    }).catch(err => {
      console.log('Test sound failed:', err);
    });
  };

  useEffect(() => {
    // Mark as initialized after a short delay to ensure context is ready
    const timer = setTimeout(() => {
      setIsInitialized(true);
      console.log('AppContent: Initialized');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isInitialized && hasSelectedLanguage && !hasPlayedSound.current) {
      const playSound = async () => {
        try {
          const audio = new Audio('./bricksund.mp3');
          audio.volume = 0.5; // Set volume to 50%
          
          // Try to play the audio
          const playPromise = audio.play();
          
          if (playPromise !== undefined) {
            await playPromise;
            console.log('Sound played successfully');
          }
        } catch (error) {
          console.log('Could not play sound automatically:', error);
          // If autoplay fails, we'll try again on the next user interaction
          const handleUserInteraction = () => {
            const audio = new Audio('./bricksund.mp3');
            audio.volume = 0.5;
            audio.play().catch(err => console.log('Still cannot play sound:', err));
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
  }, [hasSelectedLanguage, isInitialized]);

  // Show error if something went wrong
  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show landing page if showLanding is true
  if (showLanding) {
    console.log('AppContent: Showing landing page');
    const handleLandingContinue = () => {
      setHasSeenLanding(true);
      setShowLanding(false);
    };
    
    return <Landing onContinue={handleLandingContinue} />;
  }

  // Show language selection modal if language hasn't been selected
  if (!hasSelectedLanguage) {
    console.log('AppContent: Showing language selection modal');
    return (
      <div>
        <LanguageSelectionModal 
          isOpen={true} 
        />
        {/* Debug button */}
        <button 
          onClick={testSound}
          className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded z-[10000]"
        >
          Test Sound
        </button>
      </div>
    );
  }

  if (!user) {
    console.log('AppContent: Showing login page');
    return <Login onBackToLanding={() => setShowLanding(true)} />;
  }

  console.log('AppContent: Rendering dashboard for user:', user.role);

  const renderCurrentPage = () => {
    try {
      switch (currentPage) {
        case 'dashboard':
          switch (user.role) {
            case 'bricklayer':
              return <BricklayerDashboard />;
            case 'project_manager':
              return <ProjectManagerDashboard />;
            case 'recruiter':
              return <RecruiterDashboard />;
            default:
              return <div>Invalid role: {user.role}</div>;
          }
        case 'projects':
          return <ProjectsPage userRole={user.role} userId={user.id} />;
        case 'team':
          return <TeamPage />;
        case 'applications':
          return <ApplicationsPage />;
        case 'recruitment':
          return <RecruitmentForm />;
        default:
          return <div>Page not found: {currentPage}</div>;
      }
    } catch (err) {
      console.error('Error rendering page:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return <div>Error loading page</div>;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
}

function App() {
  console.log('App: Rendering main App component');
  
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;