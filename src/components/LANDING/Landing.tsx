import React, { useState, useRef, useEffect } from 'react';
import { Users, TrendingUp, Globe, Heart, CheckCircle, MapPin, Music, ArrowRight, Euro, Briefcase, Award, Target, Zap, Menu, X } from 'lucide-react';
import CheeseJobCard from '../../JOBCARDS/CheeseJobCard';
import CourierJobCard from '../../JOBCARDS/CourierJobCard';
import ForkiftJobCard from '../../JOBCARDS/ForkiftJobCard';
import BricklayerJobCard from '../../JOBCARDS/BricklayerJobCard';
import WaitressJobCard from '../../JOBCARDS/WaitressJobCard';
import CEDriverJobCard from '../../JOBCARDS/CEDriverJobCard';
import BarEmployeeJobCard from '../../JOBCARDS/BarEmployeeJobCard';
import IndustrialCleanerJobCard from '../../JOBCARDS/IndustrialCleanerJobCard';
import SupermarketEmployeeJobCard from '../../JOBCARDS/SupermarketEmployeeJobCard';
import LineOperatorJobCard from '../../JOBCARDS/LineOperatorJobCard';
import ElectricianJobCard from '../../JOBCARDS/ElectricianJobCard';
import BikeMechanicJobCard from '../../JOBCARDS/BikeMechanicJobCard';

interface LandingProps {
  onContinue: () => void;
  onApply?: () => void;
}

type TabType = 'intro' | 'core' | 'jobs' | 'how-it-works' | 'stories';

