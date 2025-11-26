// src/app/components/sidenav/sidenav.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewsService, NewsArticle } from '../../services/news.service';
import { NewsCardComponent } from '../news-card/news-card';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatProgressSpinnerModule,
    NewsCardComponent
  ],
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.css']
})
export class SidenavComponent {
  articles$: Observable<NewsArticle[]>;

  constructor(private newsService: NewsService) {
    this.articles$ = this.newsService.fetchTopHeadlines('us', 10).pipe(
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
