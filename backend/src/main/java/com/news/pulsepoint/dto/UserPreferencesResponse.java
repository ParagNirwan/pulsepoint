package com.news.pulsepoint.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserPreferencesResponse {

    private List<String> languages;
    private List<String> categories;
    private String country;
}