export const Landing: React.FC<LandingProps> = ({ onContinue, onApply }) => {
  const [showVideo, setShowVideo] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [videoFadingOut, setVideoFadingOut] = useState(false);
  const [videoZooming, setVideoZooming] = useState(false);
  const [cardLoaded, setCardLoaded] = useState([false, false, false, false, false, false, false, false, false, false, false, false]);
  const [activeTab, setActiveTab] = useState<TabType>('intro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize header video
  useEffect(() => {
    const video = headerVideoRef.current;
    if (video) {
      video.playbackRate = 1.5;
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) {
      setTimeout(() => {
        setShowVideo(false);
        setShowGrid(true);
      }, 500);
      return;
    }

    let fallbackTimeout: NodeJS.Timeout;

    fallbackTimeout = setTimeout(() => {
      console.log('Video loading timeout - showing grid');
      setIsVideoLoading(false);
      setVideoError(true);
      setShowVideo(false);
      setShowGrid(true);
    }, 2000);

    const handleCanPlay = () => {
      clearTimeout(fallbackTimeout);
      setIsVideoLoading(false);
      video.playbackRate = 1.5;
      video.play().then(() => {
        video.muted = false;
      }).catch((error) => {
        console.log('Video autoplay prevented:', error);
        setTimeout(() => {
          setVideoFadingOut(true);
          setTimeout(() => {
            setShowVideo(false);
            setShowGrid(true);
          }, 500);
        }, 1000);
      });
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      clearTimeout(fallbackTimeout);
      setVideoError(true);
      setIsVideoLoading(false);
      setShowVideo(false);
      setShowGrid(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('error', handleError);

    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    return () => {
      clearTimeout(fallbackTimeout);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const handleVideoEnd = () => {
    setVideoZooming(true);
    setTimeout(() => {
      setVideoFadingOut(true);
      setTimeout(() => {
        setShowVideo(false);
        setShowGrid(true);
        triggerCardAnimations();
      }, 500);
    }, 600);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setVideoZooming(true);
      setTimeout(() => {
        setVideoFadingOut(true);
        setTimeout(() => {
          setShowVideo(false);
          setShowGrid(true);
          triggerCardAnimations();
        }, 500);
      }, 600);
    }
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setVideoZooming(true);
      setTimeout(() => {
        setVideoFadingOut(true);
        setTimeout(() => {
          setShowVideo(false);
          setShowGrid(true);
          triggerCardAnimations();
        }, 500);
      }, 600);
    }
  };

  const triggerCardAnimations = () => {
    setTimeout(() => setCardLoaded([true, false, false, false, false, false, false, false, false, false, false, false]), 100);
    setTimeout(() => setCardLoaded([true, true, false, false, false, false, false, false, false, false, false, false]), 250);
    setTimeout(() => setCardLoaded([true, true, true, false, false, false, false, false, false, false, false, false]), 400);
    setTimeout(() => setCardLoaded([true, true, true, true, false, false, false, false, false, false, false, false]), 550);
    setTimeout(() => setCardLoaded([true, true, true, true, true, false, false, false, false, false, false, false]), 700);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, false, false, false, false, false, false]), 850);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, true, false, false, false, false, false]), 1000);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, true, true, false, false, false, false]), 1150);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, true, true, true, false, false, false]), 1300);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, true, true, true, true, false, false]), 1450);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, true, true, true, true, true, false]), 1600);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, true, true, true, true, true, true]), 1750);
  };

  useEffect(() => {
    if (showGrid) {
      triggerCardAnimations();
    }
  }, [showGrid]);

  // Initialize intro video
  useEffect(() => {
    const video = introVideoRef.current;
    if (video && activeTab === 'intro') {
      // Try to play with sound first
      video.muted = false;
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Intro video playing with sound');
          })
          .catch((err) => {
            // If autoplay with sound fails, try muted
            console.log('Autoplay with sound prevented, trying muted:', err);
            video.muted = true;
            video.play().catch((mutedErr) => {
              console.log('Autoplay even muted failed:', mutedErr);
            });
          });
      }
    }
  }, [activeTab]);

  // Render Core Section - Infographic Style (Compact, All Info in One View)
  const renderCoreSection = () => (
    <div className="min-h-screen text-black relative bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}BG/bg1.png)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px',
          backgroundPosition: 'top left'
        }}
      ></div>
      <div className="relative z-10 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Compact Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-900">Build your future in The Netherlands</h1>
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Become an Expat Hero</h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <button
                onClick={onApply}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 transform flex items-center justify-center"
              >
                <Users className="mr-2 h-4 w-4" />
                Join as a Hero
              </button>
              <button
                onClick={onContinue}
                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 transform flex items-center justify-center"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Hire European Talent
              </button>
            </div>
          </div>

          {/* Main Infographic Grid - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Left Column - The Problem */}
            <div className="md:col-span-2 lg:col-span-1 space-y-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-0 shadow-lg border-2 border-blue-200 overflow-hidden">
                <div className="relative h-40 md:h-48 w-full">
                  <img 
                    src={`${import.meta.env.BASE_URL}core/core1.jpg`}
                    alt="The Challenge - 250K workers needed by 2028"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-4 md:p-5">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold text-lg">+250K</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Workers needed by 2028</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                      <Zap className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">4-6% annual growth</p>
                      <p className="text-gray-600 text-xs">in logistics, manufacturing & agri-food</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Globe className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">12M+ job-seekers</p>
                      <p className="text-gray-600 text-xs">ready to relocate across Europe</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Euro className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">+€40B annual value</p>
                      <p className="text-gray-600 text-xs">in EU labour markets</p>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>

            {/* Center Column - The Solution */}
            <div className="md:col-span-1 lg:col-span-1 space-y-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 text-green-600 mr-2" />
                  Why The Netherlands?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Euro className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">€45K–€55K/year</p>
                      <p className="text-gray-600 text-xs">Average salary (entry/mid-level)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">88% English-friendly</p>
                      <p className="text-gray-600 text-xs">Companies operate in English</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Top 5 European countries</p>
                      <p className="text-gray-600 text-xs">Quality of life & worker satisfaction</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Heart className="h-5 w-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">32-hour week pilots</p>
                      <p className="text-gray-600 text-xs">Flexible work culture</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  What Makes Us Special
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">90%+ retention rate at 12 months</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Multilingual recruiters + advisors</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Community-first approach</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Transparent payment model</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Built by & for internationals</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - How It Works */}
            <div className="md:col-span-1 lg:col-span-1 space-y-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 text-indigo-600 mr-2" />
                  For Candidates
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Completely free forever</p>
                      <p className="text-gray-600 text-xs">3,000+ successful relocations</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Full support</p>
                      <p className="text-gray-600 text-xs">Housing, admin, language, social</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Zero cost until results</p>
                      <p className="text-gray-600 text-xs">We earn only when you start</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                  For Companies
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Hire in 4-6 weeks</p>
                      <p className="text-gray-600 text-xs">5,000+ vetted candidates</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Pay after results</p>
                      <p className="text-gray-600 text-xs">Legal compliance included</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Zero risk upfront</p>
                      <p className="text-gray-600 text-xs">Only results</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <Music className="h-5 w-5 text-yellow-500 mr-2" />
                  Community
                </h3>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">Weekly Job Discovery Party</p>
                  <p className="text-xs text-gray-600">50+ expats, employers, DJs every Friday in Amsterdam</p>
                  <p className="text-sm font-semibold text-gray-900 mt-3">Street Recruitment</p>
                  <p className="text-xs text-gray-600">Dam Square • Centraal Station • Leidseplein</p>
                  <p className="text-xs text-gray-600">100+ candidates weekly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-6 text-center">
            <p className="text-lg md:text-xl font-bold text-blue-600 mb-4">
              You won't just find a job — you'll build a life here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onApply}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center"
              >
                <Zap className="mr-2 h-5 w-5" />
                Join as an Expat Hero
              </button>
              <button
                onClick={onContinue}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-base rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Hire European Talent Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Intro Section
  const renderIntroSection = () => (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}BG/bg1.png)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px',
          backgroundPosition: 'top left'
        }}
      ></div>
      <div className="relative z-10 w-full max-w-4xl">
        <video
          ref={introVideoRef}
          src={`${import.meta.env.BASE_URL}expatvideo.mp4`}
          className="w-full h-auto rounded-lg shadow-2xl"
          controls
          autoPlay
          playsInline
          onLoadedMetadata={() => {
            // Ensure sound is enabled when metadata loads
            if (introVideoRef.current) {
              introVideoRef.current.muted = false;
            }
          }}
          onEnded={() => {
            // Auto-navigate to "how it works" when video ends
            setActiveTab('how-it-works');
          }}
        />
      </div>
    </div>
  );

  // Render Jobs Section
  const renderJobsSection = () => (
    <div className="p-8 bg-white relative">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}BG/bg1.png)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px',
          backgroundPosition: 'top left'
        }}
      ></div>
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
          Explore Available Job Opportunities
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 items-stretch">
          {[
            <CourierJobCard key="courier" />,
            <CheeseJobCard key="cheese" />,
            <ForkiftJobCard key="forklift" />,
            <BricklayerJobCard key="bricklayer" />,
            <WaitressJobCard key="waitress" />,
            <CEDriverJobCard key="cedriver" />,
            <BarEmployeeJobCard key="bar" />,
            <IndustrialCleanerJobCard key="cleaner" />,
            <SupermarketEmployeeJobCard key="supermarket" />,
            <LineOperatorJobCard key="line" />,
            <ElectricianJobCard key="electrician" />,
            <BikeMechanicJobCard key="bikemechanic" />
          ].map((card, index) => (
            <div
              key={index}
              className={`transition-all duration-700 flex ${
                cardLoaded[index]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 0.15 + 0.1}s` }}
            >
              {card}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );

  // Render How It Works Section
  const renderHowItWorksSection = () => (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}BG/bg2.png)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px',
          backgroundPosition: 'top left'
        }}
      ></div>
      <div className="relative z-10">
      {/* Image Section - Show on mobile, background on desktop */}
      <div className="md:hidden w-full h-64 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}dance.png)`,
        }}
      ></div>
      
      <div 
        className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}dance.png)`,
        }}
      ></div>
      
      <div className="relative z-10 flex flex-col">
        <div className="hidden md:block flex-1 min-h-[60vh]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 pt-2 md:pt-0">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 drop-shadow-sm">
              🦸‍♀️ How It Works – Become an Expat Hero in 6 Steps!
            </h2>
            <p className="text-lg md:text-xl text-gray-800 font-semibold mb-4 drop-shadow-sm">
              ✨ Simple. Fun. Real.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Step 1 */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:scale-105 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform overflow-hidden">
              <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={`${import.meta.env.BASE_URL}step/step1.png`}
                  alt="Step 1"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-start mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  1
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Activate Your English</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Join our fun Activate English online class and get ready to communicate like a pro.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:scale-105 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform overflow-hidden">
              <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={`${import.meta.env.BASE_URL}step/step2.png`}
                  alt="Step 2"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-start mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  2
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Build Your Profile</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Share your experience, skills, and availability — we'll help you shine!
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:scale-105 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform overflow-hidden">
              <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={`${import.meta.env.BASE_URL}step/step3.png`}
                  alt="Step 3"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-start mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  3
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Get Your Hero Badge</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Complete your profile and earn your "Hero in Trial" badge. Now companies can see and contact you!
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:scale-105 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform overflow-hidden">
              <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={`${import.meta.env.BASE_URL}step/step4.png`}
                  alt="Step 4"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-start mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  4
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Apply or Get Discovered</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Apply for jobs yourself or wait to be selected by Dutch employers. Either way, opportunity finds you.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:scale-105 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform overflow-hidden">
              <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={`${import.meta.env.BASE_URL}step/step5.png`}
                  alt="Step 5"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-start mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  5
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Move to the Netherlands</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                We'll help you pack, travel, and settle in — housing, support, and a smooth start guaranteed.
              </p>
            </div>

            {/* Step 6 */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:scale-105 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform overflow-hidden">
              <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={`${import.meta.env.BASE_URL}step/step6.png`}
                  alt="Step 6"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-start mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  6
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Live the Hero Life</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Work, grow, and earn €28K–€50K/year. Then become a Hero Coach and help others start their journey too!
              </p>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl border-2 border-blue-200 inline-block max-w-2xl">
              <p className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                Start your journey today — become the next Expat Hero!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-base md:text-lg px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  Explore Jobs
                </button>
                <button
                  onClick={onContinue}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base md:text-lg px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  Get Started Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );

  // Render Success Stories Section
  const renderStoriesSection = () => {
    const stories = [
      {
        emoji: '🧱',
        name: 'Marco',
        title: 'From Italy to the Netherlands as a Bricklayer',
        quote: '"In Italy, I worked hard as a bricklayer but never earned more than €1,800 a month. With Expat Heroes, I moved to the Netherlands and now I make around €45,000 a year, including bonuses and benefits. The work is organized, the tools are modern, and I finally have time (and money!) to enjoy weekends again."',
        color: 'from-red-50 to-orange-50',
        borderColor: 'border-red-200'
      },
      {
        emoji: '🚚',
        name: 'Ana',
        title: 'From Portugal to the Netherlands as a Truck Driver',
        quote: '"Back home, I was driving long routes for little pay. Expat Heroes helped me find a stable job in retail distribution — now I earn €3,200 a month, work modern trucks, and have my weekends free. I even got help finding a nice apartment near my route!"',
        color: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-200'
      },
      {
        emoji: '🧹',
        name: 'Daniel',
        title: 'Industrial Cleaner from Romania',
        quote: '"I used to think cleaning was just a job, but in the Netherlands, it became a career. I started at €2,700 a month and quickly moved up with training. The housing and support from Expat Heroes made everything easy — now I\'m saving money and studying Dutch!"',
        color: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-200'
      },
      {
        emoji: '🍳',
        name: 'Lucía',
        title: 'From Spain to Amsterdam as a Bar Employee',
        quote: '"Working in hospitality in Spain was fun but unstable. Through Expat Heroes, I found a full-time job in a beautiful hotel bar in Amsterdam. I earn €2,600 a month, and I get to meet people from all over the world — it\'s the life I dreamed of."',
        color: 'from-purple-50 to-pink-50',
        borderColor: 'border-purple-200'
      },
      {
        emoji: '⚙️',
        name: 'Tomasz',
        title: 'From Poland to Urk as a Production Line Operator',
        quote: '"I joined the Expat Heroes program and started as a line operator in food production. I earn around €2,900 a month, and I already got promoted to team leader! The training and housing made everything so smooth — now I\'m helping my brother apply too."',
        color: 'from-amber-50 to-yellow-50',
        borderColor: 'border-amber-200'
      }
    ];

    return (
      <div className="p-8 bg-white relative">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}BG/bg1.png)`,
            backgroundRepeat: 'repeat',
            backgroundSize: '300px',
            backgroundPosition: 'top left'
          }}
        ></div>
        <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              🌟 Stories of Success
            </h2>
            <p className="text-lg text-gray-700">
              Real stories from real heroes who changed their lives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${story.color} rounded-2xl p-6 border-2 ${story.borderColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className="text-5xl mb-4">{story.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{story.name}</h3>
                <p className="text-sm text-gray-600 mb-4 font-medium">{story.title}</p>
                <p className="text-gray-700 leading-relaxed italic">{story.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}BG/bg1.png)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px',
          backgroundPosition: 'top left'
        }}
      ></div>
      <div className="relative z-10">
      {/* Initial Video */}
      {showVideo && (
        <div 
          className={`fixed inset-0 bg-black flex items-center justify-center z-50 cursor-pointer transition-opacity duration-500 ${
            videoFadingOut ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleVideoClick}
        >
          {isVideoLoading && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10 animate-fadeIn">
              <div className="text-white text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-lg font-light tracking-wider">LOADING...</p>
                <div className="mt-4 w-32 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
                  <div className="h-full bg-white rounded-full animate-[loadingBar_2s_ease-in-out_infinite]"></div>
                </div>
              </div>
            </div>
          )}
          
          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="text-white text-center">
                <p className="text-lg mb-4">Video not available</p>
                <button
                  onClick={handleSkip}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            src={`${import.meta.env.BASE_URL}logo.mp4`}
            className={`transition-all duration-500 ${
              isVideoLoading 
                ? 'opacity-0 scale-95' 
                : videoZooming 
                  ? 'opacity-100 scale-110' 
                  : videoFadingOut 
                    ? 'opacity-0 scale-110' 
                    : 'opacity-100 scale-100'
            }`}
            style={{ 
              display: videoError ? 'none' : 'block',
              width: '100vw',
              height: '100vh',
              objectFit: 'contain'
            }}
            onEnded={handleVideoEnd}
            playsInline
            muted
            autoPlay
            preload="auto"
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.playbackRate = 1.5;
              }
            }}
          />
          {!isVideoLoading && !videoError && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors z-20"
            >
              Skip
            </button>
          )}
        </div>
      )}

      {/* Main Content with Header */}
      {showGrid && (
        <div className="min-h-screen animate-fadeIn">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white border-b-2 border-gray-300 shadow-sm">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <div className="flex items-center justify-between h-16 md:h-20 py-2">
                {/* Logo on Left */}
                <div className="flex items-center flex-shrink-0">
                  <video 
                    ref={headerVideoRef}
                    src={`${import.meta.env.BASE_URL}logo.mp4`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-8 sm:h-10 md:h-16 w-auto"
                  />
                </div>

                {/* Desktop Navigation Tabs */}
                <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-wrap">
                  <button
                    onClick={() => setActiveTab('intro')}
                    className={`px-2 xl:px-4 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'intro'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    INTRO
                  </button>
                  <button
                    onClick={() => setActiveTab('core')}
                    className={`px-2 xl:px-4 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'core'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    CORE
                  </button>
                  <button
                    onClick={() => setActiveTab('how-it-works')}
                    className={`px-2 xl:px-4 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'how-it-works'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    HOW IT WORKS
                  </button>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-2 xl:px-4 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'jobs'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    JOBS
                  </button>
                  <button
                    onClick={() => setActiveTab('stories')}
                    className={`px-2 xl:px-4 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'stories'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    STORY OF SUCCESS
                  </button>
                  {onApply && (
                    <button
                      onClick={onApply}
                      className="px-2 xl:px-4 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 shadow-md whitespace-nowrap"
                    >
                      APPLY
                    </button>
                  )}
                  <button
      onClick={onContinue}
                    className="px-2 xl:px-4 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 bg-green-600 text-white hover:bg-green-700 shadow-md whitespace-nowrap"
                  >
                    LOGIN
                  </button>
                </nav>

                {/* Mobile Navigation */}
                <div className="flex lg:hidden items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-all duration-200"
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Menu Dropdown */}
              {mobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-200 bg-white">
                  <nav className="flex flex-col py-2 space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('intro');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 text-left rounded-lg font-semibold transition-all duration-200 ${
                        activeTab === 'intro'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      INTRO
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('core');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 text-left rounded-lg font-semibold transition-all duration-200 ${
                        activeTab === 'core'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      CORE
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('how-it-works');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 text-left rounded-lg font-semibold transition-all duration-200 ${
                        activeTab === 'how-it-works'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      HOW IT WORKS
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('jobs');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 text-left rounded-lg font-semibold transition-all duration-200 ${
                        activeTab === 'jobs'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      JOBS
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('stories');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 text-left rounded-lg font-semibold transition-all duration-200 ${
                        activeTab === 'stories'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      STORY OF SUCCESS
                    </button>
                    {onApply && (
                      <button
                        onClick={() => {
                          onApply();
                          setMobileMenuOpen(false);
                        }}
                        className="px-4 py-2 text-left rounded-lg font-semibold transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700"
                      >
                        APPLY
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onContinue();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 text-left rounded-lg font-semibold transition-all duration-200 bg-green-600 text-white hover:bg-green-700"
                    >
                      LOGIN
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </header>

          {/* Content Sections */}
          <div className="min-h-[calc(100vh-5rem)]">
            {activeTab === 'intro' && renderIntroSection()}
            {activeTab === 'core' && renderCoreSection()}
            {activeTab === 'jobs' && renderJobsSection()}
            {activeTab === 'how-it-works' && renderHowItWorksSection()}
            {activeTab === 'stories' && renderStoriesSection()}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
