package com.project.train_application.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Route {
    private String stationName;
    private String departureTime; // "HH:mm"
    private int distanceFromPrevious; // in km
}
