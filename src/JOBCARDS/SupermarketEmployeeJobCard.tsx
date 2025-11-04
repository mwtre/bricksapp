import { useState } from 'react';
import { ShoppingCart, Euro, ChevronRight } from 'lucide-react';
import SupermarketEmployeeJobModal from './SupermarketEmployeeJobModal';

export default function SupermarketEmployeeJobCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 border-gray-100 hover:border-orange-400 hover:-translate-y-1"
      >
        <div className="flex items-stretch h-full min-h-[280px]">
          <div className="w-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
            <img
              src={`${import.meta.env.BASE_URL}jobcards/supercard.png`}
              alt="Full-Time Supermarket Employee"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div className="flex-1 p-6 flex flex-col min-w-0">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors shadow-sm">
                <ShoppingCart className="w-6 h-6 text-orange-600 flex-shrink-0" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight pt-1">
                Supermarket
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
              Join a leading supermarket chain in the Netherlands. Stock shelves, assist customers, and grow your career.
            </p>

            <div className="mt-auto pt-4 border-t-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <Euro className="w-6 h-6 text-orange-600 flex-shrink-0" />
                  <span className="text-2xl font-bold text-gray-900">€3,000–€3,500</span>
                  <span className="text-sm text-gray-600">/month gross</span>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </button>

      {isOpen && <SupermarketEmployeeJobModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

