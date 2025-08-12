package com.project.train_application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JourneyDTO {
    private String type; // "direct" or "connecting"
    private double totalPrice;
    private String finalArrivalTime;
    private List<Leg> legs;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Leg {
        private String trainName;
        private String fromStation;
        private String departureTime;
        private String toStation;
        private String arrivalTime;
        private int distanceKm;
        private double price;
    }
}
