package com.project.train_application.Loader;

import com.project.train_application.Model.Route;
import com.project.train_application.Model.Train;
import com.project.train_application.Repository.TrainRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    private final TrainRepository trainRepository;

    public DataLoader(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data
        trainRepository.deleteAll();

        // Train 1 - Chennai Express
        Train chennaiExpress = new Train(
                "T001",
                "Chennai Express",
                Arrays.asList(
                        new Route("Chennai", "06:00", 0),
                        new Route("Vellore", "08:00", 150),
                        new Route("Bangalore", "11:00", 200),
                        new Route("Mysore", "13:00", 150)
                )
        );

        // Train 2 - Bangalore Mail
        Train bangaloreMail = new Train(
                "T002",
                "Bangalore Mail",
                Arrays.asList(
                        new Route("Bangalore", "07:00", 0),
                        new Route("Salem", "09:00", 180),
                        new Route("Erode", "11:00", 80),
                        new Route("Coimbatore", "13:00", 100)
                )
        );

        // Train 3 - Kaveri Express
        Train kaveriExpress = new Train(
                "T003",
                "Kaveri Express",
                Arrays.asList(
                        new Route("Chennai", "05:30", 0),
                        new Route("Katpadi", "07:00", 130),
                        new Route("Bangalore", "10:30", 220)
                )
        );

        // Save to MongoDB
        trainRepository.saveAll(Arrays.asList(chennaiExpress, bangaloreMail, kaveriExpress));

        System.out.println("Sample trains loaded into MongoDB!");
    }
}
