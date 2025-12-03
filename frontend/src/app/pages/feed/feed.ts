// src/app/pages/feed/feed.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { NewsService, NewsArticle } from '../../services/news.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { catchError, Observable, of, shareReplay } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NewsCardComponent } from '../../components/news-card/news-card';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterModule,
    MatSidenavModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    NewsCardComponent],
  templateUrl: './feed.html',
  styleUrls: ['./feed.css']
})
export class Feed implements OnInit {
  username: string | null = null;

  articles$: Observable<NewsArticle[]>;

  constructor(private newsService: NewsService,
    private breakpoint: BreakpointObserver,
    private authService: AuthService) {
    this.articles$ = this.newsService.fetchTopHeadlines('us', 10).pipe(
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  async ngOnInit() {
    this.username = await this.authService.getUsername();
  }
}
