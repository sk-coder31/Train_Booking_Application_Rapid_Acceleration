import React from 'react';
import { ArrowUpDown, Clock, DollarSign } from 'lucide-react';
import { SortOption } from '../types/journey';

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-white">
          <ArrowUpDown className="w-5 h-5" />
          <span className="font-semibold">Sort by:</span>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => onSortChange('fare')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentSort === 'fare'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Lowest Fare
          </button>
          
          <button
            onClick={() => onSortChange('arrival')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentSort === 'arrival'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Clock className="w-4 h-4" />
            Earliest Arrival
          </button>
        </div>
      </div>
    </div>
  );
};