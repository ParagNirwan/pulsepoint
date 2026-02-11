package com.news.pulsepoint.entity;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection="user_preferences")
@Data
public class UserPreferences {
    @Id
    private ObjectId id;
    @Indexed(unique = true)
    private ObjectId userId; //JWT gives string
    private List<String> languages;
    private List<String> categories;
    private String country;
}
