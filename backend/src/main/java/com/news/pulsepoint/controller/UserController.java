package com.news.pulsepoint.controller;

import com.news.pulsepoint.entity.User;
import com.news.pulsepoint.repository.UserRepository;
import com.news.pulsepoint.service.JwtService;
import com.news.pulsepoint.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private final JwtService jwtService;

    public UserController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @DeleteMapping
    public ResponseEntity<?> deleteUser() {
        // Get the currently authenticated user from the JWT
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        String username = authentication.getName();

        // Fetch the user from the database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Delete the user
        userRepository.delete(user);

        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
