import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { Bookmark } from './bookmark.model';
import { BookmarkService } from './bookmark.service';
import { BookmarksCard } from '../../components/bookmark-card/bookmark-card';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule, BookmarksCard],
  templateUrl: './bookmarks.html',
  styleUrls: ['./bookmarks.css']
})
export class Bookmarks {
  bookmarks$: Observable<Bookmark[]>;

  constructor(private bookmarkService: BookmarkService) {
    // create the shared observable
    this.bookmarks$ = this.bookmarkService.getBookmarks().pipe(
      tap(data => console.log('Bookmarks loaded', data)),
      shareReplay(1)
    );
  }
}
