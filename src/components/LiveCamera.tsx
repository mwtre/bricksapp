import React, { useState } from 'react';

interface LiveCameraProps {
  projectId: string;
  projectName: string;
  isFullscreen?: boolean;
}

export const LiveCamera: React.FC<LiveCameraProps> = ({ 
  projectId, 
  projectName, 
  isFullscreen = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Video sources for different projects - simulating real security camera feeds
  const getVideoSource = (projectId: string) => {
    const videoSources = {
      '1': 'https://streamable.com/e/q4a79a?autoplay=1&loop=1&controls=0', // Københavns Nye Boligkompleks - user's video
      '2': 'https://streamable.com/e/hwsh2z?autoplay=1&loop=1&controls=0', // Aarhus Kontorhus - user's video
      '3': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Odense Skole Renovering
    };
    const source = videoSources[projectId as keyof typeof videoSources] || videoSources['1'];
    console.log(`Loading video for project ${projectId}:`, source);
    return source;
  };

  const isStreamableVideo = (projectId: string) => {
    return projectId === '1' || projectId === '2';
  };

  const handleVideoLoad = () => {
    console.log(`Video loaded successfully for project ${projectId}`);
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoError = (error: any) => {
    console.error(`Video error for project ${projectId}:`, error);
    console.error('Error details:', error.target?.error || error);
    setIsLoading(false);
    setHasError(true);
  };

  const handleVideoCanPlay = () => {
    console.log(`Video can play for project ${projectId}`);
  };

  return (
    <div className={`bg-black rounded-lg overflow-hidden h-full ${isFullscreen ? 'fixed inset-0 z-50' : 'relative'}`}>
      {/* Security Camera Header Overlay */}
      <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-2 z-10">
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-mono font-bold">{projectName.toUpperCase()}</span>
            <span className="bg-red-600 px-1 rounded text-[10px] font-bold">LIVE</span>
          </div>
          <div className="flex items-center space-x-3 font-mono text-[10px]">
            <span>CAM {projectId}</span>
            <span>{new Date().toLocaleTimeString('en-US', { 
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</span>
            <span>{new Date().toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            })}</span>
          </div>
        </div>
      </div>

      {/* Video Container - Full Coverage */}
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-xs font-mono">INITIALIZING CAMERA...</p>
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">📹</div>
              <p className="text-xs font-mono mb-1">CAMERA OFFLINE</p>
              <p className="text-[10px] text-gray-400 font-mono">CAM {projectId} - {projectName}</p>
            </div>
          </div>
        )}
        
        {isStreamableVideo(projectId) ? (
          <iframe
            src={getVideoSource(projectId)}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media"
            onLoad={handleVideoLoad}
            onError={handleVideoError}
            style={{ 
              display: isLoading || hasError ? 'none' : 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
              zIndex: 1,
              transform: 'scale(1.4)'
            }}
          />
        ) : (
          <video
            src={getVideoSource(projectId)}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            onCanPlay={handleVideoCanPlay}
            style={{ display: isLoading || hasError ? 'none' : 'block' }}
          />
        )}
      </div>

      {/* Security Camera Footer Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-2 z-10">
        <div className="flex items-center justify-between text-white text-[10px] font-mono">
          <div className="flex items-center space-x-3">
            <span>REC</span>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>HD</span>
            <span>1080P</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>BRICKSAPP SECURITY</span>
            <span>•</span>
            <span>CONSTRUCTION SITE {projectId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 