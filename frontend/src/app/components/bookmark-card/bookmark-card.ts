import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BookmarkService } from '../../pages/bookmarks/bookmark.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { removeBookmark, saveBookmark } from '../../shared/bookmark.helper';

@Component({
  selector: 'bookmark-card',
  templateUrl: 'bookmark-card.html',
  imports: [MatCardModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['bookmark-card.css']
})
export class BookmarksCard {
  @Input() title = '';
  @Input() url = '';
  @Input() source: string | null | undefined = null;
  @Input() saved = true;

  constructor(
    private bookmarkService: BookmarkService,
    private snackBar: MatSnackBar
  ) { }

  openArticle() {
    window.open(this.url, '_blank');
  }

  toggleSave() {
    this.saved = !this.saved;
    const title = this.title;

    if (this.saved) {
      // user just toggled to saved, so save it
      saveBookmark(
        {
          title: this.title,
          url: this.url,
          source: this.source ?? 'unknown' // ensure a string per BookmarkRequest
        },
        this.bookmarkService,
        this.snackBar,
        () => { /* on conflict: keep saved true */ },
        () => { this.saved = false; } // revert on error
      );
    } else {
      // user just toggled to not saved, so remove it
      removeBookmark(title, this.bookmarkService, this.snackBar, () => {
        this.saved = true; // revert on error
      });
    }
  }
}
