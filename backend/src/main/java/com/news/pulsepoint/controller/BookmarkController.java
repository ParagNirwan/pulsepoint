package com.news.pulsepoint.controller;
import com.news.pulsepoint.dto.DeleteBookmarkRequest;
import com.news.pulsepoint.dto.SaveBookmarkRequest;
import com.news.pulsepoint.entity.Bookmark;
import com.news.pulsepoint.service.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/bookmark")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;



    @PostMapping("/save")
    public ResponseEntity<Void> saveBookmark(
            @RequestBody SaveBookmarkRequest req,
            Authentication authentication) {
      bookmarkService.saveBookmark(req, authentication);
      return new ResponseEntity<>(HttpStatus.CREATED);
    }


    @DeleteMapping("/remove")
    public ResponseEntity<Void> deleteByTitleAndUserId(@RequestBody DeleteBookmarkRequest req, Authentication authentication) {
       return bookmarkService.deleteBookmark(req,authentication);
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<Bookmark>> getAllBookmarks(Authentication authentication) {
       return ResponseEntity.ok(bookmarkService.findAllBookmarks(authentication));
    }

}
