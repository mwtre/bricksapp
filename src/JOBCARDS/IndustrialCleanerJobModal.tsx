import { X, Sparkles, Gift, MapPin, CheckCircle, Briefcase } from 'lucide-react';

interface IndustrialCleanerJobModalProps {
  onClose: () => void;
}

export default function IndustrialCleanerJobModal({ onClose }: IndustrialCleanerJobModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-fadeInUp">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b-2 border-gray-100 bg-gradient-to-r from-white to-gray-50 z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Industrial Cleaner</h2>
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
            <div className="relative bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <p className="text-5xl md:text-6xl font-bold mb-2">€3,100</p>
                  <p className="text-lg text-teal-100/90">Average monthly salary</p>
                </div>
                <p className="text-xl text-teal-100 mb-1 text-center">Gross per month</p>
                <p className="text-sm text-teal-100/90 text-center">1–40 hours/week · Permanent · Lower School</p>
              </div>
            </div>

            {/* Location & Overview */}
            <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-teal-600" />
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
                    <p className="text-gray-900 font-medium">1–40 hours/week</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contract</span>
                    <p className="text-gray-900 font-medium">Permanent</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Company</span>
                    <p className="text-gray-900 font-medium">Raaak Personeel, Arkel</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4 pt-4 border-t border-gray-200">
                  As an Industrial Cleaner at Raaak Personeel in Arkel, you will play a crucial role in ensuring the smooth operation of production by thoroughly cleaning tanks and machinery. Join an established company that is a key player in the construction industry, offering quality products used in numerous renovation projects.
                </p>
              </div>
            </section>

            {/* Responsibilities */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-teal-100 rounded-xl">
                  <Sparkles className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Your Responsibilities</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Cleaning Production Tanks & Machine Parts: Ensure all equipment is properly cleaned',
                  'Sealant Removal: Scrape off dried sealant residues using a putty knife',
                  'Safety Measures: Wear a gas mask to ensure safe working conditions',
                  'Maintain Smooth Operations: Ensure production process runs smoothly',
                  'Quality Control: Help maintain the quality of products',
                  'Follow safety protocols and guidelines'
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
                <div className="p-2 bg-teal-100 rounded-xl">
                  <Gift className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">What We Offer</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Competitive salary: Up to €3,200 gross per month',
                  'Additional benefits: 8% holiday pay, 25 vacation days',
                  'Travel allowance: €0.23 per kilometer',
                  'Training opportunities: Courses at company\'s expense',
                  'Job security: Opportunity for a permanent contract',
                  'Full-time role in an international organization',
                  'Supportive work culture',
                  'Opportunity for growth and development'
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
                <div className="p-2 bg-teal-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Requirements</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Shift Flexibility: Willingness to work in 2- or 3-shift schedule',
                  'Hands-On Attitude: Comfortable with challenging work environment',
                  'Language Skills: Proficient in Dutch and/or English',
                  'Ability to work in controlled temperature environments',
                  'Physical fitness for cleaning tasks',
                  'Attention to detail and quality focus'
                ].map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-teal-600 rounded-full flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-8 text-white text-center shadow-xl">
              <h3 className="text-3xl font-bold mb-3">Ready to Clean & Grow?</h3>
              <p className="text-lg text-teal-100 mb-6">
                Join Raaak Personeel and help maintain quality in the construction industry.
              </p>
              <button className="bg-white text-teal-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-teal-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
