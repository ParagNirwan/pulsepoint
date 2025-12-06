import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NewsArticle } from '../../services/news.service';
import { BookmarkService, BookmarkRequest } from '../../pages/bookmarks/bookmark.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'news-card',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './news-card.html',
  styleUrls: ['./news-card.css']
})
export class NewsCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() article: NewsArticle | null = null;

  liked = false;
  saved = false;

  private bookmarkSub: Subscription | null = null;

  constructor(
    private bookmarkService: BookmarkService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // nothing here, subscription happens on input changes
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['article']) {
      this.bookmarkSub?.unsubscribe();
      const title = this.article?.title;
      if (title) {
        this.bookmarkSub = this.bookmarkService.isBookmarked(title).subscribe({
          next: v => this.saved = v,
          error: () => this.saved = false
        });
      } else {
        this.saved = false;
      }
    }
  }

  ngOnDestroy() {
    this.bookmarkSub?.unsubscribe();
  }

  openArticle() {
    if (this.article && this.article.url) {
      window.open(this.article.url, '_blank');
    }
  }

  dislike() {
    // keep your existing logic
  }

  toggleSave() {
    const title = this.article?.title;
    if (!title) {
      this.snackBar.open('No article selected', '', { duration: 2000 });
      return;
    }

    if (this.saved) {
      // remove bookmark
      this.bookmarkService.deleteBookmark(title).subscribe({
        next: () => {
          this.snackBar.open('Bookmark removed', '', { duration: 1500 });
          // bookmarkService updates cache and saved will update via subscription
        },
        error: () => {
          this.snackBar.open('Failed to remove bookmark', '', { duration: 2000 });
        }
      });
      return;
    }

    // save bookmark
    const src = this.article?.source;
    let sourceValue = 'unknown';
    if (typeof src === 'string') sourceValue = src;
    else if (src && typeof src === 'object') sourceValue = src.name ?? 'unknown';

    const payload: BookmarkRequest = {
      title: title || 'Untitled',
      url: this.article?.url || '',
      source: sourceValue
    };

    this.bookmarkService.saveBookmark(payload).subscribe({
      next: () => {
        this.snackBar.open('Saved to bookmarks', '', { duration: 1500 });
        // bookmarkService updates cache and saved will update via subscription
      },
      error: () => {
        this.snackBar.open('Failed to save bookmark', '', { duration: 2000 });
      }
    });
  }
}
