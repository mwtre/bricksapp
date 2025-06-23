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

function AppContent() {
  const { user } = useAuth();
  const { hasSelectedLanguage } = useLanguage();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const hasPlayedSound = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

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

  // Show language selection modal if language hasn't been selected
  if (!hasSelectedLanguage) {
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
    return <Login />;
  }

  const renderCurrentPage = () => {
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
            return <div>Invalid role</div>;
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
        return <div>Page not found</div>;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;