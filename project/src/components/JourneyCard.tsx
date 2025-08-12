import React from 'react';
import { Clock, MapPin, Train, CreditCard } from 'lucide-react';
import { JourneyOption } from '../types/journey';

interface JourneyCardProps {
  journey: JourneyOption;
  onBook: (journeyId: number) => void;
}

export const JourneyCard: React.FC<JourneyCardProps> = ({ journey, onBook }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-white">Option {journey.id}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">₹{journey.totalPrice.toFixed(2)}</div>
          <div className="text-sm text-white/70">{journey.totalDistance} km total</div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {journey.legs.map((leg, index) => (
          <div key={index} className="relative">
            {index > 0 && (
              <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                <span>Then</span>
              </div>
            )}
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Train className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-white">{leg.trainName}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">{leg.origin}</div>
                    <div className="text-purple-300 font-bold text-lg">{leg.departureTime}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-white font-medium">{leg.destination}</div>
                    <div className="text-purple-300 font-bold text-lg">{leg.arrivalTime}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-white/70">{leg.distance} km</span>
                <span className="text-emerald-400 font-semibold">₹{leg.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        <div className="flex items-center gap-2 text-white/70">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Duration: {journey.totalDuration}</span>
        </div>
        
        <button
          onClick={() => onBook(journey.id)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          Book Now
        </button>
      </div>
    </div>
  );
};