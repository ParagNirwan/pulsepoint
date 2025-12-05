package com.news.pulsepoint.entity;


import lombok.Data;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "bookmarks")
@Data
@CompoundIndex(name = "user_url_unique", def = "{'userId': 1, 'url': 1}", unique = true)
public class Bookmark {
    @Id
    private ObjectId id;

    @NonNull
    private ObjectId userId;

    @NonNull
    private String title;

    @NonNull
    private String url;

    @NonNull
    private String source;


    public Bookmark() {
        //Empty Constructor
    }
}
