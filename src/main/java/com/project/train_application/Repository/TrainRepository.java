package com.project.train_application.Repository;

import com.project.train_application.Model.Train;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TrainRepository extends MongoRepository<Train, String> {
}
