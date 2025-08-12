import React, { useState } from 'react';
import { Search, Train, MapPin, Clock, IndianRupee, ArrowRight, Navigation, Route } from 'lucide-react';

// Types for the new API response format
interface Leg {
  trainName: string;
  fromStation: string;
  departureTime: string;
  toStation: string;
  arrivalTime: string;
  distanceKm: number;
  price: number;
}

interface APIJourneyResponse {
  type: 'direct' | 'connecting';
  totalPrice: number;
  finalArrivalTime: string;
  legs: Leg[];
}

interface JourneyOption {
  id: number;
  type: 'direct' | 'connecting';
  legs: Leg[];
  totalPrice: number;
  totalDistance: number;
  firstDepartureTime: string;
  finalArrivalTime: string;
  totalDuration: string;
}

type SortOption = 'fare' | 'time' | 'type';

// Utility functions
const calculateDuration = (start: string, end: string): string => {
  if (!start || !end) return '0h 0m';
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;
  
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }
  
  const totalMinutes = endMinutes - startMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};

const parseJourneyData = (apiResponse: APIJourneyResponse[]): JourneyOption[] => {
  return apiResponse.map((journey, index) => {
    const totalDistance = journey.legs.reduce((sum, leg) => sum + leg.distanceKm, 0);
    const firstDepartureTime = journey.legs[0]?.departureTime || '';
    const totalDuration = calculateDuration(firstDepartureTime, journey.finalArrivalTime);
    
    return {
      id: index + 1,
      type: journey.type,
      legs: journey.legs,
      totalPrice: journey.totalPrice,
      totalDistance,
      firstDepartureTime,
      finalArrivalTime: journey.finalArrivalTime,
      totalDuration
    };
  });
};

// Components
const JourneyTypeChip: React.FC<{ type: 'direct' | 'connecting' }> = ({ type }) => (
  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
    type === 'direct' 
      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
  }`}>
    {type === 'direct' ? <Navigation className="w-3 h-3" /> : <Route className="w-3 h-3" />}
    {type === 'direct' ? 'Direct' : 'Connecting'}
  </div>
);

const JourneyCard: React.FC<{ journey: JourneyOption; onBook: (id: number) => void }> = ({ journey, onBook }) => (
  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
    <div className="flex flex-col gap-6">
      {/* Header with journey type and timing */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <JourneyTypeChip type={journey.type} />
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="font-semibold">{journey.firstDepartureTime}</span>
            <ArrowRight className="w-4 h-4 text-white/60" />
            <span className="font-semibold">{journey.finalArrivalTime}</span>
            <span className="text-white/70">({journey.totalDuration})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center gap-1 text-2xl font-bold text-white">
              <IndianRupee className="w-6 h-6" />
              {journey.totalPrice.toFixed(2)}
            </div>
            <div className="text-white/60 text-sm">{journey.totalDistance} km total</div>
          </div>
          <button
            onClick={() => onBook(journey.id)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200"
          >
            Book Now
          </button>
        </div>
      </div>
      
      {/* Journey legs */}
      <div className="space-y-3">
        {journey.legs.map((leg, index) => (
          <div key={index} className="relative">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg px-3 py-2 min-w-fit">
                <span className="text-white font-medium text-sm">{leg.trainName}</span>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white/60" />
                  <div>
                    <div className="text-white font-medium">{leg.fromStation}</div>
                    <div className="text-white/70">{leg.departureTime}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white/60" />
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white/60" />
                  <div>
                    <div className="text-white font-medium">{leg.toStation}</div>
                    <div className="text-white/70">{leg.arrivalTime}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium flex items-center justify-end gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {leg.price.toFixed(2)}
                  </div>
                  <div className="text-white/60">{leg.distanceKm} km</div>
                </div>
              </div>
            </div>
            
            {/* Connection indicator for multi-leg journeys */}
            {journey.legs.length > 1 && index < journey.legs.length - 1 && (
              <div className="flex items-center justify-center py-2">
                <div className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/30">
                  Connection at {leg.toStation}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SortControls: React.FC<{ currentSort: SortOption; onSortChange: (sort: SortOption) => void }> = ({ currentSort, onSortChange }) => (
  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 mb-6">
    <div className="flex items-center gap-4">
      <span className="text-white font-medium">Sort by:</span>
      <div className="flex gap-2">
        <button
          onClick={() => onSortChange('fare')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentSort === 'fare'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          Price
        </button>
        <button
          onClick={() => onSortChange('time')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentSort === 'time'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          Arrival Time
        </button>
        <button
          onClick={() => onSortChange('type')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentSort === 'type'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          Type
        </button>
      </div>
    </div>
  </div>
);

const BookingModal: React.FC<{ isOpen: boolean; onClose: () => void; journey: JourneyOption | null }> = ({ isOpen, onClose, journey }) => {
  if (!isOpen || !journey) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Book Journey #{journey.id}</h3>
        
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <JourneyTypeChip type={journey.type} />
              <span className="text-gray-600">
                {journey.firstDepartureTime} → {journey.finalArrivalTime} ({journey.totalDuration})
              </span>
            </div>
            
            <div className="space-y-3">
              {journey.legs.map((leg, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <span className="font-medium text-gray-900">{leg.trainName}</span>
                    <span className="text-gray-600 ml-2">
                      {leg.fromStation} → {leg.toStation}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{leg.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{leg.distanceKm} km</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-300 flex justify-between items-center">
              <span className="font-bold text-lg">Total Amount:</span>
              <span className="font-bold text-lg text-green-600">₹{journey.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [journeys, setJourneys] = useState<JourneyOption[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('fare');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<JourneyOption | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Backend API configuration
  const API_BASE_URL = 'http://localhost:8080';
  const API_ENDPOINTS = {
    searchJourneys: '/api/routes'
  };

  // Debug logging function
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[DEBUG ${timestamp}] ${message}`);
  };

  // Function to fetch journeys from backend
  const fetchJourneys = async (from: string, to: string, date: string) => {
    try {
      setLoading(true);
      setError(null);
      setDebugLogs([]); // Clear previous logs
      
      addDebugLog(`Starting search: ${from} → ${to} on ${date}`);
      
      // Construct API URL with query parameters
      const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.searchJourneys}`);
      url.searchParams.append('from', from);
      url.searchParams.append('to', to);
      
      addDebugLog(`Making request to: ${url.toString()}`);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      addDebugLog(`Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const data: APIJourneyResponse[] = await response.json();
      addDebugLog(`Received ${data.length} journey options from API`);
      
      // Validate response format
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected array of journey objects');
      }
      
      // Check if no journeys are available
      if (data.length === 0) {
        addDebugLog('No journeys found in response');
        setJourneys([]);
        return;
      }
      
      const parsedJourneys = parseJourneyData(data);
      addDebugLog(`Parsed ${parsedJourneys.length} journeys successfully`);
      setJourneys(parsedJourneys);
      
    } catch (error) {
      addDebugLog(`Error occurred: ${error}`);
      console.error('Error fetching journeys:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to fetch journeys';
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = `Cannot connect to backend server at ${API_BASE_URL}. Please ensure the backend is running.`;
        addDebugLog('Network error detected - likely CORS or connection issue');
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Fallback to example data for development/testing
      addDebugLog('Using fallback example data...');
      const fallbackData: APIJourneyResponse[] = [
        {
          type: "direct",
          totalPrice: 625.0,
          finalArrivalTime: "13:00",
          legs: [
            {
              trainName: "Chennai Express",
              fromStation: "Chennai",
              departureTime: "06:00",
              toStation: "Mysore",
              arrivalTime: "13:00",
              distanceKm: 500,
              price: 625.0
            }
          ]
        },
        {
          type: "connecting",
          totalPrice: 625.0,
          finalArrivalTime: "13:00",
          legs: [
            {
              trainName: "Chennai Express",
              fromStation: "Chennai",
              departureTime: "06:00",
              toStation: "Vellore",
              arrivalTime: "08:00",
              distanceKm: 150,
              price: 187.5
            },
            {
              trainName: "Chennai Express",
              fromStation: "Vellore",
              departureTime: "08:00",
              toStation: "Mysore",
              arrivalTime: "13:00",
              distanceKm: 350,
              price: 437.5
            }
          ]
        },
        {
          type: "connecting",
          totalPrice: 625.0,
          finalArrivalTime: "13:00",
          legs: [
            {
              trainName: "Kaveri Express",
              fromStation: "Chennai",
              departureTime: "05:30",
              toStation: "Bangalore",
              arrivalTime: "10:30",
              distanceKm: 350,
              price: 437.5
            },
            {
              trainName: "Chennai Express",
              fromStation: "Bangalore",
              departureTime: "11:00",
              toStation: "Mysore",
              arrivalTime: "13:00",
              distanceKm: 150,
              price: 187.5
            }
          ]
        }
      ];
      const parsedJourneys = parseJourneyData(fallbackData);
      setJourneys(parsedJourneys);
    } finally {
      setLoading(false);
      addDebugLog('Search completed');
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (!searchParams.from || !searchParams.to) {
      addDebugLog('Search attempted with empty from/to fields');
      return;
    }
    fetchJourneys(searchParams.from, searchParams.to, searchParams.date);
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sortedJourneys = [...journeys].sort((a, b) => {
    if (sortBy === 'fare') {
      return a.totalPrice - b.totalPrice;
    } else if (sortBy === 'time') {
      // Sort by arrival time
      const timeA = a.finalArrivalTime.split(':').map(Number);
      const timeB = b.finalArrivalTime.split(':').map(Number);
      const minutesA = timeA[0] * 60 + timeA[1];
      const minutesB = timeB[0] * 60 + timeB[1];
      return minutesA - minutesB;
    } else {
      // Sort by type: direct first, then connecting
      if (a.type === 'direct' && b.type === 'connecting') return -1;
      if (a.type === 'connecting' && b.type === 'direct') return 1;
      return 0;
    }
  });

  const handleBooking = (journeyId: number) => {
    const journey = journeys.find(j => j.id === journeyId);
    setSelectedJourney(journey || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJourney(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-3">
              <Train className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">TrainBooker</h1>
              <p className="text-white/70">Find and book your perfect journey</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Search className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Journey Search</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Enter departure city"
                value={searchParams.from}
                onChange={(e) => handleInputChange('from', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Enter destination city"
                value={searchParams.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <input
              type="date"
              value={searchParams.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Debug Panel */}
        {debugLogs.length > 0 && (
          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-4 mb-6">
            <h3 className="text-white font-medium mb-2">Debug Logs:</h3>
            <div className="bg-black/50 rounded-lg p-3 max-h-40 overflow-y-auto">
              {debugLogs.map((log, index) => (
                <div key={index} className="text-green-300 text-xs font-mono mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sort Controls */}
        {journeys.length > 0 && <SortControls currentSort={sortBy} onSortChange={setSortBy} />}

        {/* Journey Results */}
        {error && journeys.length > 0 && (
          <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 text-red-200">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h3 className="font-semibold">Connection Error</h3>
                <p className="text-sm text-red-200/80">{error}</p>
                <p className="text-xs text-red-200/60 mt-1">Using sample data for demonstration</p>
              </div>
            </div>
          </div>
        )}
        
        {loading && searchParams.from && searchParams.to ? (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 inline-block">
              <Train className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
              <p className="text-white text-lg">Searching for the best routes...</p>
              <p className="text-white/60 text-sm mt-2">From {searchParams.from} to {searchParams.to}</p>
            </div>
          </div>
        ) : !loading && searchParams.from && searchParams.to ? (
          <div className="space-y-6">
            {sortedJourneys.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12">
                  <Search className="w-12 h-12 text-white/60 mx-auto mb-4" />
                  <p className="text-white text-lg">No trains available for this route.</p>
                  <p className="text-white/70 text-sm mt-2">
                    From {searchParams.from} to {searchParams.to} on {searchParams.date}
                  </p>
                  <p className="text-white/60 text-xs mt-2">
                    Try searching for a different route or date.
                  </p>
                </div>
              </div>
            ) : (
              sortedJourneys.map((journey) => (
                <JourneyCard
                  key={journey.id}
                  journey={journey}
                  onBook={handleBooking}
                />
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12">
              <Search className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <p className="text-white text-lg">Search for train routes</p>
              <p className="text-white/70 text-sm mt-2">
                Enter your departure and destination cities to find available trains
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showModal}
        onClose={closeModal}
        journey={selectedJourney}
      />
    </div>
  );
}

export default App;