package com.news.pulsepoint.repository;

import com.news.pulsepoint.entity.Subscription;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SubscriptionRepository extends MongoRepository<Subscription, ObjectId> {
    Optional<Subscription> findByUserId(ObjectId userID);
}
