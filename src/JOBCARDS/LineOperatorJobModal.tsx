import { X, Factory, Gift, MapPin, CheckCircle, Briefcase, TrendingUp } from 'lucide-react';

interface LineOperatorJobModalProps {
  onClose: () => void;
}

export default function LineOperatorJobModal({ onClose }: LineOperatorJobModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-fadeInUp">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b-2 border-gray-100 bg-gradient-to-r from-white to-gray-50 z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Line Operator Food</h2>
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
            <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-red-100/90 mb-2">Entry Level</p>
                    <p className="text-3xl md:text-4xl font-bold">€2,300–€2,600</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-red-100/90 mb-2">Senior Level</p>
                    <p className="text-3xl md:text-4xl font-bold">€4,000–€4,400</p>
                  </div>
                </div>
                <p className="text-xl text-red-100 mb-1 text-center">Gross per month</p>
                <p className="text-sm text-red-100/90 text-center">35–42 hours/week · Long-term contract · Food Production</p>
              </div>
            </div>

            {/* Location & Overview */}
            <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Location & Overview</h3>
              </div>
              <div className="ml-14 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Location</span>
                    <p className="text-gray-900 font-medium">Urk, The Netherlands</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Hours</span>
                    <p className="text-gray-900 font-medium">35–42 hours/week</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contract</span>
                    <p className="text-gray-900 font-medium">Long-term contract</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Shift</span>
                    <p className="text-gray-900 font-medium">Evening shift</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4 pt-4 border-t border-gray-200">
                  At Level One Uitzendbureau, we go beyond simply finding you work; we ensure that your transition to the Netherlands is smooth and that you feel supported throughout your time here. You'll receive comfortable housing, reliable transportation, and personal guidance. This position is with a leading food production company that specializes in the production and packaging of high-quality food products, prioritizing freshness, sustainability, and food safety.
                </p>
              </div>
            </section>

            {/* Responsibilities */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-xl">
                  <Factory className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">What You Will Do</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Learn and adapt: Familiarize yourself with machines and production processes',
                  'Team Coordination: Assist in managing the team during your shift',
                  'Oversee Production Line: Monitor the production line for quality',
                  'Shift Management: Gain experience to independently manage evening shift',
                  'Assist in Production: Support team in daily production processes',
                  'Work Environment: Operate in a controlled environment at 8°C'
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
                <div className="p-2 bg-red-100 rounded-xl">
                  <Gift className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">What We Offer</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Competitive salary: €16.27 – €18.71 per hour (gross)',
                  'Flexible work hours: 35 – 42 hours per week',
                  'Accommodation & transport: Comfortable housing and reliable transport',
                  'Growth opportunities: Take on more responsibilities',
                  'Eventually manage the evening shift independently',
                  'Supportive work environment: Focus on teamwork and safety',
                  'Training opportunities at company\'s expense',
                  'Long-term career growth potential'
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
                <div className="p-2 bg-red-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Requirements</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Motivated & reliable: Eager to learn and grow',
                  'Team player: Work collaboratively with colleagues',
                  'Detail-oriented: Ensure production line runs smoothly',
                  'Adaptable: Ready to handle different tasks',
                  'Flexible: Comfortable working at 8°C and during evening shifts',
                  'Willingness to learn all aspects of production'
                ].map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white text-center shadow-xl">
              <h3 className="text-3xl font-bold mb-3">Ready to Start Your Production Career?</h3>
              <p className="text-lg text-red-100 mb-6">
                Join a leading food production company with full support and growth opportunities.
              </p>
              <button className="bg-white text-red-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
