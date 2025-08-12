import { JourneyLeg, JourneyOption } from '../types/journey';

export const parseJourneyData = (journeyStrings: string[]): JourneyOption[] => {
  return journeyStrings.map((journeyString, index) => {
    const legs: JourneyLeg[] = [];
    let totalDistance = 0;
    let totalPrice = 0;

    // Split by "Then" to get individual legs
    const legStrings = journeyString.split(/(?:Take|Then)\s*\n?▪\s*/).filter(Boolean);
    
    legStrings.forEach((legString) => {
      const trainMatch = legString.match(/^([^-]+)/);
      const routeMatch = legString.match(/starting from ([^-]+) -> (\d{2}:\d{2}); reaching ([^-]+) -> (\d{2}:\d{2})/);
      const distanceMatch = legString.match(/distance -> (\d+) kms/);
      const priceMatch = legString.match(/price -> Rs ([\d.]+)/);

      if (trainMatch && routeMatch && distanceMatch && priceMatch) {
        const leg: JourneyLeg = {
          trainName: trainMatch[1].trim(),
          origin: routeMatch[1].trim(),
          destination: routeMatch[3].trim(),
          departureTime: routeMatch[2].trim(),
          arrivalTime: routeMatch[4].trim(),
          distance: parseInt(distanceMatch[1]),
          price: parseFloat(priceMatch[1])
        };

        legs.push(leg);
        totalDistance += leg.distance;
        totalPrice += leg.price;
      }
    });

    // Calculate final arrival time (last leg's arrival time)
    const finalArrivalTime = legs.length > 0 ? legs[legs.length - 1].arrivalTime : '00:00';

    return {
      id: index + 1,
      legs,
      totalDistance,
      totalPrice,
      totalDuration: calculateTotalDuration(legs),
      finalArrivalTime
    };
  });
};

const calculateTotalDuration = (legs: JourneyLeg[]): string => {
  if (legs.length === 0) return '0h 0m';
  
  const firstDeparture = legs[0].departureTime;
  const lastArrival = legs[legs.length - 1].arrivalTime;
  
  const [depHour, depMin] = firstDeparture.split(':').map(Number);
  const [arrHour, arrMin] = lastArrival.split(':').map(Number);
  
  let totalMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
  
  // Handle overnight journeys
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};