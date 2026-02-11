package com.news.pulsepoint.controller;

import com.news.pulsepoint.dto.UserPreferencesRequest;
import com.news.pulsepoint.dto.UserPreferencesResponse;
import com.news.pulsepoint.entity.User;
import com.news.pulsepoint.repository.UserRepository;
import com.news.pulsepoint.service.UserPreferencesService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/preferences")
@RequiredArgsConstructor
public class UserPreferencesController {

    private final UserPreferencesService userPreferencesService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<UserPreferencesResponse> getPreferences(
            Authentication authentication
    ) {
        ObjectId userId = extractUserId(authentication);
        return ResponseEntity.ok(
                userPreferencesService.getPreferences(userId)
        );
    }

    @PostMapping
    public ResponseEntity<UserPreferencesResponse> savePreferences(
            @RequestBody UserPreferencesRequest request,
            Authentication authentication
    ) {
        ObjectId userId = extractUserId(authentication);
        return ResponseEntity.ok(
                userPreferencesService.saveOrUpdatePreferences(userId, request)
        );
    }

    // ----------------- helper -----------------

    private ObjectId extractUserId(Authentication authentication) {

        // This is the username because your JWT sub = username
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found for username: " + username));

        return user.getId(); // Mongo ObjectId
    }
}
