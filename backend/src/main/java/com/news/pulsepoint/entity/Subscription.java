package com.news.pulsepoint.entity;
import com.news.pulsepoint.entity.enums.PlanType;
import com.news.pulsepoint.entity.enums.SubscriptionStatus;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "subscription")
@Data
public class Subscription {
    @Id
    private ObjectId id;

    @Indexed(unique = true)
    private ObjectId userId;

    private String stripeCustomerId;
    private String stripeSubscriptionId;

    private PlanType planType;
    private SubscriptionStatus subscriptionStatus;

    private Instant currentPeriodEnd;

}
