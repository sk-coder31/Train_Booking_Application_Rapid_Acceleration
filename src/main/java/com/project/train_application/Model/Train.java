package com.project.train_application.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Document(collection = "trains")
public class Train {
    @Id
    private String id;
    private String name;
    private List<Route> route; // List of stops in order
}
