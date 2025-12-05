package com.news.pulsepoint.repository;

import com.news.pulsepoint.entity.Bookmark;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;


public interface BookmarkRepository extends MongoRepository<Bookmark, ObjectId> {
    Page<Bookmark> findAllByUserId(ObjectId userId, Pageable pageable);
    void deleteById(ObjectId id);
    long deleteByTitleAndUserId(String title, ObjectId userId);
    Optional<Bookmark> findByUserIdAndUrl(ObjectId userId, String url);
}
