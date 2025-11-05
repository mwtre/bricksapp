import { useState } from 'react';
import { Factory, Euro, ChevronRight } from 'lucide-react';
import CheeseJobModal from './CheeseJobModal';

export default function CheeseJobCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 border-gray-100 hover:border-amber-400 hover:-translate-y-1"
      >
        <div className="flex items-stretch h-full min-h-[280px]">
          <div className="w-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100">
            <img
              src={`${import.meta.env.BASE_URL}jobcards/chessecards.png`}
              alt="Cheese Factory Operator"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div className="flex-1 p-6 flex flex-col min-w-0">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors shadow-sm">
                <Factory className="w-6 h-6 text-amber-600 flex-shrink-0" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight pt-1">
                Food Production
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
              Master cheese-making at Henri Willig in Heerenveen with award-winning expertise.
            </p>

            <div className="mt-auto pt-4 border-t-2 border-gray-100">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <Euro className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Entry: €3,000–€3,400</span>
                      <span className="text-sm text-gray-600">Mid: €3,676–€5,115</span>
                      <span className="text-xs text-gray-500">Senior: €5,500–€6,100</span>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>

      {isOpen && <CheeseJobModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
