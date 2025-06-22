import React, { useState } from 'react';
import { Grid, List, Maximize2, Minimize2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LiveCamera } from './LiveCamera';
import { mockProjects } from '../data/mockData';
import { Project } from '../types';

interface MultiCameraViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiCameraView: React.FC<MultiCameraViewProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [fullscreenCamera, setFullscreenCamera] = useState<string | null>(null);

  const managedProjects = mockProjects.filter((p: Project) => p.status === 'active');

  const handleToggleFullscreen = (projectId: string) => {
    setFullscreenCamera(fullscreenCamera === projectId ? null : projectId);
  };

  if (!isOpen) return null;

  if (fullscreenCamera) {
    const project = managedProjects.find(p => p.id === fullscreenCamera);
    if (!project) return null;

    return (
      <div className="fixed inset-0 bg-black z-[9999]">
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
          <button
            onClick={() => setFullscreenCamera(null)}
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
            title={t('camera.exitFullscreen')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <LiveCamera
          projectId={project.id}
          projectName={project.name}
          isFullscreen={true}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">{t('camera.multiCameraView')}</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLayout('grid')}
              className={`p-2 rounded-lg transition-colors ${
                layout === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title={t('camera.gridView')}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-2 rounded-lg transition-colors ${
                layout === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title={t('camera.listView')}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-300 text-sm">
            {managedProjects.length} {t('camera.activeCameras')}
          </span>
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
            title={t('common.close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="flex-1 p-4 overflow-auto">
        {managedProjects.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">📹</div>
              <h2 className="text-xl font-semibold mb-2">{t('camera.noActiveCameras')}</h2>
              <p>{t('camera.noActiveCamerasDesc')}</p>
            </div>
          </div>
        ) : (
          <div className={`grid gap-4 h-full ${
            layout === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {managedProjects.map((project) => (
              <div 
                key={project.id} 
                className={`bg-gray-800 rounded-lg overflow-hidden ${
                  layout === 'list' ? 'h-32' : 'aspect-video'
                }`}
              >
                <LiveCamera
                  projectId={project.id}
                  projectName={project.name}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 p-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span>{t('camera.lastUpdated')}: {new Date().toLocaleTimeString()}</span>
            <span>•</span>
            <span>{t('camera.totalProjects')}: {managedProjects.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>{t('camera.allSystemsOnline')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 