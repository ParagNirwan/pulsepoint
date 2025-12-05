package com.news.pulsepoint.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeleteBookmarkRequest {

    private String title;


    public DeleteBookmarkRequest() {
    }

    public DeleteBookmarkRequest(String title) {
        this.title = title;

    }




}
