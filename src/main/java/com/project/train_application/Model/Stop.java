package com.project.train_application.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Stop {
    private String station;
    private int distanceFromPrevious;
    private String departureTime;
}
