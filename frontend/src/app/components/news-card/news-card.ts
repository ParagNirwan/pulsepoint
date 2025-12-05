import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NewsArticle } from '../../services/news.service';
import { BookmarkService, BookmarkRequest } from '../../pages/bookmarks/bookmark.service';
import { HttpClientModule } from '@angular/common/http';
import { removeBookmark, saveBookmark } from '../../shared/bookmark.helper';
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
export class NewsCardComponent {
  @Input() article: NewsArticle | null = null;

  liked = false;
  saved = false;

  constructor(
    private bookmarkService: BookmarkService,
    private snackBar: MatSnackBar
  ) { }

  openArticle() {
    if (this.article && this.article.url) {
      window.open(this.article.url, '_blank');
    }
  }

  dislike() {
    // your existing logic
  }

  toggleSave() {
    this.saved = !this.saved;

    if (!this.saved) {
      // user is un-saving the article
      if (!this.article || !this.article.title) {
        this.snackBar.open('No article to remove', '', { duration: 2000 });
        return;
      }

      const titleToRemove = this.article.title;

      removeBookmark(titleToRemove, this.bookmarkService, this.snackBar, () => {
        this.saved = true;
      });

      return;
    }

    // saving flow
    if (!this.article) {
      this.snackBar.open('No article to save', '', { duration: 2000 });
      this.saved = false;
      return;
    }

    let sourceValue = 'unknown';
    const src = this.article.source;
    if (typeof src === 'string') sourceValue = src;
    else if (src && typeof src === 'object') sourceValue = src.name ?? 'unknown';

    const payload: BookmarkRequest = {
      title: this.article.title || 'Untitled',
      url: this.article.url || '',
      source: sourceValue
    };

    saveBookmark(
      payload,
      this.bookmarkService,
      this.snackBar,
      () => {
        // on conflict, keep saved true
        this.saved = true;
      },
      () => {
        // on error, revert saved flag
        this.saved = false;
      }
    );
  }
}
