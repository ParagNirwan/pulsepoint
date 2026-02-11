package com.news.pulsepoint.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserPreferencesRequest {


    private List<String> languages;


    private List<String> categories;


    private String country;
}
