import React, { useState } from 'react';
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
  const { hasSelectedLanguage, setHasSelectedLanguage } = useLanguage();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Show language selection modal if language hasn't been selected
  if (!hasSelectedLanguage) {
    return (
      <LanguageSelectionModal 
        isOpen={true} 
      />
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