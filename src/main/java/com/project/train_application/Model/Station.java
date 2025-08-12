package com.project.train_application.Model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "stations")
@Getter
@Setter
public class Station {
    @Id
    private String id;
    private String name;
    private String code;
    private String city;


    public Station() {
    }

    public Station(String id, String name, String code, String city) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.city = city;
    }
}
