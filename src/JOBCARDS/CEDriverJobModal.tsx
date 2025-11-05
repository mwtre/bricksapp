import { X, Truck, Gift, MapPin, CheckCircle, Briefcase } from 'lucide-react';

interface CEDriverJobModalProps {
  onClose: () => void;
}

export default function CEDriverJobModal({ onClose }: CEDriverJobModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-fadeInUp">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b-2 border-gray-100 bg-gradient-to-r from-white to-gray-50 z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Truck Driver</h2>
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
            <div className="relative bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-green-100/90 mb-2">Entry Level</p>
                    <p className="text-3xl md:text-4xl font-bold">€3,500–€3,800</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-green-100/90 mb-2">Senior Level</p>
                    <p className="text-3xl md:text-4xl font-bold">€4,800–€5,200</p>
                  </div>
                </div>
                <p className="text-xl text-green-100 mb-1 text-center">Gross per month</p>
                <p className="text-sm text-green-100/90 text-center">50 hours/week · CE License · Accommodation arranged</p>
              </div>
            </div>

            {/* Location & Overview */}
            <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Location & Overview</h3>
              </div>
              <div className="ml-14 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Location</span>
                    <p className="text-gray-900 font-medium">Zaandam, Noord-Holland</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Hours</span>
                    <p className="text-gray-900 font-medium">50 hours/week</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contract</span>
                    <p className="text-gray-900 font-medium">Full-time</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">License</span>
                    <p className="text-gray-900 font-medium">CE License required</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4 pt-4 border-t border-gray-200">
                  Are you an experienced and reliable CE driver looking for a steady job in the Netherlands? Join a trusted logistics company based in Zaandam, where you'll work with modern trucks and enjoy stable, year-round employment. You'll be part of a supportive team ensuring supermarkets across the country are always stocked with fresh, high-quality products.
                </p>
              </div>
            </section>

            {/* Responsibilities */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Your Daily Tasks</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Drive modern trucks and deliver to supermarkets',
                  'Follow planned routes and delivery schedules',
                  'Load and unload goods safely and efficiently',
                  'Maintain accurate delivery records and documentation',
                  'Conduct vehicle safety checks before and after trips',
                  'Communicate with dispatchers and customers',
                  'Handle paperwork and delivery confirmations',
                  'Ensure compliance with traffic and safety regulations'
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
                <div className="p-2 bg-green-100 rounded-xl">
                  <Gift className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">What We Offer</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Competitive salary: According to TLN scale D6 (€19.46 gross per hour)',
                  'Stable, year-round employment',
                  'Modern trucks with excellent maintenance',
                  'Accommodation arranged and available',
                  'Supportive team and work environment',
                  'Regular routes and predictable schedules',
                  'Opportunities for overtime',
                  'Professional development support'
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
                <div className="p-2 bg-green-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Requirements</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Valid CE driving license (Category C+E)',
                  'Experience as a CE driver preferred',
                  'Good knowledge of Dutch and/or English',
                  'Ability to work 50 hours per week',
                  'Reliable and punctual',
                  'Physical fitness for loading/unloading',
                  'Clean driving record',
                  'Willingness to work flexible hours'
                ].map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white text-center shadow-xl">
              <h3 className="text-3xl font-bold mb-3">Ready to Drive?</h3>
              <p className="text-lg text-green-100 mb-6">
                Join a trusted logistics company and deliver across the Netherlands with modern trucks.
              </p>
              <button className="bg-white text-green-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
