package com.news.pulsepoint.service;

import com.news.pulsepoint.dto.UserPreferencesRequest;
import com.news.pulsepoint.dto.UserPreferencesResponse;
import com.news.pulsepoint.entity.UserPreferences;
import com.news.pulsepoint.repository.UserPreferencesRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserPreferencesServiceImpl implements UserPreferencesService {

    private final UserPreferencesRepository repository;

    @Override
    public UserPreferencesResponse getPreferences(ObjectId userId) {

        UserPreferences prefs = repository.findByUserId(userId)
                .orElseGet(() -> createDefaultPreferences(userId));

        return toResponse(prefs);
    }

    @Override
    public UserPreferencesResponse saveOrUpdatePreferences(
            ObjectId userId,
            UserPreferencesRequest request
    ) {

        UserPreferences prefs = repository.findByUserId(userId)
                .orElseGet(() -> new UserPreferences());

        prefs.setUserId(userId);
        prefs.setCountry(
                request.getCountry() != null ? request.getCountry() : "us"
        );
        prefs.setCategories(
                request.getCategories() != null && !request.getCategories().isEmpty()
                        ? request.getCategories()
                        : List.of("general")
        );
        prefs.setLanguages(
                request.getLanguages() != null && !request.getLanguages().isEmpty()
                        ? request.getLanguages()
                        : List.of("en")
        );

        UserPreferences saved = (UserPreferences) repository.save(prefs);
        return toResponse(saved);
    }

    // ----------------- helpers -----------------

    private UserPreferences createDefaultPreferences(ObjectId userId) {
        UserPreferences prefs = new UserPreferences();
        prefs.setUserId(userId);
        prefs.setCountry("us");
        prefs.setCategories(List.of("general"));
        prefs.setLanguages(List.of("en"));
        return (UserPreferences) repository.save(prefs);
    }

    private UserPreferencesResponse toResponse(UserPreferences prefs) {
        return UserPreferencesResponse.builder()
                .country(prefs.getCountry())
                .categories(prefs.getCategories())
                .languages(prefs.getLanguages())
                .build();
    }
}
