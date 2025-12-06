// src/app/services/news.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface NewsArticle {
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    private readonly baseUrl = 'https://newsapi.org/v2';
    // simple in memory cache keyed by country and pageSize
    private cache = new Map<string, Observable<NewsArticle[]>>();

    constructor(private http: HttpClient) { }

    fetchTopHeadlines(country = 'us', pageSize = 10): Observable<NewsArticle[]> {
        const key = `${country}_${pageSize}`;
        const cached$ = this.cache.get(key);
        if (cached$) {
            return cached$;
        }

        const params = new HttpParams()
            .set('country', country)
            .set('pageSize', String(pageSize))
            .set('apiKey', environment.newsApiKey);

        const request$ = this.http
            .get<NewsApiResponse>(`${this.baseUrl}/top-headlines`, { params })
            .pipe(
                map(response => response.articles || []),
                catchError(() => of([])),
                shareReplay({ bufferSize: 1, refCount: true })
            );

        // store the shared observable in cache
        this.cache.set(key, request$);
        return request$;
    }

    // call this when you need to force a fresh fetch
    refreshTopHeadlines(country = 'us', pageSize = 10): Observable<NewsArticle[]> {
        const key = `${country}_${pageSize}`;
        this.cache.delete(key);
        return this.fetchTopHeadlines(country, pageSize);
    }
}
