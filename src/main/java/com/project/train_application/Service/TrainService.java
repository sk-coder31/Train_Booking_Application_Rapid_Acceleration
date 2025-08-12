package com.project.train_application.Service;
import java.util.*;
import com.project.train_application.Repository.TrainRepository;
import com.project.train_application.dto.JourneyDTO;
import com.project.train_application.dto.JourneyDTO.Leg;
import org.springframework.stereotype.Service;
import com.project.train_application.Model.Train;
import com.project.train_application.Model.Route;

@Service
public class TrainService {

    private final TrainRepository trainRepository;
    private static final double PRICE_PER_KM = 1.25;

    public TrainService(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    public List<JourneyDTO> findTrains(String from, String to) {
        List<JourneyDTO> results = new ArrayList<>();
        List<Train> trains = trainRepository.findAll();

        // Direct Trains
        for (Train train : trains) {
            JourneyDTO direct = getDirectTrainInfo(train, from, to);
            if (direct != null) results.add(direct);
        }

        // Connecting Trains
        for (Train firstTrain : trains) {
            int fromIdx = getStationIndex(firstTrain, from);
            if (fromIdx == -1) continue;

            for (int i = fromIdx + 1; i < firstTrain.getRoute().size(); i++) {
                String midStation = firstTrain.getRoute().get(i).getStationName();
                for (Train secondTrain : trains) {
                    JourneyDTO connection = getConnectingTrainInfo(firstTrain, secondTrain, from, midStation, to);
                    if (connection != null) results.add(connection);
                }
            }
        }

        return results;
    }

    private JourneyDTO getDirectTrainInfo(Train train, String from, String to) {
        int fromIdx = getStationIndex(train, from);
        int toIdx = getStationIndex(train, to);

        if (fromIdx != -1 && toIdx != -1 && toIdx > fromIdx) {
            int distance = calculateDistance(train.getRoute(), fromIdx, toIdx);
            if (distance <= 0) return null;

            String startTime = train.getRoute().get(fromIdx).getDepartureTime();
            String endTime = train.getRoute().get(toIdx).getDepartureTime();
            double price = distance * PRICE_PER_KM;

            Leg leg = new Leg(train.getName(), from, startTime, to, endTime, distance, price);
            return new JourneyDTO("direct", price, endTime, List.of(leg));
        }
        return null;
    }

    private JourneyDTO getConnectingTrainInfo(Train firstTrain, Train secondTrain,
                                              String from, String mid, String to) {

        int fromIdx = getStationIndex(firstTrain, from);
        int midIdx1 = getStationIndex(firstTrain, mid);
        int midIdx2 = getStationIndex(secondTrain, mid);
        int toIdx = getStationIndex(secondTrain, to);

        if (fromIdx == -1 || midIdx1 == -1 || midIdx2 == -1 || toIdx == -1) return null;
        if (midIdx1 <= fromIdx || toIdx <= midIdx2) return null;

        int dist1 = calculateDistance(firstTrain.getRoute(), fromIdx, midIdx1);
        int dist2 = calculateDistance(secondTrain.getRoute(), midIdx2, toIdx);
        if (dist1 <= 0 || dist2 <= 0) return null;

        String startTime = firstTrain.getRoute().get(fromIdx).getDepartureTime();
        String midArrive = firstTrain.getRoute().get(midIdx1).getDepartureTime();
        String secondStart = secondTrain.getRoute().get(midIdx2).getDepartureTime();
        String endTime = secondTrain.getRoute().get(toIdx).getDepartureTime();

        double price1 = dist1 * PRICE_PER_KM;
        double price2 = dist2 * PRICE_PER_KM;

        Leg leg1 = new Leg(firstTrain.getName(), from, startTime, mid, midArrive, dist1, price1);
        Leg leg2 = new Leg(secondTrain.getName(), mid, secondStart, to, endTime, dist2, price2);

        return new JourneyDTO("connecting", price1 + price2, endTime, List.of(leg1, leg2));
    }

    private int getStationIndex(Train train, String station) {
        for (int i = 0; i < train.getRoute().size(); i++) {
            if (train.getRoute().get(i).getStationName().equalsIgnoreCase(station)) {
                return i;
            }
        }
        return -1;
    }

    private int calculateDistance(List<Route> route, int startIdx, int endIdx) {
        int distance = 0;
        for (int i = startIdx + 1; i <= endIdx; i++) {
            distance += route.get(i).getDistanceFromPrevious();
        }
        return distance;
    }
}
