import React, { useState } from 'react';
import { User, Mail, Phone, FileText, Upload, Send, Hammer, MapPin, Award, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { applicationService } from '../services/database';

interface RecruitmentFormProps {
  onApplicationSubmitted?: () => void;
}

export const RecruitmentForm: React.FC<RecruitmentFormProps> = ({ onApplicationSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    yearsExperience: '',
    skills: [] as string[],
    availability: 'available',
    message: '',
    photo: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { t } = useLanguage();

  // Available skills for selection
  const availableSkills = [
    'Bricklaying',
    'Tiling', 
    'Concrete',
    'Stone Masonry',
    'Roofing',
    'Woodwork',
    'Plumbing',
    'Electrical',
    'Painting',
    'Restoration'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.yearsExperience) newErrors.yearsExperience = 'Experience is required';
    if (formData.skills.length === 0) newErrors.skills = 'Please select at least one skill';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for existing applications with same email or phone
      const existingApplications = await applicationService.getApplications();
      const duplicate = existingApplications.find(app => 
        app.email.toLowerCase() === formData.email.toLowerCase() ||
        app.phone === formData.phone
      );

      if (duplicate) {
        setErrors({
          email: 'An application with this email or phone number already exists'
        });
        setIsSubmitting(false);
        return;
      }

      // Convert experience string to number
      const experienceYears = parseInt(formData.yearsExperience) || 0;
      
      // Create skills array with levels (based on experience)
      const skillsWithLevels = formData.skills.map(skill => ({
        name: skill,
        level: Math.min(95, 70 + experienceYears * 3),
        icon: 'Hammer'
      }));
      
      // Save the application to Supabase
      const newApplication = await applicationService.createApplication({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experience: experienceYears,
        certifications: `Skills: ${formData.skills.join(', ')} | Location: ${formData.location} | Availability: ${formData.availability}`,
        message: formData.message
      });

      console.log('Application saved to Supabase:', newApplication);
      
      // Notify parent component that a new application was submitted
      if (onApplicationSubmitted) {
        onApplicationSubmitted();
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        yearsExperience: '',
        skills: [],
        availability: 'available',
        message: '',
        photo: null
      });
      setErrors({});

      alert(`${t('recruitment.success')}\n\nApplication submitted successfully!\n\nTo view this application:\n1. Login as recruiter (anne@expatheros.nl)\n2. Check the recruiter dashboard\n3. Or go to Applications page`);
    } catch (error) {
      console.error('Error saving application to Supabase:', error);
      alert(t('recruitment.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-6">
        <img src="https://i.ibb.co/S4dQf3c1/brickwall.png" alt="expatheros.nl Logo" className="h-16 w-auto mx-auto mb-4 filter brightness-0 invert" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('recruitment.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400">Join our team of skilled construction professionals</p>
      </div>

      {/* Application Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Your Worker Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Your full name"
                    required
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="your@email.dk"
                    required
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone *
                </label>
                <div className="relative">
                  <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="+45 12 34 56 78"
                    required
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                      errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="City, Denmark"
                    required
                  />
                </div>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>

            {/* Experience and Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience *
                </label>
                <div className="relative">
                  <Clock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <select
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.yearsExperience ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0">0-1 years</option>
                    <option value="2">2-3 years</option>
                    <option value="4">4-5 years</option>
                    <option value="6">6-8 years</option>
                    <option value="10">10+ years</option>
                  </select>
                </div>
                {errors.yearsExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsExperience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Availability *
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="available">Available for immediate start</option>
                  <option value="partially-available">Available for part-time work</option>
                  <option value="busy">Currently busy (available later)</option>
                </select>
              </div>
            </div>

            {/* Skills Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {availableSkills.map(skill => (
                  <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                  </label>
                ))}
              </div>
              {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
            </div>



            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload your photo</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                  {formData.photo && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      {formData.photo.name} uploaded
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                About You (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Tell us about your experience, specializations, or why you'd like to join our team..."
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Questions?</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Mail className="h-4 w-4 mr-2" />
            <span>recruitment@expatheros.nl</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Phone className="h-4 w-4 mr-2" />
            <span>+45 70 12 34 56</span>
          </div>
        </div>
      </div>
    </div>
  );
};