package com.news.pulsepoint.service;

import com.news.pulsepoint.repository.SubscriptionRepository;
import com.news.pulsepoint.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;




}
