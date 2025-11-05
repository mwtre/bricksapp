import { X, ShoppingCart, Gift, MapPin, CheckCircle, Briefcase, Users } from 'lucide-react';

interface SupermarketEmployeeJobModalProps {
  onClose: () => void;
}

export default function SupermarketEmployeeJobModal({ onClose }: SupermarketEmployeeJobModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-fadeInUp">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b-2 border-gray-100 bg-gradient-to-r from-white to-gray-50 z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Supermarket</h2>
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
            <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-orange-100/80 mb-1">Entry Level</p>
                    <p className="text-2xl md:text-3xl font-bold">€2,500–€2,800</p>
                  </div>
                  <div className="text-center border-l border-r border-orange-400/30 px-2">
                    <p className="text-xs text-orange-100/80 mb-1">Mid Level</p>
                    <p className="text-2xl md:text-3xl font-bold">€3,000–€3,500</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-orange-100/80 mb-1">Senior Level</p>
                    <p className="text-2xl md:text-3xl font-bold">€3,800–€4,200</p>
                  </div>
                </div>
                <p className="text-xl text-orange-100 mb-1 text-center">Gross per month</p>
                <p className="text-sm text-orange-100/90 text-center">40 hours/week · Full-time · No education requirement</p>
              </div>
            </div>

            {/* Location & Overview */}
            <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Location & Overview</h3>
              </div>
              <div className="ml-14 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Location</span>
                    <p className="text-gray-900 font-medium">Various locations in the Netherlands</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Hours</span>
                    <p className="text-gray-900 font-medium">40 hours per week</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contract</span>
                    <p className="text-gray-900 font-medium">Full-time</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Education</span>
                    <p className="text-gray-900 font-medium">No specific requirement</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4 pt-4 border-t border-gray-200">
                  Become part of one of the leading supermarket chains in the Netherlands! As a Full-Time Supermarket Employee, you'll work in a dynamic and fast-paced environment where no two days are the same. Whether you're stocking shelves, assisting customers, or handling the cash register, you'll be a vital part of our success. We offer a supportive, growth-focused team where you'll have the opportunity to take on more responsibilities.
                </p>
              </div>
            </section>

            {/* Responsibilities */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Your Responsibilities</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Stocking shelves: Ensure the store is always fully stocked',
                  'Customer service: Help customers find what they need',
                  'Cash register: Operate the cash register with excellent service',
                  'Department management: Manage specific areas like fruits/vegetables or bakery',
                  'Store maintenance: Keep the store clean and organized',
                  'Teamwork: Work collaboratively to provide top-notch service'
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
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Gift className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">What We Offer</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Competitive salary: €18.68 per hour, with all holiday allowances included',
                  'Flexible working hours: Indicate how many hours you want each month',
                  'Team activities: Join our football tournament and fun team events',
                  'Supportive work environment: Close-knit, friendly team',
                  'Career growth: Opportunities to take on more responsibilities',
                  'Extra perks: Paid for every minute worked',
                  'Flexibility in hours and shifts',
                  'Colleagues often become lifelong friends'
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
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Requirements</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Friendly and helpful: Naturally inclined to help customers',
                  'Go-getter: Quick to step up when something needs to be done',
                  'Age requirement: You must be 16 years or older',
                  'No experience needed: We\'ll provide all the training',
                  'Team player: Work well with colleagues',
                  'Positive attitude and willingness to learn'
                ].map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white text-center shadow-xl">
              <h3 className="text-3xl font-bold mb-3">Ready to Join Our Team?</h3>
              <p className="text-lg text-orange-100 mb-6">
                Start your career in retail with a leading supermarket chain.
              </p>
              <button className="bg-white text-orange-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
