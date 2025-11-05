import { X, Gift, MapPin, CheckCircle, Briefcase, Wrench } from 'lucide-react';

interface BikeMechanicJobModalProps {
  onClose: () => void;
}

export default function BikeMechanicJobModal({ onClose }: BikeMechanicJobModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-fadeInUp">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b-2 border-gray-100 bg-gradient-to-r from-white to-gray-50 z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Bike Mechanic</h2>
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
                <p className="text-4xl md:text-5xl font-bold mb-2">€2,500–€3,000</p>
                <p className="text-xl text-blue-100 mb-1">Gross per month</p>
                <p className="text-sm text-blue-100/90">Part-time · Weekdays 15:30-20:00 · Fixed hours</p>
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
                    <p className="text-gray-900 font-medium">The Netherlands</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Hours</span>
                    <p className="text-gray-900 font-medium">Weekdays 15:30-20:00</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contract</span>
                    <p className="text-gray-900 font-medium">Part-time</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Work Type</span>
                    <p className="text-gray-900 font-medium">Fixed working hours</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4 pt-4 border-t border-gray-200">
                  We're on a mission to make biking the easy, sustainable choice for everyone. We keep our members on the go by providing a high-quality ride including free check-ups and repairs. Joining us means becoming part of this purposeful mission, and working alongside a great team in a fast-paced, fun environment to make it happen!
                </p>
              </div>
            </section>

            {/* Responsibilities */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">How you pedal us forward!</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Repair pedal bikes and e-bikes with no supervision needed',
                  'Make bikes roadworthy and ensure Swapfiets quality',
                  'Ensure product and repair data is properly captured in repair database',
                  'Handle special case repairs (in use, double frame numbers, founds, missings)',
                  'Organize broken inflow and pre-organizing of bikes (Triage)',
                  'Work safely and follow safety guidelines'
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
                <h3 className="text-2xl font-bold text-gray-900">Benefits for a smooth ride!</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Fixed working hours possible',
                  'Become part of Swapfiets\'s fun operation! Regular team meetings with food/drinks and team events',
                  'Work fuelled by purpose! A lot of responsibility, challenging and dynamic work',
                  'A solid pension plan',
                  'A discount for an Urban Sports Club subscription',
                  'Training opportunities and growth possibilities within Swapfiets (you can even move cities or countries with us!)',
                  'No seasonal work - we work all year round!',
                  'A fun working culture with flat hierarchies and a supportive, tight-knit team',
                  'Safe working environment',
                  'Own workstation for mechanics'
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
                  <Wrench className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">The gear you need!</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-14">
                {[
                  'Elementary knowledge about e-bikes and pedal bikes (cars or anything related can also be of help)',
                  'Affinity with cycling, mobility, sustainability and service',
                  'Available on weekdays between 15:30 and 20:00',
                  'Understand and speak English',
                  'Whether working independently or as part of a team, you always work successfully!'
                ].map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusivity Note */}
            <section className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pedaling Towards Inclusivity at Swapfiets!</h3>
              <p className="text-gray-700 leading-relaxed">
                At Swapfiets, we believe in the power of diversity and inclusivity. While we're proud of our progress, we know there's more to do. Research shows underrepresented groups often hesitate to apply unless they meet all requirements—but we don't check all the boxes either! We value equal opportunity, unique perspectives, and diverse experiences. So, even if you don't see yourself represented on our team, we encourage you to apply—because when we pedal together, we go further!
              </p>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center shadow-xl">
              <h3 className="text-3xl font-bold mb-3">Your next ride starts here!</h3>
              <p className="text-lg text-blue-100 mb-6">
                Join Swapfiets and be an essential part of our growth and continuity.
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

