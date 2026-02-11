package com.news.pulsepoint.service;

import com.news.pulsepoint.dto.UserPreferencesRequest;
import com.news.pulsepoint.dto.UserPreferencesResponse;
import org.bson.types.ObjectId;

public interface UserPreferencesService {

    UserPreferencesResponse getPreferences(ObjectId userId);

    UserPreferencesResponse saveOrUpdatePreferences(
            ObjectId userId,
            UserPreferencesRequest request
    );
}
