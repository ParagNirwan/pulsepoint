// src/app/services/bookmark.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Bookmark } from './bookmark.model';

export interface BookmarkRequest {
    title: string;
    url: string;
    source: string;
}

@Injectable({ providedIn: 'root' })
export class BookmarkService {
    private base = 'http://localhost:8080/bookmark';

    // internal map keyed by title to make lookups cheap
    private bookmarksSubject = new BehaviorSubject<Map<string, Bookmark>>(new Map());
    public bookmarks$ = this.bookmarksSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadBookmarks().subscribe({
            next: () => { /* initial load done */ },
            error: () => { /* ignore initial load error */ }
        });
    }

    // load from backend and populate the map
    loadBookmarks(): Observable<Bookmark[]> {
        const token = localStorage.getItem('jwtToken');
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return this.http.get<Bookmark[]>(`${this.base}/getAll`, { headers }).pipe(
            catchError(() => of([])),
            tap(list => {
                const m = new Map<string, Bookmark>();
                for (const b of list || []) {
                    if (b.title) {
                        m.set(b.title, b);
                    }
                }
                this.bookmarksSubject.next(m);
            })
        );
    }

    // save and update cache on success
    saveBookmark(payload: BookmarkRequest): Observable<void> {
        const token = localStorage.getItem('jwtToken');
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return this.http.post<void>(`${this.base}/save`, payload, { headers }).pipe(
            tap(() => {
                // optimistic update only after success
                const current = new Map(this.bookmarksSubject.value);
                const newBookmark: Bookmark = {
                    id: undefined as any,
                    title: payload.title,
                    url: payload.url,
                    source: payload.source
                } as unknown as Bookmark;
                current.set(payload.title, newBookmark);
                this.bookmarksSubject.next(current);
            })
        );
    }

    // delete and update cache on success
    deleteBookmark(title: string): Observable<void> {
        const token = localStorage.getItem('jwtToken');
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        const body = { title };

        return this.http.delete<void>(`${this.base}/remove`, { headers, body }).pipe(
            tap(() => {
                const current = new Map(this.bookmarksSubject.value);
                current.delete(title);
                this.bookmarksSubject.next(current);
            })
        );
    }

    // helper that returns whether a given title is bookmarked as an observable
    isBookmarked(title: string | undefined): Observable<boolean> {
        if (!title) {
            return of(false);
        }
        return this.bookmarks$.pipe(map(m => m.has(title)));
    }

    // expose bookmarks as array if needed
    getBookmarksList(): Observable<Bookmark[]> {
        return this.bookmarks$.pipe(map(m => Array.from(m.values())));
    }
}
