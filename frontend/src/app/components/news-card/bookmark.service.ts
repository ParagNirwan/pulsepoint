// src/app/services/bookmark.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookmarkRequest {
    //userId: string;
    title: string;
    url: string;
    source: string;
}

@Injectable({ providedIn: 'root' })
export class BookmarkService {
    private base = 'http://localhost:8080/bookmark';

    constructor(private http: HttpClient) { }

    saveBookmark(payload: BookmarkRequest): Observable<void> {
        const token = localStorage.getItem('jwtToken'); // set on login
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        // backend returns no body -> use void and no responseType
        return this.http.post<void>(`${this.base}/save`, payload, { headers });
    }
    // bookmark.service.ts

    deleteBookmark(title: string) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { title };
        // HttpClient.delete supports a body field in the options object
        return this.http.delete<void>(`${this.base}/remove`, { headers, body });
    }




}
