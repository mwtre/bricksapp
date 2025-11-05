import { X, Wine, Gift, MapPin, CheckCircle, Briefcase, Users } from 'lucide-react';

interface BarEmployeeJobModalProps {
  onClose: () => void;
}

export default function BarEmployeeJobModal({ onClose }: BarEmployeeJobModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-fadeInUp">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b-2 border-gray-100 bg-gradient-to-r from-white to-gray-50 z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Bar Staff</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-8 space-y-8">
            {/* Salary Banner */}
            <div className="relative bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-indigo-100/80 mb-1">Entry Level</p>
                    <p className="text-2xl md:text-3xl font-bold">€2,100–€2,300</p>
                  </div>
                  <div className="text-center border-l border-r border-indigo-400/30 px-2">
                    <p className="text-xs text-indigo-100/80 mb-1">Mid Level</p>
                    <p className="text-2xl md:text-3xl font-bold">€2,550–€2,700</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-indigo-100/80 mb-1">Senior Level</p>
                    <p className="text-2xl md:text-3xl font-bold">€3,000–€3,200</p>
                  </div>
                </div>
                <p className="text-xl text-indigo-100 mb-1 text-center">Gross per month</p>
                <p className="text-sm text-indigo-100/90 text-center">Full-time · MBO · 2–5 years experience · English/Dutch</p>
              </div>
            </div>

            {/* Location & Overview */}
            <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Location & Overview</h3>
              </div>
              <div className="ml-14 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Location</span>
                    <p className="text-gray-900 font-medium">Amsterdam, The Netherlands</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Hours</span>
                    <p className="text-gray-900 font-medium">Full-time</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Department</span>
                    <p className="text-gray-900 font-medium">Bar / Restaurant / Room Service</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Education</span>
                    <p className="text-gray-900 font-medium">MBO</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4 pt-4 border-t border-gray-200">
                  Are you a sociable, service-minded professional with a passion for hospitality? Join our Library Bar team and create memorable experiences for guests. Work in a vibrant atmosphere where you'll mix drinks, serve food, and ensure every guest feels welcome.
                </p>
              </div>
            </section>

            {/* Responsibilities */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Wine className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Your Responsibilities</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Prepare and serve cocktails, beverages, and food',
                  'Provide excellent customer service to all guests',
                  'Maintain bar cleanliness and organization',
                  'Handle cash and card transactions accurately',
                  'Manage inventory and restock supplies',
                  'Collaborate with kitchen and service staff',
                  'Follow health and safety regulations',
                  'Create a welcoming and vibrant atmosphere'
                ].map((task, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{task}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Benefits */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Gift className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">What We Offer</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Competitive salary: €2,550–€2,700 per month',
                  'Full-time contract with stable hours',
                  'Work in a vibrant, international environment',
                  'Opportunities for career growth',
                  'Training and development programs',
                  'Staff benefits and discounts',
                  'Collaborative and supportive team',
                  'Excellent location in Amsterdam'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Requirements</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  '2–5 years of experience in hospitality',
                  'MBO education level',
                  'Good command of English and/or Dutch',
                  'Service-minded and guest-oriented',
                  'Ability to work in a fast-paced environment',
                  'Team player with positive attitude'
                ].map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-8 text-white text-center shadow-xl">
              <h3 className="text-3xl font-bold mb-3">Ready to Mix & Serve?</h3>
              <p className="text-lg text-indigo-100 mb-6">
                Join our Library Bar team and create memorable experiences for guests.
              </p>
              <button className="bg-white text-indigo-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
