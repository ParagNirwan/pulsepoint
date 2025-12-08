package com.news.pulsepoint.service;

import com.news.pulsepoint.dto.DeleteBookmarkRequest;
import com.news.pulsepoint.dto.SaveBookmarkRequest;
import com.news.pulsepoint.entity.Bookmark;
import com.news.pulsepoint.entity.User;
import com.news.pulsepoint.repository.BookmarkRepository;
import com.news.pulsepoint.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class BookmarkService {
    @Autowired
    private BookmarkRepository bookmarkRepository;
    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> saveBookmark(SaveBookmarkRequest bookmarkRequest, Authentication authentication ) {
    ObjectId userId = getUserId(authentication);

     // quick application level check
            Optional<Bookmark> existing = bookmarkRepository.findByUserIdAndUrl(userId, bookmarkRequest.getUrl());
            if (existing.isPresent()) {
                // already bookmarked by this user
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }

            Bookmark bookmark = new Bookmark();
            bookmark.setUserId(userId);
            bookmark.setTitle(bookmarkRequest.getTitle());
            bookmark.setUrl(bookmarkRequest.getUrl());
            bookmark.setSource(bookmarkRequest.getSource());
            try {
                bookmarkRepository.save(bookmark);
                return ResponseEntity.noContent().build();
            } catch (DuplicateKeyException ex) {
                // another request saved at the same time
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }

    }



    //Delete Bookmark of a User
    public ResponseEntity<Void> deleteBookmark(DeleteBookmarkRequest deleteBookmarkRequest, Authentication authentication) {
        ObjectId userId = getUserId(authentication);
        long deleted = bookmarkRepository.deleteByTitleAndUserId(deleteBookmarkRequest.getTitle(), userId);
        if (deleted == 0) throw new RuntimeException("Delete Bookmark failed");
        return ResponseEntity.ok().build();
    }



    //Find All Bookmarks of a User
    public List<Bookmark> findAllBookmarks(Authentication authentication){
        ObjectId userId = getUserId(authentication);
        if(userId == null){
            return null;
        }
        Pageable pageable = PageRequest.of(0, 10);
        return bookmarkRepository.findAllByUserId(userId, pageable).getContent();
    }


    //Get User Id
    private ObjectId getUserId(Authentication authentication) {
    if (authentication == null) {
        throw new RuntimeException("Authentication is null");
    }
    String username = authentication.getName();

    return userRepository.findByUsername(username)
            .map(User::getId)
            .orElseThrow(() -> new RuntimeException("User not found for username: " + username));
}


}
