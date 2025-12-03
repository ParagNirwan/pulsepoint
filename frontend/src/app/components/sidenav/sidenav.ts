import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Router } from '@angular/router';
import { NewsService, NewsArticle } from '../../services/news.service';

import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  badge?: boolean;
  action?: () => void;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.css']
})
export class SidenavComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  articles$: Observable<NewsArticle[]>;
  collapsed = false;
  isSmallScreen = false;
  sidenavOpened = true;

  menuItems: MenuItem[] = [
    { label: 'News Feed', icon: 'article', route: 'feed' },
    { label: 'Bookmarks', icon: 'bookmark', route: 'bookmarks' },
    { label: 'Liked News', icon: 'thumb_up', route: 'liked-news' },
    { label: 'Settings', icon: 'settings', route: 'user-settings' },
    { label: 'Log Out', icon: 'power_settings_new', action: () => this.logout() }
  ];

  constructor(
    private newsService: NewsService,
    private breakpoint: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    this.articles$ = this.newsService.fetchTopHeadlines('us', 10).pipe(
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.breakpoint.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe(result => {
      this.isSmallScreen = result.matches;

      if (this.isSmallScreen) {
        // overlay behavior on small screens; start closed
        this.sidenavOpened = false;
        this.collapsed = false;
      } else {
        // side panel on larger screens
        this.sidenavOpened = true;
      }

      // sync the actual MatSidenav if available
      if (this.sidenav) {
        if (this.isSmallScreen) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // ensure initial state after view init
    if (this.sidenav) {
      if (this.isSmallScreen) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    }
  }

  toggleCollapsed(): void {
    if (this.isSmallScreen && this.sidenav) {
      // on small screens toggle overlay drawer open/close
      this.sidenav.toggle();
      return;
    }

    // for larger screens toggle the collapsed flag and keep sidenav open so content margin updates
    this.collapsed = !this.collapsed;

    if (this.sidenav && !this.isSmallScreen) {
      this.sidenav.open();
      setTimeout(() => { }, 0);
    }
  }

  openSidenav(): void {
    if (this.sidenav) {
      this.sidenav.open();
    }
  }

  onNavItemClick(item: MenuItem): void {
    // close overlay drawer on small screens
    if (this.isSmallScreen && this.sidenav) {
      this.sidenav.close();
    }

    // run action if present
    if (item.action) {
      item.action();
    }
    // otherwise routerLink will handle navigation on anchor click
  }

  trackByLabel(index: number, item: MenuItem): string {
    return item.label;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
