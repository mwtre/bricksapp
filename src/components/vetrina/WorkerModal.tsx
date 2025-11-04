import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { Worker } from '../data/workers';

interface WorkerModalProps {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
}

const WorkerModal: React.FC<WorkerModalProps> = ({ worker, isOpen, onClose }) => {
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');

  if (!isOpen || !worker) return null;

  const nextPortfolioItem = () => {
    setCurrentPortfolioIndex((prev) => 
      prev === worker.portfolio.length - 1 ? 0 : prev + 1
    );
  };

  const prevPortfolioItem = () => {
    setCurrentPortfolioIndex((prev) => 
      prev === 0 ? worker.portfolio.length - 1 : prev - 1
    );
  };

  const getSkillColor = (level: number) => {
    if (level >= 90) return 'bg-green-500';
    if (level >= 70) return 'bg-blue-500';
    if (level >= 50) return 'bg-yellow-500';
    if (level >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const mockReviews = [
    {
      id: '1',
      client: 'Metro Construction Corp',
      rating: 5,
      comment: 'Exceptional work on our downtown project. Marco\'s attention to detail and professionalism exceeded our expectations.',
      date: '2024-01-20',
      project: 'Downtown Office Complex'
    },
    {
      id: '2',
      client: 'Elite Homes LLC',
      rating: 5,
      comment: 'Outstanding craftsmanship and reliability. Delivered the luxury villa project on time and within budget.',
      date: '2023-11-25',
      project: 'Luxury Residential Villa'
    },
    {
      id: '3',
      client: 'Heritage Restoration Inc',
      rating: 4,
      comment: 'Great expertise in historic restoration techniques. Very knowledgeable about period-appropriate methods.',
      date: '2023-09-15',
      project: 'Historic Building Restoration'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex items-start gap-6">
            <img
              src={worker.photo}
              alt={worker.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{worker.name}</h1>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center">
                  <MapPin size={18} className="mr-2" />
                  <span>{worker.location}</span>
                </div>
                <div className="flex items-center">
                  <Star size={18} className="mr-2 fill-current" />
                  <span className="font-semibold">{worker.rating}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase size={18} className="mr-2" />
                  <span>{worker.completedProjects} projects</span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-2" />
                  <span>{worker.yearsExperience} years exp.</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <DollarSign size={16} className="mr-1" />
                  <span className="font-semibold">$45-65/hr</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  worker.availability.status === 'available' 
                    ? 'bg-green-900/50 text-green-300 border border-green-700' 
                    : worker.availability.status === 'busy'
                    ? 'bg-red-900/50 text-red-300 border border-red-700'
                    : 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
                }`}>
                  {worker.availability.status === 'available' ? 'Available Now' : 
                   worker.availability.status === 'busy' ? 'Busy' : 'Partially Available'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 bg-gray-800">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: Award },
              { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
              { id: 'reviews', label: 'Reviews', icon: Star }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700/50'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto bg-gray-800">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Skills & Expertise</h3>
                <div className="grid grid-cols-2 gap-4">
                  {worker.skills.map((skill, index) => (
                    <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <skill.icon size={20} className="text-gray-400 mr-2" />
                          <span className="font-medium text-gray-200">{skill.name}</span>
                        </div>
                        <span className="text-sm text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getSkillColor(skill.level)}`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Contact Information</h3>
                <div className="bg-gray-700/50 p-4 rounded-lg space-y-3 border border-gray-600">
                  <div className="flex items-center">
                    <Phone size={18} className="text-gray-400 mr-3" />
                    <span className="text-gray-200">{worker.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={18} className="text-gray-400 mr-3" />
                    <span className="text-gray-200">{worker.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-400 mr-3" />
                    <span className="text-gray-200">
                      {worker.availability.status === 'available' 
                        ? 'Available immediately' 
                        : worker.availability.availableFrom 
                        ? `Available from ${formatDate(worker.availability.availableFrom)}`
                        : 'Availability varies'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Availability Notes */}
              {worker.availability.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Availability Notes</h3>
                  <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
                    <p className="text-blue-300">{worker.availability.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              {worker.portfolio.length > 0 ? (
                <>
                  {/* Portfolio Navigation */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Project Portfolio</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevPortfolioItem}
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                        disabled={worker.portfolio.length <= 1}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-sm text-gray-400 px-3">
                        {currentPortfolioIndex + 1} of {worker.portfolio.length}
                      </span>
                      <button
                        onClick={nextPortfolioItem}
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                        disabled={worker.portfolio.length <= 1}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Current Portfolio Item */}
                  {worker.portfolio[currentPortfolioIndex] && (
                    <div className="bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600">
                      <img
                        src={worker.portfolio[currentPortfolioIndex].image}
                        alt={worker.portfolio[currentPortfolioIndex].title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-6">
                        <h4 className="text-xl font-semibold mb-2 text-white">
                          {worker.portfolio[currentPortfolioIndex].title}
                        </h4>
                        <p className="text-gray-400 mb-4">
                          {worker.portfolio[currentPortfolioIndex].description}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-500">Client:</span>
                            <p className="font-medium text-gray-200">{worker.portfolio[currentPortfolioIndex].client}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Completed:</span>
                            <p className="font-medium text-gray-200">{formatDate(worker.portfolio[currentPortfolioIndex].completedDate)}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block mb-2">Skills Used:</span>
                          <div className="flex flex-wrap gap-2">
                            {worker.portfolio[currentPortfolioIndex].skills.map((skill, index) => (
                              <span
                                key={index}
                                className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Portfolio Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {worker.portfolio.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentPortfolioIndex(index)}
                        className={`relative rounded-lg overflow-hidden transition-all border ${
                          index === currentPortfolioIndex
                            ? 'ring-2 ring-blue-500 scale-105 border-blue-500'
                            : 'hover:scale-105 border-gray-600'
                        }`}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-xs font-medium text-center px-2">
                            {item.title}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Briefcase size={48} className="text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No portfolio items available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Client Reviews</h3>
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-yellow-400 fill-current" />
                  <span className="font-semibold text-white">{worker.rating}</span>
                  <span className="text-gray-400">({mockReviews.length} reviews)</span>
                </div>
              </div>

              <div className="space-y-4">
                {mockReviews.map(review => (
                  <div key={review.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-200">{review.client}</h4>
                        <p className="text-sm text-gray-400">{review.project}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-700 p-6 bg-gray-800">
          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              Send Message
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2">
              <Phone size={18} />
              Call Now
            </button>
            <button className="bg-gray-700 text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2 border border-gray-600">
              <ExternalLink size={18} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerModal;