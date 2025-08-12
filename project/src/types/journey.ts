export interface JourneyLeg {
  trainName: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  distance: number;
  price: number;
}

export interface JourneyOption {
  id: number;
  legs: JourneyLeg[];
  totalDistance: number;
  totalPrice: number;
  totalDuration: string;
  finalArrivalTime: string;
}

export type SortOption = 'fare' | 'arrival';