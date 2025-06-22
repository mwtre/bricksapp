import React, { useState } from 'react';
import { User, Mail, Phone, FileText, Upload, Send, Hammer } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { addApplication } from '../data/mockData';

interface RecruitmentFormProps {
  onApplicationSubmitted?: () => void;
}

export const RecruitmentForm: React.FC<RecruitmentFormProps> = ({ onApplicationSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    certifications: '',
    message: '',
    cvFile: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      cvFile: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert experience string to number
      const experienceYears = parseInt(formData.experience) || 0;
      
      // Save the application
      const newApplication = addApplication({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experience: experienceYears,
        certifications: formData.certifications,
        message: formData.message
      });

      console.log('Application saved:', newApplication);
      
      // Notify parent component that a new application was submitted
      if (onApplicationSubmitted) {
        onApplicationSubmitted();
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        experience: '',
        certifications: '',
        message: '',
        cvFile: null
      });

      alert(`${t('recruitment.success')}\n\nApplication ID: ${newApplication.id}\nName: ${newApplication.name}\n\nTo view this application:\n1. Login as recruiter (anne@bricksapp.dk)\n2. Check the recruiter dashboard\n3. Or go to Applications page`);
    } catch (error) {
      console.error('Error saving application:', error);
      alert(t('recruitment.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-6">
        <img src="https://i.ibb.co/S4dQf3c1/brickwall.png" alt="BricksApp Logo" className="h-16 w-auto mx-auto mb-4 filter brightness-0 invert" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('recruitment.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t('recruitment.subtitle')}</p>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('recruitment.whyWorkWithUs')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hammer className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('recruitment.excitingProjects')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t('recruitment.excitingProjectsDesc')}</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('recruitment.goodEnvironment')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t('recruitment.goodEnvironmentDesc')}</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('recruitment.competitiveTerms')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t('recruitment.competitiveTermsDesc')}</p>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('recruitment.applicationForm')}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('recruitment.name')} *
                </label>
                <div className="relative">
                  <User className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder={t('recruitment.name')}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('recruitment.email')} *
                </label>
                <div className="relative">
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="din@email.dk"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('recruitment.phone')} *
                </label>
                <div className="relative">
                  <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="+45 12 34 56 78"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('recruitment.experience')} *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">{t('recruitment.selectExperience')}</option>
                  <option value="0-1">{t('experience.0-1')}</option>
                  <option value="2-5">{t('experience.2-5')}</option>
                  <option value="6-10">{t('experience.6-10')}</option>
                  <option value="10+">{t('experience.10+')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('recruitment.certifications')} *
              </label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder={t('recruitment.certificationsPlaceholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('recruitment.message')} *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder={t('recruitment.applicationLetterPlaceholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('recruitment.uploadCV')}
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cv-upload"
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('recruitment.clickToUpload')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{t('recruitment.maxFileSize')}</p>
                  {formData.cvFile && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      {formData.cvFile.name} {t('recruitment.fileUploaded')}
                    </p>
                  )}
                </label>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? t('recruitment.submitting') : t('recruitment.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('recruitment.hasQuestions')}</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Mail className="h-4 w-4 mr-2" />
            <span>{t('recruitment.contactEmail')}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Phone className="h-4 w-4 mr-2" />
            <span>{t('recruitment.contactPhone')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};