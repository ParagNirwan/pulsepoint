package com.news.pulsepoint.service;

import com.news.pulsepoint.entity.User;
import com.news.pulsepoint.repository.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.stereotype.Service;
import com.stripe.model.Event;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;


@Service
public class SubscriptionService {

    private final UserRepository userRepository;

    public SubscriptionService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Session createCheckoutSession(User user, String priceId) throws StripeException {

        String customerId = user.getStripeCustomerId();

        if (customerId == null) {
            Customer customer = Customer.create(
                    CustomerCreateParams.builder()
                            .setEmail(user.getEmail())
                            .build()
            );

            customerId = customer.getId();
            user.setStripeCustomerId(customerId);
            userRepository.save(user);
        }

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                        .setCustomer(customerId)
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setPrice(priceId)
                                        .setQuantity(1L)
                                        .build()
                        )
                        .setSuccessUrl("http://localhost:4200/subscription-success")
                        .setCancelUrl("http://localhost:4200/subscription-cancel")
                        .build();

        return Session.create(params);
    }

    public void handleCheckoutCompleted(Event event) {

        Session session = (Session) event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow(() -> new RuntimeException("Session not found"));

        String customerId = session.getCustomer();
        String subscriptionId = session.getSubscription();

        User user = userRepository.findByStripeCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStripeSubscriptionId(subscriptionId);
        user.setSubscriptionStatus("ACTIVE");
        userRepository.save(user);
    }

    public void handleSubscriptionDeleted(Event event) {

        Subscription subscription = (Subscription) event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        userRepository.findByStripeSubscriptionId(subscription.getId())
                .ifPresent(user -> {
                    user.setStripeSubscriptionId(null);
                    user.setSubscriptionStatus("CANCELED");
                    userRepository.save(user);
                });
    }


}
