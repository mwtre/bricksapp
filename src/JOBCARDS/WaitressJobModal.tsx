import { X, Coffee, Gift, MapPin, CheckCircle, Briefcase, Users } from 'lucide-react';

interface WaitressJobModalProps {
  onClose: () => void;
}

export default function WaitressJobModal({ onClose }: WaitressJobModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-fadeInUp">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b-2 border-gray-100 bg-gradient-to-r from-white to-gray-50 z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Hospitality</h2>
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
            <div className="relative bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-purple-100/80 mb-1">Entry Level</p>
                    <p className="text-2xl md:text-3xl font-bold">€2,000–€2,200</p>
                  </div>
                  <div className="text-center border-l border-r border-purple-400/30 px-2">
                    <p className="text-xs text-purple-100/80 mb-1">Mid Level</p>
                    <p className="text-2xl md:text-3xl font-bold">€2,500–€2,600</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-purple-100/80 mb-1">Senior Level</p>
                    <p className="text-2xl md:text-3xl font-bold">€2,800–€3,000</p>
                  </div>
                </div>
                <p className="text-xl text-purple-100 mb-1 text-center">Net monthly salary</p>
                <p className="text-sm text-purple-100/90 text-center">4–40 hours/week · Part-time or Full-time · MBO</p>
              </div>
            </div>

            {/* Location & Overview */}
            <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-purple-600" />
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
                    <p className="text-gray-900 font-medium">4–40 hours/week</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contract</span>
                    <p className="text-gray-900 font-medium">Part-time or Full-time</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Department</span>
                    <p className="text-gray-900 font-medium">Bar / Restaurant / Room Service</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4 pt-4 border-t border-gray-200">
                  Are you an enthusiastic and guest-oriented professional eager to make a difference in the luxury hotel industry? As a Breakfast & Lunch Employee in our brasserie, you'll be the friendly face that welcomes guests each morning and afternoon, ensuring they enjoy a delightful start to their day. Join Ambassade Hotel Amsterdam, a renowned hospitality destination.
                </p>
              </div>
            </section>

            {/* Responsibilities */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Coffee className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Your Responsibilities</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Guest Experience: Warmly welcome guests and ensure memorable visits',
                  'Table Service: Take and process orders using POS system',
                  'Breakfast Buffet: Replenish and maintain buffet presentation',
                  'Cleanliness & Setup: Keep tables and dining areas spotless',
                  'Payments: Process bills and handle payments accurately',
                  'Inventory: Monitor stock levels and restock supplies',
                  'Hygiene & Safety: Maintain top hygiene and safety standards'
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
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">What We Offer</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Dynamic Work Environment in a lively brasserie',
                  'Supportive Team with experienced hospitality professionals',
                  'Flexible Hours: Morning shifts (6:00–8:00 AM start)',
                  'Growth & Development: Training opportunities (HACCP, First Aid, SVH)',
                  'Perks: Staff parties, team outings, tasting events',
                  'Wellness: Access to the hotel\'s wellness center',
                  'Career Opportunities: Clear pathways to advance',
                  'Weekend and holiday shifts available'
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
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Requirements</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Guest-Oriented: Make guests feel welcome and appreciated',
                  'Communicative: Strong English skills; additional languages a plus',
                  'Team Player: Enjoy collaboration and positive atmosphere',
                  'Flexible & Resilient: Remain calm during busy periods',
                  'Motivated: Enthusiasm and willingness to learn',
                  'Experience in hospitality is a plus'
                ].map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white text-center shadow-xl">
              <h3 className="text-3xl font-bold mb-3">Ready to Serve?</h3>
              <p className="text-lg text-purple-100 mb-6">
                Join Ambassade Hotel Amsterdam and start your hospitality career in luxury service.
              </p>
              <button className="bg-white text-purple-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
