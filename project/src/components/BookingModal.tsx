import React from 'react';
import { CheckCircle, X, Train } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  journeyId: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, journeyId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 rounded-full p-2">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Booking Confirmed!</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Train className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-white/90 text-lg mb-2">
            Your booking for <span className="font-bold text-emerald-400">Option {journeyId}</span> has been confirmed!
          </p>
          <p className="text-white/70 text-sm">
            You will receive a confirmation email shortly with your ticket details.
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};