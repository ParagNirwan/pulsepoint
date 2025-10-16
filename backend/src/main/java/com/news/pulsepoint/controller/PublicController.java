package com.news.pulsepoint.controller;

import com.news.pulsepoint.entity.User;
import com.news.pulsepoint.repository.UserRepository;
import com.news.pulsepoint.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<String> save(@RequestBody User user) {
        try {
            userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("Successfully saved");
        } catch (RuntimeException _) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }







}
