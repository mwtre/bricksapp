import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Edit, 
  Eye, 
  Star,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Award,
  Briefcase,
  MapPin,
  DollarSign,
  MessageCircle,
  Heart,
  Share2
} from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  completedDate: string;
  client: string;
  skills: string[];
}

interface Worker {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  skills: Skill[];
  yearsExperience: number;
  location: string;
  availability: {
    status: 'available' | 'busy' | 'partially-available';
    availableFrom?: string;
    notes?: string;
  };
  portfolio: PortfolioItem[];
  rating: number;
  completedProjects: number;
}

interface WorkerCardProps {
  worker: Worker;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onContact: (id: string) => void;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onView, onEdit, onContact }) => {
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showQuickContact, setShowQuickContact] = useState(false);

  const getSkillColor = (level: number) => {
    if (level >= 90) return 'bg-green-500';
    if (level >= 70) return 'bg-blue-500';
    if (level >= 50) return 'bg-yellow-500';
    if (level >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getAvailabilityStatus = () => {
    switch (worker.availability.status) {
      case 'available':
        return {
          icon: CheckCircle,
          color: 'text-green-400 bg-green-900/30 border-green-700',
          text: 'Available Now',
          borderColor: 'border-green-700'
        };
      case 'busy':
        return {
          icon: XCircle,
          color: 'text-red-400 bg-red-900/30 border-red-700',
          text: 'Busy',
          borderColor: 'border-red-700'
        };
      case 'partially-available':
        return {
          icon: AlertCircle,
          color: 'text-yellow-400 bg-yellow-900/30 border-yellow-700',
          text: 'Partially Available',
          borderColor: 'border-yellow-700'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

  const availabilityStatus = getAvailabilityStatus();
  const currentPortfolioItem = worker.portfolio[currentPortfolioIndex];
  const hourlyRate = worker.hourlyRateMin && worker.hourlyRateMax
    ? `€${worker.hourlyRateMin.toFixed(2)}-€${worker.hourlyRateMax.toFixed(2)}`
    : `€${45}-€${65}`;

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700 group hover:border-gray-600">
      {/* Header Section with Enhanced Design */}
      <div className="relative p-6 pb-4">
        {/* Favorite and Share buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`p-2 rounded-full transition-colors ${
              isFavorited 
                ? 'bg-red-900/50 text-red-400 border border-red-700' 
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600 border border-gray-600'
            }`}
          >
            <Heart size={16} className={isFavorited ? 'fill-current' : ''} />
          </button>
          <button className="p-2 rounded-full bg-gray-700 text-gray-400 hover:bg-gray-600 transition-colors border border-gray-600">
            <Share2 size={16} />
          </button>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={worker.photo}
                alt={worker.name}
                className="w-16 h-16 rounded-full object-cover border-3 border-gray-600 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                {worker.yearsExperience}y
              </div>
              {/* Online status indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-white">{worker.name}</h3>
              <div className="flex items-center text-sm text-gray-400 mb-1">
                <MapPin size={14} className="mr-1" />
                <span>{worker.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-300 ml-1">{worker.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({Math.floor(Math.random() * 50) + 10})</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400 ml-1">{worker.completedProjects}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Availability Status */}
        <div className={`flex items-center justify-between p-3 rounded-lg border ${availabilityStatus.borderColor} ${availabilityStatus.color} mb-4 backdrop-blur-sm`}>
          <div className="flex items-center">
            <availabilityStatus.icon size={16} className="mr-2" />
            <div>
              <span className="font-medium text-sm">{availabilityStatus.text}</span>
              {worker.availability.availableFrom && (
                <div className="flex items-center mt-1">
                  <Calendar size={12} className="mr-1" />
                  <span className="text-xs">From {formatDate(worker.availability.availableFrom)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center text-sm font-semibold">
            <DollarSign size={14} className="mr-1" />
            <span>{hourlyRate}/hr</span>
          </div>
        </div>
      </div>

      {/* Enhanced Portfolio Section */}
      {worker.portfolio.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-300 flex items-center">
              <Award size={16} className="mr-2 text-blue-400" />
              Recent Work
            </h4>
            <div className="flex items-center gap-1">
              <button
                onClick={prevPortfolioItem}
                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                disabled={worker.portfolio.length <= 1}
              >
                <ChevronLeft size={16} className="text-gray-500" />
              </button>
              <span className="text-xs text-gray-500 px-2">
                {currentPortfolioIndex + 1}/{worker.portfolio.length}
              </span>
              <button
                onClick={nextPortfolioItem}
                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                disabled={worker.portfolio.length <= 1}
              >
                <ChevronRight size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
          
          {currentPortfolioItem && (
            <div className="bg-gray-700/50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-600">
              <div className="relative">
                <img
                  src={currentPortfolioItem.image}
                  alt={currentPortfolioItem.title}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                  {formatDate(currentPortfolioItem.completedDate)}
                </div>
              </div>
              <div className="p-3">
                <h5 className="font-medium text-sm text-gray-200 mb-1">{currentPortfolioItem.title}</h5>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{currentPortfolioItem.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 font-medium">{currentPortfolioItem.client}</span>
                  <div className="flex items-center text-xs text-yellow-400">
                    <Star size={12} className="mr-1 fill-current" />
                    <span>5.0</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentPortfolioItem.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full font-medium border border-blue-700">
                      {skill}
                    </span>
                  ))}
                  {currentPortfolioItem.skills.length > 3 && (
                    <span className="text-xs text-gray-500 font-medium">+{currentPortfolioItem.skills.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Skills Section */}
      <div className="px-6 pb-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Top Skills</h4>
        <div className="grid grid-cols-2 gap-2">
          {worker.skills.slice(0, 4).map((skill, index) => (
            <div key={index} className="flex items-center bg-gray-700/50 p-2 rounded-lg border border-gray-600">
              <skill.icon size={14} className="text-gray-400 mr-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-300 truncate">{skill.name}</span>
                  <span className="text-xs text-gray-500 ml-1">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${getSkillColor(skill.level)} transition-all duration-300`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {worker.skills.length > 4 && (
          <button 
            onClick={() => onView(worker.id)}
            className="text-xs text-blue-400 hover:text-blue-300 mt-2 font-medium"
          >
            View all {worker.skills.length} skills
          </button>
        )}
      </div>

      {/* Quick Contact Info */}
      <div className="px-6 pb-4">
        <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-400">
              <Clock size={14} className="mr-2 text-gray-500" />
              <span>Usually responds in 2 hours</span>
            </div>
            <div className="flex items-center text-sm text-green-400">
              <CheckCircle size={14} className="mr-1" />
              <span className="font-medium">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => onView(worker.id)}
            className="bg-blue-600 text-white py-2.5 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center text-sm font-medium"
          >
            <Eye size={16} className="mr-1" />
            View Profile
          </button>
          <button
            onClick={() => setShowQuickContact(!showQuickContact)}
            className="bg-green-600 text-white py-2.5 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center text-sm font-medium"
          >
            <MessageCircle size={16} className="mr-1" />
            Quick Contact
          </button>
        </div>
        
        {/* Quick Contact Options */}
        {showQuickContact && (
          <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => onContact(worker.id)}
              className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center text-sm font-medium"
            >
              <Phone size={14} className="mr-1" />
              Call
            </button>
            <button
              onClick={() => onEdit(worker.id)}
              className="bg-orange-600 text-white py-2 px-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center text-sm font-medium"
            >
              <Mail size={14} className="mr-1" />
              Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerCard;