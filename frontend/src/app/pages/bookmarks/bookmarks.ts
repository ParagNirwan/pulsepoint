import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { tap, shareReplay, map } from 'rxjs/operators';
import { Bookmark } from './bookmark.model';
import { BookmarkService } from './bookmark.service';
import { BookmarksCard } from '../../components/bookmark-card/bookmark-card';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [
    CommonModule,
    BookmarksCard,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule
  ],
  templateUrl: './bookmarks.html',
  styleUrls: ['./bookmarks.css']
})
export class Bookmarks {
  // raw list from backend
  bookmarks$: Observable<Bookmark[]>;

  // sort direction state: default newest first
  private sortDirectionSubject = new BehaviorSubject<'asc' | 'desc'>('desc');

  // sorted list for template
  sortedBookmarks$: Observable<Bookmark[]>;

  constructor(private bookmarkService: BookmarkService) {
    this.bookmarks$ = this.bookmarkService.getBookmarksList().pipe(
      tap(),
      shareReplay(1)
    );

    this.sortedBookmarks$ = combineLatest([
      this.bookmarks$,
      this.sortDirectionSubject
    ]).pipe(
      map(([bookmarks, direction]) => {
        // safety: if bookmarks is null or undefined, use empty array
        const list = bookmarks ?? [];

        console.log('Raw bookmarks for sorting', list);

        const copy = [...list];

        copy.sort((a, b) => {
          // guard against missing id or date
          if (!a?.id || !b?.id) {
            console.warn('Bookmark without id field', a, b);
          }

          const aTime = a?.id?.date
            ? new Date(a.id.date).getTime()
            : 0;

          const bTime = b?.id?.date
            ? new Date(b.id.date).getTime()
            : 0;

          return direction === 'asc'
            ? aTime - bTime
            : bTime - aTime;
        });

        console.log('Sorted direction', direction, copy);

        return copy;
      })
    );
  }

  onSortChange(value: string) {

    if (value === 'dateAsc') {
      this.sortDirectionSubject.next('asc');
    } else if (value === 'dateDesc') {
      this.sortDirectionSubject.next('desc');
    }
  }
}
