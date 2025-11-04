import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, CheckCircle, Info } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface AppTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const AppTutorial: React.FC<AppTutorialProps> = ({
  isOpen,
  onClose,
  currentPage,
  onPageChange
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to expatheros.nl!',
      description: 'This tutorial will guide you through the key features of our construction management platform. Let\'s get started!'
    },
    {
      id: 'theme-toggle',
      title: 'Dark/Light Theme',
      description: 'Toggle between dark and light themes using this button. The theme preference is saved automatically.',
      target: '.theme-toggle',
      position: 'bottom'
    },
    {
      id: 'language-switcher',
      title: 'Multi-Language Support',
      description: 'Switch between different languages. The app supports English and Dutch (Netherlands).',
      target: '.language-switcher',
      position: 'bottom'
    },
    {
      id: 'dashboard-overview',
      title: 'Dashboard Overview',
      description: 'Each role has a customized dashboard showing relevant information and quick actions.',
      action: () => onPageChange('dashboard')
    },
    {
      id: 'bricklayer-features',
      title: 'Bricklayer Features',
      description: 'As a bricklayer, you can view your assigned projects, track progress, and access construction tutorials.',
      action: () => onPageChange('dashboard')
    },
    {
      id: 'project-manager-features',
      title: 'Project Manager Features',
      description: 'Project managers can oversee all projects, manage team members, and track project timelines.',
      action: () => onPageChange('dashboard')
    },
    {
      id: 'recruiter-features',
      title: 'Recruiter Features',
      description: 'Recruiters can review applications, manage candidate profiles, and track recruitment progress.',
      action: () => onPageChange('dashboard')
    },
    {
      id: 'projects-page',
      title: 'Projects Management',
      description: 'View and manage all construction projects. Track progress, timelines, and team assignments.',
      action: () => onPageChange('projects')
    },
    {
      id: 'team-page',
      title: 'Team Management',
      description: 'Manage team members, view profiles, and assign roles to different projects.',
      action: () => onPageChange('team')
    },
    {
      id: 'applications-page',
      title: 'Applications Review',
      description: 'Review job applications, manage candidate profiles, and track recruitment status.',
      action: () => onPageChange('applications')
    },
    {
      id: 'construction-tutorials',
      title: 'Construction Tutorials',
      description: 'Access video tutorials and guides for various construction techniques and best practices.',
      action: () => onPageChange('dashboard')
    },
    {
      id: 'recruitment-form',
      title: 'Recruitment Process',
      description: 'New bricklayers can apply through our streamlined recruitment form with video introduction.',
      action: () => onPageChange('dashboard')
    },
    {
      id: 'responsive-design',
      title: 'Responsive Design',
      description: 'The app works seamlessly on desktop, tablet, and mobile devices for on-site access.',
    },
    {
      id: 'completion',
      title: 'Tutorial Complete!',
      description: 'You\'ve learned about all the key features of expatheros.nl. Start exploring and managing your construction projects efficiently!'
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      const nextStep = tutorialSteps[currentStep + 1];
      if (nextStep.action) {
        nextStep.action();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = tutorialSteps[currentStep - 1];
      if (prevStep.action) {
        prevStep.action();
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">App Tutorial</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step {currentStep + 1} of {tutorialSteps.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={togglePlayPause}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={handleRestart}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="text-center">
            <div className="mb-4">
              {currentStepData.id === 'completion' ? (
                <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg inline-block">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto" />
                </div>
              ) : (
                <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg inline-block">
                  <Info className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto" />
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {currentStepData.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          
          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={currentStep === tutorialSteps.length - 1 ? onClose : handleNext}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
            {currentStep < tutorialSteps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}; 