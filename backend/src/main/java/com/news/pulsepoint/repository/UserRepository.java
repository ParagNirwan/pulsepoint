package com.news.pulsepoint.repository;

import com.news.pulsepoint.entity.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, ObjectId> {
    Optional<User> findByUsername(String username);
    void deleteByUsername(String username);
    Optional<User> findByEmail(String email);
}
