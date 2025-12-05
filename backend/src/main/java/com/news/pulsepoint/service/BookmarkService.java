package com.news.pulsepoint.service;

import com.news.pulsepoint.entity.Bookmark;
import com.news.pulsepoint.repository.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BookmarkService {
    @Autowired
    private BookmarkRepository bookmarkRepository;

    public void saveBookmark(Bookmark bookmark ){
        bookmarkRepository.save(bookmark);
    }

}
