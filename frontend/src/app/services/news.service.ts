import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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

    constructor(private http: HttpClient) { }

    fetchTopHeadlines(country = 'us', pageSize = 10): Observable<NewsArticle[]> {
        const key = environment.newsApiKey;
        const params = new HttpParams()
            .set('country', country)
            .set('pageSize', String(pageSize))
            .set('apiKey', key);

        return this.http
            .get<NewsApiResponse>(`${this.baseUrl}/top-headlines`, { params })
            .pipe(map(response => response.articles || []));
    }
}
