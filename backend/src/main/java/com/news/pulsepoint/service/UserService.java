package com.news.pulsepoint.service;

import com.news.pulsepoint.entity.Subscription;
import com.news.pulsepoint.entity.User;
import com.news.pulsepoint.entity.enums.PlanType;
import com.news.pulsepoint.entity.enums.SubscriptionStatus;
import com.news.pulsepoint.repository.SubscriptionRepository;
import com.news.pulsepoint.repository.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;


@Component
public class UserService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SubscriptionRepository subscriptionRepository;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            SubscriptionRepository subscriptionRepository
    ){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.subscriptionRepository = subscriptionRepository;
    }

    public void saveUser(User user){
        //Save User
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        //Create Free Subscription
        Subscription subscription = new Subscription();
        subscription.setUserId(savedUser.getId());
        subscription.setPlanType(PlanType.FREE);
        subscription.setSubscriptionStatus(SubscriptionStatus.ACTIVE);
        subscription.setCurrentPeriodEnd(null);

        subscriptionRepository.save(subscription);
    }

}
