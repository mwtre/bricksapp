import React, { useState, useRef, useEffect } from 'react';
import { Users, TrendingUp, Globe, Heart, CheckCircle, MapPin, Music, ArrowRight, Euro, Briefcase, Award, Target, Zap } from 'lucide-react';
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
  const [cardLoaded, setCardLoaded] = useState([false, false, false, false, false, false, false, false, false, false, false]);
  const [activeTab, setActiveTab] = useState<TabType>('intro');
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
    setTimeout(() => setCardLoaded([true, false, false, false, false, false, false, false, false, false, false]), 100);
    setTimeout(() => setCardLoaded([true, true, false, false, false, false, false, false, false, false, false]), 250);
    setTimeout(() => setCardLoaded([true, true, true, false, false, false, false, false, false, false, false]), 400);
    setTimeout(() => setCardLoaded([true, true, true, true, false, false, false, false, false, false, false]), 550);
    setTimeout(() => setCardLoaded([true, true, true, true, true, false, false, false, false, false, false]), 700);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, false, false, false, false, false]), 850);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, true, false, false, false, false]), 1000);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, true, true, false, false, false]), 1150);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, true, true, true, false, false]), 1300);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, true, true, true, true, false]), 1450);
    setTimeout(() => setCardLoaded([true, true, true, true, true, true, true, true, true, true, true]), 1600);
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

  // Render Core Section
  const renderCoreSection = () => (
    <div className="min-h-screen bg-white text-black relative">
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
      {/* Hero Banner */}
      <div className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black">
              Build your future in The Netherlands
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold mb-8 text-gray-800">
              Become an Expat Hero
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
                For candidates: Launch your career abroad with support, zero cost.
              </p>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
                For companies: Access talented European workforce, pay only for results.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onApply}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center"
              >
                <Users className="mr-2 h-5 w-5" />
                Join as a Hero
              </button>
              <button
                onClick={onContinue}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center"
              >
                <Briefcase className="mr-2 h-5 w-5" />
                Hire European Talent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Why this project exists */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Why this project exists</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              🇳🇱 The Netherlands needs talent — and you can be it.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <TrendingUp className="h-10 w-10 text-blue-400 mb-3" />
              <h3 className="text-2xl font-bold text-blue-400 mb-2">+250,000</h3>
              <p className="text-gray-300">Workers needed by 2028</p>
            </div>
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <Zap className="h-10 w-10 text-green-400 mb-3" />
              <h3 className="text-2xl font-bold text-green-400 mb-2">4-6%</h3>
              <p className="text-gray-300">Annual growth in logistics, manufacturing & agri-food</p>
            </div>
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <Globe className="h-10 w-10 text-yellow-400 mb-3" />
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">12M+</h3>
              <p className="text-gray-300">Job-seekers ready to relocate across Europe</p>
            </div>
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <Euro className="h-10 w-10 text-purple-400 mb-3" />
              <h3 className="text-2xl font-bold text-purple-400 mb-2">+€40B</h3>
              <p className="text-gray-300">Annual value in EU labour markets</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              Expat Heroes NL bridges that gap: mobilising talent, fuelling growth, strengthening diversity.
              <br />
              <span className="text-blue-600 font-semibold">We believe migration isn't just movement — it's opportunity, innovation, community.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Why become an Expat Hero */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Why become an Expat Hero?</h2>
            <p className="text-xl text-gray-700">🇳🇱 Why move to The Netherlands?</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <Euro className="h-10 w-10 text-yellow-300 mb-3" />
              <h3 className="text-xl font-bold mb-2">€45,000–€55,000/year</h3>
              <p className="text-gray-300">Average salary in key sectors (entry/mid-level) with overtime</p>
            </div>
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <Globe className="h-10 w-10 text-blue-300 mb-3" />
              <h3 className="text-xl font-bold mb-2">88%</h3>
              <p className="text-gray-300">Companies operate in English-friendly environments</p>
            </div>
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <Award className="h-10 w-10 text-yellow-300 mb-3" />
              <h3 className="text-xl font-bold mb-2">Top 5</h3>
              <p className="text-gray-300">European countries for quality of life and worker satisfaction</p>
            </div>
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <Heart className="h-10 w-10 text-pink-300 mb-3" />
              <h3 className="text-xl font-bold mb-2">32-hour week</h3>
              <p className="text-gray-300">Flexible work culture, generous holiday & parental leave</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl text-blue-600 font-semibold">
              You're not just changing location — you're upgrading your life.
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">How it works</h2>
          
          {/* For Candidates */}
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black">For candidates</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/90 rounded-lg p-6 text-white">
                <div className="flex items-start mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Completely free for you, forever</h4>
                    <p className="text-gray-300">Apply → relocate → integrate → grow.</p>
                    <p className="text-gray-400 text-sm mt-2">Over 3,000 successful relocations facilitated so far.</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/90 rounded-lg p-6 text-white">
                <div className="flex items-start mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Regular support</h4>
                    <p className="text-gray-300">Housing, admin, language and social onboarding.</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/90 rounded-lg p-6 text-white">
                <div className="flex items-start mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">We earn only when you start</h4>
                    <p className="text-gray-300">No placement fee for you. Zero cost until results.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* For Companies */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black">For companies</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/90 rounded-lg p-6 text-white">
                <div className="flex items-start mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Hire in 4-6 weeks</h4>
                    <p className="text-gray-300">Access to a vetted pool of over 5,000 candidates across Europe.</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/90 rounded-lg p-6 text-white">
                <div className="flex items-start mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Pay only after results</h4>
                    <p className="text-gray-300">Legal compliance, integration support & culture training included.</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/90 rounded-lg p-6 text-white">
                <div className="flex items-start mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Zero risk upfront</h4>
                    <p className="text-gray-300">Only results.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community & Culture */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">Community & Culture</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <Music className="h-10 w-10 text-yellow-300 mr-3" />
                <h3 className="text-2xl font-bold">Weekly Job Discovery Party in Amsterdam</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Every Friday we host our vibrant Hero Meetup — 50+ expats, employers, DJs, Dutch culture, drinks & jobs.
              </p>
              <p className="text-blue-300 font-semibold">Network. Discover. Belong.</p>
            </div>
            
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <MapPin className="h-10 w-10 text-pink-300 mr-3" />
                <h3 className="text-2xl font-bold">Street Recruitment in Amsterdam</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Look for us every week at:
              </p>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-400" />
                  Dam Square
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-400" />
                  Centraal Station
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-400" />
                  Leidseplein
                </li>
              </ul>
              <p className="text-gray-300">
                Talking to 100+ candidates weekly, sharing opportunities & Dutch culture.
              </p>
              <p className="text-pink-300 font-semibold mt-2">We're bold. We're human. We're about real connections.</p>
            </div>
          </div>
        </div>
      </div>

      {/* What makes Expat Heroes special */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">What makes Expat Heroes special</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <Target className="h-10 w-10 text-green-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">90%+ retention rate</h3>
              <p className="text-gray-300">At 12 months among our placed candidates</p>
            </div>
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <Users className="h-10 w-10 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Multilingual team</h3>
              <p className="text-gray-300">Recruiters + relocation advisors operating locally</p>
            </div>
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <Heart className="h-10 w-10 text-pink-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Community-first</h3>
              <p className="text-gray-300">Life support not just job placement</p>
            </div>
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <Euro className="h-10 w-10 text-yellow-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Transparent payment</h3>
              <p className="text-gray-300">You're in control</p>
            </div>
            <div className="bg-black/90 rounded-lg p-6 text-white">
              <Globe className="h-10 w-10 text-purple-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Built by internationals</h3>
              <p className="text-gray-300">For internationals</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">
              You won't just find a job — you'll build a life here.
            </p>
            <p className="text-xl text-gray-700">
              Because you belong. Because you matter.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">Ready to become a Hero?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onApply}
              className="px-8 py-4 bg-black text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center"
            >
              <Zap className="mr-2 h-5 w-5" />
              Join as an Expat Hero
            </button>
            <button
              onClick={onContinue}
              className="px-8 py-4 bg-black text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center"
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
            <ElectricianJobCard key="electrician" />
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
    <div className="relative min-h-screen bg-white">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}BG/bg2.png)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px',
          backgroundPosition: 'top left'
        }}
      ></div>
      <div className="relative z-10">
      {/* Image Section - Show on mobile, background on desktop */}
      <div className="md:hidden w-full h-64 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}dance.png)`,
        }}
      ></div>
      
      <div 
        className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}dance.png)`,
        }}
      ></div>
      
      <div className="relative z-10 flex flex-col">
        <div className="hidden md:block flex-1 min-h-[60vh]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 pt-2 md:pt-0">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
              🦸‍♀️ How It Works – Become an Expat Hero in 6 Steps!
            </h2>
            <p className="text-lg md:text-xl text-gray-700 font-semibold mb-4">
              ✨ Simple. Fun. Real.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Step 1 */}
            <div className="bg-black/90 rounded-lg p-6 text-white shadow-xl hover:scale-105 transition-all duration-300 transform overflow-hidden">
              <div className="mb-4 rounded-lg overflow-hidden">
                <img 
                  src={`${import.meta.env.BASE_URL}step/step1.png`}
                  alt="Step 1"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-start mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Activate Your English</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Join our fun Activate English online class and get ready to communicate like a pro.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-black/90 rounded-lg p-6 text-white shadow-xl hover:scale-105 transition-all duration-300 transform overflow-hidden">
              <div className="mb-4 rounded-lg overflow-hidden">
                <img 
                  src={`${import.meta.env.BASE_URL}step/step2.png`}
                  alt="Step 2"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-start mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Build Your Profile</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Share your experience, skills, and availability — we'll help you shine!
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-black/90 rounded-lg p-6 text-white shadow-xl hover:scale-105 transition-all duration-300 transform overflow-hidden">
              <div className="mb-4 rounded-lg overflow-hidden">
                <img 
                  src={`${import.meta.env.BASE_URL}step/step3.png`}
                  alt="Step 3"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-start mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Get Your Hero Badge</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Complete your profile and earn your "Hero in Trial" badge. Now companies can see and contact you!
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-black/90 rounded-lg p-6 text-white shadow-xl hover:scale-105 transition-all duration-300 transform overflow-hidden">
              <div className="mb-4 rounded-lg overflow-hidden">
                <img 
                  src={`${import.meta.env.BASE_URL}step/step4.png`}
                  alt="Step 4"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-start mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  4
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Apply or Get Discovered</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Apply for jobs yourself or wait to be selected by Dutch employers. Either way, opportunity finds you.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-black/90 rounded-lg p-6 text-white shadow-xl hover:scale-105 transition-all duration-300 transform overflow-hidden">
              <div className="mb-4 rounded-lg overflow-hidden">
                <img 
                  src={`${import.meta.env.BASE_URL}step/step5.png`}
                  alt="Step 5"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-start mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  5
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Move to the Netherlands</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                We'll help you pack, travel, and settle in — housing, support, and a smooth start guaranteed.
              </p>
            </div>

            {/* Step 6 */}
            <div className="bg-black/90 rounded-lg p-6 text-white shadow-xl hover:scale-105 transition-all duration-300 transform overflow-hidden">
              <div className="mb-4 rounded-lg overflow-hidden">
                <img 
                  src={`${import.meta.env.BASE_URL}step/step6.png`}
                  alt="Step 6"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-start mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  6
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Live the Hero Life</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Work, grow, and earn €28K–€50K/year. Then become a Hero Coach and help others start their journey too!
              </p>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="bg-black/90 rounded-lg p-6 text-white shadow-xl inline-block">
              <p className="text-xl md:text-2xl font-bold mb-4">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                {/* Logo on Left */}
                <div className="flex items-center">
                  <video 
                    ref={headerVideoRef}
                    src={`${import.meta.env.BASE_URL}logo.mp4`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-12 md:h-16 w-auto"
                  />
                </div>

                {/* Navigation Tabs */}
                <nav className="flex items-center space-x-1 md:space-x-4">
                  <button
                    onClick={() => setActiveTab('intro')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === 'intro'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    INTRO
                  </button>
                  <button
                    onClick={() => setActiveTab('core')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === 'core'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    CORE
                  </button>
                  <button
                    onClick={() => setActiveTab('how-it-works')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === 'how-it-works'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    HOW IT WORKS
                  </button>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === 'jobs'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    JOBS
                  </button>
                  <button
                    onClick={() => setActiveTab('stories')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
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
                      className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    >
                      APPLY
                    </button>
                  )}
                  <button
      onClick={onContinue}
                    className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-green-600 text-white hover:bg-green-700 shadow-md"
                  >
                    LOGIN
                  </button>
                </nav>
              </div>
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
