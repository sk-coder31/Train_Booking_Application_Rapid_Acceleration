package com.project.train_application.Repository;

import com.project.train_application.Model.Station;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StationRepository extends MongoRepository<Station, String> {
}
