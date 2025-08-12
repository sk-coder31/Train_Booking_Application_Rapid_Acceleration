package com.project.train_application.Controller;

import com.project.train_application.Model.Train;
import com.project.train_application.Service.TrainService;
import com.project.train_application.dto.JourneyDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class TrainController {

    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @CrossOrigin(origins = "http://localhost:5173/")
    @GetMapping
    public List<JourneyDTO> searchRoute(@RequestParam String from, @RequestParam String to) {
        return trainService.findTrains(from, to);
    }
}