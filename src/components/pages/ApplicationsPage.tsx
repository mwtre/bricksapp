import React, { useState, useEffect } from 'react';
import { FileText, Mail, Phone, Calendar, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { mockApplications, updateApplicationStatus, getApplications } from '../../data/mockData';

export const ApplicationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [applications, setApplications] = useState(getApplications());
  const { t } = useLanguage();

  // Refresh applications when component mounts or when applications are updated
  useEffect(() => {
    const handleApplicationsUpdate = () => {
      setApplications(getApplications());
    };

    // Listen for application updates
    window.addEventListener('applications-updated', handleApplicationsUpdate);
    
    // Initial load
    setApplications(getApplications());

    return () => {
      window.removeEventListener('applications-updated', handleApplicationsUpdate);
    };
  }, []);

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('status.pending');
      case 'reviewed': return t('dashboard.reviewed');
      case 'approved': return t('dashboard.approved');
      case 'rejected': return t('applications.reject');
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'reviewed': return <FileText className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    // Update the application status
    const updatedApplication = updateApplicationStatus(applicationId, newStatus as any);
    if (updatedApplication) {
      // The applications will be refreshed automatically via the event listener
      console.log(`Changed status of application ${applicationId} to ${newStatus}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('applications.title')}</h1>
        <div className="text-sm text-gray-500">
          {filteredApplications.length} {t('applications.title').toLowerCase()}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('applications.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t('status.allStatus')}</option>
              <option value="pending">{t('status.pending')}</option>
              <option value="reviewed">{t('dashboard.reviewed')}</option>
              <option value="approved">{t('dashboard.approved')}</option>
              <option value="rejected">{t('applications.reject')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-100">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('common.all')}</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('status.pending')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.reviewed')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'reviewed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.approved')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{application.name}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {application.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {application.phone}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(application.submittedDate).toLocaleDateString('da-DK')}
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1">{getStatusText(application.status)}</span>
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{t('applications.experience')}</p>
                  <p className="text-sm text-gray-600">{application.experience} {t('applications.yearsExperience')}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{t('applications.certifications')}</p>
                  <p className="text-sm text-gray-600">{application.certifications}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">{t('applications.applicationLetter')}</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{application.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  {application.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(application.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {t('applications.approve')}
                      </button>
                      <button 
                        onClick={() => handleStatusChange(application.id, 'reviewed')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {t('applications.markReviewed')}
                      </button>
                      <button 
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {t('applications.reject')}
                      </button>
                    </>
                  )}
                  {application.status === 'reviewed' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(application.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {t('applications.approve')}
                      </button>
                      <button 
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {t('applications.reject')}
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    {t('applications.contactApplicant')}
                  </button>
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    {t('applications.viewCV')}
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    {t('applications.seeDetails')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('applications.noApplications')}</h3>
          <p className="text-gray-600">
            {t('common.noData')}
          </p>
        </div>
      )}
    </div>
  );
};