import { X, Truck, Gift, MapPin, CheckCircle } from 'lucide-react';

interface ForkiftJobModalProps {
  onClose: () => void;
}

export default function ForkiftJobModal({ onClose }: ForkiftJobModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-fadeInUp">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b-2 border-gray-100 bg-gradient-to-r from-white to-gray-50 z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Forklift Operator</h2>
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
            <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-blue-100/80 mb-1">Entry Level</p>
                    <p className="text-2xl md:text-3xl font-bold">€2,800–€3,100</p>
                  </div>
                  <div className="text-center border-l border-r border-blue-400/30 px-2">
                    <p className="text-xs text-blue-100/80 mb-1">Mid Level</p>
                    <p className="text-2xl md:text-3xl font-bold">€3,438–€3,800</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-blue-100/80 mb-1">Senior Level</p>
                    <p className="text-2xl md:text-3xl font-bold">€4,200–€4,600</p>
                  </div>
                </div>
                <p className="text-xl text-blue-100 mb-1 text-center">Gross per month</p>
                <p className="text-sm text-blue-100/90 text-center">Full-time · 38–40 hours/week · €18.06/hour</p>
              </div>
            </div>

            {/* Location & Overview */}
            <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Location & Overview</h3>
              </div>
              <div className="ml-14 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Location</span>
                    <p className="text-gray-900 font-medium">Amsterdam, Netherlands</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Hours</span>
                    <p className="text-gray-900 font-medium">38–40 hours/week</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contract</span>
                    <p className="text-gray-900 font-medium">Full-time</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Schedule</span>
                    <p className="text-gray-900 font-medium">Mon–Fri, 08:00–16:30</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4 pt-4 border-t border-gray-200">
                  As a Warehouse & Forklift Operator at Nissan, you'll play a key role in ensuring orders are picked, packed, and shipped efficiently and accurately. This active, hands-on position keeps you moving in a dynamic, supportive team environment — where no two days are the same.
                </p>
              </div>
            </section>

            {/* Responsibilities */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Your Responsibilities</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Order picking – collect and prepare goods based on order lists',
                  'Prepare shipments – pack, label, and ready items for transport',
                  'Stock control – assist with inventory checks and report discrepancies',
                  'Safety & maintenance – follow warehouse safety procedures',
                  'Operate forklift/reach truck – load and unload goods safely',
                  'Maintain a clean and organized workspace'
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
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Gift className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">What We Offer</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  '€18.06 gross hourly wage (including surplus)',
                  'Full-time contract with potential for permanent position',
                  'Forklift & reach truck certification opportunity',
                  '25 vacation days + 8.33% holiday allowance',
                  'Travel reimbursement: €0.23/km',
                  '13th-month bonus',
                  'Supportive, international work environment',
                  'Room to grow and develop your skills'
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
                <div className="p-2 bg-blue-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Requirements</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Full-time availability (Mon–Fri, 08:00–16:30)',
                  'Good communication in Dutch or English',
                  'Willingness to apply for Certificate of Conduct (VOG)',
                  'Forklift/reach truck certification or willingness to obtain',
                  'Physically fit and able to lift/move heavy items',
                  'Team-oriented, reliable, and proactive'
                ].map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center shadow-xl">
              <h3 className="text-3xl font-bold mb-3">Ready to Join?</h3>
              <p className="text-lg text-blue-100 mb-6">
                Be part of a dynamic warehouse team at one of the world's leading automotive companies.
              </p>
              <button className="bg-white text-blue-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
