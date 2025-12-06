package com.news.pulsepoint.controller;

import com.news.pulsepoint.dto.DeleteBookmarkRequest;
import com.news.pulsepoint.dto.SaveBookmarkRequest;
import com.news.pulsepoint.entity.Bookmark;
import com.news.pulsepoint.entity.User;
import com.news.pulsepoint.repository.BookmarkRepository;
import com.news.pulsepoint.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bookmark")
public class BookmarkController {

    @Autowired
    private BookmarkRepository bookmarkRepository;
    @Autowired
    private UserRepository userRepository;



    @PostMapping("/save")
    public ResponseEntity<Void> saveBookmark(
            @RequestBody SaveBookmarkRequest req,
            Authentication authentication) {

        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            ObjectId userId = userOpt.get().getId();

            // quick application level check
            Optional<Bookmark> existing = bookmarkRepository.findByUserIdAndUrl(userId, req.getUrl());
            if (existing.isPresent()) {
                // already bookmarked by this user
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }

            Bookmark bookmark = new Bookmark();
            bookmark.setUserId(userId);
            bookmark.setTitle(req.getTitle());
            bookmark.setUrl(req.getUrl());
            bookmark.setSource(req.getSource());

            try {
                bookmarkRepository.save(bookmark);
                return ResponseEntity.noContent().build();
            } catch (DuplicateKeyException ex) {
                // another request saved at the same time
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @DeleteMapping("/remove")
    public ResponseEntity<Void> deleteByTitleAndUserId(@RequestBody DeleteBookmarkRequest req, Authentication authentication) {
        System.out.println("SecurityContext auth: " + SecurityContextHolder.getContext().getAuthentication());
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Optional<User> user = userRepository.findByUsername(authentication.getName());
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }


            long deleted = bookmarkRepository.deleteByTitleAndUserId(req.getTitle(), user.get().getId());

            if (deleted == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            // invalid ObjectId string
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<Bookmark>> getAllBookmarks() {
        return ResponseEntity.status(HttpStatus.OK).body(bookmarkRepository.findAll());
    }

}
