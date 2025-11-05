import { useState } from 'react';
import { Truck, Euro, ChevronRight } from 'lucide-react';
import CEDriverJobModal from './CEDriverJobModal';

export default function CEDriverJobCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 border-gray-100 hover:border-green-400 hover:-translate-y-1"
      >
        <div className="flex items-stretch h-full min-h-[280px]">
          <div className="w-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
            <img
              src={`${import.meta.env.BASE_URL}jobcards/camioncard.png`}
              alt="CE Driver"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div className="flex-1 p-6 flex flex-col min-w-0">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors shadow-sm">
                <Truck className="w-6 h-6 text-green-600 flex-shrink-0" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight pt-1">
                Truck Driver
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
              Drive modern trucks and deliver to supermarkets across the Netherlands.
            </p>

            <div className="mt-auto pt-4 border-t-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Euro className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-900">Entry: €3,500–€3,800</span>
                    <span className="text-lg font-semibold text-gray-900">Senior: €4,800–€5,200</span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </button>

      {isOpen && <CEDriverJobModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

