package com.news.pulsepoint.controller;

import com.news.pulsepoint.dto.AuthenticationRequest;
import com.news.pulsepoint.dto.AuthenticationResponse;
import com.news.pulsepoint.entity.Subscription;
import com.news.pulsepoint.entity.enums.PlanType;
import com.news.pulsepoint.repository.SubscriptionRepository;
import com.news.pulsepoint.service.JwtService;
import com.news.pulsepoint.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request) {

        // 1. Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Load user details
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(request.getEmail());

        // 3. Resolve PlanType (fallback to FREE)
        PlanType planType = subscriptionRepository
                .findByUserId(
                        userDetailsService.getUserIdByEmail(request.getEmail())
                )
                .map(Subscription::getPlanType)
                .orElse(PlanType.FREE);

        // 4. Generate JWT with planType
        String jwt = jwtService.generateToken(
                userDetails.getUsername(),
                planType
        );

        // 5. Return response
        return new AuthenticationResponse(
                jwt,
                userDetails.getUsername(),
                planType.name()
        );
    }
}
