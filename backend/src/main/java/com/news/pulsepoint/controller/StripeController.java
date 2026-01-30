package com.news.pulsepoint.controller;

import com.news.pulsepoint.entity.User;
import com.news.pulsepoint.repository.UserRepository;
import com.news.pulsepoint.service.SubscriptionService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    public StripeController(SubscriptionService subscriptionService,
                            UserRepository userRepository) {
        this.subscriptionService = subscriptionService;
        this.userRepository = userRepository;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> payload
    ) throws StripeException {

        String identifier = userDetails.getUsername();

        User user = userRepository
                .findByUsernameOrEmail(identifier, identifier)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String priceId = payload.get("priceId");

        Session session = subscriptionService.createCheckoutSession(user, priceId);

        return ResponseEntity.ok(Map.of("url", session.getUrl()));

    }
}
