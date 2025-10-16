package com.news.pulsepoint.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/check-connection")
public class CheckConnection {
    @GetMapping
    public String connection(){
        return "Works";
    }
}
