import { useState } from 'react';
import { Coffee, Euro, ChevronRight } from 'lucide-react';
import WaitressJobModal from './WaitressJobModal';

export default function WaitressJobCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 border-gray-100 hover:border-purple-400 hover:-translate-y-1"
      >
        <div className="flex items-stretch h-full min-h-[280px]">
          <div className="w-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100">
            <img
              src={`${import.meta.env.BASE_URL}jobcards/waitresscard.png`}
              alt="Breakfast & Lunch Employee"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div className="flex-1 p-6 flex flex-col min-w-0">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors shadow-sm">
                <Coffee className="w-6 h-6 text-purple-600 flex-shrink-0" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight pt-1">
                Hospitality
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
              Join Ambassade Hotel Amsterdam and grow your skills in luxury hospitality.
            </p>

            <div className="mt-auto pt-4 border-t-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Euro className="w-7 h-7 text-purple-600 flex-shrink-0" />
                  <div>
                    <span className="text-2xl font-bold text-gray-900">€2,500</span>
                    <span className="text-sm text-gray-600 ml-1">/month</span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </button>

      {isOpen && <WaitressJobModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

