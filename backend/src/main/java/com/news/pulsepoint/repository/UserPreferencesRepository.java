package com.news.pulsepoint.repository;

import com.news.pulsepoint.entity.UserPreferences;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPreferencesRepository extends MongoRepository<UserPreferences, ObjectId> {

    Optional<UserPreferences> findByUserId(ObjectId userId);

    boolean existsByUserId(ObjectId userId);
}
