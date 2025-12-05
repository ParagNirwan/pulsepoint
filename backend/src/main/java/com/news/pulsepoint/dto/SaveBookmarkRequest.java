package com.news.pulsepoint.dto;

import org.bson.types.ObjectId;


public class SaveBookmarkRequest {

    private ObjectId id;


    private String title;


    private String url;


    private String source;

    public SaveBookmarkRequest() {
    }

    public SaveBookmarkRequest(ObjectId id, String title, String url, String source) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.source = source;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
