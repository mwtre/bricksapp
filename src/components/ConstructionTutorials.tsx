import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Ruler, Building, Shield, Hammer, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TutorialPhase {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  icon: React.ComponentType<any>;
  color: string;
}

export const ConstructionTutorials: React.FC = () => {
  const { t } = useLanguage();
  const [activePhase, setActivePhase] = useState<string>('measurement');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const phases: TutorialPhase[] = [
    {
      id: 'measurement',
      title: t('tutorials.measurement.title'),
      description: t('tutorials.measurement.description'),
      videoUrl: '/videos/measurement-phase.mp4',
      duration: '8:45',
      icon: Ruler,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'concrete-blocks',
      title: t('tutorials.concreteBlocks.title'),
      description: t('tutorials.concreteBlocks.description'),
      videoUrl: '/beton.mp4',
      duration: '12:30',
      icon: Building,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'isolation',
      title: t('tutorials.isolation.title'),
      description: t('tutorials.isolation.description'),
      videoUrl: '/videos/isolation-phase.mp4',
      duration: '10:15',
      icon: Shield,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'brickwork',
      title: t('tutorials.brickwork.title'),
      description: t('tutorials.brickwork.description'),
      videoUrl: '/videos/brickwork-phase.mp4',
      duration: '15:20',
      icon: Hammer,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const currentPhase = phases.find(phase => phase.id === activePhase);

  const handlePhaseChange = (phaseId: string) => {
    setActivePhase(phaseId);
    setIsPlaying(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Play className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
        {t('tutorials.title')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="bg-black rounded-lg overflow-hidden relative aspect-video">
            {/* Placeholder for video - replace with actual video component */}
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">{currentPhase?.title}</p>
                <p className="text-sm text-gray-400 mt-2">{t('tutorials.videoPlaceholder')}</p>
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <span className="text-sm">{currentPhase?.duration}</span>
                </div>
                <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Current Phase Info */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {currentPhase?.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {currentPhase?.description}
            </p>
          </div>
        </div>

        {/* Phase Navigation */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">
            {t('tutorials.phases')}
          </h3>
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <button
                key={phase.id}
                onClick={() => handlePhaseChange(phase.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  activePhase === phase.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${phase.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="ml-3">
                      <p className={`font-medium text-sm ${
                        activePhase === phase.id
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {phase.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {phase.duration}
                      </p>
                    </div>
                  </div>
                  {activePhase === phase.id && (
                    <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>{t('tutorials.progress')}</span>
          <span>{phases.findIndex(p => p.id === activePhase) + 1} / {phases.length}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((phases.findIndex(p => p.id === activePhase) + 1) / phases.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}; 