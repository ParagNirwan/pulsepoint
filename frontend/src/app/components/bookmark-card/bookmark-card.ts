import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BookmarkService } from '../../pages/bookmarks/bookmark.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

    this.bookmarkService.deleteBookmark(title).subscribe({
      next: () => {
        this.snackBar.open(`Removed bookmark: ${title}`, '', { duration: 2000 });
      },
      error: (err: any) => {
        console.error('Error removing bookmark', err);
        this.snackBar.open(`Failed to remove bookmark: ${title}`, '', { duration: 2000 });
        this.saved = true; // revert state on error
      }
    });

  }
}
