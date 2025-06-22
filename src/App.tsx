import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { BricklayerDashboard } from './components/dashboards/BricklayerDashboard';
import { ProjectManagerDashboard } from './components/dashboards/ProjectManagerDashboard';
import { RecruiterDashboard } from './components/dashboards/RecruiterDashboard';
import { ProjectsPage } from './components/pages/ProjectsPage';
import { TeamPage } from './components/pages/TeamPage';
import { ApplicationsPage } from './components/pages/ApplicationsPage';
import { RecruitmentForm } from './components/RecruitmentForm';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

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